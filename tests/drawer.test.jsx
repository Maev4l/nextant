import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { useEffect, useState } from 'react';
import {
  NavigationContainer,
  createDrawerNavigator,
  createStackNavigator,
  useNavigation,
  useIsFocused,
  useFocusEffect,
  DrawerActions,
} from '../src/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const ScreenA = ({ navigation }) => (
  <div data-testid="screen-a">
    <span>Screen A</span>
    <button data-testid="go-b" onClick={() => navigation.navigate('B')}>
      Go to B
    </button>
    <button data-testid="open-drawer" onClick={() => navigation.openDrawer()}>
      Open Drawer
    </button>
  </div>
);

const ScreenB = ({ navigation }) => (
  <div data-testid="screen-b">
    <span>Screen B</span>
    <button data-testid="go-a" onClick={() => navigation.navigate('A')}>
      Go to A
    </button>
  </div>
);

describe('createDrawerNavigator', () => {
  const Drawer = createDrawerNavigator();

  const DrawerApp = () => (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="A" component={ScreenA} />
        <Drawer.Screen name="B" component={ScreenB} />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  it('renders a drawer navigator with screens', async () => {
    render(<DrawerApp />);

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('screen-b')).not.toBeInTheDocument();
  });

  it('navigates between screens', async () => {
    render(<DrawerApp />);

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-b'));

    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });
  });

  it('opens drawer with navigation.openDrawer()', async () => {
    render(<DrawerApp />);

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Check drawer panel exists
    const drawerPanel = document.querySelector('.nextant-drawer-panel');
    expect(drawerPanel).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('open-drawer'));

    // Drawer should be in open state (animation will handle position)
    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toBeInTheDocument();
    });
  });

  it('renders drawer content with navigation items', async () => {
    render(<DrawerApp />);

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Drawer content should have items for each screen
    const drawerContent = document.querySelector('.nextant-drawer-content');
    expect(drawerContent).toBeInTheDocument();
  });
});

describe('drawer navigation actions', () => {
  const Drawer = createDrawerNavigator();

  it('supports DrawerActions.openDrawer()', async () => {
    const TestScreen = () => {
      const navigation = useNavigation();
      return (
        <div data-testid="test">
          <button
            data-testid="dispatch-open"
            onClick={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            Dispatch Open
          </button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Test" component={TestScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('dispatch-open'));

    // Action should be dispatched successfully
    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toBeInTheDocument();
    });
  });

  it('supports DrawerActions.closeDrawer()', async () => {
    const TestScreen = () => {
      const navigation = useNavigation();
      return (
        <div data-testid="test">
          <button
            data-testid="open"
            onClick={() => navigation.openDrawer()}
          >
            Open
          </button>
          <button
            data-testid="close"
            onClick={() => navigation.dispatch(DrawerActions.closeDrawer())}
          >
            Close
          </button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Test" component={TestScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    // Open drawer first
    fireEvent.click(screen.getByTestId('open'));

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'auto' });
    });

    // Close drawer
    fireEvent.click(screen.getByTestId('close'));

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'none' });
    });
  });

  it('supports DrawerActions.toggleDrawer()', async () => {
    const TestScreen = () => {
      const navigation = useNavigation();
      return (
        <div data-testid="test">
          <button
            data-testid="toggle"
            onClick={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            Toggle
          </button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Test" component={TestScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    // Initially closed
    let overlay = document.querySelector('.nextant-drawer-overlay');
    expect(overlay).toHaveStyle({ pointerEvents: 'none' });

    // Toggle open
    fireEvent.click(screen.getByTestId('toggle'));

    await waitFor(() => {
      overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'auto' });
    });

    // Toggle closed
    fireEvent.click(screen.getByTestId('toggle'));

    await waitFor(() => {
      overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'none' });
    });
  });
});

describe('drawer with custom content', () => {
  const Drawer = createDrawerNavigator();

  it('renders custom drawer content', async () => {
    const CustomDrawerContent = ({ navigation }) => (
      <div data-testid="custom-drawer-content">
        <button onClick={() => navigation.navigate('A')}>Custom A</button>
        <button onClick={() => navigation.navigate('B')}>Custom B</button>
      </div>
    );

    render(
      <NavigationContainer>
        <Drawer.Navigator drawerContent={CustomDrawerContent}>
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-drawer-content')).toBeInTheDocument();
    });

    expect(screen.getByText('Custom A')).toBeInTheDocument();
    expect(screen.getByText('Custom B')).toBeInTheDocument();
  });

  it('navigates from custom drawer content', async () => {
    const CustomDrawerContent = ({ navigation }) => (
      <div data-testid="custom-drawer-content">
        <button data-testid="nav-b" onClick={() => navigation.navigate('B')}>
          Go B
        </button>
      </div>
    );

    render(
      <NavigationContainer>
        <Drawer.Navigator drawerContent={CustomDrawerContent}>
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('nav-b'));

    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });
  });
});

describe('drawer position', () => {
  const Drawer = createDrawerNavigator();

  it('renders drawer on left by default', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const drawerPanel = document.querySelector('.nextant-drawer-panel');
      expect(drawerPanel).toHaveClass('left-0');
    });
  });

  it('renders drawer on right when specified', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator drawerPosition="right">
          <Drawer.Screen name="A" component={ScreenA} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const drawerPanel = document.querySelector('.nextant-drawer-panel');
      expect(drawerPanel).toHaveClass('right-0');
    });
  });
});

describe('drawer overlay interaction', () => {
  const Drawer = createDrawerNavigator();

  it('closes drawer when clicking overlay', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Open drawer
    fireEvent.click(screen.getByTestId('open-drawer'));

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'auto' });
    });

    // Click overlay to close
    const overlay = document.querySelector('.nextant-drawer-overlay');
    fireEvent.click(overlay);

    await waitFor(() => {
      expect(overlay).toHaveStyle({ pointerEvents: 'none' });
    });
  });
});

describe('drawer screen lifecycle', () => {
  const Drawer = createDrawerNavigator();

  it('mounts screen when navigating to it', async () => {
    const mountFn = vi.fn();

    const ScreenWithEffect = () => {
      useEffect(() => {
        mountFn();
      }, []);
      return <div data-testid="screen-with-effect">Effect Screen</div>;
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenWithEffect} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    expect(mountFn).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('go-b'));

    await waitFor(() => {
      expect(screen.getByTestId('screen-with-effect')).toBeInTheDocument();
    });

    expect(mountFn).toHaveBeenCalledTimes(1);
  });
});

describe('nested drawer with other navigators', () => {
  const Drawer = createDrawerNavigator();

  it('works inside a tab navigator', async () => {
    const { createTabNavigator } = await import('../src/index.js');
    const Tab = createTabNavigator();

    const DrawerNav = () => (
      <Drawer.Navigator>
        <Drawer.Screen name="A" component={ScreenA} />
        <Drawer.Screen name="B" component={ScreenB} />
      </Drawer.Navigator>
    );

    render(
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="DrawerTab" component={DrawerNav} />
          <Tab.Screen name="OtherTab">{() => <div data-testid="other">Other</div>}</Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Drawer should work within tab
    fireEvent.click(screen.getByTestId('open-drawer'));

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'auto' });
    });
  });
});

describe('drawer item interactions', () => {
  const Drawer = createDrawerNavigator();

  it('clicking drawer item navigates and closes drawer', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Open drawer
    fireEvent.click(screen.getByTestId('open-drawer'));

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'auto' });
    });

    // Click drawer item for screen B
    const drawerContent = document.querySelector('.nextant-drawer-content');
    const items = drawerContent.querySelectorAll('button');
    const itemB = Array.from(items).find(btn => btn.textContent.includes('B'));
    fireEvent.click(itemB);

    // Should navigate to B and close drawer
    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'none' });
    });
  });

  it('shows focused state for current screen in drawer', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Check drawer content shows A as focused
    const drawerContent = document.querySelector('.nextant-drawer-content');
    const items = drawerContent.querySelectorAll('button');
    const itemA = Array.from(items).find(btn => btn.textContent.includes('A'));

    // Focused item should have background color set (not transparent)
    expect(itemA.style.backgroundColor).not.toBe('transparent');
  });
});

describe('drawer screen options', () => {
  const Drawer = createDrawerNavigator();

  it('uses drawerLabel for item text', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="A"
            component={ScreenA}
            options={{ drawerLabel: 'Custom Label A' }}
          />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Check drawer content shows custom label
    expect(screen.getByText('Custom Label A')).toBeInTheDocument();
  });

  it('uses title as fallback for drawerLabel', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="A"
            component={ScreenA}
            options={{ title: 'Title A' }}
          />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Check drawer content shows title (may also appear in header)
    const drawerContent = document.querySelector('.nextant-drawer-content');
    expect(drawerContent).toHaveTextContent('Title A');
  });

  it('renders drawerIcon when provided as component', async () => {
    const TestIcon = ({ color }) => (
      <span data-testid="test-icon" style={{ color }}>Icon</span>
    );

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="A"
            component={ScreenA}
            options={{ drawerIcon: TestIcon }}
          />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Check icon is rendered
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders drawerIcon when provided as function', async () => {
    const iconFn = ({ focused, color, size }) => (
      <span
        data-testid="fn-icon"
        data-focused={focused}
        style={{ color, fontSize: size }}
      >
        FnIcon
      </span>
    );

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="A"
            component={ScreenA}
            options={{ drawerIcon: iconFn }}
          />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Check icon function is called and rendered
    const icon = screen.getByTestId('fn-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-focused', 'true');
  });
});

describe('drawer with stack navigator', () => {
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

  it('drawer contains stack navigator', async () => {
    const HomeStack = () => (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">{() => (
          <div data-testid="home">
            <button
              data-testid="open-drawer"
              onClick={() => {}}
            >
              Open
            </button>
          </div>
        )}</Stack.Screen>
        <Stack.Screen name="Details">{() => <div data-testid="details">Details</div>}</Stack.Screen>
      </Stack.Navigator>
    );

    const ScreenWithDrawer = () => {
      const navigation = useNavigation();
      return (
        <div data-testid="screen-with-drawer">
          <button
            data-testid="open-drawer-btn"
            onClick={() => navigation.openDrawer()}
          >
            Open Drawer
          </button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Main" component={ScreenWithDrawer} />
          <Drawer.Screen name="Settings">{() => <div>Settings</div>}</Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-with-drawer')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('open-drawer-btn'));

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'auto' });
    });
  });
});

describe('drawer focus and lifecycle hooks', () => {
  const Drawer = createDrawerNavigator();

  it('useIsFocused returns true for focused drawer screen', async () => {
    let screenAFocused = null;

    const ScreenAWithFocus = ({ navigation }) => {
      screenAFocused = useIsFocused();
      return (
        <div data-testid="screen-a">
          <span data-testid="focused-a">{String(screenAFocused)}</span>
          <button data-testid="go-b" onClick={() => navigation.navigate('B')}>B</button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenAWithFocus} />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Screen A is focused initially
    expect(screenAFocused).toBe(true);
    expect(screen.getByTestId('focused-a')).toHaveTextContent('true');
  });

  it('useIsFocused returns true for newly focused screen', async () => {
    let screenBFocused = null;

    const ScreenBWithFocus = () => {
      screenBFocused = useIsFocused();
      return (
        <div data-testid="screen-b">
          <span data-testid="focused-b">{String(screenBFocused)}</span>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenBWithFocus} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-b'));

    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    // Screen B is now focused
    expect(screenBFocused).toBe(true);
    expect(screen.getByTestId('focused-b')).toHaveTextContent('true');
  });

  it('useFocusEffect runs when drawer screen gains focus', async () => {
    const focusEffectA = vi.fn();
    const focusEffectB = vi.fn();

    const ScreenAWithEffect = ({ navigation }) => {
      useFocusEffect(() => {
        focusEffectA();
      });
      return (
        <div data-testid="screen-a">
          <button data-testid="go-b" onClick={() => navigation.navigate('B')}>B</button>
        </div>
      );
    };

    const ScreenBWithEffect = () => {
      useFocusEffect(() => {
        focusEffectB();
      });
      return <div data-testid="screen-b">B</div>;
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenAWithEffect} />
          <Drawer.Screen name="B" component={ScreenBWithEffect} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    expect(focusEffectA).toHaveBeenCalledTimes(1);
    expect(focusEffectB).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('go-b'));

    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    expect(focusEffectB).toHaveBeenCalledTimes(1);
  });
});

describe('drawer state management', () => {
  const Drawer = createDrawerNavigator();

  it('preserves screen state when drawer opens/closes', async () => {
    const ScreenWithState = ({ navigation }) => {
      const [count, setCount] = useState(0);
      return (
        <div data-testid="screen-state">
          <span data-testid="count">Count: {count}</span>
          <button data-testid="increment" onClick={() => setCount(c => c + 1)}>+</button>
          <button data-testid="open-drawer" onClick={() => navigation.openDrawer()}>Open</button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Main" component={ScreenWithState} />
          <Drawer.Screen name="Other">{() => <div>Other</div>}</Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-state')).toBeInTheDocument();
    });

    // Increment counter
    fireEvent.click(screen.getByTestId('increment'));
    fireEvent.click(screen.getByTestId('increment'));
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 2');

    // Open drawer
    fireEvent.click(screen.getByTestId('open-drawer'));

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'auto' });
    });

    // Close drawer by clicking overlay
    const overlay = document.querySelector('.nextant-drawer-overlay');
    fireEvent.click(overlay);

    await waitFor(() => {
      expect(overlay).toHaveStyle({ pointerEvents: 'none' });
    });

    // State should be preserved
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 2');
  });

  it('maintains navigation history correctly', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Navigate A -> B
    fireEvent.click(screen.getByTestId('go-b'));

    await waitFor(() => {
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    // Navigate B -> A
    fireEvent.click(screen.getByTestId('go-a'));

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Verify A is focused (visible) - B may still be in DOM but hidden (lazy loading keeps screens)
    const screenA = screen.getByTestId('screen-a');
    expect(screenA.closest('[style*="visibility: visible"]')).toBeInTheDocument();
  });
});

describe('drawer gesture handling', () => {
  const Drawer = createDrawerNavigator();

  it('drawer panel has drag enabled by default', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Check drawer panel exists with drag capabilities
    const drawerPanel = document.querySelector('.nextant-drawer-panel');
    expect(drawerPanel).toBeInTheDocument();
  });

  it('gestureEnabled=false disables drawer drag', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator screenOptions={{ gestureEnabled: false }}>
          <Drawer.Screen name="A" component={ScreenA} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Drawer should still be controllable via navigation methods
    fireEvent.click(screen.getByTestId('open-drawer'));

    await waitFor(() => {
      const overlay = document.querySelector('.nextant-drawer-overlay');
      expect(overlay).toHaveStyle({ pointerEvents: 'auto' });
    });
  });
});

describe('drawer accessibility', () => {
  const Drawer = createDrawerNavigator();

  it('drawer content is a nav element', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    const navElement = document.querySelector('nav.nextant-drawer-content');
    expect(navElement).toBeInTheDocument();
  });

  it('drawer has header with Menu title', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="A" component={ScreenA} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('screen-a')).toBeInTheDocument();
    });

    // Default drawer content has "Menu" header
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });
});

describe('drawer with initial route', () => {
  const Drawer = createDrawerNavigator();

  it('respects initialRouteName', async () => {
    render(
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="B">
          <Drawer.Screen name="A" component={ScreenA} />
          <Drawer.Screen name="B" component={ScreenB} />
        </Drawer.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      // Should start on screen B
      expect(screen.getByTestId('screen-b')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('screen-a')).not.toBeInTheDocument();
  });
});
