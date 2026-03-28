import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import {
  NavigationContainer,
  createStackNavigator,
  Link,
} from '../src/index.js';

const HomeScreen = () => (
  <div data-testid="home-screen">
    <Link screen="Details" params={{ id: 42 }} data-testid="link">
      Go to Details
    </Link>
  </div>
);

const DetailsScreen = ({ route }) => (
  <div data-testid="details-screen">
    Details ID: {route?.params?.id}
  </div>
);

const Stack = createStackNavigator();

const TestApp = ({ linking }) => (
  <NavigationContainer linking={linking}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('Link component', () => {
  it('renders as an anchor element', async () => {
    render(<TestApp />);

    await waitFor(() => {
      const link = screen.getByTestId('link');
      expect(link.tagName).toBe('A');
    });
  });

  it('renders children', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByText('Go to Details')).toBeInTheDocument();
    });
  });

  it('navigates on click', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('link'));

    await waitFor(() => {
      expect(screen.getByTestId('details-screen')).toBeInTheDocument();
    });
  });

  it('passes params to target screen', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('link'));

    await waitFor(() => {
      expect(screen.getByText('Details ID: 42')).toBeInTheDocument();
    });
  });

  it('applies custom className', async () => {
    const CustomHome = () => (
      <div>
        <Link screen="Details" className="custom-class" data-testid="link">
          Link
        </Link>
      </div>
    );

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={CustomHome} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const link = screen.getByTestId('link');
      expect(link).toHaveClass('custom-class');
    });
  });

  it('prevents default on click', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('link')).toBeInTheDocument();
    });

    const link = screen.getByTestId('link');
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    link.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('allows native behavior with modifier keys', async () => {
    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByTestId('link')).toBeInTheDocument();
    });

    // With metaKey (cmd+click), should not navigate
    fireEvent.click(screen.getByTestId('link'), { metaKey: true });

    // Should still be on home screen
    expect(screen.getByTestId('home-screen')).toBeInTheDocument();
  });
});
