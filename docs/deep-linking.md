# Deep Linking

Nextant integrates with browser URLs, allowing users to navigate directly to screens via links.

## Basic Setup

Configure linking in `NavigationContainer`:

```jsx
import { NavigationContainer } from '@isnan/nextant';

const linking = {
  prefixes: ['https://myapp.com', 'myapp://'],
  config: {
    screens: {
      Home: '',
      Profile: 'user/:id',
      Settings: 'settings',
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## URL Patterns

### Static Paths

```js
config: {
  screens: {
    Home: '',           // /
    About: 'about',     // /about
    Contact: 'contact', // /contact
  },
}
```

### URL Parameters

```js
config: {
  screens: {
    Profile: 'user/:id',        // /user/123
    Post: 'post/:postId',       // /post/456
  },
}
```

Access params in the screen:

```jsx
const ProfileScreen = () => {
  const route = useRoute();
  const { id } = route.params;

  return <div>User ID: {id}</div>;
};
```

### Query Parameters

Query params are automatically parsed:

```js
// URL: /search?query=hello&page=1
config: {
  screens: {
    Search: 'search',
  },
}

// In component:
const { query, page } = route.params;
```

### Nested Navigators

```js
config: {
  screens: {
    Main: {
      screens: {
        Home: '',
        Profile: 'profile/:id',
      },
    },
    Auth: {
      screens: {
        Login: 'login',
        Register: 'register',
      },
    },
  },
}
```

### Wildcard Routes

Catch-all routes:

```js
config: {
  screens: {
    NotFound: '*',
  },
}
```

## Linking Options

### prefixes

Array of URL prefixes to match:

```js
const linking = {
  prefixes: [
    'https://myapp.com',
    'https://www.myapp.com',
    'myapp://',
  ],
  config: { /* ... */ },
};
```

### enabled

Enable or disable deep linking:

```js
const linking = {
  enabled: true,  // default
  config: { /* ... */ },
};
```

### Custom Path Parsing

```js
const linking = {
  config: { /* ... */ },
  getStateFromPath: (path, config) => {
    // Custom parsing logic
    return getStateFromPath(path, config);
  },
  getPathFromState: (state, config) => {
    // Custom path generation
    return getPathFromState(state, config);
  },
};
```

## Document Title

Sync the browser tab title with the current screen:

```jsx
<NavigationContainer
  linking={linking}
  documentTitle={{
    enabled: true,
    formatter: (options, route) =>
      options?.title ?? route?.name ?? 'My App',
  }}
>
```

Or use the hook:

```jsx
import { useDocumentTitle } from '@isnan/nextant';

// Inside NavigationContainer
useDocumentTitle(navigationRef, {
  enabled: true,
  formatter: (options, route) => `${options?.title} | My App`,
});
```

## Programmatic Navigation

### useLinkTo

Navigate to a path programmatically:

```jsx
import { useLinkTo } from '@isnan/nextant';

const MyComponent = () => {
  const linkTo = useLinkTo();

  return (
    <button onClick={() => linkTo('/user/123')}>
      Go to User 123
    </button>
  );
};
```

With reset option:

```jsx
linkTo('/home', { reset: true });
```

### useLinkBuilder

Build URLs for screens:

```jsx
import { useLinkBuilder } from '@isnan/nextant';

const MyComponent = () => {
  const { buildHref } = useLinkBuilder();

  const profileUrl = buildHref('Profile', { id: '123' });
  // Returns: '/user/123'

  return <a href={profileUrl}>View Profile</a>;
};
```

## Link Component

Use the `Link` component for declarative navigation:

```jsx
import { Link } from '@isnan/nextant';

// Screen-based
<Link screen="Profile" params={{ id: '123' }}>
  View Profile
</Link>

// Href-based
<Link href="/user/123">
  View Profile
</Link>
```

## Browser History

Nextant automatically:

- Updates the URL when navigating
- Handles browser back/forward buttons
- Restores scroll position (via native browser behavior)
- Caches navigation state for history entries

## Initial State from URL

When the app loads, Nextant parses the current URL and initializes the navigation state accordingly. Show a loading state while this happens:

```jsx
<NavigationContainer
  linking={linking}
  fallback={<LoadingScreen />}
>
```

## Testing Deep Links

During development, test deep links by:

1. Navigating to a screen
2. Copying the URL from the address bar
3. Opening that URL in a new tab
4. Verifying the correct screen loads

## Troubleshooting

### Links Not Working

1. Ensure `linking` prop is passed to `NavigationContainer`
2. Check that screen names in config match your navigator
3. Verify the path pattern matches your URL structure

### Query Params Not Parsed

Query params are parsed automatically. Access them via `route.params`:

```jsx
// URL: /search?q=hello
const { q } = useRoute().params;
```

### Nested Navigator URLs

For nested navigators, include the full path:

```js
config: {
  screens: {
    Tabs: {
      path: '',
      screens: {
        Home: '',
        Settings: 'settings',
      },
    },
  },
}
```
