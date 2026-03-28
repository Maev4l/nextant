# Headers

Headers appear at the top of screens and can be configured via screen options.

## Setting the Title

The simplest way to set a header title:

```jsx
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{ title: 'Welcome' }}
/>
```

Or dynamically based on route params:

```jsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={({ route }) => ({
    title: route.params?.name ?? 'Profile',
  })}
/>
```

## Custom Header Title

Use `headerTitle` for more control:

```jsx
<Stack.Screen
  options={{
    headerTitle: ({ children, tintColor }) => (
      <div className="flex items-center gap-2">
        <Logo />
        <span style={{ color: tintColor }}>{children}</span>
      </div>
    ),
  }}
/>
```

## Header Buttons

### Left Button

```jsx
<Stack.Screen
  options={{
    headerLeft: ({ canGoBack, onPress, tintColor }) => (
      canGoBack ? (
        <button onClick={onPress} style={{ color: tintColor }}>
          Back
        </button>
      ) : (
        <button onClick={() => navigation.openDrawer()}>
          Menu
        </button>
      )
    ),
  }}
/>
```

### Right Button

```jsx
<Stack.Screen
  options={{
    headerRight: ({ tintColor }) => (
      <button
        onClick={() => alert('Save')}
        style={{ color: tintColor }}
      >
        Save
      </button>
    ),
  }}
/>
```

## Back Button Customization

### Custom Back Icon

```jsx
import { ArrowLeft } from 'lucide-react';

<Stack.Screen
  options={{
    headerBackIcon: ArrowLeft,
  }}
/>
```

### Back Title

```jsx
<Stack.Screen
  options={{
    headerBackTitle: 'Back',
    headerBackTitleStyle: { fontSize: 14 },
  }}
/>
```

### Show Both Back and Custom Left

```jsx
<Stack.Screen
  options={{
    headerLeft: () => <MenuButton />,
    headerBackVisible: true,  // Shows default back button alongside
  }}
/>
```

## Header Styling

### Background Color

```jsx
<Stack.Screen
  options={{
    headerStyle: {
      backgroundColor: '#6200ee',
    },
  }}
/>
```

### Title Styling

```jsx
<Stack.Screen
  options={{
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
  }}
/>
```

### Title Alignment

```jsx
<Stack.Screen
  options={{
    headerTitleAlign: 'left',  // or 'center'
  }}
/>
```

### Tint Color

Set color for header elements (back icon, title):

```jsx
<Stack.Screen
  options={{
    headerTintColor: '#fff',
  }}
/>
```

### Hide Header Border

```jsx
<Stack.Screen
  options={{
    headerShadowVisible: false,
  }}
/>
```

## Transparent Headers

Make the header transparent and overlay the content:

```jsx
<Stack.Screen
  options={{
    headerTransparent: true,
    headerStyle: {
      backgroundColor: 'transparent',
    },
  }}
/>
```

Content will automatically add padding when `headerTransparent` is true.

## Custom Header Background

Add a gradient or image background:

```jsx
<Stack.Screen
  options={{
    headerBackground: () => (
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />
    ),
  }}
/>
```

## Completely Custom Header

Replace the entire header:

```jsx
<Stack.Screen
  options={{
    header: ({ navigation, route, options, back }) => (
      <header className="flex items-center h-14 px-4 bg-white border-b">
        {back && (
          <button onClick={() => navigation.goBack()}>
            Back
          </button>
        )}
        <h1 className="flex-1 text-center font-semibold">
          {options.title ?? route.name}
        </h1>
        <div className="w-10" />
      </header>
    ),
  }}
/>
```

The `header` function receives:
- `navigation` - Navigation object
- `route` - Current route
- `options` - Screen options
- `back` - Object with `title` if can go back, otherwise undefined

## Hiding the Header

```jsx
<Stack.Screen
  options={{
    headerShown: false,
  }}
/>
```

Or for all screens:

```jsx
<Stack.Navigator
  screenOptions={{
    headerShown: false,
  }}
>
```

## Dynamic Header Options

Update header options from within a screen:

```jsx
import { useNavigation } from '@isnan/nextant';
import { useEffect } from 'react';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.userName,
      headerRight: () => (
        <button onClick={() => alert('Edit')}>Edit</button>
      ),
    });
  }, [navigation, route.params?.userName]);

  return <div>...</div>;
};
```

## Safe Area Handling

Headers automatically include safe area padding for phone notches:

```css
.nextant-header {
  padding-top: max(0.5rem, env(safe-area-inset-top));
}
```

Ensure your app has the viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```
