import { Router } from 'express';
import { DashboardController } from '../controllers/DebtController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/stats', DashboardController.getDashboardStats);

export default router;
