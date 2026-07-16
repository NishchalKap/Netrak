import { Router } from 'express';
import { ThreatController } from '../controllers/threat.controller';
import { validateParams } from '../middleware/validate.middleware';
import { idParamSchema } from '../dto/common.dto';

const router = Router();
const threatController = new ThreatController();

/**
 * @swagger
 * /threats:
 *   get:
 *     summary: Get all threats
 *     description: Retrieves advisory records configured in the deployment. Development may optionally load clearly identified reference guidance.
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
 *     description: Retrieves indicators and descriptive metadata for a single configured advisory record.
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
router.get('/:id', validateParams(idParamSchema), threatController.getThreatById);

export default router;
