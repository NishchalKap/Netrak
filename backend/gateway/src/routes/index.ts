import { Router } from 'express';
import authRoutes from './auth.routes';
import caseRoutes from './case.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/notifications', notificationRoutes);

export default router;
