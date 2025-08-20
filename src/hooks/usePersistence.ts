import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useOfflineSupport';
import type { UserProgress, SyncStatus, UserProfile } from '../types/flashcard';
import { cloudSyncService } from '../services/cloudSync';

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'flashcard-user-progress',
  USER_PROFILE: 'flashcard-user-profile',
  SYNC_STATUS: 'flashcard-sync-status',
} as const;

// Generate anonymous user ID
const generateUserId = (): string => {
  const existingId = localStorage.getItem('flashcard-anonymous-user-id');
  if (existingId) return existingId;
  
  const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('flashcard-anonymous-user-id', newId);
  return newId;
};

// Online-only persistence hook
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

  // Track session data (not persisted, just for current session)
  const [sessionData, setSessionData] = useState({
    sessionStartTime: new Date(),
    currentSessionId: `session_${Date.now()}`,
    cardsInSession: 0,
  });

  // Sync to cloud function
  const syncToCloud = useCallback(async (progress: UserProgress) => {
    if (!navigator.onLine) {
      console.log('Offline, cannot sync');
      return;
    }
    
    const authState = cloudSyncService.getAuthState();
    if (!authState.user) {
      console.log('User not authenticated, cannot sync');
      return;
    }
    
    try {
      console.log('🔄 Starting cloud sync...');
      setSyncStatus(prev => ({ ...prev, syncInProgress: true }));
      
      await cloudSyncService.syncProgress(progress);
      
      console.log('✅ Cloud sync completed successfully');
      setSyncStatus(prev => ({ 
        ...prev, 
        syncInProgress: false, 
        lastSync: new Date(),
        error: null 
      }));
    } catch (error) {
      console.error('❌ Failed to sync to cloud:', error);
      setSyncStatus(prev => ({ 
        ...prev, 
        syncInProgress: false, 
        error: error instanceof Error ? error.message : 'Sync failed' 
      }));
    }
  }, [setSyncStatus]);

  // Fetch from cloud function
  const fetchFromCloud = useCallback(async () => {
    if (!navigator.onLine) {
      console.log('Offline, cannot fetch from cloud');
      return;
    }
    
    const authState = cloudSyncService.getAuthState();
    if (!authState.user) {
      console.log('User not authenticated, cannot fetch from cloud');
      return;
    }
    
    try {
      setSyncStatus(prev => ({ ...prev, syncInProgress: true }));
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
        
        // Use cloud data but preserve local UI preferences
        const updatedProgress: UserProgress = {
          ...convertedCloudProgress,
          // Keep local UI preferences
          selectedDomains: userProgress.selectedDomains,
          selectedConfidenceCategories: userProgress.selectedConfidenceCategories,
          studyFilter: userProgress.studyFilter,
          currentMode: userProgress.currentMode,
          lastSyncTimestamp: new Date(),
        };
        
        setUserProgress(updatedProgress);
      }
      
      setSyncStatus(prev => ({ 
        ...prev, 
        syncInProgress: false, 
        lastSync: new Date(),
        error: null 
      }));
    } catch (error) {
      console.error('Failed to fetch from cloud:', error);
      setSyncStatus(prev => ({ 
        ...prev, 
        syncInProgress: false, 
        error: error instanceof Error ? error.message : 'Fetch failed' 
      }));
    }
  }, [setUserProgress, setSyncStatus, userProgress]);

  // Save progress and sync immediately
  const saveProgress = useCallback(async (updates: Partial<UserProgress>) => {
    const updatedProgress = {
      ...userProgress,
      ...updates,
      lastStudied: new Date(),
      lastSyncTimestamp: new Date(),
    };
    
    // Save to localStorage
    setUserProgress(updatedProgress);
    
    // Sync to cloud immediately
    await syncToCloud(updatedProgress);
  }, [userProgress, setUserProgress, syncToCloud]);

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
      return userProgress.streakDays;
    } else if (isYesterday) {
      return userProgress.streakDays + 1;
    } else {
      return 1;
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
  const endStudySession = useCallback(async (sessionId: string, finalStats: {
    cardsStudied: number;
    correctAnswers: number;
    incorrectAnswers: number;
  }) => {
    const updatedProgress = {
      ...userProgress,
      studySessions: userProgress.studySessions.map(session =>
        session.id === sessionId
          ? { ...session, ...finalStats, endTime: new Date() }
          : session
      ),
      totalStudyTime: userProgress.totalStudyTime + 
        (new Date().getTime() - sessionData.sessionStartTime.getTime()),
      streakDays: calculateStreak(),
      lastStudied: new Date(),
      lastSyncTimestamp: new Date(),
    };

    setUserProgress(updatedProgress);
    await syncToCloud(updatedProgress);
  }, [userProgress, sessionData.sessionStartTime, calculateStreak, setUserProgress, syncToCloud]);

  // Initialize cloud sync and fetch data on mount
  useEffect(() => {
    const initializeSync = async () => {
      try {
        await cloudSyncService.initialize();
        const authState = cloudSyncService.getAuthState();
        if (authState.user) {
          await fetchFromCloud();
        }
      } catch (error) {
        console.error('Failed to initialize sync:', error);
      }
    };

    initializeSync();
  }, []);

  // Manual sync function for UI
  const manualSync = useCallback(async () => {
    try {
      console.log('🔄 Manual sync triggered');
      await syncToCloud(userProgress);
      await fetchFromCloud();
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  }, [userProgress, syncToCloud, fetchFromCloud]);

  return {
    // Data
    userProgress,
    userProfile,
    syncStatus,
    sessionData,

    // Actions
    saveProgress,
    updateLastActive,
    startStudySession,
    endStudySession,
    calculateStreak,
    syncToCloud,
    fetchFromCloud,
    manualSync,

    // Setters
    setUserProgress,
    setUserProfile,
    setSyncStatus,
    setSessionData,
  };
};
