# Rolling Tasks - Sun Dressed App
*Updated: June 15, 2025*

## Purpose
This file tracks development priorities for MVP completion and serves as a high-level coordination hub. For detailed history, please refer to the git log.

## Current Sprint: Pre-Launch Polish
- **Target**: App Store launch (July 2025)
- **Priority**: Fix critical bugs and prepare for production.

## Critical Issues & Next Steps

### 🐛 High Priority Bugs (Must Fix Before Launch)
1.  **Packing List State Management**: Trip data fails to load when re-entering the packing list screen, breaking the feature after its first use.
2.  **Login Regeneration**: Outfits regenerate on app restart unnecessarily, causing extra LLM API calls.
3.  **Console Log Cleanup**: Over 115 `console.log` statements must be removed before the production build.

### 📋 Immediate Next Steps
1.  **Fix Packing List**: Debug the state management logic in `packing-list.tsx` to ensure trip data is correctly retrieved on every screen visit.
2.  **Optimize Login Flow**: Address the race condition between weather loading and outfit restoration on the home screen to prevent unnecessary regeneration.
3.  **Production Cleanup**: Systematically remove all debug logs and perform final code cleanup.
4.  **Final Testing**: Conduct end-to-end testing of all user flows.
5.  **Submit**: Prepare for App Store submission.

---

## MVP Feature Status

### ✅ Completed Features
- **Trip Management**: Full CRUD with AsyncStorage.
- **AI Outfit Generation**: Gemini integration with explanations.
- **Weather Integration**: Real-time, location-based weather.
- **Location Services**: Google Places autocomplete with device location biasing.
- **Settings System**: User preferences with persistence.
- **Outfit Storage**: Calendar-based outfit persistence and smart restoration with weather, location, and activity context.
- **Activity Integration**: Activity-aware outfit generation.
- **Packing Lists**: Weather-aware packing list generation.

### ⚠️ Known Issues (Deferred Post-MVP)
- **TextInput in BentoBox**: Touch events are blocked inside the `FlipComponent`. A workaround is currently in place.
- **Storage Flow Disruption**: Adding the `activity` field may have caused minor inconsistencies in the storage/restoration logic.
- **API Inconsistencies**: Using both Google and OpenWeather for geocoding results in minor formatting differences.

### ❌ Post-MVP Features
- Full authentication system.
- Advanced error handling and input validation.
- Interactive BentoBox component state machine.
- Weather estimation for trips longer than 8 days.
- A unified geocoding service to replace Google Places autocomplete.

---

*This document has been condensed to focus on actionable tasks. The previous version's detailed, chronological log of completed work has been removed for clarity.*