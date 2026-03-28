import { forwardRef, useRef, useMemo, useImperativeHandle } from 'react';
import {
  BaseNavigationContainer,
  getActionFromState,
  getPathFromState,
  getStateFromPath,
  ThemeProvider,
  validatePathConfig,
} from '@react-navigation/core';
import { LinkingContext } from './LinkingContext.js';
import { LightTheme } from './themes/LightTheme.js';
import { useLinking } from './useLinking.js';
import { useDocumentTitle } from './useDocumentTitle.js';

/**
 * Thenable helper for sync/async initial state
 */
const useThenable = (create) => {
  const thenableRef = useRef();

  if (!thenableRef.current) {
    thenableRef.current = { promise: null, resolved: false, value: undefined };

    const thenable = create();

    if (thenable) {
      thenableRef.current.promise = thenable.then((value) => {
        thenableRef.current.resolved = true;
        thenableRef.current.value = value;
        return value;
      });
    } else {
      thenableRef.current.resolved = true;
    }
  }

  if (!thenableRef.current.resolved && thenableRef.current.promise) {
    throw thenableRef.current.promise;
  }

  return [thenableRef.current.resolved, thenableRef.current.value];
};

const NavigationContainerInner = (
  {
    direction = 'ltr',
    theme = LightTheme,
    linking,
    fallback = null,
    documentTitle,
    onStateChange,
    initialState,
    children,
    ...rest
  },
  ref
) => {
  // Validate linking config
  if (linking?.config) {
    validatePathConfig(linking.config);
  }

  const refContainer = useRef(null);

  useDocumentTitle(refContainer, documentTitle);

  const linkingConfig = useMemo(() => {
    if (linking == null) {
      return {
        options: {
          enabled: false,
        },
      };
    }

    return {
      options: {
        ...linking,
        enabled: linking.enabled !== false,
        prefixes: linking.prefixes ?? ['*'],
        getStateFromPath: linking?.getStateFromPath ?? getStateFromPath,
        getPathFromState: linking?.getPathFromState ?? getPathFromState,
        getActionFromState: linking?.getActionFromState ?? getActionFromState,
      },
    };
  }, [linking]);

  const { getInitialState } = useLinking(refContainer, linkingConfig.options);

  // Expose ref
  useImperativeHandle(ref, () => refContainer.current);

  // Get initial state from URL if linking enabled
  const [isLinkStateResolved, initialStateFromLink] = useThenable(() => {
    if (initialState != null || !linkingConfig.options.enabled) {
      return undefined;
    }

    return getInitialState();
  });

  const isStateReady = initialState != null || isLinkStateResolved;

  if (!isStateReady) {
    return (
      <div dir={direction}>
        <ThemeProvider value={theme}>{fallback}</ThemeProvider>
      </div>
    );
  }

  return (
    <div dir={direction} style={{ height: '100%' }}>
      <LinkingContext.Provider value={linkingConfig}>
        <BaseNavigationContainer
          {...rest}
          theme={theme}
          initialState={initialState ?? initialStateFromLink}
          onStateChange={(state) => {
            onStateChange?.(state);
          }}
          ref={refContainer}
        >
          {children}
        </BaseNavigationContainer>
      </LinkingContext.Provider>
    </div>
  );
};

/**
 * Container component that manages navigation state
 * Should wrap the entire app
 */
export const NavigationContainer = forwardRef(NavigationContainerInner);

NavigationContainer.displayName = 'NavigationContainer';
