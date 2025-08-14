import React from 'react';
import type { ConfidenceCategory, ConfidenceTracking } from '../types/flashcard';

interface ConfidenceFilterProps {
  confidenceCategories: ConfidenceCategory[];
  selectedConfidenceCategories: string[];
  confidenceTracking: ConfidenceTracking;
  onConfidenceCategoryChange: (categoryId: string) => void;
}

const ConfidenceFilter: React.FC<ConfidenceFilterProps> = ({
  confidenceCategories,
  selectedConfidenceCategories,
  confidenceTracking,
  onConfidenceCategoryChange
}) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {confidenceCategories.map(category => (
          <button
            key={category.id}
            onClick={() => onConfidenceCategoryChange(category.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg font-medium transition-all ${
              selectedConfidenceCategories.includes(category.id)
                ? `bg-${category.color}-600 text-white shadow-lg scale-105 ring-2 ring-${category.color}-400`
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span className="text-2xl">{category.icon}</span>
            <span className="text-sm text-center">{category.name}</span>
            <span className="text-xs opacity-75">
              ({confidenceTracking[category.id as keyof ConfidenceTracking].length} cards)
            </span>
          </button>
        ))}
      </div>
      {selectedConfidenceCategories.length === 0 && (
        <p className="text-sm text-yellow-300 mt-2 text-center">
          Please select at least one confidence category to review
        </p>
      )}
      {selectedConfidenceCategories.length > 0 && (
        <p className="text-sm text-purple-300 mt-2 text-center">
          Reviewing {selectedConfidenceCategories.length} categor{selectedConfidenceCategories.length > 1 ? 'ies' : 'y'}: {selectedConfidenceCategories.map(id => confidenceCategories.find(c => c.id === id)?.name).join(', ')}
        </p>
      )}
    </div>
  );
};

export default ConfidenceFilter; 