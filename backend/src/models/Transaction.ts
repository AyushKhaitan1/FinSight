import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  date: { type: Date, required: true, index: true },
  merchant: { type: String, required: true },
  category: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

// Compound index for efficient user-specific time-range queries
transactionSchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
