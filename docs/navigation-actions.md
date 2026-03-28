# Navigation Actions

Actions are objects that describe navigation operations. They can be dispatched to the navigation container.

## CommonActions

General navigation actions available in all navigators.

```jsx
import { CommonActions } from '@isnan/nextant';
```

### navigate

Navigate to a screen.

```jsx
navigation.dispatch(
  CommonActions.navigate('Profile', { userId: '123' })
);

// Or with full options
navigation.dispatch(
  CommonActions.navigate({
    name: 'Profile',
    params: { userId: '123' },
  })
);
```

### reset

Reset the navigation state.

```jsx
navigation.dispatch(
  CommonActions.reset({
    index: 1,
    routes: [
      { name: 'Home' },
      { name: 'Profile', params: { userId: '123' } },
    ],
  })
);
```

### goBack

Go back to the previous screen.

```jsx
navigation.dispatch(CommonActions.goBack());
```

### setParams

Update params of the current route.

```jsx
navigation.dispatch(
  CommonActions.setParams({ userId: '456' })
);
```

## StackActions

Actions specific to stack navigators.

```jsx
import { StackActions } from '@isnan/nextant';
```

### push

Push a new screen onto the stack.

```jsx
navigation.dispatch(
  StackActions.push('Details', { itemId: 42 })
);
```

### pop

Pop one or more screens from the stack.

```jsx
navigation.dispatch(StackActions.pop());      // Pop one
navigation.dispatch(StackActions.pop(2));     // Pop two
```

### popTo

Pop to a specific screen in the stack.

```jsx
navigation.dispatch(StackActions.popTo('Home'));

// With params
navigation.dispatch(
  StackActions.popTo('Home', { refresh: true })
);
```

### popToTop

Pop to the first screen in the stack.

```jsx
navigation.dispatch(StackActions.popToTop());
```

### replace

Replace the current screen.

```jsx
navigation.dispatch(
  StackActions.replace('Profile', { userId: '123' })
);
```

## TabActions

Actions specific to tab navigators.

```jsx
import { TabActions } from '@isnan/nextant';
```

### jumpTo

Jump to a specific tab.

```jsx
navigation.dispatch(
  TabActions.jumpTo('Settings', { section: 'account' })
);
```

## DrawerActions

Actions specific to drawer navigators.

```jsx
import { DrawerActions } from '@isnan/nextant';
```

### openDrawer

Open the drawer.

```jsx
navigation.dispatch(DrawerActions.openDrawer());
```

### closeDrawer

Close the drawer.

```jsx
navigation.dispatch(DrawerActions.closeDrawer());
```

### toggleDrawer

Toggle the drawer open/closed.

```jsx
navigation.dispatch(DrawerActions.toggleDrawer());
```

### jumpTo

Jump to a screen in the drawer.

```jsx
navigation.dispatch(
  DrawerActions.jumpTo('Settings')
);
```

## Dispatching Actions

### From Screen Components

```jsx
import { useNavigation, CommonActions } from '@isnan/nextant';

const MyScreen = () => {
  const navigation = useNavigation();

  const handleReset = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  return <button onClick={handleReset}>Reset</button>;
};
```

### From Outside Components

Using a ref:

```jsx
import { useRef } from 'react';
import { NavigationContainer, CommonActions } from '@isnan/nextant';

const navigationRef = useRef(null);

// Navigate from anywhere
export const navigate = (name, params) => {
  navigationRef.current?.dispatch(
    CommonActions.navigate(name, params)
  );
};

const App = () => (
  <NavigationContainer ref={navigationRef}>
    {/* ... */}
  </NavigationContainer>
);
```

### Targeting Specific Navigators

Target a parent navigator:

```jsx
navigation.getParent()?.dispatch(
  TabActions.jumpTo('Settings')
);
```

Target a specific navigator by key:

```jsx
navigation.getParent('TabNav')?.dispatch(
  TabActions.jumpTo('Home')
);
```

## Custom Actions

Create custom action types:

```jsx
const MyActions = {
  refresh: () => ({
    type: 'REFRESH',
  }),
};

// Handle in a custom router or navigator
```

## Action Interception

Intercept actions before they're handled:

```jsx
<Stack.Screen
  name="Home"
  component={HomeScreen}
  listeners={{
    beforeRemove: (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // Show confirmation
      }
    },
  }}
/>
```

## Action Validation

Check if an action is valid before dispatching:

```jsx
const state = navigation.getState();
const routes = state.routes;
const canGoBack = routes.length > 1;

if (canGoBack) {
  navigation.dispatch(CommonActions.goBack());
}
```
