import { Router } from 'express';
import { Transaction } from '../models/Transaction';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const transactions = await Transaction.find({ userId: req.user?.userId }).sort({ date: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const transaction = await Transaction.create({ ...req.body, userId: req.user?.userId });
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      req.body,
      { new: true }
    );
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
