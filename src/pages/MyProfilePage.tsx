import React, { useState } from 'react';
import { User, TeachSkill, LearnSkill, ProfileVisibility } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { SkillTag } from '../components/profile/SkillTag';
import { SkillModal } from '../components/profile/SkillModal';
import {
  Save,
  Plus,
  Calendar,
} from 'lucide-react';

export const MyProfilePage: React.FC = () => {
  const { user, updateUserDirectly } = useAuth();
  const { toast } = useNotification();

  if (!user) return null;

  // Local form state
  const [name, setName] = useState(user.name);
  const [headline, setHeadline] = useState(user.headline);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  const [visibility, setVisibility] = useState<ProfileVisibility>(user.visibility);
  const [availabilitySummary, setAvailabilitySummary] = useState(user.availability.summary);
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Skill modal states
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillModalMode, setSkillModalMode] = useState<'teach' | 'learn'>('teach');

  const handleAddInterest = () => {
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter((t) => t !== tag));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.profile.update({
        name,
        headline,
        bio,
        location,
        visibility,
        interests,
        availability: {
          ...user.availability,
          summary: availabilitySummary,
        },
      });
      updateUserDirectly(updated);
      toast('Profile information saved successfully!', 'success');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error updating profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTeachSkill = async (skill: Omit<TeachSkill, 'id'>) => {
    try {
      const updated = await api.profile.addTeachSkill(skill);
      updateUserDirectly(updated);
      toast(`Added "${skill.name}" to skills you teach!`, 'success');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error adding skill', 'error');
    }
  };

  const handleRemoveTeachSkill = async (id: string) => {
    try {
      const updated = await api.profile.removeTeachSkill(id);
      updateUserDirectly(updated);
      toast('Skill removed from teach list.', 'info');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error removing skill', 'error');
    }
  };

  const handleAddLearnSkill = async (skill: Omit<LearnSkill, 'id'>) => {
    try {
      const updated = await api.profile.addLearnSkill(skill);
      updateUserDirectly(updated);
      toast(`Added "${skill.name}" to skills wishlist!`, 'success');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error adding skill', 'error');
    }
  };

  const handleRemoveLearnSkill = async (id: string) => {
    try {
      const updated = await api.profile.removeLearnSkill(id);
      updateUserDirectly(updated);
      toast('Skill removed from wishlist.', 'info');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Error removing skill', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-text-primary">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
          My Profile & Skills
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Manage your reciprocal profile, teachable skills, wishlist, and availability.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Basic Info Card */}
        <div className="p-5 sm:p-7 bg-surface rounded-[14px] border border-border shadow-card space-y-4">
          <h2 className="text-base font-semibold text-text-primary pb-2.5 border-b border-border">
            Personal Information
          </h2>

          <div className="flex items-center gap-3.5">
            <Avatar src={user.avatar} name={name} size="lg" />
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-text-primary">
                Profile Avatar
              </span>
              <p className="text-xs text-text-secondary">
                Connected with your verified SkillSwap account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Headline / Title"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Location / Timezone"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Seattle, WA (PST)"
            />
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">
                Profile Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as ProfileVisibility)}
                className="w-full h-10 rounded-[9px] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-subtle"
              >
                <option value="public">Public (Visible to all members)</option>
                <option value="members_only">Members Only (Requires login)</option>
                <option value="paused">Paused (Hidden from match discovery)</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Bio & Background"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Introduce your domain expertise and learning goals..."
          />

          {/* Interests Manager */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="block text-xs font-medium text-text-primary">
              Focus Areas & Interests
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {interests.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-xs font-medium bg-surface-muted text-text-primary border border-border"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(tag)}
                    className="text-text-secondary hover:text-danger p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add an interest (e.g. Open Source, Coffee)"
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                className="flex-1 h-9 px-3 text-xs rounded-[8px] border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddInterest}
                className="text-xs h-9"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Teachable Skills Section */}
        <div className="p-5 sm:p-7 bg-surface rounded-[14px] border border-border shadow-card space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-text-primary">
                Skills You Can Teach ({user.teachSkills.length})
              </h2>
              <p className="text-xs text-text-secondary">
                These skills will match with peers looking to learn your craft.
              </p>
            </div>
            <Button
              type="button"
              variant="subtle"
              size="sm"
              onClick={() => {
                setSkillModalMode('teach');
                setIsSkillModalOpen(true);
              }}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Teachable Skill</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {user.teachSkills.map((skill) => (
              <SkillTag
                key={skill.id}
                skill={skill}
                type="teach"
                onDelete={handleRemoveTeachSkill}
              />
            ))}
          </div>
        </div>

        {/* Skills to Learn (Wishlist) */}
        <div className="p-5 sm:p-7 bg-surface rounded-[14px] border border-border shadow-card space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-text-primary">
                Skills You Want to Learn ({user.learnSkills.length})
              </h2>
              <p className="text-xs text-text-secondary">
                Our reciprocal algorithm uses these to find skilled teachers.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setSkillModalMode('learn');
                setIsSkillModalOpen(true);
              }}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill to Wishlist</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {user.learnSkills.map((skill) => (
              <SkillTag
                key={skill.id}
                skill={skill}
                type="learn"
                onDelete={handleRemoveLearnSkill}
              />
            ))}
          </div>
        </div>

        {/* Availability Card */}
        <div className="p-5 sm:p-7 bg-surface rounded-[14px] border border-border shadow-card space-y-3.5">
          <h2 className="text-sm sm:text-base font-semibold text-text-primary pb-2.5 border-b border-border flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <span>Availability Window</span>
          </h2>
          <Input
            label="General Availability Summary"
            value={availabilitySummary}
            onChange={(e) => setAvailabilitySummary(e.target.value)}
            helperText="e.g. Tuesday & Thursday evenings (6:00 PM – 9:00 PM PST), Saturday mornings"
          />
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </Button>
        </div>
      </form>

      {/* Skill Modal */}
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
