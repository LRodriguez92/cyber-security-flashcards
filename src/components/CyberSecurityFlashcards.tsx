import React, { useState, useEffect, useRef } from 'react';
import { Settings, ChevronDown, X } from 'lucide-react';
import { useFlashcardState } from '../hooks/useFlashcardState';

import { getFilteredCards } from '../utils/cardUtils';
import { domains, confidenceCategories } from '../data/flashcards';


// Import components
import Header from './Header';
import ModeSelector from './ModeSelector';
import DomainFilter from './DomainFilter';
import ConfidenceFilter from './ConfidenceFilter';

import Flashcard from './Flashcard';
import ConfidenceButtons from './ConfidenceButtons';
import Navigation from './Navigation';
import CompletionMessage from './CompletionMessage';
import EmptyState from './EmptyState';

const CyberSecurityFlashcards: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingDomains, setPendingDomains] = useState<string[]>([]);
  const [pendingConfidenceCategories, setPendingConfidenceCategories] = useState<string[]>([]);
  const filtersRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const {
    // State
    currentCard,
    isFlipped,
    answered,
    selectedDomains,
    confidenceTracking,
    currentMode,
    selectedConfidenceCategories,
    isShuffled,
    
    // Actions
    resetState,
    nextCard,
    prevCard,
    flipCard,
    markConfidence,
    shuffleCards,
    switchMode,
    getCurrentCardData,
    
    // Setters
    setCurrentCard,
    setIsFlipped,
    setAnswered,
    setSelectedDomains,
    setSelectedConfidenceCategories,
    setIsShuffled,
    setShuffledIndices,
  } = useFlashcardState();

  useEffect(() => {
    if (currentMode === 'review') {
      setShowFilters(true);
    } else if (currentMode === 'study') {
      setShowFilters(false);
    }
  }, [currentMode]);

  // Click outside handler for mobile overlays
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilters && filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      if (isExpanded && statsRef.current && !statsRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters, isExpanded]);

  // Get filtered cards based on current state
  const filteredCards = getFilteredCards(
    selectedDomains,
    currentMode,
    selectedConfidenceCategories,
    confidenceTracking
  );

  // Get current card data
  const currentCardData = getCurrentCardData(filteredCards);



  // Handle confidence marking with current card data
  const handleMarkConfidence = (confidenceLevel: string) => {
    markConfidence(confidenceLevel, currentCardData);
  };

  // Handle shuffle with filtered cards
  const handleShuffle = () => {
    shuffleCards(filteredCards);
  };

  // Initialize pending state when filters are opened
  const handleOpenFilters = () => {
    if (currentMode === 'study') {
      setPendingDomains(selectedDomains);
    } else {
      setPendingConfidenceCategories(selectedConfidenceCategories);
    }
    setShowFilters(true);
    setIsExpanded(false);
  };

  // Handle pending domain changes
  const handlePendingDomainChange = (domainId: string) => {
    if (domainId === 'all') {
      setPendingDomains(['all']);
    } else {
      setPendingDomains(prev => {
        const withoutAll = prev.filter(id => id !== 'all');
        
        if (withoutAll.includes(domainId)) {
          const newSelection = withoutAll.filter(id => id !== domainId);
          return newSelection.length === 0 ? ['all'] : newSelection;
        } else {
          return [...withoutAll, domainId];
        }
      });
    }
  };

  // Handle pending confidence category changes
  const handlePendingConfidenceCategoryChange = (categoryId: string) => {
    setPendingConfidenceCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Confirm and apply changes
  const handleConfirmChanges = () => {
    if (currentMode === 'study') {
      // Apply domain changes
      setSelectedDomains(pendingDomains);
      setCurrentCard(0);
      setIsFlipped(false);
      setAnswered(false);
      setIsShuffled(false);
      setShuffledIndices([]);
    } else {
      // Apply confidence category changes
      setSelectedConfidenceCategories(pendingConfidenceCategories);
      setCurrentCard(0);
      setIsFlipped(false);
      setAnswered(false);
      setIsShuffled(false);
      setShuffledIndices([]);
    }
    setShowFilters(false);
  };

  // Cancel changes
  const handleCancelChanges = () => {
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-2 sm:p-2 lg:p-3 mobile-safe-padding">

      
      <div className="max-w-4xl mx-auto pt-4 sm:pt-6 lg:pt-8">
        <Header />



        <ModeSelector 
          currentMode={currentMode}
          onModeChange={switchMode}
        />

                 {/* Side-by-side Study Options and Progress Summary */}
         <div className="mb-4 sm:mb-6 mt-4 sm:mt-6 relative">
           {/* Backdrop overlay for both mobile and desktop */}
           {(showFilters || isExpanded) && (
             <div 
               className="fixed inset-0 bg-black/30 backdrop-blur-sm mobile-backdrop transition-opacity duration-300 z-20"
               onClick={() => {
                 setShowFilters(false);
                 setIsExpanded(false);
               }}
               style={{ pointerEvents: showFilters || isExpanded ? 'auto' : 'none' }}
             />
           )}
          <div className="flex gap-3">
            {/* Study Options */}
            <div className="flex-1">
                             <button 
                 onClick={() => {
                   if (showFilters) {
                     setShowFilters(false);
                   } else {
                     handleOpenFilters();
                   }
                 }}
                 className="flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm"
                 aria-label={showFilters ? "Hide study options" : "Show study options"}
                 aria-expanded={showFilters}
               >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">
                  {currentMode === 'review' ? 'Select Categories' : 'Select Domains'}
                </span>
                <span className="xs:hidden">
                  {currentMode === 'review' ? 'Categories' : 'Domains'}
                </span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Progress Summary Toggle */}
            <div className="flex-1">
                             <button 
                 onClick={() => {
                   if (isExpanded) {
                     setIsExpanded(false);
                   } else {
                     setIsExpanded(true);
                     setShowFilters(false); // Close filters if open
                   }
                 }}
                 className="flex items-center gap-1.5 sm:gap-2 text-blue-200 hover:text-blue-100 transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm"
                 aria-label={isExpanded ? "Hide progress summary" : "Show progress summary"}
                 aria-expanded={isExpanded}
               >
                <span>📊</span>
                <span className="hidden xs:inline">Progress</span>
                <span className="xs:hidden">Stats</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
                     {/* Expanded content areas - Mobile overlay, Desktop inline */}
           <div className="mt-2 space-y-2 sm:block">
             {/* Study Options Content */}
             <div ref={filtersRef} className={`${showFilters ? 'block' : 'hidden'} absolute top-full left-0 right-0 mobile-overlay bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-600/50 shadow-2xl transition-all duration-300 ease-out z-30 ${showFilters ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
               <div className="p-4">
                 {/* Close button for both mobile and desktop */}
                 <div className="flex justify-end mb-3">
                   <button
                     onClick={() => setShowFilters(false)}
                     className="text-white/70 hover:text-white transition-colors p-1"
                     aria-label="Close filters"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
                {currentMode === 'study' && (
                  <DomainFilter
                    domains={domains}
                    selectedDomains={pendingDomains}
                    onDomainChange={handlePendingDomainChange}
                  />
                )}
                {currentMode === 'review' && (
                  <ConfidenceFilter
                    confidenceCategories={confidenceCategories}
                    selectedConfidenceCategories={pendingConfidenceCategories}
                    confidenceTracking={confidenceTracking}
                    onConfidenceCategoryChange={handlePendingConfidenceCategoryChange}
                  />
                )}
                
                {/* Confirm/Cancel Buttons */}
                <div className="flex gap-3 mt-6 justify-center">
                  <button
                    onClick={handleCancelChanges}
                    className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmChanges}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>

                         {/* Progress Summary Content */}
             <div ref={statsRef} className={`${isExpanded ? 'block' : 'hidden'} absolute top-full left-0 right-0 mobile-overlay bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-600/50 shadow-2xl transition-all duration-300 ease-out z-30 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
               <div className="p-4">
                 {/* Close button for both mobile and desktop */}
                 <div className="flex justify-end mb-3">
                   <button
                     onClick={() => setIsExpanded(false)}
                     className="text-white/70 hover:text-white transition-colors p-1"
                     aria-label="Close stats"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-green-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-green-500/30">
                    <span className="text-sm sm:text-lg">⚡</span>
                    <span className="text-green-400 font-semibold text-xs sm:text-sm">Knew: {confidenceTracking['knew-it'].length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-blue-500/30">
                    <span className="text-sm sm:text-lg">🤔</span>
                    <span className="text-blue-400 font-semibold text-xs sm:text-sm">Brief: {confidenceTracking['quick-think'].length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-yellow-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-yellow-500/30">
                    <span className="text-sm sm:text-lg">🧠</span>
                    <span className="text-yellow-400 font-semibold text-xs sm:text-sm">Long: {confidenceTracking['long-think'].length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-red-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-red-500/30">
                    <span className="text-sm sm:text-lg">👀</span>
                    <span className="text-red-400 font-semibold text-xs sm:text-sm">Peek: {confidenceTracking['peeked'].length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flashcard or Empty State */}
        <div className="mt-4 sm:mt-6 flex flex-col min-h-0 flex-1">
          {filteredCards.length > 0 ? (
          <>
            <Flashcard
              key={`${currentCard}-${currentCardData?.question}-${currentCardData?.domain}`}
              card={currentCardData!}
              isFlipped={isFlipped}
              isShuffled={isShuffled}
              onFlip={flipCard}
              onShuffle={handleShuffle}
              onSwipeLeft={nextCard}
              onSwipeRight={prevCard}
              onPrev={prevCard}
              onNext={nextCard}
              currentCard={currentCard}
              totalCards={filteredCards.length}
            />

            {/* Confidence Buttons - Only show in study mode */}
            {currentMode === 'study' && isFlipped && (
              <div className="relative z-30">
                <ConfidenceButtons
                  answered={answered}
                  onMarkConfidence={handleMarkConfidence}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState currentMode={currentMode} />
        )}

        {/* Spacer to push navigation to bottom on mobile */}
        <div className="flex-1 min-h-[60px] sm:min-h-0"></div>

        <Navigation onReset={resetState} hidden={currentMode === 'study' && isFlipped && !answered} />

        {/* Completion Message */}
        {currentCard === filteredCards.length - 1 && answered && filteredCards.length > 0 && (
          <CompletionMessage 
            confidenceTracking={confidenceTracking}
            totalCards={filteredCards.length}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default CyberSecurityFlashcards; 