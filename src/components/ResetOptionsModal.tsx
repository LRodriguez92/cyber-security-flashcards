import React from 'react';
import { X } from 'lucide-react';
import type { ConfidenceTracking } from '../types/flashcard';

interface ResetOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: (categoriesToReset: string[]) => void;
  confidenceTracking: ConfidenceTracking;
}

const ResetOptionsModal: React.FC<ResetOptionsModalProps> = ({
  isOpen,
  onClose,
  onReset,
  confidenceTracking
}) => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const confidenceCategories = [
    { id: 'knew-it', name: 'Knew it right away', icon: '⚡', color: 'green', count: confidenceTracking['knew-it'].length },
    { id: 'quick-think', name: 'Had to think for a moment', icon: '🤔', color: 'blue', count: confidenceTracking['quick-think'].length },
    { id: 'long-think', name: 'Had to think for a while', icon: '🧠', color: 'yellow', count: confidenceTracking['long-think'].length },
    { id: 'peeked', name: 'Peeked at the answer', icon: '👀', color: 'red', count: confidenceTracking['peeked'].length }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleReset = () => {
    onReset(selectedCategories);
    onClose();
    setSelectedCategories([]);
  };

  const handleSelectAll = () => {
    setSelectedCategories(confidenceCategories.map(cat => cat.id));
  };

  const handleSelectNone = () => {
    setSelectedCategories([]);
  };

  const handleSelectWeakAreas = () => {
    setSelectedCategories(['long-think', 'peeked']);
  };

  const handleSelectStrongAreas = () => {
    setSelectedCategories(['knew-it', 'quick-think']);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Reset Options</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-300 mb-4">
            Choose which confidence categories to reset. Cards in selected categories will be removed from your progress.
          </p>

          {/* Quick Selection Buttons */}
          <div className="mb-6 space-y-2">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleSelectWeakAreas}
                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reset Weak Areas
              </button>
              <button
                onClick={handleSelectStrongAreas}
                className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Reset Strong Areas
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleSelectNone}
                className="px-3 py-1 text-xs bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Select None
              </button>
            </div>
          </div>

          {/* Individual Category Selection */}
          <div className="space-y-3 mb-6">
            {confidenceCategories.map(category => (
              <label
                key={category.id}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategories.includes(category.id)
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="mr-3 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center flex-1">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <div className="flex-1">
                    <div className="text-white font-medium">{category.name}</div>
                    <div className="text-slate-400 text-sm">{category.count} cards</div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              disabled={selectedCategories.length === 0}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Reset Selected ({selectedCategories.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetOptionsModal;
