import { LayoutDashboard, Receipt, LineChart, Bot, Settings, LogOut, Moon, Sun, X } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Transactions', icon: Receipt, path: '/transactions' },
    { name: 'Investments', icon: LineChart, path: '/investments' },
    { name: 'AI Insights', icon: Bot, path: '/ai' },
    { name: 'Profile', icon: Settings, path: '/profile' },
  ];
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 h-full border-r border-border-dark bg-surface flex flex-col transition-colors">
      <div className="h-20 flex items-center justify-between px-6 border-b border-border-dark">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={onClose}>
          <img src="/logo.png" alt="FinSight Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg" />
          <span className="text-2xl font-display font-bold text-foreground tracking-tight">
            Fin<span className="text-primary">Sight</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' 
                  : 'text-muted hover:bg-surface-light hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border-dark space-y-2">
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted hover:bg-background hover:text-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
