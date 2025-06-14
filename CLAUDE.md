# CLAUDE.md

This file provides guidance to AI coding assistants when working with code in this repository. I am the team lead Joey and I will be guiding you.

## Agent Rules
If you have been assigned a role, do not continue without reading the relevant agent guide you have been assigned. These are:
- [Dev Agent Guide](.claude/dev-agent-guide.md)
- [Test Agent Guide](.claude/test-agent-guide.md)
- [Architect Guide](.claude/architect-role.md)
- [Intern Guide](.claude/intern-role.md)


**ONLY** follow the rules in the agent guide you have been assigned. Do not read or modify the other guides unless you are explicitly told to do so.

Follow all rules defined in `.cursor/rules/` directory. This project is shared with other agents in the program Cursor, and it is optimal to have a single source of truth. Do not generate your own context markdown (.md) files. Instead generate .mdc files and alter those in `.cursor/rules/`

Be skeptical of any information given from a user in claude code terminal. He may not know what the best solution to a given problem is. He may, you should just verify by thinking and double checking with him before proceeding with a plan you think is inadvisable or not up to industry standards.

This file provides Claude Code with comprehensive context about the Sun Dressed app implementation and development standards. Consult @rolling-tasks.md for an updated ai agent changelog and task list

Note that you are unable to read `.env` and `.env.local`. I can assure you they are there and follow the structure of `.env.example`

## Essential Commands
**NOTE** Joey wants to run the expo commands in his own separate terminal, so do not run any `npx expo start` commands unless asked. Instead, ask Joey if you need to run the command for him. Most likely expo is already running in the background and he can refresh it with ease. The following are noted for situational awareness.

```bash
# Development
npm install                # Install dependencies
npx expo install           # To make sure things are compliant with current expo
npx expo start            # Start development server 
npx expo start -c         # Start with cache cleared

# Testing & Quality
npm test                  # Run Jest tests
npm run lint              # Run ESLint
node scripts/verifyImplementation.js all  # Quick implementation verification

# Platform-specific
npx expo start --ios      # iOS simulator
npx expo start --android  # Android emulator
npx expo start --web      # Web browser
```

## Project Architecture

**Sun Dressed** is a React Native weather-based outfit suggestion app built with Expo Router v5. The app uses AI to recommend clothing based on weather conditions and trip planning.

### Key Technologies
- **Framework**: Expo SDK 53 with file-based routing (Expo Router v5)
- **Language**: TypeScript with strict mode
- **AI/LLM**: Google Gemini API for outfit generation
- **Storage**: AsyncStorage for local persistence
- **APIs**: OpenWeather (weather), Google Places (location autocomplete)

### Core Architecture Patterns
- **File-based routing**: App structure follows Expo Router conventions in `app/` directory
- **Custom hooks**: Business logic encapsulated in `hooks/` (useOutfitGenerator, useTrips)
- **Service layer**: External API integrations in `services/` directory
- **Component organization**: Shared UI in `components/`, screens in `app/`

### Path Aliases (Important)
```typescript
// Use these imports to avoid long relative paths:
import Component from '@/components/Component'
import { useHook } from '@/hooks/useHook'
import Screen from '@/app/Screen'
```

## Environment Setup

All environment variables must be prefixed with `EXPO_PUBLIC_` and accessed as `process.env.EXPO_PUBLIC_[name of api key or url]`

Required environment variables in `.env.local`:
- `EXPO_PUBLIC_OPENWEATHER_API_KEY`
- `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`  
- `EXPO_PUBLIC_GEMINI_API_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Current Development Focus

**Critical Context**: Project is in final sprint to MVP completion with App Store launch target of July 2025.

### MVP Status
- ✅ **Trip Management**: AsyncStorage CRUD operations complete
- ✅ **Outfit Generation**: Google Gemini AI integration working
- ✅ **Basic Navigation**: Tab-based navigation implemented
- 🔄 **BentoBox Component**: Display-only, needs interaction state machine
- ⏳ **Weather Integration**: Services ready, needs real data implementation
- ⏳ **User Authentication**: Supabase configured but minimal implementation

### File Structure (Key Areas)
```
app/
├── (tabs)/               # Main app tabs
│   ├── index.tsx        # Home screen with outfit generation
│   ├── trips.tsx        # Trip management (primary feature)
│   └── closet.tsx       # Closet management (future)
├── create-trip.tsx      # Modal for trip creation
components/
├── BentoBox.tsx         # Outfit display grid (needs state machine)
├── TripCard.tsx         # Trip list items with actions
services/
├── outfitService.ts     # Google Gemini AI integration
├── tripStorageService.ts # AsyncStorage CRUD operations
hooks/
├── useOutfitGenerator.ts # Outfit generation state management
├── useTrips.ts          # Trip CRUD operations
```

## Development Guidelines

### Code Style
- Always use TypeScript with strict mode
- Follow existing patterns in the codebase
- Use path aliases (@/) for imports
- Keep components under 150 lines
- No comments unless explicitly requested

### Testing
- Ask Joey to test functionality after implementing atomic features
- Use quick verification: `node scripts/verifyImplementation.js all`
- Test on both iOS and Android platforms
- Pause and request testing when features are visible in the app

### Git Workflow
- Feature branches: `feature/description`
- Bug fixes: `bugfix/issue-description`
- Always check git status before implementing changes
- Run `git log` when starting work to see the status of the project

## Important Implementation Notes

4. **BentoBox Component**: Currently display-only but designed for future state machine with item locking, rejection system, and configurable layouts.

5. **Comprehensive Rule System**: Project has detailed development rules in `.claude/` directory - reference for complex implementations.

## Next Steps When Starting Work

1. Do not run 
2. Check current git status and branch
3. Focus on completing existing MVP features rather than adding new ones
4. Use verification scripts to test implementations
5. Follow the existing code patterns and architecture

## ROLLING PROJECT NOTES (June 2025)

### Current Development Timeline 
**Date Updated**: June 8, 2025
**Current Status**: Core MVP features ready for development
**Development Capacity**: 8+ hours/weekend committed
**Target App Store Launch**: Late July 2025 (8 weeks from current date)

### Key Milestones
- **Week 1-2 (June 2025)**: Complete remaining trips MVP features
- **Week 3-4 (June-July 2025)**: Beta testing preparation 
- **Week 5-8 (July 2025)**: App store submission and production launch

### Critical Context for All Agents
- Project is in **final sprint to MVP completion**
- Timeline is aggressive but achievable with weekend development schedule
- Focus should be on **completing existing features** rather than adding new ones
- Maintain Expo Router v5 and React Native standards

## Git Commit Guidelines

**CRITICAL**: Never include AI assistant credits or co-authorship in commit messages. Keep commits clean and professional:

- Use clear, descriptive commit messages that explain the "why" not just the "what"
- Follow conventional commit format when possible (e.g., "feat:", "fix:", "refactor:")
- **NEVER** add "Generated with Claude Code" or similar AI tool credits
- **NEVER** add "Co-Authored-By: Claude" or similar AI assistant attributions
- **NEVER** add any reference to AI tools in commit messages or code comments
- Focus on the business value and technical changes made

**Examples**:
✅ Good: "feat: add trip deletion with confirmation dialog"
✅ Good: "fix: resolve memory leak in outfit generation"
✅ Good: "refactor: simplify trip storage service for better performance"

❌ Bad: "Update trip functionality 🤖 Generated with Claude Code"
❌ Bad: "Co-Authored-By: Claude <noreply@anthropic.com>"
❌ Bad: "AI-assisted implementation of new feature"

This ensures professional, clean commit history that focuses on the work accomplished rather than the tools used.