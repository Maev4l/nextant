import { useCallback, useContext } from 'react';
import {
  getPathFromState,
  NavigationContainerRefContext,
} from '@react-navigation/core';
import { useLinkingContext } from './LinkingContext.js';

/**
 * Hook to build href strings from screen names and params
 */
export const useLinkBuilder = () => {
  // Use context directly to avoid proxy that logs errors
  const navigation = useContext(NavigationContainerRefContext);
  const linking = useLinkingContext();

  const buildHref = useCallback(
    (name, params) => {
      // Check if navigation is ready before accessing
      if (!navigation?.isReady()) {
        return undefined;
      }

      const state = navigation.getRootState();

      if (!state) {
        return undefined;
      }

      // Build a minimal state to get path
      const focusedRoute = {
        name,
        params,
      };

      // Create state with the target route focused
      const targetState = {
        ...state,
        routes: [focusedRoute],
        index: 0,
      };

      const getPath = linking?.options?.getPathFromState ?? getPathFromState;

      try {
        return getPath(targetState, linking?.options?.config);
      } catch (_e) {
        return undefined;
      }
    },
    [navigation, linking]
  );

  const buildAction = useCallback(
    (href) => {
      if (!linking?.options?.getActionFromState || !linking?.options?.getStateFromPath) {
        return undefined;
      }

      const state = linking.options.getStateFromPath(href, linking.options.config);

      if (!state) {
        return undefined;
      }

      return linking.options.getActionFromState(state, linking.options.config);
    },
    [linking]
  );

  return {
    buildHref,
    buildAction,
  };
};
