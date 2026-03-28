# Nextant

Web/PWA navigation library for React - a lightweight rewrite of react-navigation concepts for the browser.

## Project Overview

Nextant provides the same developer experience as react-navigation but targets web/PWA instead of React Native. It reuses `@react-navigation/core` and `@react-navigation/routers` while providing web-specific implementations for the native layer and UI components.

## Architecture

```
@isnan/nextant
├── Re-exports from @react-navigation/core (unchanged)
├── Re-exports from @react-navigation/routers (unchanged)
├── Web-specific replacements:
│   ├── NavigationContainer (browser history integration)
│   ├── Link (anchor element)
│   ├── useLinking (window.history)
│   └── themes
└── UI Navigators (CSS transitions + shadcn):
    ├── createTabNavigator
    ├── createStackNavigator
    └── createDrawerNavigator
```

## File Structure

```
src/
├── index.js              # Public exports - ALL public API must be exported here
├── NavigationContainer.jsx
├── Link.jsx
├── LinkingContext.js
├── useLinking.js         # Browser history sync
├── useLinkTo.js
├── useLinkProps.js
├── useLinkBuilder.js
├── useDocumentTitle.js
├── useNavigation.js
├── createMemoryHistory.js
├── navigators/           # Navigator factories
│   ├── createStackNavigator.jsx
│   ├── createTabNavigator.jsx
│   └── createDrawerNavigator.jsx
├── views/                # UI components for navigators
│   ├── Header.jsx
│   ├── StackView.jsx
│   ├── StackItem.jsx
│   ├── TabView.jsx
│   ├── TabBar.jsx
│   ├── TabBarItem.jsx
│   ├── DrawerView.jsx
│   ├── DrawerContent.jsx
│   └── DrawerItem.jsx
├── themes/
│   ├── index.js
│   ├── LightTheme.js
│   └── DarkTheme.js
├── ui/                   # Reusable UI primitives (shadcn-style)
│   ├── button.jsx
│   ├── badge.jsx
│   └── cn.js
├── utils/
│   └── useAnimation.js   # Animation utilities, spring config
└── styles/
    └── navigation.css    # Base styles, exported as styles.css
```

## Tech Stack

- React 18+
- Vite (bundler, dev server)
- esbuild (build output)
- Native CSS transitions + Web Animations API (no Framer Motion)
- shadcn/ui style components (bundled)
- Tailwind CSS (peer dependency)
- JavaScript (no TypeScript)
- Vitest for testing

## Development Guidelines

- Use yarn (not npm)
- Pure JavaScript, no TypeScript
- Use fat arrow notation for functions
- Use dayjs (not moment) if date handling needed
- Strict versioning in package.json
- ESLint config in eslint.config.js
- Comments emphasize WHY, not HOW
- Run `yarn lint` before committing

## Code Patterns

### Component Structure
```jsx
// 1. Imports (React, then external, then internal)
import { forwardRef, useState } from 'react';
import { useTheme } from '@react-navigation/core';
import { cn } from '../utils/cn.js';

// 2. JSDoc comment describing the component
/**
 * Brief description
 *
 * Supports react-navigation compatible options:
 * - option1: description
 * - option2: description
 */

// 3. Component as const with fat arrow
export const MyComponent = forwardRef(({ prop1, prop2 = 'default' }, ref) => {
  // hooks first
  const { colors } = useTheme();

  // then state
  const [value, setValue] = useState(null);

  // then effects/callbacks
  // then render helpers
  // then return
});

// 4. displayName for DevTools
MyComponent.displayName = 'MyComponent';
```

### Navigator Pattern
- Navigator component uses `useNavigationBuilder` from core
- Passes state/navigation/descriptors to a View component
- View component handles rendering and animations
- Screen options are extracted from `descriptors[route.key].options`

### Options Naming
- Follow react-navigation naming exactly for API compatibility
- Header options: `headerShown`, `headerTitle`, `headerLeft`, `headerRight`, `headerStyle`, etc.
- Tab options: `tabBarIcon`, `tabBarLabel`, `tabBarBadge`, `tabBarStyle`, etc.
- Drawer options: `drawerIcon`, `drawerLabel`, `drawerStyle`, etc.

### Animation Constants
- Use `SPRING_DURATION` and `SPRING_EASING` from `useAnimation.js`
- Prefer CSS transitions over Web Animations API for simple cases
- Use Web Animations API only for gesture-driven animations

### Theme Usage
```jsx
const { colors } = useTheme();
// colors.primary, colors.background, colors.card, colors.text, colors.border, colors.notification
```

### Styling
- Use `cn()` utility for conditional classNames (Tailwind + clsx + tailwind-merge)
- Inline styles for dynamic theme colors
- Tailwind classes for layout and static styles
- CSS class prefixes: `nextant-` (e.g., `nextant-header`, `nextant-stack-item`)

## Testing

```bash
yarn test        # Watch mode
yarn test:run    # Single run
yarn test:coverage
```

- Tests in `tests/` folder
- Use @testing-library/react
- Test user interactions, not implementation details

## API Design Principles

1. **Compatibility first** - Match react-navigation API where possible
2. **Web-native** - Use browser APIs (history, anchors) not abstractions
3. **Progressive enhancement** - Work without JS for links (href attribute)
4. **Minimal dependencies** - Avoid adding new deps; bundle what's needed

## Package Distribution

- Hosted on GitHub (not npm registry)
- Use gitpkg for publishing subdirectories if monorepo
- Consumed via: `"@isnan/nextant": "github:isnan/nextant#v1.0.0"`

## PWA Considerations

- Headers use safe area padding: `pt-[max(0.5rem,env(safe-area-inset-top))]`
- Requires `viewport-fit=cover` in viewport meta tag
- Smooth 60fps animations for native feel
- Swipe gestures for stack navigation and drawer
- Touch-friendly hit targets (min 44px)

## Documentation

- Docs in `docs/` folder as markdown (Docusaurus/VitePress compatible)
- Follow react-navigation doc structure
- Every option needs: description, type, default, example
- Code examples must be copy-pasteable

## Common Tasks

### Adding a new screen option
1. Add prop to the View component (e.g., `StackView.jsx`)
2. Extract from `options` in the render function
3. Pass to child component (e.g., `Header.jsx`)
4. Document in the navigator's doc file
5. Add to `screenOptions` passthrough in navigator if needed

### Adding a new hook
1. Create `src/useHookName.js`
2. Export from `src/index.js`
3. Document in `docs/hooks.md`

### Debugging navigation state
```jsx
<NavigationContainer
  onStateChange={(state) => console.log('State:', JSON.stringify(state, null, 2))}
>
```
