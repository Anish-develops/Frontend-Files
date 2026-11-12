import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { SkillCategory, ProficiencyLevel, PriorityLevel } from '../../types';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'teach' | 'learn';
  onAddTeach: (skill: {
    name: string;
    category: SkillCategory;
    proficiency: ProficiencyLevel;
    description?: string;
  }) => void;
  onAddLearn: (skill: {
    name: string;
    category: SkillCategory;
    priority: PriorityLevel;
    learningGoal?: string;
  }) => void;
}

const CATEGORIES: SkillCategory[] = [
  'Engineering & Code',
  'Design & UX',
  'Product & Strategy',
  'Languages & Writing',
  'Data & Analytics',
  'Marketing & Media',
  'Music & Arts',
];

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  mode,
  onAddTeach,
  onAddLearn,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Engineering & Code');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('Advanced');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Skill name is required');
      return;
    }
    setError('');

    if (mode === 'teach') {
      onAddTeach({
        name: name.trim(),
        category,
        proficiency,
        description: details.trim(),
      });
    } else {
      onAddLearn({
        name: name.trim(),
        category,
        priority,
        learningGoal: details.trim(),
      });
    }

    // Reset
    setName('');
    setDetails('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'teach' ? 'Add Teachable Skill' : 'Add Skill to Learn'}
      description={
        mode === 'teach'
          ? 'Share a skill you are confident teaching to other peers.'
          : 'Add a skill you wish to learn from a skilled partner.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-text-primary">
        <Input
          label="Skill Name"
          placeholder={mode === 'teach' ? 'e.g. React Architecture, UI Prototyping' : 'e.g. Conversational Italian, System Design'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          required
        />

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SkillCategory)}
            className="w-full h-10 rounded-[9px] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-subtle"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {mode === 'teach' ? (
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Proficiency Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as ProficiencyLevel[]).map(
                (lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setProficiency(lvl)}
                    className={`py-2 px-2 rounded-[8px] border text-xs font-medium transition-colors ${
                      proficiency === lvl
                        ? 'border-primary bg-primary-soft text-primary-hover ring-1 ring-primary'
                        : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                    }`}
                  >
                    {lvl}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Learning Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPriority(lvl)}
                  className={`py-2 px-2 rounded-[8px] border text-xs font-medium transition-colors ${
                    priority === lvl
                      ? 'border-primary bg-primary-soft text-primary-hover ring-1 ring-primary'
                      : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        <Textarea
          label={mode === 'teach' ? 'Description & Mastery Notes' : 'Learning Goals & Focus'}
          placeholder={
            mode === 'teach'
              ? 'Briefly describe your practical experience and what you can walk a peer through...'
              : 'What specific questions or outcomes are you hoping to achieve in 1:1 sessions?'
          }
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {mode === 'teach' ? 'Save Teachable Skill' : 'Save Learning Target'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
