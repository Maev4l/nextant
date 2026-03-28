import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@react-navigation/core';
import { DrawerContent } from './DrawerContent.jsx';
import { Header } from './Header.jsx';
import { cn } from '../utils/cn.js';
import {
  useDragGesture,
  animateElement,
  interpolate,
  SPRING_DURATION,
  SPRING_EASING,
} from '../utils/useAnimation.js';

const DEFAULT_DRAWER_WIDTH = 280;

/**
 * Drawer View - renders drawer panel and content
 * Uses native CSS transitions and Web Animations API
 *
 * Supports react-navigation compatible options:
 * - drawerContent: custom drawer content component
 * - drawerPosition: 'left' | 'right'
 * - drawerType: 'front' | 'back' | 'slide' | 'permanent'
 * - drawerStyle: width, backgroundColor
 * - overlayStyle: overlay color/opacity
 * - overlayAccessibilityLabel: accessibility label for overlay
 * - sceneStyle: main content style
 * - lazy: lazy load screens
 * - header/headerShown: per-screen headers
 * - All drawer item styling options
 */
export const DrawerView = ({
  state,
  navigation,
  descriptors,
  drawerContent: CustomDrawerContent,
  drawerPosition = 'left',
  drawerType = 'front',
  drawerStyle,
  overlayStyle,
  overlayAccessibilityLabel = 'Close drawer',
  sceneStyle,
  gestureEnabled = true,
  lazy = true,
  // Navigator-level drawer item options
  drawerContentStyle,
  drawerContentContainerStyle,
  drawerActiveTintColor,
  drawerInactiveTintColor,
  drawerActiveBackgroundColor,
  drawerInactiveBackgroundColor,
  drawerLabelStyle,
  drawerItemStyle,
}) => {
  const { colors } = useTheme();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  // Track loaded screens for lazy rendering
  const [loadedScreens, setLoadedScreens] = useState(() => new Set([state.index]));

  // Check if drawer is open from history
  const isOpen = state.history?.some((h) => h.type === 'drawer') ?? false;
  const wasOpenRef = useRef(isOpen);

  // Get drawer width from style or default
  const drawerWidth = drawerStyle?.width || DEFAULT_DRAWER_WIDTH;

  // Track drag offset
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate positions
  const closedPosition = drawerPosition === 'left' ? -drawerWidth : drawerWidth;
  const openPosition = 0;

  // Emit transition events
  const emitTransitionStart = useCallback((closing) => {
    navigation.emit({
      type: 'transitionStart',
      data: { closing },
    });
  }, [navigation]);

  const emitTransitionEnd = useCallback((closing) => {
    navigation.emit({
      type: 'transitionEnd',
      data: { closing },
    });
  }, [navigation]);

  // Mark screen as loaded when focused
  useEffect(() => {
    setLoadedScreens((prev) => {
      if (prev.has(state.index)) return prev;
      const next = new Set(prev);
      next.add(state.index);
      return next;
    });
  }, [state.index]);

  // Animate drawer when open state changes
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    if (wasOpen !== isOpen && !isDragging) {
      emitTransitionStart(!isOpen);

      // Animate drawer panel
      if (drawerRef.current) {
        const animation = animateElement(drawerRef.current, [
          { transform: `translateX(${wasOpen ? openPosition : closedPosition}px)` },
          { transform: `translateX(${isOpen ? openPosition : closedPosition}px)` },
        ]);
        animation?.addEventListener('finish', () => {
          emitTransitionEnd(!isOpen);
        });
      }

      wasOpenRef.current = isOpen;
    }
  }, [isOpen, isDragging, closedPosition, openPosition, emitTransitionStart, emitTransitionEnd]);

  const closeDrawer = () => {
    navigation.closeDrawer();
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  // Handle drag gesture
  const { handlers } = useDragGesture({
    enabled: gestureEnabled && drawerType !== 'permanent',
    onDragStart: () => {
      setIsDragging(true);
    },
    onDragMove: ({ offset }) => {
      let clampedOffset;
      if (drawerPosition === 'left') {
        if (isOpen) {
          // Dragging to close (negative offset)
          clampedOffset = Math.min(0, Math.max(-drawerWidth, offset.x));
        } else {
          // Dragging to open (positive offset)
          clampedOffset = Math.max(0, Math.min(drawerWidth, offset.x));
        }
      } else {
        // Right drawer
        if (isOpen) {
          clampedOffset = Math.max(0, Math.min(drawerWidth, offset.x));
        } else {
          clampedOffset = Math.min(0, Math.max(-drawerWidth, offset.x));
        }
      }
      setDragOffset(clampedOffset);
    },
    onDragEnd: ({ offset, velocity }) => {
      setIsDragging(false);
      setDragOffset(0);

      if (drawerPosition === 'left') {
        const shouldClose = offset.x < -50 || velocity.x < -500;
        const shouldOpen = offset.x > 50 || velocity.x > 500;

        if (isOpen && shouldClose) {
          closeDrawer();
        } else if (!isOpen && shouldOpen) {
          openDrawer();
        }
      } else {
        const shouldClose = offset.x > 50 || velocity.x > 500;
        const shouldOpen = offset.x < -50 || velocity.x < -500;

        if (isOpen && shouldClose) {
          closeDrawer();
        } else if (!isOpen && shouldOpen) {
          openDrawer();
        }
      }
    },
  });

  const DrawerContentComponent = CustomDrawerContent || DrawerContent;

  // Current screen
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor?.options || {};

  // Check if header should be shown
  const headerShown = focusedOptions.headerShown !== false;
  const title = focusedOptions.title ?? focusedOptions.headerTitle ?? focusedRoute.name;

  // Render screen content
  const renderScreen = (route, index) => {
    const { render } = descriptors[route.key];
    const isFocused = state.index === index;
    const isLoaded = !lazy || loadedScreens.has(index);

    if (!isLoaded) {
      return null;
    }

    return (
      <div
        key={route.key}
        className={cn(
          'absolute inset-0',
          isFocused ? 'z-10' : 'z-0 pointer-events-none'
        )}
        style={{
          visibility: isFocused ? 'visible' : 'hidden',
        }}
      >
        {render()}
      </div>
    );
  };

  // Calculate current drawer position
  const getDrawerTransform = () => {
    if (isDragging) {
      const basePosition = isOpen ? openPosition : closedPosition;
      return `translateX(${basePosition + dragOffset}px)`;
    }
    return `translateX(${isOpen ? openPosition : closedPosition}px)`;
  };

  // Calculate overlay opacity
  const getOverlayOpacity = () => {
    if (isDragging) {
      const progress = drawerPosition === 'left'
        ? interpolate(
            isOpen ? dragOffset : dragOffset,
            isOpen ? [-drawerWidth, 0] : [0, drawerWidth],
            isOpen ? [0, 0.5] : [0, 0.5]
          )
        : interpolate(
            dragOffset,
            isOpen ? [0, drawerWidth] : [-drawerWidth, 0],
            isOpen ? [0.5, 0] : [0.5, 0]
          );
      return isOpen ? 0.5 + progress : progress;
    }
    return isOpen ? 0.5 : 0;
  };

  // Calculate content transform for slide type
  const getContentTransform = () => {
    if (drawerType !== 'slide' && drawerType !== 'back') {
      return 'translateX(0)';
    }

    if (isDragging) {
      const offset = drawerPosition === 'left'
        ? isOpen ? drawerWidth + dragOffset : dragOffset
        : isOpen ? -drawerWidth + dragOffset : dragOffset;
      return `translateX(${offset}px)`;
    }

    const offset = isOpen
      ? (drawerPosition === 'left' ? drawerWidth : -drawerWidth)
      : 0;
    return `translateX(${offset}px)`;
  };

  const transition = isDragging
    ? 'none'
    : `transform ${SPRING_DURATION}ms ${SPRING_EASING}, opacity ${SPRING_DURATION}ms ${SPRING_EASING}`;

  // Permanent drawer renders inline
  if (drawerType === 'permanent') {
    return (
      <div className={cn(
        'nextant-drawer flex h-full w-full',
        drawerPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
      )}>
        {/* Permanent drawer panel */}
        <aside
          className="nextant-drawer-panel flex flex-col shrink-0 border-r"
          style={{
            width: drawerWidth,
            backgroundColor: drawerStyle?.backgroundColor || colors.card,
            borderColor: colors.border,
          }}
        >
          <DrawerContentComponent
            state={state}
            navigation={navigation}
            descriptors={descriptors}
            drawerContentStyle={drawerContentStyle}
            drawerContentContainerStyle={drawerContentContainerStyle}
            drawerActiveTintColor={drawerActiveTintColor}
            drawerInactiveTintColor={drawerInactiveTintColor}
            drawerActiveBackgroundColor={drawerActiveBackgroundColor}
            drawerInactiveBackgroundColor={drawerInactiveBackgroundColor}
            drawerLabelStyle={drawerLabelStyle}
            drawerItemStyle={drawerItemStyle}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col" style={sceneStyle}>
          {headerShown && (
            focusedOptions.header ? (
              focusedOptions.header({
                navigation,
                route: focusedRoute,
                options: focusedOptions,
              })
            ) : (
              <Header
                title={title}
                canGoBack={false}
                onBackPress={() => {}}
                headerLeft={focusedOptions.headerLeft}
                headerRight={focusedOptions.headerRight}
                headerTitle={focusedOptions.headerTitle}
                headerTitleAlign={focusedOptions.headerTitleAlign}
                headerTintColor={focusedOptions.headerTintColor}
                headerStyle={focusedOptions.headerStyle}
                headerTitleStyle={focusedOptions.headerTitleStyle}
                headerShadowVisible={focusedOptions.headerShadowVisible}
                headerTransparent={focusedOptions.headerTransparent}
                headerBackground={focusedOptions.headerBackground}
              />
            )
          )}
          <div className="flex-1 relative overflow-hidden">
            {state.routes.map((route, index) => renderScreen(route, index))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('nextant-drawer relative h-full w-full overflow-hidden')}>
      {/* Main content */}
      <div
        ref={contentRef}
        className="nextant-drawer-scene h-full w-full flex flex-col"
        style={{
          transform: getContentTransform(),
          transition,
          ...sceneStyle,
        }}
      >
        {headerShown && (
          focusedOptions.header ? (
            focusedOptions.header({
              navigation,
              route: focusedRoute,
              options: focusedOptions,
            })
          ) : (
            <Header
              title={title}
              canGoBack={false}
              onBackPress={() => {}}
              headerLeft={focusedOptions.headerLeft ?? (() => (
                <button
                  className="p-2 -ml-2"
                  onClick={() => navigation.toggleDrawer()}
                  aria-label="Toggle drawer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              ))}
              headerRight={focusedOptions.headerRight}
              headerTitle={focusedOptions.headerTitle}
              headerTitleAlign={focusedOptions.headerTitleAlign}
              headerTintColor={focusedOptions.headerTintColor}
              headerStyle={focusedOptions.headerStyle}
              headerTitleStyle={focusedOptions.headerTitleStyle}
              headerShadowVisible={focusedOptions.headerShadowVisible}
              headerTransparent={focusedOptions.headerTransparent}
              headerBackground={focusedOptions.headerBackground}
            />
          )
        )}
        <div className="flex-1 relative overflow-hidden">
          {state.routes.map((route, index) => renderScreen(route, index))}
        </div>
      </div>

      {/* Overlay - not shown for 'back' type */}
      {drawerType !== 'back' && (
        <div
          ref={overlayRef}
          className="nextant-drawer-overlay absolute inset-0"
          style={{
            opacity: getOverlayOpacity(),
            backgroundColor: overlayStyle?.backgroundColor || 'black',
            pointerEvents: isOpen ? 'auto' : 'none',
            transition,
          }}
          onClick={closeDrawer}
          aria-label={overlayAccessibilityLabel}
          role="button"
          tabIndex={isOpen ? 0 : -1}
        />
      )}

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className={cn(
          'nextant-drawer-panel absolute top-0 bottom-0 flex flex-col',
          drawerPosition === 'left' ? 'left-0' : 'right-0',
          drawerType === 'back' ? '-z-10' : 'z-20'
        )}
        style={{
          width: drawerWidth,
          backgroundColor: drawerStyle?.backgroundColor || colors.card,
          transform: getDrawerTransform(),
          transition,
          boxShadow: isOpen && drawerType !== 'back' ? '4px 0 12px rgba(0, 0, 0, 0.15)' : 'none',
        }}
        {...handlers}
      >
        <DrawerContentComponent
          state={state}
          navigation={navigation}
          descriptors={descriptors}
          drawerContentStyle={drawerContentStyle}
          drawerContentContainerStyle={drawerContentContainerStyle}
          drawerActiveTintColor={drawerActiveTintColor}
          drawerInactiveTintColor={drawerInactiveTintColor}
          drawerActiveBackgroundColor={drawerActiveBackgroundColor}
          drawerInactiveBackgroundColor={drawerInactiveBackgroundColor}
          drawerLabelStyle={drawerLabelStyle}
          drawerItemStyle={drawerItemStyle}
        />
      </aside>

      {/* Edge swipe area to open drawer */}
      {gestureEnabled && !isOpen && drawerType !== 'permanent' && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-5 z-30',
            drawerPosition === 'left' ? 'left-0' : 'right-0'
          )}
          {...handlers}
        />
      )}
    </div>
  );
};
