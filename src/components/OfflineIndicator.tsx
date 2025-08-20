import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cloudSyncService } from '../services/cloudSync';

interface OfflineIndicatorProps {
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<boolean | null>(null);

  useEffect(() => {
    // Initial check
    setIsOnline(cloudSyncService.isOnline());

    // Listen for network changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTestConnection = async () => {
    setConnectionTestResult(null);
    try {
      const result = await cloudSyncService.testConnection();
      setConnectionTestResult(result);
    } catch {
      setConnectionTestResult(false);
    }
  };

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className="bg-red-600 text-white rounded-lg shadow-lg p-3 max-w-sm">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5" />
          <span className="font-medium">Offline Mode</span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="ml-auto text-white/80 hover:text-white transition-colors"
            aria-label="Toggle details"
          >
            <AlertCircle className="w-4 h-4" />
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-red-500">
            <p className="text-sm text-red-100 mb-3">
              You're currently offline. Your progress will be saved locally and synced when you're back online.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleTestConnection}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-sm rounded transition-colors"
              >
                Test Connection
              </button>
              
              {connectionTestResult !== null && (
                <div className="flex items-center gap-1 text-sm">
                  {connectionTestResult ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">Still Offline</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-red-200">
              <p>• Check your internet connection</p>
              <p>• Try refreshing the page</p>
              <p>• Your data is safe locally</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
