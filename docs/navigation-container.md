# NavigationContainer

The `NavigationContainer` is the root component that manages navigation state.

## Basic Usage

```jsx
import { NavigationContainer } from '@isnan/nextant';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## Props

### `theme`

Theme object for styling navigation components.

**Type:** `Theme`
**Default:** `LightTheme`

```jsx
import { DarkTheme } from '@isnan/nextant';

<NavigationContainer theme={DarkTheme}>
```

### `direction`

Text direction for RTL support.

**Type:** `'ltr' | 'rtl'`
**Default:** `'ltr'`

```jsx
<NavigationContainer direction="rtl">
```

### `linking`

Configuration for deep linking.

**Type:** `object`

```jsx
const linking = {
  prefixes: ['https://myapp.com'],
  config: {
    screens: {
      Home: '',
      Profile: 'user/:id',
    },
  },
};

<NavigationContainer linking={linking}>
```

Linking options:
- `enabled` - Enable/disable linking (default: `true`)
- `prefixes` - URL prefixes to match
- `config` - Screen to path mapping
- `getStateFromPath` - Custom path parser
- `getPathFromState` - Custom state to path converter
- `getActionFromState` - Custom action builder

### `fallback`

Component to show while initial state is being resolved from URL.

**Type:** `element`
**Default:** `null`

```jsx
<NavigationContainer
  linking={linking}
  fallback={<LoadingScreen />}
>
```

### `documentTitle`

Configuration for syncing document title.

**Type:** `object`

```jsx
<NavigationContainer
  documentTitle={{
    enabled: true,
    formatter: (options, route) =>
      `${options?.title ?? route?.name} - My App`,
  }}
>
```

### `initialState`

Initial navigation state. Useful for state persistence.

**Type:** `object`

```jsx
const [initialState, setInitialState] = useState();

// Load persisted state
useEffect(() => {
  const state = localStorage.getItem('nav-state');
  if (state) setInitialState(JSON.parse(state));
}, []);

<NavigationContainer initialState={initialState}>
```

### `onStateChange`

Callback when navigation state changes.

**Type:** `function`

```jsx
<NavigationContainer
  onStateChange={(state) => {
    // Persist state
    localStorage.setItem('nav-state', JSON.stringify(state));
  }}
>
```

## Ref Methods

Access navigation methods via ref:

```jsx
import { useRef } from 'react';
import { NavigationContainer } from '@isnan/nextant';

const App = () => {
  const navigationRef = useRef(null);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* ... */}
    </NavigationContainer>
  );
};
```

### `navigate(name, params)`

Navigate to a screen.

```jsx
navigationRef.current?.navigate('Profile', { id: '123' });
```

### `goBack()`

Go back to the previous screen.

```jsx
navigationRef.current?.goBack();
```

### `reset(state)`

Reset the navigation state.

```jsx
navigationRef.current?.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

### `resetRoot(state)`

Reset the root navigation state.

```jsx
navigationRef.current?.resetRoot({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

### `dispatch(action)`

Dispatch a navigation action.

```jsx
import { CommonActions } from '@isnan/nextant';

navigationRef.current?.dispatch(
  CommonActions.navigate('Profile', { id: '123' })
);
```

### `getRootState()`

Get the current navigation state.

```jsx
const state = navigationRef.current?.getRootState();
```

### `getCurrentRoute()`

Get the currently focused route.

```jsx
const route = navigationRef.current?.getCurrentRoute();
console.log(route?.name, route?.params);
```

### `isReady()`

Check if the navigation container is ready.

```jsx
if (navigationRef.current?.isReady()) {
  navigationRef.current.navigate('Home');
}
```

### `addListener(type, callback)`

Add an event listener.

```jsx
const unsubscribe = navigationRef.current?.addListener('state', (e) => {
  console.log('State changed:', e.data.state);
});

// Later: unsubscribe()
```

## useNavigationContainerRef

Hook to create and use a navigation ref:

```jsx
import { useNavigationContainerRef, NavigationContainer } from '@isnan/nextant';

const App = () => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      {/* ... */}
    </NavigationContainer>
  );
};
```

## LinkingContext

Access linking configuration from components:

```jsx
import { useLinkingContext } from '@isnan/nextant';

const MyComponent = () => {
  const linking = useLinkingContext();

  if (!linking?.options?.enabled) {
    return <div>Linking is disabled</div>;
  }

  return <div>Linking enabled with config...</div>;
};
```

## State Persistence

Persist navigation state across sessions:

```jsx
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'navigation-state';

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restore = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setInitialState(JSON.parse(saved));
        }
      } finally {
        setIsReady(true);
      }
    };

    restore();
  }, []);

  const onStateChange = useCallback((state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={onStateChange}
    >
      {/* ... */}
    </NavigationContainer>
  );
};
```

Note: When using deep linking, the URL takes precedence over persisted state.
