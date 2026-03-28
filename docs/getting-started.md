# Getting Started

Nextant is a web-optimized navigation library for React. It provides the same developer experience as react-navigation but targets web/PWA instead of React Native.

## What is Nextant?

Nextant reuses `@react-navigation/core` and `@react-navigation/routers` while providing web-specific implementations for:

- **NavigationContainer** - Browser history integration
- **Link** - Anchor element with navigation behavior
- **Stack/Tab/Drawer Navigators** - Smooth CSS animations and touch gestures

## Installation

```bash
yarn add @isnan/nextant @react-navigation/core @react-navigation/routers
```

## Peer Dependencies

Nextant requires the following peer dependencies:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `tailwindcss` >= 3.0.0

## Import CSS

Add the CSS import to your app entry point:

```jsx
import '@isnan/nextant/styles.css';
```

## Basic Setup

Wrap your app with `NavigationContainer`:

```jsx
import { NavigationContainer } from '@isnan/nextant';

const App = () => {
  return (
    <NavigationContainer>
      {/* Your navigators go here */}
    </NavigationContainer>
  );
};

export default App;
```

## Tailwind Configuration

Ensure your `tailwind.config.js` includes the nextant source files:

```js
export default {
  content: [
    './src/**/*.{js,jsx}',
    './node_modules/@isnan/nextant/src/**/*.{js,jsx}',
  ],
  // ...
};
```

## Next Steps

- [Hello Nextant](./hello-nextant.md) - Create your first navigator
- [Navigating](./navigating.md) - Learn navigation basics
- [Deep Linking](./deep-linking.md) - URL integration
