import { useOfflineSupport } from './useOfflineSupport';

export const useOfflineIndicator = () => {
  const { isOnline } = useOfflineSupport();
  
  return { isOnline };
};
