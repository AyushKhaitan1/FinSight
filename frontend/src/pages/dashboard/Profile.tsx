import { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, Target, Save } from 'lucide-react';
import api from '../../services/api';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    financialGoals: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user-profile');
        if (response.data.data) {
          setProfile(response.data.data);
        }
      } catch (error: any) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      // Sanitize payload: Only send editable fields
      const payload = {
        name: profile.name,
        phone: profile.phone,
        profession: profile.profession,
        financialGoals: profile.financialGoals
      };
      
      console.log('--- SAVING PROFILE (Sanitized) ---', payload);
      const response = await api.post('/user-profile/update', payload);
      setProfile(response.data.data);
      setMessage('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to save profile', error);
      const errorMsg = error.response?.data?.error || 'Failed to update profile.';
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted">Loading profile...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted mt-1">Manage your personal information and financial goals.</p>
      </div>

      <div className="glass-panel p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted" />
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={profile.name || ''} 
                  onChange={handleChange}
                  className="pl-10 w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-3 text-foreground dark:text-white focus:border-primary focus:outline-none transition-colors" 
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            {/* Email (Read-only as requested) */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={profile.email || ''} 
                  readOnly
                  className="pl-10 w-full bg-surface/50 dark:bg-zinc-900/50 border border-border rounded-lg px-4 py-3 text-muted cursor-not-allowed outline-none" 
                  placeholder="john@example.com"
                />
              </div>
              <p className="text-[10px] text-muted mt-1">Email cannot be changed.</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-muted" />
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  value={profile.phone || ''} 
                  onChange={handleChange}
                  className="pl-10 w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-3 text-foreground dark:text-white focus:border-primary focus:outline-none transition-colors" 
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Profession / Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-muted" />
                </div>
                <input 
                  type="text" 
                  name="profession"
                  value={profile.profession || ''} 
                  onChange={handleChange}
                  className="pl-10 w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-3 text-foreground dark:text-white focus:border-primary focus:outline-none transition-colors" 
                  placeholder="e.g. Software Engineer"
                />
              </div>
            </div>

            {/* Financial Goals (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted mb-2">Primary Financial Goals</label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                  <Target className="h-5 w-5 text-muted" />
                </div>
                <textarea 
                  name="financialGoals"
                  value={profile.financialGoals || ''} 
                  onChange={handleChange}
                  rows={4}
                  className="pl-10 w-full bg-surface dark:bg-zinc-900 border border-border rounded-lg px-4 py-3 text-foreground dark:text-white focus:border-primary focus:outline-none transition-colors resize-none" 
                  placeholder="What are you saving for? e.g. Buying a house, retiring early, vacation fund."
                />
              </div>
              <p className="text-xs text-muted mt-2">Our AI advisor will use these goals to personalize its advice for you.</p>
            </div>

          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border mt-8">
            <div className="text-sm">
              {message && (
                <span className={message.includes('success') ? 'text-success' : 'text-danger'}>
                  {message}
                </span>
              )}
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
