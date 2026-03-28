# Drawer Navigator

A navigator that renders a side drawer which can be opened and closed via gestures or programmatically.

## Installation

```bash
yarn add @isnan/nextant
```

## Usage

```jsx
import { NavigationContainer, createDrawerNavigator } from '@isnan/nextant';
import { Home, Settings } from 'lucide-react';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: '#007AFF',
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Drawer.Navigator>
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

### `drawerContent`

Custom drawer content component.

**Type:** `function`

```jsx
<Drawer.Navigator
  drawerContent={(props) => <MyDrawerContent {...props} />}
>
```

### `drawerPosition`

Position of the drawer.

**Type:** `'left' | 'right'`
**Default:** `'left'`

### `drawerType`

Type of drawer animation.

**Type:** `'front' | 'back' | 'slide' | 'permanent'`
**Default:** `'front'`

- `front` - Drawer slides in from the side, overlaying the content
- `back` - Content slides to reveal the drawer behind
- `slide` - Both drawer and content slide together
- `permanent` - Drawer is always visible (desktop layout)

```jsx
<Drawer.Navigator drawerType="slide">
```

### `drawerStyle`

Style object for the drawer panel.

**Type:** `object`

```jsx
<Drawer.Navigator
  drawerStyle={{
    width: 300,
    backgroundColor: '#f5f5f5',
  }}
>
```

### `overlayStyle`

Style object for the overlay.

**Type:** `object`

```jsx
<Drawer.Navigator
  overlayStyle={{
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }}
>
```

### `overlayAccessibilityLabel`

Accessibility label for the overlay.

**Type:** `string`
**Default:** `'Close drawer'`

### `sceneStyle`

Style object for the main content area.

**Type:** `object`

### `lazy`

Whether to lazily render screens.

**Type:** `boolean`
**Default:** `true`

### `gestureEnabled`

Whether swipe gestures are enabled.

**Type:** `boolean`
**Default:** `true`

### `screenOptions`

Default options for all screens.

**Type:** `object | function`

### `screenListeners`

Event listeners for all screens.

**Type:** `object`

## Options

### Drawer Item Options

#### `drawerLabel`

Label for the drawer item.

**Type:** `string | function`

```jsx
<Drawer.Screen
  options={{
    drawerLabel: 'Home',
  }}
/>
```

#### `drawerIcon`

Icon for the drawer item.

**Type:** `function`

```jsx
<Drawer.Screen
  options={{
    drawerIcon: ({ focused, color, size }) => (
      <Home color={color} size={size} />
    ),
  }}
/>
```

### Drawer Styling Options

#### `drawerActiveTintColor`

Color for active drawer item.

**Type:** `string`

```jsx
<Drawer.Screen options={{ drawerActiveTintColor: '#007AFF' }} />
```

#### `drawerInactiveTintColor`

Color for inactive drawer items.

**Type:** `string`

#### `drawerActiveBackgroundColor`

Background color for active drawer item.

**Type:** `string`

#### `drawerInactiveBackgroundColor`

Background color for inactive drawer items.

**Type:** `string`

#### `drawerLabelStyle`

Style object for drawer labels.

**Type:** `object`

```jsx
<Drawer.Screen
  options={{
    drawerLabelStyle: { fontSize: 16, fontWeight: '500' },
  }}
/>
```

#### `drawerItemStyle`

Style object for individual drawer items.

**Type:** `object`

#### `drawerContentStyle`

Style object for the drawer content container.

**Type:** `object`

#### `drawerContentContainerStyle`

Style object for the inner content container.

**Type:** `object`

### Header Options

Drawer navigator supports the same header options as Stack navigator:

- `headerShown` (default: `true`)
- `headerTitle`
- `headerTitleAlign`
- `headerLeft` (defaults to hamburger menu)
- `headerRight`
- `headerTintColor`
- `headerStyle`
- `headerTitleStyle`
- `headerShadowVisible`
- `headerTransparent`
- `headerBackground`
- `header`

```jsx
<Drawer.Screen
  options={{
    title: 'Dashboard',
    headerRight: () => <NotificationButton />,
  }}
/>
```

## Events

### `drawerOpen`

Emitted when the drawer is opened.

### `drawerClose`

Emitted when the drawer is closed.

### `transitionStart`

Emitted when a transition animation starts.

```jsx
<Drawer.Screen
  listeners={{
    transitionStart: (e) => {
      console.log('Transition started, closing:', e.data.closing);
    },
  }}
/>
```

### `transitionEnd`

Emitted when a transition animation ends.

### `focus`

Emitted when the screen comes into focus.

### `blur`

Emitted when the screen goes out of focus.

## Helpers

Drawer navigator adds these methods to `navigation`:

### `openDrawer()`

Open the drawer.

```jsx
navigation.openDrawer();
```

### `closeDrawer()`

Close the drawer.

```jsx
navigation.closeDrawer();
```

### `toggleDrawer()`

Toggle the drawer open/closed.

```jsx
navigation.toggleDrawer();
```

### `jumpTo(name, params)`

Navigate to a specific screen in the drawer.

```jsx
navigation.jumpTo('Settings');
```

## Custom Drawer Content

Create a custom drawer with your own layout:

```jsx
import { DrawerContent, DrawerItem } from '@isnan/nextant';

const CustomDrawer = (props) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">My App</h2>
      </div>

      {/* Default drawer items */}
      <DrawerContent {...props} />

      {/* Footer */}
      <div className="mt-auto p-4 border-t">
        <button onClick={() => console.log('Logout')}>
          Logout
        </button>
      </div>
    </div>
  );
};

// Usage
<Drawer.Navigator drawerContent={CustomDrawer}>
```
