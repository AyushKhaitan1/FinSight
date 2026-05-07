import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function AddInvestmentModal({ isOpen, onClose, onSuccess, initialData }: AddInvestmentModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Equity');
  const [investedAmount, setInvestedAmount] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(initialData.type || 'Equity');
      setInvestedAmount(initialData.investedAmount?.toString() || '');
      setCurrentValue(initialData.currentValue?.toString() || '');
    } else {
      setName('');
      setType('Equity');
      setInvestedAmount('');
      setCurrentValue('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      name,
      type,
      investedAmount: Number(investedAmount),
      currentValue: Number(currentValue)
    };

    try {
      if (initialData?._id) {
        await api.put(`/investments/${initialData._id}`, payload);
      } else {
        await api.post('/investments', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save investment', error);
      alert('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border w-full max-w-md rounded-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">
            {initialData?._id ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Asset Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" placeholder="e.g., Apple Stock, HDFC Bank" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Asset Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none">
              <option className="bg-surface dark:bg-zinc-900">Equity</option>
              <option className="bg-surface dark:bg-zinc-900">Mutual Fund</option>
              <option className="bg-surface dark:bg-zinc-900">Crypto</option>
              <option className="bg-surface dark:bg-zinc-900">Real Estate</option>
              <option className="bg-surface dark:bg-zinc-900">Gold</option>
              <option className="bg-surface dark:bg-zinc-900">Bonds</option>
              <option className="bg-surface dark:bg-zinc-900">Bank Balance</option>
              <option className="bg-surface dark:bg-zinc-900">Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Invested (₹)</label>
              <input required type="number" min="0" step="0.01" value={investedAmount} onChange={e => setInvestedAmount(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Current Value (₹)</label>
              <input required type="number" min="0" step="0.01" value={currentValue} onChange={e => setCurrentValue(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" placeholder="0.00" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors mt-6">
            {loading ? 'Saving...' : 'Save Asset'}
          </button>
        </form>
      </div>
    </div>
  );
}
