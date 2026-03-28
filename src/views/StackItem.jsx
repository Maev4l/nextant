import { useRef, forwardRef, useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/core';
import { cn } from '../utils/cn.js';
import {
  useDragGesture,
  animateElement,
  SPRING_DURATION,
  SPRING_EASING,
} from '../utils/useAnimation.js';

/**
 * Individual stack screen with animation and gesture support
 * Uses native CSS transitions and Web Animations API
 */
export const StackItem = forwardRef(({
  children,
  isFocused,
  animation = 'slide',
  gestureEnabled = true,
  onSwipeBack,
  style,
  // Animation state from parent (reserved for future use)
  _isEntering,
  _isExiting,
  _onAnimationComplete,
}, _ref) => {
  const { colors } = useTheme();
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Track if this is the initial mount - skip transition on first render
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Enable transitions after first render to avoid flash
    const timer = requestAnimationFrame(() => {
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Handle drag gesture for swipe back
  const { handlers } = useDragGesture({
    enabled: gestureEnabled && isFocused,
    onDragStart: () => {
      setIsDragging(true);
    },
    onDragMove: ({ offset }) => {
      // Only allow dragging to the right (positive x)
      const clampedOffset = Math.max(0, offset.x);
      setDragOffset(clampedOffset);
    },
    onDragEnd: ({ offset, velocity }) => {
      const shouldComplete = offset.x > 100 || velocity.x > 500;

      if (shouldComplete && offset.x > 0) {
        // Animate out then call goBack
        const element = containerRef.current;
        if (element) {
          const animation = animateElement(element, [
            { transform: `translateX(${offset.x}px)` },
            { transform: 'translateX(100%)' },
          ]);
          animation?.addEventListener('finish', () => {
            onSwipeBack?.();
          });
        }
      } else {
        // Snap back with animation
        setDragOffset(0);
      }
      setIsDragging(false);
    },
  });

  // Calculate overlay opacity based on drag offset
  const overlayOpacity = gestureEnabled
    ? Math.max(0, 0.5 - (dragOffset / 600))
    : 0.5;

  // Get animation styles based on type
  const getAnimationStyles = () => {
    if (isDragging) {
      return {
        transform: `translateX(${dragOffset}px)`,
        transition: 'none',
      };
    }

    // Skip transition on initial mount to prevent flash/blank screen
    // Only animate after the component has mounted
    const transition = hasMounted
      ? `transform ${SPRING_DURATION}ms ${SPRING_EASING}, opacity ${SPRING_DURATION}ms ${SPRING_EASING}`
      : 'none';

    if (animation === 'none') {
      return { transition: 'none' };
    }

    if (animation === 'fade') {
      return {
        opacity: isFocused ? 1 : 0,
        transition,
      };
    }

    // Default: slide
    return {
      transform: isFocused ? 'translateX(0)' : 'translateX(100%)',
      transition,
    };
  };

  const animationStyles = getAnimationStyles();

  return (
    <>
      {/* Shadow overlay on previous screen */}
      {gestureEnabled && isFocused && (
        <div
          ref={overlayRef}
          className="nextant-stack-overlay absolute inset-0 bg-black pointer-events-none"
          style={{
            opacity: overlayOpacity,
            transition: isDragging ? 'none' : `opacity ${SPRING_DURATION}ms ${SPRING_EASING}`,
          }}
        />
      )}

      {/* Screen content */}
      <div
        ref={containerRef}
        className={cn(
          'nextant-stack-item absolute inset-0 flex flex-col',
          !isFocused && 'pointer-events-none'
        )}
        style={{
          backgroundColor: colors.background,
          ...animationStyles,
          ...style,
        }}
        {...handlers}
      >
        {children}
      </div>
    </>
  );
});

StackItem.displayName = 'StackItem';
