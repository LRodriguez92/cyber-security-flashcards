import React, { useState, useEffect } from 'react';
import { ChevronDown, LogOut, Settings, Crown, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cloudSyncService, type AuthState } from '../services/cloudSync';
import type { UserProfile as UserProfileType } from '../types/flashcard';

interface UserProfileProps {
  onSignOut?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  useEffect(() => {
    const unsubscribe = cloudSyncService.onAuthStateChanged((state) => {
      setAuthState(state);
      if (state.user) {
        loadUserProfile();
      }
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await cloudSyncService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await cloudSyncService.signOut();
      setIsOpen(false);
      onSignOut?.();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (authState.loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
    );
  }

  if (!authState.user) {
    return null;
  }

  const displayName = userProfile?.displayName || authState.user.displayName || 'User';
  const email = authState.user.email || userProfile?.email;
  const isAnonymous = authState.user.isAnonymous;
  const createdAt = userProfile?.createdAt;

  // Helper function to convert Firestore timestamp to Date
  const convertToDate = (timestamp: unknown): Date | null => {
    if (!timestamp) return null;
    
    // If it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp;
    }
    
    // If it's a Firestore Timestamp
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    
    // If it's a timestamp number (milliseconds)
    if (typeof timestamp === 'number') {
      return new Date(timestamp);
    }
    
    // If it's a timestamp string
    if (typeof timestamp === 'string') {
      const parsed = new Date(timestamp);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    
    // If it's an object with seconds/nanoseconds (Firestore Timestamp structure)
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date((timestamp as { seconds: number; nanoseconds?: number }).seconds * 1000 + ((timestamp as { seconds: number; nanoseconds?: number }).nanoseconds || 0) / 1000000);
    }
    
    return null;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <div className="relative">
          {authState.user.photoURL ? (
            <img
              src={authState.user.photoURL}
              alt={displayName}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {isAnonymous && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full border-2 border-white" />
          )}
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {authState.user.photoURL ? (
                  <img
                    src={authState.user.photoURL}
                    alt={displayName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  {email && (
                    <p className="text-xs text-gray-500 truncate">
                      {email}
                    </p>
                  )}
                  {isAnonymous && (
                    <div className="flex items-center gap-1 mt-1">
                      <Crown size={12} className="text-yellow-500" />
                      <span className="text-xs text-yellow-600 font-medium">Guest User</span>
                    </div>
                  )}
                </div>
              </div>
              
              {createdAt && (
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>Member since {convertToDate(createdAt)?.toLocaleDateString() || 'Unknown'}</span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-1">
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Implement settings
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} />
                Settings
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
