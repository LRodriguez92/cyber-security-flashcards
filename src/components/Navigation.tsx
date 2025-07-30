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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <button
        onClick={onPrev}
        disabled={currentCard === 0 || totalCards === 0}
        className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Go to previous card"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <button
        onClick={onReset}
        className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Reset quiz and start over"
      >
        <RotateCcw className="w-5 h-5" />
        <span className="hidden sm:inline">Reset Quiz</span>
      </button>

      <button
        onClick={onNext}
        disabled={currentCard === totalCards - 1 || totalCards === 0}
        className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Go to next card"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Navigation; 