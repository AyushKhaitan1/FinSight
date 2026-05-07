import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-display font-bold text-foreground">
            Fin<span className="text-primary">Sight</span>
          </div>
          <p className="text-muted mt-2">Sign in to your financial command center</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
