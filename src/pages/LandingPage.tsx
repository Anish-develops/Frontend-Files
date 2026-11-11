import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  Users,
  Calendar,
  Sparkles,
  Search,
  Star,
  ShieldCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
    <div className="relative overflow-hidden space-y-28 pb-24 text-white">
      {/* Primary Canvas Ambient Glows (Warm dark flame & soft lilac highlights) */}
      <div
        className="pointer-events-none absolute -top-32 left-1/3 -z-10 h-[720px] w-[720px] rounded-full blur-[120px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #f95738 0%, #ea3a18 40%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-[550px] -left-20 -z-10 h-[600px] w-[600px] rounded-full blur-[130px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #a76eff 0%, #0c1e34 50%, transparent 75%)',
        }}
      />

      {/* HERO SECTION — Big Defining Text & Asymmetric Visual Positioning (QuantraLogic & T. Edwards inspired) */}
      <section className="pt-6 sm:pt-14 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (7 cols): Massive Defining Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-400/30 text-purple-200 text-xs font-bold tracking-wider uppercase shadow-inner">
              <span className="w-2 h-2 rounded-full bg-flame-500 animate-ping"></span>
              <span>100% NON-MONETARY PEER LEARNING</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[5.2rem] font-black tracking-tight text-white leading-[0.94] uppercase">
              Mastery <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-flame-500 to-rose-500 drop-shadow-sm">
                Swapped,
              </span> <br />
              Not Bought.
            </h1>

            <p className="text-lg sm:text-xl text-lilac-100 font-medium max-w-xl leading-relaxed pt-1">
              Trade what you know for what you don’t. Direct 1:1 reciprocal exchange sessions between verified engineers, designers, and domain specialists.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md">
              {user ? (
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto gap-2 shadow-flame text-sm font-bold"
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
                    className="w-full sm:w-auto gap-2 shadow-flame-lg text-sm font-bold"
                    onClick={() => onNavigate('signup')}
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="accent"
                    className="w-full sm:w-auto text-sm font-bold border-lilac-300/30 text-white hover:bg-white/10"
                    onClick={() => onNavigate('matches')}
                  >
                    Explore Directory
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-3 text-xs text-lilac-200 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Zero monetary fee
              </span>
              <span className="text-lilac-400/40">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Strictly 1:1 sessions
              </span>
              <span className="text-lilac-400/40">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Verified peer ratings
              </span>
            </div>
          </div>

          {/* Right Column (5 cols): Accent Navy Card with Live Simulator */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-7 rounded-3xl bg-[#0c1e34]/95 border border-lilac-300/25 shadow-2xl space-y-5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-lilac-200/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-flame-500 animate-pulse"></div>
                  <span className="text-xs font-black uppercase tracking-widest text-flame-400">
                    Live Reciprocal Match Engine
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Active Pairing
                </span>
              </div>

              <p className="text-xs sm:text-sm text-lilac-200/90 leading-relaxed">
                Select your craft and wishlist below to test our two-way compatibility calculation:
              </p>

              {/* Interactive micro simulator */}
              <div className="space-y-3.5 p-4 rounded-2xl bg-[#071322] border border-lilac-300/20">
                <div>
                  <label className="block text-[11px] font-bold text-lilac-200 uppercase tracking-wider mb-1.5">
                    What You Teach
                  </label>
                  <select
                    value={teachChoice}
                    onChange={(e) => setTeachChoice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-lilac-300/20 bg-[#0c1e34] text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-flame-500"
                  >
                    <option value="React & Next.js Architecture">React & Next.js Architecture</option>
                    <option value="CSS Design Systems & Tailwind">CSS Design Systems & Tailwind</option>
                    <option value="TypeScript Advanced Types">TypeScript Advanced Types</option>
                    <option value="Distributed SQL & Redis">Distributed SQL & Redis</option>
                    <option value="Conversational Spanish">Conversational Spanish</option>
                  </select>
                </div>

                <div className="flex justify-center -my-1">
                  <div className="w-8 h-8 rounded-full bg-flame-gradient text-white flex items-center justify-center shadow-flame">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-lilac-200 uppercase tracking-wider mb-1.5">
                    What You Want To Learn
                  </label>
                  <select
                    value={learnChoice}
                    onChange={(e) => setLearnChoice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-lilac-300/20 bg-[#0c1e34] text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-flame-500"
                  >
                    <option value="Figma Design Systems & Tokens">Figma Design Systems & Tokens</option>
                    <option value="System Design & Scalability">System Design & Scalability</option>
                    <option value="Conversational Spanish & Culture">Conversational Spanish & Culture</option>
                    <option value="React Native Architecture">React Native Architecture</option>
                    <option value="SQL Query Tuning & Postgres">SQL Query Tuning & Postgres</option>
                  </select>
                </div>
              </div>

              {/* Computed Fit Pill */}
              <div className="p-4 rounded-2xl bg-purple-950/70 border border-purple-400/40 flex items-center justify-between gap-3 shadow-inner">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-flame-400" />
                    <span className="text-xs font-black text-white uppercase tracking-wide">
                      Two-Way Match: 99% Fit
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200">
                    You offer {teachChoice.split(' ')[0]}, partner offers {learnChoice.split(' ')[0]}.
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  className="text-xs shrink-0 shadow-flame"
                  onClick={() => onNavigate('matches')}
                >
                  Pair Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE-COLUMN SPECIALISTS SHOWCASE (T. Edwards inspired photo grid) */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-lilac-200/15 pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-flame-400 block mb-1">
              Curated Peer Disciplines
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Real Specialists. Real Knowledge. Zero Cash.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-lilac-200 max-w-md leading-relaxed">
            Active practitioners trade their proven craft 1:1, building genuine mastery and lasting professional connections without monetary transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Design Systems */}
          <div className="group rounded-3xl border border-lilac-300/20 bg-[#0c1e34]/90 backdrop-blur-md overflow-hidden shadow-lifted hover:border-flame-500/50 transition-all flex flex-col justify-between">
            <div className="h-52 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&crop=faces&auto=format&q=80"
                alt="Product Designer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#071322]/90 text-lilac-100 backdrop-blur-md border border-lilac-400/20">
                  Design Systems
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0c1e34]/95 text-white shadow-md border border-lilac-300/20 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  5.0
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-white">Elena Rostova</h3>
                <p className="text-xs text-lilac-200/80">Principal Design Systems Lead • Seattle, WA</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071322] text-xs space-y-2 border border-lilac-300/15">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                    Teaches: Figma Tokens & Layout
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-flame-300 bg-flame-950/70 px-2 py-0.5 rounded border border-flame-500/30">
                    Learns: React & Next.js Architecture
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-lilac-200 border-t border-lilac-200/10">
                <span>19 completed swaps</span>
                <button
                  onClick={() => onNavigate('matches')}
                  className="font-bold text-flame-400 hover:text-flame-300 flex items-center gap-1 transition-colors"
                >
                  <span>Request Swap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Distributed Systems */}
          <div className="group rounded-3xl border border-lilac-300/20 bg-[#0c1e34]/90 backdrop-blur-md overflow-hidden shadow-lifted hover:border-flame-500/50 transition-all flex flex-col justify-between">
            <div className="h-52 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=faces&auto=format&q=80"
                alt="Backend Architect"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#071322]/90 text-lilac-100 backdrop-blur-md border border-lilac-400/20">
                  Engineering & Data
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0c1e34]/95 text-white shadow-md border border-lilac-300/20 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  4.9
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-white">Marcus Vance</h3>
                <p className="text-xs text-lilac-200/80">Staff Distributed Systems Architect • Austin, TX</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071322] text-xs space-y-2 border border-lilac-300/15">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                    Teaches: Redis & Sharded Databases
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-flame-300 bg-flame-950/70 px-2 py-0.5 rounded border border-flame-500/30">
                    Learns: TypeScript Generics
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-lilac-200 border-t border-lilac-200/10">
                <span>15 completed swaps</span>
                <button
                  onClick={() => onNavigate('matches')}
                  className="font-bold text-flame-400 hover:text-flame-300 flex items-center gap-1 transition-colors"
                >
                  <span>Request Swap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Languages & Writing */}
          <div className="group rounded-3xl border border-lilac-300/20 bg-[#0c1e34]/90 backdrop-blur-md overflow-hidden shadow-lifted hover:border-flame-500/50 transition-all flex flex-col justify-between">
            <div className="h-52 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=400&fit=crop&crop=faces&auto=format&q=80"
                alt="UX Content Lead"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#071322]/90 text-lilac-100 backdrop-blur-md border border-lilac-400/20">
                  Languages & Strategy
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0c1e34]/95 text-white shadow-md border border-lilac-300/20 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  5.0
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-white">Sofia Morales</h3>
                <p className="text-xs text-lilac-200/80">Native Spanish Coach & UX Strategist • New York</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071322] text-xs space-y-2 border border-lilac-300/15">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                    Teaches: Conversational Spanish
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-flame-300 bg-flame-950/70 px-2 py-0.5 rounded border border-flame-500/30">
                    Learns: CSS & Tailwind Architecture
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-lilac-200 border-t border-lilac-200/10">
                <span>26 completed swaps</span>
                <button
                  onClick={() => onNavigate('matches')}
                  className="font-bold text-flame-400 hover:text-flame-300 flex items-center gap-1 transition-colors"
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
      <section id="how-it-works" className="p-8 sm:p-12 rounded-3xl bg-[#0c1e34]/80 border border-lilac-300/20 space-y-10 shadow-2xl backdrop-blur-md">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-flame-400">
            The Exchange Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            How SkillSwap Works
          </h2>
          <p className="text-xs sm:text-sm text-lilac-200 leading-relaxed">
            A balanced peer architecture where knowledge is the only currency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#071322] border border-lilac-300/15 shadow-subtle space-y-3">
            <span className="text-4xl font-black text-flame-500 block">01</span>
            <h3 className="text-base font-bold text-white">Publish Your Profile</h3>
            <p className="text-xs text-lilac-200/80 leading-relaxed">
              List the skills you have mastered and are ready to teach, alongside your learning wishlist and general weekly availability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#071322] border border-lilac-300/15 shadow-subtle space-y-3">
            <span className="text-4xl font-black text-flame-500 block">02</span>
            <h3 className="text-base font-bold text-white">Pair on Two-Way Fit</h3>
            <p className="text-xs text-lilac-200/80 leading-relaxed">
              Our reciprocal discovery engine surfaces peers where you teach what they want, and they teach what you need. Propose a date, time, and session agenda.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#071322] border border-lilac-300/15 shadow-subtle space-y-3">
            <span className="text-4xl font-black text-flame-500 block">03</span>
            <h3 className="text-base font-bold text-white">Split the Hour & Review</h3>
            <p className="text-xs text-lilac-200/80 leading-relaxed">
              Meet 1:1 on video, split the time equally (e.g. 30m each), mark completed, and leave verified community reviews to grow reputation.
            </p>
          </div>
        </div>
      </section>

      {/* BOLD CLOSING CTA BANNER */}
      <section className="text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#170503] via-[#3a0d06] to-[#0c1e34] border border-lilac-300/25 text-white space-y-6 relative overflow-hidden shadow-2xl">
          <div
            className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-40"
            style={{ background: '#f95738' }}
          />
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase max-w-2xl mx-auto leading-tight">
            Stop Paying for Courses You Never Finish.
          </h2>
          <p className="text-sm sm:text-base text-lilac-200 max-w-xl mx-auto leading-relaxed">
            Trade what you know for what you don’t. Direct 1:1 reciprocal exchange sessions between engineers, designers, and creators.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto shadow-flame font-bold"
              onClick={() => onNavigate('signup')}
            >
              Join the Exchange Network
            </Button>
            <Button
              size="lg"
              variant="accent"
              className="w-full sm:w-auto border-lilac-300/30 text-white hover:bg-white/10 font-bold"
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
