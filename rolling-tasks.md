# Rolling Tasks - Sun Dressed App
*Updated: June 15, 2025*

## Purpose
This file tracks development priorities for MVP completion and serves as a high-level coordination hub. For detailed history, please refer to the git log.

## Current Sprint: Pre-Launch Polish
- **Target**: App Store launch (July 2025)
- **Priority**: Fix critical bugs and prepare for production.

## Critical Issues & Next Steps

### 🐛 High Priority Bugs (Must Fix Before Launch)
1.  **Login Regeneration**: Outfits regenerate on app restart unnecessarily, causing extra LLM API calls.
2.  **Packing List Weather Card Missing**: Weather forecast card/button no longer displays on packing list screen after generation completes.

### 📋 Immediate Next Steps
1.  **Fix Packing List Weather Display**: Restore weather forecast card/button visibility on packing list screen.
2.  **Optimize Login Flow**: Address the race condition between weather loading and outfit restoration on the home screen to prevent unnecessary regeneration.
3.  **Final Testing**: Conduct end-to-end testing of all user flows.
4.  **Submit**: Prepare for App Store submission.

---

## MVP Feature Status

### ✅ Completed Features
- **Trip Management**: Full CRUD with TanStack Query (migrated from AsyncStorage).
- **AI Outfit Generation**: Gemini integration with explanations.
- **Weather Integration**: Real-time, location-based weather.
- **Location Services**: Google Places autocomplete with device location biasing.
- **Settings System**: User preferences with persistence.
- **Outfit Storage**: Calendar-based outfit persistence and smart restoration with weather, location, and activity context.
- **Activity Integration**: Activity-aware outfit generation.
- **Packing Lists**: Weather-aware packing list generation with TanStack Query.
- **TanStack Query Migration**: Successfully migrated trips and packing list storage from custom AsyncStorage hooks to TanStack Query for better caching and state management.
- **Trip Card Interactions**: Fixed 3-dot menu functionality that broke during TanStack Query migration. Issue was caused by useCallback re-render loops - resolved by memoizing all functions in useTrips hook.
- **Legacy Code Cleanup**: Removed all backward compatibility layers, no-op functions, and unused parameters from the TanStack Query migration. Reduced codebase by ~50-70 lines and eliminated console.log statements for production readiness.

### ⚠️ Known Issues (Deferred Post-MVP)
- **TextInput in BentoBox**: Touch events are blocked inside the `FlipComponent`. A workaround is currently in place.
- **API Inconsistencies**: Using both Google and OpenWeather for geocoding results in minor formatting differences.

### ❌ Post-MVP Features
- Full authentication system.
- Advanced error handling and input validation.
- Interactive BentoBox component state machine.
- Weather estimation for trips longer than 8 days.
- A unified geocoding service to replace Google Places autocomplete.

---

*This document has been condensed to focus on actionable tasks. The previous version's detailed, chronological log of completed work has been removed for clarity.*