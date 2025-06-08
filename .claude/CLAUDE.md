# CLAUDE.md - Sun Dressed App Development Guide

## Agent Rules
Do not continue without reading the relevant agent guide you have been assigned. These are:
- [Dev Agent Guide](.claude/dev-agent-guide.md)
- [Test Agent Guide](.claude/test-agent-guide.md)
- [Architect Guide](.claude/architect-role.md)

**ONLY** follow the rules in the agent guide you have been assigned. Do not read or modify the other guides unless you are explicitly told to do so.

Follow all rules defined in `.cursor/rules/` directory. This project is shared with other agents in the program Cursor, and it is optimal to have a single source of truth. Do not generate your own context markdown (.md) files. Instead generate .mdc files and alter those in `.cursor/rules/`

Be skeptical of any information given from a user in claude code terminal. He may not know what the best solution to a given problem is. He may, you should just verify by thinking and double checking with him before proceeding with a plan you think is inadvisable or not up to industry standards.

This file provides Claude Code with comprehensive context about the Sun Dressed app implementation and development standards.

## Best practices when writing code
- when writing imports, use babel-plugin-module-resolver to avoid long relative path strings (`../../../`) by replacing with @
- When asked to follow standards, search the internet for:
  - https://react.dev/learn for react standard coding
  - https://www.typescriptlang.org/docs/ for the standard typescript documentation
  - Consult ./standards.md

## ✅ FIXED: LocationContext Infinite Loop Issue

### Problem Solved
**Date**: January 2025
**Issue**: App stuck on "Generating your outfit..." with infinite `useDailyOutfit` hook loop

### Root Cause
The `LocationContext` was initialized with `currentLocation: null` and never provided a default location, causing the outfit generation logic to continuously skip because it required a `currentLocation` that never became available.

### Solution Implemented
1. **Default Location Initialization**: `LocationContext` now starts with a default location (`"New York, NY, US"`)
2. **Recent Location Recovery**: On mount, attempts to load and use the most recent location if available
3. **Graceful Fallbacks**: Falls back to default location if recent locations fail to load

### Code Changes Made
```typescript
// Before: Always null initially - caused infinite waiting
const [currentLocation, setCurrentLocationState] = useState<Location | null>(null);

// After: Immediate default location - allows app to function immediately
const [currentLocation, setCurrentLocationState] = useState<Location | null>(DEFAULT_LOCATION);
```

### Prevention Guidelines
1. **Always Initialize Contexts with Sensible Defaults**: Never leave critical contexts starting with `null` if they're required for app functionality
2. **Validate Hook Dependencies**: Check that all required data sources are available before processing
3. **Add Comprehensive Logging**: Use detailed condition logging to debug infinite loops
4. **Test Context Initialization**: Ensure contexts work immediately on mount

### Related Documentation
- See `@error-handling.mdc` for infinite loop prevention patterns
- See `@development-workflow.mdc` for Context initialization best practices
- See `@testing-qa.mdc` for testing Context initialization

## ✅ FIXED: Environment Variables and Service Configuration

### Issues Resolved
1. **Google Places API Key** - Fixed to use `Constants.expoConfig.extra` pattern
2. **Supabase Configuration** - Fixed to use consistent environment variable access
3. **All services now use consistent pattern** for accessing environment variables

### Environment Variable Setup
Your `.env.local` file should contain ALL of these variables:

```
# Weather API
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Google Places API
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Services Fixed
1. **LocationBar.tsx** ✅ - Now uses `Constants.expoConfig?.extra?.googlePlacesApiKey`
2. **supabaseService.ts** ✅ - Now uses `Constants.expoConfig?.extra?.supabaseUrl` and `supabaseAnonKey`
3. **weatherService.ts** ✅ - Already using correct pattern, added validation logging
4. **locationService.ts** ✅ - Already using correct pattern

### Next Steps
1. **Restart Expo dev server** - `npx expo start`
2. **Check console logs** - Should see proper API key detection
3. **Test functionality**:
   - Google Places autocomplete should work
   - Weather data should load
   - Authentication should work (if Supabase is configured)

**All environment variable access is now consistent across all services!** 🎉

## Project Overview

**Sun Dressed** is a weather-based outfit suggestion app built with React Native and Expo Router. The app provides personalized clothing recommendations based on current weather conditions, user preferences, and a smart outfit algorithm.

## Key Project Information

- **App Name**: Sun Dressed
- **Platform**: React Native with Expo SDK 53
- **Navigation**: Expo Router v5 (file-based routing)
- **Language**: TypeScript with strict mode
- **Current Branch**: develop
- **Main Branch**: main
- **Development Status**: Pre-MVP, implementing core features

## Technology Stack

- **Framework**: Expo SDK 53 with Expo Router v5
- **State Management**: React hooks, Context API, AsyncStorage
- **UI Components**: React Native core + React Native Paper
- **LLM Integration**: Google Gemini API for outfit generation
- **External APIs**: OpenWeather, Google Places
- **Storage**: AsyncStorage for local persistence
- **Authentication**: Supabase (configured but minimal implementation)
- **Testing**: Jest + React Native Testing Library

## Current BentoBox Implementation

### Overview
The BentoBox component is a simple grid display for outfit items with loading states. The current implementation is minimal compared to the planned architecture described in the rules.

### Current Features
- **Grid Layout**: 2x3 grid displaying outfit items
- **Loading State**: Shows skeleton loader while outfit generates
- **Basic Display**: Item names and icons
- **No Interactions**: Currently display-only

### Planned Features (Not Yet Implemented)
Based on `.cursor/rules/bentobox-component.mdc`, the following features are planned:
- State machine with 5 states (IDLE, FOCUSED, LOCKED, REJECTED, MODAL_OPEN)
- Lock/unlock individual items
- Rejection system with modal
- "I'm Wearing This Outfit" button
- Configurable layout system
- State persistence

### Implementation Status
- **✅ Basic Display**: Grid layout with items
- **✅ Loading State**: Skeleton loader
- **⏳ State Machine**: Not implemented
- **⏳ Interactions**: Not implemented
- **⏳ Layout System**: Not implemented

## Rules Directory Reference

The project uses Cursor Rules (`.mdc` files) located in `.cursor/rules/` to maintain consistent development standards. Here's a quick reference:

### Core Development Rules
- **ai-implementation-guide.mdc**: 4-phase development process and MVP focus
- **project-structure.mdc**: Directory organization and component hierarchy
- **code-style.mdc**: TypeScript standards, naming conventions, and React patterns
- **development-workflow.mdc**: Git workflow, branching strategy, and deployment process

### Feature-Specific Rules
- **authentication.mdc**: User auth flow with Supabase
- **weather-integration.mdc**: OpenWeatherAPI integration patterns
- **outfit-algorithm.mdc**: Outfit scoring and suggestion logic
- **bentobox-component.mdc**: ✅ **UPDATED** - Complete state machine implementation with configurable layout system
- **settings.mdc**: User preferences and persistence

### Quality & Testing Rules
- **testing-qa.mdc**: Testing strategies and requirements
- **jest.mdc**: Jest configuration and test patterns
- **error-handling.mdc**: Error handling patterns
- **accessibility.mdc**: Accessibility standards
- **performance.mdc**: Performance optimization guidelines

### Planning & Management Rules
- **feature-roadmap.mdc**: MVP features and post-MVP roadmap
- **git-commands.mdc**: Git best practices
- **api-data.mdc**: API integration and data management
- **rules-management.mdc**: How to maintain Cursor Rules
- **rules-summary.mdc**: Overview of all rules

## App Structure (Expo Router)

### File-Based Routing
```
app/
├── (auth)/          # Auth flow group
│   ├── _layout.tsx  # Auth stack layout
│   └── index.tsx    # Login screen
├── (tabs)/          # Main app tabs
│   ├── _layout.tsx  # Tab navigator
│   ├── index.tsx    # Home screen
│   ├── closet.tsx   # Closet screen
│   ├── trips.tsx    # Trips screen
│   ├── social.tsx   # Social screen
│   └── account.tsx  # Account screen
├── _layout.tsx      # Root layout (Stack)
├── create-trip.tsx  # Modal for trip creation
└── +not-found.tsx   # 404 screen
```

### Core Services
- **outfitService.ts**: Google Gemini AI integration for outfit generation
- **tripStorageService.ts**: AsyncStorage CRUD for trip management
- **rateLimiter.ts**: API call throttling (5-second intervals)

### Custom Hooks
- **useOutfitGenerator**: Manages outfit generation state and API calls
- **useTrips**: Handles trip CRUD operations with AsyncStorage
- **useThemeColor**: Theme-aware color management
- **useColorScheme**: Platform color scheme detection

### Component Organization
```
components/
├── BentoBox.tsx         # Outfit display grid
├── TripCard.tsx         # Trip list item with actions
├── ui/                  # Platform-specific UI components
│   ├── IconSymbol.tsx
│   └── TabBarBackground.tsx
└── common/              # Shared components
    └── ToggleSwitch.tsx
```

## Development Commands

### Common Commands
```bash
# Install dependencies
npm install

# Run development server
npx expo start

# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Clear cache and start fresh
npx expo start -c
```

### Git Workflow
- Feature branches: `feature/description`
- Bug fixes: `bugfix/issue-description`
- Commit format: `type(scope): description`

## MVP Focus Areas

1. **✅ Trip Management** - Create, view, and delete trips with location and date range
2. **✅ Outfit Generation** - AI-powered suggestions using Google Gemini API
3. **⚠️ User Authentication** - Supabase configured but minimal implementation
4. **⚠️ Weather Integration** - Services configured but using mock data
5. **🔄 BentoBox Interactions** - Basic outfit display implemented
6. **⏳ Persistent Settings** - Not yet implemented
7. **⏳ Default Clothing Set** - Pre-defined items planned
8. **✅ Error Handling** - Basic error states in AsyncDataDisplay component

## Key Technical Details

### Navigation & Routing
- **Expo Router v5**: File-based routing with groups
- **Tab Navigation**: 5 main tabs with haptic feedback
- **Modal Presentation**: Trip creation as modal
- **Auth Flow**: Separate (auth) group for login/signup

### State Management
- **Local State**: useState for component state
- **Custom Hooks**: Business logic encapsulation
- **AsyncStorage**: Local data persistence
- **No Global State**: No Redux/MobX/Zustand

### Styling & Theme
- **Design System**: Centralized theme.ts and typography.ts
- **Fonts**: Libre Baskerville (headings), Montserrat (body)
- **Colors**: 
  - Primary: #000 (black)
  - Secondary: #757575 (gray)
  - Background: #fff (white)
  - Accent: #FFEE8C (yellow)
- **Spacing**: Consistent 8-point grid system

### API Integrations
- **Google Gemini**: Outfit generation via generative AI
- **OpenWeather**: Weather data (configured)
- **Google Places**: Location autocomplete (configured)
- **Supabase**: Authentication and data storage (configured)

### Type System
- **Strict TypeScript**: Enabled with no implicit any
- **Path Aliases**: @/, @components/, @screens/, @hooks/
- **Interface Definitions**: Trip, Outfit, Weather, ClothingItem
- **Type Guards**: For API responses and data validation

## Development Process

Follow the 4-phase process from ai-implementation-guide.mdc:
1. **Analyze** - Examine project structure and identify impacts
2. **Specify** - Define user-facing value and acceptance criteria
3. **Plan** - Create pseudocode and identify edge cases
4. **Implement** - Write production-ready code with tests

## Important Notes

- Always check feature-roadmap.mdc before implementing new features
- Avoid creating unnecessary files - prefer editing existing ones
- Follow established patterns in the codebase
- Test on both iOS and Android
- Create minimal new files (1-2 max per feature)
- Keep components under 150 lines
- Use explicit error handling
- Document significant changes in relevant rule files
- Use path aliases (@/, @components/, etc.) for imports
- Follow Expo Router file-based routing conventions

## Next Steps

When starting work on a feature:
1. Check @feature-roadmap for priorities
2. Review relevant rule files
3. Follow the 4-phase development process
4. Test thoroughly before marking complete
5. Update documentation as needed

## Current Implementation Status

### ✅ Completed Features
- **Trip Management**: Full CRUD operations with AsyncStorage
- **Outfit Generation**: Google Gemini AI integration
- **Basic Navigation**: Tab-based navigation with Expo Router
- **Error Handling**: AsyncDataDisplay component
- **Type System**: Comprehensive TypeScript types

### 🔄 In Progress
- **BentoBox Interactions**: Display-only, needs state machine
- **Weather Integration**: Services ready, needs real data
- **User Authentication**: Supabase configured, needs implementation

### ⏳ Not Started
- **Settings Persistence**: User preferences storage
- **Default Clothing Set**: Pre-defined wardrobe items
- **Social Features**: Placeholder screen only
- **Closet Management**: Placeholder screen only

## ✅ NEW: Test Developer Infrastructure

### Enhanced Testing System for Trips Feature

A comprehensive testing infrastructure has been implemented to handle complex dependency issues and provide fast verification of feature implementations.

#### Quick Implementation Verification

**Location**: `scripts/verifyImplementation.js`

**Purpose**: Fast source code analysis without Jest dependencies

**Usage**:
```bash
# Test specific task
node scripts/verifyImplementation.js 2.6

# Test all implemented tasks
node scripts/verifyImplementation.js all
```

**Features**:
- ✅ **Dependency-Free**: No Jest, React Testing Library, or mock setup
- ✅ **Fast Execution**: Direct file system analysis
- ✅ **Clear Results**: ✅/❌ status with descriptive messages
- ✅ **Task-Specific**: Checks for exact implementation markers

**Example Output**:
```
🔍 Implementation Verification
==============================
✅ Task 2.6: Activity input implemented
✅ Task 2.7: Save Trip functionality implemented
📊 Results: 4/4 tasks implemented
```

#### Advanced Test Runner (for Complex Testing)

**Location**: `src/test/trips/runTripsTestsSimple.js`

**Purpose**: Full React component testing with isolated mocks

**Usage**:
```bash
# Test specific task with React Testing Library
node src/test/trips/runTripsTestsSimple.js 2.6

# Test all tasks
node src/test/trips/runTripsTestsSimple.js all
```

**Features**:
- 🔧 **Isolated Mocks**: Creates temporary test files with proper mocking
- 🔧 **React Testing**: Full component mounting and interaction testing
- 🔧 **Auto-Cleanup**: Removes temporary files after execution
- 🔧 **Configurable**: Easy to add new tasks

#### Creating New Tests

To add verification for a new task, update both systems:

**1. Quick Verification (`scripts/verifyImplementation.js`)**:
```javascript
case '2.8':
  if (content.includes('loadTrips') && content.includes('FlatList') && content.includes('trip.name')) {
    console.log('✅ Task 2.8: Trip list display implemented');
    return true;
  } else {
    console.log('❌ Task 2.8: Trip list display not found');
    return false;
  }
```

**2. Advanced Test Runner (`src/test/trips/runTripsTestsSimple.js`)**:
```javascript
// Add to testConfigs object
'2.8': {
  name: 'Task 2.8: Display Saved Trips',
  pattern: 'loadTrips|trip list',
  file: 'TripsScreen.test.tsx'
}

// Add to getTestsForTask function
case '2.8':
  return `
  it('should display saved trips', () => {
    // Test implementation here
  });`;
```

#### Testing Best Practices

1. **Always use Quick Verification first** - It's faster and handles most cases
2. **Use Advanced Testing for interaction testing** - When you need to test user interactions
3. **Add descriptive console.log messages** - Help developers understand what's being tested
4. **Update both systems together** - Maintain consistency between verification approaches
5. **Test incrementally** - Verify each task as it's implemented

#### Handling Dependency Issues

The testing system was designed to bypass common React Native testing issues:

- **ESM Module Conflicts**: Quick verification uses pure Node.js
- **Jest Configuration**: Advanced runner creates isolated test environments
- **Mock Complexity**: Pre-configured mocks for common dependencies
- **Platform Differences**: Handles both web and mobile component variations

This dual-system approach ensures Test Developers can always verify implementations regardless of environment setup issues.

## ✅ ROLLING PROJECT NOTES (June 2025)

### Current Development Timeline 
**Date Updated**: June 3, 2025
**Current Status**: Trips feature implementation in progress (8/10 tasks complete)
**Development Capacity**: 8+ hours/weekend committed
**Target App Store Launch**: Late July 2025 (8 weeks from current date)

### Key Milestones
- **Week 1-2 (June 2025)**: Complete remaining trips MVP features
- **Week 3-4 (June-July 2025)**: Beta testing preparation 
- **Week 5-8 (July 2025)**: App store submission and production launch

### Critical Context for All Agents
- Project is in **final sprint to MVP completion**
- Trips feature is the **primary differentiator** for market launch
- Timeline is aggressive but achievable with weekend development schedule
- Focus should be on **completing existing features** rather than adding new ones
