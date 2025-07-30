import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ConfidenceTracking } from '../types/flashcard';

interface ScoreDisplayProps {
  confidenceTracking: ConfidenceTracking;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ confidenceTracking }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 sm:mb-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-blue-200 hover:text-blue-100 transition-colors w-full justify-center sm:justify-start focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-2"
        aria-label={isExpanded ? "Hide progress summary" : "Show progress summary"}
        aria-expanded={isExpanded}
      >
        <span>📊</span>
        <span>Progress Summary</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`mt-3 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-2 bg-green-900/30 px-3 py-2 rounded-lg border border-green-500/30">
            <span className="text-lg">⚡</span>
            <span className="text-green-400 font-semibold text-sm sm:text-base">Knew it: {confidenceTracking['knew-it'].length}</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-500/30">
            <span className="text-lg">🤔</span>
            <span className="text-blue-400 font-semibold text-sm sm:text-base">Brief think: {confidenceTracking['quick-think'].length}</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-900/30 px-3 py-2 rounded-lg border border-yellow-500/30">
            <span className="text-lg">🧠</span>
            <span className="text-yellow-400 font-semibold text-sm sm:text-base">Long think: {confidenceTracking['long-think'].length}</span>
          </div>
          <div className="flex items-center gap-2 bg-red-900/30 px-3 py-2 rounded-lg border border-red-500/30">
            <span className="text-lg">👀</span>
            <span className="text-red-400 font-semibold text-sm sm:text-base">Peeked: {confidenceTracking['peeked'].length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay; 