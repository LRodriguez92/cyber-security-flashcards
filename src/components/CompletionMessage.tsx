import React from 'react';
import type { ConfidenceTracking } from '../types/flashcard';

interface CompletionMessageProps {
  confidenceTracking: ConfidenceTracking;
  totalCards: number;
}

const CompletionMessage: React.FC<CompletionMessageProps> = ({ confidenceTracking, totalCards }) => {
  const confidenceScore = Math.round(
    ((confidenceTracking['knew-it'].length * 1 + 
      confidenceTracking['quick-think'].length * 0.8 + 
      confidenceTracking['long-think'].length * 0.6) / totalCards) * 100
  );

  const cardsToReview = confidenceTracking['peeked'].length + confidenceTracking['long-think'].length;

  return (
    <div className="mt-8 text-center bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 rounded-xl border border-green-500/30">
      <h3 className="text-2xl font-bold text-white mb-4">Quiz Complete!</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-green-800/30 p-3 rounded-lg">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-green-400 font-semibold">{confidenceTracking['knew-it'].length}</div>
          <div className="text-xs text-green-300">Instant</div>
        </div>
        <div className="bg-blue-800/30 p-3 rounded-lg">
          <div className="text-2xl mb-1">🤔</div>
          <div className="text-blue-400 font-semibold">{confidenceTracking['quick-think'].length}</div>
          <div className="text-xs text-blue-300">Quick Think</div>
        </div>
        <div className="bg-yellow-800/30 p-3 rounded-lg">
          <div className="text-2xl mb-1">🧠</div>
          <div className="text-yellow-400 font-semibold">{confidenceTracking['long-think'].length}</div>
          <div className="text-xs text-yellow-300">Deep Think</div>
        </div>
        <div className="bg-red-800/30 p-3 rounded-lg">
          <div className="text-2xl mb-1">👀</div>
          <div className="text-red-400 font-semibold">{confidenceTracking['peeked'].length}</div>
          <div className="text-xs text-red-300">Peeked</div>
        </div>
      </div>
      <p className="text-green-400 font-semibold">
        Confidence Score: {confidenceScore}%
      </p>
      <p className="text-blue-200 text-sm mt-2">
        Cards to review: {cardsToReview}
      </p>
    </div>
  );
};

export default CompletionMessage; 