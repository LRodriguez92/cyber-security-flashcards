import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { useFlashcardState } from '../hooks/useFlashcardState';

import { getFilteredCards } from '../utils/cardUtils';
import { domains, confidenceCategories } from '../data/flashcards';


// Import components
import Header from './Header';
import ModeSelector from './ModeSelector';
import DomainFilter from './DomainFilter';
import ConfidenceFilter from './ConfidenceFilter';
import StudyFilter from './StudyFilter';
import Modal from './Modal';

import Flashcard from './Flashcard';
import ConfidenceButtons from './ConfidenceButtons';
import Navigation from './Navigation';
import CompletionMessage from './CompletionMessage';
import EmptyState from './EmptyState';
import ProgressSummary from './ProgressSummary';
import ProgressBar from './ProgressBar';
import ResetOptionsModal from './ResetOptionsModal';

const CyberSecurityFlashcards: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showResetOptions, setShowResetOptions] = useState(false);
  
  const {
    // State
    currentCard,
    isFlipped,
    answered,
    selectedDomains,
    confidenceTracking,
    currentMode,
    selectedConfidenceCategories,
    studyFilter,
    isShuffled,
    
    // Actions
    resetConfidenceCategories,
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
    setStudyFilter,
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



  // Get filtered cards based on current state
  const filteredCards = getFilteredCards(
    selectedDomains,
    currentMode,
    selectedConfidenceCategories,
    confidenceTracking,
    studyFilter
  );

  // Get current card data
  const currentCardData = getCurrentCardData(filteredCards);



  // Handle confidence marking with current card data
  const handleMarkConfidence = async (confidenceLevel: string) => {
    await markConfidence(confidenceLevel, currentCardData);
    
    // Automatically advance to the next card after a short delay, but only if not at the last card
    setTimeout(() => {
      if (currentCard < filteredCards.length - 1) {
        nextCard();
      }
    }, 500);
  };

  // Handle shuffle with filtered cards
  const handleShuffle = () => {
    shuffleCards(filteredCards);
  };

  // Wrapper functions with boundary checks
  const handleNextCard = () => {
    if (currentCard < filteredCards.length - 1) {
      nextCard();
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      prevCard();
    }
  };

  // Handle pending domain changes - now apply immediately
  const handlePendingDomainChange = async (domainId: string) => {
    let newDomains: string[];
    
    if (domainId === 'all') {
      newDomains = ['all'];
    } else {
      const currentDomains = selectedDomains;
      const withoutAll = currentDomains.filter(id => id !== 'all');
      
      if (withoutAll.includes(domainId)) {
        const newSelection = withoutAll.filter(id => id !== domainId);
        newDomains = newSelection.length === 0 ? ['all'] : newSelection;
      } else {
        newDomains = [...withoutAll, domainId];
      }
    }
    
    // Apply changes immediately
    await setSelectedDomains(newDomains);
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
  };

  // Handle pending confidence category changes - now apply immediately
  const handlePendingConfidenceCategoryChange = async (categoryId: string) => {
    const currentCategories = selectedConfidenceCategories;
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id: string) => id !== categoryId)
      : [...currentCategories, categoryId];
    
    // Apply changes immediately
    await setSelectedConfidenceCategories(newCategories);
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
  };

  // Initialize pending state when filters are opened - now use current state directly
  const handleOpenFilters = () => {
    setShowFilters(true);
  };

  // Handle reset button click - show options modal
  const handleResetClick = () => {
    setShowResetOptions(true);
  };

  // Handle reset with selected confidence categories
  const handleResetConfidenceCategories = async (categoriesToReset: string[]) => {
    await resetConfidenceCategories(categoriesToReset);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-2 sm:p-2 lg:p-3 mobile-safe-padding">
      
      <div className="max-w-4xl mx-auto pt-8 sm:pt-12 lg:pt-16 pb-4 sm:pb-6">
        <Header />



        <ModeSelector 
          currentMode={currentMode}
          onModeChange={switchMode}
        />

        {/* Progress Bar */}
        {filteredCards.length > 0 && (
          <div className="mb-3 sm:mb-4 mt-3 sm:mt-4">
            <ProgressBar 
              currentCard={currentCard}
              totalCards={filteredCards.length}
            />
          </div>
        )}

        {/* Study Options */}
        <div className="mb-3 sm:mb-4 mt-3 sm:mt-4">
          <div className="flex gap-3">
            <div className="flex-1">
                             <button 
                 onClick={() => {
                   if (showFilters) {
                     setShowFilters(false);
                   } else {
                     handleOpenFilters();
                   }
                 }}
                 className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-3 sm:p-4 text-base sm:text-lg font-medium"
                 aria-label={showFilters ? "Hide study options" : "Show study options"}
                 aria-expanded={showFilters}
               >
                 <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                                   <span>
                    {currentMode === 'review' ? 'Review Options' : 'Study Options'}
                  </span>
               </button>
            </div>
          </div>
        </div>

        {/* Study Options Modal */}
        <Modal 
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title={currentMode === 'review' ? 'Review Options' : 'Study Options'}
        >
          {currentMode === 'study' && (
            <>
              <DomainFilter
                domains={domains}
                selectedDomains={selectedDomains}
                onDomainChange={handlePendingDomainChange}
              />
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-600">
                <StudyFilter
                  studyFilter={studyFilter}
                  onStudyFilterChange={setStudyFilter}
                  confidenceTracking={confidenceTracking}
                />
              </div>
              
              {/* Reset Button for Study Mode */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-600">
                <button
                  onClick={handleResetClick}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2"
                  aria-label="Reset confidence tracking"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset Confidence Tracking</span>
                </button>
              </div>
            </>
          )}
          {currentMode === 'review' && (
            <>
              <ConfidenceFilter
                confidenceCategories={confidenceCategories}
                selectedConfidenceCategories={selectedConfidenceCategories}
                confidenceTracking={confidenceTracking}
                onConfidenceCategoryChange={handlePendingConfidenceCategoryChange}
              />
              
              {/* Reset Button for Review Mode */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-600">
                <button
                  onClick={handleResetClick}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2"
                  aria-label="Reset confidence tracking"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset Confidence Tracking</span>
                </button>
              </div>
            </>
          )}
          
        </Modal>



        {/* Flashcard or Empty State */}
        <div className="mt-3 sm:mt-4 flex flex-col min-h-0 flex-1">
          {filteredCards.length > 0 ? (
          <>
            <Flashcard
              key={`${currentCard}-${currentCardData?.question}-${currentCardData?.domain}`}
              card={currentCardData!}
              isFlipped={isFlipped}
              isShuffled={isShuffled}
              onFlip={flipCard}
              onShuffle={handleShuffle}
              onSwipeLeft={handleNextCard}
              onSwipeRight={handlePrevCard}
              onPrev={handlePrevCard}
              onNext={handleNextCard}
              currentCard={currentCard}
              totalCards={filteredCards.length}
            />

            {/* Confidence Buttons - Show in both study and review modes */}
            {(currentMode === 'study' || currentMode === 'review') && isFlipped && (
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

        {/* Progress Summary - Hide when confidence buttons are visible */}
        {!(currentMode === 'study' && isFlipped && !answered) && (
          <ProgressSummary confidenceTracking={confidenceTracking} />
        )}

        {/* Spacer to push navigation to bottom on mobile */}
        <div className="flex-1 min-h-[10px] sm:min-h-0"></div>

        <Navigation onReset={handleResetClick} hidden={currentMode === 'study' || currentMode === 'review'} />

        {/* Reset Options Modal */}
        <ResetOptionsModal
          isOpen={showResetOptions}
          onClose={() => setShowResetOptions(false)}
          onReset={handleResetConfidenceCategories}
          confidenceTracking={confidenceTracking}
        />

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