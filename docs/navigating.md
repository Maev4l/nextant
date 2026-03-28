# Navigating

Learn how to navigate between screens.

## useNavigation Hook

Access the navigation object from any component inside a navigator:

```jsx
import { useNavigation } from '@isnan/nextant';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <button onClick={() => navigation.navigate('Details')}>
      Go to Details
    </button>
  );
};
```

## Navigation Methods

### navigate

Navigate to a screen. If the screen is already in the stack, it will go back to it.

```jsx
navigation.navigate('Details');

// With params
navigation.navigate('Details', { itemId: 42 });
```

### push

Push a new screen onto the stack (even if it already exists):

```jsx
navigation.push('Details', { itemId: 42 });
```

### goBack

Go back to the previous screen:

```jsx
navigation.goBack();
```

### pop

Pop screens from the stack:

```jsx
navigation.pop();      // Pop one screen
navigation.pop(2);     // Pop two screens
```

### popTo

Pop to a specific screen:

```jsx
navigation.popTo('Home');
```

### popToTop

Pop to the first screen in the stack:

```jsx
navigation.popToTop();
```

### replace

Replace the current screen:

```jsx
navigation.replace('Profile', { userId: 1 });
```

### setParams

Update the params of the current screen:

```jsx
navigation.setParams({ itemId: 100 });
```

## Drawer Navigation Methods

For drawer navigators:

```jsx
navigation.openDrawer();
navigation.closeDrawer();
navigation.toggleDrawer();
```

## Tab Navigation

For tab navigators:

```jsx
navigation.jumpTo('Settings');
```

## Checking if Screen is Focused

```jsx
import { useIsFocused } from '@isnan/nextant';

const MyScreen = () => {
  const isFocused = useIsFocused();

  return <div>{isFocused ? 'Focused' : 'Not focused'}</div>;
};
```

## Next Steps

- [Passing Parameters](./params.md) - Pass data between screens
- [Navigation Actions](./navigation-actions.md) - Dispatch navigation actions
