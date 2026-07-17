import { Router } from 'express';
import { StorageController } from '../controllers/storage.controller';
import { createUploadUrlSchema } from '../dto/storage.dto';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();
const storageController = new StorageController();

/**
 * @swagger
 * /storage/upload-url:
 *   post:
 *     summary: Create a Supabase signed upload URL
 *     description: Creates a short-lived upload target scoped to the authenticated user's object prefix. The service-role key never leaves the gateway.
 *     tags: [Storage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [kind, objectPath, contentType]
 *             properties:
 *               kind: { type: string, enum: [evidence, image, document] }
 *               objectPath: { type: string, example: "cases/incident-photo.jpg" }
 *               contentType: { type: string, example: "image/jpeg" }
 *     responses:
 *       200:
 *         description: Signed upload target created
 *       401:
 *         description: Authentication is required
 *       503:
 *         description: Storage is not configured
 */
router.post('/upload-url', authenticate, validate(createUploadUrlSchema), storageController.createUploadUrl);

export default router;
