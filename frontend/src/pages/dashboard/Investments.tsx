import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, Briefcase, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../services/api';
import AddInvestmentModal from '../../components/features/AddInvestmentModal';
import AddSipModal from '../../components/features/AddSipModal';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function Investments() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [sips, setSips] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSipModalOpen, setIsSipModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchInvestments = async () => {
    try {
      const response = await api.get('/investments');
      setInvestments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch investments', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSips = async () => {
    try {
      const response = await api.get('/sips');
      setSips(response.data.data);
    } catch (error) {
      console.error('Failed to fetch SIPs', error);
    }
  };

  useEffect(() => {
    fetchInvestments();
    fetchSips();
  }, []);

  const handleEdit = (inv: any) => {
    setSelectedData(inv);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/investments/${id}`);
        fetchInvestments();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const handleDeleteSip = async (id: string) => {
    if(window.confirm('Cancel this SIP? Future auto-debits will stop.')) {
      try {
        await api.delete(`/sips/${id}`);
        fetchSips();
      } catch (err) {
        console.error('Failed to delete sip', err);
      }
    }
  };

  // Calculations
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = totalCurrent - totalInvested;
  const returnPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  const isPositive = totalReturns >= 0;

  // Chart Data (Group by Type)
  const allocationMap: any = {};
  investments.forEach(inv => {
    if(!allocationMap[inv.type]) allocationMap[inv.type] = 0;
    allocationMap[inv.type] += inv.currentValue;
  });
  
  const pieData = Object.keys(allocationMap).map(key => ({
    name: key,
    value: allocationMap[key]
  }));

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Portfolio</h1>
          <p className="text-muted text-sm mt-1">Track and manage your wealth.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsSipModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-surface border border-border text-foreground hover:bg-border px-3 md:px-4 py-2.5 rounded-lg transition-colors font-medium text-sm"
          >
            <Calendar className="w-4 h-4 text-primary" /> Start SIP
          </button>
          <button 
            onClick={() => { setSelectedData(null); setIsModalOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-3 md:px-4 py-2.5 rounded-lg transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: KPIs & Allocation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-surface)]/50">
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Total Portfolio Value</span>
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="mt-4 text-4xl font-mono font-bold text-foreground">
              ₹{totalCurrent.toLocaleString()}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted">Total Invested</p>
                <p className="font-mono font-medium mt-1">₹{totalInvested.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Overall Returns</p>
                <p className={`font-mono font-medium mt-1 flex items-center gap-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  ₹{Math.abs(totalReturns).toLocaleString()} ({returnPercentage.toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-medium mb-6">Asset Allocation</h2>
            <div className="h-64">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--text-foreground)' }}
                      formatter={(val: any) => `₹${Number(val).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-xl text-muted text-sm">
                  No Assets Found
                </div>
              )}
            </div>
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-muted">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Asset List & SIPs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Your Assets</h2>
              <button 
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="text-xs flex items-center gap-1 bg-border hover:bg-[#3F3F46] px-3 py-1.5 rounded-lg text-foreground transition-colors"
              >
                Sort: {sortOrder === 'desc' ? 'Highest Value First' : 'Lowest Value First'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted border-b border-border">
                  <tr>
                    <th className="pb-3 font-medium">Asset Name</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium text-right">Invested</th>
                    <th className="pb-3 font-medium text-right">Current Value</th>
                    <th className="pb-3 font-medium text-right">Returns</th>
                    <th className="pb-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {loading ? (
                    <tr><td colSpan={6} className="py-8 text-center text-muted">Loading assets...</td></tr>
                  ) : investments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted">
                        You haven't tracked any investments or bank balances yet.
                      </td>
                    </tr>
                  ) : (
                    [...investments].sort((a, b) => sortOrder === 'asc' ? a.currentValue - b.currentValue : b.currentValue - a.currentValue).map((inv) => {
                      const diff = inv.currentValue - inv.investedAmount;
                      const diffPercent = inv.investedAmount > 0 ? (diff / inv.investedAmount) * 100 : 0;
                      const isUp = diff >= 0;
                      return (
                        <tr key={inv._id} className="hover:bg-surface/40 transition-colors">
                          <td className="py-4 font-medium text-foreground">{inv.name}</td>
                          <td className="py-4 text-muted">
                            <span className="bg-border px-2.5 py-1 rounded-full text-xs">{inv.type}</span>
                          </td>
                          <td className="py-4 text-right font-mono">₹{inv.investedAmount.toLocaleString()}</td>
                          <td className="py-4 text-right font-mono font-medium text-foreground">₹{inv.currentValue.toLocaleString()}</td>
                          <td className={`py-4 text-right font-mono text-xs ${isUp ? 'text-success' : 'text-danger'}`}>
                            {isUp ? '+' : ''}₹{diff.toLocaleString()} <br/>
                            ({isUp ? '+' : ''}{diffPercent.toFixed(1)}%)
                          </td>
                          <td className="py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button onClick={() => handleEdit(inv)} className="text-muted hover:text-primary transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(inv._id)} className="text-muted hover:text-danger transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-medium mb-6">Active SIPs (Auto-Debits)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted border-b border-border">
                  <tr>
                    <th className="pb-3 font-medium">Asset/Fund</th>
                    <th className="pb-3 font-medium">Deduction Date</th>
                    <th className="pb-3 font-medium text-right">Monthly Amount</th>
                    <th className="pb-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {sips.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted">
                        No active SIPs. Automate your investing using the button above.
                      </td>
                    </tr>
                  ) : (
                    sips.map((sip) => (
                      <tr key={sip._id} className="hover:bg-surface/40 transition-colors">
                        <td className="py-4 font-medium text-foreground">{sip.assetName}</td>
                        <td className="py-4 text-muted">Day {sip.dateOfMonth} of month</td>
                        <td className="py-4 text-right font-mono text-primary font-medium">₹{sip.amount.toLocaleString()}</td>
                        <td className="py-4 text-center">
                          <button onClick={() => handleDeleteSip(sip._id)} className="text-muted hover:text-danger transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AddInvestmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchInvestments}
        initialData={selectedData}
      />

      <AddSipModal 
        isOpen={isSipModalOpen}
        onClose={() => setIsSipModalOpen(false)}
        onSuccess={fetchSips}
      />
    </div>
  );
}
