import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import {
  NavigationContainer,
  createStackNavigator,
  createTabNavigator,
  useNavigation,
} from '../src/index.js';

// Test screens
const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <div data-testid="home-screen">
      <span>Home</span>
      <button
        data-testid="go-details"
        onClick={() => navigation.navigate('Details', { id: 1 })}
      >
        Go to Details
      </button>
    </div>
  );
};

const DetailsScreen = ({ route }) => (
  <div data-testid="details-screen">
    Details - ID: {route?.params?.id}
  </div>
);

const ProfileScreen = () => <div data-testid="profile-screen">Profile</div>;
const SettingsScreen = () => <div data-testid="settings-screen">Settings</div>;

describe('createStackNavigator', () => {
  const Stack = createStackNavigator();

  const StackApp = () => (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  it('renders initial screen', async () => {
    render(<StackApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });
  });

  it('navigates to another screen', async () => {
    render(<StackApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details-screen')).toBeInTheDocument();
    });
  });

  it('passes params to screen', async () => {
    render(<StackApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByText('Details - ID: 1')).toBeInTheDocument();
    });
  });
});

describe('createTabNavigator', () => {
  const Tab = createTabNavigator();

  const TabApp = () => (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  it('renders initial tab', async () => {
    render(<TabApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });
  });

  it('renders tab bar', async () => {
    render(<TabApp />);

    await waitFor(() => {
      // Tab bar should have nav element with buttons
      const nav = document.querySelector('.nextant-tab-bar');
      expect(nav).toBeInTheDocument();
      expect(nav.querySelectorAll('button')).toHaveLength(3);
    });
  });

  it('switches tabs on click', async () => {
    render(<TabApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    // Click Profile tab button in tab bar
    const tabBar = document.querySelector('.nextant-tab-bar');
    const profileButton = tabBar.querySelectorAll('button')[1];
    fireEvent.click(profileButton);

    await waitFor(() => {
      expect(screen.getByTestId('profile-screen')).toBeInTheDocument();
    });
  });
});

describe('nested navigators', () => {
  const Stack = createStackNavigator();
  const Tab = createTabNavigator();

  const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );

  const NestedApp = () => (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  it('renders nested navigator', async () => {
    render(<NestedApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });
  });

  it('navigates within nested stack', async () => {
    render(<NestedApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details-screen')).toBeInTheDocument();
    });
  });

  it('switches tabs with nested content', async () => {
    render(<NestedApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    // Click Profile tab button in tab bar
    const tabBar = document.querySelector('.nextant-tab-bar');
    const profileButton = tabBar.querySelectorAll('button')[1];
    fireEvent.click(profileButton);

    await waitFor(() => {
      expect(screen.getByTestId('profile-screen')).toBeInTheDocument();
    });
  });
});
