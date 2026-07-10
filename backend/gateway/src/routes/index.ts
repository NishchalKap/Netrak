import { Router } from 'express';
import authRoutes from './auth.routes';
import caseRoutes from './case.routes';
import notificationRoutes from './notification.routes';
import threatRoutes from './threat.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/notifications', notificationRoutes);
router.use('/threats', threatRoutes);

export default router;
