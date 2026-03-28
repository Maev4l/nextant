# Troubleshooting

Common issues and their solutions.

## Blank Screen on Initial Load

**Symptoms:** Screen appears blank or white on first load, then shows content.

**Cause:** CSS not loaded or lazy loading timing issue.

**Solutions:**

1. Ensure CSS is imported at the app entry point:
```jsx
// main.jsx or App.jsx
import '@isnan/nextant/styles.css';
```

2. Check that the NavigationContainer has height:
```jsx
<div style={{ height: '100vh' }}>
  <NavigationContainer>
    {/* ... */}
  </NavigationContainer>
</div>
```

3. For SSR/SSG, disable lazy loading initially:
```jsx
<Tab.Navigator lazy={false}>
```

## CSS Not Loading

**Symptoms:** Components appear unstyled or missing layout.

**Solutions:**

1. Import the CSS file:
```jsx
import '@isnan/nextant/styles.css';
```

2. Update Tailwind config to include Nextant:
```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,jsx}',
    './node_modules/@isnan/nextant/src/**/*.{js,jsx}',
  ],
};
```

3. Verify Tailwind is processing the files:
```bash
yarn dev
# Check for Tailwind classes in DevTools
```

## Navigation Not Working

**Symptoms:** Clicking links or calling navigate() does nothing.

**Solutions:**

1. Ensure screen is inside a navigator:
```jsx
const MyScreen = () => {
  const navigation = useNavigation(); // This throws if not in navigator
};
```

2. Check that NavigationContainer wraps your navigators:
```jsx
<NavigationContainer>
  <Stack.Navigator>
    {/* screens */}
  </Stack.Navigator>
</NavigationContainer>
```

3. Verify screen names match:
```jsx
// Defined
<Stack.Screen name="Details" component={DetailsScreen} />

// Navigate
navigation.navigate('Details'); // Must match exactly
```

## "Couldn't find a navigation object" Error

**Cause:** Using useNavigation outside of a navigator.

**Solution:** Ensure your component is rendered inside a Stack.Screen, Tab.Screen, or Drawer.Screen.

```jsx
// Wrong - outside navigator
const App = () => {
  const navigation = useNavigation(); // Error!
  return <NavigationContainer>...</NavigationContainer>;
};

// Correct - inside a screen
const HomeScreen = () => {
  const navigation = useNavigation(); // Works
  return <div>...</div>;
};
```

## Deep Links Not Working

**Symptoms:** URLs don't navigate to correct screens.

**Solutions:**

1. Ensure linking is configured:
```jsx
<NavigationContainer
  linking={{
    prefixes: ['https://myapp.com'],
    config: {
      screens: {
        Home: '',
        Profile: 'user/:id',
      },
    },
  }}
>
```

2. Check screen names match config:
```jsx
// Config
screens: {
  Profile: 'user/:id',  // Screen name = "Profile"
}

// Navigator
<Stack.Screen name="Profile" component={ProfileScreen} />
```

3. Verify the path pattern:
```js
// URL: /user/123
// Pattern: 'user/:id'
// Params: { id: '123' }
```

## Gestures Not Working

**Symptoms:** Swipe-to-go-back doesn't work in stack navigator.

**Solutions:**

1. Ensure gestures are enabled:
```jsx
<Stack.Screen
  options={{
    gestureEnabled: true,  // default
  }}
/>
```

2. Check there's a screen to go back to:
```jsx
// First screen can't swipe back
const canGoBack = navigation.canGoBack();
```

3. Verify touch events aren't blocked:
```jsx
// Remove any elements with pointer-events: none that overlay content
```

## Header Not Showing

**Symptoms:** Header is missing from screens.

**Solutions:**

1. For tab/drawer navigators, headers are hidden by default:
```jsx
<Tab.Screen
  options={{
    headerShown: true,  // Enable for tabs
  }}
/>
```

2. For stack navigator, check if explicitly hidden:
```jsx
<Stack.Screen
  options={{
    headerShown: false,  // This hides the header
  }}
/>
```

## Tab Bar Not Visible

**Symptoms:** Tab bar is hidden.

**Solutions:**

1. Check if tabBarStyle hides it:
```jsx
// This hides the tab bar
options={{
  tabBarStyle: { display: 'none' },
}}
```

2. Ensure tab navigator has height:
```jsx
<div style={{ height: '100%' }}>
  <Tab.Navigator>...</Tab.Navigator>
</div>
```

## Multiple NavigationContainers Warning

**Symptoms:** Console warning about multiple containers with linking.

**Cause:** Deep linking should only be handled in one place.

**Solution:** Only enable linking on one NavigationContainer:

```jsx
// Main app - linking enabled
<NavigationContainer linking={linking}>

// Modal or nested - linking disabled
<NavigationContainer linking={{ enabled: false }}>
```

## State Persistence Issues

**Symptoms:** Saved state doesn't restore correctly.

**Solutions:**

1. Handle invalid state gracefully:
```jsx
const [initialState, setInitialState] = useState();

useEffect(() => {
  try {
    const saved = localStorage.getItem('nav-state');
    if (saved) {
      const state = JSON.parse(saved);
      // Validate state before using
      if (state?.routes?.length) {
        setInitialState(state);
      }
    }
  } catch (e) {
    // Invalid state, start fresh
  }
}, []);
```

2. Clear persisted state when app version changes:
```jsx
const VERSION = '1.0.0';
const savedVersion = localStorage.getItem('app-version');

if (savedVersion !== VERSION) {
  localStorage.removeItem('nav-state');
  localStorage.setItem('app-version', VERSION);
}
```

## Performance Issues

**Symptoms:** Slow transitions or laggy animations.

**Solutions:**

1. Enable lazy loading:
```jsx
<Tab.Navigator lazy={true}>
<Drawer.Navigator lazy={true}>
```

2. Use simpler animations:
```jsx
<Stack.Screen options={{ animation: 'none' }} />
```

3. Reduce re-renders with proper memoization:
```jsx
const options = useMemo(() => ({
  title: 'My Screen',
}), []);

<Stack.Screen options={options} />
```

## Getting Help

If your issue isn't listed here:

1. Check the [react-navigation docs](https://reactnavigation.org/docs/getting-started) - Nextant uses the same core concepts
2. Search for similar issues in the repo
3. File an issue with:
   - Nextant version
   - Reproduction steps
   - Expected vs actual behavior
   - Code sample
