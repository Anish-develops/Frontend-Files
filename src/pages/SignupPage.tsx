import React, { useState } from 'react';
import { ArrowLeftRight, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

interface SignupPageProps {
  onNavigate: (route: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const { toast } = useNotification();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [teachSkill, setTeachSkill] = useState('');
  const [learnSkill, setLearnSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        headline: headline.trim() || 'SkillSwap Community Member',
        bio: 'Excited to exchange knowledge and collaborate with peers on SkillSwap!',
        teachSkills: teachSkill.trim()
          ? [
              {
                id: 'teach-' + Date.now(),
                name: teachSkill.trim(),
                category: 'Engineering & Code',
                proficiency: 'Advanced',
              },
            ]
          : [],
        learnSkills: learnSkill.trim()
          ? [
              {
                id: 'learn-' + Date.now(),
                name: learnSkill.trim(),
                category: 'Design & UX',
                priority: 'High',
              },
            ]
          : [],
      });

      toast('Welcome to SkillSwap! Profile initialized.', 'success');
      onNavigate('dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 text-text-primary">
      <div className="w-full max-w-lg space-y-5">
        {/* Brand header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] bg-primary text-white shadow-subtle mb-1">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            Create your exchange profile
          </h1>
          <p className="text-xs text-text-secondary">
            Join the non-monetary 1:1 learning community. Share your craft, learn from peers.
          </p>
        </div>

        {/* Main Signup Form in Soft White Card */}
        <div className="rounded-[14px] border border-border bg-surface p-6 sm:p-7 shadow-card space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                required
              />
            </div>

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <Input
              label="Professional Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer • Design System Enthusiast"
              helperText="Shown to prospective swap partners in match search"
            />

            <div className="p-3.5 rounded-[10px] bg-surface-muted border border-border space-y-3">
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                Initial Reciprocal Pairing Setup
              </span>

              <Input
                label="First Skill You Can Teach"
                value={teachSkill}
                onChange={(e) => setTeachSkill(e.target.value)}
                placeholder="e.g. React & Next.js Architecture"
              />

              <Input
                label="First Skill You Want to Learn"
                value={learnSkill}
                onChange={(e) => setLearnSkill(e.target.value)}
                placeholder="e.g. Figma Design Tokens & Auto-layout"
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
              <UserPlus className="w-4 h-4" />
              <span>Publish Profile & Enter Platform</span>
            </Button>
          </form>

          <div className="pt-3 text-center text-xs text-text-secondary border-t border-border">
            <span>Already have an active profile? </span>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-medium text-primary hover:text-primary-hover underline ml-1"
            >
              Log in directly
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Strictly 1:1 Reciprocal Exchange • Zero Cash Required</span>
        </div>
      </div>
    </div>
  );
};
