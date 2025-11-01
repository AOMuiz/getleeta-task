import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Persister for AsyncStorage (optional - for offline support)
export const asyncStoragePersister = {
  persistClient: async (client: any) => {
    try {
      await AsyncStorage.setItem(
        'REACT_QUERY_OFFLINE_CACHE',
        JSON.stringify(client)
      );
    } catch (error) {
      console.error('Failed to persist query client:', error);
    }
  },
  restoreClient: async () => {
    try {
      const cached = await AsyncStorage.getItem('REACT_QUERY_OFFLINE_CACHE');
      return cached ? JSON.parse(cached) : undefined;
    } catch (error) {
      console.error('Failed to restore query client:', error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      await AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
    } catch (error) {
      console.error('Failed to remove query client:', error);
    }
  },
};
