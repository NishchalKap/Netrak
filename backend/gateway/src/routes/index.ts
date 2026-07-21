import { Router } from 'express';
import authRoutes from './auth.routes';
import caseRoutes from './case.routes';
import notificationRoutes from './notification.routes';
import threatRoutes from './threat.routes';
import healthRoutes from './health.routes';
import storageRoutes from './storage.routes';
import aiRoutes from '../ai/routes/ai.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/notifications', notificationRoutes);
router.use('/threats', threatRoutes);
router.use('/storage', storageRoutes);
router.use('/ai', aiRoutes);

export default router;
