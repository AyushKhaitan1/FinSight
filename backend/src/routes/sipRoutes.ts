import { Router } from 'express';
import { SIP } from '../models/SIP';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const sips = await SIP.find({ userId: req.user?.userId });
    res.json({ success: true, data: sips });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const sip = await SIP.create({ ...req.body, userId: req.user?.userId });
    res.status(201).json({ success: true, data: sip });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res): Promise<void> => {
  try {
    const sip = await SIP.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
