import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { validate, validateQuery } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createNotificationSchema, notificationListQuerySchema } from '../dto/notification.dto';

const router = Router();
const notificationController = new NotificationController();

router.use(authenticate);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications list
 *     description: Retrieves all notifications sent to users in the platform.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 500 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0 }
 *       - in: query
 *         name: read
 *         schema: { type: boolean }
 *         description: Optional read-state filter.
 *     responses:
 *       200:
 *         description: List of notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/', validateQuery(notificationListQuerySchema), notificationController.getNotifications);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create custom notification
 *     description: Sends a system alert notification targeting a specific user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationCreateRequest'
 *     responses:
 *       201:
 *         description: Notification generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationResponse'
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
router.post('/', authorize(['OFFICER', 'ADMIN']), validate(createNotificationSchema), notificationController.createNotification);

export default router;
