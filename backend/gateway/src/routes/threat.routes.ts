import { Router } from 'express';
import { ThreatController } from '../controllers/threat.controller';

const router = Router();
const threatController = new ThreatController();

/**
 * @swagger
 * /threats:
 *   get:
 *     summary: Get all threats
 *     description: Retrieves the complete list of active fraud threats and alerts seeded in the repository.
 *     tags: [Threats]
 *     security: []
 *     responses:
 *       200:
 *         description: List of threats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreatListResponse'
 */
router.get('/', threatController.getThreats);

/**
 * @swagger
 * /threats/{id}:
 *   get:
 *     summary: Get threat by ID
 *     description: Retrieves detailed cyber fraud indicator metrics for a single threat record.
 *     tags: [Threats]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique UUID identifier for the threat advisory
 *     responses:
 *       200:
 *         description: Threat details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreatResponse'
 *       404:
 *         description: Threat not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:id', threatController.getThreatById);

export default router;
