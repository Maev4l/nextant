import { useState, useCallback, useEffect } from 'react';
import { TabBar } from './TabBar.jsx';
import { Header } from './Header.jsx';
import { cn } from '../utils/cn.js';
import { SPRING_DURATION, SPRING_EASING } from '../utils/useAnimation.js';

/**
 * Tab View - renders tab content and tab bar
 * Uses native CSS transitions instead of motion/framer
 *
 * Supports react-navigation compatible options:
 * - tabBar: custom tab bar component
 * - tabBarPosition: 'bottom' | 'top'
 * - lazy: lazy load screens
 * - animation: 'none' | 'fade' | 'shift'
 * - header/headerShown: per-tab headers
 * - All tabBar* styling options
 */
export const TabView = ({
  state,
  navigation,
  descriptors,
  tabBar: CustomTabBar,
  tabBarPosition = 'bottom',
  lazy = true,
  animation = 'none',
  sceneContainerStyle,
  // Navigator-level tab bar options (from screenOptions)
  tabBarStyle,
  tabBarBackground,
  tabBarActiveTintColor,
  tabBarInactiveTintColor,
  tabBarActiveBackgroundColor,
  tabBarInactiveBackgroundColor,
  tabBarLabelStyle,
  tabBarIconStyle,
  tabBarItemStyle,
  tabBarShowLabel,
  tabBarLabelPosition,
}) => {
  const focusedRouteKey = state.routes[state.index]?.key;

  // Track loaded tabs by route key (matches react-navigation pattern)
  // Using useState and calling setLoaded during render triggers re-render
  const [loaded, setLoaded] = useState([focusedRouteKey]);

  // Add focused route to loaded list during render (triggers re-render if new)
  if (focusedRouteKey && !loaded.includes(focusedRouteKey)) {
    setLoaded([...loaded, focusedRouteKey]);
  }

  // Track previous index for animation direction
  const [prevIndex, setPrevIndex] = useState(state.index);

  // Update previous index after animation completes
  useEffect(() => {
    if (animation !== 'none' && state.index !== prevIndex) {
      const timer = setTimeout(() => {
        setPrevIndex(state.index);
      }, SPRING_DURATION);
      return () => clearTimeout(timer);
    } else {
      setPrevIndex(state.index);
    }
  }, [state.index, animation, prevIndex]);

  // Mark tab as loaded when clicked (for pre-loading optimization)
  const onTabFocus = useCallback((index) => {
    const routeKey = state.routes[index]?.key;
    if (routeKey && !loaded.includes(routeKey)) {
      setLoaded(prev => [...prev, routeKey]);
    }
  }, [state.routes, loaded]);

  const TabBarComponent = CustomTabBar || TabBar;

  const renderTabBar = () => {
    // Check if all screens have tabBarStyle.display = 'none'
    const focusedOptions = descriptors[state.routes[state.index]?.key]?.options || {};
    if (focusedOptions.tabBarStyle?.display === 'none') {
      return null;
    }

    return (
      <TabBarComponent
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        onTabPress={(index) => {
          onTabFocus(index);
          const route = state.routes[index];
          navigation.navigate(route.name);
        }}
        tabBarStyle={tabBarStyle}
        tabBarBackground={tabBarBackground}
        tabBarActiveTintColor={tabBarActiveTintColor}
        tabBarInactiveTintColor={tabBarInactiveTintColor}
        tabBarActiveBackgroundColor={tabBarActiveBackgroundColor}
        tabBarInactiveBackgroundColor={tabBarInactiveBackgroundColor}
        tabBarLabelStyle={tabBarLabelStyle}
        tabBarIconStyle={tabBarIconStyle}
        tabBarItemStyle={tabBarItemStyle}
        tabBarShowLabel={tabBarShowLabel}
        tabBarLabelPosition={tabBarLabelPosition}
      />
    );
  };

  // Get animation styles for a screen
  const getAnimationStyles = (index, isFocused) => {
    if (animation === 'none') {
      return {};
    }

    const transition = `opacity ${SPRING_DURATION}ms ${SPRING_EASING}, transform ${SPRING_DURATION}ms ${SPRING_EASING}`;

    if (animation === 'fade') {
      return {
        opacity: isFocused ? 1 : 0,
        transition,
      };
    }

    if (animation === 'shift') {
      if (isFocused) {
        return {
          opacity: 1,
          transform: 'translateX(0)',
          transition,
        };
      } else {
        // Exiting screen shifts opposite to direction
        const exitDirection = index < state.index ? -1 : 1;
        return {
          opacity: 0,
          transform: `translateX(${exitDirection * 20}px)`,
          transition,
        };
      }
    }

    return {};
  };

  const renderScreen = (route, index) => {
    const descriptor = descriptors[route.key];
    // Guard against missing descriptor (can happen during initialization)
    if (!descriptor) {
      return null;
    }

    const { options, render } = descriptor;
    const isFocused = state.index === index;

    // Check if screen should be rendered (lazy loading by route key)
    if (lazy && !loaded.includes(route.key) && !isFocused) {
      return null;
    }

    // Check if header should be shown for this tab
    const headerShown = options.headerShown === true;
    const title = options.title ?? options.headerTitle ?? route.name;

    const animationStyles = getAnimationStyles(index, isFocused);

    const screenContent = (
      <div
        key={route.key}
        data-tab-screen={route.name}
        data-focused={isFocused}
        className={cn(
          'nextant-tab-screen absolute inset-0 flex flex-col',
          isFocused ? 'z-10' : 'z-0 pointer-events-none'
        )}
        style={{
          // Ensure screen has dimensions - use absolute positioning values
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Always show focused screen, hide others (unless animating)
          display: isFocused || animation !== 'none' ? 'flex' : 'none',
          flexDirection: 'column',
          ...animationStyles,
        }}
      >
        {/* Per-tab header */}
        {headerShown && (
          options.header ? (
            options.header({
              navigation,
              route,
              options,
            })
          ) : (
            <Header
              title={title}
              canGoBack={false}
              onBackPress={() => {}}
              headerLeft={options.headerLeft}
              headerRight={options.headerRight}
              headerTitle={options.headerTitle}
              headerTitleAlign={options.headerTitleAlign}
              headerTintColor={options.headerTintColor}
              headerStyle={options.headerStyle}
              headerTitleStyle={options.headerTitleStyle}
              headerShadowVisible={options.headerShadowVisible}
              headerTransparent={options.headerTransparent}
              headerBackground={options.headerBackground}
            />
          )
        )}
        <div className="flex-1 relative min-h-0">
          {render()}
        </div>
      </div>
    );

    return screenContent;
  };

  return (
    <div className={cn(
      'nextant-tab-view flex h-full',
      tabBarPosition === 'top' ? 'flex-col-reverse' : 'flex-col'
    )}>
      {/* Tab Content */}
      <div
        className="nextant-tab-content flex-1 relative overflow-hidden"
        style={sceneContainerStyle}
      >
        {state.routes.map((route, index) => renderScreen(route, index))}
      </div>

      {/* Tab Bar */}
      {renderTabBar()}
    </div>
  );
};
