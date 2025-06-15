import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

// Create a client with offline-first configuration for React Native
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time: how long data stays in memory after component unmounts
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      // Stale time: how long data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Retry failed requests
      retry: 2,
      // Enable offline-first behavior
      networkMode: 'offlineFirst',
      // Refetch on window focus for better UX
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect for local storage data
      refetchOnReconnect: false,
    },
    mutations: {
      // Enable offline mutations
      networkMode: 'offlineFirst',
      // Retry failed mutations
      retry: 1,
    },
  },
});

// Create a persister for AsyncStorage with specific configuration for our app
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'SUN_DRESSED_QUERY_CACHE', // Custom key to avoid conflicts
  throttleTime: 1000, // Throttle saving to prevent excessive writes
  // Serialize and deserialize functions for Date objects and complex data
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

// Configure specific mutation defaults for packing lists
queryClient.setMutationDefaults(['packingList'], {
  networkMode: 'offlineFirst',
  retry: 2,
});

queryClient.setMutationDefaults(['weatherForecast'], {
  networkMode: 'offlineFirst',
  retry: 2,
});

export { queryClient, asyncStoragePersister };