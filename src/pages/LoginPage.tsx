import React, { useState } from 'react';
import { ArrowLeftRight, LogIn, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { toast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast('Signed in successfully!', 'success');
      onNavigate('dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login('alex.chen@example.com', 'demo');
      toast('Welcome back! Signed in with Demo Account', 'success');
      onNavigate('dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10 text-text-primary">
      <div className="w-full max-w-md space-y-5">
        {/* Brand header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center mb-1">
            <img
              src="/logo.png"
              alt="SkillSwap Logo"
              className="w-12 h-12 rounded-[10px] object-contain shadow-subtle"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Sign in to SkillSwap
          </h1>
          <p className="text-xs text-text-secondary">
            Access your 1:1 reciprocal skill exchange network and dashboard.
          </p>
        </div>

        {/* Main Login Form in Soft White Card */}
        <div className="rounded-[14px] border border-border bg-surface p-7 shadow-card space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-text-primary">
                  Password
                </label>
                <span className="text-[11px] text-text-secondary hover:text-primary cursor-pointer transition-colors">
                  Forgot password?
                </span>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-danger font-medium bg-danger-soft p-2.5 rounded-[8px] border border-danger-border">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 mt-1"
              isLoading={isLoading}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full gap-2 text-xs"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <span>Explore as Demo User (Alex Chen)</span>
            </Button>
          </form>

          <div className="pt-3 text-center text-xs text-text-secondary border-t border-border">
            <span>Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="font-medium text-primary hover:text-primary-hover underline ml-1"
            >
              Join the exchange
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Non-monetary peer platform</span>
        </div>
      </div>
    </div>
  );
};
