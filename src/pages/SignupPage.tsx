import React, { useState } from 'react';
import { ArrowLeftRight, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-flame-gradient text-white shadow-flame mb-2">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            Create Your Exchange Profile
          </h1>
          <p className="text-xs text-lilac-200/80">
            Join the non-monetary 1:1 learning community. Share your craft, learn from peers.
          </p>
        </div>

        {/* Main Signup Form in Accent Navy Card */}
        <div className="rounded-3xl border border-lilac-300/25 bg-[#0c1e34]/95 p-8 shadow-2xl space-y-5 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="p-4 rounded-2xl bg-[#071322] border border-lilac-300/20 space-y-3.5">
              <span className="text-xs font-bold text-flame-400 uppercase tracking-wider block">
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
              <UserPlus className="w-4 h-4" />
              <span>Publish Profile & Enter Platform</span>
            </Button>
          </form>

          <div className="pt-4 text-center text-xs text-lilac-200/80 border-t border-lilac-200/10">
            <span>Already have an active profile? </span>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-bold text-flame-400 hover:text-flame-300 underline ml-1"
            >
              Log in directly
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-lilac-200/60 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strictly 1:1 Reciprocal Exchange • Zero Cash Required</span>
        </div>
      </div>
    </div>
  );
};
