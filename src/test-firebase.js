// Test Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('Firebase Config Check:', {
  apiKey: FIREBASE_CONFIG.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: FIREBASE_CONFIG.authDomain ? '✅ Set' : '❌ Missing',
  projectId: FIREBASE_CONFIG.projectId ? '✅ Set' : '❌ Missing',
  storageBucket: FIREBASE_CONFIG.storageBucket ? '✅ Set' : '❌ Missing',
  messagingSenderId: FIREBASE_CONFIG.messagingSenderId ? '✅ Set' : '❌ Missing',
  appId: FIREBASE_CONFIG.appId ? '✅ Set' : '❌ Missing',
});

// Check if all required config values are present
const missingConfig = Object.entries(FIREBASE_CONFIG)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  console.error('❌ Missing Firebase configuration:', missingConfig);
  console.error('Please check your .env.local file and ensure all VITE_FIREBASE_* variables are set.');
} else {
  console.log('✅ All Firebase configuration values are present');
}

try {
  const app = initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully');
  console.log('✅ Auth service available');
  console.log('✅ Firestore service available');
  
  // Test basic connectivity
  console.log('🔍 Testing Firebase connectivity...');
  
  // Test auth state listener
  const unsubscribe = auth.onAuthStateChanged((user) => {
    console.log('✅ Auth state listener working:', user ? 'User logged in' : 'No user');
    unsubscribe(); // Clean up after first call
  }, (error) => {
    console.error('❌ Auth state listener error:', error);
  });
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.error('Error details:', {
    message: error.message,
    code: error.code,
    stack: error.stack
  });
}
