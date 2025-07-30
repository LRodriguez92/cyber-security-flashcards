import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface NavigationProps {
  currentCard: number;
  totalCards: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentCard, totalCards, onPrev, onNext, onReset }) => {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrev}
        disabled={currentCard === 0 || totalCards === 0}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
        Previous
      </button>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105"
      >
        <RotateCcw className="w-5 h-5" />
        Reset Quiz
      </button>

      <button
        onClick={onNext}
        disabled={currentCard === totalCards - 1 || totalCards === 0}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Navigation; 