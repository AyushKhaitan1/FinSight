import { Router } from 'express';
import { SIP } from '../models/SIP';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
router.use(authMiddleware);

router.get(
  '/',
  asyncHandler<AuthRequest>(async (req, res) => {
    const sips = await SIP.find({ userId: req.user?.userId });
    res.json({ success: true, data: sips });
  }),
);

router.post(
  '/',
  asyncHandler<AuthRequest>(async (req, res) => {
    const sip = await SIP.create({ ...req.body, userId: req.user?.userId });
    res.status(201).json({ success: true, data: sip });
  }),
);

router.delete(
  '/:id',
  asyncHandler<AuthRequest>(async (req, res) => {
    const sip = await SIP.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    res.json({ success: true, data: {} });
  }),
);

export default router;
