import React from 'react';
import { useOfflineSupport } from '../hooks/useOfflineSupport';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOfflineSupport();
  
  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 bg-yellow-600 text-white p-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">You're offline - changes will be saved locally</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
