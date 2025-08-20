import React from 'react';
import { usePersistence } from '../hooks/usePersistence';
import { cloudSyncService } from '../services/cloudSync';

const SyncStatus: React.FC = () => {
  const { syncStatus, syncToCloud, fetchFromCloud, userProgress } = usePersistence();
  const authState = cloudSyncService.getAuthState();

  const handleManualSync = async () => {
    try {
      await syncToCloud(userProgress);
      await fetchFromCloud();
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  // Don't show sync status if user is not authenticated
  if (!authState.user) {
    return null;
  }

  // Only show if there's an error or sync in progress
  if (!syncStatus.syncInProgress && !syncStatus.error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-50 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        {syncStatus.syncInProgress ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Syncing...</span>
          </>
        ) : syncStatus.error ? (
          <>
            <div className="w-4 h-4 bg-red-400 rounded-full"></div>
            <span className="text-sm font-medium text-red-200">Sync Error</span>
          </>
        ) : null}
      </div>
      
      {syncStatus.error && (
        <div className="text-xs text-red-200 mb-2">
          {syncStatus.error}
        </div>
      )}
      
      {syncStatus.lastSync && (
        <div className="text-xs text-blue-200 mb-2">
          Last sync: {new Date(syncStatus.lastSync).toLocaleTimeString()}
        </div>
      )}
      
      {!syncStatus.syncInProgress && (
        <button
          onClick={handleManualSync}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs py-1 px-2 rounded transition-colors"
        >
          Sync Now
        </button>
      )}
    </div>
  );
};

export default SyncStatus;
