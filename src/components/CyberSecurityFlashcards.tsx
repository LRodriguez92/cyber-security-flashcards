import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle, BookOpen, Target } from 'lucide-react';

const CyberSecurityFlashcards = () => {
  const flashcards = [
    // Blue - General Security Concepts
    {
      question: "What does CIA stand for in cybersecurity?",
      answer: "Confidentiality, Integrity, and Availability - the three fundamental principles of information security.",
      domain: "General Security Concepts",
      color: "blue"
    },
    {
      question: "What is the AAA framework?",
      answer: "Authentication, Authorization, and Accounting - a framework for controlling access to resources and tracking user activities.",
      domain: "General Security Concepts",
      color: "blue"
    },
    {
      question: "What is Zero Trust security?",
      answer: "A security model that assumes no implicit trust and requires verification for every user and device trying to access resources.",
      domain: "General Security Concepts",
      color: "blue"
    },
    {
      question: "What are the three main security control types?",
      answer: "Administrative (policies/procedures), Technical (firewalls/encryption), and Physical (locks/cameras) controls.",
      domain: "General Security Concepts",
      color: "blue"
    },
    
    // Red - Threats, Vulnerabilities & Mitigations
    {
      question: "What is phishing?",
      answer: "A social engineering attack where attackers impersonate legitimate entities to steal sensitive information like passwords or credit card numbers.",
      domain: "Threats, Vulnerabilities & Mitigations",
      color: "red"
    },
    {
      question: "What is malware?",
      answer: "Malicious software designed to harm, exploit, or gain unauthorized access to computer systems. Includes viruses, worms, trojans, ransomware, and spyware.",
      domain: "Threats, Vulnerabilities & Mitigations",
      color: "red"
    },
    {
      question: "What is ransomware?",
      answer: "A type of malware that encrypts a victim's files and demands payment (ransom) for the decryption key to restore access to the data.",
      domain: "Threats, Vulnerabilities & Mitigations",
      color: "red"
    },
    {
      question: "What are the main threat actor motivations?",
      answer: "Financial gain, espionage, ideology/hacktivism, revenge, and state-sponsored activities.",
      domain: "Threats, Vulnerabilities & Mitigations",
      color: "red"
    },
    {
      question: "What is a zero-day exploit?",
      answer: "An attack that exploits a previously unknown vulnerability in software before developers have created and distributed a patch for it.",
      domain: "Threats, Vulnerabilities & Mitigations",
      color: "red"
    },
    
    // Green - Security Architecture
    {
      question: "What is a VPN?",
      answer: "Virtual Private Network - creates a secure, encrypted connection over a less secure network, allowing users to access private networks remotely.",
      domain: "Security Architecture",
      color: "green"
    },
    {
      question: "What is network segmentation?",
      answer: "The practice of dividing a network into smaller, isolated segments to limit the scope of security breaches and improve performance.",
      domain: "Security Architecture",
      color: "green"
    },
    {
      question: "What is TLS?",
      answer: "Transport Layer Security - a cryptographic protocol that provides secure communication over networks by encrypting data in transit.",
      domain: "Security Architecture",
      color: "green"
    },
    {
      question: "What are the main cloud service models?",
      answer: "Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
      domain: "Security Architecture",
      color: "green"
    },
    
    // Yellow - Security Operations
    {
      question: "What is SIEM?",
      answer: "Security Information and Event Management - a solution that provides real-time analysis of security alerts and logs from various sources.",
      domain: "Security Operations",
      color: "yellow"
    },
    {
      question: "What is system hardening?",
      answer: "The process of securing a system by reducing vulnerabilities, disabling unnecessary services, and implementing security configurations.",
      domain: "Security Operations",
      color: "yellow"
    },
    {
      question: "What are the main incident response steps?",
      answer: "Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned.",
      domain: "Security Operations",
      color: "yellow"
    },
    
    // White - Program Management & Oversight
    {
      question: "What is an AUP?",
      answer: "Acceptable Use Policy - a document that outlines the permitted and prohibited uses of an organization's IT resources.",
      domain: "Program Management & Oversight",
      color: "white"
    },
    {
      question: "What is risk management?",
      answer: "The process of identifying, assessing, and mitigating risks to an organization's assets, operations, and reputation.",
      domain: "Program Management & Oversight",
      color: "white"
    },
    {
      question: "What does RTO stand for?",
      answer: "Recovery Time Objective - the maximum acceptable time to restore a system or process after a disruption.",
      domain: "Program Management & Oversight",
      color: "white"
    }
  ];

  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState(['all']);
  const [confidenceTracking, setConfidenceTracking] = useState<{
    'knew-it': string[];
    'quick-think': string[];
    'long-think': string[];
    'peeked': string[];
  }>({
    'knew-it': [],
    'quick-think': [],
    'long-think': [],
    'peeked': []
  });
  
  // New state for Review by Confidence mode
  const [currentMode, setCurrentMode] = useState<'study' | 'review'>('study');
  const [selectedConfidenceCategories, setSelectedConfidenceCategories] = useState<string[]>([]);

  const domains = [
    { id: 'all', name: 'All Domains', color: 'gray' },
    { id: 'General Security Concepts', name: 'General Security Concepts', color: 'blue' },
    { id: 'Threats, Vulnerabilities & Mitigations', name: 'Threats, Vulnerabilities & Mitigations', color: 'red' },
    { id: 'Security Architecture', name: 'Security Architecture', color: 'green' },
    { id: 'Security Operations', name: 'Security Operations', color: 'yellow' },
    { id: 'Program Management & Oversight', name: 'Program Management & Oversight', color: 'white' }
  ];

  const confidenceCategories = [
    { id: 'knew-it', name: 'Knew it right away', icon: '⚡', color: 'green' },
    { id: 'quick-think', name: 'Had to think for a moment', icon: '🤔', color: 'blue' },
    { id: 'long-think', name: 'Had to think for a while', icon: '🧠', color: 'yellow' },
    { id: 'peeked', name: 'Peeked at the answer', icon: '👀', color: 'red' }
  ];

  // Get cards based on current mode
  const getFilteredCards = () => {
    const baseFiltered = selectedDomains.includes('all') 
      ? flashcards 
      : flashcards.filter(card => selectedDomains.includes(card.domain));

    if (currentMode === 'review' && selectedConfidenceCategories.length > 0) {
      // Filter cards that are in the selected confidence categories
      return baseFiltered.filter((card, index) => {
        const cardId = `${card.domain}-${index}`;
        return selectedConfidenceCategories.some(category => 
          confidenceTracking[category as 'knew-it' | 'quick-think' | 'long-think' | 'peeked'].includes(cardId)
        );
      });
    }

    return baseFiltered;
  };

  const filteredCards = getFilteredCards();

  const nextCard = () => {
    if (currentCard < filteredCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
      setAnswered(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
      setAnswered(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const markConfidence = (confidenceLevel: string) => {
    if (!answered) {
      const cardId = `${currentCardData?.domain}-${currentCard}`;
      
      setConfidenceTracking(prev => {
        // Remove card from all other confidence levels first
        const cleaned = {
          'knew-it': prev['knew-it'].filter((id: string) => id !== cardId),
          'quick-think': prev['quick-think'].filter((id: string) => id !== cardId),
          'long-think': prev['long-think'].filter((id: string) => id !== cardId),
          'peeked': prev['peeked'].filter((id: string) => id !== cardId)
        };
        
        // Add to the selected confidence level
        return {
          ...cleaned,
          [confidenceLevel]: [...cleaned[confidenceLevel as keyof typeof cleaned], cardId]
        };
      });

      // Update score based on confidence (knowing it counts as correct, peeking as incorrect)
      const isCorrect = confidenceLevel !== 'peeked';
      setScore(prev => ({
        ...prev,
        [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1
      }));
      
      setAnswered(true);
    }
  };

  const resetQuiz = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
    setAnswered(false);
    setConfidenceTracking({
      'knew-it': [],
      'quick-think': [],
      'long-think': [],
      'peeked': []
    });
    setCurrentMode('study');
    setSelectedConfidenceCategories([]);
  };

  const handleDomainChange = (domainId: string) => {
    if (domainId === 'all') {
      setSelectedDomains(['all']);
    } else {
      setSelectedDomains(prev => {
        // Remove 'all' if it's selected and we're selecting a specific domain
        const withoutAll = prev.filter(id => id !== 'all');
        
        if (withoutAll.includes(domainId)) {
          // If domain is already selected, remove it
          const newSelection = withoutAll.filter(id => id !== domainId);
          // If no domains left, default to 'all'
          return newSelection.length === 0 ? ['all'] : newSelection;
        } else {
          // Add the domain to selection
          return [...withoutAll, domainId];
        }
      });
    }
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
  };

  const handleConfidenceCategoryChange = (categoryId: string) => {
    setSelectedConfidenceCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
  };

  const switchMode = (mode: 'study' | 'review') => {
    setCurrentMode(mode);
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    if (mode === 'study') {
      setSelectedConfidenceCategories([]);
    }
  };

  const getCardColors = (color: string) => {
    const colorMap: { [key: string]: { front: string; back: string; accent: string } } = {
      blue: {
        front: 'from-blue-800 to-blue-700 border-blue-600',
        back: 'from-blue-700 to-blue-600 border-blue-500',
        accent: 'bg-blue-500'
      },
      red: {
        front: 'from-red-800 to-red-700 border-red-600',
        back: 'from-red-700 to-red-600 border-red-500',
        accent: 'bg-red-500'
      },
      green: {
        front: 'from-green-800 to-green-700 border-green-600',
        back: 'from-green-700 to-green-600 border-green-500',
        accent: 'bg-green-500'
      },
      yellow: {
        front: 'from-yellow-800 to-yellow-700 border-yellow-600',
        back: 'from-yellow-700 to-yellow-600 border-yellow-500',
        accent: 'bg-yellow-500'
      },
      white: {
        front: 'from-gray-800 to-gray-700 border-gray-600',
        back: 'from-gray-700 to-gray-600 border-gray-500',
        accent: 'bg-gray-500'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const progress = filteredCards.length > 0 ? ((currentCard + 1) / filteredCards.length) * 100 : 0;
  const currentCardData = filteredCards[currentCard];
  const cardColors = getCardColors(currentCardData?.color);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Cybersecurity Flashcards
          </h1>
          <p className="text-blue-200">Test your knowledge of cybersecurity concepts</p>
        </div>

        {/* Mode Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Select Mode:</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => switchMode('study')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentMode === 'study'
                  ? 'bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Study Mode
            </button>
            <button
              onClick={() => switchMode('review')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentMode === 'review'
                  ? 'bg-purple-600 text-white shadow-lg scale-105 ring-2 ring-purple-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Target className="w-5 h-5" />
              Review by Confidence
            </button>
          </div>
        </div>

        {/* Domain Filter - Only show in study mode */}
        {currentMode === 'study' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Select Domains to Study:</h2>
            <div className="flex flex-wrap gap-2">
              {domains.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => handleDomainChange(domain.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDomains.includes(domain.id)
                      ? 'bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-400'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    domain.color === 'blue' ? 'bg-blue-500' :
                    domain.color === 'red' ? 'bg-red-500' :
                    domain.color === 'green' ? 'bg-green-500' :
                    domain.color === 'yellow' ? 'bg-yellow-500' :
                    domain.color === 'white' ? 'bg-gray-300' :
                    'bg-gray-500'
                  }`}></span>
                  {domain.name}
                </button>
              ))}
            </div>
            {selectedDomains.length > 1 && !selectedDomains.includes('all') && (
              <p className="text-sm text-blue-300 mt-2">
                Studying {selectedDomains.length} domains: {selectedDomains.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Confidence Category Filter - Only show in review mode */}
        {currentMode === 'review' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Select Confidence Categories to Review:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {confidenceCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleConfidenceCategoryChange(category.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg font-medium transition-all ${
                    selectedConfidenceCategories.includes(category.id)
                      ? `bg-${category.color}-600 text-white shadow-lg scale-105 ring-2 ring-${category.color}-400`
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm text-center">{category.name}</span>
                  <span className="text-xs opacity-75">
                    ({confidenceTracking[category.id as keyof typeof confidenceTracking].length} cards)
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
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-200">
              Card {currentCard + 1} of {filteredCards.length}
            </span>
            <span className="text-sm text-blue-200">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <div className="flex items-center gap-2 bg-green-900/30 px-3 py-2 rounded-lg border border-green-500/30">
            <span className="text-lg">⚡</span>
            <span className="text-green-400 font-semibold">Knew it: {confidenceTracking['knew-it'].length}</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-500/30">
            <span className="text-lg">🤔</span>
            <span className="text-blue-400 font-semibold">Brief think: {confidenceTracking['quick-think'].length}</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-900/30 px-3 py-2 rounded-lg border border-yellow-500/30">
            <span className="text-lg">🧠</span>
            <span className="text-yellow-400 font-semibold">Long think: {confidenceTracking['long-think'].length}</span>
          </div>
          <div className="flex items-center gap-2 bg-red-900/30 px-3 py-2 rounded-lg border border-red-500/30">
            <span className="text-lg">👀</span>
            <span className="text-red-400 font-semibold">Peeked: {confidenceTracking['peeked'].length}</span>
          </div>
        </div>

        {/* Flashcard */}
        {filteredCards.length > 0 ? (
          <div className="relative mb-8">
            <div 
              className={`relative w-full h-96 cursor-pointer transition-transform duration-700 transform-gpu ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={flipCard}
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
                  <h2 className="text-2xl font-bold text-white mb-2">Question</h2>
                  <p className="text-sm text-white/80 mb-4">{currentCardData?.domain}</p>
                  <p className="text-xl text-white/90 leading-relaxed">
                    {currentCardData?.question}
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
                  <p className="text-sm text-white/80 mb-4">{currentCardData?.domain}</p>
                  <p className="text-lg text-white/90 leading-relaxed">
                    {currentCardData?.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}

        {/* Confidence Buttons - Only show in study mode */}
        {currentMode === 'study' && isFlipped && filteredCards.length > 0 && (
          <div className="mb-8">
            <p className="text-center text-white mb-4 font-medium">How well did you know this?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <button
                onClick={() => markConfidence('knew-it')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg font-semibold transition-all ${
                  answered 
                    ? 'bg-green-900/50 text-green-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 shadow-lg'
                }`}
                disabled={answered}
              >
                <span className="text-2xl">⚡</span>
                <span className="text-sm text-center">Knew it right away</span>
              </button>
              
              <button
                onClick={() => markConfidence('quick-think')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg font-semibold transition-all ${
                  answered 
                    ? 'bg-blue-900/50 text-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
                }`}
                disabled={answered}
              >
                <span className="text-2xl">🤔</span>
                <span className="text-sm text-center">Had to think for a moment</span>
              </button>
              
              <button
                onClick={() => markConfidence('long-think')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg font-semibold transition-all ${
                  answered 
                    ? 'bg-yellow-900/50 text-yellow-300 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white hover:scale-105 shadow-lg'
                }`}
                disabled={answered}
              >
                <span className="text-2xl">🧠</span>
                <span className="text-sm text-center">Had to think for a while</span>
              </button>
              
              <button
                onClick={() => markConfidence('peeked')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg font-semibold transition-all ${
                  answered 
                    ? 'bg-red-900/50 text-red-300 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 shadow-lg'
                }`}
                disabled={answered}
              >
                <span className="text-2xl">👀</span>
                <span className="text-sm text-center">Peeked at the answer</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevCard}
            disabled={currentCard === 0 || filteredCards.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Quiz
          </button>

          <button
            onClick={nextCard}
            disabled={currentCard === filteredCards.length - 1 || filteredCards.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Completion Message */}
        {currentCard === filteredCards.length - 1 && answered && filteredCards.length > 0 && (
          <div className="mt-8 text-center bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 rounded-xl border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Quiz Complete!</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-800/30 p-3 rounded-lg">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-green-400 font-semibold">{confidenceTracking['knew-it'].length}</div>
                <div className="text-xs text-green-300">Instant</div>
              </div>
              <div className="bg-blue-800/30 p-3 rounded-lg">
                <div className="text-2xl mb-1">🤔</div>
                <div className="text-blue-400 font-semibold">{confidenceTracking['quick-think'].length}</div>
                <div className="text-xs text-blue-300">Quick Think</div>
              </div>
              <div className="bg-yellow-800/30 p-3 rounded-lg">
                <div className="text-2xl mb-1">🧠</div>
                <div className="text-yellow-400 font-semibold">{confidenceTracking['long-think'].length}</div>
                <div className="text-xs text-yellow-300">Deep Think</div>
              </div>
              <div className="bg-red-800/30 p-3 rounded-lg">
                <div className="text-2xl mb-1">👀</div>
                <div className="text-red-400 font-semibold">{confidenceTracking['peeked'].length}</div>
                <div className="text-xs text-red-300">Peeked</div>
              </div>
            </div>
            <p className="text-green-400 font-semibold">
              Confidence Score: {Math.round(((confidenceTracking['knew-it'].length * 1 + confidenceTracking['quick-think'].length * 0.8 + confidenceTracking['long-think'].length * 0.6) / filteredCards.length) * 100)}%
            </p>
            <p className="text-blue-200 text-sm mt-2">
              Cards to review: {confidenceTracking['peeked'].length + confidenceTracking['long-think'].length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CyberSecurityFlashcards; 