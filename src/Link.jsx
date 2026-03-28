import { forwardRef } from 'react';
import { useTheme } from '@react-navigation/core';
import { useLinkProps } from './useLinkProps.js';

/**
 * Link component for navigation
 * Renders an anchor element with navigation behavior
 */
export const Link = forwardRef(({
  screen,
  params,
  action,
  href,
  style,
  className,
  children,
  target,
  ...rest
}, ref) => {
  const { colors } = useTheme();
  const props = useLinkProps({ screen, params, action, href });

  const handleClick = (e) => {
    // Let browser handle if target is set
    if (target) {
      return;
    }

    rest.onClick?.(e);

    if (!e.defaultPrevented) {
      props.onPress(e);
    }
  };

  return (
    <a
      ref={ref}
      href={props.href}
      onClick={handleClick}
      target={target}
      className={className}
      style={{
        color: colors.primary,
        textDecoration: 'none',
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </a>
  );
});

Link.displayName = 'Link';
