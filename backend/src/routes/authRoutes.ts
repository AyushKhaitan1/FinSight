import { Router } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    
    res.status(201).json({ success: true, data: { id: user._id, email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) { // Check passwordHash exists (Google users might not have one)
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'supersecretjwtkey_replace_in_production', 
      { expiresIn: '7d' }
    );
    res.json({ success: true, data: { token } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Google Authentication Route
router.post('/google', async (req, res): Promise<void> => {
  try {
    const { email, name, googleId } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if they don't exist
      user = await User.create({ 
        email, 
        name, 
        passwordHash: undefined // Google users don't have a password by default
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'supersecretjwtkey_replace_in_production', 
      { expiresIn: '7d' }
    );
    
    res.json({ success: true, data: { token } });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

export default router;
