# TanStack Query Storage Strategy for Sun Dressed

## Overview

This guide documents the comprehensive storage strategy for the Sun Dressed app using TanStack Query with AsyncStorage persistence. **All application data should flow through TanStack Query** - do not use direct AsyncStorage calls.

## Architecture Principles

###  Core Strategy: TanStack Query First

1. **Single Source of Truth**: TanStack Query cache is the primary data store
2. **Automatic Persistence**: Data persists to AsyncStorage automatically via `createAsyncStoragePersister`
3. **Date-Aware Caching**: Query keys include dates for proper cache segmentation
4. **Reactive Invalidation**: Cache updates trigger UI re-renders automatically

### L What NOT to Do

- **Never use direct AsyncStorage calls** (`AsyncStorage.getItem`, `AsyncStorage.setItem`)
- **Never create custom storage services** that bypass TanStack Query
- **Never mix TanStack Query with manual cache management**
- **Never use AsyncStorage keys that don't match query keys**

## Configuration

### 1. Query Client Setup (`src/config/queryClient.ts`)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours - must match persister maxAge
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      networkMode: 'offlineFirst', // Enable offline-first behavior
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      networkMode: 'offlineFirst',
      retry: 1,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'SUN_DRESSED_QUERY_CACHE', // Unique app identifier
  throttleTime: 1000, // Throttle writes to prevent spam
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});
```

### 2. App-Level Integration (`src/app/_layout.tsx`)

```typescript
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, asyncStoragePersister } from '@/config/queryClient';

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations();
      }}
    >
      <App />
    </PersistQueryClientProvider>
  );
}
```

## Data Patterns

### 1. Query Key Strategies

#### Date-Aware Keys (Recommended for Time-Sensitive Data)

```typescript
//  CORRECT: Include all relevant parameters in query key
export const packingListKeys = {
  all: ['packingList'] as const,
  list: (tripId: string, startDate?: string, endDate?: string) => {
    if (startDate && endDate) {
      return ['packingList', tripId, startDate, endDate] as const;
    }
    return ['packingList', tripId] as const;
  },
};

// Usage
const query = useQuery({
  queryKey: packingListKeys.list(tripId, '2024-06-20', '2024-06-21'),
  queryFn: () => Promise.resolve(null), // Populated via mutations
  enabled: !!tripId && !!startDate && !!endDate,
});
```

#### Simple Keys (For Non-Date-Dependent Data)

```typescript
//  CORRECT: Simple keys for user preferences, settings, etc.
export const settingsKeys = {
  all: ['settings'] as const,
  user: () => ['settings', 'user'] as const,
  style: () => ['settings', 'style'] as const,
};
```

### 2. Query Functions

#### For New Data (Empty State)

```typescript
//  CORRECT: Return null for new queries, populate via mutations
export function usePackingListQuery(tripId: string | null, startDate?: Date, endDate?: Date) {
  const startDateStr = startDate?.toISOString().split('T')[0];
  const endDateStr = endDate?.toISOString().split('T')[0];
  
  return useQuery({
    queryKey: packingListKeys.list(tripId || '', startDateStr, endDateStr),
    queryFn: () => Promise.resolve(null), // Will be populated by mutations
    enabled: !!tripId && !!startDate && !!endDate,
    staleTime: Infinity, // Prevent automatic refetching for cost control
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in memory for 1 week
  });
}
```

#### For API Data (Fetch from Server)

```typescript
//  CORRECT: For data that comes from external APIs
export function useWeatherQuery(location: string, date: string) {
  return useQuery({
    queryKey: ['weather', location, date],
    queryFn: () => fetchWeatherFromAPI(location, date),
    enabled: !!location && !!date,
    staleTime: 1000 * 60 * 30, // 30 minutes for weather data
  });
}
```

### 3. Mutation Patterns

#### Save to Cache Pattern

```typescript
//  CORRECT: Mutations update TanStack Query cache directly
export function usePackingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      tripId, 
      packingList, 
      startDate, 
      endDate 
    }: { 
      tripId: string; 
      packingList: string[]; 
      startDate: Date; 
      endDate: Date; 
    }) => {
      // Return data directly - no AsyncStorage calls
      return { packingList };
    },
    onSuccess: (data, variables) => {
      const startDateStr = variables.startDate.toISOString().split('T')[0];
      const endDateStr = variables.endDate.toISOString().split('T')[0];
      
      // Set data directly in TanStack Query cache
      queryClient.setQueryData(
        packingListKeys.list(variables.tripId, startDateStr, endDateStr), 
        data
      );
    },
  });
}
```

#### Delete from Cache Pattern

```typescript
//  CORRECT: Remove data from cache
export function useDeletePackingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => Promise.resolve(), // No async operation needed
    onSuccess: (_, tripId) => {
      // Remove all variations from cache
      queryClient.removeQueries({
        queryKey: ['packingList', tripId],
        exact: false, // Remove all date variations
      });
    },
  });
}
```

## Common Use Cases

### 1. Trip Management

```typescript
//  CORRECT: Trip CRUD operations
const { data: trips = [] } = useTripsQuery();
const addTripMutation = useAddTripMutation();
const updateTripMutation = useUpdateTripMutation();
const deleteTripMutation = useDeleteTripMutation();

// Usage
await addTripMutation.mutateAsync(newTrip);
await updateTripMutation.mutateAsync(updatedTrip);
await deleteTripMutation.mutateAsync(tripId);
```

### 2. User Settings & Preferences

```typescript
//  CORRECT: Settings with TanStack Query
const { data: settings } = useQuery({
  queryKey: ['settings', 'user'],
  queryFn: () => defaultSettings, // Return defaults, update via mutations
  staleTime: Infinity,
});

const updateSettingsMutation = useMutation({
  mutationFn: (newSettings) => Promise.resolve(newSettings),
  onSuccess: (data) => {
    queryClient.setQueryData(['settings', 'user'], data);
  },
});
```

### 3. Generated Content (LLM Results)

```typescript
//  CORRECT: Store AI-generated content
const generateOutfitMutation = useMutation({
  mutationFn: async ({ weather, preferences }) => {
    const outfit = await generateOutfitLLM(weather, preferences);
    return { outfit, generatedAt: new Date() };
  },
  onSuccess: (data, variables) => {
    queryClient.setQueryData(
      ['outfit', variables.date, variables.location], 
      data
    );
  },
});
```

## Cache Invalidation Strategies

### 1. Date Changes (Automatic with Proper Keys)

```typescript
//  CORRECT: When trip dates change, old cache entries become unreachable
// New query keys = new cache entries = no stale data

// Old trip: June 20-21
// Query key: ['packingList', 'trip123', '2024-06-20', '2024-06-21']

// Updated trip: June 23-24  
// Query key: ['packingList', 'trip123', '2024-06-23', '2024-06-24']
// Old cache entry is automatically isolated
```

### 2. Manual Invalidation

```typescript
//  CORRECT: Invalidate related queries after updates
const updateTripMutation = useMutation({
  mutationFn: updateTrip,
  onSuccess: (updatedTrip, variables) => {
    // Invalidate all related queries
    queryClient.invalidateQueries({
      queryKey: ['trips'],
    });
    
    // If dates changed, remove old packing lists
    if (hasDateChanged(variables.oldTrip, updatedTrip)) {
      queryClient.removeQueries({
        queryKey: ['packingList', updatedTrip.id],
        exact: false, // Remove all date variations
      });
    }
  },
});
```

## Error Handling

### 1. Query Errors

```typescript
//  CORRECT: Handle query errors through TanStack Query
const { data, error, isLoading } = useQuery({
  queryKey: ['weather', location],
  queryFn: fetchWeather,
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (error) {
  // Handle error in UI
  return <ErrorMessage error={error.message} />;
}
```

### 2. Mutation Errors

```typescript
//  CORRECT: Handle mutation errors
const mutation = useMutation({
  mutationFn: saveData,
  onError: (error, variables, context) => {
    // Optionally rollback optimistic updates
    if (context?.previousData) {
      queryClient.setQueryData(queryKey, context.previousData);
    }
  },
});

if (mutation.error) {
  // Show error in UI
}
```

## Performance Considerations

### 1. Cache Configuration

```typescript
//  CORRECT: Optimize for your use case
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours for offline support
      staleTime: Infinity, // For generated content that doesn't change
      // OR
      staleTime: 1000 * 60 * 5, // 5 minutes for API data
    },
  },
});
```

### 2. Selective Persistence

```typescript
//  CORRECT: Filter what gets persisted
const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  // Only persist specific data types
  serialize: (data) => {
    // Filter out large or sensitive data before persistence
    const filtered = filterSensitiveData(data);
    return JSON.stringify(filtered);
  },
});
```

## Migration from Legacy AsyncStorage

### L OLD WAY (Don't Do This)

```typescript
// L WRONG: Direct AsyncStorage usage
class PackingListService {
  static async getPackingList(tripId: string) {
    const data = await AsyncStorage.getItem(`packing_list_${tripId}`);
    return data ? JSON.parse(data) : null;
  }
  
  static async savePackingList(tripId: string, list: string[]) {
    await AsyncStorage.setItem(`packing_list_${tripId}`, JSON.stringify(list));
  }
}
```

###  NEW WAY (Correct Approach)

```typescript
//  CORRECT: TanStack Query with automatic persistence
export function usePackingListQuery(tripId: string, startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: packingListKeys.list(tripId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]),
    queryFn: () => Promise.resolve(null),
    enabled: !!tripId && !!startDate && !!endDate,
  });
}

export function usePackingListMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, packingList, startDate, endDate }) => 
      Promise.resolve({ packingList }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        packingListKeys.list(variables.tripId, /* dates */), 
        data
      );
    },
  });
}
```

## Debugging & Development

### 1. DevTools Integration

```typescript
// Add React Query DevTools in development
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App() {
  return (
    <>
      <YourApp />
      {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
}
```

### 2. Cache Inspection

```typescript
//  CORRECT: Inspect cache contents
const queryClient = useQueryClient();

// Get all cached data
const cacheData = queryClient.getQueryCache().getAll();

// Get specific query data
const packingListData = queryClient.getQueryData(['packingList', tripId]);

// Get query state (includes metadata)
const queryState = queryClient.getQueryState(['packingList', tripId]);
```

## Summary

**Key Principles:**
1. **TanStack Query First**: All data flows through TanStack Query
2. **Automatic Persistence**: Let `createAsyncStoragePersister` handle AsyncStorage
3. **Date-Aware Keys**: Include dates in query keys for proper segmentation
4. **No Direct AsyncStorage**: Never call AsyncStorage directly
5. **Cache as Source of Truth**: UI reads from TanStack Query cache

**Benefits:**
-  Automatic cache invalidation when data changes
-  Offline-first behavior with persistence
-  Optimistic updates and error handling
-  Consistent data layer across the app
-  No cache mismatches or stale data issues

This approach ensures data consistency, proper cache management, and eliminates the class of bugs caused by manual AsyncStorage management.