import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
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
      <div className="py-20 text-center text-sm text-lilac-200">
        Loading member profile...
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === member.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-white">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-xs text-lilac-200 hover:text-white gap-1 pl-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </Button>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar src={member.avatar} name={member.name} size="xl" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                  {member.name}
                </h1>
                <div className="flex items-center gap-1 text-xs font-bold text-white bg-[#071322] px-2.5 py-0.5 rounded-full border border-lilac-300/20">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{member.rating.toFixed(1)}</span>
                  <span className="text-lilac-200/60 font-normal">({member.reviewCount} reviews)</span>
                </div>
              </div>

              <p className="text-sm text-lilac-200/90 font-medium">{member.headline}</p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-lilac-200/60">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-lilac-400" />
                  {member.location}
                </span>
                <span>•</span>
                <span>Member since {member.joinedDate}</span>
                <span>•</span>
                <span className="font-bold text-emerald-400">
                  {member.sessionsCompleted} verified exchanges
                </span>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto gap-2 shrink-0 shadow-flame font-bold"
              onClick={() => setIsRequestModalOpen(true)}
            >
              <span>Request Exchange</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Bio */}
        <div className="pt-4 border-t border-lilac-200/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lilac-200/70 mb-2">
            About {member.name.split(' ')[0]}
          </h3>
          <p className="text-sm text-lilac-100 leading-relaxed">{member.bio}</p>
        </div>

        {/* Interests */}
        {member.interests && member.interests.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-lilac-200/70 mb-2">
              Focus Areas & Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {member.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-[#071322] text-lilac-200 border border-lilac-300/15"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills Grid: Teach and Learn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills They Teach */}
        <div className="p-6 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-lilac-200/10">
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Skills They Teach</span>
            </h3>
            <Badge variant="success">{member.teachSkills.length} Skills</Badge>
          </div>

          <div className="space-y-3">
            {member.teachSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-[#071322] border border-lilac-300/15 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                  <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                    {skill.proficiency}
                  </span>
                </div>
                <div className="text-xs text-lilac-200/70 flex items-center gap-2">
                  <span>{skill.category}</span>
                  {skill.yearsExperience && (
                    <>
                      <span>•</span>
                      <span>{skill.yearsExperience} yrs experience</span>
                    </>
                  )}
                </div>
                {skill.description && (
                  <p className="text-xs text-lilac-200/90 mt-1 leading-normal">
                    {skill.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills They Want to Learn */}
        <div className="p-6 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-lilac-200/10">
            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-flame-500"></span>
              <span>Skills They Want to Learn</span>
            </h3>
            <Badge variant="lilac">{member.learnSkills.length} Skills</Badge>
          </div>

          <div className="space-y-3">
            {member.learnSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-[#071322] border border-lilac-300/15 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                  <span className="text-[10px] font-bold uppercase text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-500/30">
                    {skill.priority} Priority
                  </span>
                </div>
                <div className="text-xs text-lilac-200/70 font-medium flex items-center gap-2">
                  <span>{skill.category}</span>
                  {skill.currentLevel && (
                    <>
                      <span>•</span>
                      <span>Current: {skill.currentLevel}</span>
                    </>
                  )}
                </div>
                {skill.learningGoal && (
                  <p className="text-xs text-lilac-200/90 mt-1 leading-normal">
                    Goal: {skill.learningGoal}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Card */}
      <div className="p-6 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-3">
        <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Calendar className="w-4 h-4 text-lilac-400" />
          <span>General Availability</span>
        </h3>
        <p className="text-xs text-lilac-200/80 leading-relaxed">
          {member.availability.summary}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {member.availability.days.map((day) => (
            <span
              key={day}
              className="px-3 py-1 rounded-xl bg-[#071322] text-xs font-bold text-lilac-200 border border-lilac-300/15"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="p-6 sm:p-8 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-flame-400" />
              <span>Verified Peer Reviews ({reviews.length})</span>
            </h3>
            <p className="text-xs text-lilac-200/70">
              Only participants of completed reciprocal exchanges can submit reviews.
            </p>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-[#071322] border border-lilac-300/15 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={rev.authorAvatar} name={rev.authorName} size="sm" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{rev.authorName}</h4>
                      {rev.authorHeadline && (
                        <p className="text-[11px] text-lilac-200/60">{rev.authorHeadline}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-white">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-lilac-200/90 leading-relaxed">{rev.feedback}</p>

                <div className="pt-1 text-[11px] text-lilac-200/50 flex items-center justify-between border-t border-lilac-200/10">
                  <span>{rev.skillExchanged}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-lilac-200/60 bg-[#071322] rounded-2xl border border-lilac-300/15">
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
