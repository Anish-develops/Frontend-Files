import React from 'react';
import { ArrowLeftRight, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-lilac-200/15 bg-[#071322]/80 backdrop-blur-md mt-auto py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-lilac-200/10">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-flame-gradient text-white flex items-center justify-center shadow-flame">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <span className="font-black text-lg tracking-tight text-white">SkillSwap</span>
            </div>
            <p className="text-xs text-lilac-200/75 leading-relaxed">
              SkillSwap is a non-monetary peer learning platform. Members share knowledge they have mastered in return for learning skills from peers. Zero currency, zero subscriptions — pure mutual growth.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-lilac-100">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strictly 1:1 Reciprocal</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-flame-400" />
              <span>Verified Peer Reviews</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Community-Driven</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-lilac-200/60">
          <p>© {new Date().getFullYear()} SkillSwap. Built for direct REST API backend integration.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Codebase Docs</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">API Specs (PRD v0.2)</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy & Visibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
