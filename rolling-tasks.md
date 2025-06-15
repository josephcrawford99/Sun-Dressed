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
- **Daily Outfit Feedback (MVP)**: Initial implementation of daily feedback modal system with 1-10 rating slider and LLM integration. *Commit: 1aec603*

### ⚠️ Known Issues (Deferred Post-MVP)
- **TextInput in BentoBox**: Touch events are blocked inside the `FlipComponent`. A workaround is currently in place.
- **API Inconsistencies**: Using both Google and OpenWeather for geocoding results in minor formatting differences.

### ❌ Post-MVP Features
- Full authentication system.
- Advanced error handling and input validation.
- Interactive BentoBox component state machine.
- Weather estimation for trips longer than 8 days.
- A unified geocoding service to replace Google Places autocomplete.
- **Daily Feedback UX Improvements**: Enhanced feedback system with better styling, state management, and structured selectors.

---

## Future Daily Feedback Improvements (Post-MVP)

### UX & Design Issues
1. **Yesterday-Only Scope**: Restrict feedback to previous day only, no future dates
2. **App Style Consistency**: Match existing design system colors, typography, and spacing
3. **Modal Design**: Implement proper rounded-top modal with backdrop (like packing list modal)
4. **Scroll Issue**: Fix infinite scroll/empty space below feedback form

### State Management Issues  
5. **Feedback Persistence**: Clarify when feedback is stored and ensure it persists with outfit data
6. **State Confusion**: Fix rating state persistence when switching between good/bad ratings
7. **Form Validation**: Ensure single submission and proper state clearing

### Feature Enhancements
8. **Structured Feedback**: Replace free-text with predefined selectors (too warm/cold, too formal/casual, etc.)
9. **Better Integration**: Seamless integration with existing outfit storage patterns

### Technical Debt
- **Rollback Point**: Commit `1aec603` contains working MVP implementation
- **Dependencies**: Added `@react-native-community/slider` package
- **Architecture**: Built on TanStack Query with backward compatibility for existing feedback system

*This document has been condensed to focus on actionable tasks. The previous version's detailed, chronological log of completed work has been removed for clarity.*