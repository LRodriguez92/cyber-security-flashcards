import React, { useState, useEffect } from 'react';
import { UserProfile } from './index';
import { cloudSyncService, type AuthState } from '../services/cloudSync';

interface HeaderProps {
  onAuthStateChange?: (isAuthenticated: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthStateChange }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = cloudSyncService.onAuthStateChanged((state) => {
      setAuthState(state);
      onAuthStateChange?.(!!state.user);
    });

    return unsubscribe;
  }, [onAuthStateChange]);

  const handleSignOut = () => {
    // Auth state will be updated automatically via the listener
  };

  return (
    <div className="relative">
      <div className="text-center mb-2 sm:mb-3 pt-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          Cybersecurity Flashcards
        </h1>
        <p className="text-blue-200 text-sm sm:text-base mb-4 sm:mb-6">
          Test your knowledge of cybersecurity concepts
        </p>
      </div>

      {/* User Profile Section */}
      <div className="absolute top-0 right-0 flex items-center gap-2">
        {authState.loading ? (
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        ) : authState.user ? (
          <UserProfile onSignOut={handleSignOut} />
        ) : null}
      </div>


    </div>
  );
};

export default Header; 