# CLAUDE.md — Orate

## Project Overview
Orate is a speech practice app that helps users improve their public speaking through AI-powered feedback. Built with React Native / Expo for iOS, Android, and web.

## Tech Stack
- **Framework**: Expo SDK 52 with Expo Router v4 (file-based routing)
- **Language**: TypeScript (strict mode)
- **UI**: React Native with custom themed components
- **Navigation**: Tab-based layout using `@react-navigation/bottom-tabs`
- **Animations**: `react-native-reanimated`
- **State Management**: TBD (currently using React hooks)

## Project Structure
```
orate/
├── app/                    # File-based routing (Expo Router)
│   ├── (tabs)/             # Tab navigation group
│   │   ├── _layout.tsx     # Tab bar config
│   │   ├── index.tsx       # Home tab
│   │   └── explore.tsx     # Explore tab
│   ├── _layout.tsx         # Root layout (theme, fonts, splash)
│   └── +not-found.tsx      # 404 screen
├── assets/
│   ├── fonts/              # Custom fonts (SpaceMono)
│   └── images/             # App icons, splash, images
├── components/
│   ├── ui/                 # Low-level UI primitives
│   │   ├── IconSymbol.tsx  # SF Symbol → MaterialIcons mapping
│   │   └── TabBarBackground.tsx
│   ├── ThemedText.tsx      # Theme-aware text component
│   ├── ThemedView.tsx      # Theme-aware view component
│   ├── ParallaxScrollView.tsx
│   ├── HapticTab.tsx       # Haptic feedback tab button
│   └── HelloWave.tsx       # Animated wave emoji
├── constants/
│   └── Colors.ts           # Light/dark theme color tokens
├── hooks/
│   ├── useColorScheme.ts   # System color scheme hook
│   └── useThemeColor.ts    # Theme color resolver
├── scripts/
│   └── reset-project.js    # Reset to blank state
├── app.json                # Expo config
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Design System — Spark
The app follows the "Spark" design system from the Figma file.

### Color Palette
```
Primary Background:
  CREAM       #FFFDF5    — Main app background
  WARM_CANVAS #FFF6E8    — Card/section background
  SHEET_WHITE #FFFCF5    — Sheet/modal background

Accent Colors:
  BRAND_ORANGE #FE9A0E   — Primary brand color
  ORANGE       #FF9900   — Secondary accent
  TANGERINE    #FF7D1F   — Highlight/emphasis
  GOLD         #FFE47B   — Badges, highlights
  PEACH        #FFE8BE   — Soft accent fills
  PALE_YELLOW  #FFF0C3   — Background highlights

Text Colors:
  COCOA_TEXT   #382823   — Primary text
  WARM_GRAY    #918880   — Secondary/helper text
  PALE_GRAY    #B6ADA6   — Placeholder text
  BROWN        #79513C   — Accent text

Interactive:
  COCOA_CTA    #3A2925   — CTA button background (text: white)

Borders & Surfaces:
  WARM_BORDER  #E9DECF   — Dividers, card borders
  SAND         #DBD0C2   — Heavier borders, inactive states
```

### Typography
- **Headlines**: Outfit Bold, 23–24px, lineHeight 28px, color #382823
- **Body**: Roboto Medium, 16–17px
- **Helper text**: Roboto Regular, 13px
- **CTA buttons**: Roboto Bold, 16px, white on #3A2925
- **Available fonts**: Inter (Semi Bold, Regular, Medium, Bold), Outfit Bold, Roboto (Regular, Medium, Bold)

### Design Principles
- Warm, inviting, approachable — no cold/clinical UI
- Rounded corners (12–16px on cards)
- Generous whitespace and padding
- Subtle shadows, never harsh
- Cream/warm-toned backgrounds, avoid pure white (#FFFFFF)

## Figma Reference
- **Main design file key**: `xDjHmwB6Pr6fsVZvHgSaTH`
- **Tutorials file key**: `UXh4CGih9wXoeopm8tzcg3`

### Key Figma Screens (node IDs — DO NOT modify originals)
- LESSONS section: `8390:9844`
- PROFILE section: `8437:10005`
- Profile Main: `8437:10008`
- Membership detail: `8447:10050`

## Commands
```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in browser
npm test           # Run tests (jest)
npm run lint       # Run linter
```

## Development Notes
- Path alias `@/*` maps to project root (configured in tsconfig.json)
- Dark mode supported via `useColorScheme` hook and `Colors` constant
- Tab bar uses iOS blur effect (`expo-blur`) with haptic feedback
- Splash screen managed by `expo-splash-screen` (auto-hide after fonts load)

## GitHub
- **Repo**: github.com/emilyyychen/orate
- **Branch**: main
- **Collaborators**: trevorgreenleaf (teacher), sheller-ville (teammate)

## AI Handoff Notes
When working on this project:
1. Always reference the Figma designs before building screens
2. Use the Spark color palette — never default React Native colors
3. Match the warm, rounded aesthetic from the designs
4. The app should feel personal and encouraging, not corporate
5. Prioritize iOS experience (primary platform)
