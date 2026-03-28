import { useMemo, useContext } from 'react';
import {
  CommonActions,
  NavigationContext,
} from '@react-navigation/core';
import { useLinkBuilder } from './useLinkBuilder.js';
import { useLinkingContext } from './LinkingContext.js';

/**
 * Hook to get props for a link element
 * Returns href and onPress handler
 */
export const useLinkProps = ({ screen, params, action, href: providedHref }) => {
  // Use context directly to avoid throwing if not ready
  const navigation = useContext(NavigationContext);
  const { buildHref, buildAction } = useLinkBuilder();
  const linking = useLinkingContext();

  const href = useMemo(() => {
    if (providedHref) {
      return providedHref;
    }

    if (screen) {
      return buildHref(screen, params);
    }

    return undefined;
  }, [providedHref, screen, params, buildHref]);

  const onPress = useMemo(() => {
    return (e) => {
      // Skip if modifier keys pressed (let browser handle)
      if (e?.metaKey || e?.altKey || e?.ctrlKey || e?.shiftKey) {
        return;
      }

      // Prevent default anchor behavior
      e?.preventDefault?.();

      // Bail if navigation not ready yet
      if (!navigation) {
        console.warn('Navigation not ready for Link press');
        return;
      }

      if (action) {
        navigation.dispatch(action);
      } else if (providedHref && linking?.options?.enabled) {
        const linkAction = buildAction(providedHref);

        if (linkAction) {
          navigation.dispatch(linkAction);
        }
      } else if (screen) {
        navigation.dispatch(CommonActions.navigate(screen, params));
      }
    };
  }, [action, providedHref, screen, params, navigation, linking, buildAction]);

  return {
    href,
    onPress,
    accessibilityRole: 'link',
  };
};
