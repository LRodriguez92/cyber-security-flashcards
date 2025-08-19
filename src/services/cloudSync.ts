import type { UserProgress, UserProfile } from '../types/flashcard';
import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';

// Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

export class CloudSyncService {
  private isInitialized = false;
  private userId: string | null = null;
  private authState: AuthState = {
    user: null,
    loading: true,
    error: null
  };
  private authStateListeners: ((state: AuthState) => void)[] = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Listen for auth state changes
      onAuthStateChanged(auth, (user) => {
        this.userId = user?.uid || null;
        this.authState = {
          user,
          loading: false,
          error: null
        };
        this.notifyAuthStateListeners();
        console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      });

      this.isInitialized = true;
      console.log('Cloud sync initialized');
    } catch (error) {
      console.error('Failed to initialize cloud sync:', error);
      this.authState.error = error instanceof Error ? error.message : 'Unknown error';
      this.notifyAuthStateListeners();
      throw error;
    }
  }

  // Authentication methods
  async signInWithEmail(email: string, password: string): Promise<void> {
    try {
      this.authState.loading = true;
      this.notifyAuthStateListeners();
      
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      this.authState.error = this.getAuthErrorMessage(authError.code);
      this.authState.loading = false;
      this.notifyAuthStateListeners();
      throw new Error(this.authState.error);
    }
  }

  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<void> {
    try {
      this.authState.loading = true;
      this.notifyAuthStateListeners();
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      if (userCredential.user) {
        const userProfile: UserProfile = {
          id: userCredential.user.uid,
          email: userCredential.user.email || undefined,
          displayName: displayName || userCredential.user.displayName || undefined,
          createdAt: new Date(),
          lastActive: new Date(),
          preferences: {
            theme: 'auto',
            notifications: true,
            autoSync: true
          }
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      }
    } catch (error) {
      const authError = error as AuthError;
      this.authState.error = this.getAuthErrorMessage(authError.code);
      this.authState.loading = false;
      this.notifyAuthStateListeners();
      throw new Error(this.authState.error);
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      this.authState.loading = true;
      this.notifyAuthStateListeners();
      
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create user profile if it doesn't exist
      if (result.user) {
        const userDoc = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userDoc);
        
        if (!userSnap.exists()) {
          const userProfile: UserProfile = {
            id: result.user.uid,
            email: result.user.email || undefined,
            displayName: result.user.displayName || undefined,
            createdAt: new Date(),
            lastActive: new Date(),
            preferences: {
              theme: 'auto',
              notifications: true,
              autoSync: true
            }
          };
          
          await setDoc(userDoc, userProfile);
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      this.authState.error = this.getAuthErrorMessage(authError.code);
      this.authState.loading = false;
      this.notifyAuthStateListeners();
      throw new Error(this.authState.error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  }

  async signInAnonymously(): Promise<void> {
    try {
      this.authState.loading = true;
      this.notifyAuthStateListeners();
      
      await signInAnonymously(auth);
    } catch (error) {
      const authError = error as AuthError;
      this.authState.error = this.getAuthErrorMessage(authError.code);
      this.authState.loading = false;
      this.notifyAuthStateListeners();
      throw new Error(this.authState.error);
    }
  }

  // Auth state management
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  onAuthStateChanged(listener: (state: AuthState) => void): () => void {
    this.authStateListeners.push(listener);
    // Call immediately with current state
    listener({ ...this.authState });
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(listener);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  private notifyAuthStateListeners(): void {
    this.authStateListeners.forEach(listener => {
      listener({ ...this.authState });
    });
  }

  private getAuthErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked. Please allow popups for this site.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'An error occurred during authentication.';
    }
  }

  // User profile methods
  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.userId) return null;

    try {
      const userDoc = doc(db, 'users', this.userId);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    if (!this.userId) throw new Error('User not authenticated');

    try {
      const userDoc = doc(db, 'users', this.userId);
      await updateDoc(userDoc, {
        ...updates,
        lastActive: new Date()
      });
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async syncProgress(progress: UserProgress): Promise<void> {
    if (!this.isInitialized || !this.userId) {
      throw new Error('Cloud sync not initialized');
    }

    try {
      const progressDoc = doc(db, 'users', this.userId, 'progress', 'current');

      // Update progress
      await setDoc(progressDoc, {
        ...progress,
        lastSyncTimestamp: new Date(),
        version: '1.0.0',
      }, { merge: true });

      console.log('Progress synced to cloud');
    } catch (error) {
      console.error('Failed to sync progress:', error);
      throw error;
    }
  }

  async fetchProgress(): Promise<UserProgress | null> {
    if (!this.isInitialized || !this.userId) {
      throw new Error('Cloud sync not initialized');
    }

    try {
      const progressDoc = doc(db, 'users', this.userId, 'progress', 'current');
      const docSnap = await getDoc(progressDoc);

      if (docSnap.exists()) {
        return docSnap.data() as UserProgress;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      throw error;
    }
  }

  async syncPendingChanges(changes: Array<{
    type: string;
    timestamp: Date;
    data: unknown;
  }>): Promise<void> {
    if (!this.isInitialized || !this.userId) {
      throw new Error('Cloud sync not initialized');
    }

    try {
      const changesDoc = doc(db, 'users', this.userId, 'changes', 'pending');

      // Add changes to pending queue
      await updateDoc(changesDoc, {
        changes: changes,
        lastUpdated: new Date(),
      });

      console.log('Pending changes synced to cloud');
    } catch (error) {
      console.error('Failed to sync pending changes:', error);
      throw error;
    }
  }
}

// Singleton instance
export const cloudSyncService = new CloudSyncService();
