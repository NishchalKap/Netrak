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
 *     servers:
 *       - url: http://localhost:3000/api
 *         description: Local development gateway
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

export default router;
