import React from 'react';
import { usePersistence } from '../hooks/usePersistence';

const SyncStatus: React.FC = () => {
  const { syncStatus } = usePersistence();

  if (!syncStatus.pendingChanges && !syncStatus.syncInProgress) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        {syncStatus.syncInProgress ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Syncing...</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Changes pending sync</span>
          </>
        )}
      </div>
    </div>
  );
};

export default SyncStatus;
