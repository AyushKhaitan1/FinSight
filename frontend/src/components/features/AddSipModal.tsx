import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

interface AddSipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSipModal({ isOpen, onClose, onSuccess }: AddSipModalProps) {
  const [assetName, setAssetName] = useState('');
  const [amount, setAmount] = useState('');
  const [dateOfMonth, setDateOfMonth] = useState('1');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/sips', {
        assetName,
        amount: Number(amount),
        dateOfMonth: Number(dateOfMonth)
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save SIP', error);
      alert('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border w-full max-w-md rounded-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">Add New SIP</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Asset/Fund Name</label>
            <input required type="text" value={assetName} onChange={e => setAssetName(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" placeholder="e.g., Nifty 50 Index Fund" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Monthly Amount (₹)</label>
              <input required type="number" min="100" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" placeholder="5000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Deduction Date (1-31)</label>
              <input required type="number" min="1" max="31" value={dateOfMonth} onChange={e => setDateOfMonth(e.target.value)} className="w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:border-primary focus:outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors mt-6">
            {loading ? 'Starting SIP...' : 'Start SIP Automation'}
          </button>
        </form>
      </div>
    </div>
  );
}
