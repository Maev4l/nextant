import { useEffect, useRef } from 'react';
import { findFocusedRoute } from '@react-navigation/core';

/**
 * Hook to sync document.title with navigation state
 *
 * Note: We store screen options via setOptions callback since
 * BaseNavigationContainer doesn't expose getOptions method
 */
export const useDocumentTitle = (ref, documentTitle = {}) => {
  const { enabled = true, formatter = (options, route) => options?.title ?? route?.name } = documentTitle;

  // Store options set by screens via navigation.setOptions
  const optionsRef = useRef({});

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const navigation = ref.current;

    if (!navigation) {
      return;
    }

    const updateTitle = () => {
      const state = navigation.getRootState();

      if (!state) {
        return;
      }

      const route = findFocusedRoute(state);

      // Get options from cached store or use route params
      const routeOptions = route?.key ? optionsRef.current[route.key] : undefined;
      const title = formatter(routeOptions, route);

      if (title) {
        document.title = title;
      }
    };

    // Set initial title
    updateTitle();

    // Update on state change
    const unsubscribe = navigation.addListener('state', updateTitle);

    // Also listen for options changes
    const unsubscribeOptions = navigation.addListener('options', (e) => {
      if (e.data?.options && e.target) {
        optionsRef.current[e.target] = e.data.options;
        updateTitle();
      }
    });

    return () => {
      unsubscribe();
      unsubscribeOptions?.();
    };
  }, [enabled, formatter, ref]);
};
