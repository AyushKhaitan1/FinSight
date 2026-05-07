import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false }, // optional for Google Auth users
  name: { type: String },
  phone: { type: String },
  profession: { type: String },
  financialGoals: { type: String },
  baseCurrency: { type: String, default: 'INR' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
