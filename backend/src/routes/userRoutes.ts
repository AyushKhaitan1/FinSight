import { Router } from 'express';
import { User } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

// Get user profile - Now at /api/v1/profile/
router.get('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile - Now at POST /api/v1/user-profile/update
router.post('/update', async (req: AuthRequest, res): Promise<void> => {
  try {
    const { name, email, phone, profession, financialGoals } = req.body;
    const userId = req.user?.userId;

    console.log('UPDATING PROFILE v2.1:', userId, { name, email });

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profession) updateData.profession = profession;
    if (financialGoals) updateData.financialGoals = financialGoals;

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
