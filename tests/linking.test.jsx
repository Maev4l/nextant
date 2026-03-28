import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import {
  NavigationContainer,
  createStackNavigator,
  createTabNavigator,
  Link,
  CommonActions,
  StackActions,
} from '../src/index.js';

// Mock window.location
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  origin: 'http://localhost:3000',
  href: 'http://localhost:3000/',
};

beforeEach(() => {
  delete window.location;
  window.location = { ...mockLocation };
  window.history.pushState = vi.fn();
  window.history.replaceState = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const HomeScreen = () => <div data-testid="home">Home</div>;
const DetailsScreen = ({ route }) => (
  <div data-testid="details">Details ID: {route?.params?.id}</div>
);
const ProfileScreen = () => <div data-testid="profile">Profile</div>;

const Stack = createStackNavigator();

describe('linking configuration', () => {
  const linkingConfig = {
    prefixes: ['http://localhost:3000'],
    config: {
      screens: {
        Home: '',
        Details: 'details/:id',
        Profile: 'profile',
      },
    },
  };

  const TestApp = () => (
    <NavigationContainer linking={linkingConfig}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  it('renders initial screen based on URL', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });
  });

  it('parses URL with params', async () => {
    window.location.pathname = '/details/42';

    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
      expect(screen.getByText('Details ID: 42')).toBeInTheDocument();
    });
  });
});

describe('Link component with linking', () => {
  const linkingConfig = {
    prefixes: ['http://localhost:3000'],
    config: {
      screens: {
        Home: '',
        Details: 'details/:id',
        Profile: 'profile',
      },
    },
  };

  const HomeWithLinks = () => (
    <div data-testid="home">
      <Link screen="Details" params={{ id: '123' }} data-testid="details-link">
        Go to Details
      </Link>
      <Link screen="Profile" data-testid="profile-link">
        Go to Profile
      </Link>
    </div>
  );

  const TestApp = () => (
    <NavigationContainer linking={linkingConfig}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeWithLinks} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  it('renders Link with href attribute', async () => {
    render(<TestApp />);

    await waitFor(() => {
      const detailsLink = screen.getByTestId('details-link');
      // Link should have href for SEO/accessibility
      expect(detailsLink.tagName).toBe('A');
    });
  });

  it('navigates on Link click', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('details-link'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });
  });

  it('passes params through Link', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('details-link'));

    await waitFor(() => {
      expect(screen.getByText('Details ID: 123')).toBeInTheDocument();
    });
  });
});

describe('navigation actions', () => {
  const HomeWithNav = () => {
    return (
      <div data-testid="home">
        <Link
          action={CommonActions.navigate('Details', { id: '99' })}
          data-testid="nav-action-link"
        >
          Navigate with action
        </Link>
      </div>
    );
  };

  const TestApp = () => (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeWithNav} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  it('Link with CommonActions.navigate works', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('nav-action-link'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
      expect(screen.getByText('Details ID: 99')).toBeInTheDocument();
    });
  });
});

describe('nested navigators with linking', () => {
  const Tab = createTabNavigator();

  const linkingConfig = {
    prefixes: ['http://localhost:3000'],
    config: {
      screens: {
        HomeTab: {
          screens: {
            Home: '',
            Details: 'details/:id',
          },
        },
        ProfileTab: 'profile',
      },
    },
  };

  const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );

  const NestedApp = () => (
    <NavigationContainer linking={linkingConfig}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="ProfileTab" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  it('parses nested URL correctly', async () => {
    window.location.pathname = '/details/55';

    render(<NestedApp />);

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
      expect(screen.getByText('Details ID: 55')).toBeInTheDocument();
    });
  });
});
