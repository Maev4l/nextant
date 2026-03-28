# Hooks

Nextant provides hooks for accessing navigation functionality.

## useNavigation

Access the navigation object.

```jsx
import { useNavigation } from '@isnan/nextant';

const MyScreen = () => {
  const navigation = useNavigation();

  return (
    <button onClick={() => navigation.navigate('Details')}>
      Go to Details
    </button>
  );
};
```

### Navigation Methods

- `navigate(name, params)` - Navigate to a screen
- `goBack()` - Go back
- `push(name, params)` - Push onto stack
- `pop(count)` - Pop from stack
- `popTo(name)` - Pop to a screen
- `popToTop()` - Pop to first screen
- `replace(name, params)` - Replace current screen
- `setParams(params)` - Update current params
- `setOptions(options)` - Update screen options
- `getState()` - Get navigator state
- `getParent()` - Get parent navigator
- `dispatch(action)` - Dispatch an action

## useRoute

Access the current route.

```jsx
import { useRoute } from '@isnan/nextant';

const ProfileScreen = () => {
  const route = useRoute();

  return (
    <div>
      <h1>Profile: {route.params?.userId}</h1>
      <p>Route name: {route.name}</p>
    </div>
  );
};
```

### Route Properties

- `key` - Unique key for this route instance
- `name` - Screen name
- `params` - Route parameters
- `path` - URL path (if deep linking enabled)

## useIsFocused

Check if the screen is focused.

```jsx
import { useIsFocused } from '@isnan/nextant';

const MyScreen = () => {
  const isFocused = useIsFocused();

  return (
    <div>
      {isFocused ? 'Screen is focused' : 'Screen is not focused'}
    </div>
  );
};
```

Use for conditional rendering or effects:

```jsx
const VideoPlayer = () => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isFocused]);

  return <video ref={videoRef} src={videoUrl} />;
};
```

## useFocusEffect

Run an effect when the screen is focused.

```jsx
import { useFocusEffect } from '@isnan/nextant';
import { useCallback } from 'react';

const MyScreen = () => {
  useFocusEffect(
    useCallback(() => {
      // Runs when screen is focused
      console.log('Screen focused');
      fetchData();

      return () => {
        // Cleanup when screen loses focus
        console.log('Screen blurred');
      };
    }, [])
  );

  return <div>...</div>;
};
```

Note: The callback must be wrapped in `useCallback` to avoid running on every render.

## useTheme

Access the current theme.

```jsx
import { useTheme } from '@isnan/nextant';

const MyComponent = () => {
  const { dark, colors } = useTheme();

  return (
    <div style={{
      backgroundColor: colors.card,
      color: colors.text,
      borderColor: colors.border,
    }}>
      {dark ? 'Dark mode' : 'Light mode'}
    </div>
  );
};
```

### Theme Colors

- `primary` - Primary brand color
- `background` - Screen background
- `card` - Card/header background
- `text` - Primary text color
- `border` - Border color
- `notification` - Badge/notification color

## useLinkTo

Navigate to a path programmatically.

```jsx
import { useLinkTo } from '@isnan/nextant';

const MyComponent = () => {
  const linkTo = useLinkTo();

  const goToProfile = () => {
    linkTo('/user/123');
  };

  // With reset
  const goHome = () => {
    linkTo('/', { reset: true });
  };

  return (
    <div>
      <button onClick={goToProfile}>Profile</button>
      <button onClick={goHome}>Home</button>
    </div>
  );
};
```

Requires linking to be enabled in NavigationContainer.

## useLinkProps

Get props for creating a link element.

```jsx
import { useLinkProps } from '@isnan/nextant';

const CustomLink = ({ screen, params, children }) => {
  const { href, onPress, accessibilityRole } = useLinkProps({
    screen,
    params,
  });

  return (
    <a href={href} onClick={onPress} role={accessibilityRole}>
      {children}
    </a>
  );
};
```

### Props Options

- `screen` - Screen name to navigate to
- `params` - Route parameters
- `action` - Custom navigation action
- `href` - Direct URL path

### Return Value

- `href` - URL for the link
- `onPress` - Click handler
- `accessibilityRole` - Accessibility role

## useLinkBuilder

Build URLs for screens.

```jsx
import { useLinkBuilder } from '@isnan/nextant';

const MyComponent = () => {
  const { buildHref, buildAction } = useLinkBuilder();

  // Build a URL
  const profileUrl = buildHref('Profile', { id: '123' });
  // Returns: '/user/123'

  // Build a navigation action from URL
  const action = buildAction('/user/123');

  return (
    <div>
      <a href={profileUrl}>Profile Link</a>
    </div>
  );
};
```

## useNavigationState

Subscribe to navigation state changes.

```jsx
import { useNavigationState } from '@isnan/nextant';

const MyComponent = () => {
  // Get specific value with selector
  const index = useNavigationState(state => state.index);
  const routeCount = useNavigationState(state => state.routes.length);

  // Get focused route name
  const currentScreen = useNavigationState(
    state => state.routes[state.index]?.name
  );

  return (
    <div>
      <p>Current screen: {currentScreen}</p>
      <p>Stack depth: {routeCount}</p>
    </div>
  );
};
```

The selector prevents unnecessary re-renders when unrelated state changes.

## usePreventRemove

Prevent the screen from being removed (e.g., for unsaved changes).

```jsx
import { usePreventRemove } from '@isnan/nextant';
import { useState } from 'react';

const EditScreen = () => {
  const [hasChanges, setHasChanges] = useState(false);

  usePreventRemove(hasChanges, ({ data }) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'You have unsaved changes. Discard them?'
    );

    if (confirmed) {
      // Proceed with navigation
      data.action && navigation.dispatch(data.action);
    }
  });

  return (
    <textarea
      onChange={(e) => setHasChanges(e.target.value.length > 0)}
    />
  );
};
```

## useNavigationContainerRef

Create a ref for the NavigationContainer.

```jsx
import { useNavigationContainerRef, NavigationContainer } from '@isnan/nextant';

const App = () => {
  const navigationRef = useNavigationContainerRef();

  const navigateFromOutside = () => {
    navigationRef.current?.navigate('Profile', { id: '123' });
  };

  return (
    <NavigationContainer ref={navigationRef}>
      {/* ... */}
    </NavigationContainer>
  );
};
```

## useLinkingContext

Access the linking configuration.

```jsx
import { useLinkingContext } from '@isnan/nextant';

const MyComponent = () => {
  const linking = useLinkingContext();

  if (!linking?.options?.enabled) {
    return null;
  }

  const { getStateFromPath, getPathFromState, config } = linking.options;

  return <div>Linking is enabled</div>;
};
```
