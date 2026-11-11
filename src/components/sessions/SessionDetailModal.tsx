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
      <div className="space-y-5 text-white">
        {/* Header: Partner Info & Status */}
        <div className="flex items-center justify-between p-3.5 bg-[#071322] rounded-2xl border border-lilac-300/15">
          <div className="flex items-center gap-3">
            <Avatar src={partnerAvatar} name={partnerName} size="md" />
            <div>
              <p className="text-xs text-lilac-200/60 font-medium">Exchange Partner</p>
              <h4 className="font-bold text-white text-sm">{partnerName}</h4>
            </div>
          </div>
          <Badge
            variant={
              session.status === 'confirmed'
                ? 'success'
                : session.status === 'pending'
                ? 'warning'
                : session.status === 'completed'
                ? 'default'
                : 'outline'
            }
          >
            {session.status.toUpperCase()}
          </Badge>
        </div>

        {/* 2-Way Reciprocal Breakdown */}
        <div className="p-4 bg-[#071322] rounded-2xl border border-lilac-300/15 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
            <ArrowLeftRight className="w-3.5 h-3.5 text-flame-400" />
            <span>Exchange Agenda</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-flame-950/70 rounded-xl border border-flame-500/30">
              <span className="text-flame-300/80 block mb-1 font-bold text-[10px] uppercase">You Teach:</span>
              <span className="font-bold text-flame-200 text-sm">
                {isSender ? session.teachSkillName : session.learnSkillName}
              </span>
            </div>
            <div className="p-3.5 bg-emerald-950/70 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-300/80 block mb-1 font-bold text-[10px] uppercase">You Learn:</span>
              <span className="font-bold text-emerald-200 text-sm">
                {isSender ? session.learnSkillName : session.teachSkillName}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule & Meeting Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#071322] border border-lilac-300/15 rounded-xl">
            <span className="text-lilac-200/60 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5" /> Date
            </span>
            <span className="font-bold text-white text-sm">{session.proposedDate}</span>
          </div>
          <div className="p-3 bg-[#071322] border border-lilac-300/15 rounded-xl">
            <span className="text-lilac-200/60 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5" /> Time & Duration
            </span>
            <span className="font-bold text-white text-sm">
              {session.proposedTime} ({session.durationMinutes}m)
            </span>
          </div>
          <div className="p-3 bg-[#071322] border border-lilac-300/15 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-lilac-200/60 flex items-center gap-1 mb-1">
              {session.format === 'online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              Format
            </span>
            <span className="font-bold text-white capitalize text-sm">
              {session.format}
            </span>
          </div>
        </div>

        {/* Meeting Link (if confirmed) */}
        {session.status === 'confirmed' && session.locationOrLink && (
          <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-300">Virtual Room Ready</p>
              <p className="text-xs text-emerald-200/70 truncate max-w-xs">{session.locationOrLink}</p>
            </div>
            <a
              href={session.locationOrLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-xs"
            >
              <span>Join Call</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Note */}
        {session.note && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-lilac-200 uppercase tracking-wider">
              Exchange Notes
            </label>
            <p className="p-3 bg-[#071322] rounded-xl border border-lilac-300/15 text-xs text-lilac-100 leading-relaxed">
              {session.note}
            </p>
          </div>
        )}

        {/* Reschedule history if any */}
        {session.rescheduleHistory && session.rescheduleHistory.length > 0 && (
          <div className="space-y-1.5 border-t border-lilac-200/10 pt-3">
            <label className="text-xs font-bold text-lilac-200 uppercase tracking-wider">
              Reschedule History
            </label>
            {session.rescheduleHistory.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-[#071322] rounded-xl text-xs text-lilac-200/80 border border-lilac-300/10">
                <span className="font-bold text-white">{item.proposedBy}</span> proposed{' '}
                <span className="font-bold text-flame-300">{item.proposedDate}</span> at{' '}
                <span className="font-bold text-flame-300">{item.proposedTime}</span>
                {item.note && <p className="mt-1 text-lilac-200/60 italic">&ldquo;{item.note}&rdquo;</p>}
              </div>
            ))}
          </div>
        )}

        {/* Reschedule Form Toggle */}
        {isRescheduling ? (
          <form
            onSubmit={handleRescheduleSubmit}
            className="p-4 bg-[#071322] border border-purple-400/30 rounded-2xl space-y-3"
          >
            <h5 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
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
                variant="outline"
                size="sm"
                onClick={() => setIsRescheduling(false)}
                className="font-bold"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="font-bold shadow-flame">
                Send New Time
              </Button>
            </div>
          </form>
        ) : null}

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-lilac-200/10">
          <Button variant="outline" size="sm" onClick={onClose} className="font-bold">
            Close
          </Button>

          <div className="flex items-center gap-2">
            {(session.status === 'pending' || session.status === 'rescheduled') && (
              <>
                {!isSender ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-400 border-rose-500/30 hover:bg-rose-950/40"
                      onClick={() => {
                        onDecline(session.id);
                        onClose();
                      }}
                    >
                      <X className="w-4 h-4 mr-1" /> Decline
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRescheduling(true)}
                      className="font-bold"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" /> Propose New Time
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onAccept(session.id);
                        onClose();
                      }}
                      className="font-bold shadow-flame"
                    >
                      <Check className="w-4 h-4 mr-1" /> Accept Exchange
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRescheduling(true)}
                    className="font-bold"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" /> Change Proposed Time
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
                className="font-bold shadow-flame"
              >
                <Check className="w-4 h-4 mr-1" /> Mark as Completed
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
                className="font-bold shadow-flame"
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
