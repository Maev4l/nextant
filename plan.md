# Nextant Implementation Plan

## Context

**Problem:** react-navigation is the standard navigation library for React Native but has heavy native dependencies (react-native-screens, react-native-gesture-handler, react-native-reanimated) making it unusable for web/PWA apps.

**Goal:** Create @isnan/nextant - a web/PWA navigation library that:
- Reuses react-navigation's excellent router logic and hooks (already platform-agnostic)
- Replaces native layer with browser APIs (window.history, popstate)
- Provides UI navigators using Framer Motion + CSS

**Outcome:** Same DX as react-navigation, but for web PWAs with smooth 60fps animations and swipe gestures.

---

## Phase 1: Project Setup & Re-exports

### 1.1 Initialize Project

```
nextant/
├── package.json
├── vite.config.js
├── eslint.config.js
├── src/
│   └── index.js
└── example/           # demo app for testing
```

**package.json:**
```json
{
  "name": "@isnan/nextant",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/nextant.cjs",
  "module": "./dist/nextant.js",
  "exports": {
    ".": {
      "import": "./dist/nextant.js",
      "require": "./dist/nextant.cjs"
    }
  },
  "files": ["dist", "src"],
  "dependencies": {
    "@react-navigation/core": "7.16.1",
    "@react-navigation/routers": "7.5.3",
    "motion": "11.15.0",
    "lucide-react": "0.468.0",
    "tailwind-merge": "2.6.0",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "tailwindcss": ">=3.0.0"
  }
}
```

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'Nextant',
      fileName: 'nextant',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'tailwindcss']
    }
  }
});
```

### 1.2 Re-exports (src/index.js)

```javascript
// Re-export everything from core
export * from '@react-navigation/core';

// Re-export routers
export * from '@react-navigation/routers';

// Override with web implementations (added in Phase 2)
export { NavigationContainer } from './NavigationContainer.js';
export { Link } from './Link.js';
// ... etc
```

### Tasks
- [ ] `yarn init` with package.json
- [ ] Install deps: vite, @vitejs/plugin-react, @react-navigation/core, @react-navigation/routers
- [ ] Create vite.config.js for library mode
- [ ] Create eslint.config.js
- [ ] Create src/index.js with re-exports
- [ ] Verify build output

---

## Phase 2: Web Native Layer

### 2.1 Files to Create

| File | Source Reference | Notes |
|------|------------------|-------|
| `src/NavigationContainer.js` | `packages/native/src/NavigationContainer.tsx` | Remove RN deps, simplify |
| `src/Link.js` | `packages/native/src/Link.tsx` | Use `<a>` instead of RN Text |
| `src/useLinking.js` | `packages/native/src/useLinking.tsx` | Already web-ready, copy |
| `src/useLinkTo.js` | `packages/native/src/useLinkTo.tsx` | Copy as-is |
| `src/useLinkProps.js` | `packages/native/src/useLinkProps.tsx` | Adapt for web |
| `src/useLinkBuilder.js` | `packages/native/src/useLinkBuilder.tsx` | Copy as-is |
| `src/createMemoryHistory.js` | `packages/native/src/createMemoryHistory.tsx` | Already web-ready, copy |
| `src/useDocumentTitle.js` | `packages/native/src/useDocumentTitle.tsx` | Already web-ready |
| `src/themes/LightTheme.js` | `packages/native/src/theming/LightTheme.tsx` | CSS variables |
| `src/themes/DarkTheme.js` | `packages/native/src/theming/DarkTheme.tsx` | CSS variables |

### 2.2 NavigationContainer.js Implementation

Key changes from react-navigation:
- Remove `I18nManager`, `Platform` imports
- Remove native-specific features (SFSymbol, MaterialSymbol)
- Use CSS direction instead of I18nManager
- Simplify theme to CSS variables

```javascript
import {
  BaseNavigationContainer,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  ThemeProvider,
  validatePathConfig,
} from '@react-navigation/core';
import { useLinking } from './useLinking.js';
import { useDocumentTitle } from './useDocumentTitle.js';
import { LightTheme } from './themes/LightTheme.js';

export const NavigationContainer = ({
  direction = 'ltr',
  theme = LightTheme,
  linking,
  fallback = null,
  documentTitle,
  onStateChange,
  children,
  ...rest
}) => {
  // ... implementation
};
```

### 2.3 Link.js Implementation

```javascript
import { useTheme } from '@react-navigation/core';
import { useLinkProps } from './useLinkProps.js';

export const Link = ({ screen, params, action, href, style, children, ...rest }) => {
  const { colors } = useTheme();
  const props = useLinkProps({ screen, params, action, href });

  const handleClick = (e) => {
    rest.onClick?.(e);
    if (!e.defaultPrevented) {
      props.onPress(e);
    }
  };

  return (
    <a
      {...props}
      {...rest}
      href={props.href}
      onClick={handleClick}
      style={{ color: colors.primary, textDecoration: 'none', ...style }}
    >
      {children}
    </a>
  );
};
```

### Tasks
- [ ] Copy createMemoryHistory.js (minimal changes, remove TS)
- [ ] Copy useLinking.js (remove TS, convert to JS)
- [ ] Create NavigationContainer.js
- [ ] Create Link.js
- [ ] Copy/adapt useLinkTo.js, useLinkProps.js, useLinkBuilder.js
- [ ] Create useDocumentTitle.js
- [ ] Create themes (LightTheme.js, DarkTheme.js)
- [ ] Update src/index.js exports
- [ ] Test with example app: basic navigation works

---

## Phase 3: UI Navigators

### 3.0 shadcn/ui Setup

Include shadcn-style utility components bundled with nextant:

**Files:**
- `src/ui/button.jsx` - Button component
- `src/ui/sheet.jsx` - Sheet/Drawer component
- `src/ui/badge.jsx` - Badge for tab notifications
- `src/utils/cn.js` - className utility (clsx + tailwind-merge)

```javascript
// src/utils/cn.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));
```

```javascript
// src/ui/button.jsx
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export const Button = ({ className, variant, size, ...props }) => (
  <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
);
```

### 3.1 Tab Navigator

**Files:**
- `src/navigators/createTabNavigator.js`
- `src/views/TabView.js`
- `src/views/TabBar.js`
- `src/views/TabBarItem.js`

**Implementation:**
```javascript
// createTabNavigator.js
import { TabRouter, useNavigationBuilder, createNavigatorFactory } from '@react-navigation/core';
import { TabView } from '../views/TabView.js';

const TabNavigator = ({ initialRouteName, backBehavior, children, screenOptions, ...rest }) => {
  const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
    initialRouteName,
    backBehavior,
    children,
    screenOptions,
  });

  return (
    <NavigationContent>
      <TabView {...rest} state={state} navigation={navigation} descriptors={descriptors} />
    </NavigationContent>
  );
};

export const createTabNavigator = createNavigatorFactory(TabNavigator);
```

**TabBarItem with shadcn Button:**
```javascript
// TabBarItem.js
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { cn } from '../utils/cn.js';

export const TabBarItem = ({ label, icon: Icon, badge, isActive, onPress }) => (
  <Button
    variant="ghost"
    className={cn(
      'flex-1 flex-col gap-1 h-auto py-2 rounded-none relative',
      isActive && 'text-primary'
    )}
    onClick={onPress}
  >
    {Icon && <Icon className="h-5 w-5" />}
    <span className="text-xs">{label}</span>
    {badge && (
      <Badge className="absolute top-1 right-1/4 h-4 min-w-4 text-[10px]">
        {badge}
      </Badge>
    )}
  </Button>
);
```

**TabView options:**
- `tabBarPosition`: 'bottom' | 'top'
- `tabBarStyle`: custom styles
- `lazy`: boolean (default true)
- `tabBarIcon`: (props) => element
- `tabBarLabel`: string
- `tabBarBadge`: string | number

### 3.2 Stack Navigator

**Files:**
- `src/navigators/createStackNavigator.js`
- `src/views/StackView.js`
- `src/views/StackItem.js`
- `src/views/Header.js`

**Implementation with Framer Motion:**
```javascript
// StackView.js
import { motion, AnimatePresence } from 'motion/react';

export const StackView = ({ state, descriptors, navigation }) => {
  return (
    <div className="nextant-stack">
      <AnimatePresence mode="popLayout">
        {state.routes.map((route, i) => {
          const isFocused = i === state.index;
          const { options, render } = descriptors[route.key];

          return (
            <StackItem
              key={route.key}
              isFocused={isFocused}
              options={options}
              onSwipeBack={() => navigation.goBack()}
            >
              {options.headerShown !== false && (
                <Header title={options.title ?? route.name} canGoBack={i > 0} />
              )}
              {render()}
            </StackItem>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
```

**StackItem with swipe gesture:**
```javascript
// StackItem.js
import { motion } from 'motion/react';

export const StackItem = ({ children, isFocused, onSwipeBack, options }) => {
  const gestureEnabled = options.gestureEnabled !== false;

  return (
    <motion.div
      className="nextant-stack-item"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag={gestureEnabled ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.5 }}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.x > 100 || velocity.x > 500) {
          onSwipeBack();
        }
      }}
    >
      {children}
    </motion.div>
  );
};
```

**Stack options:**
- `headerShown`: boolean
- `title`: string
- `animation`: 'slide' | 'fade' | 'none'
- `gestureEnabled`: boolean
- `headerLeft`: (props) => element
- `headerRight`: (props) => element

### 3.3 Drawer Navigator

**Files:**
- `src/navigators/createDrawerNavigator.js`
- `src/views/DrawerView.js`
- `src/views/DrawerContent.js`
- `src/views/DrawerItem.js`

**Implementation:**
```javascript
// DrawerView.js
import { motion } from 'motion/react';

export const DrawerView = ({ state, descriptors, navigation, drawerContent }) => {
  const isOpen = state.history.some(h => h.type === 'drawer');

  return (
    <div className="nextant-drawer">
      <motion.div
        className="nextant-drawer-overlay"
        animate={{ opacity: isOpen ? 0.5 : 0 }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={() => navigation.closeDrawer()}
      />
      <motion.aside
        className="nextant-drawer-panel"
        animate={{ x: isOpen ? 0 : -280 }}
        drag="x"
        dragConstraints={{ left: -280, right: 0 }}
        onDragEnd={(e, { offset }) => {
          if (offset.x < -100) navigation.closeDrawer();
        }}
      >
        {drawerContent ? drawerContent({ state, navigation, descriptors }) : (
          <DrawerContent state={state} navigation={navigation} descriptors={descriptors} />
        )}
      </motion.aside>
      <div className="nextant-drawer-content">
        {descriptors[state.routes[state.index].key].render()}
      </div>
    </div>
  );
};
```

**Drawer options:**
- `drawerPosition`: 'left' | 'right'
- `drawerType`: 'front' | 'back' | 'slide'
- `drawerContent`: custom drawer content component
- `gestureEnabled`: boolean

### 3.4 Styles (src/styles/navigation.css)

```css
/* Base styles - users can override with Tailwind */
.nextant-stack {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.nextant-stack-item {
  position: absolute;
  inset: 0;
  background: var(--nextant-background, white);
}

.nextant-drawer {
  position: relative;
  width: 100%;
  height: 100%;
}

.nextant-drawer-overlay {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 100;
}

.nextant-drawer-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: var(--nextant-card, white);
  z-index: 101;
}

.nextant-tab-bar {
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--nextant-card, white);
  border-top: 1px solid var(--nextant-border, #e5e5e5);
}

.nextant-header {
  display: flex;
  align-items: center;
  height: 56px;
  padding-top: env(safe-area-inset-top);
  background: var(--nextant-card, white);
  border-bottom: 1px solid var(--nextant-border, #e5e5e5);
}
```

### Tasks
- [ ] Create createTabNavigator.js
- [ ] Create TabView.js, TabBar.js, TabBarItem.js
- [ ] Create createStackNavigator.js
- [ ] Create StackView.js, StackItem.js, Header.js
- [ ] Create createDrawerNavigator.js
- [ ] Create DrawerView.js, DrawerContent.js, DrawerItem.js
- [ ] Create navigation.css base styles
- [ ] Update src/index.js exports
- [ ] Test all navigators in example app

---

## Phase 4: Example App & Testing

### 4.1 Example App Structure

```
example/
├── index.html
├── main.jsx
├── App.jsx
├── screens/
│   ├── HomeScreen.jsx
│   ├── ProfileScreen.jsx
│   ├── SettingsScreen.jsx
│   └── DetailScreen.jsx
└── vite.config.js
```

### 4.2 Test Cases

- [ ] Tab navigation: switch tabs, back behavior
- [ ] Stack navigation: push, pop, swipe back gesture
- [ ] Drawer navigation: open/close, swipe gesture
- [ ] Deep linking: initial URL, URL sync on navigate
- [ ] Nested navigators: tabs inside stack, etc.
- [ ] Theme switching: light/dark mode
- [ ] PWA: safe area padding, viewport-fit

---

## Verification

1. **Build:** `yarn build` produces dist/nextant.js and dist/nextant.cjs
2. **Example app:** `cd example && yarn dev` - test all navigators
3. **Deep linking:** Navigate to `/profile/123`, refresh, state restores
4. **Gestures:** Swipe back on stack, swipe drawer open/close
5. **PWA:** Test on mobile Safari with safe areas
6. **Bundle size:** Target ~80kb gzipped (includes motion + shadcn utils)

---

## File Summary

```
src/
├── index.js                      # main entry, re-exports
├── NavigationContainer.js        # web container
├── Link.js                       # anchor link
├── useLinking.js                 # history sync
├── useLinkTo.js                  # imperative nav
├── useLinkProps.js               # link props hook
├── useLinkBuilder.js             # href builder
├── createMemoryHistory.js        # history abstraction
├── useDocumentTitle.js           # title sync
├── themes/
│   ├── LightTheme.js
│   └── DarkTheme.js
├── utils/
│   └── cn.js                     # clsx + tailwind-merge
├── ui/                           # shadcn-style components
│   ├── button.jsx
│   ├── badge.jsx
│   └── sheet.jsx
├── navigators/
│   ├── createTabNavigator.js
│   ├── createStackNavigator.js
│   └── createDrawerNavigator.js
├── views/
│   ├── TabView.js
│   ├── TabBar.js
│   ├── TabBarItem.js
│   ├── StackView.js
│   ├── StackItem.js
│   ├── Header.js
│   ├── DrawerView.js
│   ├── DrawerContent.js
│   └── DrawerItem.js
└── styles/
    └── navigation.css
```

---

## Decisions

1. **motion**: Bundled (included in dependencies)
2. **React**: 18+ only
3. **UI components**: With shadcn (bundled utility components)
