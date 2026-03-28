import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, renderHook } from '@testing-library/react';
import {
  NavigationContainer,
  createStackNavigator,
  useNavigation,
  useRoute,
  useIsFocused,
  useTheme,
  LightTheme,
  DarkTheme,
} from '../src/index.js';

// Wrapper component for hooks that need navigation context
const Stack = createStackNavigator();

const createWrapper = (theme = LightTheme) => {
  const TestScreen = ({ children }) => <div>{children}</div>;

  return ({ children }) => (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Test">
          {() => <TestScreen>{children}</TestScreen>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe('useNavigation', () => {
  it('provides navigation object inside navigator', async () => {
    let capturedNavigation = null;

    const TestScreen = () => {
      capturedNavigation = useNavigation();
      return <div data-testid="test">Test</div>;
    };

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Test" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    expect(capturedNavigation).not.toBeNull();
    expect(typeof capturedNavigation.navigate).toBe('function');
    expect(typeof capturedNavigation.goBack).toBe('function');
    expect(typeof capturedNavigation.dispatch).toBe('function');
  });

  it('throws error outside navigator', () => {
    const TestComponent = () => {
      useNavigation();
      return null;
    };

    expect(() => {
      render(<TestComponent />);
    }).toThrow();
  });
});

describe('useRoute', () => {
  it('provides route object with params', async () => {
    let capturedRoute = null;

    const TestScreen = ({ route }) => {
      capturedRoute = useRoute();
      return <div data-testid="test">Test</div>;
    };

    render(
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Test"
        >
          <Stack.Screen
            name="Test"
            component={TestScreen}
            initialParams={{ foo: 'bar' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    expect(capturedRoute).not.toBeNull();
    expect(capturedRoute.name).toBe('Test');
    expect(capturedRoute.params).toEqual({ foo: 'bar' });
  });
});

describe('useIsFocused', () => {
  it('returns true for focused screen', async () => {
    let isFocused = null;

    const TestScreen = () => {
      isFocused = useIsFocused();
      return <div data-testid="test">Test</div>;
    };

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Test" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    expect(isFocused).toBe(true);
  });
});

describe('useTheme', () => {
  it('returns light theme by default', async () => {
    let capturedTheme = null;

    const TestScreen = () => {
      capturedTheme = useTheme();
      return <div data-testid="test">Test</div>;
    };

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Test" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    expect(capturedTheme.dark).toBe(false);
    expect(capturedTheme.colors.background).toBeDefined();
  });

  it('returns dark theme when configured', async () => {
    let capturedTheme = null;

    const TestScreen = () => {
      capturedTheme = useTheme();
      return <div data-testid="test">Test</div>;
    };

    render(
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Test" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    expect(capturedTheme.dark).toBe(true);
  });
});
