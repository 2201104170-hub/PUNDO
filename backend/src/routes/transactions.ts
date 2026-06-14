import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', TransactionController.create);
router.get('/', TransactionController.getAll);
router.get('/range', TransactionController.getByDateRange);
router.get('/:id', TransactionController.getById);
router.put('/:id', TransactionController.update);
router.patch('/:id/payment-status', TransactionController.markAsPaid);
router.delete('/:id', TransactionController.delete);

export default router;
