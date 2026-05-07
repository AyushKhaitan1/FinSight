import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import investmentRoutes from './routes/investmentRoutes';
import aiRoutes from './routes/aiRoutes';
import ocrRoutes from './routes/ocrRoutes';
import sipRoutes from './routes/sipRoutes';
import userRoutes from './routes/userRoutes';

import cron from 'node-cron';
import { SIP } from './models/SIP';
import { Transaction } from './models/Transaction';
import { Investment } from './models/Investment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Root health check (No prefix)
app.get('/', (req, res) => res.send('🚀 FINSIGHT BACKEND IS ALIVE V2.4'));

app.use(express.json());
app.use(cors({
  origin: [
    'https://finsight-frontend-mffn.onrender.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));
app.use(helmet());

// Debug logger - MUST be above routes
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  if (req.method !== 'GET') console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/investments', investmentRoutes);
app.use('/api/v1/sips', sipRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/ocr', ocrRoutes);
app.use('/api/v1/user-profile', userRoutes);

console.log('✅ Routes registered: /auth, /transactions, /investments, /sips, /ai, /ocr, /user-profile');

// Cron Job: Runs daily at midnight to process SIPs
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily SIP cron job...');
  try {
    const today = new Date();
    const currentDay = today.getDate();
    const sipsToProcess = await SIP.find({ dateOfMonth: currentDay });
    
    for (const sip of sipsToProcess) {
      await Transaction.create({
        userId: sip.userId,
        merchant: `SIP Auto-Debit: ${sip.assetName}`,
        amount: -Math.abs(sip.amount),
        type: 'debit',
        category: 'Investment',
        date: today.toISOString()
      });

      const existingInvestment = await Investment.findOne({ userId: sip.userId, name: sip.assetName });
      if (existingInvestment) {
        existingInvestment.investedAmount += sip.amount;
        existingInvestment.currentValue += sip.amount; 
        await existingInvestment.save();
      } else {
        await Investment.create({
          userId: sip.userId,
          name: sip.assetName,
          type: 'Mutual Fund',
          investedAmount: sip.amount,
          currentValue: sip.amount
        });
      }
      sip.lastProcessed = today;
      await sip.save();
      console.log(`Processed SIP for user ${sip.userId}: ${sip.assetName}`);
    }
  } catch (err) {
    console.error('Cron job error:', err);
  }
});

// API Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'FinSight API is running', version: '2.4' });
});

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finsight';
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully');
    
    app.listen(PORT, () => {
      console.log('------------------------------------');
      console.log(`🚀 FINSIGHT BACKEND LIVE V2.4`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌐 Health: http://127.0.0.1:${PORT}/api/v1/health`);
      console.log('------------------------------------');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();
