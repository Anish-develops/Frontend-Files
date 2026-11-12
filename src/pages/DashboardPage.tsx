import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Clock,
  Calendar,
  Star,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ReciprocalMatch, SessionRequest } from '../types';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { MatchCard } from '../components/matches/MatchCard';
import { SessionCard } from '../components/sessions/SessionCard';
import { RequestSessionModal } from '../components/matches/RequestSessionModal';
import { SessionDetailModal } from '../components/sessions/SessionDetailModal';
import { ReviewModal } from '../components/sessions/ReviewModal';
import { useNotification } from '../context/NotificationContext';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onViewMemberProfile: (memberId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onViewMemberProfile,
}) => {
  const { user, refreshUser } = useAuth();
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
      toast('Session confirmed! Meeting room is ready.', 'success');
      loadData();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error accepting session', 'error');
    }
  };

  const handleDeclineSession = async (sessionId: string) => {
    try {
      await api.sessions.updateStatus(sessionId, 'declined');
      toast('Session declined.', 'info');
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
      toast('Session marked as completed! You can now leave a review.', 'success');
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

  return (
    <div className="space-y-6 pb-16 text-text-primary">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 sm:p-7 bg-surface rounded-[14px] border border-border shadow-card">
        <div className="flex items-start gap-3.5">
          <Avatar src={user.avatar} name={user.name} size="xl" />
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl">{user.headline}</p>
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-xs text-text-secondary">
              <span>{user.location}</span>
              <span>•</span>
              <span className="text-success font-medium">
                {user.teachSkills.length} skills to teach
              </span>
              <span>•</span>
              <span className="text-primary font-medium">
                {user.learnSkills.length} wishlist targets
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigate('profile')}
            className="text-xs"
          >
            Edit Skills
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('matches')}
            className="text-xs gap-1.5"
          >
            <span>Explore Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 bg-surface rounded-[12px] border border-border shadow-card space-y-0.5">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Swaps Completed
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-text-primary">{user.sessionsCompleted}</div>
          <p className="text-[11px] text-text-secondary">1:1 reciprocal sessions</p>
        </div>

        <div className="p-4 sm:p-5 bg-surface rounded-[12px] border border-border shadow-card space-y-0.5">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Hours Swapped
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-primary">{user.hoursSwapped}h</div>
          <p className="text-[11px] text-text-secondary">Mutual peer learning</p>
        </div>

        <div className="p-4 sm:p-5 bg-surface rounded-[12px] border border-border shadow-card space-y-0.5">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Community Rating
          </span>
          <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-bold text-text-primary">
            <Star className="w-5 h-5 text-rating fill-rating" />
            <span>{user.rating.toFixed(1)}</span>
          </div>
          <p className="text-[11px] text-text-secondary">From {user.reviewCount} peer reviews</p>
        </div>

        <div className="p-4 sm:p-5 bg-surface rounded-[12px] border border-border shadow-card space-y-0.5">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Active Wishlist
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-text-primary">{user.learnSkills.length}</div>
          <p className="text-[11px] text-text-secondary">Skills targeted for swap</p>
        </div>
      </div>

      {/* Action Alerts */}
      {pendingRequests.length > 0 && (
        <div className="p-4 sm:p-5 bg-primary-soft border border-border rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[8px] bg-surface text-primary border border-border mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-sm">
                You have {pendingRequests.length} pending exchange request{pendingRequests.length > 1 ? 's' : ''}
              </h4>
              <p className="text-xs text-text-secondary">
                Peers have proposed reciprocal sessions with you. Review and accept or propose an alternative time.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigate('sessions')}
            className="shrink-0 self-start sm:self-center"
          >
            Review Requests
          </Button>
        </div>
      )}

      {needsReviewSessions.length > 0 && (
        <div className="p-4 sm:p-5 bg-surface-muted border border-border rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[8px] bg-surface text-rating border border-border mt-0.5">
              <Star className="w-4 h-4 fill-rating" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-sm">
                Leave feedback for completed session
              </h4>
              <p className="text-xs text-text-secondary">
                Your exchange with{' '}
                {needsReviewSessions[0].senderId === user.id
                  ? needsReviewSessions[0].receiverName
                  : needsReviewSessions[0].senderName}{' '}
                is complete. Submit a verified review to help the community.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleOpenReview(needsReviewSessions[0])}
            className="shrink-0 self-start sm:self-center"
          >
            Leave Review
          </Button>
        </div>
      )}

      {/* Grid: Upcoming Sessions & Recommended Reciprocal Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recommended Matches */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Recommended Reciprocal Matches
              </h2>
              <p className="text-xs text-text-secondary">
                Peers with mutual skill alignment calculated from your teach and learn wishlist.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('matches')}
              className="text-xs text-primary hover:text-primary-hover"
            >
              View all ({matches.length})
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
        </div>

        {/* Right Column (1 Col): Upcoming Sessions & Status */}
        <div className="space-y-5">
          {/* Upcoming Confirmed Sessions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">
                Upcoming Confirmed
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('sessions')}
                className="text-xs text-text-secondary"
              >
                All sessions
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
              <div className="p-5 bg-surface rounded-[12px] border border-border text-center space-y-1.5 shadow-card">
                <Calendar className="w-6 h-6 text-text-secondary/50 mx-auto" />
                <h4 className="text-xs font-semibold text-text-primary">No sessions scheduled yet</h4>
                <p className="text-[11px] text-text-secondary">
                  Send an exchange request to any recommended match to book a slot.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigate('matches')}
                  className="mt-1 text-xs"
                >
                  Find a Partner
                </Button>
              </div>
            )}
          </div>

          {/* Quick Learning Wishlist Card */}
          <div className="p-4 bg-surface rounded-[12px] border border-border shadow-card space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                Your Learning Wishlist
              </span>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Manage
              </button>
            </div>
            <div className="space-y-1.5">
              {user.learnSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2 rounded-[8px] bg-surface-muted border border-border flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-text-primary">{skill.name}</span>
                  <span className="text-[10px] font-semibold text-text-secondary bg-surface px-1.5 py-0.5 rounded border border-border">
                    {skill.priority}
                  </span>
                </div>
              ))}
            </div>
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
    </div>
  );
};
