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
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          My Profile & Skills
        </h1>
        <p className="text-xs sm:text-sm text-lilac-200/80 mt-1 font-medium">
          Manage your reciprocal profile, teachable skills, wishlist, and availability.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Basic Info Card */}
        <div className="p-7 sm:p-9 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-6">
          <h2 className="text-lg font-black text-white pb-3 border-b border-lilac-200/10 uppercase tracking-tight">
            Personal Information
          </h2>

          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} name={name} size="xl" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-lilac-200 uppercase tracking-wider">
                Profile Avatar
              </span>
              <p className="text-xs text-lilac-200/60">
                Connected with your verified SkillSwap account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location / Timezone"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Seattle, WA (PST)"
            />
            <div>
              <label className="block text-xs font-bold text-lilac-200 tracking-wider uppercase mb-1.5">
                Profile Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as ProfileVisibility)}
                className="w-full h-11 rounded-xl border border-lilac-300/20 bg-[#071322] px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-flame-500 font-bold"
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
            rows={4}
            placeholder="Introduce your domain expertise and learning goals..."
          />

          {/* Interests Manager */}
          <div className="space-y-2 pt-2 border-t border-lilac-200/10">
            <label className="block text-xs font-bold text-lilac-200 tracking-wider uppercase">
              Focus Areas & Interests
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {interests.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#071322] text-lilac-200 border border-lilac-300/20"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(tag)}
                    className="text-lilac-400 hover:text-rose-400 p-0.5"
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
                className="flex-1 h-10 px-3 text-xs rounded-xl border border-lilac-300/20 bg-[#071322] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-flame-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddInterest}
                className="text-xs font-bold h-10"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Teachable Skills Section */}
        <div className="p-7 sm:p-9 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-lilac-200/10">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                Skills You Can Teach ({user.teachSkills.length})
              </h2>
              <p className="text-xs text-lilac-200/70 font-medium">
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
              className="gap-1.5 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Teachable Skill</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
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
        <div className="p-7 sm:p-9 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-lilac-200/10">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                Skills You Want to Learn ({user.learnSkills.length})
              </h2>
              <p className="text-xs text-lilac-200/70 font-medium">
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
              className="gap-1.5 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill to Wishlist</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
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
        <div className="p-7 sm:p-9 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-4">
          <h2 className="text-base font-black text-white pb-3 border-b border-lilac-200/10 flex items-center gap-2 uppercase tracking-tight">
            <Calendar className="w-4 h-4 text-lilac-400" />
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
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            className="gap-2 shadow-flame font-bold"
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
