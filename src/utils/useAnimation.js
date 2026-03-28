import { useRef, useCallback, useEffect } from 'react';

/**
 * Spring animation configuration converted to CSS cubic-bezier
 * Approximates spring(damping: 30, stiffness: 300)
 */
export const SPRING_EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
export const SPRING_DURATION = 300;

/**
 * Animate an element using Web Animations API
 * Falls back to CSS transitions in environments without WAAPI support
 * @param {HTMLElement} element - Element to animate
 * @param {Keyframe[]} keyframes - Animation keyframes
 * @param {KeyframeAnimationOptions} options - Animation options
 * @returns {Animation|null} - Animation object or null
 */
export const animateElement = (element, keyframes, options = {}) => {
  if (!element) return null;

  // Check if Web Animations API is available
  if (typeof element.animate !== 'function') {
    // Fallback: apply final keyframe directly with CSS transition
    const finalKeyframe = keyframes[keyframes.length - 1];
    if (finalKeyframe) {
      element.style.transition = `all ${SPRING_DURATION}ms ${SPRING_EASING}`;
      Object.entries(finalKeyframe).forEach(([key, value]) => {
        element.style[key] = value;
      });
    }
    // Return a mock animation object for consistency
    return {
      addEventListener: (event, callback) => {
        if (event === 'finish') {
          setTimeout(callback, options.duration || SPRING_DURATION);
        }
      },
      cancel: () => {},
    };
  }

  const animation = element.animate(keyframes, {
    duration: SPRING_DURATION,
    easing: SPRING_EASING,
    fill: 'forwards',
    ...options,
  });

  return animation;
};

/**
 * Hook for managing drag gestures with momentum
 */
export const useDragGesture = ({
  onDragStart,
  onDragMove,
  onDragEnd,
  _axis = 'x',
  enabled = true,
}) => {
  const elementRef = useRef(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleStart = useCallback((clientX, clientY) => {
    if (!enabled) return;
    isDragging.current = true;
    startPos.current = { x: clientX, y: clientY };
    currentPos.current = { x: 0, y: 0 };
    lastPos.current = { x: clientX, y: clientY };
    lastTime.current = Date.now();
    velocity.current = { x: 0, y: 0 };
    onDragStart?.({ offset: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } });
  }, [enabled, onDragStart]);

  const handleMove = useCallback((clientX, clientY) => {
    if (!isDragging.current) return;

    const now = Date.now();
    const dt = Math.max(now - lastTime.current, 1);

    const offset = {
      x: clientX - startPos.current.x,
      y: clientY - startPos.current.y,
    };

    // Calculate velocity (pixels per second)
    velocity.current = {
      x: ((clientX - lastPos.current.x) / dt) * 1000,
      y: ((clientY - lastPos.current.y) / dt) * 1000,
    };

    lastPos.current = { x: clientX, y: clientY };
    lastTime.current = now;
    currentPos.current = offset;

    onDragMove?.({ offset, velocity: velocity.current });
  }, [onDragMove]);

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    onDragEnd?.({
      offset: currentPos.current,
      velocity: velocity.current,
    });
  }, [onDragEnd]);

  // Touch event handlers
  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const onTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const onTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Mouse event handlers (for desktop)
  const onMouseDown = useCallback((e) => {
    handleStart(e.clientX, e.clientY);

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => {
      handleEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [handleStart, handleMove, handleEnd]);

  return {
    ref: elementRef,
    handlers: enabled ? {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
    } : {},
  };
};

/**
 * Hook for animated value with interpolation
 */
export const useAnimatedValue = (initialValue = 0) => {
  const valueRef = useRef(initialValue);
  const listenersRef = useRef(new Set());
  const animationRef = useRef(null);

  const setValue = useCallback((newValue, animated = false, options = {}) => {
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    if (!animated) {
      valueRef.current = newValue;
      listenersRef.current.forEach(listener => listener(newValue));
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startValue = valueRef.current;
      const startTime = performance.now();
      const duration = options.duration || SPRING_DURATION;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic approximation of spring
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (newValue - startValue) * eased;

        valueRef.current = currentValue;
        listenersRef.current.forEach(listener => listener(currentValue));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          valueRef.current = newValue;
          listenersRef.current.forEach(listener => listener(newValue));
          options.onComplete?.();
          resolve();
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    });
  }, []);

  const subscribe = useCallback((listener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const get = useCallback(() => valueRef.current, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { setValue, subscribe, get };
};

/**
 * Interpolate a value from one range to another
 */
export const interpolate = (value, inputRange, outputRange) => {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;

  // Clamp value to input range
  const clampedValue = Math.max(inMin, Math.min(inMax, value));

  // Calculate normalized position
  const normalized = (clampedValue - inMin) / (inMax - inMin);

  // Interpolate to output range
  return outMin + normalized * (outMax - outMin);
};
