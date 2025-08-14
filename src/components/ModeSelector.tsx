import React from 'react';
import { BookOpen, Target } from 'lucide-react';
import type { StudyMode } from '../types/flashcard';

interface ModeSelectorProps {
  currentMode: StudyMode;
  onModeChange: (mode: StudyMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="mb-3 sm:mb-4">
      {/* Mobile: Stacked layout, Desktop: Side-by-side */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
        <button
          onClick={() => onModeChange('study')}
          className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
            currentMode === 'study'
              ? 'bg-blue-600 text-white shadow-lg scale-[1.02] ring-2 ring-blue-400'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Study Mode</span>
          <span className="sm:hidden">Study</span>
        </button>
        <button
          onClick={() => onModeChange('review')}
          className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
            currentMode === 'review'
              ? 'bg-purple-600 text-white shadow-lg scale-[1.02] ring-2 ring-purple-400'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Review by Confidence</span>
          <span className="sm:hidden">Review</span>
        </button>
      </div>
    </div>
  );
};

export default ModeSelector; 