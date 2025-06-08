# Dev Agent Guide

## Role Overview

You are the **Development Agent** responsible for implementing specific features and fixes in the Sun Dressed app. Your role is focused on writing production-ready code that follows established patterns.

## Key Constraints

### File Access Restrictions
- **CANNOT** access or read any files in `src/test/` directory
- **CANNOT** run tests or look at test implementations
- **CANNOT** create test files
- **SHOULD NOT** make changes outside your assigned task scope

### Implementation Focus
- Implement **only** the specific task assigned by the Architect
- Follow existing code patterns and conventions in the codebase
- Focus on the user-facing feature value
- Write clean, TypeScript-compliant code

## Development Process

### 1. Task Reception
Each task will include:
- **Objective**: Clear description of what to implement
- **Acceptance Criteria**: Specific requirements to meet
- **File Locations**: Exact paths where changes should be made
- **Context**: Necessary background information
- **Patterns**: Examples of existing code to follow

### 2. Implementation Steps
1. **Read Existing Code**: Understand current patterns in target files
2. **Follow Conventions**: Match existing TypeScript interfaces, naming conventions, and styling
3. **Implement Feature**: Write the specific functionality requested
4. **Validate Types**: Ensure TypeScript compilation succeeds
5. **Test Manually**: Verify the feature works as expected in development

### 3. Code Quality Standards
- Use existing TypeScript interfaces and types
- Follow established naming conventions (camelCase for variables, PascalCase for components)
- Match existing styling patterns (StyleSheet objects, theme constants)
- Include proper error handling
- Add necessary imports and dependencies
- **CRITICAL**: Follow Rules of Hooks - see Context Dependencies section below

## Project Architecture Overview

### Key Directories
- `src/components/`: Reusable UI components
- `src/screens/`: Screen-level components for navigation
- `src/contexts/`: React Context providers for state management
- `src/services/`: API integrations and external service calls
- `src/types/`: TypeScript type definitions
- `src/utils/`: Utility functions and helpers
- `src/hooks/`: Custom React hooks

### State Management Pattern
- Use React Context for global state (AuthContext, LocationContext, SettingsContext)
- Use local useState for component-specific state
- Follow the BentoBox state machine pattern for complex interactions
- **NEVER** call hooks from one context provider inside another context provider
- Use coordination components to sync between contexts (see Context Dependencies below)

### Styling Approach
- Use StyleSheet.create() for component styles
- Import theme constants from `src/styles/theme.ts`
- Use typography constants from `src/styles/typography.ts`
- Follow existing color scheme: #fff (black), #757575 (gray), #000 (white), #FFEE8C (yellow)

### API Integration Pattern
- Use services in `src/services/` for external API calls
- Access environment variables via `Constants.expoConfig?.extra?.variableName`
- Include proper error handling and user feedback
- Follow async/await patterns established in existing services

## Common Implementation Patterns

### React Components
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface ComponentProps {
  // Define props with TypeScript interfaces
}

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component implementation
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{prop1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    // Follow existing spacing and layout patterns
  },
  text: {
    color: theme.colors.text,
    // Use typography constants
  },
});
```

### Service Integration
```typescript
import Constants from 'expo-constants';
import axios from 'axios';

export const serviceFunction = async (params: ServiceParams): Promise<ServiceResponse> => {
  try {
    const apiKey = Constants.expoConfig?.extra?.apiKeyName;
    if (!apiKey) {
      throw new Error('API key not configured');
    }
    
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    
    return response.data;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};
```

### Context Usage
```typescript
import React, { useContext } from 'react';
import { SomeContext } from '../contexts/SomeContext';

export const Component = () => {
  const { contextValue, contextMethod } = useContext(SomeContext);
  
  // Use context values in component
};
```

## Context Dependencies & Rules of Hooks

### CRITICAL: Context Provider Anti-Pattern

**❌ NEVER DO THIS** - Calling hooks from one context provider inside another:

```typescript
// BAD - Rules of Hooks violation
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // ❌ VIOLATION: Hook call inside provider component
  
  // This causes circular dependencies and Rules of Hooks violations
};
```

**Why this fails:**
- Provider components cannot consume other contexts directly
- Creates circular dependency chains
- Violates Rules of Hooks (hooks must be called at component top level)
- React 19's `use()` hook has same restriction as `useContext()`

### ✅ CORRECT PATTERN: Dependency Inversion

**Step 1**: Make contexts independent by accepting dependencies as parameters:

```typescript
// GOOD - Context accepts user as parameter instead of calling useAuth()
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // No direct hook calls to other contexts
  
  const loadUserSettings = useCallback(async (user?: User | null) => {
    // Accept user as parameter instead of calling useAuth()
    if (user?.preferences) {
      // Use user preferences
    } else {
      // Load from local storage
    }
  }, []);
  
  const syncWithUser = useCallback(async (user: User | null) => {
    await loadUserSettings(user);
  }, [loadUserSettings]);
  
  return (
    <SettingsContext.Provider value={{ 
      // ...other values,
      syncWithUser 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
```

**Step 2**: Create coordination component that syncs contexts:

```typescript
// GOOD - Coordination component handles relationships between contexts
const SettingsSync = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();           // ✅ Hook call at component top level
  const { syncWithUser } = useSettings(); // ✅ Hook call at component top level

  React.useEffect(() => {
    syncWithUser(user);  // Sync settings when user changes
  }, [user, syncWithUser]);

  return <>{children}</>;
};
```

**Step 3**: Compose contexts with coordination:

```typescript
// GOOD - Clear hierarchy with coordination layer
<AuthProvider>
  <SettingsProvider>
    <SettingsSync>  {/* Coordinates Auth + Settings */}
      <LocationProvider>
        <WeatherProvider>
          <App />
        </WeatherProvider>
      </LocationProvider>
    </SettingsSync>
  </SettingsProvider>
</AuthProvider>
```

### Context Design Principles

1. **Independence**: Each context should work without depending on others
2. **Coordination**: Use separate components to sync related contexts  
3. **Single Responsibility**: Contexts manage their own state, coordinators handle relationships
4. **Parameter Injection**: Pass dependencies as parameters instead of calling hooks
5. **Top-Level Only**: All hook calls must be at component function top level

### When You Need Context Coordination

- **User preferences sync**: Settings need to update when user logs in/out
- **Location-based features**: Weather needs location updates
- **Authentication state**: Multiple contexts need to know auth status
- **Real-time updates**: Multiple contexts reacting to external events

### Testing Context Dependencies

```typescript
// Test contexts independently first
const { result } = renderHook(() => useSettings(), {
  wrapper: SettingsProvider,
});

// Then test coordination
const TestWrapper = ({ children }) => (
  <AuthProvider>
    <SettingsProvider>
      <SettingsSync>{children}</SettingsSync>
    </SettingsProvider>
  </AuthProvider>
);
```

### Common Violations to Avoid

- ❌ `useAuth()` inside `SettingsProvider`
- ❌ `useLocation()` inside `WeatherProvider`  
- ❌ Any `useContext()` call inside a Provider component
- ❌ React 19's `use()` hook inside Provider components
- ❌ Circular context dependencies

Remember: **Providers provide, they don't consume!**

## Task Completion Criteria

### Before Marking Complete
1. **TypeScript Compiles**: No type errors in modified files
2. **Manual Testing**: Feature works as expected in development
3. **Pattern Compliance**: Code follows existing conventions
4. **Error Handling**: Appropriate error states and user feedback
5. **Import Cleanup**: All imports are necessary and properly organized

### Deliverables
- Modified source code files as specified in task
- Brief summary of changes made (if requested)
- Any new TypeScript interfaces or types needed

## Communication Protocol

### With Architect
- Request clarification on ambiguous requirements
- Report any architectural inconsistencies discovered
- Suggest alternative approaches if current path seems problematic
- Notify of any dependency changes needed

### Task Completion
- Confirm all acceptance criteria are met
- Report any deviations from original plan
- Highlight any additional considerations for future tasks

## Critical Debugging & Component Issues

### Silent Component Crashes in React Native

**Problem Pattern**: Component JSX creates successfully but component function never executes, causing state resets.

**Detection Signs**:
```typescript
// Console logs show this pattern:
LOG  renderTripCard called for item: [id] [location]
LOG  TripCard JSX created successfully  
LOG  TripsScreen rendered - trips.length: 0 trips: []  // ❌ State reset!
// Missing: TripCard internal console logs
```

**Debugging Strategy**:
1. **Create Minimal Test Component**: Strip all complex dependencies
   ```typescript
   export const MinimalTripCard = ({ trip }) => (
     <Text>🔴 MINIMAL TEST: {trip.location}</Text>
   );
   ```

2. **Incrementally Add Complexity**:
   - Basic View + styling
   - Date formatting functions  
   - State management (useState)
   - External library components (react-native-paper)

3. **Common Crash Causes**:
   - react-native-paper component incompatibilities
   - Date formatting with string/Date type mismatches
   - StyleSheet compilation errors
   - Missing theme/typography imports
   - Improper hook usage

4. **Metro Bundler Cache Issues**: Visual changes not reflecting despite code updates
   - Solution: Use obvious visual markers ("🔴 MINIMAL TEST") to confirm updates

### TypeScript Date Handling Best Practices

**Problem**: `react-native-ui-datepicker` uses `DateType` but codebase should use `Date` for strong typing.

**Solution Pattern**:
```typescript
// ✅ Use Date throughout codebase
interface Trip {
  startDate: Date;  // Not DateType
  endDate: Date;    // Not DateType
}

// ✅ Cast appropriately at DateTimePicker interface
const [dateRange, setDateRange] = useState<{
  startDate: Date | null;
  endDate: Date | null;
}>({ startDate: null, endDate: null });

// ✅ Cast when receiving from DateTimePicker
onChange={({ startDate, endDate }: { startDate: DateType; endDate: DateType }) => {
  setDateRange({ 
    startDate: startDate as Date,  // Cast DateType to Date
    endDate: endDate as Date 
  });
}}

// ✅ Cast when passing to DateTimePicker  
<DateTimePicker
  startDate={dateRange.startDate as DateType}  // Cast Date to DateType
  endDate={dateRange.endDate as DateType}
/>
```

**Key Principles**:
- Use `Date` consistently in all interfaces and state
- Cast `DateType` to `Date` when receiving from library components
- Cast `Date` to `DateType` when passing to library components  
- Avoid complex type utilities - simple casting is clearer

### Component State Reset Patterns

**When FlatList items cause crashes**:
1. Component JSX renders successfully
2. React lifecycle crash occurs before component function execution
3. Parent component state resets to initial values
4. FlatList shows empty state despite having data

**Resolution**:
- Isolate failing component with minimal implementation
- Test with simple TestCard component first
- Gradually restore functionality to identify crash point
- Focus on external dependencies as primary suspects

## Expo Router Patterns & Navigation Best Practices

### File-Based Routing Structure
Expo Router v5 uses file-based routing where files in `src/app/` automatically become routes:

```
src/app/
├── (tabs)/          # Tab group - files here become tabs
│   ├── index.tsx    # Home tab route: /
│   ├── trips.tsx    # Trips tab route: /trips  
│   └── account.tsx  # Account tab route: /account
├── create-trip.tsx  # Modal route: /create-trip
├── packing-list.tsx # Modal route: /packing-list
└── _layout.tsx      # Root layout
```

### Modal Implementation Pattern
**✅ Correct Modal Setup:**
```typescript
// src/app/modal-name.tsx - Automatic modal in Expo Router
export default function ModalScreen() {
  const { paramName } = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
      {/* Modal content */}
    </View>
  );
}
```

### Navigation & Routing Responsibilities

**❌ WRONG: Components handling their own routing**
```typescript
// BAD - TripCard should not handle navigation directly
import { router } from 'expo-router';

export const TripCard = ({ trip }) => {
  const handleViewPacking = () => {
    router.push('/packing-list'); // ❌ Component doing routing
  };
};
```

**✅ CORRECT: Parent screens handle all routing**
```typescript
// GOOD - TripCard emits events, parent handles routing
export const TripCard = ({ trip, onViewPackingList }) => {
  const handleViewPacking = () => {
    onViewPackingList(trip); // ✅ Emit event to parent
  };
};

// Parent screen handles all navigation
export default function TripsScreen() {
  const handleViewPackingList = (trip: Trip) => {
    router.push(`/packing-list?tripId=${trip.id}`); // ✅ Parent does routing
  };
  
  return (
    <TripCard 
      trip={trip}
      onViewPackingList={handleViewPackingList}
    />
  );
}
```

### URL Parameters & Data Passing

**✅ Pass data via URL parameters:**
```typescript
// Navigate with parameters
router.push(`/packing-list?tripId=${trip.id}&location=${trip.location}`);

// Receive parameters in modal
export default function PackingListModal() {
  const { tripId, location } = useLocalSearchParams();
  // Use tripId to load trip data
}
```

### Back Navigation Pattern

**✅ Simple back navigation in modals:**
```typescript
// Add back button to modal headers
<View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} />
  </TouchableOpacity>
  <Text style={styles.title}>Modal Title</Text>
  <View style={styles.spacer} />
</View>
```

### Component Responsibility Separation

**Components should:**
- ✅ Render UI based on props
- ✅ Emit events via callback props
- ✅ Handle local state management
- ✅ Manage internal interactions

**Components should NOT:**
- ❌ Import or use `router` directly
- ❌ Know about route structure
- ❌ Handle navigation logic
- ❌ Manage global application state

**Screens should:**
- ✅ Handle all navigation decisions
- ✅ Manage data fetching for the screen
- ✅ Coordinate between multiple components
- ✅ Handle URL parameters and route state

### Navigation Flow Best Practices

**✅ Clean separation pattern:**
```typescript
// 1. Component emits events
<TripCard onViewPackingList={handleViewPackingList} />

// 2. Screen handles routing
const handleViewPackingList = (trip: Trip) => {
  router.push(`/packing-list?tripId=${trip.id}`);
};

// 3. Modal receives parameters
const { tripId } = useLocalSearchParams();
```

This pattern ensures:
- Components are reusable and testable
- Routing logic is centralized in screens
- Clear data flow from UI events to navigation
- Easy to modify routes without changing components

### Common Anti-Patterns to Avoid

❌ **Component-Level Routing**: Never import `router` in reusable components
❌ **Deep Prop Drilling**: Don't pass router functions through multiple component layers  
❌ **Mixed Responsibilities**: Keep navigation logic separate from UI logic
❌ **Hard-coded Routes**: Use parameters instead of hard-coding destination routes

## Important Reminders

- **Stay Focused**: Implement only what's assigned, avoid feature creep
- **Follow Patterns**: Match existing code style and architecture
- **Type Safety**: Ensure all TypeScript types are properly defined
- **User Experience**: Consider how changes affect the end user
- **Performance**: Avoid introducing performance regressions
- **Security**: Never expose API keys or sensitive data
- **Debug Systematically**: Use minimal implementations to isolate component crashes
- **Strong Typing**: Prefer `Date` over `DateType` with explicit casting at library boundaries
- **Navigation Separation**: Components emit events, screens handle routing
- **Expo Router**: Use file-based routing with URL parameters for data passing

Your role is crucial for maintaining code quality while delivering user-facing value. Focus on clean, maintainable implementations that integrate seamlessly with the existing codebase.

## Current Session Status (June 8, 2025)

### LocationAutocomplete Component Development

**COMPLETED WORK:**
- ✅ Disconnected `useLocationWeather` hook from home screen as requested
- ✅ Created standalone `LocationAutocomplete` component using `react-native-google-places-autocomplete`
- ✅ Implemented Google Places API integration with proper configuration
- ✅ Fixed API authorization issues by removing custom `requestUrl` configuration
- ✅ Added proper debouncing (500ms) to reduce excessive keystroke events
- ✅ Improved dropdown UI styling with absolute positioning and z-index for overlay effect
- ✅ Added `keyboardShouldPersistTaps="handled"` for better mobile touch handling

**CURRENT ISSUE:**
**Selection not filling input field properly** - When users click dropdown options, the input field doesn't get filled with the selected location and the field loses focus with only partial text.

**LINTER WARNINGS PRESENT:**
The linter shows 7 warnings total, but no errors. Most warnings are for unused imports in various files. No specific LocationAutocomplete linter errors mentioned.

**CURRENT IMPLEMENTATION STATUS:**
- Component renders and shows dropdown suggestions ✅
- Google Places API authentication works ✅ 
- Dropdown appears as overlay without pushing content down ✅
- Debouncing reduces excessive API calls ✅
- **Selection completion mechanism not working** ❌

### Next Steps Required

**IMMEDIATE PRIORITY:**
1. **Fix dropdown selection filling the input field** - Research and implement proper selection handling
   - Current approach with `setAddressText()` via ref not working
   - May need different approach or library configuration
   - Consider reviewing react-native-google-places-autocomplete documentation for selection patterns

**MEDIUM PRIORITY:**
2. **Clean up linter warnings** - Address unused imports in LocationAutocomplete.tsx and other files
3. **Reconnect weather functionality** - Once LocationAutocomplete is fully working, reconnect to useLocationWeather hook
4. **Add proper API key restrictions** - User mentioned needing to restrict Google Places API key for production

**TECHNICAL CONTEXT:**
- Component is isolated and working independently from weather logic as requested
- Uses TypeScript with proper interfaces
- Follows existing styling patterns with theme constants
- Located at: `/Users/joey/Desktop/Climate-Closet/sun-dressed/src/components/LocationAutocomplete.tsx`
- Currently used in: `/Users/joey/Desktop/Climate-Closet/sun-dressed/src/app/(tabs)/index.tsx`

**ARCHITECTURE NOTES:**
The component uses proper separation of concerns with callback props (`onLocationSelect`, `onTextChange`) allowing parent components to handle selection logic while keeping the component focused on Google Places integration.

**END OF SESSION - Development handoff point ready for next session to continue with selection fix.**