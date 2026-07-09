import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createNotificationSchema } from '../dto/notification.dto';

const router = Router();
const notificationController = new NotificationController();

router.use(authenticate);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/', notificationController.getNotifications);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - userId
 *             properties:
 *               message:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', validate(createNotificationSchema), notificationController.createNotification);

export default router;
