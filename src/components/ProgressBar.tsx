import React from 'react';

interface ProgressBarProps {
  currentCard: number;
  totalCards: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentCard, totalCards }) => {
  const progress = totalCards > 0 ? ((currentCard + 1) / totalCards) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-blue-200">
          Card {currentCard + 1} of {totalCards}
        </span>
        <span className="text-sm text-blue-200">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar; 