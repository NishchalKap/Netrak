import crypto from 'crypto';
import express, { Application, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import apiRoutes from './routes';
import { sendSuccess } from './common/response';
import { AppError } from './common/AppError';
import { logger } from './common/logger';
import { createRateLimiter, emailRateLimitKey } from './middleware/rate-limit.middleware';

const app: Application = express();

app.disable('x-powered-by');
if (env.TRUST_PROXY) app.set('trust proxy', 1);

app.use((req, res, next) => {
  const supplied = req.header('x-request-id');
  const requestId = supplied && /^[a-zA-Z0-9_-]{8,128}$/.test(supplied) ? supplied : crypto.randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
});
app.use(helmet());
app.use(cors({
  credentials: false,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Request-Id'],
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new AppError('Origin is not permitted', 403));
  },
}));
app.use('/api', createRateLimiter({ windowMs: 5 * 60 * 1000, maxRequests: 600 }));
app.use(express.json({ limit: '1mb' }));
morgan.token('request-id', (_req, res) => String(res.getHeader('X-Request-Id') ?? '-'));
morgan.token('safe-path', (req) => (req as Request).path);
app.use(morgan(':method :safe-path :status :response-time ms request_id=:request-id', {
  skip: (req) => req.path === '/health' || req.path === '/api/health',
  stream: { write: (message) => logger.info(message.trim()) },
}));

const noStore = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  next();
};
app.use(['/api/auth', '/api/cases', '/api/notifications'], noStore);
app.use('/api/auth/login', createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 10, key: emailRateLimitKey, message: 'Too many sign-in attempts. Try again later.' }));
app.use('/api/auth/register', createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 5, key: emailRateLimitKey, message: 'Too many registration attempts. Try again later.' }));
app.use('/api/auth/forgot-password', createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 5, key: emailRateLimitKey, message: 'Too many recovery requests. Try again later.' }));
app.use('/api/auth/refresh', createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 60, message: 'Too many session refresh attempts. Sign in again.' }));

if (env.API_DOCS_ENABLED) {
  console.log(">>> Swagger enabled:", env.API_DOCS_ENABLED);  
  const documentationCsp = helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  });
  app.use('/api-docs', documentationCsp, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(">>> Mounted /api-docs");
}

app.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'UP' }, 'Service is healthy');
});

// Redirect root to frontend
app.get('/', (_req, res) => {
  const frontendUrl = process.env.NODE_ENV === 'production' 
    ? (process.env.PUBLIC_FRONTEND_URL || 'http://localhost:4173')
    : 'http://localhost:4173';
  res.redirect(frontendUrl);
});

// Handle Supabase email verification redirects (hash-based) by redirecting to frontend with the hash
app.get('*', (req, res, next) => {
  // Check if this looks like a Supabase auth redirect (has hash with access_token)
  // Since we can't access the hash on the server, just redirect to frontend and let it handle it
  if (!req.path.startsWith('/api') && !req.path.startsWith('/api-docs')) {
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.PUBLIC_FRONTEND_URL || 'http://localhost:4173')
      : 'http://localhost:4173';
    // Preserve the full original URL (including hash if any, though server can't see hash)
    // So just redirect to frontend root and let frontend handle any client-side routing
    return res.redirect(frontendUrl);
  }
  next();
});

app.use('/api', apiRoutes);
app.use((_req, _res, next) => next(new AppError('Route not found', 404)));
app.use(errorHandler);

export default app;
