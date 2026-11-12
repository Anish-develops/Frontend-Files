import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { SessionRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Tabs } from '../components/ui/tabs';
import { SessionCard } from '../components/sessions/SessionCard';
import { SessionDetailModal } from '../components/sessions/SessionDetailModal';
import { ReviewModal } from '../components/sessions/ReviewModal';

export const SessionsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useNotification();

  const [sessions, setSessions] = useState<SessionRequest[]>([]);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedSession, setSelectedSession] = useState<SessionRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await api.sessions.getAll();
      setSessions(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user]);

  if (!user) return null;

  // Filter sessions by tab
  const pendingSessions = sessions.filter(
    (s) => s.status === 'pending' || s.status === 'rescheduled'
  );
  const incomingPending = pendingSessions.filter((s) => s.receiverId === user.id);

  const confirmedSessions = sessions.filter((s) => s.status === 'confirmed');
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const archivedSessions = sessions.filter(
    (s) => s.status === 'declined' || s.status === 'cancelled'
  );

  const displayedSessions =
    activeTab === 'pending'
      ? pendingSessions
      : activeTab === 'confirmed'
      ? confirmedSessions
      : activeTab === 'completed'
      ? completedSessions
      : archivedSessions;

  // Handlers
  const handleOpenDetails = (session: SessionRequest) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };

  const handleAccept = async (sessionId: string) => {
    try {
      await api.sessions.updateStatus(sessionId, 'confirmed');
      toast('Exchange session confirmed! Virtual room link created.', 'success');
      loadSessions();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error confirming session', 'error');
    }
  };

  const handleDecline = async (sessionId: string) => {
    try {
      await api.sessions.updateStatus(sessionId, 'declined');
      toast('Exchange session request declined.', 'info');
      loadSessions();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error declining session', 'error');
    }
  };

  const handleReschedule = async (
    sessionId: string,
    details: { proposedDate: string; proposedTime: string; note?: string }
  ) => {
    try {
      await api.sessions.updateStatus(sessionId, 'rescheduled', details);
      toast('Proposed new date & time sent to partner!', 'success');
      loadSessions();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error rescheduling', 'error');
    }
  };

  const handleMarkCompleted = async (sessionId: string) => {
    try {
      await api.sessions.updateStatus(sessionId, 'completed');
      toast('Session marked as completed! Review unlock enabled.', 'success');
      await refreshUser();
      loadSessions();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error marking complete', 'error');
    }
  };

  const handleOpenReview = (session: SessionRequest) => {
    setSelectedSession(session);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 text-text-primary">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
          Exchange Sessions
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Coordinate, accept, reschedule, and review your reciprocal learning appointments.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border pb-3">
        <Tabs
          tabs={[
            {
              id: 'pending',
              label: 'Pending Requests',
              count: incomingPending.length > 0 ? incomingPending.length : undefined,
            },
            {
              id: 'confirmed',
              label: 'Confirmed & Upcoming',
              count: confirmedSessions.length,
            },
            {
              id: 'completed',
              label: 'Completed',
              count: completedSessions.length,
            },
            {
              id: 'archived',
              label: 'Past / Declined',
              count: archivedSessions.length,
            },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Session Cards List */}
      {displayedSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onOpenDetails={handleOpenDetails}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onReschedule={(s) => {
                setSelectedSession(s);
                setIsDetailModalOpen(true);
              }}
              onMarkCompleted={handleMarkCompleted}
              onOpenReview={handleOpenReview}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-10 bg-surface rounded-[14px] border border-border text-center space-y-3 max-w-md mx-auto shadow-card">
          <div className="w-10 h-10 rounded-full bg-surface-muted text-text-secondary flex items-center justify-center mx-auto border border-border">
            <Calendar className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text-primary capitalize">
              No {activeTab} sessions
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {activeTab === 'pending'
                ? 'You have no pending requests waiting for your response.'
                : activeTab === 'confirmed'
                ? 'No upcoming sessions scheduled right now. Browse matches to propose an exchange.'
                : 'Completed sessions and reviews will appear here.'}
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <SessionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        session={selectedSession}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onReschedule={handleReschedule}
        onMarkCompleted={handleMarkCompleted}
        onOpenReview={handleOpenReview}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        session={selectedSession}
        onSuccess={loadSessions}
      />
    </div>
  );
};
