import { Router } from 'express';
import { CaseController } from '../controllers/case.controller';
import { EvidenceController } from '../controllers/evidence.controller';
import { validate, validateParams } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createCaseSchema, updateCaseSchema } from '../dto/case.dto';
import { createEvidenceSchema } from '../dto/evidence.dto';
import { idParamSchema } from '../dto/common.dto';

const router = Router();
const caseController = new CaseController();
const evidenceController = new EvidenceController();

router.use(authenticate);

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Get accessible cases
 *     description: Citizens receive only their own cases. Authorized officers and administrators receive the bounded operational case set.
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cases retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/', caseController.getCases);

/**
 * @swagger
 * /cases:
 *   post:
 *     summary: Create a new case
 *     description: Creates a new case reported by a citizen.
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CaseCreateRequest'
 *     responses:
 *       201:
 *         description: Case created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/', validate(createCaseSchema), caseController.createCase);

/**
 * @swagger
 * /cases/{id}:
 *   get:
 *     summary: Get case by ID
 *     description: Retrieves the detailed records, evidence list, and status timeline for a specific case ID.
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique UUID identifier for the case
 *     responses:
 *       200:
 *         description: Case retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:id', validateParams(idParamSchema), caseController.getCaseById);

/**
 * @swagger
 * /cases/{id}:
 *   patch:
 *     summary: Update case status or details
 *     description: Citizens may edit their own open case details but cannot change workflow status. Authorized officers and administrators may transition accessible cases.
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique UUID identifier for the case
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CaseUpdateRequest'
 *     responses:
 *       200:
 *         description: Case updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CaseResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch('/:id', validateParams(idParamSchema), validate(updateCaseSchema), caseController.updateCase);

/**
 * @swagger
 * /cases/{id}:
 *   delete:
 *     summary: Delete case
 *     description: Deletes a case from the system database.
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique UUID identifier for the case
 *     responses:
 *       200:
 *         description: Case deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/:id', validateParams(idParamSchema), caseController.deleteCase);

/**
 * @swagger
 * /cases/{id}/evidence:
 *   post:
 *     summary: Attach case evidence metadata
 *     description: Associates metadata or a reference value with an accessible case ID. This endpoint does not accept file binaries.
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Case UUID identifier to associate evidence with
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EvidenceCreateRequest'
 *     responses:
 *       201:
 *         description: Evidence metadata linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EvidenceResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/:id/evidence', validateParams(idParamSchema), validate(createEvidenceSchema), evidenceController.addEvidence);

export default router;
