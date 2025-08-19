import React, { useState, useEffect } from 'react';
import { User, LogIn } from 'lucide-react';
import { UserProfile, AuthModal } from './index';
import { cloudSyncService, type AuthState } from '../services/cloudSync';

interface HeaderProps {
  onAuthStateChange?: (isAuthenticated: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthStateChange }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

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

      {/* Auth Section */}
      <div className="absolute top-0 right-0">
        {authState.loading ? (
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        ) : authState.user ? (
          <UserProfile onSignOut={handleSignOut} />
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <LogIn size={16} />
            <span className="text-sm font-medium">Sign In</span>
          </button>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Header; 