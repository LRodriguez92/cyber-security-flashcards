import type { UserProgress, UserProfile } from '../types/flashcard';
import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, enableNetwork } from 'firebase/firestore';
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

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return FIREBASE_CONFIG.apiKey && 
         FIREBASE_CONFIG.authDomain && 
         FIREBASE_CONFIG.projectId && 
         FIREBASE_CONFIG.storageBucket && 
         FIREBASE_CONFIG.messagingSenderId && 
         FIREBASE_CONFIG.appId;
};

// Initialize Firebase only once
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Connection state management
let isOnline = navigator.onLine;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

const initializeFirebase = () => {
  if (!app) {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase not configured. Please set up environment variables. See FIREBASE_SETUP.md for instructions.');
    }
    
    try {
      // Log configuration for debugging (without sensitive data)
      console.log('🔧 Initializing Firebase with config:', {
        projectId: FIREBASE_CONFIG.projectId,
        authDomain: FIREBASE_CONFIG.authDomain,
        hasApiKey: !!FIREBASE_CONFIG.apiKey,
        hasAppId: !!FIREBASE_CONFIG.appId
      });
      
      app = initializeApp(FIREBASE_CONFIG);
      db = getFirestore(app);
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      
      // Add some debugging for Firestore
      console.log('✅ Firebase initialized successfully');
      console.log('📊 Firestore instance created');
      console.log('🔐 Auth instance created');
      
      // Test basic Firestore connectivity
      if (db) {
        console.log('🔍 Firestore database reference obtained');
      }
      
      // Set up network state listeners
      setupNetworkListeners();
      
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as { code?: string })?.code || 'No code',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      throw error;
    }
  }
  
  // At this point, all instances should be initialized
  if (!app || !db || !auth || !googleProvider) {
    throw new Error('Firebase initialization incomplete');
  }
  
  return { app, db, auth, googleProvider };
};

const setupNetworkListeners = () => {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('🌐 Network: Online');
    isOnline = true;
    // Re-enable Firestore network
    if (db) {
      enableNetwork(db).then(() => {
        console.log('✅ Firestore network re-enabled');
      }).catch(error => {
        console.error('❌ Failed to re-enable Firestore network:', error);
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('📴 Network: Offline');
    isOnline = false;
  });
};

const waitForConnection = async (): Promise<boolean> => {
  if (isOnline && db) {
    try {
      // Test connection with a simple operation
      await enableNetwork(db);
      return true;
    } catch (error) {
      console.warn('⚠️ Connection test failed:', error);
      return false;
    }
  }
  return false;
};

const retryOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = MAX_RETRY_ATTEMPTS
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check if we're online before attempting
      if (!isOnline) {
        console.log(`⏳ ${operationName}: Waiting for network connection...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        continue;
      }

      return await operation();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`❌ ${operationName} attempt ${attempt}/${maxRetries} failed:`, errorMessage);
      
      if (isLastAttempt) {
        throw error;
      }
      
      // Wait before retrying
      console.log(`⏳ ${operationName}: Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  throw new Error(`${operationName} failed after ${maxRetries} attempts`);
};

export interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

export class CloudSyncService {
  private static instance: CloudSyncService;
  private static isInitializing = false;
  private static initializationPromise: Promise<void> | null = null;
  
  private isInitialized = false;
  private userId: string | null = null;
  private authState: AuthState = {
    user: null,
    loading: true,
    error: null
  };
  private authStateListeners: ((state: AuthState) => void)[] = [];

  constructor() {
    if (CloudSyncService.instance) {
      return CloudSyncService.instance;
    }
    CloudSyncService.instance = this;
  }

  async initialize(): Promise<void> {
    // If already initialized, return immediately
    if (this.isInitialized) {
      return;
    }

    // If initialization is in progress, wait for it to complete
    if (CloudSyncService.isInitializing && CloudSyncService.initializationPromise) {
      return CloudSyncService.initializationPromise;
    }

    // Start initialization
    CloudSyncService.isInitializing = true;
    CloudSyncService.initializationPromise = this.performInitialization();
    
    try {
      await CloudSyncService.initializationPromise;
    } finally {
      CloudSyncService.isInitializing = false;
      CloudSyncService.initializationPromise = null;
    }
  }

  private async performInitialization(): Promise<void> {
    try {
      // Initialize Firebase
      const { auth: firebaseAuth } = initializeFirebase();

      // Listen for auth state changes
      onAuthStateChanged(firebaseAuth, (user) => {
        this.userId = user?.uid || null;
        this.authState = {
          user,
          loading: false,
          error: null
        };
        this.notifyAuthStateListeners();
        console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      }, (error) => {
        // Handle auth state change errors
        console.error('Auth state change error:', error);
        this.authState.error = error.message;
        this.authState.loading = false;
        this.notifyAuthStateListeners();
      });

      this.isInitialized = true;
      console.log('✅ Cloud sync initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize cloud sync:', error);
      this.authState.error = error instanceof Error ? error.message : 'Unknown error';
      this.authState.loading = false;
      this.notifyAuthStateListeners();
      throw error;
    }
  }

  // Authentication methods
  async signInWithEmail(email: string, password: string): Promise<void> {
    await this.ensureInitialized();
    const { auth: firebaseAuth } = initializeFirebase();
    
    try {
      this.authState.loading = true;
      this.notifyAuthStateListeners();
      
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      this.authState.error = this.getAuthErrorMessage(authError.code);
      this.authState.loading = false;
      this.notifyAuthStateListeners();
      throw new Error(this.authState.error);
    }
  }

  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<void> {
    await this.ensureInitialized();
    const { auth: firebaseAuth, db: firebaseDb } = initializeFirebase();
    
    try {
      this.authState.loading = true;
      this.notifyAuthStateListeners();
      
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
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
        
        await setDoc(doc(firebaseDb, 'users', userCredential.user.uid), userProfile);
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
    await this.ensureInitialized();
    const { auth: firebaseAuth, db: firebaseDb, googleProvider: provider } = initializeFirebase();
    
    try {
      this.authState.loading = true;
      this.notifyAuthStateListeners();
      
      const result = await signInWithPopup(firebaseAuth, provider);
      
      // Create user profile if it doesn't exist
      if (result.user) {
        const userDoc = doc(firebaseDb, 'users', result.user.uid);
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
    await this.ensureInitialized();
    const { auth: firebaseAuth } = initializeFirebase();
    
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  }

  async signInAnonymously(): Promise<void> {
    await this.ensureInitialized();
    const { auth: firebaseAuth } = initializeFirebase();
    
    try {
      this.authState.loading = true;
      this.notifyAuthStateListeners();
      
      await signInAnonymously(firebaseAuth);
    } catch (error) {
      const authError = error as AuthError;
      this.authState.error = this.getAuthErrorMessage(authError.code);
      this.authState.loading = false;
      this.notifyAuthStateListeners();
      throw new Error(this.authState.error);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
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
    await this.ensureInitialized();
    const { db: firebaseDb } = initializeFirebase();
    
    if (!this.userId) return null;

    try {
      return await retryOperation(async () => {
        const userDoc = doc(firebaseDb, 'users', this.userId!);
        const userSnap = await getDoc(userDoc);
        
        if (userSnap.exists()) {
          return userSnap.data() as UserProfile;
        }
        
        return null;
      }, 'Fetch user profile');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Return null instead of throwing - allows app to continue with local data
      return null;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    await this.ensureInitialized();
    const { db: firebaseDb } = initializeFirebase();
    
    if (!this.userId) throw new Error('User not authenticated');

    try {
      await retryOperation(async () => {
        const userDoc = doc(firebaseDb, 'users', this.userId!);
        await updateDoc(userDoc, {
          ...updates,
          lastActive: new Date()
        });
      }, 'Update user profile');
    } catch (error) {
      console.error('Failed to update user profile:', error);
      // Don't throw error for profile updates - let the app continue working
    }
  }

  async syncProgress(progress: UserProgress): Promise<void> {
    await this.ensureInitialized();
    const { db: firebaseDb } = initializeFirebase();
    
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase not configured');
    }
    
    if (!this.userId) {
      throw new Error('User not authenticated');
    }

    try {
      await retryOperation(async () => {
        const progressDoc = doc(firebaseDb, 'users', this.userId!, 'progress', 'current');

        // Update progress
        await setDoc(progressDoc, {
          ...progress,
          lastSyncTimestamp: new Date(),
          version: '1.0.0',
        }, { merge: true });

        console.log('Progress synced to cloud');
      }, 'Sync progress');
    } catch (error) {
      console.error('Failed to sync progress:', error);
      // Don't throw error for sync failures - let the app continue working offline
      // The error will be logged but won't break the user experience
    }
  }

  async fetchProgress(): Promise<UserProgress | null> {
    await this.ensureInitialized();
    const { db: firebaseDb } = initializeFirebase();
    
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase not configured');
    }
    
    if (!this.userId) {
      throw new Error('User not authenticated');
    }

    try {
      return await retryOperation(async () => {
        const progressDoc = doc(firebaseDb, 'users', this.userId!, 'progress', 'current');
        const docSnap = await getDoc(progressDoc);

        if (docSnap.exists()) {
          return docSnap.data() as UserProgress;
        }

        return null;
      }, 'Fetch progress');
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Return null instead of throwing - allows app to continue with local data
      return null;
    }
  }



  // Connection status methods
  isOnline(): boolean {
    return isOnline;
  }

  async testConnection(): Promise<boolean> {
    try {
      await waitForConnection();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const cloudSyncService = new CloudSyncService();
