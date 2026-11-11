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
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
        isTeach
          ? 'bg-flame-950/70 border-flame-500/40 text-flame-200'
          : 'bg-purple-950/70 border-purple-400/40 text-purple-200'
      }`}
    >
      <span>{skill.name}</span>

      <span
        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
          isTeach
            ? 'bg-flame-900/80 text-flame-300 border border-flame-500/30'
            : 'bg-purple-900/80 text-purple-200 border border-purple-400/30'
        }`}
      >
        {isTeach ? teachSkill.proficiency : `${learnSkill.priority} Priority`}
      </span>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(skill.id)}
          className="text-lilac-400/60 hover:text-rose-400 p-0.5 rounded transition-colors ml-0.5"
          title="Remove skill"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
