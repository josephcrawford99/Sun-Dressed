# Sun Dressed - Implementation Guide

This document serves as a guiding file for AI agents to reference for generating the Sun Dressed app. I am refactoring my app from scratch using Claude pro for large planning and design and cursor pro for improvements to pieces of the implementation in smaller chunks.

## Project Overview

I have most of this already coded out in a large codebase but it is a mess of poorly organized code. I want to ask Claude to rebuild using the design I have made previously as a reference, but only creating the files and components specified below, adding new components only with my explicit approval. These implemented files are in C:\Users\NCWDG_Developer\Desktop\WeatherApp\Old . As such I want to be sure that cursor and Claude uses the previously written code only for style guidance not for implementation or file structure. Using react and expo.

## Development Standards

Each screen will be a standalone .tsx file with component-specific types co-located within the same file for improved readability and searchability. Shared types that apply to multiple components will be stored in a separate types directory.

## Component Hierarchy

```
App
├── Navigation
│   └── NavBar (on multiple screens)
├── Screens
│   ├── AuthScreen
│   ├── SignUpScreen
│   ├── HomeScreen
│   │   ├── LocationBar
│   │   ├── WeatherCustomButton
│   │   ├── FlipContainer
│   │   │   ├── WeatherCard
│   │   │   └── CardContainer
│   │   │       └── BentoBoxCard
│   │   │           └── BentoBoxElement
│   │   ├── CalendarStrip
│   ├── SettingsScreen
│   ├── AccountScreen
│   ├── LoadingScreen
│   ├── HangerScreen (unfinished)
│   └── SocialScreen (unfinished)
└── Contexts
    ├── AuthContext
    └── SettingsContext
```

## Implementation Phases

### Phase 1: Core Infrastructure
1. Creating necessary files with pseudocode comments and descriptions for all components
2. Creating necessary configuration files for running the app in expo web
3. Completing a static HomeScreen.tsx with clickable weather button to flip between bento and weather card

### Phase 2: Weather Integration
3. Completing outfit recommendation algorithm and connecting to HomeScreen bento (using mock weather data and location)
4. Connecting weather API to weather card in flip container

### Phase 3: User Personalization
5. Allowing location selection functionality
6. Auth Screen completion for log in
7. Settings screen implementation

## Screens

### HomeScreen
The main screen of the app. Contains:
- Greeting (good morning/afternoon/evening, Joey!)
- Location bar with autocomplete
- Weather custom button for flipping flipcontainer
- Bento box
- Nav bar on bottom

### Auth Screen
The first screen, for sign in. Contains:
- Sign in with Google and Apple
- Sign in email entry box
- Sign in password box
- Or: sign up (navigates to sign up screen)

### Sign Up Screen
Enter email and password to add to supabase. Password verification and limits like min length and complexity. Male female or all presenting. Units preferred.

### Settings Screen
Units for F/C degrees selector and mph vs km/h units. Male female or all presenting. Other miscellaneous selectors added as needed.

### Account Screen
Contains first name (for greeting and social). Change email and password.

### Loading Screen
Loading states will be implemented using skeleton screens rather than spinners when possible. The app will display loading indicators only for operations lasting more than 300ms. Authentication transitions will show a full-screen loader with the app logo, while in-app data refreshes will use inline component loading states that maintain the UI structure.

### Hanger Screen
Unfinished, will implement later.

### Social Screen
Unfinished, will implement later.

## Contexts

### AuthContext.tsx
For sign up, log in, log out and authentication.

### SettingsContext.tsx
For temp, wind speed units, and future preferences made in settingsscreen.

## Components

Components should have their types either colocated inside their definitions for readability, or in a shared file to be reused among components. Shared types include but are not limited to custom buttons, user text entry fields, and fonts.

### NavBar
A bar at the bottom of hanger, social, account and home screens for jumping between them. 4 buttons.

### WeatherCustomButton
Black button white text to right of location button, has an icon for type of weather and the current temperature. Libre Baskerville font. Clicking will flip the flipcontainer to show weather or outfit toggles between the two.

### CalendarStrip
Below location bar. Shows days of week in rounded square blocks. Current day is black with white text and all others are black outline with black text white background. Will be buttons for selecting other date at later iterations.

### WeatherCard
Shows current weather with feels like temp and rain and wind. Later may show weather at different parts of day. Inside flip container.

### CardContainer
Inside flip container, bento boxes act as an individual outfit card and when user adds a thumbs down to an element then an additional card is added to the right that the user can swipe to, showing a different full outfit as a new bento box card. The user can swipe left to right to see outfits they have thumbed down elements in (to adjust their previous choices) and right to left to the new adjusted bento box cards with acceptable outfits that they can also add thumbs up and down to elements and populate further new cards. Bottom of card may have a rectangle label with width of the card container and round edges that has warnings (this outfit may be too cold, this outfit will not keep you dry) which may be needed if a user has thumbed down enough critical items. Implemented in outfit suggestion algorithm.

### BentoBoxCard
Inside card container. Organizes bento boxes into grid with specific layout: two columns on left, three on right. Left column contains Top and Bottom clothing items (which merge if a dress or one-piece is worn). Right column contains Outerwear (stacked horizontally in order of wear, e.g., hoodie left then coat right) and Accessories (stacked and squashed vertically if multiple). Shoes appear in a squashed rectangle on the bottom right, aligned with the bottom edge of the Bottom item. When an element is clicked, it should grow to fill the entirecontainer as a the same gray rectangle with round edges, smoothly pushing other elements offscreen (not overlapping with elements outside the BentoBox container).

### BentoBoxElement
A block inside the box container. Holds a logo for the individual part of an outfit. Not a photo, probably a vector image black with no background or png. Light Gray background from theme.ts, square with no outlines, rounded edges. Labels should be vertical (rotated left 90 degrees) in a very light gray italic Montserrat font, displaying text like "Top", "Bottom", "Accessory", "Shoes", "Outerwear", etc. When clicked, the element smoothly expands to the size of the entire bento box. When the box is clicked again, the element shrinks back to its original state with a smooth animation, pulling the other elements back from offscreen. The placeholder implementation should demonstrate the elements' ability to grow, and test script should show various organizational layouts available to the bento box based on different possible allowed clothing combinations.

### FlipContainer
Flips between weather and outfit views when weather button is pressed. Looks like card flip.

### LocationBar
Begins populated with a users last used location. Default New York NY. Autocomplete based on how far from current location, show last used locations in dropdown when first clicked. Then show possible locations while typing based on the available locations from weather api. Arrow button (gray) will populate bar with the current location of the user.

### ErrorBar
A pastel red error indicator that pops up on the bottom of the screen when prompted by an API utility, will contain the error message. A standardized error component that can be reused across screens.

## Styles

Styles will follow a hierarchy: global theme constants, screen-specific styles, and component styles. Inline styles will be avoided in favor of StyleSheet objects. Contains colors, corners of buttons radius, etc.

**Fonts:** Libre Baskerville and Monserrat
**BorderRadius:** 8 for buttons and features
**Layout:** Align and justify center

**Colors:**
- `#fff` Full dark black for buttons with white text and most thin outlines on buttons, as well as the primary text color
- `#757575` Gray for box components such as bento box elements
- `#000` Full white for most background
- `#FFEE8C` Yellow as a tertiary color to make elements pop. Do not use unless told to. Ideally a maximum of one button per screen can be yellow

## API Interface

All API interface files (.ts) will implement comprehensive input validation and structured error handling. Each API function will return standardized error objects that can be consumed by UI components to display appropriate user feedback.

### Use Weather API
For pulling data from the weather API. Will contain error handling for API to be displayed by views.

### Use Supabase API
For interfacing with database supabase. Add login and check password and stuff. Add persistent data that needs to be in database. Will contain error handling for API to be displayed by views. Will cache Settings Context, has user and password. Cache the users .json containing all outfit preference info for portability. Will later contain social info.

### Use Local Memory
Cache will be invalidated and refreshed when data changes or on application restart. A manual 'Clear Cache' option will be available in Settings. Will contain error handling for if local memory throws errors. Things that should be cached:
- Username and password for auto login
- Settings context
- Last used location
- Previous locations

### Outfit Suggestion
A very user readable algorithm that considers weather as input (chance of rain, wind, sun, temperature) as well as past user preferences (number of times outfit item is thumbed up or down, dynamic heat statistic based on user statements of too hot or cold) and today's choices (like a user has excluded jeans from an earlier outfit suggestion) and outputs a full outfit that the bento boxes can display. Also a function for displaying warnings based on weather. If a user has thumbed down all rain mitigation things (umbrella rain jacket etc) then the algorithm may suggest an outfit without it but with a warning at the bottom saying this outfit may not keep you dry.

### Time
Has get time of day (morning/afternoon/evening) and date. Pulls from weather API or external other API. Will contain error handling for API to be displayed by views.

### Navigation
Defines the screens in order for the app. Auth for sign in > HomeScreen > can navigate with nav bar > upon sign out, go to Auth screen again.

## Additional Resources

### Clothing JSON
For all items that can be pulled by outfit suggestion, paired with icons. Contains default heat statistic and info about the clothing items.

### Clothes Icons
Unique vector logos to identify what clothes a user may want to wear.

### User Clothing JSON
A copy of clothing JSON with user input taken into account (adjusting heat based on user preference for items, adjusting how much user likes certain items in outfits most often).

## Testing Strategy

When in the testing phase these should be implemented:
- Unit tests for core algorithm functions (outfit suggestions based on temperature ranges)
- Component snapshot tests for UI elements like BentoBoxElement and WeatherCard
- Integration tests for the authentication flow from login to home screen
- Mock API tests to verify weather data handling with different responses

## Branching Strategy

Will use feature branches named feature/feature-name merging into develop, with proper testing before merging to main. Each feature will have its own branch to isolate changes.
