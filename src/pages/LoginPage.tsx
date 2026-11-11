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

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-flame-gradient text-white shadow-flame mb-2">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            Sign In to SkillSwap
          </h1>
          <p className="text-xs text-lilac-200/80">
            Access your 1:1 reciprocal skill exchange network and dashboard.
          </p>
        </div>

        {/* Main Login Form in Accent Navy Card */}
        <div className="rounded-3xl border border-lilac-300/25 bg-[#0c1e34]/95 p-8 shadow-2xl space-y-5 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-lilac-200 tracking-wider uppercase">
                  Password
                </label>
                <span className="text-[11px] text-lilac-300/80 hover:text-white font-medium cursor-pointer transition-colors">
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
              <p className="text-xs text-rose-300 font-medium bg-rose-950/70 p-3 rounded-xl border border-rose-500/40">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 shadow-flame mt-2 font-bold"
              isLoading={isLoading}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Button>
          </form>

          <div className="pt-4 text-center text-xs text-lilac-200/80 border-t border-lilac-200/10">
            <span>Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="font-bold text-flame-400 hover:text-flame-300 underline ml-1"
            >
              Join the exchange
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-lilac-200/60 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Non-monetary peer platform</span>
        </div>
      </div>
    </div>
  );
};
