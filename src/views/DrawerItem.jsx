import { useTheme } from '@react-navigation/core';
import { Button } from '../ui/button.jsx';
import { cn } from '../utils/cn.js';

/**
 * Individual drawer menu item
 *
 * Supports react-navigation compatible options:
 * - drawerActiveTintColor: active icon/label color
 * - drawerInactiveTintColor: inactive icon/label color
 * - drawerActiveBackgroundColor: active background
 * - drawerInactiveBackgroundColor: inactive background
 * - drawerItemStyle: item container style
 * - drawerLabelStyle: label text style
 * - drawerItemTestID: test ID for item
 */
export const DrawerItem = ({
  label,
  icon: Icon,
  isFocused,
  onPress,
  onLongPress,
  options = {},
  className,
}) => {
  const { colors } = useTheme();

  // Extract options with theme defaults
  const {
    drawerActiveTintColor,
    drawerInactiveTintColor,
    drawerActiveBackgroundColor,
    drawerInactiveBackgroundColor,
    drawerItemStyle,
    drawerLabelStyle,
    drawerItemTestID,
  } = options;

  // Determine colors
  const activeColor = drawerActiveTintColor || colors.primary;
  const inactiveColor = drawerInactiveTintColor || colors.text;
  const tintColor = isFocused ? activeColor : inactiveColor;

  const activeBackground = drawerActiveBackgroundColor || 'rgba(0, 0, 0, 0.05)';
  const inactiveBackground = drawerInactiveBackgroundColor || 'transparent';
  const backgroundColor = isFocused ? activeBackground : inactiveBackground;

  const renderIcon = () => {
    if (!Icon) return null;

    const iconProps = {
      focused: isFocused,
      color: tintColor,
      size: 24,
    };

    if (typeof Icon === 'function') {
      const result = Icon(iconProps);
      if (result?.type) return result;
    }

    return <Icon className="h-5 w-5" style={{ color: tintColor }} />;
  };

  // Support label as string or render function
  const renderLabel = () => {
    if (typeof label === 'function') {
      return label({ focused: isFocused, color: tintColor });
    }
    return (
      <span
        className="text-sm"
        style={{ color: tintColor, ...drawerLabelStyle }}
      >
        {label}
      </span>
    );
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start gap-3 px-4 py-3 h-auto rounded-none',
        'hover:bg-accent/50',
        className
      )}
      style={{
        color: tintColor,
        backgroundColor,
        ...drawerItemStyle,
      }}
      onClick={onPress}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.();
      }}
      data-testid={drawerItemTestID}
    >
      {renderIcon()}
      {renderLabel()}
    </Button>
  );
};
