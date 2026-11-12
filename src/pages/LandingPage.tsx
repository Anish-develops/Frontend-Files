import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  Sparkles,
  Star,
  ChevronRight,
  Palette,
  Code2,
  Camera,
  Video,
  TrendingUp,
  Music,
  PenTool,
  Layers,
  Heart,
  ShieldCheck,
  Users2,
  Compass,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { INITIAL_MEMBERS } from '../services/mockData';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user, login } = useAuth();

  // Interactive reciprocal match simulator
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [teachChoice, setTeachChoice] = useState('Figma & UI Design');
  const [learnChoice, setLearnChoice] = useState('React & JavaScript');

  const handleExploreDemo = async () => {
    try {
      await login('demo@skillswap.demo', 'SkillSwap123');
      onNavigate('dashboard');
    } catch {
      onNavigate('dashboard');
    }
  };

  const skillCategories = [
    { name: 'UI/UX Design', icon: Layers, count: '320+ peers', color: 'bg-primary/20 text-[#D47B93] dark:text-primary' },
    { name: 'Graphic Design', icon: Palette, count: '280+ peers', color: 'bg-peach/25 text-[#E06A45] dark:text-peach' },
    { name: 'Programming', icon: Code2, count: '450+ peers', color: 'bg-accent/30 text-accent-fg' },
    { name: 'Photography', icon: Camera, count: '190+ peers', color: 'bg-lavender/30 text-[#6B4AA8] dark:text-lavender' },
    { name: 'Video Editing', icon: Video, count: '210+ peers', color: 'bg-primary/20 text-[#D47B93] dark:text-primary' },
    { name: 'Digital Marketing', icon: TrendingUp, count: '240+ peers', color: 'bg-peach/25 text-[#E06A45] dark:text-peach' },
    { name: 'Music', icon: Music, count: '150+ peers', color: 'bg-accent/30 text-accent-fg' },
    { name: 'Content Writing', icon: PenTool, count: '270+ peers', color: 'bg-lavender/30 text-[#6B4AA8] dark:text-lavender' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28 pb-24 text-text-primary">
      {/* 1. HERO SECTION — Modern Creative Startup */}
      <section className="pt-6 sm:pt-12 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (7 cols): Bold Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/25 text-accent-fg border border-accent/40 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-accent-fg" />
              <span>100% Non-Monetary Peer-to-Peer Learning</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[4.2rem] font-bold tracking-tight text-text-primary font-heading leading-[1.06]">
              Your Skills Are <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-text-primary">Someone Else's</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-primary/40 -rotate-1 rounded-sm -z-0"></span>
              </span>{' '}
              <br />
              <span className="text-primary-deep dark:text-primary font-extrabold">Superpower.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed font-sans">
              Share what you know. Learn what you love. Connect with people who make growth a two-way street. Trade your craft 1:1 with domain creators without spending a dollar.
            </p>

            {/* Main CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-lg">
              {user ? (
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto gap-2 text-sm font-semibold"
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
                    className="w-full sm:w-auto gap-2 text-sm font-bold shadow-pop"
                    onClick={() => onNavigate('signup')}
                  >
                    <span>Start Swapping Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="lime"
                    className="w-full sm:w-auto gap-2 text-sm font-bold shadow-subtle border border-accent/40"
                    onClick={handleExploreDemo}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Explore Demo</span>
                  </Button>
                </>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-2 text-xs text-text-secondary">
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

          {/* Right Column (5 cols): Dynamic 2-Way Exchange Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-8 rounded-[16px] bg-surface border border-border shadow-pop space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-0 pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-border pb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
                  <span className="text-xs font-bold text-text-primary font-heading uppercase tracking-wider">
                    Reciprocal Match Engine
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-fg bg-accent px-2 py-0.5 rounded-[5px]">
                  99% Match
                </span>
              </div>

              {/* Connected Profiles Visual */}
              <div className="space-y-4 relative z-10">
                {/* Person A */}
                <div className="p-4 rounded-[12px] bg-surface-muted border border-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces&auto=format&q=80"
                      alt="Alex Morgan"
                      className="w-11 h-11 rounded-[10px] object-cover border border-border shadow-subtle"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-text-primary font-heading">Alex Morgan</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-semibold text-accent-fg bg-accent px-1.5 py-0.2 rounded">Teaches: Figma</span>
                        <span className="text-[10px] text-text-secondary">Learns: React</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Arrow */}
                <div className="flex items-center justify-center -my-2 relative z-20">
                  <div className="w-9 h-9 rounded-full bg-surface border-2 border-border shadow-subtle flex items-center justify-center text-primary-deep dark:text-primary">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Person B */}
                <div className="p-4 rounded-[12px] bg-surface-muted border border-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&auto=format&q=80"
                      alt="Ryan Cooper"
                      className="w-11 h-11 rounded-[10px] object-cover border border-border shadow-subtle"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-text-primary font-heading">Ryan Cooper</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-semibold text-accent-fg bg-accent px-1.5 py-0.2 rounded">Teaches: React & JS</span>
                        <span className="text-[10px] text-text-secondary">Learns: UI Design</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Simulator Result */}
              <div className="p-4 rounded-[12px] bg-accent/20 border border-accent/40 flex items-center justify-between gap-3 relative z-10">
                <div>
                  <p className="text-xs font-bold text-text-primary font-heading">
                    Direct Two-Way Exchange
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Both peers teach exactly what the other wants to learn.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="lime"
                  className="text-xs shrink-0 font-bold"
                  onClick={handleExploreDemo}
                >
                  <span>Connect Now</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION — 3 Simple Steps */}
      <section id="how-it-works" className="space-y-10 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-primary-deep dark:text-primary font-heading uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-text-primary tracking-tight">
            Exchange Knowledge in Three Simple Steps
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed font-sans">
            SkillSwap eliminates money from the equation. Focus entirely on collaborative human learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="p-7 rounded-[16px] bg-surface border border-border shadow-card space-y-4 hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-[12px] bg-primary text-primary-fg font-heading font-bold text-lg flex items-center justify-center shadow-subtle">
              01
            </div>
            <h3 className="text-lg font-bold font-heading text-text-primary">
              1. Share Your Skills
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              List the tools, crafts, and topics you have mastered, along with your learning wishlist and available weekly hours.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-[16px] bg-surface border border-border shadow-card space-y-4 hover:border-accent/60 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-[12px] bg-accent text-accent-fg font-heading font-bold text-lg flex items-center justify-center shadow-subtle">
              02
            </div>
            <h3 className="text-lg font-bold font-heading text-text-primary">
              2. Find Your Match
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Our reciprocal matching engine pairs you with creators whose wishlist mirrors what you teach, computing exact fit scores.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-[16px] bg-surface border border-border shadow-card space-y-4 hover:border-lavender transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-[12px] bg-lavender text-[#3A245C] dark:text-[#242126] font-heading font-bold text-lg flex items-center justify-center shadow-subtle">
              03
            </div>
            <h3 className="text-lg font-bold font-heading text-text-primary">
              3. Learn & Teach Together
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Schedule 1:1 sessions, hop on video calls, trade feedback, and leave verified ratings to build your peer reputation.
            </p>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE SKILLS SECTION — 8 Categories */}
      <section id="explore-skills" className="space-y-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <span className="text-xs font-bold text-primary-deep dark:text-primary font-heading uppercase tracking-wider block mb-1">
              Directory & Topics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary tracking-tight">
              Explore Popular Skill Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('matches')}
            className="text-xs font-bold text-text-primary hover:text-primary-deep flex items-center gap-1 transition-colors"
          >
            <span>View All Active Peers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {skillCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => onNavigate('matches')}
                className="group p-5 rounded-[14px] bg-surface border border-border shadow-card hover:border-accent hover:shadow-pop cursor-pointer transition-all hover:-translate-y-0.5 space-y-3"
              >
                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-sm text-text-primary group-hover:text-primary-deep transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED COMMUNITY SECTION — Real Profiles */}
      <section id="community" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-primary-deep dark:text-primary font-heading uppercase tracking-wider">
            Community Spotlight
          </span>
          <h2 className="text-3xl font-bold font-heading text-text-primary tracking-tight">
            Meet Peers Ready to Exchange
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Connect directly with verified creators and specialists on the network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_MEMBERS.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-[16px] bg-surface border border-border shadow-card hover:shadow-pop hover:border-accent/60 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-[12px] object-cover border border-border shadow-subtle"
                    />
                    <div>
                      <h3 className="font-bold text-base font-heading text-text-primary">
                        {member.name}
                      </h3>
                      <p className="text-xs text-text-secondary line-clamp-1">{member.headline}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-text-primary bg-surface-muted px-2 py-0.5 rounded-[6px] border border-border">
                    <Star className="w-3.5 h-3.5 fill-rating text-rating" />
                    {member.rating}
                  </span>
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>

                {/* Teach & Learn Chips */}
                <div className="p-3 rounded-[10px] bg-surface-muted space-y-2 text-xs border border-border">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-accent-fg bg-accent px-1.5 py-0.5 rounded">
                      Teaches
                    </span>
                    <span className="font-medium text-text-primary">
                      {member.teachSkills.map((s) => s.name).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-primary-fg bg-primary px-1.5 py-0.5 rounded">
                      Wants
                    </span>
                    <span className="font-medium text-text-primary">
                      {member.learnSkills.map((s) => s.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border">
                <span className="text-xs text-text-secondary">{member.sessionsCompleted} completed swaps</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold"
                  onClick={handleExploreDemo}
                >
                  <span>Connect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY SKILLSWAP SECTION — 5 Value Pillars */}
      <section id="why-skillswap" className="p-8 sm:p-12 rounded-[20px] bg-surface border border-border shadow-pop scroll-mt-20 space-y-10">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-accent-fg bg-accent px-2.5 py-1 rounded-[6px] uppercase tracking-wider inline-block">
            Our Mission
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-text-primary tracking-tight">
            Why Choose SkillSwap?
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Learning should not be gated behind expensive courses and one-way video lectures. Here is why reciprocal peer learning changes the game:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-[8px] bg-primary/20 text-primary-deep dark:text-primary flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-base font-heading text-text-primary">No Money Required</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              100% free forever. Value is exchanged through genuine knowledge transfer, eliminating credit cards, subscriptions, and paywalls.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-[8px] bg-accent/30 text-accent-fg flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-base font-heading text-text-primary">Learn from Real People</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Work 1:1 with practicing developers, designers, and creatives who face real-world challenges daily.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-[8px] bg-lavender/30 text-[#6B4AA8] dark:text-lavender flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-base font-heading text-text-primary">Teach What You Love</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Explaining your craft to another human solidifies your own expertise and gives you teaching confidence.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-[8px] bg-peach/30 text-[#E06A45] dark:text-peach flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-bold text-base font-heading text-text-primary">Meaningful Connections</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Build lasting collaborative partnerships and professional networks rooted in mutual respect and shared growth.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-[8px] bg-accent/30 text-accent-fg flex items-center justify-center font-bold">
              5
            </div>
            <h3 className="font-bold text-base font-heading text-text-primary">Grow Skills Together</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Continuous reciprocal accountability keeps you motivated to master your goals and track verifiable milestones.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION — Authentic Sample Reviews */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-primary-deep dark:text-primary font-heading uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold font-heading text-text-primary tracking-tight">
            Stories from Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-[16px] bg-surface border border-border shadow-card space-y-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-rating text-rating" />
              ))}
            </div>
            <p className="text-sm text-text-primary leading-relaxed italic">
              "I traded 3 sessions on Figma auto layout for Python data scraping with Ryan. Instead of watching prerecorded videos, having someone explain code live in exchange for design feedback was incredible."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"
                alt="Sarah W."
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div>
                <p className="text-xs font-bold text-text-primary font-heading">Sarah Williams</p>
                <p className="text-[11px] text-text-secondary">Brand Designer • Portland, OR</p>
              </div>
            </div>
          </div>

          <div className="p-7 rounded-[16px] bg-surface border border-border shadow-card space-y-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-rating text-rating" />
              ))}
            </div>
            <p className="text-sm text-text-primary leading-relaxed italic">
              "SkillSwap solved the loneliness of online learning. I helped Sophia optimize her responsive CSS, and she showed me how to structure Figma token libraries. Best learning platform I have used."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"
                alt="Ryan C."
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div>
                <p className="text-xs font-bold text-text-primary font-heading">Ryan Cooper</p>
                <p className="text-[11px] text-text-secondary">Full-Stack Developer • Austin, TX</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="p-10 sm:p-16 rounded-[20px] bg-gradient-to-br from-surface to-surface-muted border border-border shadow-pop text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-fg font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join the Movement</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-text-primary tracking-tight">
            Ready to exchange skills and unlock new possibilities?
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto leading-relaxed">
            Join hundreds of creators, developers, and specialists sharing their knowledge today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Button
            size="lg"
            variant="primary"
            className="w-full sm:w-auto text-sm font-bold shadow-pop"
            onClick={() => onNavigate('signup')}
          >
            <span>Start Swapping Free</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button
            size="lg"
            variant="lime"
            className="w-full sm:w-auto text-sm font-bold shadow-subtle border border-accent/40"
            onClick={handleExploreDemo}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Explore Demo Account</span>
          </Button>
        </div>
      </section>
    </div>
  );
};
