import React, { useState } from 'react';
import { SessionRequest } from '../../types';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar } from '../ui/avatar';
import { Star, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionRequest | null;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  session,
  onSuccess,
}) => {
  const { user: currentUser } = useAuth();
  const { toast } = useNotification();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!session || !currentUser) return null;

  const isSender = currentUser.id === session.senderId;
  const partnerId = isSender ? session.receiverId : session.senderId;
  const partnerName = isSender ? session.receiverName : session.senderName;
  const partnerAvatar = isSender ? session.receiverAvatar : session.senderAvatar;

  const skillExchangedSummary = isSender
    ? `Taught ${session.teachSkillName} in exchange for ${session.learnSkillName}`
    : `Taught ${session.learnSkillName} in exchange for ${session.teachSkillName}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || feedback.trim().length < 15) {
      setError('Please provide at least 15 characters of constructive feedback.');
      return;
    }
    setError('');

    setIsSubmitting(true);
    try {
      await api.reviews.submit({
        sessionId: session.id,
        recipientId: partnerId,
        rating,
        feedback: feedback.trim(),
        skillExchanged: skillExchangedSummary,
      });

      toast(`Review submitted for ${partnerName}!`, 'success');
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error submitting review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Exchange Session"
      description={`Share your experience swapping skills with ${partnerName}.`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-text-primary">
        {/* Partner header */}
        <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-[10px] border border-border">
          <Avatar src={partnerAvatar} name={partnerName} size="md" />
          <div>
            <h4 className="font-semibold text-text-primary text-sm">{partnerName}</h4>
            <p className="text-xs text-text-secondary font-normal">{skillExchangedSummary}</p>
          </div>
        </div>

        {/* 1-5 Star selector */}
        <div className="text-center py-2">
          <label className="block text-xs font-medium text-text-primary mb-2">
            Overall Exchange Rating
          </label>
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-[6px] focus:outline-none transition-transform"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      active
                        ? 'fill-rating text-rating'
                        : 'text-border stroke-border'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-secondary mt-1.5 font-medium">
            {rating === 5 && 'Outstanding — Highly recommended partner'}
            {rating === 4 && 'Great — Smooth and productive session'}
            {rating === 3 && 'Good — Met expectations'}
            {rating === 2 && 'Fair — Some coordination difficulties'}
            {rating === 1 && 'Poor — Skill exchange was not fulfilled'}
          </p>
        </div>

        {/* Written Feedback */}
        <div>
          <Textarea
            label="Written Feedback"
            placeholder="What was helpful about their teaching? How was their communication and preparation?"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            error={error}
            helperText="Reviews help build trust and community reputation across SkillSwap."
          />
        </div>

        {/* Submit */}
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
            <span>Submit Verified Review</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
