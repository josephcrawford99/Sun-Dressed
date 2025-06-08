### General TypeScript Best Practices

Clean React Native code starts with a solid TypeScript foundation. Enforcing these rules improves type safety and code clarity[11].

*   **Enable Strict Mode**: In your `tsconfig.json`, set `"strict": true`. This enables a suite of type-checking rules that help catch common errors, such as `noImplicitAny` and `strictNullChecks`[3][4].
*   **Avoid the `any` Type**: Using `any` disables TypeScript's type-checking for that variable. Instead, use specific types (`string`, `number`), create custom `interface` or `type` definitions for your objects, or use `unknown` for values where the type is truly unknown at compile time[1][3].
*   **Embrace Immutability**: Use the `readonly` keyword for properties that should not be changed after initialization. This helps prevent accidental mutations of state and props[3][4]. For arrays, you can use the `ReadonlyArray` type[4].
*   **Use Utility Types**: Leverage built-in utility types like `Partial`, `Pick`, `Omit`, and `Readonly` to avoid writing repetitive type definitions and keep your code DRY (Don't Repeat Yourself)[1][9].
*   **Be Explicit with Types**:
    *   Always explicitly define the return types for your functions. This makes the function's contract clear and allows TypeScript to catch bugs if the implementation changes[2][9].
    *   Handle `null` and `undefined` safely. Use optional chaining (`?.`) and the nullish coalescing operator (`??`) to write cleaner and safer code when dealing with potentially nullish values[3][9].
*   **Follow Naming and Style Conventions**:
    *   **Naming**: Use `PascalCase` for type names, components, and enums. Use `camelCase` for functions, properties, and variables[2][6].
    *   **Variables**: Use `const` by default and `let` only when a variable needs to be reassigned. Avoid using `var`[1][2].
    *   **Equality**: Always use strict equality (`===` and `!==`) instead of loose equality (`==` and `!=`) to avoid unexpected type coercion[1].

### React Native & Component-Specific Practices

Building on TypeScript, these practices are specific to structuring and writing React Native applications[12].

*   **Project Structure**:
    *   **Organize by Feature**: Structure your project directory into modules based on features or domains (e.g., `components`, `screens`, `hooks`, `services`, `navigation`). This scales better than organizing by file type alone[5][13].
    *   **Colocation**: Keep related files together. For example, a component file (`Button.tsx`) and its styles (`Button.styles.ts`) should reside in the same folder[5].
*   **Component Design**:
    *   **Small and Focused**: Break down large, complex components into smaller, single-purpose components. This improves reusability, testability, and readability[7].
    *   **Meaningful Names**: Give components descriptive names that clearly convey their purpose (e.g., `ProductCard` instead of `Card`)[6][7].
    *   **Destructure Props**: Always destructure props in the component's signature. This makes the code more readable by clearly showing which props the component expects and uses[5][7].
*   **Styling**:
    *   **Avoid Inline Styles**: While convenient for quick tests, inline styles are hard to maintain and reuse in larger applications. They also miss out on performance optimizations[5][8].
    *   **Use `StyleSheet.create()`**: This API from React Native is the preferred method. It moves styles out of the render function, improves organization, and sends the style objects over the native bridge only once[5][8].
*   **State Management**:
    *   **Local vs. Global**: Prefer local state (`useState`) for data that is only used within a single component or its direct children. Use global state solutions for data that needs to be shared across many unrelated parts of your app[5].
    *   **Global State Tools**: For simple global state, React's `Context API` is a good choice. For more complex, high-frequency updates, consider a dedicated library like Redux Toolkit[5][13].
*   **Automated Tooling**:
    *   **Linting and Formatting**: Integrate tools like ESLint and Prettier into your workflow. They automatically enforce consistent coding styles and catch common errors[2][4].
    *   **IDE Integration**: Configure your editor (like VS Code) to show linting errors and format your code on save. This provides immediate feedback and ensures consistency across your team[2][22].

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