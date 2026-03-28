import { useRef, useEffect, useCallback, useState } from 'react';
import {
  findFocusedRoute,
  getActionFromState as getActionFromStateDefault,
  getPathFromState as getPathFromStateDefault,
  getStateFromPath as getStateFromPathDefault,
} from '@react-navigation/core';
import isEqual from 'fast-deep-equal';
import { createMemoryHistory } from './createMemoryHistory.js';

/**
 * Calculate total history length including route history
 */
const getTotalHistoryLength = (state) => {
  const baseHistoryLength = state.history ? state.history.length : state.routes.length;
  const routeHistoryLength = state.routes.reduce((acc, r) => acc + (r.history?.length || 0), 0);
  return baseHistoryLength + routeHistoryLength;
};

/**
 * Find matching navigation state that changed between two states
 */
const findMatchingState = (a, b) => {
  if (a === undefined || b === undefined || a.key !== b.key) {
    return [undefined, undefined];
  }

  const aHistoryLength = getTotalHistoryLength(a);
  const bHistoryLength = getTotalHistoryLength(b);

  const aRoute = a.routes[a.index];
  const bRoute = b.routes[b.index];

  const aChildState = aRoute.state;
  const bChildState = bRoute.state;

  if (
    aHistoryLength !== bHistoryLength ||
    aRoute.key !== bRoute.key ||
    (aRoute.history?.length || 0) !== (bRoute.history?.length || 0) ||
    aChildState === undefined ||
    bChildState === undefined ||
    aChildState.key !== bChildState.key
  ) {
    return [a, b];
  }

  return findMatchingState(aChildState, bChildState);
};

/**
 * Run async functions in series
 */
const series = (cb) => {
  let queue = Promise.resolve();
  return () => {
    queue = queue.then(cb);
  };
};

const linkingHandlers = new Set();

/**
 * Hook to sync navigation state with browser URL
 */
export const useLinking = (
  ref,
  {
    enabled = true,
    config,
    getStateFromPath = getStateFromPathDefault,
    getPathFromState = getPathFromStateDefault,
    getActionFromState = getActionFromStateDefault,
  }
) => {
  // Warn about multiple linking handlers in dev
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return undefined;
    }

    if (enabled !== false && linkingHandlers.size) {
      console.error(
        'Multiple NavigationContainers with linking enabled detected. ' +
        'Deep links should only be handled in one place.'
      );
    }

    const handler = Symbol();

    if (enabled !== false) {
      linkingHandlers.add(handler);
    }

    return () => {
      linkingHandlers.delete(handler);
    };
  }, [enabled]);

  const [history] = useState(createMemoryHistory);

  // Store options in refs to avoid re-subscriptions
  const enabledRef = useRef(enabled);
  const configRef = useRef(config);
  const getStateFromPathRef = useRef(getStateFromPath);
  const getPathFromStateRef = useRef(getPathFromState);
  const getActionFromStateRef = useRef(getActionFromState);

  useEffect(() => {
    enabledRef.current = enabled;
    configRef.current = config;
    getStateFromPathRef.current = getStateFromPath;
    getPathFromStateRef.current = getPathFromState;
    getActionFromStateRef.current = getActionFromState;
  });

  const validateRoutesNotExistInRootState = useCallback(
    (state) => {
      const navigation = ref.current;
      const rootState = navigation?.getRootState();
      return state?.routes.some((r) => !rootState?.routeNames.includes(r.name));
    },
    [ref]
  );

  // Get initial state from URL
  const getInitialState = useCallback(() => {
    let value;

    if (enabledRef.current) {
      const location = typeof window !== 'undefined' ? window.location : undefined;
      const path = location ? location.pathname + location.search : undefined;

      if (path) {
        value = getStateFromPathRef.current(path, configRef.current);
      }
    }

    return {
      then(onfulfilled) {
        return Promise.resolve(onfulfilled ? onfulfilled(value) : value);
      },
    };
  }, []);

  const previousIndexRef = useRef(undefined);
  const previousStateRef = useRef(undefined);
  const pendingPopStatePathRef = useRef(undefined);

  // Handle browser back/forward
  useEffect(() => {
    previousIndexRef.current = history.index;

    return history.listen(() => {
      const navigation = ref.current;

      if (!navigation || !enabled) {
        return;
      }

      const { location } = window;
      const path = location.pathname + location.search;
      const idx = history.index;
      const previousIndex = previousIndexRef.current ?? 0;

      previousIndexRef.current = idx;
      pendingPopStatePathRef.current = path;

      // Check if we have cached state for this history entry
      const record = history.get(idx);

      if (record?.path === path && record?.state) {
        navigation.resetRoot(record.state);
        return;
      }

      const state = getStateFromPathRef.current(path, configRef.current);

      if (state) {
        if (validateRoutesNotExistInRootState(state)) {
          return;
        }

        if (idx > previousIndex) {
          // Going forward - dispatch action
          const action = getActionFromStateRef.current(state, configRef.current);

          if (action !== undefined) {
            try {
              navigation.dispatch(action);
            } catch (e) {
              console.warn(`Error handling link '${path}': ${e.message}`);
            }
          } else {
            navigation.resetRoot(state);
          }
        } else {
          // Going back - reset to state
          navigation.resetRoot(state);
        }
      } else {
        navigation.resetRoot(state);
      }
    });
  }, [enabled, history, ref, validateRoutesNotExistInRootState]);

  // Sync state changes to URL
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const getPathForRoute = (route, state) => {
      let path;

      // Preserve original URL for wildcard routes
      if (route?.path) {
        const stateForPath = getStateFromPathRef.current(route.path, configRef.current);

        if (stateForPath) {
          const focusedRoute = findFocusedRoute(stateForPath);

          if (
            focusedRoute &&
            focusedRoute.name === route.name &&
            isEqual(focusedRoute.params, route.params)
          ) {
            path = route.path;
          }
        }
      }

      if (path == null) {
        path = getPathFromStateRef.current(state, configRef.current);
      }

      // Preserve hash if route didn't change
      const previousRoute = previousStateRef.current
        ? findFocusedRoute(previousStateRef.current)
        : undefined;

      if (
        previousRoute &&
        route &&
        'key' in previousRoute &&
        'key' in route &&
        previousRoute.key === route.key
      ) {
        path = path + location.hash;
      }

      return path;
    };

    // Record initial state
    if (ref.current) {
      const state = ref.current.getRootState();

      if (state) {
        const route = findFocusedRoute(state);
        const path = getPathForRoute(route, state);

        if (previousStateRef.current === undefined) {
          previousStateRef.current = state;
        }

        history.replace({ path, state });
      }
    }

    const onStateChange = async () => {
      const navigation = ref.current;

      if (!navigation || !enabled) {
        return;
      }

      const previousState = previousStateRef.current;
      const state = navigation.getRootState();

      if (!state) {
        return;
      }

      const pendingPath = pendingPopStatePathRef.current;
      const route = findFocusedRoute(state);
      const path = getPathForRoute(route, state);

      previousStateRef.current = state;
      pendingPopStatePathRef.current = undefined;

      const [previousFocusedState, focusedState] = findMatchingState(previousState, state);

      if (previousFocusedState && focusedState && path !== pendingPath) {
        const historyDelta =
          getTotalHistoryLength(focusedState) - getTotalHistoryLength(previousFocusedState);

        if (historyDelta > 0) {
          // Push new entry
          history.push({ path, state });
        } else if (historyDelta < 0) {
          // Go back
          const nextIndex = history.backIndex({ path });
          const currentIndex = history.index;

          try {
            if (nextIndex !== -1 && nextIndex < currentIndex && history.get(nextIndex)) {
              await history.go(nextIndex - currentIndex);
            } else {
              await history.go(historyDelta);
            }

            history.replace({ path, state });
          } catch (_e) {
            // Navigation interrupted
          }
        } else {
          // Replace current entry
          history.replace({ path, state });
        }
      } else {
        history.replace({ path, state });
      }
    };

    return ref.current?.addListener('state', series(onStateChange));
  }, [enabled, history, ref]);

  return {
    getInitialState,
  };
};
