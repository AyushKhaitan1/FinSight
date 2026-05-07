import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../../services/api';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        // Fetch user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        // Send to backend
        const response = await api.post('/auth/google', {
          email: userInfo.data.email,
          name: userInfo.data.name,
          googleId: userInfo.data.sub
        });

        login(response.data.data.token);
        navigate('/');
      } catch (err: any) {
        setError('Google login failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google login failed.')
  });

  return (
    <div className="glass-panel p-8">
      {error && (
        <div className="mb-4 p-3 bg-danger/10 border border-danger/30 text-danger rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Email Address</label>
          <input 
            type="email" 
            name="email"
            required 
            autoComplete="username"
            className="w-full bg-background dark:bg-zinc-900 border border-border rounded-lg px-4 py-2.5 text-foreground dark:text-white focus:outline-none focus:border-primary transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              required 
              autoComplete="current-password"
              className="w-full bg-background dark:bg-zinc-900 border border-border rounded-lg pl-4 pr-10 py-2.5 text-foreground dark:text-white focus:outline-none focus:border-primary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors mt-4 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <span className="border-b border-border w-1/5 lg:w-1/4"></span>
        <span className="text-xs text-center text-muted uppercase">Or continue with</span>
        <span className="border-b border-border w-1/5 lg:w-1/4"></span>
      </div>

      <button 
        onClick={() => handleGoogleLogin()}
        type="button"
        disabled={loading}
        className="w-full mt-6 bg-surface dark:bg-zinc-900 border border-border hover:bg-border text-foreground dark:text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        Google
      </button>

      <div className="mt-6 text-center text-sm text-muted">
        Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
      </div>
    </div>
  );
}
