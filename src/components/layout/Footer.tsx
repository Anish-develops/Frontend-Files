import React from 'react';
import { ArrowLeftRight, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-surface mt-auto py-10 text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="SkillSwap Logo"
                className="w-10 h-10 rounded-[6px] object-contain shadow-subtle"
              />
              <span className="font-semibold text-base tracking-tight text-text-primary">SkillSwap</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              SkillSwap is a non-monetary peer learning platform. Members share knowledge they have mastered in return for learning skills from peers. Zero currency, zero subscriptions — pure mutual growth.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5 font-medium text-text-primary">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>Strictly 1:1 Reciprocal</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-text-primary">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Verified Peer Reviews</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-text-primary">
              <Heart className="w-4 h-4 text-primary" />
              <span>Community-Driven</span>
            </div>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} SkillSwap. Built for direct REST API backend integration.</p>
          <div className="flex items-center gap-3">
            <span className="hover:text-text-primary cursor-pointer transition-colors">Documentation</span>
            <span>•</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">API Specs (PRD v0.2)</span>
            <span>•</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">Privacy & Visibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
