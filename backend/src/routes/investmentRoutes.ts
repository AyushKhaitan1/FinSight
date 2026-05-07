import { Router } from 'express';
import { Investment } from '../models/Investment';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const investments = await Investment.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: investments });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const investment = await Investment.create({ ...req.body, userId: req.user?.userId });
    res.status(201).json({ success: true, data: investment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res): Promise<void> => {
  try {
    const investment = await Investment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      req.body,
      { new: true }
    );
    if (!investment) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }
    res.json({ success: true, data: investment });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res): Promise<void> => {
  try {
    const investment = await Investment.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!investment) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
