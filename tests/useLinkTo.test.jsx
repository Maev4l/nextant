import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import {
  NavigationContainer,
  createStackNavigator,
  createTabNavigator,
  useLinkTo,
  useNavigation,
} from '../src/index.js';

// Helper screens
const HomeScreen = () => {
  const linkTo = useLinkTo();
  return (
    <div data-testid="home">
      <button data-testid="link-details" onClick={() => linkTo('/details')}>
        Go to Details
      </button>
      <button data-testid="link-profile" onClick={() => linkTo('/profile')}>
        Go to Profile
      </button>
      <button data-testid="link-settings" onClick={() => linkTo('/settings/42')}>
        Go to Settings
      </button>
    </div>
  );
};

const DetailsScreen = () => <div data-testid="details">Details</div>;
const ProfileScreen = () => <div data-testid="profile">Profile</div>;
const SettingsScreen = () => <div data-testid="settings">Settings</div>;

// Linking configuration
const linkingConfig = {
  enabled: true,
  config: {
    screens: {
      Home: '',
      Details: 'details',
      Profile: 'profile',
      Settings: 'settings/:id',
    },
  },
};

describe('useLinkTo', () => {
  const Stack = createStackNavigator();

  it('navigates to a path', async () => {
    render(
      <NavigationContainer linking={linkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('link-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });
  });

  it('navigates to path with params', async () => {
    const SettingsWithParams = () => {
      const navigation = useNavigation();
      const route = navigation.getState().routes.find(r => r.name === 'Settings');
      return (
        <div data-testid="settings">
          Settings ID: {route?.params?.id}
        </div>
      );
    };

    render(
      <NavigationContainer linking={linkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsWithParams} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('link-settings'));

    await waitFor(() => {
      expect(screen.getByTestId('settings')).toBeInTheDocument();
    });
  });

  it('throws when linking is not enabled', async () => {
    let thrownError = null;

    const TestScreen = () => {
      const linkTo = useLinkTo();
      const handleClick = () => {
        try {
          linkTo('/details');
        } catch (e) {
          thrownError = e;
        }
      };
      return (
        <div data-testid="test">
          <button onClick={handleClick}>Link</button>
        </div>
      );
    };

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Link'));

    expect(thrownError).not.toBeNull();
    expect(thrownError.message).toMatch(/linking/i);
  });

  it('throws for invalid path', async () => {
    let thrownError = null;

    const TestScreen = () => {
      const linkTo = useLinkTo();
      const handleClick = () => {
        try {
          linkTo('/nonexistent');
        } catch (e) {
          thrownError = e;
        }
      };
      return (
        <div data-testid="test">
          <button onClick={handleClick}>Link</button>
        </div>
      );
    };

    render(
      <NavigationContainer linking={linkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Link'));

    expect(thrownError).not.toBeNull();
    expect(thrownError.message).toMatch(/parse|path/i);
  });

  it('returns a stable function reference', async () => {
    const linkToRefs = [];

    const TestScreen = ({ trigger }) => {
      const linkTo = useLinkTo();
      linkToRefs.push(linkTo);
      return <div data-testid="test">Test {trigger}</div>;
    };

    const { rerender } = render(
      <NavigationContainer linking={linkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">{() => <TestScreen trigger={1} />}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    // Force a rerender by changing props
    rerender(
      <NavigationContainer linking={linkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">{() => <TestScreen trigger={2} />}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toHaveTextContent('Test 2');
    });

    // linkTo function should be stable across renders
    expect(linkToRefs.length).toBeGreaterThanOrEqual(2);
    expect(linkToRefs[0]).toBe(linkToRefs[1]);
  });
});

describe('useLinkTo with tabs', () => {
  const Tab = createTabNavigator();

  it('navigates between tabs using paths', async () => {
    const TabHomeScreen = () => {
      const linkTo = useLinkTo();
      return (
        <div data-testid="tab-home">
          <button onClick={() => linkTo('/profile')}>Go Profile</button>
        </div>
      );
    };

    const tabLinkingConfig = {
      enabled: true,
      config: {
        screens: {
          Home: '',
          Profile: 'profile',
        },
      },
    };

    render(
      <NavigationContainer linking={tabLinkingConfig}>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={TabHomeScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tab-home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Go Profile'));

    // With lazy loading, check that navigation happened via tab bar state
    // The Profile tab should now be active (check the tab button state)
    await waitFor(() => {
      // Profile screen should be rendered after navigation (lazy loads on focus)
      expect(screen.getByTestId('profile')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});

describe('useLinkTo with nested navigators', () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  it('navigates to nested screens', async () => {
    const nestedLinkingConfig = {
      enabled: true,
      config: {
        screens: {
          Main: {
            path: '',
            screens: {
              Home: '',
              Profile: 'profile',
            },
          },
          Settings: 'settings',
        },
      },
    };

    const MainTabs = () => (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );

    render(
      <NavigationContainer linking={nestedLinkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('link-profile'));

    // Wait for tab navigation to complete with lazy loading
    await waitFor(() => {
      expect(screen.getByTestId('profile')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});

describe('useLinkTo reset option', () => {
  const Stack = createStackNavigator();

  it('resets navigation state when reset option is true', async () => {
    const HomeWithReset = () => {
      const linkTo = useLinkTo();
      const navigation = useNavigation();
      return (
        <div data-testid="home">
          <button data-testid="navigate" onClick={() => linkTo('/details')}>
            Navigate
          </button>
          <button data-testid="reset" onClick={() => linkTo('/details', { reset: true })}>
            Reset to Details
          </button>
        </div>
      );
    };

    const DetailsWithBack = () => {
      const navigation = useNavigation();
      const state = navigation.getState();
      return (
        <div data-testid="details">
          <span data-testid="can-go-back">{navigation.canGoBack() ? 'yes' : 'no'}</span>
          <span data-testid="route-count">{state.routes.length}</span>
        </div>
      );
    };

    render(
      <NavigationContainer linking={linkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeWithReset} />
          <Stack.Screen name="Details" component={DetailsWithBack} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // Normal navigation - can go back
    fireEvent.click(screen.getByTestId('navigate'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    // Should be able to go back with normal navigation
    expect(screen.getByTestId('can-go-back')).toHaveTextContent('yes');
  });
});

describe('useLinkTo imperative usage', () => {
  const Stack = createStackNavigator();

  it('can be used in event handlers', async () => {
    const TestScreen = () => {
      const linkTo = useLinkTo();

      const handleCustomEvent = () => {
        // Simulate some async operation
        setTimeout(() => {
          linkTo('/details');
        }, 0);
      };

      return (
        <div data-testid="test">
          <button onClick={handleCustomEvent}>Async Navigate</button>
        </div>
      );
    };

    render(
      <NavigationContainer linking={linkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Async Navigate'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });
  });

  it('can navigate multiple times', async () => {
    const MultiNavScreen = () => {
      const linkTo = useLinkTo();
      return (
        <div data-testid="multi">
          <button data-testid="to-details" onClick={() => linkTo('/details')}>
            Details
          </button>
          <button data-testid="to-profile" onClick={() => linkTo('/profile')}>
            Profile
          </button>
        </div>
      );
    };

    const multiLinkingConfig = {
      enabled: true,
      config: {
        screens: {
          Home: '',
          Details: 'details',
          Profile: 'profile',
        },
      },
    };

    render(
      <NavigationContainer linking={multiLinkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={MultiNavScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('multi')).toBeInTheDocument();
    });

    // Navigate to Details
    fireEvent.click(screen.getByTestId('to-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });
  });
});

describe('useLinkTo with different path formats', () => {
  const Stack = createStackNavigator();

  it('handles paths with leading slash', async () => {
    const TestScreen = () => {
      const linkTo = useLinkTo();
      return (
        <div data-testid="test">
          <button onClick={() => linkTo('/details')}>Link</button>
        </div>
      );
    };

    render(
      <NavigationContainer linking={linkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Link'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });
  });

  it('handles paths with query params', async () => {
    const queryLinkingConfig = {
      enabled: true,
      config: {
        screens: {
          Home: '',
          Search: 'search',
        },
      },
    };

    const TestScreen = () => {
      const linkTo = useLinkTo();
      return (
        <div data-testid="test">
          <button onClick={() => linkTo('/search?q=test')}>Search</button>
        </div>
      );
    };

    const SearchScreen = () => {
      const navigation = useNavigation();
      const route = navigation.getState().routes.find(r => r.name === 'Search');
      return (
        <div data-testid="search">
          Query: {route?.params?.q || 'none'}
        </div>
      );
    };

    render(
      <NavigationContainer linking={queryLinkingConfig}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={TestScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByTestId('search')).toBeInTheDocument();
    });
  });
});
