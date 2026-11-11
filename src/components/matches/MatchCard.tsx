import React from 'react';
import { Star, MapPin, Calendar, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { ReciprocalMatch } from '../../types';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { CompatibilityBadge } from './CompatibilityBadge';

interface MatchCardProps {
  match: ReciprocalMatch;
  onViewProfile: (memberId: string) => void;
  onRequestExchange: (match: ReciprocalMatch) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onViewProfile,
  onRequestExchange,
}) => {
  const { member, youTeach, theyTeach, compatibilityScore, compatibilityReason } = match;

  return (
    <div className="rounded-3xl border border-lilac-300/20 bg-[#0c1e34]/90 backdrop-blur-md p-6 shadow-lifted hover:border-flame-500/50 transition-all flex flex-col justify-between text-white">
      <div>
        {/* Top Header: Avatar, Name, Compatibility */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <Avatar src={member.avatar} name={member.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3
                  onClick={() => onViewProfile(member.id)}
                  className="font-bold text-white text-base hover:text-flame-400 cursor-pointer transition-colors"
                >
                  {member.name}
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-white bg-[#071322] px-2 py-0.5 rounded-full border border-lilac-300/20">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{member.rating.toFixed(1)}</span>
                  <span className="text-lilac-200/60 font-normal">({member.reviewCount})</span>
                </div>
              </div>

              <p className="text-xs text-lilac-200/80 line-clamp-1 mt-0.5">{member.headline}</p>

              <div className="flex items-center gap-3 text-[11px] text-lilac-200/60 mt-1.5 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-lilac-400" />
                  {member.location}
                </span>
                <span>•</span>
                <span>{member.sessionsCompleted} completed swaps</span>
              </div>
            </div>
          </div>

          <CompatibilityBadge score={compatibilityScore} />
        </div>

        {/* Compatibility Reason Line */}
        <div className="mt-4 px-3.5 py-2.5 bg-purple-950/60 border border-purple-400/30 rounded-2xl text-xs text-purple-200 leading-relaxed flex items-start gap-2 shadow-inner">
          <ArrowLeftRight className="w-4 h-4 text-flame-400 shrink-0 mt-0.5" />
          <span className="font-medium">{compatibilityReason}</span>
        </div>

        {/* 2-Way Reciprocal Exchange Visual Breakdown */}
        <div className="mt-4 p-4 bg-[#071322] rounded-2xl border border-lilac-300/15 space-y-3">
          {/* Row 1: What they can teach you */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-lilac-200/80 block mb-1.5">
              They can teach you:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {theyTeach.length > 0 ? (
                theyTeach.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-lilac-200/50 italic">
                  Explore their {member.teachSkills.length} other skills on profile
                </span>
              )}
            </div>
          </div>

          {/* Row 2: What you can teach them */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-lilac-200/80 block mb-1.5">
              You can teach them:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {youTeach.length > 0 ? (
                youTeach.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-flame-950/70 text-flame-300 border border-flame-500/30"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-flame-400"></span>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-lilac-200/50 italic">
                  Looking for: {member.learnSkills.map((s) => s.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Availability hint */}
        <div className="mt-3.5 flex items-center gap-1.5 text-xs text-lilac-200/70 font-medium">
          <Calendar className="w-3.5 h-3.5 text-lilac-400 shrink-0" />
          <span className="truncate">{member.availability.summary}</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-6 pt-4 border-t border-lilac-200/10 flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs font-bold"
          onClick={() => onViewProfile(member.id)}
        >
          View Profile
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1 gap-1.5 text-xs font-bold shadow-flame"
          onClick={() => onRequestExchange(match)}
        >
          <span>Request Swap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
