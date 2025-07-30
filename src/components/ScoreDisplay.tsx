import React from 'react';
import type { ConfidenceTracking } from '../types/flashcard';

interface ScoreDisplayProps {
  confidenceTracking: ConfidenceTracking;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ confidenceTracking }) => {
  return (
    <div className="flex justify-center gap-3 mb-8 flex-wrap">
      <div className="flex items-center gap-2 bg-green-900/30 px-3 py-2 rounded-lg border border-green-500/30">
        <span className="text-lg">⚡</span>
        <span className="text-green-400 font-semibold">Knew it: {confidenceTracking['knew-it'].length}</span>
      </div>
      <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-500/30">
        <span className="text-lg">🤔</span>
        <span className="text-blue-400 font-semibold">Brief think: {confidenceTracking['quick-think'].length}</span>
      </div>
      <div className="flex items-center gap-2 bg-yellow-900/30 px-3 py-2 rounded-lg border border-yellow-500/30">
        <span className="text-lg">🧠</span>
        <span className="text-yellow-400 font-semibold">Long think: {confidenceTracking['long-think'].length}</span>
      </div>
      <div className="flex items-center gap-2 bg-red-900/30 px-3 py-2 rounded-lg border border-red-500/30">
        <span className="text-lg">👀</span>
        <span className="text-red-400 font-semibold">Peeked: {confidenceTracking['peeked'].length}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay; 