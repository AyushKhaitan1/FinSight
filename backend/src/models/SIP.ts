import mongoose from 'mongoose';

const sipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assetName: { type: String, required: true },
  amount: { type: Number, required: true },
  dateOfMonth: { type: Number, required: true, min: 1, max: 31 },
  lastProcessed: { type: Date }
}, { timestamps: true });

export const SIP = mongoose.model('SIP', sipSchema);
