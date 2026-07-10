import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/error.middleware';
import apiRoutes from './routes';
import { sendSuccess } from './common/response';

const app: Application = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (req, res) => {
  res.json(swaggerSpec);
});

// Health Check
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Root health check
 *     description: Returns the gateway health status at the root path (`http://localhost:3000/health`) for load balancers and uptime monitors.
 *     tags: [Health]
 *     security: []
 *     servers:
 *       - url: http://localhost:3000
 *         description: Root gateway (non-API paths)
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
app.get('/health', (req, res) => {
  sendSuccess(res, { status: 'UP' }, 'Service is healthy');
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
