import React from 'react';
import { Calendar, Clock, Video, MapPin, Check, X, RotateCcw, Star } from 'lucide-react';
import { SessionRequest } from '../../types';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../context/AuthContext';

interface SessionCardProps {
  session: SessionRequest;
  onOpenDetails: (session: SessionRequest) => void;
  onAccept?: (sessionId: string) => void;
  onDecline?: (sessionId: string) => void;
  onReschedule?: (session: SessionRequest) => void;
  onMarkCompleted?: (sessionId: string) => void;
  onOpenReview?: (session: SessionRequest) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onOpenDetails,
  onAccept,
  onDecline,
  onReschedule,
  onMarkCompleted,
  onOpenReview,
}) => {
  const { user: currentUser } = useAuth();
  const isSender = currentUser?.id === session.senderId;

  const partnerName = isSender ? session.receiverName : session.senderName;
  const partnerAvatar = isSender ? session.receiverAvatar : session.senderAvatar;

  // Format date readable
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case 'pending':
        return <Badge variant="warning">Pending Request</Badge>;
      case 'confirmed':
        return <Badge variant="success">Confirmed Session</Badge>;
      case 'rescheduled':
        return <Badge variant="warning">Time Proposed</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="default">{session.status}</Badge>;
    }
  };

  return (
    <div className="rounded-[14px] border border-border bg-surface p-5 shadow-card hover:border-[#D6CBC0] transition-colors flex flex-col justify-between text-text-primary">
      <div className="space-y-3.5">
        {/* Header: Partner + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={partnerAvatar} name={partnerName} size="md" />
            <div>
              <p className="text-xs text-text-secondary font-normal">Exchange Partner</p>
              <h4 className="font-semibold text-text-primary text-sm leading-tight">{partnerName}</h4>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* 2-way exchange details */}
        <div className="p-3 bg-surface-muted rounded-[9px] border border-border text-xs space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-text-secondary">You teach:</span>
            <span className="font-medium text-primary-hover bg-primary-soft px-2 py-0.5 rounded-[5px] border border-border">
              {isSender ? session.teachSkillName : session.learnSkillName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-text-secondary">They teach:</span>
            <span className="font-medium text-success bg-success-soft px-2 py-0.5 rounded-[5px] border border-success/20">
              {isSender ? session.learnSkillName : session.teachSkillName}
            </span>
          </div>
        </div>

        {/* Date, Time, Format */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3.5 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-text-secondary" />
            {formatDate(session.proposedDate)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-text-secondary" />
            {session.proposedTime} ({session.durationMinutes}m)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            {session.format === 'online' ? (
              <Video className="w-3.5 h-3.5 text-text-secondary" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-text-secondary" />
            )}
            {session.format === 'online' ? 'Google Meet' : 'In-person'}
          </span>
        </div>

        {/* Message preview */}
        {session.note && (
          <p className="text-xs text-text-secondary italic line-clamp-2 bg-surface-muted/50 p-2 rounded-[6px] border border-border/60">
            &ldquo;{session.note}&rdquo;
          </p>
        )}
      </div>

      {/* Action Footer depending on state */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="text-xs"
          onClick={() => onOpenDetails(session)}
        >
          View Details
        </Button>

        <div className="flex items-center gap-1.5">
          {/* Pending State for Receiver: Accept / Propose New Time / Decline */}
          {session.status === 'pending' && !isSender && (
            <>
              {onDecline && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger hover:text-danger hover:bg-danger-soft h-8 px-2"
                  onClick={() => onDecline(session.id)}
                  title="Decline request"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              {onReschedule && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs gap-1 h-8"
                  onClick={() => onReschedule(session)}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reschedule</span>
                </Button>
              )}
              {onAccept && (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs gap-1 h-8"
                  onClick={() => onAccept(session.id)}
                >
                  <Check className="w-3 h-3" />
                  <span>Accept</span>
                </Button>
              )}
            </>
          )}

          {/* Pending State for Sender */}
          {session.status === 'pending' && isSender && (
            <span className="text-[11px] text-text-secondary italic">Awaiting partner confirmation</span>
          )}

          {/* Rescheduled State */}
          {session.status === 'rescheduled' && (
            <Button
              variant="primary"
              size="sm"
              className="text-xs gap-1"
              onClick={() => onOpenDetails(session)}
            >
              <span>Review Proposed Time</span>
            </Button>
          )}

          {/* Confirmed State: Join Room / Mark Completed */}
          {session.status === 'confirmed' && (
            <>
              {session.locationOrLink && (
                <a
                  href={session.locationOrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] bg-primary text-white text-xs font-medium hover:bg-primary-hover shadow-subtle transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Call</span>
                </a>
              )}
              {onMarkCompleted && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs gap-1 text-success border-success/30 hover:bg-success-soft"
                  onClick={() => onMarkCompleted(session.id)}
                >
                  <Check className="w-3 h-3" />
                  <span>Mark Done</span>
                </Button>
              )}
            </>
          )}

          {/* Completed State: Review */}
          {session.status === 'completed' && (
            <>
              {session.reviewId ? (
                <span className="inline-flex items-center gap-1 text-xs text-rating font-medium">
                  <Star className="w-3.5 h-3.5 fill-rating" />
                  Reviewed
                </span>
              ) : onOpenReview ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => onOpenReview(session)}
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Leave Review</span>
                </Button>
              ) : (
                <Badge variant="secondary">Completed</Badge>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
