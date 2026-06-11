import { Router } from 'express';
import { DebtController } from '../controllers/DebtController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', DebtController.create);
router.get('/', DebtController.getAll);
router.get('/active', DebtController.getActiveDebts);
router.get('/:id', DebtController.getById);
router.put('/:id', DebtController.update);
router.delete('/:id', DebtController.delete);

export default router;
