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
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <Input
          label="Skill Name"
          placeholder={mode === 'teach' ? 'e.g. React Architecture, UI Prototyping' : 'e.g. Conversational Italian, System Design'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          required
        />

        <div>
          <label className="block text-xs font-bold text-lilac-200 tracking-wider uppercase mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SkillCategory)}
            className="w-full h-11 rounded-xl border border-lilac-300/20 bg-[#071322] px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-flame-500 font-bold"
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
            <label className="block text-xs font-bold text-lilac-200 tracking-wider uppercase mb-1.5">
              Proficiency Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as ProficiencyLevel[]).map(
                (lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setProficiency(lvl)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                      proficiency === lvl
                        ? 'border-flame-500 bg-flame-950/80 text-flame-300 ring-1 ring-flame-500'
                        : 'border-lilac-300/20 bg-[#071322] text-lilac-200/80 hover:text-white'
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
            <label className="block text-xs font-bold text-lilac-200 tracking-wider uppercase mb-1.5">
              Learning Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPriority(lvl)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                    priority === lvl
                      ? 'border-purple-400 bg-purple-950/80 text-purple-200 ring-1 ring-purple-400'
                      : 'border-lilac-300/20 bg-[#071322] text-lilac-200/80 hover:text-white'
                  }`}
                >
                  {lvl} Priority
                </button>
              ))}
            </div>
          </div>
        )}

        <Textarea
          label={mode === 'teach' ? 'Topics / Highlights (Optional)' : 'Specific Learning Goal (Optional)'}
          placeholder={
            mode === 'teach'
              ? 'e.g. Custom hooks, state management, container queries...'
              : 'e.g. Master auto layout components and color token variables in Figma...'
          }
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-lilac-200/10">
          <Button type="button" variant="outline" size="md" onClick={onClose} className="font-bold">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="font-bold shadow-flame">
            Save Skill
          </Button>
        </div>
      </form>
    </Modal>
  );
};
