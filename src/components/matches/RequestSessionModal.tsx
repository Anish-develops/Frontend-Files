import React, { useState } from 'react';
import { ReciprocalMatch, User } from '../../types';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar } from '../ui/avatar';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { ArrowLeftRight, Calendar, Clock, Video, MapPin, CheckCircle2 } from 'lucide-react';

interface RequestSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  match?: ReciprocalMatch | null;
  targetMember?: User | null;
  onSuccess?: () => void;
}

export const RequestSessionModal: React.FC<RequestSessionModalProps> = ({
  isOpen,
  onClose,
  match,
  targetMember: propTargetMember,
  onSuccess,
}) => {
  const { user: currentUser } = useAuth();
  const { toast } = useNotification();

  const partner = match ? match.member : propTargetMember;

  // Form states
  const [teachSkillName, setTeachSkillName] = useState<string>('');
  const [learnSkillName, setLearnSkillName] = useState<string>('');
  const [proposedDate, setProposedDate] = useState<string>('');
  const [proposedTime, setProposedTime] = useState<string>('18:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [format, setFormat] = useState<'online' | 'in_person'>('online');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize skills when modal opens
  React.useEffect(() => {
    if (isOpen && partner && currentUser) {
      if (match && match.youTeach.length > 0) {
        setTeachSkillName(match.youTeach[0]);
      } else if (currentUser.teachSkills.length > 0) {
        setTeachSkillName(currentUser.teachSkills[0].name);
      }

      if (match && match.theyTeach.length > 0) {
        setLearnSkillName(match.theyTeach[0]);
      } else if (partner.teachSkills.length > 0) {
        setLearnSkillName(partner.teachSkills[0].name);
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      setProposedDate(tomorrow.toISOString().split('T')[0]);
      setNote(
        `Hi ${partner.name.split(' ')[0]}, let's do a 1:1 swap. I can share deep insights on ${
          match && match.youTeach.length > 0 ? match.youTeach[0] : 'my skills'
        }, and would love to learn ${
          match && match.theyTeach.length > 0 ? match.theyTeach[0] : 'from your experience'
        }.`
      );
    }
  }, [isOpen, match, partner, currentUser]);

  if (!partner || !currentUser) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!teachSkillName) errs.teachSkill = 'Select a skill you will teach';
    if (!learnSkillName) errs.learnSkill = 'Select a skill to learn';
    if (!proposedDate) errs.date = 'Select a proposed date';
    if (!proposedTime) errs.time = 'Select a proposed time';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.sessions.create({
        receiverId: partner.id,
        teachSkillName,
        learnSkillName,
        proposedDate,
        proposedTime,
        durationMinutes,
        format,
        note: note.trim(),
      });

      toast('Exchange request sent successfully! Partner notified.', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error submitting request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Skill Exchange"
      description={`Coordinate a 1:1 reciprocal exchange session with ${partner.name}.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-text-primary">
        {/* Partner Header */}
        <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-[10px] border border-border">
          <Avatar src={partner.avatar} name={partner.name} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-text-primary text-sm">{partner.name}</h4>
            <p className="text-xs text-text-secondary truncate">{partner.headline}</p>
            <p className="text-[11px] text-text-secondary mt-0.5">Availability: {partner.availability.summary}</p>
          </div>
        </div>

        {/* 2-Way Reciprocal Swap Configuration */}
        <div className="p-3.5 bg-surface-muted rounded-[10px] border border-border space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-primary uppercase tracking-wider">
            <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
            <span>Reciprocal Value Exchange</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* What you teach */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                You will teach:
              </label>
              <select
                value={teachSkillName}
                onChange={(e) => setTeachSkillName(e.target.value)}
                className="w-full h-10 rounded-[9px] border border-border bg-surface px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              >
                {currentUser.teachSkills.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.proficiency})
                  </option>
                ))}
              </select>
              {errors.teachSkill && <p className="text-xs text-danger mt-1">{errors.teachSkill}</p>}
            </div>

            {/* What they teach */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                {partner.name.split(' ')[0]} will teach:
              </label>
              <select
                value={learnSkillName}
                onChange={(e) => setLearnSkillName(e.target.value)}
                className="w-full h-10 rounded-[9px] border border-border bg-surface px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              >
                {partner.teachSkills.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.proficiency})
                  </option>
                ))}
              </select>
              {errors.learnSkill && <p className="text-xs text-danger mt-1">{errors.learnSkill}</p>}
            </div>
          </div>
        </div>

        {/* Date, Time & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-text-secondary" />
              <span>Proposed Date</span>
            </label>
            <Input
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              error={errors.date}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-text-secondary" />
              <span>Proposed Time</span>
            </label>
            <select
              value={proposedTime}
              onChange={(e) => setProposedTime(e.target.value)}
              className="w-full h-10 rounded-[9px] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-subtle"
            >
              <option value="09:00">09:00 AM</option>
              <option value="10:30">10:30 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
              <option value="18:30">06:30 PM</option>
              <option value="19:30">07:30 PM</option>
              <option value="20:30">08:30 PM</option>
            </select>
            {errors.time && <p className="text-xs text-danger mt-1">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Duration
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full h-10 rounded-[9px] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-subtle"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Session Format
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setFormat('online')}
              className={`flex items-center gap-2 p-2.5 rounded-[9px] border text-xs font-medium transition-colors ${
                format === 'online'
                  ? 'border-primary bg-primary-soft text-primary-hover ring-1 ring-primary'
                  : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted'
              }`}
            >
              <Video className="w-4 h-4 text-primary shrink-0" />
              <div className="text-left">
                <span className="block font-semibold">Online Video Call</span>
                <span className="text-[11px] text-text-secondary font-normal">Google Meet link generated</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('in_person')}
              className={`flex items-center gap-2 p-2.5 rounded-[9px] border text-xs font-medium transition-colors ${
                format === 'in_person'
                  ? 'border-primary bg-primary-soft text-primary-hover ring-1 ring-primary'
                  : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted'
              }`}
            >
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <div className="text-left">
                <span className="block font-semibold">In-Person Meetup</span>
                <span className="text-[11px] text-text-secondary font-normal">Local workspace or cafe</span>
              </div>
            </button>
          </div>
        </div>

        {/* Note / Message */}
        <div>
          <Textarea
            label="Introductory Note & Agenda"
            placeholder="Share what specific topics you'd like to dive into and how you plan to split the exchange time..."
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            error={errors.note}
            helperText="Clear expectations make peer exchanges much more productive."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Send Exchange Request</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
