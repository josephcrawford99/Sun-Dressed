# Sun Dressed Debugging Guide

This document provides troubleshooting tips for common issues encountered during development of the Sun Dressed app.

## UI Layout Issues

### Z-Index Problems

**Issue**: Components appear in the wrong order (like location dropdown being hidden by other elements).

**Solution**:
1. Ensure parent components have `position: 'relative'` set to create a proper stacking context
2. Use appropriate z-index values for components that need to appear on top
3. Make sure dropdowns have a higher z-index (e.g., 1000) than regular content
4. Assign negative z-index values (e.g., -1) to components that should always stay in the background

Example:
```typescript
// For elements that should appear on top (like dropdowns)
container: {
  position: 'relative',
  zIndex: 1000,
  // other styles
}

// For elements that should stay behind (like calendar strip)
backgroundContainer: {
  zIndex: -1,
  // other styles
}
```

### Layout Breakage on Different Screen Sizes

**Issue**: Layout looks good on one device but breaks on others.

**Solution**:
1. Use relative units (flex, percentages) instead of fixed dimensions
2. Test on multiple screen sizes during development
3. Implement responsive design patterns
4. Consider using React Native's `Dimensions` API for screen-size based adjustments

## State Management Issues

### AsyncStorage Data Not Persisting

**Issue**: User preferences or data saved with AsyncStorage not persisting between sessions.

**Solution**:
1. Verify AsyncStorage calls are using `await` properly
2. Check for error handling around AsyncStorage operations
3. Use the AsyncStorage debugging tools to see what's being stored
4. Ensure keys are consistent between save and load operations

Example debugging:
```typescript
try {
  const value = await AsyncStorage.getItem('userPreferences');
  console.log('Retrieved preferences:', value);
} catch (e) {
  console.error('Failed to load preferences:', e);
}
```

### Component Re-Rendering Too Often

**Issue**: Performance issues due to excessive re-rendering.

**Solution**:
1. Use React.memo for components that don't need frequent updates
2. Implement useCallback for function props
3. Move state up or down the component tree as appropriate
4. Use performance monitoring tools to identify bottlenecks

## API Integration Issues

### Weather API Failures

**Issue**: Weather data not loading or errors in API responses.

**Solution**:
1. Check API key validity
2. Verify network connection
3. Use try/catch blocks around API calls
4. Implement proper loading and error states
5. Check API rate limits
6. Test with mock data when developing

### Location Services Not Working

**Issue**: Unable to get user's current location.

**Solution**:
1. Check location permissions in app settings
2. Verify location services are enabled on the device
3. Implement proper error handling for location failures
4. Provide manual location entry as a fallback

## Outfit Recommendation Issues

### Inappropriate Clothing Suggestions

**Issue**: Outfit recommendations don't match weather conditions.

**Solution**:
1. Review temperature ranges in outfitService.ts
2. Check weather mapping logic in the clothing recommendation algorithm
3. Verify the clothingData.json has correct warmth levels
4. Add more user feedback options to refine preferences

### Missing Images for Clothing Items

**Issue**: Some clothing items don't have corresponding images.

**Solution**:
1. Use default fallback images per category
2. Follow the naming convention in clothingImages.ts
3. Place images in the correct directory under src/assets/clothing/
4. Check image path references in the code

## Dev Environment Issues

### Expo Build Failures

**Issue**: Expo fails to build or start the development server.

**Solution**:
1. Clear cache: `npx expo start -c`
2. Update Expo CLI: `npm install -g expo-cli`
3. Check node_modules: Delete and reinstall with `npm install`
4. Verify SDK versions are compatible
5. Check for syntax errors in recent code changes

## Debugging Tools

### React Native Debugger

Use React Native Debugger for:
- Inspecting component hierarchy
- Monitoring network requests
- Viewing console logs
- Debugging Redux/Context state

### Expo Tools

- Use Expo DevTools in browser for device connection issues
- Enable remote debugging for console access
- Use Performance Monitor to identify bottlenecks

## Common Error Patterns

### "Cannot read property 'X' of undefined"

This usually indicates:
1. Data is being accessed before it's loaded
2. Optional chaining (`?.`) is missing
3. Default values aren't provided

Solution: Add null checks, optional chaining, and default values.

### "Invariant Violation: Tried to register two views with the same name"

This usually indicates:
1. Component naming conflicts
2. Hot reloading issues

Solution: Restart the dev server or clear cache.

## Reporting Bugs

When reporting bugs:
1. Document the exact steps to reproduce
2. Note the environment (device, OS version, app version)
3. Include screenshots if possible
4. Save relevant logs and error messages

This guide will be updated as new issues are discovered and resolved.
