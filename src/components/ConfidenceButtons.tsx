import React from 'react';

interface ConfidenceButtonsProps {
  answered: boolean;
  onMarkConfidence: (confidenceLevel: string) => void;
}

const ConfidenceButtons: React.FC<ConfidenceButtonsProps> = ({ answered, onMarkConfidence }) => {
  return (
    <div className="mb-8">
      <p className="text-center text-white mb-4 font-medium">How well did you know this?</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
        <button
          onClick={() => onMarkConfidence('knew-it')}
          className={`min-h-[80px] sm:min-h-[100px] flex flex-col items-center justify-center gap-2 p-4 rounded-lg font-semibold transition-all active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            answered 
              ? 'bg-green-900/50 text-green-300 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
          }`}
          disabled={answered}
          aria-label="Mark as knew it right away"
        >
          <span className="text-2xl sm:text-3xl">⚡</span>
          <span className="text-xs sm:text-sm text-center">Knew it right away</span>
        </button>
        
        <button
          onClick={() => onMarkConfidence('quick-think')}
          className={`min-h-[80px] sm:min-h-[100px] flex flex-col items-center justify-center gap-2 p-4 rounded-lg font-semibold transition-all active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            answered 
              ? 'bg-blue-900/50 text-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
          }`}
          disabled={answered}
          aria-label="Mark as had to think for a moment"
        >
          <span className="text-2xl sm:text-3xl">🤔</span>
          <span className="text-xs sm:text-sm text-center">Had to think for a moment</span>
        </button>
        
        <button
          onClick={() => onMarkConfidence('long-think')}
          className={`min-h-[80px] sm:min-h-[100px] flex flex-col items-center justify-center gap-2 p-4 rounded-lg font-semibold transition-all active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            answered 
              ? 'bg-yellow-900/50 text-yellow-300 cursor-not-allowed' 
              : 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg'
          }`}
          disabled={answered}
          aria-label="Mark as had to think for a while"
        >
          <span className="text-2xl sm:text-3xl">🧠</span>
          <span className="text-xs sm:text-sm text-center">Had to think for a while</span>
        </button>
        
        <button
          onClick={() => onMarkConfidence('peeked')}
          className={`min-h-[80px] sm:min-h-[100px] flex flex-col items-center justify-center gap-2 p-4 rounded-lg font-semibold transition-all active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            answered 
              ? 'bg-red-900/50 text-red-300 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
          }`}
          disabled={answered}
          aria-label="Mark as peeked at the answer"
        >
          <span className="text-2xl sm:text-3xl">👀</span>
          <span className="text-xs sm:text-sm text-center">Peeked at the answer</span>
        </button>
      </div>
    </div>
  );
};

export default ConfidenceButtons; 