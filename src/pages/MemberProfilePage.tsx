import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  ArrowRight,
  Award,
} from 'lucide-react';
import { User, Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { RequestSessionModal } from '../components/matches/RequestSessionModal';

interface MemberProfilePageProps {
  memberId: string;
  onBack: () => void;
}

export const MemberProfilePage: React.FC<MemberProfilePageProps> = ({
  memberId,
  onBack,
}) => {
  const { user: currentUser } = useAuth();
  const [member, setMember] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const [fetchedMember, fetchedReviews] = await Promise.all([
          api.members.getById(memberId),
          api.reviews.getForMember(memberId),
        ]);
        setMember(fetchedMember);
        setReviews(fetchedReviews);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [memberId]);

  if (isLoading || !member) {
    return (
      <div className="py-20 text-center text-sm text-text-secondary">
        Loading member profile...
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === member.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-text-primary">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-xs text-text-secondary hover:text-text-primary gap-1 pl-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </Button>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-7 bg-surface rounded-[14px] border border-border shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <Avatar src={member.avatar} name={member.name} size="xl" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                  {member.name}
                </h1>
                <div className="flex items-center gap-1 text-xs text-text-primary bg-surface-muted px-2 py-0.5 rounded-[5px] border border-border">
                  <Star className="w-3 h-3 text-rating fill-rating" />
                  <span className="font-medium">{member.rating.toFixed(1)}</span>
                  <span className="text-text-secondary font-normal">({member.reviewCount} reviews)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary">{member.headline}</p>

              <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-xs text-text-secondary">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-text-secondary" />
                  {member.location}
                </span>
                <span>•</span>
                <span>Member since {member.joinedDate}</span>
                <span>•</span>
                <span className="font-medium text-success">
                  {member.sessionsCompleted} verified exchanges
                </span>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto gap-2 shrink-0 text-sm"
              onClick={() => setIsRequestModalOpen(true)}
            >
              <span>Request Exchange</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Bio */}
        <div className="pt-3.5 border-t border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            About {member.name.split(' ')[0]}
          </h3>
          <p className="text-xs sm:text-sm text-text-primary leading-relaxed">{member.bio}</p>
        </div>

        {/* Focus Areas */}
        {member.interests && member.interests.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              Focus Areas & Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {member.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-0.5 rounded-[6px] text-xs font-medium bg-surface-muted text-text-primary border border-border"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills Grid: Teach and Learn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Skills They Teach */}
        <div className="p-5 bg-surface rounded-[14px] border border-border shadow-card space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span>Skills They Teach</span>
            </h3>
            <Badge variant="success">{member.teachSkills.length} Skills</Badge>
          </div>

          <div className="space-y-2.5">
            {member.teachSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-[9px] bg-surface-muted border border-border space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text-primary text-xs sm:text-sm">{skill.name}</h4>
                  <span className="text-[10px] font-semibold text-success bg-success-soft px-1.5 py-0.5 rounded-[4px] border border-success/20">
                    {skill.proficiency}
                  </span>
                </div>
                <div className="text-xs text-text-secondary flex items-center gap-2">
                  <span>{skill.category}</span>
                  {skill.yearsExperience && (
                    <>
                      <span>•</span>
                      <span>{skill.yearsExperience} yrs experience</span>
                    </>
                  )}
                </div>
                {skill.description && (
                  <p className="text-xs text-text-secondary mt-0.5 leading-normal">
                    {skill.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills They Want to Learn */}
        <div className="p-5 bg-surface rounded-[14px] border border-border shadow-card space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>Skills They Want to Learn</span>
            </h3>
            <Badge variant="warning">{member.learnSkills.length} Skills</Badge>
          </div>

          <div className="space-y-2.5">
            {member.learnSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-[9px] bg-surface-muted border border-border space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text-primary text-xs sm:text-sm">{skill.name}</h4>
                  <span className="text-[10px] font-semibold text-primary-hover bg-primary-soft px-1.5 py-0.5 rounded-[4px] border border-border">
                    {skill.priority} Priority
                  </span>
                </div>
                <div className="text-xs text-text-secondary flex items-center gap-2">
                  <span>{skill.category}</span>
                  {skill.currentLevel && (
                    <>
                      <span>•</span>
                      <span>Current: {skill.currentLevel}</span>
                    </>
                  )}
                </div>
                {skill.learningGoal && (
                  <p className="text-xs text-text-secondary mt-0.5 leading-normal">
                    Goal: {skill.learningGoal}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Card */}
      <div className="p-5 bg-surface rounded-[14px] border border-border shadow-card space-y-2.5">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-secondary" />
          <span>General Availability</span>
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          {member.availability.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {member.availability.days.map((day) => (
            <span
              key={day}
              className="px-2.5 py-0.5 rounded-[6px] bg-surface-muted text-xs font-medium text-text-primary border border-border"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="p-5 sm:p-7 bg-surface rounded-[14px] border border-border shadow-card space-y-4">
        <div>
          <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span>Verified Peer Reviews ({reviews.length})</span>
          </h3>
          <p className="text-xs text-text-secondary">
            Only participants of completed reciprocal exchanges can submit reviews.
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-[10px] bg-surface-muted border border-border space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={rev.authorAvatar} name={rev.authorName} size="sm" />
                    <div>
                      <h4 className="font-semibold text-text-primary text-xs">{rev.authorName}</h4>
                      {rev.authorHeadline && (
                        <p className="text-[11px] text-text-secondary">{rev.authorHeadline}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-text-primary bg-surface px-1.5 py-0.5 rounded-[4px] border border-border">
                    <Star className="w-3 h-3 text-rating fill-rating" />
                    <span className="font-medium">{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-text-primary leading-relaxed">{rev.feedback}</p>

                <div className="pt-1 text-[11px] text-text-secondary flex items-center justify-between border-t border-border">
                  <span>{rev.skillExchanged}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-text-secondary bg-surface-muted rounded-[10px] border border-border">
            No reviews published yet for this member.
          </div>
        )}
      </div>

      {/* Request Modal */}
      <RequestSessionModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        targetMember={member}
      />
    </div>
  );
};
