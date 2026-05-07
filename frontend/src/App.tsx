import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import Overview from './pages/dashboard/Overview';
import Transactions from './pages/dashboard/Transactions';
import Investments from './pages/dashboard/Investments';
import AiInsights from './pages/dashboard/AiInsights';
import Profile from './pages/dashboard/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  
  if (!_hasHydrated) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-primary font-display font-bold text-xl">Loading FinSight...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="investments" element={<Investments />} />
          <Route path="ai" element={<AiInsights />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
