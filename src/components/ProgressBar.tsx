import React from 'react';

interface ProgressBarProps {
  currentCard: number;
  totalCards: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentCard, 
  totalCards, 
  className = "" 
}) => {
  if (totalCards === 0) return null;

  const progress = totalCards > 0 ? ((currentCard + 1) / totalCards) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar Container */}
      <div className="relative w-full h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
        {/* Progress Fill */}
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        
        {/* Progress Glow Effect */}
        <div 
          className="absolute top-0 h-full bg-gradient-to-r from-blue-400/50 to-blue-300/50 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Card Counter */}
      <div className="flex justify-between items-center mt-2 text-sm">
        <span className="text-slate-300 font-medium">
          Card {currentCard + 1} of {totalCards}
        </span>
        <span className="text-slate-400">
          {Math.round(progress)}% complete
        </span>
      </div>
    </div>
  );
};

export default ProgressBar; 