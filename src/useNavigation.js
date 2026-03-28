import { useContext } from 'react';
import {
  useNavigation as useNavigationCore,
  NavigationContext,
} from '@react-navigation/core';

/**
 * Hook to access navigation object
 *
 * Web-safe wrapper that catches initialization errors during
 * the first render cycle and returns the core hook result
 */
export const useNavigation = () => {
  const ctx = useContext(NavigationContext);

  // If context exists, use the core implementation
  // which properly merges with NavigationHelpersContext
  if (ctx !== undefined) {
    return useNavigationCore();
  }

  // During initial render, context might not be ready
  // This shouldn't happen if component is inside a navigator,
  // but we handle it gracefully
  throw new Error(
    "Couldn't find a navigation object. Is your component inside a navigator?"
  );
};
