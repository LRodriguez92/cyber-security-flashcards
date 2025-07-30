import React, { useState } from 'react';
import { Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Flashcard as FlashcardType } from '../types/flashcard';
import { getCardColors } from '../utils/colorUtils';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  isShuffled: boolean;
  onFlip: () => void;
  onShuffle: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  currentCard: number;
  totalCards: number;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  card, 
  isFlipped, 
  isShuffled, 
  onFlip, 
  onShuffle,
  onSwipeLeft,
  onSwipeRight,
  onPrev,
  onNext,
  currentCard,
  totalCards
}) => {
  const cardColors = getCardColors(card.color);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div className="relative mb-8">
      {/* Shuffle Button - Top Right Corner */}
      <button
        onClick={onShuffle}
        className={`absolute top-4 right-4 z-10 p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
          isShuffled
            ? 'bg-orange-600 text-white shadow-lg scale-110 ring-2 ring-orange-400'
            : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:scale-110 active:scale-95'
        }`}
        title={isShuffled ? "Turn off shuffle" : "Shuffle cards"}
        aria-label={isShuffled ? "Turn off shuffle" : "Shuffle cards"}
      >
        <Shuffle className="w-5 h-5" />
      </button>

      {/* Previous Button - Left Side */}
      {onPrev && (
        <button
          onClick={onPrev}
          disabled={currentCard === 0 || totalCards === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
            currentCard === 0 || totalCards === 0
              ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:scale-110 active:scale-95'
          }`}
          aria-label="Go to previous card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next Button - Right Side */}
      {onNext && (
        <button
          onClick={onNext}
          disabled={currentCard === totalCards - 1 || totalCards === 0}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
            currentCard === totalCards - 1 || totalCards === 0
              ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:scale-110 active:scale-95'
          }`}
          aria-label="Go to next card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      
      <div 
        className={`relative w-full min-h-[300px] sm:h-96 md:h-[400px] lg:h-96 cursor-pointer transition-transform duration-700 transform-gpu focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transformStyle: 'preserve-3d' }}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "Card showing answer - click to show question" : "Card showing question - click to reveal answer"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        {/* Front of card */}
        <div className={`absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br ${cardColors.front} rounded-2xl border shadow-2xl`}>
          <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 md:p-8 text-center">
            <div className="bg-white/20 p-3 rounded-full mb-4">
              <div className={`w-8 h-8 ${cardColors.accent} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold">?</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              <p className="text-sm text-white/80">{card.domain}</p>
              {card.objective && (
                <span className="text-xs text-gray-400">Objective {card.objective}</span>
              )}
            </div>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              {card.question}
            </p>
            <p className="text-sm text-white/70 mt-6">Tap to reveal answer</p>
          </div>
        </div>

        {/* Back of card */}
        <div className={`absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br ${cardColors.back} rounded-2xl border shadow-2xl rotate-y-180`}>
          <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 md:p-8 text-center">
            <div className="bg-white/20 p-3 rounded-full mb-4">
              <div className={`w-8 h-8 ${cardColors.accent} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Answer</h2>
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              <p className="text-sm text-white/80">{card.domain}</p>
              {card.objective && (
                <span className="text-xs text-gray-400">Objective {card.objective}</span>
              )}
            </div>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
      </div>
      
      {/* Screen reader announcements */}
      <div aria-live="polite" className="sr-only">
        {isFlipped ? 'Card flipped to show answer' : 'Card showing question'}
      </div>
    </div>
  );
};

export default Flashcard; 