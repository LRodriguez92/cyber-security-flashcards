// Test Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('Firebase Config:', {
  apiKey: FIREBASE_CONFIG.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: FIREBASE_CONFIG.authDomain ? '✅ Set' : '❌ Missing',
  projectId: FIREBASE_CONFIG.projectId ? '✅ Set' : '❌ Missing',
  storageBucket: FIREBASE_CONFIG.storageBucket ? '✅ Set' : '❌ Missing',
  messagingSenderId: FIREBASE_CONFIG.messagingSenderId ? '✅ Set' : '❌ Missing',
  appId: FIREBASE_CONFIG.appId ? '✅ Set' : '❌ Missing',
});

try {
  const app = initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  console.log('✅ Firebase initialized successfully');
  console.log('✅ Auth service available');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}
