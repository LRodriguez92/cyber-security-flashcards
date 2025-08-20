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
      };
      
      // Validate that all required fields are present and not undefined
      if (!updatedProgress.userId || !updatedProgress.confidenceTracking) {
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
        // Convert cloud progress to current format
        const convertedCloudProgress: UserProgress = {
          userId: cloudProgress.userId,
          confidenceTracking: cloudProgress.confidenceTracking,
          selectedDomains: cloudProgress.selectedDomains,
          selectedConfidenceCategories: cloudProgress.selectedConfidenceCategories,
          studyFilter: cloudProgress.studyFilter,
          version: cloudProgress.version,
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
          selectedDomains: ['all'],
          selectedConfidenceCategories: [],
          studyFilter: 'all',
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

    // Setters
    setUserProgress,
    setUserProfile,
    setSessionData,
  };
};
