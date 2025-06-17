# MVP Plan

## Overall goal
App to use ai to generate an outfit of the day based on the weather and a packing list based on a trip plan.

## Features needed (we have already)
- Outfit bento box
- Weather display
- trip planning and trip packing list
- trip storage
- settings for gender
- settings for units
- outfit generation by llm

## Features needed (we don't have yet)
- Authentication through supabase
- email tie in through settings page
- Icons for outfit items
- llm support for limited item list to choose from
-trips wearther forecast doesnt work (shows next fe days, not days of the trip)

## Features to remove for now
- Previous and next day outfit
- Placeholder closet and social screen

## Claude notes below

### Current App Status Assessment (Updated)

#### ✅ Features Already Working:
1. **Outfit Generation**: Fully functional with Google Gemini LLM
2. **Weather Display**: Real-time weather with OpenWeather API  
3. **Trip Planning**: Complete CRUD with TanStack Query (issue resolved)
4. **Packing Lists**: Weather-aware generation working
5. **Settings**: Gender and units preferences with persistence
6. **BentoBox Display**: Shows outfit items (text-only)
7. **Location Services**: Google Places autocomplete
8. **Basic UI/UX**: Professional placeholders for future features

#### 🐛 Confirmed Bugs to Fix:

1. **Login Regeneration Bug** (HIGH PRIORITY)
   - Race condition causes unnecessary outfit regeneration on app restart
   - Root cause: Weather loading state conflicts with outfit restoration
   - Fix: Better state management to distinguish initial load vs regeneration
   
2. **Trip Weather Forecast** (MEDIUM PRIORITY)
   - Shows next few days from today, not actual trip dates
   - Root cause: OpenWeather API limitation (8-day max forecast)
   - Fix: Show appropriate message for trips >8 days in future

3. **Packing List Weather Card** (LOW - Working as designed)
   - Only shows after generation (when packingList.length > 0)
   - Not actually a bug, but could improve UX

#### ❌ Critical Missing Features:

1. **Authentication System**
   - UI exists but backend not connected
   - Need to restore Supabase implementation
   - Apple Sign In required for App Store
   
2. **App Store Assets**
   - App icon (multiple sizes required)
   - Splash screen
   - Screenshots for submission
   - Privacy policy URL
   
3. **Minor Features**
   - Icons integration in BentoBox
   - Email settings integration
   - Location permission descriptions

### Apple Developer Program Requirements

#### Required for Submission:
1. **Technical Requirements**
   - Bundle ID: ✅ `com.sundressed.app` configured
   - Build with Xcode 16/iOS 18 SDK: ✅ Using Expo SDK 53
   - Performance standards: ⚠️ Fix regeneration bug first
   
2. **Assets & Metadata**
   - App icon: ❌ Multiple sizes (1024x1024 for App Store)
   - Launch screen: ❌ Required
   - Screenshots: ❌ 6.5" and 5.5" iPhone sizes
   - App description: ❌ Need to write
   - Keywords: ❌ For ASO
   - Support URL: ❌ Can be simple contact page
   - Privacy Policy: ❌ Required URL
   
3. **Authentication Requirements**
   - Apple Sign In: ❌ Required if offering other social logins
   - Restore purchases: N/A (no IAP)
   - Data & Privacy questionnaire: ❌ Must complete

### Implementation Plan (WITH Authentication)

#### Phase 1: Critical Bug Fixes (1-2 days)
1. Fix login regeneration bug
   - Add proper initialization state
   - Prevent race condition with weather loading
2. Fix trip weather display
   - Add date validation
   - Show "Weather available closer to trip" for >8 days
3. Add basic error boundaries
4. Improve loading states

#### Phase 2: Authentication (2-3 days)
1. Initialize Supabase client
2. Implement email/password auth
3. Implement Apple Sign In (required)
4. Add Google Sign In
5. Session management & persistence
6. Protected route logic
7. Email integration in settings

#### Phase 3: App Store Prep (1-2 days)
1. Create app icon (all sizes)
2. Design splash screen
3. Write privacy policy
4. Prepare 10+ screenshots
5. Write app description & keywords
6. Add location permission strings
7. Test on multiple device sizes

#### Phase 4: Final Polish (1 day)
1. API optimization (retry logic, better caching)
2. Performance testing
3. Final bug fixes
4. Submit to TestFlight

### Total Timeline: 5-8 days

### API Optimization Notes:
- Current implementation is functional but could be improved
- Add exponential backoff for retries
- Consider request deduplication
- Weather cache (10 min) is reasonable
- Rate limiting exists but client-side only

### Post-MVP Improvements:
- Icons in BentoBox (have components, need integration)
- Extended calendar navigation
- Proper TypeScript types (some `any` types exist)
- Accessibility features
- Analytics/crash reporting
- Onboarding flow
- Unit tests

### Final Recommendation:
Proceed with authentication implementation since you've done it before and it's required for Apple Sign In. Focus on the critical bugs first, then auth, then App Store assets. The app is closer to launch-ready than initially assessed - just needs these specific items completed.
