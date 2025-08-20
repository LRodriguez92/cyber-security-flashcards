import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cloud, Lock } from 'lucide-react';
import { cloudSyncService, type AuthState } from '../services/cloudSync';
import { AuthModal } from './AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (authState.loading) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Loading timeout - please refresh the page'
        }));
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [authState.loading]);

  useEffect(() => {
    const initializeAndListen = async () => {
      try {
        // Initialize cloud sync service first
        await cloudSyncService.initialize();
        
        // Then listen for auth state changes
        const unsubscribe = cloudSyncService.onAuthStateChanged((state) => {
          setAuthState(state);
          // Auto-show auth modal if user is not authenticated and not loading
          if (!state.loading && !state.user) {
            setShowAuthModal(true);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('AuthGuard: Failed to initialize:', error);
        // Set error state
        setAuthState({
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize'
        });
      }
    };

    initializeAndListen();
  }, []);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Show loading state while checking authentication
  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading...</h2>
          <p className="text-blue-200">Checking authentication status</p>
          {authState.error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">{authState.error}</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Show authentication required screen if not authenticated
  if (!authState.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Cybersecurity Flashcards
            </h1>
            <p className="text-blue-200 text-lg mb-6">
              Your cloud-based learning journey starts here
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 text-blue-200 mb-3">
                <Cloud className="w-5 h-5" />
                <span className="font-medium">Cloud-Only Experience</span>
              </div>
              <ul className="text-sm text-blue-100 space-y-2 text-left">
                <li>• All progress synced across devices</li>
                <li>• Secure authentication required</li>
                <li>• No local data storage</li>
                <li>• Always up-to-date</li>
              </ul>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <Lock className="w-5 h-5 inline mr-2" />
              Sign In to Continue
            </button>
          </motion.div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // User is authenticated, show the app content
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
