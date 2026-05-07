import { useState, useEffect } from 'react';
import { Search, Download, Plus, ScanLine, Edit2, Trash2 } from 'lucide-react';
import AddTransactionModal from '../../components/features/AddTransactionModal';
import OCRScannerModal from '../../components/features/OCRScannerModal';
import api from '../../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [defaultType, setDefaultType] = useState<'credit' | 'debit'>('debit');

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleScanComplete = (data: any) => {
    setSelectedData({
      merchant: data.merchant,
      amount: data.amount,
      category: data.category,
      date: new Date(data.date).toISOString().split('T')[0]
    });
    setDefaultType('debit');
    setIsAddModalOpen(true);
  };

  const handleEdit = (tx: any) => {
    setSelectedData(tx);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold">Transactions</h1>
          <p className="text-muted mt-1">Manage your income and expenses.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 bg-surface border border-border text-foreground hover:bg-border px-4 py-2.5 rounded-lg transition-colors font-medium"
          >
            <ScanLine className="w-4 h-4" /> Scan Receipt
          </button>
          <button 
            onClick={() => { setSelectedData(null); setDefaultType('credit'); setIsAddModalOpen(true); }}
            className="flex items-center gap-2 bg-success hover:bg-success/90 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" /> Add Income
          </button>
          <button 
            onClick={() => { setSelectedData(null); setDefaultType('debit'); setIsAddModalOpen(true); }}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <button className="text-muted hover:text-foreground flex items-center gap-2 text-sm font-medium">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/80 text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Merchant</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted">
                    No transactions found. Click "Add Expense" to get started.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-surface/60 transition-colors">
                    <td className="px-6 py-4 text-muted">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{tx.merchant}</td>
                    <td className="px-6 py-4 text-muted">
                      <span className="bg-border px-3 py-1 rounded-full text-xs">{tx.category}</span>
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-medium ${tx.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                      {tx.amount > 0 ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEdit(tx)} className="text-muted hover:text-primary transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(tx._id)} className="text-muted hover:text-danger transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchTransactions}
        initialData={selectedData}
        defaultType={defaultType}
      />
      
      <OCRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
}
