import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  defaultType?: 'credit' | 'debit';
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess, initialData, defaultType = 'debit' }: AddTransactionModalProps) {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>(defaultType);
  const [category, setCategory] = useState('Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMerchant(initialData.merchant || '');
      setAmount(initialData.amount ? Math.abs(initialData.amount).toString() : '');
      setType(initialData.amount > 0 ? 'credit' : 'debit');
      setCategory(initialData.category || 'Dining');
      setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    } else {
      // Reset form
      setMerchant('');
      setAmount('');
      setType(defaultType);
      setCategory('Dining');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      merchant,
      amount: type === 'debit' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      type,
      category,
      date
    };

    try {
      if (initialData?._id) {
        await api.put(`/transactions/${initialData._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save transaction', error);
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
            {initialData?._id ? 'Edit Transaction' : type === 'credit' ? 'Add Income' : 'Add Expense'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!initialData?._id && (
            <div className="flex gap-4 mb-2">
              <button type="button" onClick={() => setType('debit')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'debit' ? 'bg-danger text-white' : 'bg-surface text-muted'}`}>Expense</button>
              <button type="button" onClick={() => setType('credit')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'credit' ? 'bg-success text-white' : 'bg-surface text-muted'}`}>Income</button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Merchant / Source</label>
            <input required type="text" value={merchant} onChange={e => setMerchant(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" placeholder="e.g., Starbucks" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Amount (₹)</label>
            <input required type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" placeholder="0.00" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none">
                {type === 'debit' ? (
                  <>
                    <option className="bg-surface dark:bg-zinc-900">Dining</option>
                    <option className="bg-surface dark:bg-zinc-900">Shopping</option>
                    <option className="bg-surface dark:bg-zinc-900">Transport</option>
                    <option className="bg-surface dark:bg-zinc-900">Entertainment</option>
                    <option className="bg-surface dark:bg-zinc-900">Groceries</option>
                    <option className="bg-surface dark:bg-zinc-900">Rent</option>
                    <option className="bg-surface dark:bg-zinc-900">Utilities</option>
                    <option className="bg-surface dark:bg-zinc-900">Other Expense</option>
                  </>
                ) : (
                  <>
                    <option className="bg-surface dark:bg-zinc-900">Salary</option>
                    <option className="bg-surface dark:bg-zinc-900">Freelance</option>
                    <option className="bg-surface dark:bg-zinc-900">Investment Returns</option>
                    <option className="bg-surface dark:bg-zinc-900">Other Income</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Date</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors mt-6">
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
