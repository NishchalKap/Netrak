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

// Health Check
app.get('/health', (req, res) => {
  sendSuccess(res, { status: 'UP' }, 'Service is healthy');
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
