# Themes

Nextant provides a theming system compatible with react-navigation.

## Built-in Themes

### LightTheme

```jsx
import { NavigationContainer, LightTheme } from '@isnan/nextant';

<NavigationContainer theme={LightTheme}>
```

LightTheme colors:
```js
{
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
}
```

### DarkTheme

```jsx
import { NavigationContainer, DarkTheme } from '@isnan/nextant';

<NavigationContainer theme={DarkTheme}>
```

DarkTheme colors:
```js
{
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(0, 0, 0)',
    card: 'rgb(28, 28, 30)',
    text: 'rgb(255, 255, 255)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
}
```

### DefaultTheme

Alias for `LightTheme`:

```jsx
import { DefaultTheme } from '@isnan/nextant';
```

## Theme Structure

A theme object contains:

```js
{
  dark: boolean,  // Is this a dark theme?
  colors: {
    primary: string,      // Primary brand color (links, buttons)
    background: string,   // Screen background
    card: string,         // Card/header background
    text: string,         // Primary text color
    border: string,       // Border color
    notification: string, // Badge/notification color
  },
}
```

## Custom Themes

Create a custom theme by extending a built-in theme:

```jsx
import { LightTheme } from '@isnan/nextant';

const MyTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    primary: '#6200ee',
    card: '#f8f8f8',
  },
};

<NavigationContainer theme={MyTheme}>
```

## Using Theme Values

### useTheme Hook

Access theme values in any component:

```jsx
import { useTheme } from '@isnan/nextant';

const MyComponent = () => {
  const { dark, colors } = useTheme();

  return (
    <div style={{
      backgroundColor: colors.background,
      color: colors.text,
    }}>
      <span style={{ color: colors.primary }}>
        Highlighted text
      </span>
    </div>
  );
};
```

### ThemeProvider

Wrap a subtree with a different theme:

```jsx
import { ThemeProvider, DarkTheme } from '@isnan/nextant';

const App = () => {
  return (
    <NavigationContainer theme={LightTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Modal">
          {() => (
            <ThemeProvider value={DarkTheme}>
              <ModalContent />
            </ThemeProvider>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## System Theme Detection

Detect system preference and switch themes:

```jsx
import { useState, useEffect } from 'react';
import { NavigationContainer, LightTheme, DarkTheme } from '@isnan/nextant';

const App = () => {
  const [isDark, setIsDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDark(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <NavigationContainer theme={isDark ? DarkTheme : LightTheme}>
      {/* ... */}
    </NavigationContainer>
  );
};
```

## Theme and Tailwind

When using Tailwind CSS, you can combine Nextant themes with Tailwind's dark mode:

```jsx
const App = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync with Tailwind dark mode class
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <NavigationContainer theme={isDark ? DarkTheme : LightTheme}>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* ... */}
      </div>
    </NavigationContainer>
  );
};
```

## Color Reference

| Color | Light Theme | Dark Theme | Usage |
|-------|-------------|------------|-------|
| `primary` | rgb(0, 122, 255) | rgb(10, 132, 255) | Links, active tabs, buttons |
| `background` | rgb(255, 255, 255) | rgb(0, 0, 0) | Screen backgrounds |
| `card` | rgb(255, 255, 255) | rgb(28, 28, 30) | Headers, cards, tab bars |
| `text` | rgb(28, 28, 30) | rgb(255, 255, 255) | Primary text |
| `border` | rgb(216, 216, 216) | rgb(39, 39, 41) | Borders, separators |
| `notification` | rgb(255, 59, 48) | rgb(255, 69, 58) | Badges, alerts |
