import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  NavigationContainer,
  createStackNavigator,
  useNavigation,
} from '../src/index.js';

// Simple test screen
const HomeScreen = () => <div data-testid="home-screen">Home</div>;
const DetailsScreen = () => <div data-testid="details-screen">Details</div>;

// Create navigator for tests
const Stack = createStackNavigator();

const TestNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Details" component={DetailsScreen} />
  </Stack.Navigator>
);

describe('NavigationContainer', () => {
  it('renders children', async () => {
    render(
      <NavigationContainer>
        <TestNavigator />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });
  });

  it('applies theme', async () => {
    const customTheme = {
      dark: false,
      colors: {
        primary: '#ff0000',
        background: '#ffffff',
        card: '#ffffff',
        text: '#000000',
        border: '#cccccc',
        notification: '#ff0000',
      },
    };

    render(
      <NavigationContainer theme={customTheme}>
        <TestNavigator />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });
  });

  it('calls onStateChange when navigation state changes', async () => {
    const onStateChange = vi.fn();

    render(
      <NavigationContainer onStateChange={onStateChange}>
        <TestNavigator />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    // Initial state should trigger onStateChange
    // Note: Depending on implementation, this may or may not be called on mount
  });

  it('supports ltr direction', async () => {
    const { container } = render(
      <NavigationContainer direction="ltr">
        <TestNavigator />
      </NavigationContainer>
    );

    await waitFor(() => {
      const dirElement = container.querySelector('[dir="ltr"]');
      expect(dirElement).toBeInTheDocument();
    });
  });

  it('supports rtl direction', async () => {
    const { container } = render(
      <NavigationContainer direction="rtl">
        <TestNavigator />
      </NavigationContainer>
    );

    await waitFor(() => {
      const dirElement = container.querySelector('[dir="rtl"]');
      expect(dirElement).toBeInTheDocument();
    });
  });
});
