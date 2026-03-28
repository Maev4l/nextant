# Hello Nextant

This guide walks you through creating your first navigator.

## Creating a Stack Navigator

```jsx
import { NavigationContainer, createStackNavigator } from '@isnan/nextant';

const Stack = createStackNavigator();

const HomeScreen = () => {
  return (
    <div className="p-4">
      <h1>Home Screen</h1>
    </div>
  );
};

const DetailsScreen = () => {
  return (
    <div className="p-4">
      <h1>Details Screen</h1>
    </div>
  );
};

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

## Navigator Props

Props passed to `Stack.Navigator`:

```jsx
<Stack.Navigator
  initialRouteName="Home"
  screenOptions={{
    headerTitleAlign: 'center',
  }}
  screenListeners={{
    focus: () => console.log('Screen focused'),
  }}
>
```

## Screen Props

Props passed to `Stack.Screen`:

```jsx
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: 'Welcome',
    headerShown: true,
  }}
  initialParams={{ userId: 1 }}
/>
```

## Options vs screenOptions

- **screenOptions** - Default options for all screens in the navigator
- **options** - Options for a specific screen (overrides screenOptions)

```jsx
<Stack.Navigator
  screenOptions={{
    headerTintColor: '#007AFF',  // Applied to all screens
  }}
>
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{
      title: 'Home',  // Only for this screen
    }}
  />
</Stack.Navigator>
```

## Dynamic Options

Options can be a function that receives the route:

```jsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={({ route }) => ({
    title: route.params?.name ?? 'Profile',
  })}
/>
```

## Next Steps

- [Navigating](./navigating.md) - Navigate between screens
- [Passing Parameters](./params.md) - Pass data to screens
