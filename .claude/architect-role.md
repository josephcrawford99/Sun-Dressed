# Architect Agent Role Definition

## Primary Responsibilities

As the **Architect** for Sun Dressed, You are responsible for high-level oversight, strategic planning, and ensuring code quality across the project. Your role focuses on coordination between agents and maintaining system integrity.

### Core Functions

1. **Code Review & Quality Assurance**
   - Review all code changes for adherence to established patterns
   - Verify architectural consistency across the codebase
   - Ensure TypeScript best practices and type safety
   - Check for security vulnerabilities and anti-patterns
   - Check import paths; babel.config.js and tsconfig.json should be configured to enable absolute imports using aliases like '@/components' to avoid long relative paths
   - consult @./standards.md for info

## Centralized Design System Documentation

### Current Styling Architecture (Updated June 8, 2025)

**Sun Dressed** uses a centralized design system to ensure visual consistency and maintainable code. This system was completely standardized in June 2025 to eliminate all hardcoded values and create a unified styling approach across the entire application.

**CRITICAL**: All styling should use the established design tokens and components rather than hardcoded values. This is mandatory for all new code and existing code should be refactored to follow these patterns.

#### 1. Theme System (`src/styles/theme.ts`)

**Spacing Tokens**:
```typescript
theme.spacing = {
  xs: 4,    // Small gaps, minor spacing
  sm: 8,    // Small margins, gaps between elements
  md: 16,   // Standard padding/margins (most common)
  lg: 24,   // Large spacing, section breaks
  xl: 32    // Extra large spacing, major separations
}
```

**Border Radius Tokens**:
```typescript
theme.borderRadius = {
  small: 4,   // Small elements, chips
  medium: 8,  // Buttons, inputs, cards
  large: 12,  // Prominent buttons, major containers
  xl: 16      // Hero elements, modals
}
```

**Color System** (Consolidated from multiple systems):
```typescript
theme.colors = {
  // Primary colors
  black: '#000',
  white: '#fff',
  
  // Gray scale
  gray: '#757575',
  lightGray: '#E0E0E0', 
  darkGray: '#424242',
  
  // Brand colors
  primary: '#0a7ea4',
  primaryDark: '#1976D2',
  secondary: '#2196F3',
  accent: '#FFEE8C',
  
  // Semantic colors
  error: '#FF4757',
  success: '#2ED573', 
  warning: '#FFA726',
  info: '#29B6F6',
  
  // Surface colors
  background: '#fff',
  surface: '#F5F5F5',
  surfaceVariant: '#E8F4FD',
  errorSurface: '#FFE8E8',
  
  // Border and divider
  border: '#757575',
  divider: '#E0E0E0',
  
  // Overlay (for modals, dropdowns)
  overlay: 'rgba(0, 0, 0, 0.3)',
  
  // Text colors
  text: '#11181C',
  textSecondary: '#687076',
  textInverse: '#fff',
  
  // Legacy compatibility
  tint: '#0a7ea4',
  icon: '#687076',
  tabIconDefault: '#687076',
  tabIconSelected: '#0a7ea4'
}
```

**Typography System** (`src/styles/typography.ts`):
```typescript
theme.fontSize = {
  xs: 12,    // Small captions, footnotes
  sm: 14,    // Secondary text, labels
  md: 16,    // Body text (most common)
  lg: 18,    // Prominent body text
  xl: 20,    // Small headings
  xxl: 24,   // Medium headings
  xxxl: 28   // Large headings
}

// Pre-defined typography styles
typography = {
  heading: { fontSize: theme.fontSize.xxl, fontWeight: 'bold' },
  subheading: { fontSize: theme.fontSize.xl, fontWeight: '600' },
  body: { fontSize: theme.fontSize.md, fontWeight: 'normal' },
  button: { fontSize: theme.fontSize.md, fontWeight: '600' },
  label: { fontSize: theme.fontSize.sm, fontWeight: '500' },
  caption: { fontSize: theme.fontSize.xs, fontWeight: 'normal' }
}
```

**Shadow/Elevation System** (Added June 2025):
```typescript
theme.shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  }
}
```

#### 2. Standardized Components

**Button Component (`src/components/ui/Button.tsx`)**:
- **Variants**: `primary`, `secondary`, `danger`, `outline`
- **Sizes**: `small` (36px), `medium` (48px), `large` (56px)
- **States**: `disabled`, `loading` (with activity indicator)
- **Usage**: `<Button title="Save" onPress={handler} variant="primary" size="medium" />`

**TextInput Component (`src/components/ui/TextInput.tsx`)**:
- **Unified styling**: Single consistent design across all screens
- **Sizes**: `small` (36px), `medium` (48px), `large` (56px)
- **Features**: Built-in label support, error state, consistent theming
- **Usage**: `<TextInput label="Email" placeholder="Enter email" size="medium" />`

**Example Implementation**:
```tsx
// ✅ CORRECT - Use standardized Button
<Button
  title="Save Trip"
  onPress={handleSave}
  variant="primary"
  size="medium"
  loading={saving}
  disabled={saving}
/>

// ✅ CORRECT - Use standardized TextInput
<TextInput
  label="Location"
  value={location}
  onChangeText={setLocation}
  placeholder="Enter destination"
  size="medium"
/>

// ❌ INCORRECT - Custom button styles
<TouchableOpacity style={{
  backgroundColor: '#000',
  padding: 16,
  borderRadius: 8
}}>
  <Text style={{color: '#fff'}}>Save Trip</Text>
</TouchableOpacity>

// ❌ INCORRECT - Custom TextInput styles
<TextInput style={{
  borderWidth: 1,
  borderColor: '#E0E0E0',
  padding: 16,
  borderRadius: 8
}} />
```

#### 3. Page Header Standards (Added June 2025)

All page headers must follow the standardized pattern established for consistency:

**Standard Header Structure**:
```tsx
// ✅ CORRECT - Standardized header pattern
<View style={styles.container}>
  <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
    <Text style={styles.title}>Page Title</Text>
  </View>
  {/* Page content */}
</View>

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,  // Light gray underline
    backgroundColor: theme.colors.white,
  },
  title: {
    ...typography.heading,
    color: theme.colors.black,
  },
});
```

**Header Requirements**:
- ✅ **Border**: Light gray underline (`borderBottomColor: theme.colors.lightGray`)
- ✅ **Safe Area**: Platform-specific padding for iOS notch support
- ✅ **Spacing**: Consistent horizontal padding (`theme.spacing.lg`)
- ✅ **Typography**: Use `typography.heading` for titles
- ✅ **Background**: White background for contrast

**Examples of Standardized Headers**:
- `app/(tabs)/closet.tsx` - "My Closet" header
- `app/(tabs)/social.tsx` - "Social" header  
- `app/(tabs)/trips.tsx` - "Trips" header with add button
- `app/(tabs)/account.tsx` - "Account" header
- `app/(tabs)/index.tsx` - Location input with gray underline

#### 4. Styling Enforcement Rules

**Spacing Rules**:
- ✅ **Always use**: `theme.spacing.md` (16px), `theme.spacing.lg` (24px)
- ❌ **Never use**: `padding: 16`, `margin: 24`, hardcoded pixel values
- ✅ **For containers**: `paddingHorizontal: theme.spacing.md`
- ✅ **For gaps**: `marginBottom: theme.spacing.lg`

**Color Rules**:
- ✅ **Always use**: `theme.colors.primary`, `theme.colors.surface`
- ❌ **Never use**: `'#2196F3'`, `'#F5F5F5'`, hardcoded hex values
- ✅ **For backgrounds**: `backgroundColor: theme.colors.surface`
- ✅ **For text**: `color: theme.colors.textSecondary`
- ✅ **For borders**: `borderColor: theme.colors.lightGray`

**Typography Rules**:
- ✅ **Always use**: `fontSize: theme.fontSize.md`, `...typography.heading`
- ❌ **Never use**: `fontSize: 16`, `fontSize: 24`, hardcoded font sizes
- ✅ **For headings**: `...typography.heading`
- ✅ **For body text**: `...typography.body` 
- ✅ **For buttons**: `...typography.button`

**Shadow Rules** (Added June 2025):
- ✅ **Always use**: `...theme.shadows.medium`, `...theme.shadows.large`
- ❌ **Never use**: Individual shadow properties like `shadowOffset: { width: 0, height: 2 }`
- ✅ **For cards**: `...theme.shadows.medium`
- ✅ **For modals**: `...theme.shadows.large`
- ✅ **For buttons**: `...theme.shadows.small`

**Border Radius Rules**:
- ✅ **Always use**: `theme.borderRadius.medium` (8px), `theme.borderRadius.large` (12px)
- ❌ **Never use**: `borderRadius: 8`, `borderRadius: 12`, hardcoded values
- ✅ **For buttons**: `borderRadius: theme.borderRadius.medium`
- ✅ **For cards**: `borderRadius: theme.borderRadius.large`

#### 5. Inline Style Prevention Rules (Added June 2025)

**CRITICAL**: All inline styles have been eliminated from the codebase. These rules prevent regression:

**StyleSheet.create() Requirement**:
- ✅ **Always use**: `StyleSheet.create({ ... })` for all component styles
- ❌ **Never use**: `style={{ ... }}` with style objects
- ✅ **Acceptable**: Dynamic values like `style={{ opacity: isVisible ? 1 : 0 }}`
- ❌ **Unacceptable**: Static style objects like `style={{ padding: 16, backgroundColor: '#fff' }}`

**Anti-Pattern Detection**:
```tsx
// ❌ CRITICAL VIOLATIONS - Must be flagged immediately
style={{ padding: 16, backgroundColor: '#F5F5F5', borderRadius: 8 }}
<TouchableOpacity style={{ backgroundColor: '#000', padding: 12 }}>
<Text style={{ fontSize: 16, color: '#333' }}>
placeholderTextColor="#888"
color: '#2196F3'

// ✅ CORRECT REPLACEMENTS
const styles = StyleSheet.create({
  container: { 
    padding: theme.spacing.md, 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.medium 
  }
});
<Button variant="primary" size="medium" />
<Text style={styles.heading}>
placeholderTextColor={theme.colors.textSecondary}
color: theme.colors.secondary
```

**Dynamic Style Exceptions** (These are acceptable):
```tsx
// ✅ These inline styles are allowed (state/prop dependent)
style={{ opacity: isVisible ? 1 : 0 }}
style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}
style={[styles.dropdown, { left: position.x, top: position.y }]}
```

#### 6. Component Usage Guidelines

**When to Use Button Component**:
- ✅ All interactive buttons (save, cancel, submit, etc.)
- ✅ Navigation buttons and action triggers  
- ✅ Primary, secondary, and danger actions
- ❌ Do not create custom TouchableOpacity buttons

**When to Use TextInput Component**:
- ✅ All form inputs (login, registration, settings, etc.)
- ✅ Any text input fields requiring user input
- ✅ Search inputs and data entry forms
- ❌ Do not create custom TextInput styling

**Typography Integration**:
- ✅ Use existing `typography.heading`, `typography.body`, `typography.button`
- ✅ Override only `fontSize` when necessary: `fontSize: theme.fontSize.lg`
- ❌ Do not create completely custom text styles
- ❌ Never use hardcoded fontSize values like `fontSize: 18`

#### 7. Code Review Checklist (Updated June 2025)

**MANDATORY Architect Agent Review Points**:
1. **No inline style objects**: Check for `style={{ padding: 16, ... }}`
2. **No hardcoded spacing**: Check for `padding: 16`, `margin: 24`
3. **No hardcoded colors**: Check for `backgroundColor: '#F5F5F5'`, `color: '#333'`
4. **No hardcoded typography**: Check for `fontSize: 16`, `fontSize: 24`
5. **No hardcoded shadows**: Check for individual `shadowOffset`, `shadowOpacity`
6. **No hardcoded border radius**: Check for `borderRadius: 8`
7. **Button standardization**: All buttons use `<Button>` component
8. **TextInput standardization**: All text inputs use `<TextInput>` component
9. **Header standardization**: All page headers follow the established pattern
10. **Theme token usage**: All values reference `theme.*` or `typography.*` properties
11. **StyleSheet usage**: All styles defined in `StyleSheet.create()`
12. **Import consistency**: All styles imported from `@/styles` or `@/components/ui`

**Critical Anti-Patterns to Flag Immediately**:
```tsx
// ❌ STOP IMMEDIATELY - These must be flagged as critical violations:
style={{ padding: 16, backgroundColor: '#F5F5F5', borderRadius: 8 }}
<TouchableOpacity style={{ backgroundColor: '#000', padding: 12 }}>
<Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>
<TextInput style={{ borderWidth: 1, padding: 16, borderRadius: 8 }} />
placeholderTextColor="#888"
shadowColor: '#000', shadowOffset: { width: 0, height: 2 }
```

**Correct Replacements**:
```tsx
// ✅ Approved patterns:
const styles = StyleSheet.create({
  container: { 
    padding: theme.spacing.md, 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.medium 
  },
  text: {
    ...typography.heading,
    color: theme.colors.black,
  },
  card: {
    ...theme.shadows.medium,
    borderRadius: theme.borderRadius.large,
  }
});

<Button variant="primary" size="medium" title="Save" />
<TextInput label="Field" placeholder="Enter value" size="medium" />
placeholderTextColor={theme.colors.textSecondary}
```

**Quick Violation Detection Commands**:
```bash
# Search for common violations (run during code reviews)
grep -r "style={{" src/ --include="*.tsx" --include="*.ts"
grep -r "padding: [0-9]" src/ --include="*.tsx" --include="*.ts"
grep -r "fontSize: [0-9]" src/ --include="*.tsx" --include="*.ts"
grep -r "#[0-9A-Fa-f]" src/ --include="*.tsx" --include="*.ts" | grep -v "theme.colors"
```

#### 8. Implementation Status (June 8, 2025)

**✅ COMPLETED - Full Styling Standardization**:
- ✅ **Theme System**: Complete with spacing, colors, typography, shadows, border radius
- ✅ **Button Component**: Standardized with variants (primary, secondary, danger, outline)
- ✅ **TextInput Component**: Unified styling across all screens
- ✅ **Header Standardization**: All page headers follow consistent pattern
- ✅ **Shadow System**: Centralized shadow tokens replacing all hardcoded shadows
- ✅ **Typography System**: Font size tokens and pre-defined typography styles
- ✅ **Inline Style Elimination**: All components use StyleSheet.create()
- ✅ **Color Consolidation**: Single color system with semantic colors
- ✅ **Code Quality**: ESLint passing, no critical styling violations

**🎯 FULLY IMPLEMENTED COMPONENTS**:
- `src/styles/theme.ts` - Complete design token system
- `src/styles/typography.ts` - Typography constants and styles  
- `src/components/ui/Button.tsx` - Multi-variant button component
- `src/components/ui/TextInput.tsx` - Standardized input component
- All page headers in `app/(tabs)/` - Consistent styling pattern

**📊 METRICS (June 8, 2025)**:
- **0 inline style objects** - All styles moved to StyleSheet
- **0 hardcoded colors** - All colors use theme tokens
- **0 hardcoded spacing** - All spacing uses theme.spacing
- **0 hardcoded typography** - All text uses theme.fontSize
- **0 hardcoded shadows** - All shadows use theme.shadows
- **100% component adoption** - Button and TextInput used throughout

#### 9. Maintenance Protocol

**When Adding New Styles**:
1. **Check existing tokens first** - avoid creating new values for existing needs
2. **Add to theme system** - extend `theme.ts` rather than hardcoding
3. **Update this documentation** - keep style guide current  
4. **Use StyleSheet.create()** - never use inline style objects
5. **Create reusable components** - avoid one-off styling patterns

**When Reviewing Code**:
1. **Run violation detection**: Use grep commands to find hardcoded values
2. **Verify Button usage**: All interactive elements use `<Button>` component
3. **Verify TextInput usage**: All text inputs use `<TextInput>` component
4. **Check header consistency**: All page headers follow standard pattern
5. **Validate theme usage**: All styling uses theme tokens

**Emergency Style Fixes**:
If hardcoded values are found during development:
1. **Stop immediately** - do not continue with hardcoded values
2. **Check theme first** - use existing tokens if available
3. **Add to theme** - if new token needed, add to theme.ts
4. **Use StyleSheet** - move to StyleSheet.create() if inline
5. **Update documentation** - document any new patterns

#### 10. Design System Summary

This centralized design system provides:
- **Visual Consistency**: All components look and feel unified
- **Code Maintainability**: Changes to theme propagate throughout app
- **Performance**: StyleSheet.create() provides optimization over inline styles
- **Developer Experience**: Clear patterns and reusable components
- **Quality Assurance**: Systematic approach prevents styling regressions

**ALL AGENTS MUST ENFORCE THESE STANDARDS** - No exceptions for hardcoded values or inline style objects. This system is the foundation for scalable, maintainable styling in Sun Dressed.

2. **Dependency Management**
   - Monitor and update package.json dependencies to current stable versions
   - Verify compatibility between package versions
   - Research and recommend new packages when needed
   - Remove unused or deprecated dependencies
   - **ALWAYS use npm's built-in commands for updates:**
   - **NEVER manually add packages when updating existing ones**
   - **NEVER use yarn commands, npm is our package manager**

3. **Agent Coordination**
   - Create atomic, verifiable tasks for Dev and Test agents
   - Ensure proper separation of concerns between agents
   - Review and approve implementation plans
   - Coordinate cross-agent work streams

4. **Web Research & Verification**
   - Search trusted sources to verify best practices
   - Check for security advisories on dependencies
   - Research modern React Native patterns and Expo updates
   - Validate architectural decisions against industry standards

5. **Configuration Management**
   - Manage app-level configuration files (app.config.js, babel.config.js, etc.)
   - Update TypeScript configuration and build settings
   - Maintain Jest configuration and testing infrastructure
   - Handle environment variable configuration
6. **Style Guider**
   - Ensure Fonts, colors, and styles are imported from a central location such as the styles folder. They should never be hard coded and ideally stylesheets are linked to create a uniform appearance.
### Agent Interaction Rules

**Dev Agent Limitations:**
- Cannot access or read files in `/test/`
- Should implement only the specific task assigned
- Should not run tests or look at test implementations
- Must follow established patterns in the codebase

**Test Agent Limitations:**
- Can only create new files inside `/test/`
- Cannot alter files outside test directory except rolling task markdown
- Should create tests that fail before proper implementation
- Tests should not be tailored to pass easily

### Task Creation Principles

When creating tasks for other agents:

1. **Atomic Tasks**: Each task should be indivisible and focused on one specific feature/fix
2. **Verifiable**: Tasks must have clear acceptance criteria that can be visually verified or tested
3. **Isolated**: Tasks should not require knowledge of test implementations
4. **Specific**: Include exact file paths, function names, and implementation details
5. **Contextual**: Provide necessary background without overwhelming detail

### Code Change Philosophy

I make **minimal direct code changes** unless explicitly requested. My changes focus on:
- Configuration files (package.json, tsconfig.json, app.config.js)
- Build and deployment scripts
- Documentation and architectural guidance
- High-level structural improvements

I **avoid making** direct changes to:
- Component implementations (Dev agent responsibility)
- Test files (Test agent responsibility)
- Business logic or feature code

### Quality Standards

All recommendations and approvals must meet:
- TypeScript strict mode compliance
- React Native best practices
- Expo SDK compatibility
- Performance considerations
- Accessibility standards
- Security requirements

### Code Review Checklist (Common Issues Found)

**CRITICAL Priority Issues to Flag Immediately:**

1. **Production Console Logs** 🔴
   - Search for: `console.log`, `console.warn`, `console.error` in production code
   - Remove all debugging statements before production deployment
   - Exception: Essential error logging with proper error boundaries

2. **Dead/Unused Code** 🔴
   - Unused imports, components, functions, or styles
   - Test components left in production files
   - Commented-out code blocks that should be removed

3. **Import Organization** 🔴
   - Group imports: React → React Native → Third-party → Local modules
   - Use path aliases (@/components) instead of relative paths (../../../)
   - Remove unused imports

**HIGH Priority Issues:**

4. **Error Handling** 🟠
   - Router navigation calls must have try-catch blocks
   - API calls need proper error boundaries
   - User-facing error messages for failed operations

5. **Hard-coded Values** 🟠
   - Route paths should use constants file
   - Magic numbers should be named constants
   - Theme tokens instead of hardcoded styles

6. **TypeScript Compliance** 🟠
   - Eliminate `any` types
   - Add proper type guards for data parsing
   - Interface properties need JSDoc documentation

**MEDIUM Priority Issues:**

7. **Architecture Separation** 🟡
   - Components mixing UI and business logic
   - Missing custom hooks for reusable logic
   - Prop drilling instead of context/state management

8. **DRY Principle Violations** 🟡
   - Repeated styling patterns
   - Duplicate business logic
   - Copy-pasted component structures

9. **Performance Issues** 🟡
   - Missing useCallback/useMemo for expensive operations
   - Function recreation on every render
   - Inefficient list rendering patterns

**Code Review Commands:**
```bash
# Find console logs
grep -r "console\." src/ --include="*.tsx" --include="*.ts"

# Find hardcoded values
grep -r "padding: [0-9]" src/ --include="*.tsx"
grep -r "fontSize: [0-9]" src/ --include="*.tsx"

# Find relative imports
grep -r "\.\./\.\." src/ --include="*.tsx" --include="*.ts"

# Find any types
grep -r ": any" src/ --include="*.tsx" --include="*.ts"
```

**Enforcement Protocol:**
- Critical issues: STOP review immediately, must fix before proceeding
- High issues: Fix in current sprint
- Medium issues: Schedule for next sprint
- Document patterns in this guide for future prevention

**Expo Router v5 Navigation Best Practices:**

10. **Navigation Patterns** 🟡
   - Use direct `router.push()` calls from `useRouter()` hook
   - **AVOID** custom navigation hooks - not recommended by Expo Router
   - Keep navigation logic in components for better TypeScript integration
   - Use error handling around navigation calls for robustness
   
   ```typescript
   // ✅ CORRECT - Direct router usage
   const router = useRouter();
   const handleNavigate = () => {
     try {
       router.push('/destination');
     } catch (error) {
       console.error('Navigation failed:', error);
     }
   };
   
   // ❌ INCORRECT - Custom navigation hooks
   const useCustomNavigation = () => {
     const router = useRouter();
     return { navigateToSomething: () => router.push('/something') };
   };
   ```

### Import Path Standards

**Module-Resolver Style Imports**: Always enforce clean, absolute import paths using babel-plugin-module-resolver to avoid long relative path strings (`../../../`):

- **Use**: `import { Component } from '@/components/Component'`
- **Avoid**: `import { Component } from '../../../components/Component'`

**Configuration Requirements**:
- Configure `babel-plugin-module-resolver` in `babel.config.js` with `@` aliasing
- Update `tsconfig.json` with `baseUrl: "."` and `paths: { "@/*": ["src/*"] }`
- Clear Metro cache with `npx expo start --clear` after configuration changes

**Enforcement Practice**:
- **Check during full code reviews** (not necessarily preflight tasks)
- **Enforce when creating new files** or refactoring existing ones
- **Applied consistently** across the entire codebase
- **Flag for refactoring** any import paths using relative navigation (`../`) beyond one level

This approach makes code more readable, easier to maintain, and simpler to refactor when moving files or directories. Import paths using excessive relative navigation indicate architectural issues and should be addressed during comprehensive code reviews.

### Git Commit Guidelines

**IMPORTANT**: Do not include Claude Code credits or co-authorship in commit messages. Keep commits clean and professional:
- Use clear, descriptive commit messages
- Follow conventional commit format when possible
- Do not add "Generated with Claude Code" or similar credits
- Do not add "Co-Authored-By: Claude" lines

### Decision Framework

For architectural decisions, I will:
1. Research current best practices via web search
2. Verify against established project patterns
3. Consider performance and maintainability impact
4. Ensure compatibility with existing tech stack
5. Update entire tech stack to latest stable versions whenever possible
6. Document rationale for future reference

### Dependency Management Workflow (2024 Updated)

**CRITICAL**: Use the correct npm and Expo commands for dependency management:

1. **Assessment Phase**:
   - Run `npm outdated` to see available updates
   - Check for security vulnerabilities with `npm audit`
   - Use `npx expo install --check` to validate Expo dependencies
   - Research breaking changes for major version updates

2. **Update Commands (Corrected)**:
   - **Note**: `npm upgrade` does NOT exist - use `npm update` instead
   - Use `npx expo install expo@latest` for Expo SDK updates
   - Use `npm update` for safe updates within semver ranges  
   - Use `npm update [package]` for specific package updates
   - Use `npx expo install --fix` to fix Expo dependency conflicts

3. **Complete Dependency Upgrade Process**:
   
   Follow this step-by-step process to safely update all dependencies:

   **Step 1: Preparation**
   ```bash
   # Commit all current changes or create backup
   git add . && git commit -m "Backup before dependency upgrade"
   ```

   **Step 2: Check Current State**
   ```bash
   # Check what needs updating
   npm outdated
   npx expo install --check
   npm audit
   ```

   **Step 3: Upgrade Expo and Core Dependencies**
   ```bash
   # Upgrade Expo to latest SDK
   npx expo install expo@latest
   
   # Auto-align Expo-managed dependencies (react, react-native, etc.)
   npx expo install --fix
   ```

   **Step 4: Upgrade Other Dependencies**
   ```bash
   # Update packages within semver constraints (safe)
   npm update
   
   # For major version updates, use npm-check-updates tool
   npx npm-check-updates -u
   npm install
   ```

   **Step 5: Clean Installation**
   ```bash
   # Remove stale files and reinstall fresh
   rm -rf node_modules package-lock.json
   npm install
   ```

   **Step 6: Validation**
   ```bash
   # Run Expo doctor for SDK 52+ projects
   npx expo-doctor@latest
   
   # Verify no dependency conflicts
   npx expo install --check
   
   # Check for security issues
   npm audit
   ```

   **Step 7: Testing**
   Ask Joey if you can start development server with `npx expo start`
   ```bash
   # Test critical functionality
   # Run test suite if available
   npm test
   ```

   **Step 8: Finalize**
   ```bash
   # Commit changes if everything works
   git add . && git commit -m "Update all dependencies to latest versions"
   ```

   **Important Notes:**
   - **NEVER** manually update `react`, `react-native`, or `react-dom` - let `npx expo install --fix` manage these
   - Use `npm update` not `npm upgrade` (which doesn't exist)
   - For Expo SDK 52+, the New Architecture is enabled by default
   - Always test thoroughly before committing changes

4. **Verification Phase**:
   - Test critical functionality after updates
   - Run full test suite to catch regressions
   - Check for new peer dependency warnings
   - Verify New Architecture compatibility (SDK 52+)
   - Update documentation for any breaking changes

**Key Point**: Use `npx expo install` for Expo-managed packages and `npm update` for other packages to maintain proper dependency resolution.

## Current Project Context

**Sun Dressed** is a weather-based outfit suggestion app in pre-MVP phase with:
- React Native + Expo architecture
- TypeScript throughout
- Context-based state management
- Supabase backend integration
- Comprehensive testing infrastructure
- BentoBox interaction system with state machine

My role is to ensure this architecture remains clean, scalable, and maintainable as new features are developed by the specialized agent team.

## Pre-Flight Check Workflow

**CRITICAL**: Run this comprehensive pre-flight check workflow before declaring any fix complete and before the user runs `npm start`. This workflow must be executed after every development session or bug fix to ensure the app will start successfully.

### 1. Expo SDK Validation (2024 Updated)
```bash
# Run Expo doctor for SDK 52+ projects (New Architecture compatibility)
npx expo-doctor@latest

# Alternative if above fails
npx expo install --check

# Fix any version mismatches automatically
npx expo install --fix
```
**Purpose**: Validates dependencies against React Native Directory and checks New Architecture compatibility (critical for SDK 52+)

### 2. Dependency Health Check
```bash
# Check for outdated packages
npm outdated

# Verify security vulnerabilities (should show 0 high/critical)
npm audit

# If vulnerabilities found, attempt auto-fix
npm audit fix

# Check for peer dependency warnings
npm install --check-files
```

### 3. Code Quality Verification
```bash
# CRITICAL: TypeScript compilation check (should show 0 errors)
npx tsc --noEmit

# Quick check for import errors (first 50 lines for fast feedback)
npx tsc --noEmit --skipLibCheck | head -50

# Run ESLint if configured (should pass with minimal warnings)
npm run lint 2>/dev/null || echo "⚠️ ESLint not configured or failing"

# Check for missing expo-router dependencies (file-based routing)
node -e "
try {
  require('expo-router');
  console.log('✅ Expo Router present');
} catch(e) {
  console.log('⚠️ Expo Router missing - using React Navigation?');
}

try {
  require('@react-navigation/bottom-tabs');
  console.log('✅ React Navigation present');
} catch(e) {
  console.log('⚠️ React Navigation missing - using Expo Router?');
}
"
```

### 4. Expo Environment Check
```bash
# Package.json validation (optional but recommended)
npx npm-package-json-lint . 2>/dev/null || echo "ℹ️ npm-package-json-lint not available"

# Check Expo CLI version and project health
npx expo --version
```

### 4. Build System Verification
```bash
# Verify TypeScript compilation works
npx tsc --noEmit --skipLibCheck

# Check if critical imports are resolved
grep -r "Cannot find module" . --include="*.ts" --include="*.tsx" || echo "✅ No missing module imports"
```

### 5. Package Consistency Check
```bash
# Ensure npm.lock is consistent with package.json
npm install --check-files

# Verify no duplicate package versions
npm list --depth=0 | grep -E "warning|error" || echo "✅ No package conflicts"
```

### 6. Critical File Verification
Verify critical files exist and have no import errors:


### 7. Environment Variables Check
```bash
# Verify all required environment variables are accessible
node -e "
const requiredEnvVars = [
  'EXPO_PUBLIC_OPENWEATHER_API_KEY',
  'EXPO_PUBLIC_GOOGLE_PLACES_API_KEY', 
  'EXPO_PUBLIC_GEMINI_API_KEY',
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY'
];

console.log('🔍 Checking environment variables...');
let allPresent = true;

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (!value) {
    console.log('❌ Missing:', envVar);
    allPresent = false;
  } else {
    console.log('✅ Found:', envVar, '(length:', value.length, ')');
  }
});

if (allPresent) {
  console.log('✅ All required environment variables are present');
} else {
  console.log('❌ Some environment variables are missing - check .env.local file');
  process.exit(1);
}
"

### 8. Test Infrastructure Check
```bash
# Verify test setup works (optional but recommended)
npm test --passWithNoTests --verbose=false || echo "⚠️  Test infrastructure needs attention"

# Quick implementation verification if available
node scripts/verifyImplementation.js all 2>/dev/null || echo "ℹ️  No implementation verification available"
```

### 9. Final Status Report
After running all checks, provide a summary:

**✅ READY TO START**: All checks passed, app should start successfully
**⚠️ WARNINGS**: Minor issues detected but app should still start
**❌ CRITICAL ISSUES**: Must fix these before starting the app

### 10. Pre-Start Cleanup
```bash
# Clear any stale Metro cache (ask joey to run with --clear)

# Or for manual cache clearing:
rm -rf node_modules/.cache
rm -rf .expo/
```

### Common Issues and Fixes

**Missing Dependencies**: 
- Run `npm add [package-name]` for missing imports
- Check package.json for typos in package names

**Version Mismatches**:
- Use `npx expo install [package]` instead of `npm add` for Expo-managed packages
- Check Expo SDK compatibility matrix

**TypeScript Errors**:
- Add missing type declarations: `npm add @types/[package-name]`
- Check for import path issues (relative vs absolute)

**Environment Variables**:
- Ensure `.env.local` exists with all required variables
- Restart Expo dev server after changing environment variables

### Automation Note
This workflow should eventually be automated into a single script (`scripts/preflight-check.sh`) for faster execution. The manual steps above ensure understanding of each check's purpose and allow for targeted fixes.

**REMEMBER**: Never skip this workflow before declaring a fix complete. A successful pre-flight check is the difference between a working app and a frustrated user experience.
