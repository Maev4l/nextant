import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { useEffect, useRef } from 'react';
import { NavigationContainer } from '../src/NavigationContainer.jsx';
import { createTabNavigator } from '../src/navigators/createTabNavigator.jsx';

// Create tab navigator for tests
const Tab = createTabNavigator();

// Simple test screens
const ScreenA = ({ route }) => <div data-testid="screen-a">Screen {route.name}</div>;
const ScreenB = ({ route }) => <div data-testid="screen-b">Screen {route.name}</div>;
const ScreenC = ({ route }) => <div data-testid="screen-c">Screen {route.name}</div>;

// Mock history for tests
const createMockHistory = (initialPath = '/') => {
  let listeners = [];
  let currentPath = initialPath;

  return {
    get location() {
      return { pathname: currentPath, search: '', hash: '' };
    },
    push: (path) => {
      currentPath = path;
      listeners.forEach(l => l({ location: { pathname: path, search: '', hash: '' } }));
    },
    replace: (path) => {
      currentPath = path;
    },
    go: () => {},
    back: () => {},
    forward: () => {},
    listen: (listener) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    },
    createHref: (to) => typeof to === 'string' ? to : to.pathname || '/',
  };
};

describe('Tab Navigator', () => {
  let mockHistory;

  beforeEach(() => {
    mockHistory = createMockHistory('/');
  });

  describe('basic rendering', () => {
    it('renders a tab navigator with screens', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // First screen should be visible
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
      // Second screen should not be rendered (lazy loading)
      expect(screen.queryByTestId('screen-b')).not.toBeInTheDocument();

      // Tab bar should have both tabs
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
    });

    it('navigates between tabs on press', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Click tab B
      const tabB = screen.getByRole('tab', { name: /B/i });
      fireEvent.click(tabB);

      await waitFor(() => {
        expect(screen.getByTestId('screen-b')).toBeInTheDocument();
      });
    });

    it('supports initialRouteName', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator initialRouteName="B">
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
      expect(screen.queryByTestId('screen-a')).not.toBeInTheDocument();
    });
  });

  describe('lazy loading', () => {
    it('lazy loads screens by default', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
            <Tab.Screen name="C" component={ScreenC} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Only A should be rendered initially
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
      expect(screen.queryByTestId('screen-b')).not.toBeInTheDocument();
      expect(screen.queryByTestId('screen-c')).not.toBeInTheDocument();
    });

    it('renders all screens when lazy=false', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator lazy={false}>
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Both screens should be in DOM (one hidden)
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    it('keeps loaded screens in DOM after navigation', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Navigate to B
      fireEvent.click(screen.getByRole('tab', { name: /B/i }));

      await waitFor(() => {
        expect(screen.getByTestId('screen-b')).toBeInTheDocument();
      });

      // Navigate back to A - both should remain in DOM
      fireEvent.click(screen.getByRole('tab', { name: /A/i }));

      await waitFor(() => {
        expect(screen.getByTestId('screen-a')).toBeInTheDocument();
        expect(screen.getByTestId('screen-b')).toBeInTheDocument();
      });
    });
  });

  describe('tab bar styling', () => {
    it('applies tabBarActiveTintColor and tabBarInactiveTintColor', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#ff0000',
              tabBarInactiveTintColor: '#999999',
            }}
          >
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      const tabs = screen.getAllByRole('tab');
      // Active tab (A) should have active color
      expect(tabs[0]).toHaveStyle({ color: '#ff0000' });
      // Inactive tab (B) should have inactive color
      expect(tabs[1]).toHaveStyle({ color: '#999999' });
    });

    it('applies tabBarStyle backgroundColor', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: { backgroundColor: '#f0f0f0' },
            }}
          >
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      const tabBar = screen.getByRole('tablist');
      expect(tabBar).toHaveStyle({ backgroundColor: '#f0f0f0' });
    });

    it('hides tab bar when tabBarStyle.display is none', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{ tabBarStyle: { display: 'none' } }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Tab bar should be hidden when focused screen has display: none
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('renders custom tabBarBackground', async () => {
      const CustomBackground = () => (
        <div data-testid="custom-bg" style={{ background: 'linear-gradient(red, blue)' }} />
      );

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator
            screenOptions={{
              tabBarBackground: () => <CustomBackground />,
            }}
          >
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByTestId('custom-bg')).toBeInTheDocument();
    });

    it('applies tabBarLabelStyle', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: { fontWeight: 'bold', fontSize: '14px' },
            }}
          >
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Check that labels have the style applied
      const labelA = screen.getByText('A');
      expect(labelA).toHaveStyle({ fontWeight: 'bold', fontSize: '14px' });
    });

    it('hides labels when tabBarShowLabel is false', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator
            screenOptions={{
              tabBarShowLabel: false,
            }}
          >
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Labels should not be visible
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      expect(screen.queryByText('B')).not.toBeInTheDocument();
    });
  });

  describe('tab bar items', () => {
    it('renders tabBarIcon', async () => {
      const HomeIcon = ({ color, size }) => (
        <span data-testid="home-icon" style={{ color, fontSize: size }}>🏠</span>
      );

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={ScreenA}
              options={{
                tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
              }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('renders tabBarBadge', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{ tabBarBadge: 5 }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders string tabBarBadge', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{ tabBarBadge: 'NEW' }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByText('NEW')).toBeInTheDocument();
    });

    it('applies tabBarAccessibilityLabel', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{ tabBarAccessibilityLabel: 'Go to home screen' }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByLabelText('Go to home screen')).toBeInTheDocument();
    });

    it('uses custom tabBarLabel', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
    });

    it('renders custom tabBarButton', async () => {
      const CustomButton = ({ children, ...props }) => (
        <button data-testid="custom-button" {...props}>
          {children}
        </button>
      );

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{ tabBarButton: (props) => <CustomButton {...props} /> }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  describe('tab bar position', () => {
    it('renders tab bar at bottom by default', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      const container = screen.getByRole('tablist').parentElement;
      // Check flex direction indicates bottom position (flex-col means content first, tabs last)
      expect(container).toHaveClass('flex-col');
    });

    it('renders tab bar at top when tabBarPosition="top"', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator tabBarPosition="top">
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      const container = screen.getByRole('tablist').parentElement;
      // flex-col-reverse means tabs first visually (at top)
      expect(container).toHaveClass('flex-col-reverse');
    });
  });

  describe('tab bar label position', () => {
    it('renders labels below icons by default', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{
                tabBarIcon: () => <span data-testid="icon">📱</span>,
              }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      const tab = screen.getAllByRole('tab')[0];
      // flex-col indicates below-icon layout
      expect(tab).toHaveClass('flex-col');
    });

    it('renders labels beside icons when tabBarLabelPosition="beside-icon"', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator
            screenOptions={{
              tabBarLabelPosition: 'beside-icon',
            }}
          >
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{
                tabBarIcon: () => <span data-testid="icon">📱</span>,
              }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      const tab = screen.getAllByRole('tab')[0];
      // flex-row indicates beside-icon layout
      expect(tab).toHaveClass('flex-row');
    });
  });

  describe('events', () => {
    it('emits tabPress event', async () => {
      const onTabPress = vi.fn();

      const TabScreen = ({ navigation }) => {
        useEffect(() => {
          return navigation.addListener('tabPress', onTabPress);
        }, [navigation]);
        return <div>Screen</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={TabScreen} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Click on already active tab to trigger tabPress
      fireEvent.click(screen.getAllByRole('tab')[0]);

      expect(onTabPress).toHaveBeenCalled();
    });

    it('allows preventing default on tabPress', async () => {
      const TabScreen = ({ navigation }) => {
        useEffect(() => {
          return navigation.addListener('tabPress', (e) => {
            e.preventDefault();
          });
        }, [navigation]);
        return <div data-testid="screen-a">Screen A</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={TabScreen} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Try to navigate to B
      fireEvent.click(screen.getByRole('tab', { name: /B/i }));

      // Navigation should be prevented, A still visible
      await waitFor(() => {
        expect(screen.getByTestId('screen-a')).toBeInTheDocument();
      });
    });

    it('emits tabLongPress event on context menu', async () => {
      const onTabLongPress = vi.fn();

      const TabScreen = ({ navigation }) => {
        useEffect(() => {
          return navigation.addListener('tabLongPress', onTabLongPress);
        }, [navigation]);
        return <div>Screen</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={TabScreen} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Trigger context menu (long press equivalent on web)
      fireEvent.contextMenu(screen.getAllByRole('tab')[0]);

      expect(onTabLongPress).toHaveBeenCalled();
    });
  });

  describe('per-tab headers', () => {
    it('shows header when headerShown is true', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={ScreenA}
              options={{ headerShown: true }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Header should be visible - check for header element containing title
      const header = document.querySelector('.nextant-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Home');
    });

    it('renders custom header component', async () => {
      const CustomHeader = ({ options }) => (
        <div data-testid="custom-header">{options.title}</div>
      );

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{
                headerShown: true,
                title: 'Custom Title',
                header: (props) => <CustomHeader {...props} />,
              }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      const customHeader = screen.getByTestId('custom-header');
      expect(customHeader).toBeInTheDocument();
      expect(customHeader).toHaveTextContent('Custom Title');
    });

    it('hides header by default', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Should not find a header element (only tab bar label)
      const homeTexts = screen.getAllByText('Home');
      // Only the tab label should exist, not a header
      expect(homeTexts).toHaveLength(1);
    });
  });

  describe('option merging', () => {
    it('merges navigator-level and screen-level options', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#ff0000',
              tabBarInactiveTintColor: '#999999',
            }}
          >
            <Tab.Screen
              name="A"
              component={ScreenA}
              options={{
                // Override active color for this screen
                tabBarActiveTintColor: '#00ff00',
              }}
            />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      const tabs = screen.getAllByRole('tab');
      // Screen A should use its override color
      expect(tabs[0]).toHaveStyle({ color: '#00ff00' });
      // Screen B should use navigator default
      expect(tabs[1]).toHaveStyle({ color: '#999999' });
    });
  });

  describe('programmatic navigation', () => {
    it('renders screen when navigated programmatically', async () => {
      let navigationRef;

      const ScreenWithNav = ({ navigation }) => {
        navigationRef = navigation;
        return <div data-testid="screen-a">Screen A</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={ScreenWithNav} />
            <Tab.Screen name="B" component={ScreenB} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Navigate programmatically
      act(() => {
        navigationRef.navigate('B');
      });

      await waitFor(() => {
        expect(screen.getByTestId('screen-b')).toBeInTheDocument();
      });
    });
  });

  describe('effects lifecycle', () => {
    it('runs effects when screen becomes focused', async () => {
      let effectRan = false;

      const ScreenWithEffect = () => {
        useEffect(() => {
          effectRan = true;
          return () => {
            effectRan = false;
          };
        }, []);
        return <div data-testid="screen-b">Screen B</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator>
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenWithEffect} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Effect should not have run yet (lazy loading)
      expect(effectRan).toBe(false);

      // Navigate to B
      fireEvent.click(screen.getByRole('tab', { name: /B/i }));

      await waitFor(() => {
        expect(effectRan).toBe(true);
      });
    });

    it('keeps effects active when lazy=false', async () => {
      let effectActive = false;

      const ScreenWithEffect = () => {
        useEffect(() => {
          effectActive = true;
          return () => {
            effectActive = false;
          };
        }, []);
        return <div data-testid="screen-b">Screen B</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Tab.Navigator lazy={false}>
            <Tab.Screen name="A" component={ScreenA} />
            <Tab.Screen name="B" component={ScreenWithEffect} />
          </Tab.Navigator>
        </NavigationContainer>
      );

      // Effect should be active immediately with lazy=false
      expect(effectActive).toBe(true);
    });
  });
});
