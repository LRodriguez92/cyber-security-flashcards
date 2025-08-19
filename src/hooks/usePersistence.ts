import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useOfflineSupport';
import type { UserProgress, SyncStatus, UserProfile } from '../types/flashcard';

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'flashcard-user-progress',
  USER_PROFILE: 'flashcard-user-profile',
  SYNC_STATUS: 'flashcard-sync-status',
  PENDING_CHANGES: 'flashcard-pending-changes',
  SESSION_DATA: 'flashcard-session-data',
} as const;

// Generate anonymous user ID
const generateUserId = (): string => {
  const existingId = localStorage.getItem('flashcard-anonymous-user-id');
  if (existingId) return existingId;
  
  const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('flashcard-anonymous-user-id', newId);
  return newId;
};

// Enhanced persistence hook
export const usePersistence = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>(
    STORAGE_KEYS.USER_PROFILE,
    {
      id: generateUserId(),
      createdAt: new Date(),
      lastActive: new Date(),
      preferences: {
        theme: 'auto',
        notifications: true,
        autoSync: true,
      },
    }
  );

  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>(
    STORAGE_KEYS.USER_PROGRESS,
    {
      userId: userProfile.id,
      confidenceTracking: {
        'knew-it': [],
        'quick-think': [],
        'long-think': [],
        'peeked': [],
      },
      score: { correct: 0, incorrect: 0 },
      selectedDomains: ['all'],
      selectedConfidenceCategories: [],
      studyFilter: 'all',
      currentMode: 'study',
      lastStudied: new Date(),
      totalStudyTime: 0,
      streakDays: 0,
      completedCards: [],
      studySessions: [],
      lastSyncTimestamp: new Date(),
      version: '1.0.0',
    }
  );

  const [syncStatus, setSyncStatus] = useLocalStorage<SyncStatus>(
    STORAGE_KEYS.SYNC_STATUS,
    {
      isOnline: navigator.onLine,
      lastSync: null,
      pendingChanges: false,
      syncInProgress: false,
      error: null,
    }
  );

  const [pendingChanges, setPendingChanges] = useLocalStorage<Array<{
    type: string;
    timestamp: Date;
    data: unknown;
  }>>(
    STORAGE_KEYS.PENDING_CHANGES,
    []
  );

  // Track session data (not persisted, just for current session)
  const [sessionData, setSessionData] = useState({
    sessionStartTime: new Date(),
    currentSessionId: `session_${Date.now()}`,
    cardsInSession: 0,
  });

  // Debounced save function
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const saveProgress = useCallback((updates: Partial<UserProgress>) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      setUserProgress(prev => ({
        ...prev,
        ...updates,
        lastStudied: new Date(),
        lastSyncTimestamp: new Date(),
      }));

      // Mark as pending sync
      setSyncStatus(prev => ({
        ...prev,
        pendingChanges: true,
      }));

      // Add to pending changes for cloud sync
      setPendingChanges(prev => [...prev, {
        type: 'progress_update',
        timestamp: new Date(),
        data: updates,
      }]);
    }, 1000); // 1 second debounce
  }, [setUserProgress, setSyncStatus, setPendingChanges]);

  // Update last active timestamp
  const updateLastActive = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      lastActive: new Date(),
    }));
  }, [setUserProfile]);

  // Calculate study streak
  const calculateStreak = useCallback(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastStudied = new Date(userProgress.lastStudied);
    const isToday = lastStudied.toDateString() === today.toDateString();
    const isYesterday = lastStudied.toDateString() === yesterday.toDateString();

    if (isToday) {
      return userProgress.streakDays; // Keep current streak
    } else if (isYesterday) {
      return userProgress.streakDays + 1; // Increment streak
    } else {
      return 1; // Reset streak
    }
  }, [userProgress.lastStudied, userProgress.streakDays]);

  // Start new study session
  const startStudySession = useCallback((mode: 'study' | 'review', domains: string[]) => {
    const sessionId = `session_${Date.now()}`;
    const newSession = {
      id: sessionId,
      startTime: new Date(),
      cardsStudied: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      domains,
      mode,
    };

    setUserProgress(prev => ({
      ...prev,
      studySessions: [...prev.studySessions, newSession],
    }));

    setSessionData(prev => ({
      ...prev,
      sessionStartTime: new Date(),
      currentSessionId: sessionId,
      cardsInSession: 0,
    }));

    return sessionId;
  }, [setUserProgress]);

  // End study session
  const endStudySession = useCallback((sessionId: string, finalStats: {
    cardsStudied: number;
    correctAnswers: number;
    incorrectAnswers: number;
  }) => {
    setUserProgress(prev => ({
      ...prev,
      studySessions: prev.studySessions.map(session =>
        session.id === sessionId
          ? { ...session, ...finalStats, endTime: new Date() }
          : session
      ),
      totalStudyTime: prev.totalStudyTime + 
        (new Date().getTime() - sessionData.sessionStartTime.getTime()),
      streakDays: calculateStreak(),
    }));

    saveProgress({}); // Trigger save
  }, [setUserProgress, sessionData.sessionStartTime, calculateStreak, saveProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Data
    userProgress,
    userProfile,
    syncStatus,
    pendingChanges,
    sessionData,

    // Actions
    saveProgress,
    updateLastActive,
    startStudySession,
    endStudySession,
    calculateStreak,

    // Setters
    setUserProgress,
    setUserProfile,
    setSyncStatus,
    setPendingChanges,
    setSessionData,
  };
};
