import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useState, useEffect, useRef } from 'react';
import {
  NavigationContainer,
  createStackNavigator,
  createTabNavigator,
} from '../src/index.js';
import { useLinkBuilder } from '../src/useLinkBuilder.js';

// Helper screens
const HomeScreen = () => <div data-testid="home">Home</div>;
const DetailsScreen = () => <div data-testid="details">Details</div>;
const ProfileScreen = () => <div data-testid="profile">Profile</div>;

describe('useLinkBuilder', () => {
  const Stack = createStackNavigator();

  describe('buildAction', () => {
    it('builds action from href', async () => {
      let builtAction = null;

      const TestScreen = () => {
        const { buildAction } = useLinkBuilder();
        builtAction = buildAction('/details');
        return <div data-testid="test">Test</div>;
      };

      const linkingConfig = {
        enabled: true,
        config: {
          screens: {
            Home: '',
            Details: 'details',
          },
        },
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

      expect(builtAction).toMatchObject({
        type: 'NAVIGATE',
        payload: expect.objectContaining({
          name: 'Details',
        }),
      });
    });

    it('builds action with params from href', async () => {
      let builtAction = null;

      const TestScreen = () => {
        const { buildAction } = useLinkBuilder();
        builtAction = buildAction('/details/42');
        return <div data-testid="test">Test</div>;
      };

      const linkingConfig = {
        enabled: true,
        config: {
          screens: {
            Home: '',
            Details: 'details/:id',
          },
        },
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

      expect(builtAction).toMatchObject({
        type: 'NAVIGATE',
        payload: expect.objectContaining({
          name: 'Details',
          params: expect.objectContaining({ id: '42' }),
        }),
      });
    });

    it('returns undefined for invalid href', async () => {
      let builtAction = 'not-called';

      const TestScreen = () => {
        const { buildAction } = useLinkBuilder();
        builtAction = buildAction('/nonexistent');
        return <div data-testid="test">Test</div>;
      };

      const linkingConfig = {
        enabled: true,
        config: {
          screens: {
            Home: '',
            Details: 'details',
          },
        },
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

      expect(builtAction).toBeUndefined();
    });

    it('returns undefined when linking not configured', async () => {
      let builtAction = 'not-called';

      const TestScreen = () => {
        const { buildAction } = useLinkBuilder();
        builtAction = buildAction('/details');
        return <div data-testid="test">Test</div>;
      };

      render(
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={TestScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test')).toBeInTheDocument();
      });

      expect(builtAction).toBeUndefined();
    });

    it('returns stable function reference', async () => {
      const buildActionRefs = [];

      const TestScreen = ({ trigger }) => {
        const { buildAction } = useLinkBuilder();
        buildActionRefs.push(buildAction);
        return <div data-testid="test">Test {trigger}</div>;
      };

      const linkingConfig = {
        enabled: true,
        config: {
          screens: {
            Home: '',
          },
        },
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

      expect(buildActionRefs.length).toBeGreaterThanOrEqual(2);
      expect(buildActionRefs[0]).toBe(buildActionRefs[1]);
    });

    it('builds action from href with query params', async () => {
      let builtAction = null;

      const TestScreen = () => {
        const { buildAction } = useLinkBuilder();
        builtAction = buildAction('/search?query=test&page=1');
        return <div data-testid="test">Test</div>;
      };

      const linkingConfig = {
        enabled: true,
        config: {
          screens: {
            Home: '',
            Search: 'search',
          },
        },
      };

      render(
        <NavigationContainer linking={linkingConfig}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={TestScreen} />
            <Stack.Screen name="Search" component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test')).toBeInTheDocument();
      });

      expect(builtAction).toMatchObject({
        type: 'NAVIGATE',
        payload: expect.objectContaining({
          name: 'Search',
          params: expect.objectContaining({
            query: 'test',
            page: '1',
          }),
        }),
      });
    });
  });

  describe('buildHref', () => {
    it('returns undefined before navigation is ready', async () => {
      let initialHref = 'not-called';

      const TestScreen = () => {
        const { buildHref } = useLinkBuilder();
        // Capture value on first render
        if (initialHref === 'not-called') {
          initialHref = buildHref('Details');
        }
        return <div data-testid="test">Test</div>;
      };

      const linkingConfig = {
        enabled: true,
        config: {
          screens: {
            Home: '',
            Details: 'details',
          },
        },
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

      // Before navigation is ready, buildHref returns undefined
      expect(initialHref).toBeUndefined();
    });

    it('returns stable function reference', async () => {
      const buildHrefRefs = [];

      const TestScreen = ({ trigger }) => {
        const { buildHref } = useLinkBuilder();
        buildHrefRefs.push(buildHref);
        return <div data-testid="test">Test {trigger}</div>;
      };

      const linkingConfig = {
        enabled: true,
        config: {
          screens: {
            Home: '',
          },
        },
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

      expect(buildHrefRefs.length).toBeGreaterThanOrEqual(2);
      expect(buildHrefRefs[0]).toBe(buildHrefRefs[1]);
    });
  });

  describe('with nested navigators', () => {
    const Tab = createTabNavigator();

    it('builds action for nested path', async () => {
      let builtAction = null;

      const TestScreen = () => {
        const { buildAction } = useLinkBuilder();
        builtAction = buildAction('/profile');
        return <div data-testid="test">Test</div>;
      };

      const linkingConfig = {
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
          },
        },
      };

      const MainTabs = () => (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={TestScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      );

      render(
        <NavigationContainer linking={linkingConfig}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test')).toBeInTheDocument();
      });

      expect(builtAction).toMatchObject({
        type: 'NAVIGATE',
        payload: expect.objectContaining({
          name: 'Main',
        }),
      });
    });
  });

  describe('hook export', () => {
    it('returns buildHref and buildAction functions', async () => {
      let hookResult = null;

      const TestScreen = () => {
        hookResult = useLinkBuilder();
        return <div data-testid="test">Test</div>;
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

      expect(hookResult).toHaveProperty('buildHref');
      expect(hookResult).toHaveProperty('buildAction');
      expect(typeof hookResult.buildHref).toBe('function');
      expect(typeof hookResult.buildAction).toBe('function');
    });
  });
});
