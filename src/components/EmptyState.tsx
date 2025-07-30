import React from 'react';
import type { StudyMode } from '../types/flashcard';

interface EmptyStateProps {
  currentMode: StudyMode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ currentMode }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📚</div>
      <h3 className="text-2xl font-bold text-white mb-2">
        {currentMode === 'review' ? 'No cards to review' : 'No cards available'}
      </h3>
      <p className="text-blue-200">
        {currentMode === 'review' 
          ? 'Try selecting different confidence categories or study some cards first.'
          : 'Try selecting different domains or switch to review mode.'
        }
      </p>
    </div>
  );
};

export default EmptyState; 