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
    <div className="rounded-[14px] border border-border bg-surface p-5 shadow-card hover:border-[#D6CBC0] transition-colors flex flex-col justify-between text-text-primary">
      <div>
        {/* Top Header: Avatar, Name, Compatibility */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar src={member.avatar} name={member.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3
                  onClick={() => onViewProfile(member.id)}
                  className="font-semibold text-text-primary text-sm sm:text-base hover:text-primary cursor-pointer transition-colors"
                >
                  {member.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-text-primary bg-surface-muted px-1.5 py-0.5 rounded-[5px] border border-border">
                  <Star className="w-3 h-3 text-rating fill-rating" />
                  <span className="font-medium">{member.rating.toFixed(1)}</span>
                  <span className="text-text-secondary font-normal">({member.reviewCount})</span>
                </div>
              </div>

              <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{member.headline}</p>

              <div className="flex items-center gap-2.5 text-[11px] text-text-secondary mt-1 font-normal">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-text-secondary" />
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
        <div className="mt-3.5 px-3 py-2 bg-surface-muted border border-border rounded-[8px] text-xs text-text-secondary leading-relaxed flex items-start gap-2">
          <ArrowLeftRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <span className="font-medium text-text-primary">{compatibilityReason}</span>
        </div>

        {/* 2-Way Reciprocal Exchange Visual Breakdown */}
        <div className="mt-3.5 p-3.5 bg-surface-muted rounded-[10px] border border-border space-y-2.5">
          {/* Row 1: What they can teach you */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
              They can teach you:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {theyTeach.length > 0 ? (
                theyTeach.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-xs font-medium bg-success-soft text-success border border-success/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-text-secondary italic">
                  Explore their {member.teachSkills.length} other skills on profile
                </span>
              )}
            </div>
          </div>

          {/* Row 2: What you can teach them */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
              You can teach them:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {youTeach.length > 0 ? (
                youTeach.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-xs font-medium bg-primary-soft text-primary-hover border border-border"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-text-secondary italic">
                  Looking for: {member.learnSkills.map((s) => s.name).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Availability hint */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary font-normal">
          <Calendar className="w-3.5 h-3.5 text-text-secondary shrink-0" />
          <span className="truncate">{member.availability.summary}</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-5 pt-3.5 border-t border-border flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onViewProfile(member.id)}
        >
          View Profile
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1 gap-1.5 text-xs"
          onClick={() => onRequestExchange(match)}
        >
          <span>Request Swap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
