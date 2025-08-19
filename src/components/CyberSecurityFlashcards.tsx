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
  const [pendingDomains, setPendingDomains] = useState<string[]>([]);
  const [pendingConfidenceCategories, setPendingConfidenceCategories] = useState<string[]>([]);
  const [pendingStudyFilter, setPendingStudyFilter] = useState<'all' | 'unanswered'>('all');
  
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
      setPendingStudyFilter(studyFilter);
    } else {
      setPendingConfidenceCategories(selectedConfidenceCategories);
    }
    setShowFilters(true);
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
      // Apply domain changes and study filter
      setSelectedDomains(pendingDomains);
      setStudyFilter(pendingStudyFilter);
      setCurrentCard(0);
      setIsFlipped(false);
      setAnswered(false);
      setIsShuffled(false);
      setShuffledIndices([]);
      setShowFilters(false);
    } else {
      // In review mode, check if at least one category is selected
      if (pendingConfidenceCategories.length === 0) {
        // Don't close modal if no categories selected
        return;
      }
      // Apply confidence category changes
      setSelectedConfidenceCategories(pendingConfidenceCategories);
      setCurrentCard(0);
      setIsFlipped(false);
      setAnswered(false);
      setIsShuffled(false);
      setShuffledIndices([]);
      setShowFilters(false);
    }
  };

  // Cancel changes
  const handleCancelChanges = () => {
    setShowFilters(false);
  };

  // Handle reset button click - show options modal
  const handleResetClick = () => {
    setShowResetOptions(true);
  };

  // Handle reset with selected confidence categories
  const handleResetConfidenceCategories = (categoriesToReset: string[]) => {
    resetConfidenceCategories(categoriesToReset);
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
                selectedDomains={pendingDomains}
                onDomainChange={handlePendingDomainChange}
              />
              <div className="mt-6 pt-6 border-t border-slate-600">
                <StudyFilter
                  studyFilter={pendingStudyFilter}
                  onStudyFilterChange={setPendingStudyFilter}
                  confidenceTracking={confidenceTracking}
                />
              </div>
            </>
          )}
          {currentMode === 'review' && (
            <>
              <ConfidenceFilter
                confidenceCategories={confidenceCategories}
                selectedConfidenceCategories={pendingConfidenceCategories}
                confidenceTracking={confidenceTracking}
                onConfidenceCategoryChange={handlePendingConfidenceCategoryChange}
              />
              
              {/* Reset Button for Review Mode */}
              <div className="mt-6 pt-6 border-t border-slate-600">
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
              disabled={currentMode === 'review' && pendingConfidenceCategories.length === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                currentMode === 'review' && pendingConfidenceCategories.length === 0
                  ? 'bg-slate-500 text-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-400'
              }`}
            >
              Confirm
            </button>
          </div>
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
              onSwipeLeft={nextCard}
              onSwipeRight={prevCard}
              onPrev={prevCard}
              onNext={nextCard}
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