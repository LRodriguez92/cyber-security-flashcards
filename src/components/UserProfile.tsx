import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ChevronDown, Crown, Calendar } from 'lucide-react';
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
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!authState.user) {
    return null;
  }

  const displayName = userProfile?.displayName || authState.user.displayName || 'User';
  const email = authState.user.email || userProfile?.email;
  const isAnonymous = authState.user.isAnonymous;
  const createdAt = userProfile?.createdAt;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="relative">
          {authState.user.photoURL ? (
            <img
              src={authState.user.photoURL}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {isAnonymous && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
          )}
        </div>
        
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900 truncate max-w-24">
            {displayName}
          </span>
          {email && (
            <span className="text-xs text-gray-500 truncate max-w-24">
              {email}
            </span>
          )}
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
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
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
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
                  <span>Member since {createdAt.toLocaleDateString()}</span>
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
