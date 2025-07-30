import React from 'react';
import { RotateCcw } from 'lucide-react';

interface NavigationProps {
  onReset: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onReset }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onReset}
        className="min-h-[44px] px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Reset quiz and start over"
      >
        <RotateCcw className="w-5 h-5 inline mr-2" />
        <span>Reset Quiz</span>
      </button>
    </div>
  );
};

export default Navigation; 