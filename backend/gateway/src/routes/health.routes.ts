import { Router } from 'express';

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
router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Service is healthy',
    data: { status: 'UP' },
  });
});

export default router;
