import React from 'react';
import type { ConfidenceTracking } from '../types/flashcard';

interface StudyFilterProps {
  studyFilter: 'all' | 'unanswered';
  onStudyFilterChange: (filter: 'all' | 'unanswered') => void;
  confidenceTracking: ConfidenceTracking;
}

const StudyFilter: React.FC<StudyFilterProps> = ({
  studyFilter,
  onStudyFilterChange,
  confidenceTracking
}) => {
  // Count answered cards
  const allCardIds = new Set<string>();
  Object.values(confidenceTracking).forEach(cardIds => {
    cardIds.forEach((id: string) => allCardIds.add(id));
  });

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-300 mb-3">
        Choose which cards to study:
      </div>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="radio"
            name="studyFilter"
            value="all"
            checked={studyFilter === 'all'}
            onChange={(e) => onStudyFilterChange(e.target.value as 'all' | 'unanswered')}
            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
          />
          <div className="flex-1">
            <div className="text-white font-medium">All Cards</div>
            <div className="text-slate-400 text-sm">Study all cards in the selected domains</div>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="radio"
            name="studyFilter"
            value="unanswered"
            checked={studyFilter === 'unanswered'}
            onChange={(e) => onStudyFilterChange(e.target.value as 'all' | 'unanswered')}
            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
          />
          <div className="flex-1">
            <div className="text-white font-medium">Unanswered Cards</div>
            <div className="text-slate-400 text-sm">
              Study only cards you haven't answered yet ({allCardIds.size} cards answered so far)
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default StudyFilter;
