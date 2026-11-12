import React from 'react';
import { X } from 'lucide-react';
import { TeachSkill, LearnSkill } from '../../types';

interface SkillTagProps {
  skill: TeachSkill | LearnSkill;
  type: 'teach' | 'learn';
  onDelete?: (id: string) => void;
}

export const SkillTag: React.FC<SkillTagProps> = ({ skill, type, onDelete }) => {
  const isTeach = type === 'teach';
  const teachSkill = skill as TeachSkill;
  const learnSkill = skill as LearnSkill;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] border text-xs font-medium transition-colors ${
        isTeach
          ? 'bg-accent/20 border-accent/40 text-text-primary'
          : 'bg-primary-soft border-primary/30 text-text-primary'
      }`}
    >
      <span className="font-semibold">{skill.name}</span>

      <span
        className={`px-1.5 py-0.5 rounded-[5px] text-[10px] uppercase font-bold tracking-wider ${
          isTeach
            ? 'bg-accent text-accent-fg'
            : 'bg-surface text-text-secondary border border-border'
        }`}
      >
        {isTeach ? teachSkill.proficiency : `${learnSkill.priority}`}
      </span>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(skill.id)}
          className="text-text-secondary hover:text-danger p-0.5 rounded transition-colors ml-0.5"
          title="Remove skill"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
