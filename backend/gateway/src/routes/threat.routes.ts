import { Router } from 'express';
import { ThreatController } from '../controllers/threat.controller';

const router = Router();
const threatController = new ThreatController();

/**
 * @swagger
 * /threats:
 *   get:
 *     summary: Get all threats
 *     tags: [Threats]
 *     responses:
 *       200:
 *         description: List of threats
 */
router.get('/', threatController.getThreats);

/**
 * @swagger
 * /threats/{id}:
 *   get:
 *     summary: Get threat by id
 *     tags: [Threats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Threat detail
 */
router.get('/:id', threatController.getThreatById);

export default router;
