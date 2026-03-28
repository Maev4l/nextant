import { useCallback, useContext } from 'react';
import {
  CommonActions,
  NavigationContainerRefContext,
} from '@react-navigation/core';
import { useLinkingContext } from './LinkingContext.js';

/**
 * Hook for imperative navigation to a path
 */
export const useLinkTo = () => {
  // Use context directly to avoid proxy errors
  const navigation = useContext(NavigationContainerRefContext);
  const linking = useLinkingContext();

  const linkTo = useCallback(
    (path, options) => {
      if (!navigation?.isReady()) {
        throw new Error(
          'useLinkTo: Navigation is not ready yet'
        );
      }

      if (!linking?.options?.enabled) {
        throw new Error(
          'useLinkTo requires linking to be enabled in NavigationContainer'
        );
      }

      const { getStateFromPath, getActionFromState, config } = linking.options;

      const state = getStateFromPath(path, config);

      if (!state) {
        throw new Error(`Failed to parse path: ${path}`);
      }

      const action = getActionFromState(state, config);

      if (action) {
        if (options?.reset) {
          navigation.dispatch(CommonActions.reset(state));
        } else {
          navigation.dispatch(action);
        }
      } else {
        navigation.reset(state);
      }
    },
    [navigation, linking]
  );

  return linkTo;
};
