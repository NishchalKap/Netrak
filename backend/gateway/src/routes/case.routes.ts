import { Router } from 'express';
import { CaseController } from '../controllers/case.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createCaseSchema, updateCaseSchema } from '../dto/case.dto';

const router = Router();
const caseController = new CaseController();

router.use(authenticate);

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Get all cases
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cases
 */
router.get('/', caseController.getCases);

/**
 * @swagger
 * /cases:
 *   post:
 *     summary: Create a new case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', validate(createCaseSchema), caseController.createCase);

/**
 * @swagger
 * /cases/{id}:
 *   get:
 *     summary: Get case by id
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case detail
 */
router.get('/:id', caseController.getCaseById);

/**
 * @swagger
 * /cases/{id}:
 *   patch:
 *     summary: Update case by id
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated case
 */
router.patch('/:id', validate(updateCaseSchema), caseController.updateCase);

/**
 * @swagger
 * /cases/{id}:
 *   delete:
 *     summary: Delete case
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted successfully
 */
router.delete('/:id', caseController.deleteCase);

export default router;
