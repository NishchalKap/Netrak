import { Router } from 'express';
import { prisma } from '../database/prisma';
import { logger } from '../common/logger';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API health check
 *     description: Returns the current API service health status for readiness checks and monitoring at `/api/health`.
 *     tags: [Health]
 *     security: []
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
router.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'success',
      message: 'Service is ready',
      data: { status: 'UP', database: 'UP' },
    });
  } catch (error) {
    logger.warn('Readiness check failed', { errorType: error instanceof Error ? error.name : 'UnknownDatabaseError' });
    res.status(503).json({
      status: 'error',
      message: 'Service is not ready',
      data: { status: 'DEGRADED', database: 'DOWN' },
    });
  }
});

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     description: Confirms that the gateway process can accept HTTP requests without requiring a database connection.
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Gateway process is live
 */
router.get('/live', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'Service is live', data: { status: 'UP' } });
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     description: Alias for the database-backed readiness check.
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Gateway and database are ready
 *       503:
 *         description: Gateway cannot reach its database
 */
router.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'success', message: 'Service is ready', data: { status: 'UP', database: 'UP' } });
  } catch (error) {
    logger.warn('Readiness check failed', { errorType: error instanceof Error ? error.name : 'UnknownDatabaseError' });
    res.status(503).json({ status: 'error', message: 'Service is not ready', data: { status: 'DEGRADED', database: 'DOWN' } });
  }
});

export default router;
