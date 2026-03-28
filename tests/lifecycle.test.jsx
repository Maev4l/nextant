import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { useEffect, useState } from 'react';
import {
  NavigationContainer,
  createStackNavigator,
  createTabNavigator,
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from '../src/index.js';

describe('screen lifecycle', () => {
  const Stack = createStackNavigator();

  it('mounts screen component on navigation', async () => {
    const mountFn = vi.fn();
    const unmountFn = vi.fn();

    const DetailsScreen = () => {
      useEffect(() => {
        mountFn();
        return unmountFn;
      }, []);
      return <div data-testid="details">Details</div>;
    };

    const HomeScreen = () => {
      const navigation = useNavigation();
      return (
        <div data-testid="home">
          <button onClick={() => navigation.navigate('Details')}>Go</button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    expect(mountFn).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Go'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    expect(mountFn).toHaveBeenCalledTimes(1);
  });

  it('removes screen from DOM on goBack (with animation)', async () => {
    const DetailsScreen = () => {
      const navigation = useNavigation();
      return (
        <div data-testid="details">
          <button onClick={() => navigation.goBack()}>Back</button>
        </div>
      );
    };

    const HomeScreen = () => {
      const navigation = useNavigation();
      return (
        <div data-testid="home">
          <button onClick={() => navigation.navigate('Details')}>Go</button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Go'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Back'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // Details screen should eventually be removed (AnimatePresence handles exit)
    // The navigation state no longer includes the Details route
    await waitFor(() => {
      expect(screen.queryByTestId('details')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });
});

describe('useFocusEffect', () => {
  const Tab = createTabNavigator();

  it('runs effect when screen is focused', async () => {
    const focusEffect = vi.fn();
    const cleanupEffect = vi.fn();

    const ScreenA = () => {
      useFocusEffect(() => {
        focusEffect();
        return cleanupEffect;
      });
      return <div data-testid="screen-a">A</div>;
    };

    const ScreenB = () => <div data-testid="screen-b">B</div>;

    render(
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="A" component={ScreenA} />
          <Tab.Screen name="B" component={ScreenB} />
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    expect(focusEffect).toHaveBeenCalledTimes(1);
    expect(cleanupEffect).not.toHaveBeenCalled();
  });

  it('runs cleanup when screen loses focus', async () => {
    const focusEffect = vi.fn();
    const cleanupEffect = vi.fn();

    const ScreenA = () => {
      useFocusEffect(() => {
        focusEffect();
        return cleanupEffect;
      });
      return <div data-testid="screen-a">A</div>;
    };

    const ScreenB = () => <div data-testid="screen-b">B</div>;

    render(
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="A" component={ScreenA} />
          <Tab.Screen name="B" component={ScreenB} />
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Switch to screen B
    const tabBar = document.querySelector('.nextant-tab-bar');
    const bButton = tabBar.querySelectorAll('button')[1];
    fireEvent.click(bButton);

    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    expect(cleanupEffect).toHaveBeenCalled();
  });
});

describe('useIsFocused', () => {
  const Tab = createTabNavigator();

  it('returns true for focused screen', async () => {
    let isFocusedValue = null;

    const ScreenA = () => {
      isFocusedValue = useIsFocused();
      return <div data-testid="screen-a">A</div>;
    };

    render(
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="A" component={ScreenA} />
          <Tab.Screen name="B">{() => <div>B</div>}</Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    expect(isFocusedValue).toBe(true);
  });

  it('returns false for unfocused screen', async () => {
    let isFocusedValue = null;

    const ScreenA = () => {
      isFocusedValue = useIsFocused();
      return <div data-testid="screen-a">A (focused: {String(isFocusedValue)})</div>;
    };

    render(
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="A" component={ScreenA} />
          <Tab.Screen name="B">{() => <div data-testid="screen-b">B</div>}</Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Switch to screen B
    const tabBar = document.querySelector('.nextant-tab-bar');
    const bButton = tabBar.querySelectorAll('button')[1];
    fireEvent.click(bButton);

    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    // ScreenA is still mounted (lazy) but not focused
    expect(isFocusedValue).toBe(false);
  });
});

describe('lazy loading', () => {
  const Tab = createTabNavigator();

  it('does not render unfocused tabs initially (lazy=true)', async () => {
    const renderB = vi.fn();

    const ScreenA = () => <div data-testid="screen-a">A</div>;
    const ScreenB = () => {
      renderB();
      return <div data-testid="screen-b">B</div>;
    };

    render(
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="A" component={ScreenA} />
          <Tab.Screen name="B" component={ScreenB} />
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Screen B should not be rendered yet
    expect(renderB).not.toHaveBeenCalled();
  });

  it('renders tab after visiting (lazy loading)', async () => {
    const renderB = vi.fn();

    const ScreenA = () => <div data-testid="screen-a">A</div>;
    const ScreenB = () => {
      renderB();
      return <div data-testid="screen-b">B</div>;
    };

    render(
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="A" component={ScreenA} />
          <Tab.Screen name="B" component={ScreenB} />
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Switch to screen B
    const tabBar = document.querySelector('.nextant-tab-bar');
    const bButton = tabBar.querySelectorAll('button')[1];
    fireEvent.click(bButton);

    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    expect(renderB).toHaveBeenCalled();
  });
});

describe('state persistence', () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  it('preserves stack state when switching tabs', async () => {
    const HomeStack = () => {
      const [count, setCount] = useState(0);
      const navigation = useNavigation();

      return (
        <div data-testid="home-stack">
          <span data-testid="count">Count: {count}</span>
          <button onClick={() => setCount(c => c + 1)}>Increment</button>
          <button onClick={() => navigation.navigate('Details')}>Details</button>
        </div>
      );
    };

    const DetailsScreen = () => <div data-testid="details">Details</div>;

    const HomeStackNavigator = () => (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeMain" component={HomeStack} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    );

    const ProfileScreen = () => <div data-testid="profile">Profile</div>;

    render(
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={HomeStackNavigator} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home-stack')).toBeInTheDocument();
    });

    // Increment counter
    fireEvent.click(screen.getByText('Increment'));
    fireEvent.click(screen.getByText('Increment'));

    expect(screen.getByTestId('count')).toHaveTextContent('Count: 2');

    // Navigate to Details
    fireEvent.click(screen.getByText('Details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    // Switch to Profile tab
    const tabBar = document.querySelector('.nextant-tab-bar');
    const profileButton = tabBar.querySelectorAll('button')[1];
    fireEvent.click(profileButton);

    await waitFor(() => {
      expect(screen.getByTestId('profile')).toBeInTheDocument();
    });

    // Switch back to Home tab - should preserve stack state
    const homeButton = tabBar.querySelectorAll('button')[0];
    fireEvent.click(homeButton);

    await waitFor(() => {
      // Should still be on Details screen
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });
  });
});
