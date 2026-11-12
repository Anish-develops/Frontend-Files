import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Star,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  // Interactive reciprocal match simulator
  const [teachChoice, setTeachChoice] = useState('React & Next.js Architecture');
  const [learnChoice, setLearnChoice] = useState('Figma Design Systems & Tokens');

  return (
    <div className="space-y-20 pb-20 text-text-primary">
      {/* HERO SECTION — Warm Minimalist, Editorial-inspired */}
      <section className="pt-8 sm:pt-16 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (7 cols): Strong, Restrained Editorial Typography */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary-soft text-primary-hover border border-border text-xs font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>100% Non-Monetary Peer Learning</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[4.2rem] font-bold tracking-tight text-text-primary leading-[1.05]">
              Mastery swapped, <br />
              <span className="text-primary">not bought.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed pt-1">
              Trade what you know for what you don’t. Direct 1:1 reciprocal exchange sessions between engineers, designers, strategists, and domain specialists.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
              {user ? (
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto gap-2 text-sm"
                  onClick={() => onNavigate('dashboard')}
                >
                  <span>Go to Your Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto gap-2 text-sm"
                    onClick={() => onNavigate('signup')}
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto text-sm"
                    onClick={() => onNavigate('matches')}
                  >
                    Explore Directory
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                Zero monetary fee
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                Strictly 1:1 sessions
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                Verified peer ratings
              </span>
            </div>
          </div>

          {/* Right Column (5 cols): Clean White Card with Live Reciprocal Simulator */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-7 rounded-[14px] bg-surface border border-border shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-xs font-semibold text-text-primary">
                    Reciprocal Match Engine
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success bg-success-soft px-2 py-0.5 rounded-[5px] border border-success/20">
                  Active Pairing
                </span>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Select your craft and wishlist below to test our two-way compatibility calculation:
              </p>

              {/* Interactive micro simulator */}
              <div className="space-y-3 p-3.5 rounded-[10px] bg-surface-muted border border-border">
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    What You Teach
                  </label>
                  <select
                    value={teachChoice}
                    onChange={(e) => setTeachChoice(e.target.value)}
                    className="w-full h-10 px-3 rounded-[8px] border border-border bg-surface text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
                  >
                    <option value="React & Next.js Architecture">React & Next.js Architecture</option>
                    <option value="CSS Design Systems & Tailwind">CSS Design Systems & Tailwind</option>
                    <option value="TypeScript Advanced Types">TypeScript Advanced Types</option>
                    <option value="Distributed SQL & Redis">Distributed SQL & Redis</option>
                    <option value="Conversational Spanish">Conversational Spanish</option>
                  </select>
                </div>

                <div className="flex justify-center -my-1">
                  <div className="w-7 h-7 rounded-full bg-surface border border-border text-primary flex items-center justify-center shadow-subtle">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    What You Want To Learn
                  </label>
                  <select
                    value={learnChoice}
                    onChange={(e) => setLearnChoice(e.target.value)}
                    className="w-full h-10 px-3 rounded-[8px] border border-border bg-surface text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
                  >
                    <option value="Figma Design Systems & Tokens">Figma Design Systems & Tokens</option>
                    <option value="System Design & Scalability">System Design & Scalability</option>
                    <option value="Conversational Spanish & Culture">Conversational Spanish & Culture</option>
                    <option value="React Native Architecture">React Native Architecture</option>
                    <option value="SQL Query Tuning & Postgres">SQL Query Tuning & Postgres</option>
                  </select>
                </div>
              </div>

              {/* Computed Fit Result */}
              <div className="p-3.5 rounded-[10px] bg-success-soft border border-success/25 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs font-semibold text-success">
                      Two-Way Match: 99% Fit
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    You offer {teachChoice.split(' ')[0]}, partner offers {learnChoice.split(' ')[0]}.
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  className="text-xs shrink-0"
                  onClick={() => onNavigate('matches')}
                >
                  Pair Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE-COLUMN SPECIALISTS SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
              Curated Peer Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Real specialists. Real knowledge. Zero cash.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed">
            Active practitioners trade their proven craft 1:1, building genuine mastery and lasting professional connections without monetary transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Design Systems */}
          <div className="group rounded-[14px] border border-border bg-surface overflow-hidden shadow-card hover:border-[#D6CBC0] transition-colors flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative bg-surface-muted">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&crop=faces&auto=format&q=80"
                alt="Product Designer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-[6px] text-xs font-medium bg-surface/90 text-text-primary border border-border backdrop-blur-xs">
                  Design Systems
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-[5px] text-xs font-medium bg-surface text-text-primary shadow-subtle border border-border flex items-center gap-1">
                  <Star className="w-3 h-3 fill-rating text-rating" />
                  5.0
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <h3 className="font-semibold text-base text-text-primary">Elena Rostova</h3>
                <p className="text-xs text-text-secondary">Principal Design Systems Lead • Seattle, WA</p>
              </div>

              <div className="p-3 rounded-[8px] bg-surface-muted text-xs space-y-1.5 border border-border">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-success bg-success-soft px-2 py-0.5 rounded-[5px] border border-success/20">
                    Teaches: Figma Tokens & Layout
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-primary-hover bg-primary-soft px-2 py-0.5 rounded-[5px] border border-border">
                    Learns: React & Next.js Architecture
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-text-secondary border-t border-border">
                <span>19 completed swaps</span>
                <button
                  onClick={() => onNavigate('matches')}
                  className="font-medium text-primary hover:text-primary-hover flex items-center gap-0.5 transition-colors"
                >
                  <span>Request Swap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Distributed Systems */}
          <div className="group rounded-[14px] border border-border bg-surface overflow-hidden shadow-card hover:border-[#D6CBC0] transition-colors flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative bg-surface-muted">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=faces&auto=format&q=80"
                alt="Backend Architect"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-[6px] text-xs font-medium bg-surface/90 text-text-primary border border-border backdrop-blur-xs">
                  Engineering & Data
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-[5px] text-xs font-medium bg-surface text-text-primary shadow-subtle border border-border flex items-center gap-1">
                  <Star className="w-3 h-3 fill-rating text-rating" />
                  4.9
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <h3 className="font-semibold text-base text-text-primary">Marcus Vance</h3>
                <p className="text-xs text-text-secondary">Staff Distributed Systems Architect • Austin, TX</p>
              </div>

              <div className="p-3 rounded-[8px] bg-surface-muted text-xs space-y-1.5 border border-border">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-success bg-success-soft px-2 py-0.5 rounded-[5px] border border-success/20">
                    Teaches: Redis & Sharded Databases
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-primary-hover bg-primary-soft px-2 py-0.5 rounded-[5px] border border-border">
                    Learns: TypeScript Generics
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-text-secondary border-t border-border">
                <span>15 completed swaps</span>
                <button
                  onClick={() => onNavigate('matches')}
                  className="font-medium text-primary hover:text-primary-hover flex items-center gap-0.5 transition-colors"
                >
                  <span>Request Swap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Languages & Writing */}
          <div className="group rounded-[14px] border border-border bg-surface overflow-hidden shadow-card hover:border-[#D6CBC0] transition-colors flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative bg-surface-muted">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=400&fit=crop&crop=faces&auto=format&q=80"
                alt="UX Content Lead"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-[6px] text-xs font-medium bg-surface/90 text-text-primary border border-border backdrop-blur-xs">
                  Languages & Strategy
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-[5px] text-xs font-medium bg-surface text-text-primary shadow-subtle border border-border flex items-center gap-1">
                  <Star className="w-3 h-3 fill-rating text-rating" />
                  5.0
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <h3 className="font-semibold text-base text-text-primary">Sofia Morales</h3>
                <p className="text-xs text-text-secondary">Native Spanish Coach & UX Strategist • New York</p>
              </div>

              <div className="p-3 rounded-[8px] bg-surface-muted text-xs space-y-1.5 border border-border">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-success bg-success-soft px-2 py-0.5 rounded-[5px] border border-success/20">
                    Teaches: Conversational Spanish
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-primary-hover bg-primary-soft px-2 py-0.5 rounded-[5px] border border-border">
                    Learns: CSS & Tailwind Architecture
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-text-secondary border-t border-border">
                <span>26 completed swaps</span>
                <button
                  onClick={() => onNavigate('matches')}
                  className="font-medium text-primary hover:text-primary-hover flex items-center gap-0.5 transition-colors"
                >
                  <span>Request Swap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (The Reciprocal Protocol) */}
      <section id="how-it-works" className="p-7 sm:p-10 rounded-[14px] bg-surface border border-border shadow-card space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            The Exchange Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            How SkillSwap Works
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            A balanced peer architecture where knowledge is the only currency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-[10px] bg-surface-muted border border-border space-y-2">
            <span className="text-2xl font-bold text-primary block">01</span>
            <h3 className="text-sm font-semibold text-text-primary">Publish Your Profile</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              List the skills you have mastered and are ready to teach, alongside your learning wishlist and general weekly availability.
            </p>
          </div>

          <div className="p-5 rounded-[10px] bg-surface-muted border border-border space-y-2">
            <span className="text-2xl font-bold text-primary block">02</span>
            <h3 className="text-sm font-semibold text-text-primary">Pair on Two-Way Fit</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Our reciprocal discovery engine surfaces peers where you teach what they want, and they teach what you need. Propose a date, time, and session agenda.
            </p>
          </div>

          <div className="p-5 rounded-[10px] bg-surface-muted border border-border space-y-2">
            <span className="text-2xl font-bold text-primary block">03</span>
            <h3 className="text-sm font-semibold text-text-primary">Split the Hour & Review</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Meet 1:1 on video, split the time equally (e.g. 30m each), mark completed, and leave verified community reviews to grow reputation.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA BANNER */}
      <section className="text-center">
        <div className="p-8 sm:p-12 rounded-[14px] bg-surface-muted border border-border text-text-primary space-y-4 shadow-card">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto leading-tight">
            Stop paying for courses you never finish.
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
            Trade what you know for what you don’t. Direct 1:1 reciprocal exchange sessions between engineers, designers, and creators.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => onNavigate('signup')}
            >
              Join the Exchange Network
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => onNavigate('matches')}
            >
              Browse Active Skills
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
