import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Clock,
  Calendar,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  BookOpen,
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
    <div className="space-y-8 pb-16 text-white">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-7 sm:p-8 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted">
        <div className="flex items-start gap-4">
          <Avatar src={user.avatar} name={user.name} size="xl" />
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-lilac-200/80 max-w-xl">{user.headline}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-lilac-200/60 font-medium">
              <span>{user.location}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                {user.teachSkills.length} skills to teach
              </span>
              <span>•</span>
              <span className="text-flame-400 font-bold">
                {user.learnSkills.length} wishlist targets
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('profile')}
            className="text-xs font-bold"
          >
            Edit Skills
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('matches')}
            className="text-xs font-bold gap-1.5 shadow-flame"
          >
            <span>Explore Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0c1e34]/90 backdrop-blur-md rounded-2xl border border-lilac-300/20 shadow-lifted space-y-1">
          <span className="text-xs font-bold text-lilac-200/70 uppercase tracking-wide">
            Swaps Completed
          </span>
          <div className="text-3xl font-black text-white">{user.sessionsCompleted}</div>
          <p className="text-[11px] text-lilac-200/50 font-medium">1:1 reciprocal sessions</p>
        </div>

        <div className="p-5 bg-[#0c1e34]/90 backdrop-blur-md rounded-2xl border border-lilac-300/20 shadow-lifted space-y-1">
          <span className="text-xs font-bold text-lilac-200/70 uppercase tracking-wide">
            Hours Swapped
          </span>
          <div className="text-3xl font-black text-flame-400">{user.hoursSwapped}h</div>
          <p className="text-[11px] text-lilac-200/50 font-medium">Mutual peer learning</p>
        </div>

        <div className="p-5 bg-[#0c1e34]/90 backdrop-blur-md rounded-2xl border border-lilac-300/20 shadow-lifted space-y-1">
          <span className="text-xs font-bold text-lilac-200/70 uppercase tracking-wide">
            Community Rating
          </span>
          <div className="flex items-center gap-1.5 text-3xl font-black text-white">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>{user.rating.toFixed(1)}</span>
          </div>
          <p className="text-[11px] text-lilac-200/50 font-medium">From {user.reviewCount} peer reviews</p>
        </div>

        <div className="p-5 bg-[#0c1e34]/90 backdrop-blur-md rounded-2xl border border-lilac-300/20 shadow-lifted space-y-1">
          <span className="text-xs font-bold text-lilac-200/70 uppercase tracking-wide">
            Active Wishlist
          </span>
          <div className="text-3xl font-black text-purple-300">{user.learnSkills.length}</div>
          <p className="text-[11px] text-lilac-200/50 font-medium">Skills targeted for swap</p>
        </div>
      </div>

      {/* Action Alerts (Pending incoming requests or pending reviews) */}
      {pendingRequests.length > 0 && (
        <div className="p-5 bg-amber-950/70 border border-amber-500/40 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-900/60 text-amber-300 mt-0.5 border border-amber-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-200 text-sm">
                You have {pendingRequests.length} pending exchange request{pendingRequests.length > 1 ? 's' : ''}
              </h4>
              <p className="text-xs text-amber-200/80">
                Peers have proposed reciprocal sessions with you. Review and accept or propose an alternative time.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigate('sessions')}
            className="shrink-0 self-start sm:self-center shadow-flame"
          >
            Review Pending Requests
          </Button>
        </div>
      )}

      {needsReviewSessions.length > 0 && (
        <div className="p-5 bg-flame-950/70 border border-flame-500/40 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-flame-900/60 text-flame-300 mt-0.5 border border-flame-500/30">
              <Star className="w-5 h-5 fill-flame-400 text-flame-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                Leave feedback for completed session
              </h4>
              <p className="text-xs text-lilac-200/80">
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
            className="shrink-0 self-start sm:self-center shadow-flame"
          >
            Leave Review
          </Button>
        </div>
      )}

      {/* Grid: Upcoming Sessions & Recommended Reciprocal Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Recommended Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                Recommended Reciprocal Matches
              </h2>
              <p className="text-xs text-lilac-200/70">
                Peers with mutual skill alignment calculated from your teach and learn wishlist.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('matches')}
              className="text-xs text-flame-400 hover:text-white"
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
        <div className="space-y-6">
          {/* Upcoming Confirmed Sessions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                Upcoming Confirmed
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('sessions')}
                className="text-xs text-lilac-200/70 hover:text-white"
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
              <div className="p-6 bg-[#0c1e34]/90 backdrop-blur-md rounded-2xl border border-lilac-300/20 text-center space-y-2">
                <Calendar className="w-8 h-8 text-lilac-400/40 mx-auto" />
                <h4 className="text-xs font-bold text-white">No sessions scheduled yet</h4>
                <p className="text-[11px] text-lilac-200/70">
                  Send an exchange request to any recommended match to book a slot.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('matches')}
                  className="mt-2 text-xs font-bold"
                >
                  Find a Partner
                </Button>
              </div>
            )}
          </div>

          {/* Quick Learning Wishlist Card */}
          <div className="p-5 bg-[#0c1e34]/90 backdrop-blur-md rounded-2xl border border-lilac-300/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Your Learning Wishlist
              </span>
              <button
                onClick={() => onNavigate('profile')}
                className="text-xs text-flame-400 hover:text-flame-300 font-bold transition-colors"
              >
                Manage
              </button>
            </div>
            <div className="space-y-2">
              {user.learnSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2.5 rounded-xl bg-[#071322] border border-lilac-300/15 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="text-[10px] font-bold uppercase text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-500/30">
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
