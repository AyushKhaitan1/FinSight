import { Router } from 'express';
import { Investment } from '../models/Investment';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  asyncHandler<AuthRequest>(async (req, res) => {
    const investments = await Investment.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: investments });
  }),
);

router.post(
  '/',
  asyncHandler<AuthRequest>(async (req, res) => {
    const investment = await Investment.create({ ...req.body, userId: req.user?.userId });
    res.status(201).json({ success: true, data: investment });
  }),
);

router.put(
  '/:id',
  asyncHandler<AuthRequest>(async (req, res) => {
    const investment = await Investment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      req.body,
      { new: true },
    );
    if (!investment) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }
    res.json({ success: true, data: investment });
  }),
);

router.delete(
  '/:id',
  asyncHandler<AuthRequest>(async (req, res) => {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.userId,
    });
    if (!investment) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }
    res.json({ success: true, data: {} });
  }),
);

export default router;
