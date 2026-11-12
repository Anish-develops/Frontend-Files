import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Clock,
  Calendar,
  Star,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Plus,
  Flame,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ReciprocalMatch, SessionRequest, TeachSkill, LearnSkill } from '../types';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { MatchCard } from '../components/matches/MatchCard';
import { SessionCard } from '../components/sessions/SessionCard';
import { RequestSessionModal } from '../components/matches/RequestSessionModal';
import { SessionDetailModal } from '../components/sessions/SessionDetailModal';
import { ReviewModal } from '../components/sessions/ReviewModal';
import { SkillModal } from '../components/profile/SkillModal';
import { useNotification } from '../context/NotificationContext';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onViewMemberProfile: (memberId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onViewMemberProfile,
}) => {
  const { user, refreshUser, updateUserDirectly } = useAuth();
  const { toast } = useNotification();

  const [matches, setMatches] = useState<ReciprocalMatch[]>([]);
  const [sessions, setSessions] = useState<SessionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedMatch, setSelectedMatch] = useState<ReciprocalMatch | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const [selectedSession, setSelectedSession] = useState<SessionRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Skill Add Modal state
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillModalMode, setSkillModalMode] = useState<'teach' | 'learn'>('teach');

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [fetchedMatches, fetchedSessions] = await Promise.all([
        api.members.getMatches(user),
        api.sessions.getAll(),
      ]);
      setMatches(fetchedMatches);
      setSessions(fetchedSessions);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!user) return null;

  // Filter sessions
  const pendingRequests = sessions.filter(
    (s) => (s.status === 'pending' || s.status === 'rescheduled') && s.receiverId === user.id
  );
  const upcomingSessions = sessions.filter((s) => s.status === 'confirmed');
  const needsReviewSessions = sessions.filter(
    (s) => s.status === 'completed' && !s.reviewId && (s.senderId === user.id || s.receiverId === user.id)
  );

  // Handlers
  const handleOpenRequest = (match: ReciprocalMatch) => {
    setSelectedMatch(match);
    setIsRequestModalOpen(true);
  };

  const handleOpenDetails = (session: SessionRequest) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };

  const handleAcceptSession = async (sessionId: string) => {
    try {
      await api.sessions.updateStatus(sessionId, 'confirmed');
      toast('Session confirmed! Meeting room link is active.', 'success');
      loadData();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error accepting session', 'error');
    }
  };

  const handleDeclineSession = async (sessionId: string) => {
    try {
      await api.sessions.updateStatus(sessionId, 'declined');
      toast('Session request declined.', 'info');
      loadData();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error declining session', 'error');
    }
  };

  const handleRescheduleSession = async (
    sessionId: string,
    details: { proposedDate: string; proposedTime: string; note?: string }
  ) => {
    try {
      await api.sessions.updateStatus(sessionId, 'rescheduled', details);
      toast('New exchange time proposed!', 'success');
      loadData();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error proposing time', 'error');
    }
  };

  const handleMarkCompleted = async (sessionId: string) => {
    try {
      await api.sessions.updateStatus(sessionId, 'completed');
      toast('Session marked as completed! You can now leave a verified review.', 'success');
      await refreshUser();
      loadData();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error updating session', 'error');
    }
  };

  const handleOpenReview = (session: SessionRequest) => {
    setSelectedSession(session);
    setIsReviewModalOpen(true);
  };

  const handleOpenAddSkill = (mode: 'teach' | 'learn') => {
    setSkillModalMode(mode);
    setIsSkillModalOpen(true);
  };

  const handleAddTeachSkill = async (skill: Omit<TeachSkill, 'id'>) => {
    try {
      const updated = await api.profile.addTeachSkill(skill);
      updateUserDirectly(updated);
      toast(`Added "${skill.name}" to skills you offer!`, 'success');
      loadData();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error adding teachable skill', 'error');
    }
  };

  const handleAddLearnSkill = async (skill: Omit<LearnSkill, 'id'>) => {
    try {
      const updated = await api.profile.addLearnSkill(skill);
      updateUserDirectly(updated);
      toast(`Added "${skill.name}" to your wishlist!`, 'success');
      loadData();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error adding wishlist skill', 'error');
    }
  };

  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-6 pb-16 text-text-primary">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-[20px] bg-surface border border-border p-6 sm:p-8 shadow-card">
        {/* Subtle decorative background gradient accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-accent/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="relative">
              <Avatar src={user.avatar} name={user.name} size="xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent text-accent-fg border-2 border-surface flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-text-primary">
                  Welcome back, {firstName}!
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent text-accent-fg border border-accent/40 shadow-subtle">
                  <Sparkles className="w-3 h-3" />
                  <span>Verified Swapper</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
                Ready for your next reciprocal swap? You currently have{' '}
                <strong className="text-text-primary font-semibold">{matches.length} compatible peers</strong> ready to exchange skills 1-on-1 without any money changing hands.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-text-secondary">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  {user.availability.summary}
                </span>
                <span>•</span>
                <span>{user.location}</span>
                <span>•</span>
                <span className="text-primary font-semibold">
                  {user.teachSkills.length} Offering
                </span>
                <span>•</span>
                <span className="text-text-primary font-semibold">
                  {user.learnSkills.length} Seeking
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleOpenAddSkill('teach')}
              className="text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('matches')}
              className="text-xs gap-1.5"
            >
              <span>Discover People</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Learning Progress & Streak Tracker (No charts/graphs, warm human stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Swap Streak */}
        <div className="p-4 sm:p-5 bg-surface rounded-[16px] border border-border shadow-card flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Exchange Streak
            </span>
            <div className="w-8 h-8 rounded-[10px] bg-peach/20 border border-peach/30 text-peach flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#F4A78C]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-heading text-text-primary flex items-baseline gap-1.5">
              <span>5</span>
              <span className="text-sm font-normal text-text-secondary">Days Active</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">Continuous peer learning</p>
          </div>
        </div>

        {/* Hours Exchanged */}
        <div className="p-4 sm:p-5 bg-surface rounded-[16px] border border-border shadow-card flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Hours Swapped
            </span>
            <div className="w-8 h-8 rounded-[10px] bg-primary/20 border border-primary/30 text-primary-fg flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#E07993] dark:text-[#F2B8C8]" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
              {user.hoursSwapped}h
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">1:1 knowledge shared</p>
          </div>
        </div>

        {/* Swaps Completed */}
        <div className="p-4 sm:p-5 bg-surface rounded-[16px] border border-border shadow-card flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Swaps Completed
            </span>
            <div className="w-8 h-8 rounded-[10px] bg-accent/20 border border-accent/40 text-accent-fg flex items-center justify-center">
              <HeartHandshake className="w-4 h-4 text-accent-fg" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
              {user.sessionsCompleted}
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">100% reciprocal rate</p>
          </div>
        </div>

        {/* Peer Rating */}
        <div className="p-4 sm:p-5 bg-surface rounded-[16px] border border-border shadow-card flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Community Rating
            </span>
            <div className="w-8 h-8 rounded-[10px] bg-rating/15 border border-rating/30 text-rating flex items-center justify-center">
              <Star className="w-4 h-4 fill-rating text-rating" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-bold font-heading text-text-primary">
              <span>{user.rating.toFixed(1)}</span>
              <span className="text-xs font-normal text-text-secondary">/ 5.0</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">From {user.reviewCount} peer reviews</p>
          </div>
        </div>
      </div>

      {/* 3. Action Alerts: Pending Inbound Requests & Review Notifications */}
      {pendingRequests.length > 0 && (
        <div className="p-5 bg-surface rounded-[16px] border-2 border-primary/40 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-[12px] bg-primary/20 text-primary-fg border border-primary/30 mt-0.5">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-text-primary text-sm sm:text-base">
                You have {pendingRequests.length} pending exchange proposal{pendingRequests.length > 1 ? 's' : ''}
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                {pendingRequests[0].senderName} wants to exchange skills with you on {pendingRequests[0].proposedDate} at {pendingRequests[0].proposedTime}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDeclineSession(pendingRequests[0].id)}
              className="text-xs"
            >
              Decline
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleAcceptSession(pendingRequests[0].id)}
              className="text-xs"
            >
              Accept Proposal
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('sessions')}
              className="text-xs"
            >
              View All
            </Button>
          </div>
        </div>
      )}

      {needsReviewSessions.length > 0 && (
        <div className="p-5 bg-surface rounded-[16px] border border-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-[12px] bg-rating/15 text-rating border border-rating/30 mt-0.5">
              <Star className="w-5 h-5 fill-rating" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-text-primary text-sm sm:text-base">
                Feedback Pending for Completed Swap
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Your session with{' '}
                <strong className="text-text-primary">
                  {needsReviewSessions[0].senderId === user.id
                    ? needsReviewSessions[0].receiverName
                    : needsReviewSessions[0].senderName}
                </strong>{' '}
                is done! Share your rating to strengthen reciprocal trust in our community.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleOpenReview(needsReviewSessions[0])}
            className="shrink-0 self-start sm:self-center text-xs"
          >
            Leave Review
          </Button>
        </div>
      )}

      {/* 4. Quick Action: "My Skills" Widget (Skills You Offer vs Skills You Want) */}
      <div className="p-6 bg-surface rounded-[20px] border border-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
              <span>My Skills & Exchange Balance</span>
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              SkillSwap matches you reciprocally based on what you share and what you seek.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('profile')}
              className="text-xs"
            >
              Manage All on Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Left: Skills You Offer (Teaching) */}
          <div className="p-4 rounded-[14px] bg-surface-muted border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[8px] bg-success-soft text-success border border-success/30 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-heading text-text-primary">
                    Skills You Offer (Giving)
                  </h3>
                  <span className="text-[10px] text-text-secondary">
                    {user.teachSkills.length} competencies listed
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleOpenAddSkill('teach')}
                className="text-[11px] h-7 px-2.5 gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Teachable</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {user.teachSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-surface border border-border text-xs text-text-primary shadow-subtle"
                >
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-[10px] font-semibold text-text-secondary bg-surface-muted px-1.5 py-0.2 rounded border border-border">
                    {skill.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Skills You Want (Learning) */}
          <div className="p-4 rounded-[14px] bg-surface-muted border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[8px] bg-primary/20 text-primary-fg border border-primary/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-heading text-text-primary">
                    Skills You Want to Learn (Receiving)
                  </h3>
                  <span className="text-[10px] text-text-secondary">
                    {user.learnSkills.length} wishlist targets
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleOpenAddSkill('learn')}
                className="text-[11px] h-7 px-2.5 gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Wishlist</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {user.learnSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-surface border border-border text-xs text-text-primary shadow-subtle"
                >
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-[10px] font-semibold text-accent-fg bg-accent px-1.5 py-0.2 rounded">
                    {skill.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Main Content Grid: Recommended Matches (2 cols) & Upcoming Sessions (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recommended Reciprocal Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-text-primary flex items-center gap-2">
                <span>Recommended Reciprocal Matches</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent text-accent-fg">
                  {matches.length}
                </span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Peers with verified two-way mutual skill compatibility.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('matches')}
              className="text-xs text-text-primary font-semibold hover:text-primary gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.slice(0, 4).map((match) => (
              <MatchCard
                key={match.member.id}
                match={match}
                onViewProfile={onViewMemberProfile}
                onRequestExchange={handleOpenRequest}
              />
            ))}
          </div>

          {matches.length > 4 && (
            <div className="pt-2 text-center">
              <Button
                variant="secondary"
                size="md"
                onClick={() => onNavigate('matches')}
                className="text-xs gap-1.5"
              >
                <span>View {matches.length - 4} More Compatible Peers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Upcoming Sessions & Status */}
        <div className="space-y-5">
          {/* Upcoming Confirmed Sessions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-text-primary">
                Upcoming Sessions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('sessions')}
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                Manage All
              </Button>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map((sess) => (
                  <SessionCard
                    key={sess.id}
                    session={sess}
                    onOpenDetails={handleOpenDetails}
                    onMarkCompleted={handleMarkCompleted}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-surface rounded-[16px] border border-border text-center space-y-2 shadow-card">
                <div className="w-10 h-10 rounded-full bg-surface-muted text-text-secondary flex items-center justify-center mx-auto">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold font-heading text-text-primary">
                  No upcoming sessions
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Send a reciprocal exchange request to start your next 1:1 learning swap.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigate('matches')}
                  className="mt-2 text-xs"
                >
                  Find a Swap Partner
                </Button>
              </div>
            )}
          </div>

          {/* Reciprocal Trust Commitment Badge */}
          <div className="p-4 bg-surface rounded-[16px] border border-border shadow-card space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold font-heading text-text-primary">
                Zero-Fee Reciprocal Guarantee
              </span>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Every SkillSwap connection is strictly 1:1 time-for-time peer learning. No subscriptions, tokens, or payments are ever required.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestSessionModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        match={selectedMatch}
        onSuccess={loadData}
      />

      <SessionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        session={selectedSession}
        onAccept={handleAcceptSession}
        onDecline={handleDeclineSession}
        onReschedule={handleRescheduleSession}
        onMarkCompleted={handleMarkCompleted}
        onOpenReview={handleOpenReview}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        session={selectedSession}
        onSuccess={loadData}
      />

      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        mode={skillModalMode}
        onAddTeach={handleAddTeachSkill}
        onAddLearn={handleAddLearnSkill}
      />
    </div>
  );
};
