import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Equity', 'Mutual Fund', 'Crypto', 'Real Estate', 'Gold', 'Bonds', 'Bank Balance', 'Other']
  },
  investedAmount: {
    type: Number,
    required: true,
  },
  currentValue: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export const Investment = mongoose.model('Investment', investmentSchema);
