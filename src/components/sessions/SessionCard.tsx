import React from 'react';
import { Calendar, Clock, Video, MapPin, ArrowLeftRight, Check, X, RotateCcw, Star } from 'lucide-react';
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
        return <Badge variant="flame">Time Proposed</Badge>;
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
    <div className="rounded-2xl border border-lilac-300/20 bg-[#0c1e34]/90 backdrop-blur-md p-5 shadow-lifted hover:border-flame-500/40 transition-all flex flex-col justify-between text-white">
      <div className="space-y-4">
        {/* Header: Partner + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={partnerAvatar} name={partnerName} size="md" />
            <div>
              <p className="text-xs text-lilac-200/60 font-medium">Exchange Partner</p>
              <h4 className="font-bold text-white text-sm leading-tight">{partnerName}</h4>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* 2-way exchange details */}
        <div className="p-3 bg-[#071322] rounded-xl border border-lilac-300/15 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-white">
            <span className="font-bold text-lilac-200/70">You teach:</span>
            <span className="font-bold text-flame-300 bg-flame-950/70 px-2 py-0.5 rounded-md border border-flame-500/30">
              {isSender ? session.teachSkillName : session.learnSkillName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <span className="font-bold text-lilac-200/70">They teach:</span>
            <span className="font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {isSender ? session.learnSkillName : session.teachSkillName}
            </span>
          </div>
        </div>

        {/* Date, Time, Format */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-lilac-200/80">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-lilac-400" />
            <span>{formatDate(session.proposedDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-lilac-400" />
            <span>
              {session.proposedTime} ({session.durationMinutes} min)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {session.format === 'online' ? (
              <Video className="w-3.5 h-3.5 text-lilac-400" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-lilac-400" />
            )}
            <span className="capitalize">{session.format}</span>
          </div>
        </div>

        {/* Note snippet */}
        {session.note && (
          <p className="text-xs text-lilac-200/90 italic line-clamp-2 bg-[#071322] p-2.5 rounded-xl border border-lilac-300/15">
            &ldquo;{session.note}&rdquo;
          </p>
        )}
      </div>

      {/* Action footer based on status */}
      <div className="mt-5 pt-3.5 border-t border-lilac-200/10 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-lilac-200 hover:text-white"
          onClick={() => onOpenDetails(session)}
        >
          View Details
        </Button>

        <div className="flex items-center gap-2">
          {/* Pending State Actions */}
          {(session.status === 'pending' || session.status === 'rescheduled') && (
            <>
              {!isSender ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border-rose-500/30"
                    onClick={() => onDecline?.(session.id)}
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    <span>Decline</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReschedule?.(session)}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1 text-lilac-400" />
                    <span>Reschedule</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onAccept?.(session.id)}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    <span>Accept</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule?.(session)}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1 text-lilac-400" />
                  <span>Propose New Time</span>
                </Button>
              )}
            </>
          )}

          {/* Confirmed State Actions */}
          {session.status === 'confirmed' && (
            <>
              {session.locationOrLink && (
                <a
                  href={session.locationOrLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-flame-400 hover:underline px-2.5 py-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Call</span>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => onMarkCompleted?.(session.id)}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                <span>Mark Completed</span>
              </Button>
            </>
          )}

          {/* Completed State Actions */}
          {session.status === 'completed' && (
            <>
              {session.reviewId ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>Review Submitted</span>
                </span>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => onOpenReview?.(session)}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Leave Review</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
