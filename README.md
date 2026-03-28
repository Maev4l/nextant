# Nextant

Web/PWA navigation library for React - [react-navigation](https://reactnavigation.org/) for the browser.

## Features

- **Same API** - Familiar react-navigation patterns and concepts
- **Web-optimized** - Browser history, URL integration, anchor links
- **Smooth animations** - 60fps CSS transitions and touch gestures
- **Lightweight** - Reuses `@react-navigation/core` and `@react-navigation/routers`
- **PWA-ready** - Safe area handling for phone notches

## Installation

```bash
yarn add @isnan/nextant @react-navigation/core @react-navigation/routers
```

Peer dependencies: `react >= 18.0.0`, `react-dom >= 18.0.0`, `tailwindcss >= 3.0.0`

## Quick Start

```jsx
import "@isnan/nextant/styles.css";
import { NavigationContainer, createStackNavigator } from "@isnan/nextant";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## Navigators

- **Stack** - `createStackNavigator()` - Push/pop screens with slide animations
- **Tab** - `createTabNavigator()` - Bottom/top tab bar navigation
- **Drawer** - `createDrawerNavigator()` - Side drawer with swipe gestures

## Documentation

See the [docs](./docs/) folder:

- [Getting Started](./docs/getting-started.md)
- [Hello Nextant](./docs/hello-nextant.md)
- [Navigating](./docs/navigating.md)
- [Passing Parameters](./docs/params.md)
- [Stack Navigator](./docs/stack-navigator.md)
- [Tab Navigator](./docs/tab-navigator.md)
- [Drawer Navigator](./docs/drawer-navigator.md)
- [Headers](./docs/headers.md)
- [Deep Linking](./docs/deep-linking.md)
- [Themes](./docs/themes.md)
- [Hooks](./docs/hooks.md)
- [Navigation Container](./docs/navigation-container.md)
- [Navigation Actions](./docs/navigation-actions.md)
- [Navigation State](./docs/navigation-state.md)
- [Link Component](./docs/link.md)
- [Troubleshooting](./docs/troubleshooting.md)

## API Compatibility

Nextant is compatible with react-navigation's core API. If you're familiar with react-navigation, you'll feel right at home.

**Re-exported from @react-navigation/core:**

- `useRoute`, `useIsFocused`, `useFocusEffect`, `useTheme`, `usePreventRemove`
- `useNavigationState`, `useNavigationContainerRef`, `useNavigationBuilder`
- `ThemeProvider`, `NavigationContext`
- `getStateFromPath`, `getPathFromState`, `findFocusedRoute`

**Re-exported from @react-navigation/routers:**

- `CommonActions`, `StackActions`, `TabActions`, `DrawerActions`
- `StackRouter`, `TabRouter`, `DrawerRouter`

**Web-specific (Nextant):**

- `NavigationContainer` - Browser history integration
- `Link` - Anchor element with navigation
- `useLinking`, `useLinkTo`, `useLinkProps`, `useLinkBuilder`
- `useDocumentTitle`, `createMemoryHistory`
- `LightTheme`, `DarkTheme`, `DefaultTheme`

## Tailwind Setup

Include Nextant in your Tailwind config:

```js
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx}",
    "./node_modules/@isnan/nextant/src/**/*.{js,jsx}",
  ],
};
```

## Publishing

To release a new version:

```bash
# 1. Build
yarn build

# 2. Commit
git add .
git commit -m "Release vX.Y.Z"

# 3. Tag and push
git tag vX.Y.Z
git push origin main --tags
```

Consumers install with:

```bash
yarn add @isnan/nextant@github:Maev4l/nextant#vX.Y.Z
```

## License

MIT
