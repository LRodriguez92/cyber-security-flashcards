import React from 'react';

interface ProgressSummaryProps {
  confidenceTracking: {
    'knew-it': any[];
    'quick-think': any[];
    'long-think': any[];
    'peeked': any[];
  };
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ confidenceTracking }) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-600/30 p-3 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="flex items-center gap-1.5 bg-green-900/30 px-2 py-1.5 rounded-lg border border-green-500/30">
          <span className="text-sm">⚡</span>
          <span className="text-green-400 font-semibold text-xs">Knew: {confidenceTracking['knew-it'].length}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-900/30 px-2 py-1.5 rounded-lg border border-blue-500/30">
          <span className="text-sm">🤔</span>
          <span className="text-blue-400 font-semibold text-xs">Brief: {confidenceTracking['quick-think'].length}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-900/30 px-2 py-1.5 rounded-lg border border-yellow-500/30">
          <span className="text-sm">🧠</span>
          <span className="text-yellow-400 font-semibold text-xs">Long: {confidenceTracking['long-think'].length}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-red-900/30 px-2 py-1.5 rounded-lg border border-red-500/30">
          <span className="text-sm">👀</span>
          <span className="text-red-400 font-semibold text-xs">Peek: {confidenceTracking['peeked'].length}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
