# Sun Dressed MVP Implementation Plan

## Executive Summary
The Sun Dressed app is functionally complete but requires critical fixes and App Store compliance work before launch. This plan outlines a phased approach to deliver an App Store-ready MVP in 7-10 days.

## Current State Analysis

### ✅ Working Features
- Weather-based outfit generation with Google Gemini
- Trip planning and packing list generation
- Location services with Google Places
- Settings persistence (local only)
- TanStack Query for data management
- Professional UI/UX with placeholders for future features

### ❌ Critical Gaps
1. **No Authentication Backend** - UI exists but no Supabase integration
2. **Performance Bug** - Outfits regenerate on every app launch
3. **Missing App Store Assets** - No icon, splash screen, or privacy policy
4. **No Password Management** - Account screen lacks password change functionality
5. **No Error Boundaries** - App can crash from unhandled errors

## Phase 1: Critical Bug Fixes (1-2 days)

### 1.1 Fix Login Regeneration Bug
JOEY NOTE: Fixed on 6/19
```

### 1.2 Fix Trip Weather Forecast Display
JOEY NOTE: Fixed 6/19

Need to handle trips spanning the 8 day range, currently only goes up to 8, or will ddo trips fully after 8 days but not both. If trip goes past 8 days it cuts off at the 8 day mark. Ex: 26th is 8 days away . A trip goes 25th to 27th. Weather will only show 25th and 26th. Shoudl show the output of onecall standard for 25 and 26 and the output from the extended forecast mode for the 27th. Also forecast needs to be a scrollview as 6 cards go below the screen on my phone.



### 1.3 Add Error Boundaries
JOEY NOTE: Completed on 6/19. 
**Create**: `src/components/ErrorBoundary.tsx`
- Catch JavaScript errors in component tree
- Display fallback UI instead of white screen
- Log errors for debugging
- Add "Try Again" functionality

### 1.4 Add Loading States
JOEY NOTE: I think this is all good, looks good to me at least
**Files**: All screens with async operations
- Create consistent loading skeleton components
- Add loading states to all API calls
- Prevent user actions during loading

## Phase 2: Authentication Implementation (3-4 days)

### 2.1 Supabase Client Setup
**Create**: `src/services/supabase/client.ts`
```typescript
import { createClient } from '@supabase/supabase-js'
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@env'

export const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY
)
```

### 2.2 Auth Context Implementation
**Create**: `src/contexts/AuthContext.tsx`
- User state management
- Login/logout functions
- Session persistence
- Protected route logic

### 2.3 Email/Password Authentication
**Update**: `src/app/(auth)/index.tsx`
- Connect login form to Supabase
- Add input validation
- Implement error handling
- Add loading states

### 2.4 Password Management
**Update**: `src/app/(tabs)/account.tsx`
- Add "Change Password" section
- Implement password update with Supabase
- Add current password verification
- Show success/error messages

### 2.5 OAuth Implementation (Apple Sign In Required)
**Install**: `expo install expo-apple-authentication`
**Update**: `src/app/(auth)/index.tsx`
- Implement Apple Sign In (required for App Store)
- Add Google Sign In
- Handle OAuth callbacks
- Update user profile on successful auth

### 2.6 Route Protection
**Update**: `src/app/_layout.tsx`
```typescript
// Add auth check before rendering tabs
const { user, isLoading } = useAuth();

if (isLoading) return <SplashScreen />;
if (!user) return <Stack.Screen name="(auth)" />;

return <Stack.Screen name="(tabs)" />;
```

## Phase 3: App Store Compliance (2-3 days)

### 3.1 App Assets Creation
**Required Files**:
- `src/assets/icon.png` - 1024x1024 app icon
- `src/assets/splash.png` - 2048x2048 splash screen
- Generate all required sizes using Expo tools

### 3.2 App Configuration Updates
**Update**: `app.config.js`
```javascript
{
  icon: "./src/assets/icon.png",
  splash: {
    image: "./src/assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#FBF5F3"
  },
  ios: {
    bundleIdentifier: "com.sundressed.app",
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "Sun Dressed uses your location to provide accurate weather-based outfit recommendations.",
      NSCameraUsageDescription: "Sun Dressed needs camera access to let you take outfit photos.",
      NSPhotoLibraryUsageDescription: "Sun Dressed needs photo library access to save your outfit photos."
    },
    associatedDomains: ["applinks:sundressed.app"]
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/adaptive-icon.png",
      backgroundColor: "#FBF5F3"
    },
    permissions: ["ACCESS_FINE_LOCATION", "CAMERA", "WRITE_EXTERNAL_STORAGE"]
  }
}
```

### 3.3 Privacy Policy & Terms
**Create**: Static website or GitHub Pages
- Data collection disclosure
- Third-party services (OpenWeather, Google Places, Gemini)
- User rights and data deletion
- Contact information

### 3.4 App Store Metadata
**Prepare**:
- App name: "Sun Dressed - AI Outfit Planner"
- Subtitle: "Weather-smart wardrobe decisions"
- Keywords: outfit, weather, AI, fashion, clothing, planner, packing, travel
- Category: Lifestyle
- Age rating: 4+

**Screenshots Required** (6.5" and 5.5" iPhone):
1. Home screen with outfit
2. Trip planning screen
3. Packing list generation
4. Settings/customization
5. Weather display

## Phase 4: Feature Enhancements (1-2 days)

### 4.1 ClothingIcons Integration
**Update**: `src/components/BentoBox.tsx`
```typescript
import { ClothingIcons } from '@/assets/ClothingIcons';

// Add icon mapping logic
const getIconForItem = (item: string) => {
  const itemLower = item.toLowerCase();
  if (itemLower.includes('shirt')) return ClothingIcons.shirt;
  if (itemLower.includes('pants')) return ClothingIcons.pants;
  // ... etc
}
```

### 4.2 LLM Prompt Constraints
**Update**: `src/services/llmService.ts`
- Add item limits: "Maximum 2 accessories, 1 outer layer"
- Implement content filtering for inappropriate suggestions
- Add fallback responses for API failures

### 4.3 API Optimization
**Create**: `src/utils/api.ts`
```typescript
// Exponential backoff retry logic
export const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

## Phase 5: Final Testing & Polish (1 day)

### 5.1 Device Testing Checklist
- [ ] iPhone 15 Pro Max (6.7")
- [ ] iPhone 15 (6.1")
- [ ] iPhone SE (4.7")
- [ ] iPad (if supporting tablets)
- [ ] Test on iOS 16 and 17
- [ ] Test offline mode
- [ ] Test with poor network

### 5.2 Performance Optimization
- Add `React.memo` to heavy components
- Implement `useMemo` for expensive calculations
- Lazy load modal screens
- Optimize image assets

### 5.3 Accessibility
- Add `accessibilityLabel` to all interactive elements
- Test with VoiceOver
- Ensure minimum touch target size (44x44)
- Add proper color contrast

## Technical Debt & Architecture Improvements

### Immediate Refactoring Needs
1. **Extract Home Screen Logic**
   - Create `useWeatherData`, `useLocationData` hooks
   - Separate concerns into smaller components
   
2. **Create Constants File**
   ```typescript
   // src/constants/index.ts
   export const CACHE_DURATION = {
     WEATHER: 10 * 60 * 1000, // 10 minutes
     LOCATION: 5 * 60 * 1000,  // 5 minutes
   }
   ```

3. **Unified Error Handling**
   - Create error types enum
   - Standardize error messages
   - Add user-friendly error displays

### Post-MVP Architecture
1. **Service Interfaces**
   ```typescript
   interface WeatherProvider {
     getCurrentWeather(location: Coordinates): Promise<Weather>
     getForecast(location: Coordinates, days: number): Promise<Forecast[]>
   }
   ```

2. **Dependency Injection**
   - Create service container
   - Allow easy provider swapping
   - Better testability

## Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|------------|
| Supabase integration complexity | Start with email/password only |
| App Store rejection | Follow guidelines strictly, test edge cases |
| API rate limits | Implement aggressive client-side caching |
| OAuth implementation time | Prioritize Apple Sign In only for MVP |

### Timeline Risks
- Buffer time built into each phase
- Daily progress checks
- Feature cuts if behind schedule
- TestFlight submission ASAP

## Success Criteria

### Pre-Launch Checklist
- [ ] Zero crashes in 100 test sessions
- [ ] All user flows complete without errors
- [ ] App loads in <3 seconds
- [ ] Authentication works reliably
- [ ] Weather displays correctly
- [ ] Outfits generate without duplicates
- [ ] Trips save and load properly
- [ ] Settings persist across sessions

### Launch Metrics
- Crash-free rate >99%
- App Store rating >4.0
- Daily active users retention >40%
- Average session length >2 minutes

## Implementation Schedule

| Day | Phase | Tasks |
|-----|-------|-------|
| 1 | Bug Fixes | Fix regeneration bug, add error boundaries |
| 2 | Bug Fixes | Fix trip weather, add loading states |
| 3 | Auth | Supabase setup, email/password auth |
| 4 | Auth | Apple Sign In, password management |
| 5 | Auth | Route protection, session management |
| 6 | App Store | Create assets, update config |
| 7 | App Store | Privacy policy, screenshots |
| 8 | Features | Icon integration, API optimization |
| 9 | Testing | Device testing, performance |
| 10 | Submit | TestFlight submission |

## Conclusion

This plan provides a clear, actionable path to App Store launch. The app's core functionality is solid; we need to fix critical bugs, implement authentication, and ensure App Store compliance. By following this phased approach, Sun Dressed will be ready for users in 7-10 days.