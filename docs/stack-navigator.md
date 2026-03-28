# Stack Navigator

A navigator that provides transitions between screens where each new screen is placed on top of a stack.

## Installation

```bash
yarn add @isnan/nextant
```

## Usage

```jsx
import { NavigationContainer, createStackNavigator } from '@isnan/nextant';

const Stack = createStackNavigator();

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

## Props

### `initialRouteName`

The name of the route to render on first load.

**Type:** `string`

### `screenOptions`

Default options for all screens in the navigator.

**Type:** `object | function`

### `screenListeners`

Event listeners for all screens.

**Type:** `object`

```jsx
<Stack.Navigator
  screenListeners={{
    focus: (e) => console.log('Focused:', e.target),
    blur: (e) => console.log('Blurred:', e.target),
  }}
>
```

## Options

Options can be passed to each screen or as `screenOptions` on the navigator.

### Basic Options

#### `title`

Title text shown in the header.

**Type:** `string`

```jsx
<Stack.Screen options={{ title: 'My Screen' }} />
```

#### `animation`

Animation type for screen transitions.

**Type:** `'slide' | 'fade' | 'none'`
**Default:** `'slide'`

```jsx
<Stack.Screen options={{ animation: 'fade' }} />
```

### Header Options

#### `headerShown`

Whether to show the header.

**Type:** `boolean`
**Default:** `true`

```jsx
<Stack.Screen options={{ headerShown: false }} />
```

#### `headerTitle`

Custom title for the header. Can be a string or function.

**Type:** `string | function`

```jsx
// String
<Stack.Screen options={{ headerTitle: 'Custom Title' }} />

// Function
<Stack.Screen
  options={{
    headerTitle: ({ children, tintColor }) => (
      <span style={{ color: tintColor }}>{children}</span>
    ),
  }}
/>
```

#### `headerTitleAlign`

Alignment of the header title.

**Type:** `'left' | 'center'`
**Default:** `'center'`

```jsx
<Stack.Screen options={{ headerTitleAlign: 'left' }} />
```

#### `headerLeft`

Element to display on the left side of the header.

**Type:** `function | element`

```jsx
<Stack.Screen
  options={{
    headerLeft: ({ canGoBack, onPress, tintColor }) => (
      <button onClick={onPress} style={{ color: tintColor }}>
        {canGoBack ? 'Back' : 'Menu'}
      </button>
    ),
  }}
/>
```

#### `headerRight`

Element to display on the right side of the header.

**Type:** `function | element`

```jsx
<Stack.Screen
  options={{
    headerRight: ({ tintColor }) => (
      <button style={{ color: tintColor }}>Save</button>
    ),
  }}
/>
```

#### `headerBackIcon`

Custom icon component for the back button.

**Type:** `component`

```jsx
import { ArrowLeft } from 'lucide-react';

<Stack.Screen options={{ headerBackIcon: ArrowLeft }} />
```

#### `headerBackTitle`

Text shown next to the back icon.

**Type:** `string`

```jsx
<Stack.Screen options={{ headerBackTitle: 'Back' }} />
```

#### `headerBackTitleStyle`

Style object for the back title text.

**Type:** `object`

```jsx
<Stack.Screen
  options={{
    headerBackTitleStyle: { fontSize: 14 },
  }}
/>
```

#### `headerBackVisible`

Whether to show the back button alongside a custom `headerLeft`.

**Type:** `boolean`
**Default:** `false`

```jsx
<Stack.Screen
  options={{
    headerLeft: () => <MenuButton />,
    headerBackVisible: true,  // Shows both back button and MenuButton
  }}
/>
```

#### `headerTintColor`

Tint color for header elements (back icon, title, etc.).

**Type:** `string`

```jsx
<Stack.Screen options={{ headerTintColor: '#007AFF' }} />
```

#### `headerStyle`

Style object for the header container.

**Type:** `object`

```jsx
<Stack.Screen
  options={{
    headerStyle: { backgroundColor: '#f4511e' },
  }}
/>
```

#### `headerTitleStyle`

Style object for the header title.

**Type:** `object`

```jsx
<Stack.Screen
  options={{
    headerTitleStyle: { fontWeight: 'bold' },
  }}
/>
```

#### `headerShadowVisible`

Whether to show the header border/shadow.

**Type:** `boolean`
**Default:** `true`

```jsx
<Stack.Screen options={{ headerShadowVisible: false }} />
```

#### `headerTransparent`

Makes the header transparent and positions it absolutely.

**Type:** `boolean`
**Default:** `false`

```jsx
<Stack.Screen options={{ headerTransparent: true }} />
```

#### `headerBackground`

Custom background element for the header.

**Type:** `function | element`

```jsx
<Stack.Screen
  options={{
    headerBackground: () => (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
    ),
  }}
/>
```

#### `header`

Completely custom header component.

**Type:** `function`

```jsx
<Stack.Screen
  options={{
    header: ({ navigation, route, options, back }) => (
      <MyCustomHeader
        title={options.title}
        canGoBack={!!back}
        onBack={() => navigation.goBack()}
      />
    ),
  }}
/>
```

### Gesture Options

#### `gestureEnabled`

Whether swipe-to-go-back gesture is enabled.

**Type:** `boolean`
**Default:** `true`

```jsx
<Stack.Screen options={{ gestureEnabled: false }} />
```

## Events

### `focus`

Emitted when the screen comes into focus.

```jsx
<Stack.Screen
  listeners={{
    focus: (e) => console.log('Screen focused'),
  }}
/>
```

### `blur`

Emitted when the screen goes out of focus.

### `beforeRemove`

Emitted when the screen is about to be removed. Can be used to prevent navigation.

```jsx
import { usePreventRemove } from '@isnan/nextant';

const EditScreen = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    // Show confirmation dialog
  });
};
```

## Helpers

Stack navigator adds these methods to `navigation`:

### `push(name, params)`

Push a new screen onto the stack.

```jsx
navigation.push('Details', { itemId: 42 });
```

### `pop(count)`

Pop screens from the stack.

```jsx
navigation.pop();     // Pop one
navigation.pop(2);    // Pop two
```

### `popTo(name)`

Pop to a specific screen in the stack.

```jsx
navigation.popTo('Home');
```

### `popToTop()`

Pop to the first screen in the stack.

```jsx
navigation.popToTop();
```

### `replace(name, params)`

Replace the current screen.

```jsx
navigation.replace('Profile', { userId: 1 });
```
