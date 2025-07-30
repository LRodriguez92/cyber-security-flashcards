import React from 'react';
import { BookOpen, Target } from 'lucide-react';
import type { StudyMode } from '../types/flashcard';

interface ModeSelectorProps {
  currentMode: StudyMode;
  onModeChange: (mode: StudyMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Select Mode:</h2>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => onModeChange('study')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            currentMode === 'study'
              ? 'bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-400'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Study Mode
        </button>
        <button
          onClick={() => onModeChange('review')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            currentMode === 'review'
              ? 'bg-purple-600 text-white shadow-lg scale-105 ring-2 ring-purple-400'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Target className="w-5 h-5" />
          Review by Confidence
        </button>
      </div>
    </div>
  );
};

export default ModeSelector; 