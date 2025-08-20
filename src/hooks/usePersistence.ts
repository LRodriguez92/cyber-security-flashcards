import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, UserProfile } from '../types/flashcard';
import { cloudSyncService } from '../services/cloudSync';

// Cloud-only persistence hook
export const usePersistence = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track session data (not persisted, just for current session)
  const [sessionData, setSessionData] = useState({
    sessionStartTime: new Date(),
    currentSessionId: `session_${Date.now()}`,
    cardsInSession: 0,
  });

  // Save progress to cloud
  const saveProgress = useCallback(async (updates: Partial<UserProgress>) => {
    try {
      if (!userProgress) {
        console.error('❌ User progress not initialized');
        throw new Error('User progress not initialized');
      }
      
      const updatedProgress: UserProgress = {
        ...userProgress,
        ...updates,
        lastStudied: new Date(),
        lastSyncTimestamp: new Date(),
      };
      
      // Validate that all required fields are present and not undefined
      if (!updatedProgress.userId || !updatedProgress.confidenceTracking || !updatedProgress.score) {
        console.error('❌ Invalid progress data:', updatedProgress);
        throw new Error('Invalid progress data');
      }
      
      setUserProgress(updatedProgress);
      
      const authState = cloudSyncService.getAuthState();
      
      if (authState.user) {
        await cloudSyncService.syncProgress(updatedProgress);
      }
    } catch (err) {
      console.error('❌ Failed to save progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to save progress');
    }
  }, [userProgress]);

  // Load progress from cloud
  const loadProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authState = cloudSyncService.getAuthState();
      if (!authState.user) {
        setIsLoading(false);
        return;
      }
      
      // Load user profile
      const profile = await cloudSyncService.getUserProfile();
      if (profile) {
        setUserProfile(profile);
      }
      
      const cloudProgress = await cloudSyncService.fetchProgress();
      if (cloudProgress) {
        // Convert dates in cloud progress
        const convertedCloudProgress: UserProgress = {
          ...cloudProgress,
          lastStudied: typeof cloudProgress.lastStudied === 'string' ? new Date(cloudProgress.lastStudied) : cloudProgress.lastStudied,
          lastSyncTimestamp: typeof cloudProgress.lastSyncTimestamp === 'string' ? new Date(cloudProgress.lastSyncTimestamp) : cloudProgress.lastSyncTimestamp,
          studySessions: Array.isArray(cloudProgress.studySessions) ? cloudProgress.studySessions.map(session => ({
            ...session,
            startTime: typeof session.startTime === 'string' ? new Date(session.startTime) : session.startTime,
            endTime: session.endTime && typeof session.endTime === 'string' ? new Date(session.endTime) : session.endTime,
          })) : cloudProgress.studySessions,
        };
        
        setUserProgress(convertedCloudProgress);
      } else {
        // Create default progress for new user
        const defaultProgress: UserProgress = {
          userId: authState.user.uid,
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
          lastStudied: new Date(),
          streakDays: 0,
          completedCards: [],
          studySessions: [],
          lastSyncTimestamp: new Date(),
          version: '1.0.0',
        };
        setUserProgress(defaultProgress);
        await cloudSyncService.syncProgress(defaultProgress);
      }
    } catch (err) {
      console.error('Failed to load progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update last active timestamp
  const updateLastActive = useCallback(() => {
    setUserProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        lastActive: new Date(),
      };
    });
  }, []);

  // Calculate study streak
  const calculateStreak = useCallback(() => {
    if (!userProgress) return 0;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastStudied = new Date(userProgress.lastStudied);
    const isToday = lastStudied.toDateString() === today.toDateString();
    const isYesterday = lastStudied.toDateString() === yesterday.toDateString();

    if (isToday) {
      return userProgress.streakDays;
    } else if (isYesterday) {
      return userProgress.streakDays + 1;
    } else {
      return 1;
    }
  }, [userProgress]);

  // Start new study session
  const startStudySession = useCallback((mode: 'study' | 'review', domains: string[]) => {
    if (!userProgress) return null;
    
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

    setUserProgress(prev => {
      if (!prev) return null;
      return {
        ...prev,
        studySessions: [...prev.studySessions, newSession],
      };
    });

    setSessionData(prev => ({
      ...prev,
      sessionStartTime: new Date(),
      currentSessionId: sessionId,
      cardsInSession: 0,
    }));

    return sessionId;
  }, [userProgress]);

  // End study session
  const endStudySession = useCallback(async (sessionId: string, finalStats: {
    cardsStudied: number;
    correctAnswers: number;
    incorrectAnswers: number;
  }) => {
    try {
      if (!userProgress) {
        throw new Error('User progress not initialized');
      }
      
      const updatedProgress: UserProgress = {
        ...userProgress,
        studySessions: userProgress.studySessions.map(session =>
          session.id === sessionId
            ? { ...session, ...finalStats, endTime: new Date() }
            : session
        ),
        streakDays: calculateStreak(),
        lastStudied: new Date(),
        lastSyncTimestamp: new Date(),
      };

      setUserProgress(updatedProgress);
      
      const authState = cloudSyncService.getAuthState();
      if (authState.user) {
        await cloudSyncService.syncProgress(updatedProgress);
      }
    } catch (err) {
      console.error('Failed to end study session:', err);
      setError(err instanceof Error ? err.message : 'Failed to end study session');
    }
  }, [userProgress, calculateStreak]);

  // Initialize cloud sync and load data on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await cloudSyncService.initialize();
        // Don't call loadProgress here - it will be called when auth state changes
      } catch (err) {
        console.error('Failed to initialize:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Listen for auth state changes and load progress when user is authenticated
  useEffect(() => {
    const unsubscribe = cloudSyncService.onAuthStateChanged(async (authState) => {
      if (!authState.loading && authState.user) {
        try {
          await loadProgress();
        } catch (err) {
          console.error('Failed to load progress after auth:', err);
          setError(err instanceof Error ? err.message : 'Failed to load progress');
          setIsLoading(false);
        }
      } else if (!authState.loading && !authState.user) {
        // User is not authenticated, stop loading
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [loadProgress]);

  return {
    // Data
    userProgress,
    userProfile,
    sessionData,
    isLoading,
    error,

    // Actions
    saveProgress,
    loadProgress,
    updateLastActive,
    startStudySession,
    endStudySession,
    calculateStreak,

    // Setters
    setUserProgress,
    setUserProfile,
    setSessionData,
  };
};
