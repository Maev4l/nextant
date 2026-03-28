# Navigation State

Understanding how navigation state is structured and managed.

## State Structure

Navigation state is a JavaScript object with this structure:

```js
{
  type: 'stack',          // Router type
  key: 'stack-xyz123',    // Unique key
  index: 1,               // Index of focused route
  routeNames: ['Home', 'Profile', 'Settings'],
  routes: [
    { key: 'home-abc', name: 'Home', params: {} },
    { key: 'profile-def', name: 'Profile', params: { userId: '123' } },
  ],
  history: [/* for drawers/tabs */],
  stale: false,
}
```

### Key Properties

| Property | Description |
|----------|-------------|
| `type` | The router type (`stack`, `tab`, `drawer`) |
| `key` | Unique identifier for this navigator |
| `index` | Index of the currently focused route |
| `routeNames` | Array of available screen names |
| `routes` | Array of route objects |
| `history` | Navigation history (tabs/drawers only) |
| `stale` | Whether state needs rehydration |

### Route Object

```js
{
  key: 'profile-xyz123',   // Unique key for this route instance
  name: 'Profile',         // Screen name
  params: { userId: '123' }, // Route parameters
  path: '/user/123',       // URL path (if deep linking)
  state: { /* nested state */ },  // Nested navigator state
}
```

## Reading State

### useNavigationState

Get state or derived value with automatic updates:

```jsx
import { useNavigationState } from '@isnan/nextant';

const MyComponent = () => {
  // Get full state
  const state = useNavigationState(state => state);

  // Get specific value
  const index = useNavigationState(state => state.index);

  // Get route names
  const routes = useNavigationState(state => state.routes);

  return <div>Current index: {index}</div>;
};
```

### navigation.getState()

Get current state imperatively:

```jsx
const navigation = useNavigation();

const handlePress = () => {
  const state = navigation.getState();
  console.log('Routes:', state.routes);
  console.log('Index:', state.index);
};
```

### navigation.getRootState()

Get the root navigator's state:

```jsx
const rootState = navigation.getRootState();
```

### Focused Route

Get the currently focused route:

```jsx
import { findFocusedRoute } from '@isnan/nextant';

const focusedRoute = findFocusedRoute(state);
console.log(focusedRoute?.name, focusedRoute?.params);
```

## Nested State

For nested navigators, state contains nested state:

```js
{
  type: 'stack',
  routes: [
    {
      name: 'Main',
      state: {
        type: 'tab',
        index: 0,
        routes: [
          { name: 'Home' },
          { name: 'Settings' },
        ],
      },
    },
  ],
}
```

## State with History

Tab and drawer navigators track history:

```js
// Tab navigator state
{
  type: 'tab',
  index: 1,
  routes: [
    { name: 'Home' },
    { name: 'Profile' },
    { name: 'Settings' },
  ],
  history: [
    { type: 'route', key: 'home-abc' },
    { type: 'route', key: 'profile-def' },
  ],
}

// Drawer navigator state
{
  type: 'drawer',
  index: 0,
  routes: [{ name: 'Home' }],
  history: [
    { type: 'route', key: 'home-abc' },
    { type: 'drawer' },  // Drawer is open
  ],
}
```

## Modifying State

### Reset

Replace entire state:

```jsx
import { CommonActions } from '@isnan/nextant';

navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'Home' }],
  })
);
```

### setParams

Update current route params:

```jsx
navigation.setParams({ userId: '456' });
```

### State Persistence

Save and restore state:

```jsx
// Save
const state = navigationRef.current?.getRootState();
localStorage.setItem('nav-state', JSON.stringify(state));

// Restore
const saved = localStorage.getItem('nav-state');
const initialState = saved ? JSON.parse(saved) : undefined;

<NavigationContainer initialState={initialState}>
```

## State from Path

Convert URL to state:

```jsx
import { getStateFromPath } from '@isnan/nextant';

const config = {
  screens: {
    Home: '',
    Profile: 'user/:id',
  },
};

const state = getStateFromPath('/user/123', config);
// { routes: [{ name: 'Profile', params: { id: '123' } }] }
```

## Path from State

Convert state to URL:

```jsx
import { getPathFromState } from '@isnan/nextant';

const state = {
  routes: [
    { name: 'Profile', params: { id: '123' } },
  ],
};

const path = getPathFromState(state, config);
// '/user/123'
```

## Debugging State

Log state changes:

```jsx
<NavigationContainer
  onStateChange={(state) => {
    console.log('Navigation state:', JSON.stringify(state, null, 2));
  }}
>
```

In development, you can also access state via React DevTools by inspecting the NavigationContainer component.
