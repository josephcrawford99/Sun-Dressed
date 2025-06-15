# Architect Report: Sun Dressed App
*Generated: June 15, 2025*
*Status: Pre-Launch MVP*

## Executive Summary

Sun Dressed is a React Native weather-based outfit suggestion app built with Expo Router v5. The architecture follows a layered approach with clear separation between presentation, state management, services, and data persistence. The app is functionally complete for MVP but has two critical bugs that need fixing before App Store launch.

## Architecture Overview

### Technology Stack
- **Framework**: Expo SDK 53 with file-based routing (Expo Router v5)
- **Language**: TypeScript with strict mode
- **State Management**: Hybrid approach using Context API + TanStack Query
- **AI/LLM**: Google Gemini API for outfit and packing list generation
- **Storage**: AsyncStorage for local persistence
- **APIs**: OpenWeather (weather), Google Places (location autocomplete)

### Architectural Layers

```
┌─────────────────────────────────────────┐
│     Presentation Layer (UI/UX)          │
│  • Expo Router (file-based routing)     │
│  • React Native components              │
│  • Centralized theming                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    State Management Layer               │
│  • Context API (global app state)       │
│  • TanStack Query (server state)        │
│  • Custom hooks (business logic)        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Service Layer                     │
│  • LLM Services (Gemini integration)    │
│  • Weather Services (OpenWeather)       │
│  • Location Services (Google Places)    │
│  • Storage Services (AsyncStorage)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Data Persistence Layer               │
│  • AsyncStorage (local data)            │
│  • TanStack Query cache                 │
└─────────────────────────────────────────┘
```

## Core Feature Implementation

### 1. Outfit Generation Algorithm

The outfit generation system is the heart of the application and implements a sophisticated multi-tier caching strategy:

#### Data Flow
```
User Input (Date/Activity/Location)
    ↓
useOutfitGenerator Hook
    ↓
OutfitContext (Global State)
    ↓
OutfitManager (Orchestration)
    ├─→ Memory Cache (Instant)
    ├─→ Storage Cache (AsyncStorage)
    ├─→ Change Detection (Validation)
    └─→ LLM Service (API Call - Last Resort)
```

#### Key Components

**OutfitManager** (`services/outfitManager.ts`)
- Central orchestrator for outfit generation
- Implements cache hierarchy: Memory → Storage → API
- Handles change detection and regeneration logic

**OutfitLLMService** (`services/outfitLLMService.ts`)
- Manages Gemini API integration
- Implements request coalescing to prevent duplicate calls
- 5-minute prompt cache for identical requests
- Structured prompt engineering for consistent results

**ChangeDetectionEngine** (`services/changeDetectionEngine.ts`)
- Determines if stored outfits are still valid
- Checks weather changes (>5°F temperature, >20% precipitation)
- Validates activity context changes
- Prevents unnecessary API calls

**CacheService** (`services/cacheService.ts`)
- In-memory cache for current session
- Key format: `{city}-{date}-{activity}`
- Instant retrieval for recently generated outfits

#### State Management Pattern
The outfit system uses a Context + Reducer pattern:
- **OutfitContext**: Provides global access to outfit state
- **OutfitReducer**: Handles state transitions (loading, success, error)
- **useOutfitGenerator**: Hook that encapsulates generation logic

### 2. Trip Management System

Fully migrated to TanStack Query for better performance and caching:

#### Architecture
```
Trip CRUD Operations
    ↓
useTrips Hook
    ↓
TanStack Query Mutations
    ↓
TripsQueryService
    ↓
AsyncStorage
    ↓
Automatic Cache Invalidation
```

#### Key Features
- **Optimistic Updates**: UI updates immediately, rollback on error
- **Query Key Factory**: Consistent cache key generation
- **Mutation Hooks**: Separate hooks for create, update, delete
- **Automatic Refetching**: Ensures data consistency

### 3. Packing List Generation

Integrated with trip management and weather forecasting:

#### Flow
```
Trip Selection
    ↓
Weather Forecast Fetch
    ↓
usePackingList Hook
    ↓
PackingListLLMService
    ↓
TanStack Query Cache
    ↓
AsyncStorage Persistence
```

## Critical Issues Analysis

### 1. Login Regeneration Bug (High Priority)

**Problem**: Outfits regenerate unnecessarily on app restart, causing extra API calls.

**Root Cause Analysis**:
- The `useHomeScreenState` hook initializes weather and outfit restoration concurrently
- Race condition: Weather updates trigger regeneration before cached outfits are restored
- The `isInitialized` flag doesn't properly coordinate these async operations

**Recommended Fix**:
```typescript
// Implement sequential initialization
1. Load settings first
2. Restore cached outfits
3. Then fetch weather
4. Only regenerate if no valid cached outfit exists
```

### 2. Missing Weather Card Bug (High Priority)

**Problem**: Weather forecast button disappeared from packing list screen.

**Root Cause Analysis**:
- Conditional rendering tied to `packingList.length > 0`
- Weather forecast might be populated independently
- Component visibility logic needs adjustment

**Recommended Fix**:
```typescript
// Check weatherForecast existence separately
{weatherForecast && weatherForecast.length > 0 && (
  <WeatherForecastButton />
)}
```

## Architectural Strengths

1. **Clear Separation of Concerns**: Each layer has distinct responsibilities
2. **Type Safety**: Full TypeScript implementation with strict mode
3. **Smart Caching Strategy**: Multi-tier caching minimizes API calls
4. **Modular Service Architecture**: Easy to extend or replace services
5. **Performance Optimizations**: Request coalescing, prompt caching
6. **Design System**: Centralized theming ensures consistency

## Architectural Concerns

1. **State Management Complexity**: Mix of Context API and TanStack Query
2. **Initialization Sequencing**: No clear boot sequence causing race conditions
3. **Error Handling**: Inconsistent patterns across services
4. **Testing Infrastructure**: Architecture supports testing but lacks implementation
5. **Memory Management**: Potential memory leaks in cache services

## Recommendations for Production

### Immediate (Before Launch)
1. Fix login regeneration bug by implementing proper initialization sequencing
2. Restore weather card visibility on packing list screen
3. Add error boundaries for graceful error handling
4. Implement proper loading states during initialization

### Short-term (Post-Launch)
1. Migrate remaining Context state to TanStack Query for consistency
2. Implement comprehensive error handling with user feedback
3. Add performance monitoring (Sentry or similar)
4. Create unit tests for critical services

### Long-term (Future Versions)
1. Implement proper authentication system (Supabase ready)
2. Add offline support with better sync strategies
3. Implement the BentoBox state machine for interactive outfit editing
4. Create a unified geocoding service
5. Add analytics for usage patterns

## Conclusion

The Sun Dressed architecture is well-designed for an MVP with clear patterns that support future scalability. The layered architecture with strong typing provides a solid foundation. The two critical bugs are implementation issues rather than architectural flaws and can be fixed quickly.

The outfit generation algorithm is particularly well-thought-out with its multi-tier caching and intelligent change detection. The recent migration to TanStack Query for trip management shows good architectural evolution.

With the recommended fixes implemented, the app will be ready for production launch while maintaining a codebase that can grow with future features.