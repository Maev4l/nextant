# Tab Navigator

A navigator that renders a tab bar for switching between screens.

## Installation

```bash
yarn add @isnan/nextant
```

## Usage

```jsx
import { NavigationContainer, createTabNavigator } from '@isnan/nextant';
import { Home, Settings } from 'lucide-react';

const Tab = createTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
```

## Props

### `initialRouteName`

The name of the route to render on first load.

**Type:** `string`

### `backBehavior`

Behavior when back button is pressed.

**Type:** `'firstRoute' | 'initialRoute' | 'order' | 'history' | 'none'`
**Default:** `'firstRoute'`

### `tabBar`

Custom tab bar component.

**Type:** `function`

```jsx
<Tab.Navigator
  tabBar={(props) => <MyTabBar {...props} />}
>
```

### `tabBarPosition`

Position of the tab bar.

**Type:** `'bottom' | 'top'`
**Default:** `'bottom'`

```jsx
<Tab.Navigator tabBarPosition="top">
```

### `lazy`

Whether to lazily render screens as they come into focus.

**Type:** `boolean`
**Default:** `true`

### `animation`

Animation type when switching tabs.

**Type:** `'none' | 'fade' | 'shift'`
**Default:** `'none'`

```jsx
<Tab.Navigator animation="fade">
```

### `sceneContainerStyle`

Style object for the screen container.

**Type:** `object`

### `screenOptions`

Default options for all screens.

**Type:** `object | function`

### `screenListeners`

Event listeners for all screens.

**Type:** `object`

## Options

### Tab Bar Item Options

#### `tabBarLabel`

Label text for the tab.

**Type:** `string | function`

```jsx
<Tab.Screen
  options={{
    tabBarLabel: 'Home',
  }}
/>
```

#### `tabBarIcon`

Icon for the tab.

**Type:** `function`

```jsx
<Tab.Screen
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <Home color={color} size={size} />
    ),
  }}
/>
```

#### `tabBarBadge`

Badge content to show on the tab.

**Type:** `string | number`

```jsx
<Tab.Screen options={{ tabBarBadge: 3 }} />
```

#### `tabBarBadgeStyle`

Style for the badge.

**Type:** `object`

```jsx
<Tab.Screen
  options={{
    tabBarBadge: '!',
    tabBarBadgeStyle: { backgroundColor: 'red' },
  }}
/>
```

#### `tabBarButton`

Custom button component for the tab.

**Type:** `function`

```jsx
<Tab.Screen
  options={{
    tabBarButton: (props) => <MyTabButton {...props} />,
  }}
/>
```

#### `tabBarAccessibilityLabel`

Accessibility label for the tab.

**Type:** `string`

### Tab Bar Styling Options

#### `tabBarActiveTintColor`

Color for active tab icon and label.

**Type:** `string`

```jsx
<Tab.Screen options={{ tabBarActiveTintColor: '#007AFF' }} />
```

#### `tabBarInactiveTintColor`

Color for inactive tab icons and labels.

**Type:** `string`

#### `tabBarActiveBackgroundColor`

Background color for active tab.

**Type:** `string`

#### `tabBarInactiveBackgroundColor`

Background color for inactive tabs.

**Type:** `string`

#### `tabBarLabelStyle`

Style object for tab labels.

**Type:** `object`

```jsx
<Tab.Screen
  options={{
    tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
  }}
/>
```

#### `tabBarIconStyle`

Style object for tab icons.

**Type:** `object`

#### `tabBarItemStyle`

Style object for individual tab items.

**Type:** `object`

#### `tabBarShowLabel`

Whether to show tab labels.

**Type:** `boolean`
**Default:** `true`

```jsx
<Tab.Screen options={{ tabBarShowLabel: false }} />
```

#### `tabBarLabelPosition`

Position of the label relative to the icon.

**Type:** `'below-icon' | 'beside-icon'`
**Default:** `'below-icon'`

#### `tabBarStyle`

Style object for the tab bar container.

**Type:** `object`

```jsx
<Tab.Screen
  options={{
    tabBarStyle: { backgroundColor: '#fff', height: 60 },
  }}
/>
```

To hide the tab bar:

```jsx
<Tab.Screen
  options={{
    tabBarStyle: { display: 'none' },
  }}
/>
```

### Header Options

Tab navigator supports the same header options as Stack navigator:

- `headerShown` (default: `false` for tabs)
- `headerTitle`
- `headerTitleAlign`
- `headerLeft`
- `headerRight`
- `headerTintColor`
- `headerStyle`
- `headerTitleStyle`
- `headerShadowVisible`
- `headerTransparent`
- `headerBackground`
- `header`

```jsx
<Tab.Screen
  options={{
    headerShown: true,
    title: 'Home',
    headerRight: () => <SettingsButton />,
  }}
/>
```

## Events

### `tabPress`

Emitted when a tab is pressed.

```jsx
<Tab.Screen
  listeners={{
    tabPress: (e) => {
      // Prevent default behavior
      e.preventDefault();
    },
  }}
/>
```

### `tabLongPress`

Emitted when a tab is long-pressed.

### `focus`

Emitted when the tab comes into focus.

### `blur`

Emitted when the tab goes out of focus.

## Helpers

### `jumpTo(name, params)`

Jump to a specific tab.

```jsx
navigation.jumpTo('Settings', { section: 'profile' });
```
