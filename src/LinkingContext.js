import { createContext, useContext } from 'react';

/**
 * Context for linking configuration
 */
export const LinkingContext = createContext({
  options: {
    enabled: false,
  },
});

export const useLinkingContext = () => useContext(LinkingContext);
