import React from 'react';
import { Shuffle } from 'lucide-react';
import type { Flashcard as FlashcardType } from '../types/flashcard';
import { getCardColors } from '../utils/colorUtils';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  isShuffled: boolean;
  onFlip: () => void;
  onShuffle: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, isFlipped, isShuffled, onFlip, onShuffle }) => {
  const cardColors = getCardColors(card.color);

  return (
    <div className="relative mb-8">
      {/* Shuffle Button - Top Right Corner */}
      <button
        onClick={onShuffle}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
          isShuffled
            ? 'bg-orange-600 text-white shadow-lg scale-110 ring-2 ring-orange-400'
            : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:scale-110'
        }`}
        title={isShuffled ? "Turn off shuffle" : "Shuffle cards"}
      >
        <Shuffle className="w-5 h-5" />
      </button>
      
      <div 
        className={`relative w-full h-96 cursor-pointer transition-transform duration-700 transform-gpu ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div className={`absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br ${cardColors.front} rounded-2xl border shadow-2xl`}>
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-white/20 p-3 rounded-full mb-4">
              <div className={`w-8 h-8 ${cardColors.accent} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold">?</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-sm text-white/80">{card.domain}</p>
              {card.objective && (
                <span className="text-xs text-gray-400">Objective {card.objective}</span>
              )}
            </div>
            <p className="text-xl text-white/90 leading-relaxed">
              {card.question}
            </p>
            <p className="text-sm text-white/70 mt-6">Click to reveal answer</p>
          </div>
        </div>

        {/* Back of card */}
        <div className={`absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br ${cardColors.back} rounded-2xl border shadow-2xl rotate-y-180`}>
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-white/20 p-3 rounded-full mb-4">
              <div className={`w-8 h-8 ${cardColors.accent} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Answer</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-sm text-white/80">{card.domain}</p>
              {card.objective && (
                <span className="text-xs text-gray-400">Objective {card.objective}</span>
              )}
            </div>
            <p className="text-lg text-white/90 leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard; 