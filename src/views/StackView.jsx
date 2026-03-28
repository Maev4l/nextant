import { useState, useEffect, useRef } from 'react';
import { StackItem } from './StackItem.jsx';
import { Header } from './Header.jsx';
import { cn } from '../utils/cn.js';
import { SPRING_DURATION } from '../utils/useAnimation.js';

/**
 * Stack View - renders stack screens with animations
 * Uses native CSS transitions instead of motion/framer
 */
export const StackView = ({
  state,
  navigation,
  descriptors,
  screenContainerStyle,
}) => {
  // Track screens that are animating out (for exit animations)
  const [exitingScreens, setExitingScreens] = useState(new Map());
  const prevRoutesRef = useRef(state.routes);

  // Detect removed routes for exit animations
  useEffect(() => {
    const prevRoutes = prevRoutesRef.current;
    const currentKeys = new Set(state.routes.map(r => r.key));

    // Find routes that were removed
    const removed = prevRoutes.filter(r => !currentKeys.has(r.key));

    if (removed.length > 0) {
      // Add removed routes to exiting state
      setExitingScreens(prev => {
        const next = new Map(prev);
        removed.forEach(route => {
          next.set(route.key, {
            route,
            descriptor: descriptors[route.key] || prevRoutesRef.currentDescriptors?.[route.key],
          });
        });
        return next;
      });

      // Remove after animation completes
      setTimeout(() => {
        setExitingScreens(prev => {
          const next = new Map(prev);
          removed.forEach(route => next.delete(route.key));
          return next;
        });
      }, SPRING_DURATION);
    }

    prevRoutesRef.current = state.routes;
    prevRoutesRef.currentDescriptors = descriptors;
  }, [state.routes, descriptors]);

  const renderScreen = (route, index, isExiting = false) => {
    const descriptor = isExiting
      ? exitingScreens.get(route.key)?.descriptor
      : descriptors[route.key];

    // Guard against missing descriptor during initialization
    if (!descriptor) {
      return null;
    }

    const { options, render } = descriptor;
    const isFocused = !isExiting && state.index === index;

    // Only render focused screen, one below it, and exiting screens
    if (!isExiting && index < state.index - 1) {
      return null;
    }

    const canGoBack = index > 0;
    const headerShown = options.headerShown !== false;
    const gestureEnabled = options.gestureEnabled !== false && canGoBack;
    const animation = options.animation ?? 'slide';
    const title = options.title ?? (typeof options.headerTitle === 'string' ? options.headerTitle : null) ?? route.name;

    // Get previous route for back title
    const previousRoute = index > 0 ? state.routes[index - 1] : null;
    const previousOptions = previousRoute ? descriptors[previousRoute.key]?.options : null;
    const defaultBackTitle = previousOptions?.title ?? previousRoute?.name;

    // Render custom header or default Header component
    const renderHeader = () => {
      if (options.header) {
        return options.header({
          navigation,
          route,
          options,
          back: canGoBack ? {
            title: defaultBackTitle,
            href: undefined,
          } : undefined,
        });
      }

      return (
        <Header
          title={title}
          canGoBack={canGoBack}
          onBackPress={() => navigation.goBack()}
          headerLeft={options.headerLeft}
          headerRight={options.headerRight}
          headerTitle={options.headerTitle}
          headerTitleAlign={options.headerTitleAlign}
          headerBackIcon={options.headerBackIcon}
          headerBackTitle={options.headerBackTitle ?? (options.headerBackTitleVisible !== false ? undefined : '')}
          headerBackTitleStyle={options.headerBackTitleStyle}
          headerBackVisible={options.headerBackVisible}
          headerTintColor={options.headerTintColor}
          headerStyle={options.headerStyle}
          headerTitleStyle={options.headerTitleStyle}
          headerShadowVisible={options.headerShadowVisible}
          headerTransparent={options.headerTransparent}
          headerBackground={options.headerBackground}
        />
      );
    };

    return (
      <StackItem
        key={route.key}
        isFocused={isFocused}
        animation={animation}
        gestureEnabled={gestureEnabled}
        onSwipeBack={() => navigation.goBack()}
        style={screenContainerStyle}
        isExiting={isExiting}
      >
        {headerShown && renderHeader()}
        <div className={cn(
          'nextant-stack-screen-content flex-1 overflow-auto',
          options.headerTransparent && headerShown && 'pt-14'
        )}>
          {render()}
        </div>
      </StackItem>
    );
  };

  return (
    <div className={cn('nextant-stack absolute inset-0 overflow-hidden')}>
      {/* Render current routes */}
      {state.routes.map((route, index) => renderScreen(route, index, false))}

      {/* Render exiting routes (for exit animations) */}
      {Array.from(exitingScreens.entries()).map(([_key, { route }]) =>
        renderScreen(route, -1, true)
      )}
    </div>
  );
};
