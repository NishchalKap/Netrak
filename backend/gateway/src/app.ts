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
import { sendError, sendSuccess } from './common/response';
import { AppError } from './common/AppError';
import { logger } from './common/logger';

const app: Application = express();
const authAttempts = new Map<string, { count: number; resetAt: number }>();
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_REQUESTS = 30;

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
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
morgan.token('request-id', (_req, res) => String(res.getHeader('X-Request-Id') ?? '-'));
morgan.token('safe-path', (req) => (req as Request).path);
app.use(morgan(':method :safe-path :status :response-time ms request_id=:request-id', {
  skip: (req) => req.path === '/health' || req.path === '/api/health',
  stream: { write: (message) => logger.info(message.trim()) },
}));

app.use('/api/auth', (req, res, next) => {
  if (req.method !== 'POST') return next();
  const now = Date.now();
  const key = `${req.ip}:${req.path}`;
  const current = authAttempts.get(key);
  const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + AUTH_WINDOW_MS } : current;
  bucket.count += 1;
  authAttempts.set(key, bucket);
  if (authAttempts.size > 10000) {
    for (const [candidate, value] of authAttempts) if (value.resetAt <= now) authAttempts.delete(candidate);
  }
  res.setHeader('RateLimit-Limit', AUTH_MAX_REQUESTS);
  res.setHeader('RateLimit-Remaining', Math.max(0, AUTH_MAX_REQUESTS - bucket.count));
  res.setHeader('RateLimit-Reset', Math.ceil(bucket.resetAt / 1000));
  if (bucket.count > AUTH_MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
    return sendError(res, 'Too many authentication attempts. Try again later.', 429);
  }
  return next();
});

if (env.API_DOCS_ENABLED) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));
}

app.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'UP' }, 'Service is healthy');
});

app.use('/api', apiRoutes);
app.use((_req, _res, next) => next(new AppError('Route not found', 404)));
app.use(errorHandler);

export default app;
