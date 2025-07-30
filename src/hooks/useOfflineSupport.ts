import { useState, useEffect } from 'react';

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingSync) {
        // Sync pending data
        setPendingSync(false);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSync]);

  return { isOnline, pendingSync };
};

// Local storage utilities for offline support
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Offline indicator component hook
export const useOfflineIndicator = () => {
  const { isOnline } = useOfflineSupport();
  
  const OfflineIndicator = () => (
    !isOnline ? (
      <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 bg-yellow-600 text-white p-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">You're offline - changes will be saved locally</span>
        </div>
      </div>
    ) : null
  );
  
  return { isOnline, OfflineIndicator };
}; 