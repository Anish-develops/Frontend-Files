import React, { useState } from 'react';
import { SessionRequest } from '../../types';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ArrowLeftRight,
  RotateCcw,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionRequest | null;
  onAccept: (sessionId: string) => void;
  onDecline: (sessionId: string) => void;
  onReschedule: (
    sessionId: string,
    details: { proposedDate: string; proposedTime: string; note?: string }
  ) => void;
  onMarkCompleted: (sessionId: string) => void;
  onOpenReview: (session: SessionRequest) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  isOpen,
  onClose,
  session,
  onAccept,
  onDecline,
  onReschedule,
  onMarkCompleted,
  onOpenReview,
}) => {
  const { user: currentUser } = useAuth();
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('18:00');
  const [rescheduleNote, setRescheduleNote] = useState('');

  if (!session || !currentUser) return null;

  const isSender = currentUser.id === session.senderId;
  const partnerName = isSender ? session.receiverName : session.senderName;
  const partnerAvatar = isSender ? session.receiverAvatar : session.senderAvatar;

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    onReschedule(session.id, {
      proposedDate: newDate,
      proposedTime: newTime,
      note: rescheduleNote,
    });
    setIsRescheduling(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Session Details"
      description={`Exchange coordination between you and ${partnerName}.`}
      maxWidth="lg"
    >
      <div className="space-y-4 text-text-primary">
        {/* Header: Partner Info & Status */}
        <div className="flex items-center justify-between p-3 bg-surface-muted rounded-[10px] border border-border">
          <div className="flex items-center gap-3">
            <Avatar src={partnerAvatar} name={partnerName} size="md" />
            <div>
              <p className="text-xs text-text-secondary font-normal">Exchange Partner</p>
              <h4 className="font-semibold text-text-primary text-sm">{partnerName}</h4>
            </div>
          </div>
          <Badge
            variant={
              session.status === 'confirmed'
                ? 'success'
                : session.status === 'pending'
                ? 'warning'
                : session.status === 'completed'
                ? 'secondary'
                : 'outline'
            }
          >
            {session.status.toUpperCase()}
          </Badge>
        </div>

        {/* 2-Way Reciprocal Breakdown */}
        <div className="p-3.5 bg-surface-muted rounded-[10px] border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-primary uppercase tracking-wider">
            <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
            <span>Exchange Agenda</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-surface rounded-[8px] border border-border">
              <span className="text-text-secondary block mb-1 font-semibold text-[10px] uppercase">You Teach:</span>
              <span className="font-semibold text-primary-hover text-sm">
                {isSender ? session.teachSkillName : session.learnSkillName}
              </span>
            </div>
            <div className="p-3 bg-surface rounded-[8px] border border-border">
              <span className="text-text-secondary block mb-1 font-semibold text-[10px] uppercase">You Learn:</span>
              <span className="font-semibold text-success text-sm">
                {isSender ? session.learnSkillName : session.teachSkillName}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule & Meeting Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 bg-surface-muted border border-border rounded-[8px]">
            <span className="text-text-secondary flex items-center gap-1 mb-1 font-medium">
              <Calendar className="w-3.5 h-3.5" /> Date
            </span>
            <span className="font-semibold text-text-primary text-sm">{session.proposedDate}</span>
          </div>
          <div className="p-2.5 bg-surface-muted border border-border rounded-[8px]">
            <span className="text-text-secondary flex items-center gap-1 mb-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> Time & Duration
            </span>
            <span className="font-semibold text-text-primary text-sm">
              {session.proposedTime} ({session.durationMinutes}m)
            </span>
          </div>
          <div className="p-2.5 bg-surface-muted border border-border rounded-[8px] col-span-2 sm:col-span-1">
            <span className="text-text-secondary flex items-center gap-1 mb-1 font-medium">
              {session.format === 'online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              Format
            </span>
            <span className="font-semibold text-text-primary capitalize text-sm">
              {session.format}
            </span>
          </div>
        </div>

        {/* Meeting Link (if confirmed) */}
        {session.status === 'confirmed' && session.locationOrLink && (
          <div className="p-3 bg-success-soft border border-success/25 rounded-[10px] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-success">Virtual Room Ready</p>
              <p className="text-xs text-text-secondary truncate max-w-xs">{session.locationOrLink}</p>
            </div>
            <a
              href={session.locationOrLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-success text-white text-xs font-medium rounded-[8px] hover:opacity-90 transition-opacity shadow-subtle"
            >
              <span>Join Call</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Note */}
        {session.note && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">
              Exchange Notes
            </label>
            <p className="p-3 bg-surface-muted rounded-[8px] border border-border text-xs text-text-primary leading-relaxed">
              {session.note}
            </p>
          </div>
        )}

        {/* Reschedule history if any */}
        {session.rescheduleHistory && session.rescheduleHistory.length > 0 && (
          <div className="space-y-1.5 border-t border-border pt-3">
            <label className="text-xs font-medium text-text-secondary">
              Reschedule History
            </label>
            {session.rescheduleHistory.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-surface-muted rounded-[8px] text-xs text-text-secondary border border-border">
                <span className="font-semibold text-text-primary">{item.proposedBy}</span> proposed{' '}
                <span className="font-medium text-primary">{item.proposedDate}</span> at{' '}
                <span className="font-medium text-primary">{item.proposedTime}</span>
                {item.note && <p className="mt-1 text-text-secondary italic">&ldquo;{item.note}&rdquo;</p>}
              </div>
            ))}
          </div>
        )}

        {/* Reschedule Form Toggle */}
        {isRescheduling ? (
          <form
            onSubmit={handleRescheduleSubmit}
            className="p-3.5 bg-surface-muted border border-border rounded-[10px] space-y-3"
          >
            <h5 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Propose New Date & Time
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="New Date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <Input
                label="New Time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
              />
            </div>
            <Textarea
              label="Reason / Note"
              placeholder="Why this time works better..."
              rows={2}
              value={rescheduleNote}
              onChange={(e) => setRescheduleNote(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsRescheduling(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Send New Time
              </Button>
            </div>
          </form>
        ) : null}

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            {(session.status === 'pending' || session.status === 'rescheduled') && (
              <>
                {!isSender ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-danger hover:bg-danger-soft"
                      onClick={() => {
                        onDecline(session.id);
                        onClose();
                      }}
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Decline
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsRescheduling(true)}
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Propose New Time
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onAccept(session.id);
                        onClose();
                      }}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Accept Exchange
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsRescheduling(true)}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Change Proposed Time
                  </Button>
                )}
              </>
            )}

            {session.status === 'confirmed' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onMarkCompleted(session.id);
                  onClose();
                }}
              >
                <Check className="w-3.5 h-3.5 mr-1" /> Mark as Completed
              </Button>
            )}

            {session.status === 'completed' && !session.reviewId && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenReview(session);
                }}
              >
                Leave Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
