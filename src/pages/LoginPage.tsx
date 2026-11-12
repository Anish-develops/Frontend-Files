import React, { useState } from 'react';
import { LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Logo } from '../components/ui/Logo';
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
      await login('demo@skillswap.demo', 'SkillSwap123');
      toast('Welcome back! Signed into Demo Account (Alex Morgan)', 'success');
      onNavigate('dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10 text-text-primary">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-1">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-text-primary">
            Sign in to SkillSwap
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Access your 1:1 reciprocal skill exchange network and dashboard.
          </p>
        </div>

        {/* Main Login Form */}
        <div className="rounded-[18px] border border-border bg-surface p-7 sm:p-8 shadow-pop space-y-5">
          {/* Quick Demo Mode Banner */}
          <div className="p-3.5 rounded-[12px] bg-accent/20 border border-accent/40 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-text-primary font-heading">
                Instant Demo Access
              </p>
              <p className="text-[11px] text-text-secondary">
                Explore as Alex Morgan (UI/UX & Figma)
              </p>
            </div>
            <Button
              type="button"
              variant="lime"
              size="sm"
              className="font-bold text-xs shadow-subtle shrink-0"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>1-Click Demo</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@skillswap.demo"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-text-primary">
                  Password
                </label>
                <span className="text-[11px] text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
                  Forgot password?
                </span>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="SkillSwap123"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-danger font-medium bg-danger-soft p-3 rounded-[8px] border border-danger-border">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 mt-2 font-bold"
              isLoading={isLoading}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Button>
          </form>

          <div className="pt-3 text-center text-xs text-text-secondary border-t border-border">
            <span>Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="font-bold text-primary-deep dark:text-primary hover:underline ml-1"
            >
              Join the exchange free
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>No credit card or payments ever required. 100% peer learning.</span>
        </div>
      </div>
    </div>
  );
};
