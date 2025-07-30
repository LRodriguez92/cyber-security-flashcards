import React from 'react';

interface ConfidenceButtonsProps {
  answered: boolean;
  onMarkConfidence: (confidenceLevel: string) => void;
}

const ConfidenceButtons: React.FC<ConfidenceButtonsProps> = ({ answered, onMarkConfidence }) => {
  return (
    <div className="mb-8">
      <p className="text-center text-white mb-4 font-medium">How well did you know this?</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        <button
          onClick={() => onMarkConfidence('knew-it')}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg font-semibold transition-all ${
            answered 
              ? 'bg-green-900/50 text-green-300 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 shadow-lg'
          }`}
          disabled={answered}
        >
          <span className="text-2xl">⚡</span>
          <span className="text-sm text-center">Knew it right away</span>
        </button>
        
        <button
          onClick={() => onMarkConfidence('quick-think')}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg font-semibold transition-all ${
            answered 
              ? 'bg-blue-900/50 text-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
          }`}
          disabled={answered}
        >
          <span className="text-2xl">🤔</span>
          <span className="text-sm text-center">Had to think for a moment</span>
        </button>
        
        <button
          onClick={() => onMarkConfidence('long-think')}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg font-semibold transition-all ${
            answered 
              ? 'bg-yellow-900/50 text-yellow-300 cursor-not-allowed' 
              : 'bg-yellow-600 hover:bg-yellow-700 text-white hover:scale-105 shadow-lg'
          }`}
          disabled={answered}
        >
          <span className="text-2xl">🧠</span>
          <span className="text-sm text-center">Had to think for a while</span>
        </button>
        
        <button
          onClick={() => onMarkConfidence('peeked')}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg font-semibold transition-all ${
            answered 
              ? 'bg-red-900/50 text-red-300 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 shadow-lg'
          }`}
          disabled={answered}
        >
          <span className="text-2xl">👀</span>
          <span className="text-sm text-center">Peeked at the answer</span>
        </button>
      </div>
    </div>
  );
};

export default ConfidenceButtons; 