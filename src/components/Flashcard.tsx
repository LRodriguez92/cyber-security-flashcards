import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);






  return (
    <div className="relative mb-8 mt-4 sm:mt-6">
             {/* Stacked Card Effect - Background Cards */}
       <div className="absolute inset-0 transform translate-y-2 translate-x-1">
         <div className="w-full min-h-[240px] sm:h-96 md:h-[400px] lg:h-96 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl border border-slate-500/30 shadow-lg opacity-60"></div>
       </div>
       <div className="absolute inset-0 transform translate-y-1 translate-x-0.5">
         <div className="w-full min-h-[240px] sm:h-96 md:h-[400px] lg:h-96 bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl border border-slate-400/40 shadow-md opacity-80"></div>
       </div>
       
               
      
      {/* Shuffle Button - Top Right Corner */}
      <button
        onClick={onShuffle}
        className={`absolute top-4 right-4 z-10 p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center backdrop-blur-sm ${
          isShuffled
            ? 'bg-orange-600/90 text-white shadow-lg scale-110 ring-2 ring-orange-400'
            : 'bg-slate-800/40 text-slate-200 hover:bg-slate-700/50 hover:scale-110 active:scale-95'
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
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center backdrop-blur-sm hidden md:flex ${
            currentCard === 0 || totalCards === 0
              ? 'bg-slate-800/30 text-slate-400 cursor-not-allowed'
              : 'bg-slate-800/40 text-slate-200 hover:bg-slate-700/50 hover:scale-110 active:scale-95'
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
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center backdrop-blur-sm hidden md:flex ${
            currentCard === totalCards - 1 || totalCards === 0
              ? 'bg-slate-800/30 text-slate-400 cursor-not-allowed'
              : 'bg-slate-700/50 text-slate-200 hover:bg-slate-600/60 hover:scale-110 active:scale-95'
          }`}
          aria-label="Go to next card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      
             <motion.div 
                   className="relative w-full min-h-[240px] sm:h-96 md:h-[400px] lg:h-96 cursor-grab active:cursor-grabbing focus:outline-none"
         
         
          onClick={onFlip}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(event, info) => {
            const swipeThreshold = 100;
            
            if (info.offset.x > swipeThreshold && onSwipeRight) {
              setIsSwiping(true);
              setSwipeDirection('right');
              setTimeout(() => {
                setIsSwiping(false);
                setSwipeDirection(null);
                setTimeout(() => {
                  onSwipeRight();
                }, 50);
              }, 300);
            } else if (info.offset.x < -swipeThreshold && onSwipeLeft) {
              setIsSwiping(true);
              setSwipeDirection('left');
              setTimeout(() => {
                setIsSwiping(false);
                setSwipeDirection(null);
                setTimeout(() => {
                  onSwipeLeft();
                }, 50);
              }, 300);
            }
          }}
         whileDrag={{ 
           scale: 1.02,
           rotate: 2,
           zIndex: 10
         }}
                   animate={isSwiping ? {
            x: swipeDirection === 'right' 
              ? window.innerWidth + 100 
              : -window.innerWidth - 100,
            rotate: swipeDirection === 'right' ? 20 : -20,
            scale: 0.8,
            opacity: 0
          } : {
            x: 0,
            rotateY: isFlipped ? 180 : 0,
            scale: 1,
            opacity: 1
          }}
          initial={false}
         transition={{ 
           type: "spring", 
           stiffness: 300, 
           damping: 30,
           duration: isSwiping ? 0.3 : 0.5
         }}
         style={{ transformStyle: 'preserve-3d' }}
         role="button"
         tabIndex={0}
         aria-label={isFlipped ? "Card showing answer - click to reveal answer" : "Card showing question - click to reveal answer"}
         onKeyDown={(e) => {
           if (e.key === 'Enter' || e.key === ' ') {
             e.preventDefault();
             onFlip();
           }
         }}
       >
                 {/* Front of card */}
         <motion.div 
           className={`absolute inset-0 w-full h-full bg-gradient-to-br ${cardColors.front} rounded-2xl border shadow-2xl`} 
           style={{ backfaceVisibility: 'hidden' }}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
         >
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
         </motion.div>

                 {/* Back of card */}
         <motion.div 
           className={`absolute inset-0 w-full h-full bg-gradient-to-br ${cardColors.back} rounded-2xl border shadow-2xl`} 
           style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
         >
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
         </motion.div>
      </motion.div>
      
      {/* Screen reader announcements */}
      <div aria-live="polite" className="sr-only">
        {isFlipped ? 'Card flipped to show answer' : 'Card showing question'}
      </div>
    </div>
  );
};

export default Flashcard; 