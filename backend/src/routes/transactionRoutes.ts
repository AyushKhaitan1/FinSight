import { Router } from 'express';
import { Transaction } from '../models/Transaction';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  asyncHandler<AuthRequest>(async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user?.userId }).sort({ date: -1 });
    res.json({ success: true, data: transactions });
  }),
);

router.post(
  '/',
  asyncHandler<AuthRequest>(async (req, res) => {
    const transaction = await Transaction.create({ ...req.body, userId: req.user?.userId });
    res.status(201).json({ success: true, data: transaction });
  }),
);

router.put(
  '/:id',
  asyncHandler<AuthRequest>(async (req, res) => {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      req.body,
      { new: true },
    );
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json({ success: true, data: transaction });
  }),
);

router.delete(
  '/:id',
  asyncHandler<AuthRequest>(async (req, res) => {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.userId,
    });
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json({ success: true, data: {} });
  }),
);

export default router;
