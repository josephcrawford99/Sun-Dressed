### General TypeScript Best Practices

Clean React Native code starts with a solid TypeScript foundation. These practices are updated for 2024 to align with modern TypeScript and React Native patterns.

*   **Enable Strict Mode**: In your `tsconfig.json`, set `"strict": true`. This enables comprehensive type-checking rules that catch errors at compile-time rather than runtime.
*   **Avoid the `any` Type**: Using `any` disables TypeScript's type-checking. Instead, use specific types (`string`, `number`), create custom `interface` or `type` definitions, or use `unknown` for truly unknown types.
*   **Embrace Immutability**: Use the `readonly` keyword for properties that shouldn't change after initialization. For arrays, use `ReadonlyArray<T>` to prevent mutations.
*   **Use Utility Types**: Leverage built-in utility types like `Partial`, `Pick`, `Omit`, and `Readonly` to avoid repetitive type definitions and maintain DRY principles.
*   **Be Explicit with Types**:
    *   Always explicitly define return types for functions to establish clear contracts and enable better error detection.
    *   Handle `null` and `undefined` safely using optional chaining (`?.`) and nullish coalescing (`??`) operators.
    *   Use type guards and discriminated unions for complex type checking.
*   **Type Organization**: Create a centralized `types/` directory for shared type definitions. Keep component-specific types colocated with their components.
*   **Follow Naming Conventions**:
    *   **Types/Interfaces**: Use `PascalCase` (e.g., `UserProfile`, `ApiResponse`)
    *   **Functions/Variables**: Use `camelCase` (e.g., `getUserData`, `isLoading`)
    *   **Constants**: Use `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`)
*   **Variable Declaration**: Use `const` by default, `let` only when reassignment is needed. Never use `var`.
*   **Equality**: Always use strict equality (`===`, `!==`) to avoid unexpected type coercion.

### Modern React Native Best Practices (2024)

*   **Performance Optimization**:
    *   Use `React.memo()` to prevent unnecessary re-renders of functional components
    *   Implement `useMemo()` and `useCallback()` for expensive calculations and function references
    *   Use `React.lazy()` and `Suspense` for code-splitting and lazy loading
    *   Implement virtualization for long lists using `FlatList` or `VirtualizedList`
*   **State Management Patterns**:
    *   Prefer local state (`useState`) for component-specific data
    *   Use Context API sparingly for truly global state
    *   Consider Zustand or Redux Toolkit for complex state management
    *   Avoid overusing global state to maintain scalability
*   **Custom Hooks**: Create reusable logic through custom hooks prefixed with "use" to encapsulate stateful logic and side effects.
*   **Error Boundaries**: Implement error boundaries to gracefully handle component errors and prevent app crashes.

### React Native & Expo Component-Specific Practices (2024 Updated)

Building on TypeScript, these practices align with modern React Native and Expo SDK 52/53 requirements.

*   **Project Structure**:
    *   **Organize by Feature**: Structure your project into feature-based modules (`components`, `screens`, `hooks`, `services`, `types`). This scales better than organizing by file type alone.
    *   **Colocation**: Keep related files together. Component files (`Button.tsx`), styles (`Button.styles.ts`), and tests (`Button.test.tsx`) should reside in the same folder.
    *   **Absolute Imports**: Use path aliases configured in `babel.config.js` and `tsconfig.json` to avoid long relative imports (e.g., `@/components/Button` instead of `../../../components/Button`).

*   **Component Design**:
    *   **Single Responsibility**: Components should have one clear purpose and be under 150 lines when possible.
    *   **Meaningful Names**: Use descriptive names that convey purpose (e.g., `UserProfileCard` instead of `Card`).
    *   **Props Interface**: Always define explicit TypeScript interfaces for component props.
    *   **Destructure Props**: Destructure props in the component signature for clarity.
    *   **Ref Forwarding**: Use `forwardRef` when components need to expose imperative APIs.

*   **Modern Styling Patterns**:
    *   **StyleSheet.create()**: Use React Native's `StyleSheet.create()` for performance and validation.
    *   **Centralized Theming**: Import colors, fonts, and spacing from a central theme system (e.g., `@/styles/theme`).
    *   **Platform-Specific Styles**: Use `Platform.select()` for platform-specific styling needs.
    *   **Avoid Inline Styles**: Inline styles should only be used for dynamic values that change frequently.
    *   **Responsive Design**: Use Flexbox and percentage-based widths for responsive layouts.

*   **Expo SDK 52/53 Specific**:
    *   **New Architecture Ready**: Ensure components work with the New Architecture (enabled by default in SDK 53).
    *   **Hermes Compatibility**: All code must be compatible with Hermes JavaScript engine (JSC no longer supported).
    *   **expo-router v3**: Use file-based routing with Expo Router instead of React Navigation when possible.
    *   **Modern APIs**: Prefer `expo-audio` over `expo-av` for audio functionality.

*   **Performance & Security**:
    *   **Lazy Loading**: Implement lazy loading for heavy components using `React.lazy()`.
    *   **Memoization**: Use `React.memo()`, `useMemo()`, and `useCallback()` appropriately.
    *   **List Optimization**: Use `FlatList` with proper `keyExtractor` and `getItemLayout` for large datasets.
    *   **Image Optimization**: Use appropriate image formats and implement caching strategies.
    *   **Security**: Never hardcode API keys or sensitive data in components.

*   **Automated Tooling**:
    *   **ESLint + Prettier**: Enforce consistent code style with proper React Native and TypeScript rules.
    *   **Type Checking**: Run `tsc --noEmit` in CI/CD to catch type errors.
    *   **Testing**: Use Jest with React Native Testing Library for component testing.
    *   **Pre-commit Hooks**: Use Husky and lint-staged for automated quality checks.

[1] https://github.com/andredesousa/typescript-best-practices
[2] https://www.itwinjs.org/learning/guidelines/typescript-coding-guidelines/
[3] https://dev.to/alisamir/best-practices-for-writing-clean-typescript-code-57hf
[4] https://mkosir.github.io/typescript-style-guide/
[5] https://dev.to/hellonehha/react-native-code-practices-6dl
[6] https://www.linkedin.com/pulse/clean-code-rules-react-native-rohit-bansal
[7] https://www.turing.com/kb/writing-clean-react-code
[8] https://blog.logrocket.com/react-native-styling-tutorial-examples/
[9] https://dev.to/yugjadvani/how-to-write-better-typescript-code-best-practices-for-clean-effective-and-scalable-code-38d2
[10] https://gist.github.com/anichitiandreea/e1d466022d772ea22db56399a7af576b
[11] https://www.brilworks.com/blog/react-native-best-practices/
[12] https://app.daily.dev/posts/react-native-coding-standards-structure-3resapcvv
[13] https://www.linkedin.com/pulse/mastering-react-native-app-architecture-scalable-approach-chohra-bmr2e
[14] https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-cdk-typescript-iac/typescript-best-practices.html
[15] https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
[16] https://www.bacancytechnology.com/blog/typescript-best-practices
[17] https://www.reddit.com/r/react/comments/1dsbpxp/seeking_large_react_typescript_projects_to_learn/
[18] https://www.reddit.com/r/reactnative/comments/1dnm0tj/best_practices_for_any_industry_level_project/
[19] https://reactnative.dev/docs/performance
[20] https://mobidev.biz/blog/react-native-app-development-guide
[21] programming.react_native
[22] tools.ai_assistants.ide_integration