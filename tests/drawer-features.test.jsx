import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { NavigationContainer } from '../src/NavigationContainer.jsx';
import { createDrawerNavigator } from '../src/navigators/createDrawerNavigator.jsx';

// Create drawer navigator for tests
const Drawer = createDrawerNavigator();

// Simple test screens
const ScreenA = ({ route }) => <div data-testid="screen-a">Screen {route.name}</div>;
const ScreenB = ({ route }) => <div data-testid="screen-b">Screen {route.name}</div>;

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

describe('Drawer Navigator Features', () => {
  let mockHistory;

  beforeEach(() => {
    mockHistory = createMockHistory('/');
  });

  describe('basic rendering', () => {
    it('renders a drawer navigator with screens', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
      // Lazy loading - B not rendered yet
      expect(screen.queryByTestId('screen-b')).not.toBeInTheDocument();
    });

    it('navigates between screens', async () => {
      let navRef;
      const ScreenWithNav = ({ navigation }) => {
        navRef = navigation;
        return <div data-testid="screen-a">Screen A</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenWithNav} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      act(() => {
        navRef.navigate('B');
      });

      await waitFor(() => {
        expect(screen.getByTestId('screen-b')).toBeInTheDocument();
      });
    });
  });

  describe('lazy loading', () => {
    it('lazy loads screens by default', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Only A should be rendered
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
      expect(screen.queryByTestId('screen-b')).not.toBeInTheDocument();
    });

    it('renders all screens when lazy=false', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator lazy={false}>
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Both should be in DOM
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    it('keeps loaded screens in DOM after navigation', async () => {
      let navRef;
      const ScreenWithNav = ({ navigation }) => {
        navRef = navigation;
        return <div data-testid="screen-a">Screen A</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenWithNav} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Navigate to B
      act(() => {
        navRef.navigate('B');
      });

      await waitFor(() => {
        expect(screen.getByTestId('screen-b')).toBeInTheDocument();
      });

      // Navigate back to A
      act(() => {
        navRef.navigate('A');
      });

      // Both should be in DOM (B is hidden but still present)
      await waitFor(() => {
        expect(screen.getByTestId('screen-a')).toBeInTheDocument();
        expect(screen.getByTestId('screen-b')).toBeInTheDocument();
      });
    });
  });

  describe('drawer styling', () => {
    it('applies drawerActiveTintColor and drawerInactiveTintColor', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator
            screenOptions={{
              drawerActiveTintColor: '#ff0000',
              drawerInactiveTintColor: '#999999',
            }}
          >
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerContent = document.querySelector('.nextant-drawer-content');
      const items = drawerContent.querySelectorAll('button');

      // Active item (A) should have active color
      expect(items[0]).toHaveStyle({ color: '#ff0000' });
      // Inactive item (B) should have inactive color
      expect(items[1]).toHaveStyle({ color: '#999999' });
    });

    it('applies drawerStyle width', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator
            drawerStyle={{ width: 320 }}
          >
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerPanel = document.querySelector('.nextant-drawer-panel');
      expect(drawerPanel).toHaveStyle({ width: '320px' });
    });

    it('applies drawerStyle backgroundColor', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator
            drawerStyle={{ backgroundColor: '#f0f0f0' }}
          >
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerPanel = document.querySelector('.nextant-drawer-panel');
      expect(drawerPanel).toHaveStyle({ backgroundColor: '#f0f0f0' });
    });

    it('applies drawerLabelStyle', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator
            screenOptions={{
              drawerLabelStyle: { fontWeight: 'bold' },
            }}
          >
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerContent = document.querySelector('.nextant-drawer-content');
      const label = drawerContent.querySelector('button span');
      expect(label).toHaveStyle({ fontWeight: 'bold' });
    });

    it('applies drawerItemStyle', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator
            screenOptions={{
              drawerItemStyle: { paddingLeft: '24px' },
            }}
          >
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerContent = document.querySelector('.nextant-drawer-content');
      const item = drawerContent.querySelector('button');
      expect(item).toHaveStyle({ paddingLeft: '24px' });
    });
  });

  describe('drawer items', () => {
    it('renders drawerIcon', async () => {
      const HomeIcon = ({ color }) => (
        <span data-testid="home-icon" style={{ color }}>🏠</span>
      );

      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen
              name="Home"
              component={ScreenA}
              options={{
                drawerIcon: ({ color }) => <HomeIcon color={color} />,
              }}
            />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('uses drawerLabel when provided', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen
              name="A"
              component={ScreenA}
              options={{ drawerLabel: 'Home Screen' }}
            />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerContent = document.querySelector('.nextant-drawer-content');
      expect(drawerContent).toHaveTextContent('Home Screen');
    });

    it('supports drawerLabel as function', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen
              name="A"
              component={ScreenA}
              options={{
                drawerLabel: ({ focused, color }) => (
                  <span data-testid="custom-label" style={{ color }}>
                    {focused ? 'Active Home' : 'Home'}
                  </span>
                ),
              }}
            />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const label = screen.getByTestId('custom-label');
      expect(label).toHaveTextContent('Active Home');
    });

    it('applies drawerItemTestID', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen
              name="A"
              component={ScreenA}
              options={{ drawerItemTestID: 'drawer-item-a' }}
            />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByTestId('drawer-item-a')).toBeInTheDocument();
    });
  });

  describe('drawer position', () => {
    it('renders drawer on left by default', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerPanel = document.querySelector('.nextant-drawer-panel');
      expect(drawerPanel).toHaveClass('left-0');
    });

    it('renders drawer on right when drawerPosition="right"', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator drawerPosition="right">
            <Drawer.Screen name="A" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerPanel = document.querySelector('.nextant-drawer-panel');
      expect(drawerPanel).toHaveClass('right-0');
    });
  });

  describe('drawer types', () => {
    it('renders front drawer by default', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerPanel = document.querySelector('.nextant-drawer-panel');
      // Front drawer has z-20 class
      expect(drawerPanel).toHaveClass('z-20');
    });

    it('renders permanent drawer inline', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator drawerType="permanent">
            <Drawer.Screen name="A" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Permanent drawer has flex-row layout
      const container = document.querySelector('.nextant-drawer');
      expect(container).toHaveClass('flex-row');
    });

    it('back drawer is behind content', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator drawerType="back">
            <Drawer.Screen name="A" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerPanel = document.querySelector('.nextant-drawer-panel');
      expect(drawerPanel).toHaveClass('-z-10');
    });
  });

  describe('overlay', () => {
    it('applies overlayStyle backgroundColor', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator
            overlayStyle={{ backgroundColor: 'rgba(255, 0, 0, 0.5)' }}
          >
            <Drawer.Screen name="A" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ backgroundColor: 'rgba(255, 0, 0, 0.5)' });
    });

    it('applies overlayAccessibilityLabel', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator
            overlayAccessibilityLabel="Close navigation menu"
          >
            <Drawer.Screen name="A" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveAttribute('aria-label', 'Close navigation menu');
    });
  });

  describe('header', () => {
    it('shows header by default', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="Home" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const header = document.querySelector('.nextant-header');
      expect(header).toBeInTheDocument();
    });

    it('hides header when headerShown is false', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen
              name="Home"
              component={ScreenA}
              options={{ headerShown: false }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const header = document.querySelector('.nextant-header');
      expect(header).not.toBeInTheDocument();
    });

    it('renders custom header component', async () => {
      const CustomHeader = ({ options }) => (
        <div data-testid="custom-header">{options.title}</div>
      );

      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen
              name="A"
              component={ScreenA}
              options={{
                title: 'Custom Title',
                header: (props) => <CustomHeader {...props} />,
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header')).toHaveTextContent('Custom Title');
    });

    it('shows drawer toggle button in header', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="Home" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const toggleButton = screen.getByLabelText('Toggle drawer');
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('emits drawerItemPress event', async () => {
      const onDrawerItemPress = vi.fn();

      const ScreenWithListener = ({ navigation }) => {
        useEffect(() => {
          return navigation.addListener('drawerItemPress', onDrawerItemPress);
        }, [navigation]);
        return <div data-testid="screen-a">Screen A</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenWithListener} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Click on drawer item A
      const drawerContent = document.querySelector('.nextant-drawer-content');
      const itemA = drawerContent.querySelector('button');
      fireEvent.click(itemA);

      expect(onDrawerItemPress).toHaveBeenCalled();
    });

    it('allows preventing default on drawerItemPress', async () => {
      const ScreenWithPrevention = ({ navigation }) => {
        useEffect(() => {
          return navigation.addListener('drawerItemPress', (e) => {
            e.preventDefault();
          });
        }, [navigation]);
        return <div data-testid="screen-a">Screen A</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenWithPrevention} />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Click on drawer item B - should be prevented
      const drawerContent = document.querySelector('.nextant-drawer-content');
      const items = drawerContent.querySelectorAll('button');
      fireEvent.click(items[1]); // Click B

      // Should still be on A
      await waitFor(() => {
        expect(screen.getByTestId('screen-a')).toBeInTheDocument();
      });
    });
  });

  describe('option merging', () => {
    it('merges navigator-level and screen-level options', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator
            screenOptions={{
              drawerActiveTintColor: '#ff0000',
              drawerInactiveTintColor: '#999999',
            }}
          >
            <Drawer.Screen
              name="A"
              component={ScreenA}
              options={{
                drawerActiveTintColor: '#00ff00', // Override
              }}
            />
            <Drawer.Screen name="B" component={ScreenB} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      const drawerContent = document.querySelector('.nextant-drawer-content');
      const items = drawerContent.querySelectorAll('button');

      // A uses override color
      expect(items[0]).toHaveStyle({ color: '#00ff00' });
      // B uses navigator default
      expect(items[1]).toHaveStyle({ color: '#999999' });
    });
  });

  describe('gesture handling', () => {
    it('disables gestures when gestureEnabled=false', async () => {
      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator gestureEnabled={false}>
            <Drawer.Screen name="A" component={ScreenA} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Edge swipe area should not exist
      const edgeSwipe = document.querySelector('.nextant-drawer .w-5.absolute');
      expect(edgeSwipe).not.toBeInTheDocument();
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

      let navRef;
      const ScreenWithNav = ({ navigation }) => {
        navRef = navigation;
        return <div data-testid="screen-a">Screen A</div>;
      };

      render(
        <NavigationContainer history={mockHistory}>
          <Drawer.Navigator>
            <Drawer.Screen name="A" component={ScreenWithNav} />
            <Drawer.Screen name="B" component={ScreenWithEffect} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Effect should not have run yet
      expect(effectRan).toBe(false);

      // Navigate to B
      act(() => {
        navRef.navigate('B');
      });

      await waitFor(() => {
        expect(effectRan).toBe(true);
      });
    });

    it('runs effects immediately with lazy=false', async () => {
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
          <Drawer.Navigator lazy={false}>
            <Drawer.Screen name="A" component={ScreenA} />
            <Drawer.Screen name="B" component={ScreenWithEffect} />
          </Drawer.Navigator>
        </NavigationContainer>
      );

      // Effect should run immediately with lazy=false
      expect(effectRan).toBe(true);
    });
  });
});
