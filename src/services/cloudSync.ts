import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import type { User, AuthError } from 'firebase/auth';
import type { UserProgress, UserProfile } from '../types/flashcard';

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

const initializeFirebase = () => {
  if (!app) {
    if (!isFirebaseConfigured()) {
      console.error('❌ Firebase configuration missing!');
      console.error('Missing environment variables:', {
        hasApiKey: !!FIREBASE_CONFIG.apiKey,
        hasAuthDomain: !!FIREBASE_CONFIG.authDomain,
        hasProjectId: !!FIREBASE_CONFIG.projectId,
        hasStorageBucket: !!FIREBASE_CONFIG.storageBucket,
        hasMessagingSenderId: !!FIREBASE_CONFIG.messagingSenderId,
        hasAppId: !!FIREBASE_CONFIG.appId
      });
      throw new Error('Firebase not configured. Please set up environment variables. See FIREBASE_SETUP.md for instructions.');
    }
    
    try {
      app = initializeApp(FIREBASE_CONFIG);
      
      db = getFirestore(app);
      
      auth = getAuth(app);
      
      googleProvider = new GoogleAuthProvider();
      
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
    console.error('❌ Firebase initialization incomplete:', {
      hasApp: !!app,
      hasDb: !!db,
      hasAuth: !!auth,
      hasGoogleProvider: !!googleProvider
    });
    throw new Error('Firebase initialization incomplete');
  }
  
  return { app, db, auth, googleProvider };
};

export interface AuthState {
  user: User | null;
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
      }, (error) => {
        // Handle auth state change errors
        this.authState.error = error.message;
        this.authState.loading = false;
        this.notifyAuthStateListeners();
      });

      this.isInitialized = true;
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
      const userDoc = doc(firebaseDb, 'users', this.userId!);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      
      return null;
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
      const userDoc = doc(firebaseDb, 'users', this.userId!);
      await updateDoc(userDoc, {
        ...updates,
        lastActive: new Date()
      });
    } catch (error) {
      console.error('Failed to update user profile:', error);
      // Don't throw error for profile updates - let the app continue working
    }
  }

  async syncProgress(progress: UserProgress): Promise<void> {
    await this.ensureInitialized();
    const { db: firebaseDb } = initializeFirebase();
    
    if (!isFirebaseConfigured()) {
      console.error('❌ Firebase not configured');
      throw new Error('Firebase not configured');
    }
    
    if (!this.userId) {
      console.error('❌ User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      const progressDoc = doc(firebaseDb, 'users', this.userId!, 'progress', 'current');

      // Update progress
      await setDoc(progressDoc, {
        ...progress,
        lastSyncTimestamp: new Date(),
        version: '1.0.0',
      }, { merge: true });

    } catch (error) {
      console.error('❌ Failed to sync progress:', error);
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
      const progressDoc = doc(firebaseDb, 'users', this.userId!, 'progress', 'current');
      const docSnap = await getDoc(progressDoc);

      if (docSnap.exists()) {
        return docSnap.data() as UserProgress;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Return null instead of throwing - allows app to continue with local data
      return null;
    }
  }



  // Connection status methods
  isOnline(): boolean {
    return true; // Always online in cloud-only mode
  }

  async testConnection(): Promise<boolean> {
    try {
      // In cloud-only mode, we assume connection is always available
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const cloudSyncService = new CloudSyncService();
