import { useTheme } from '@react-navigation/core';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { cn } from '../utils/cn.js';

/**
 * Individual tab bar item
 *
 * Supports react-navigation compatible options:
 * - tabBarIcon: icon function/component
 * - tabBarLabel: label text
 * - tabBarBadge: badge content
 * - tabBarBadgeStyle: badge styling
 * - tabBarActiveTintColor: active icon/label color
 * - tabBarInactiveTintColor: inactive icon/label color
 * - tabBarActiveBackgroundColor: active background
 * - tabBarInactiveBackgroundColor: inactive background
 * - tabBarLabelStyle: label text styling
 * - tabBarIconStyle: icon styling
 * - tabBarItemStyle: item container style
 * - tabBarShowLabel: show/hide label
 * - tabBarLabelPosition: 'below-icon' | 'beside-icon'
 * - tabBarAccessibilityLabel: accessibility label
 * - tabBarButton: custom button component
 */
export const TabBarItem = ({
  label,
  icon: Icon,
  badge,
  isFocused,
  onPress,
  onLongPress,
  options = {},
}) => {
  const { colors } = useTheme();

  // Extract options with defaults
  const {
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor,
    tabBarLabelStyle,
    tabBarIconStyle,
    tabBarItemStyle,
    tabBarBadgeStyle,
    tabBarShowLabel = true,
    tabBarLabelPosition = 'below-icon',
    tabBarAccessibilityLabel,
    tabBarButton: CustomButton,
  } = options;

  // Determine colors
  const activeColor = tabBarActiveTintColor || colors.primary;
  const inactiveColor = tabBarInactiveTintColor || colors.text;
  const tintColor = isFocused ? activeColor : inactiveColor;

  const activeBackground = tabBarActiveBackgroundColor || 'transparent';
  const inactiveBackground = tabBarInactiveBackgroundColor || 'transparent';
  const backgroundColor = isFocused ? activeBackground : inactiveBackground;

  // Support both component and render function for icon
  const renderIcon = () => {
    if (!Icon) return null;

    const iconProps = {
      focused: isFocused,
      color: tintColor,
      size: 24,
    };

    // If Icon is a function (render prop), call it
    if (typeof Icon === 'function') {
      const result = Icon(iconProps);
      // If result is a valid React element, wrap with style container
      if (result?.type) {
        return (
          <span style={tabBarIconStyle}>
            {result}
          </span>
        );
      }
    }

    // Treat as component (e.g., lucide icon)
    return (
      <Icon
        className="h-6 w-6"
        style={{ color: tintColor, ...tabBarIconStyle }}
      />
    );
  };

  const renderLabel = () => {
    if (!tabBarShowLabel) return null;

    return (
      <span
        className={cn(
          'truncate',
          tabBarLabelPosition === 'below-icon' ? 'text-xs w-full text-center' : 'text-sm ml-2'
        )}
        style={{
          color: tintColor,
          ...tabBarLabelStyle,
        }}
      >
        {label}
      </span>
    );
  };

  const renderBadge = () => {
    if (badge == null) return null;

    return (
      <Badge
        className={cn(
          'absolute top-1 left-1/2 ml-2 h-4 min-w-4 px-1 text-[10px]',
          'flex items-center justify-center'
        )}
        style={{
          backgroundColor: tabBarBadgeStyle?.backgroundColor || colors.notification,
          color: tabBarBadgeStyle?.color || '#fff',
        }}
      >
        {badge}
      </Badge>
    );
  };

  const buttonContent = (
    <>
      {renderIcon()}
      {renderLabel()}
      {renderBadge()}
    </>
  );

  const buttonProps = {
    className: cn(
      'flex-1 h-auto py-2 rounded-none relative min-w-0',
      'hover:bg-transparent focus:bg-transparent',
      tabBarLabelPosition === 'below-icon' ? 'flex-col gap-1' : 'flex-row items-center justify-center',
      isFocused ? 'text-primary' : 'text-muted-foreground'
    ),
    style: {
      color: tintColor,
      backgroundColor,
      ...tabBarItemStyle,
    },
    onClick: onPress,
    onContextMenu: (e) => {
      e.preventDefault();
      onLongPress?.();
    },
    'aria-label': tabBarAccessibilityLabel,
    'aria-selected': isFocused,
    role: 'tab',
  };

  // Use custom button if provided
  if (CustomButton) {
    return CustomButton({
      ...buttonProps,
      children: buttonContent,
      accessibilityState: { selected: isFocused },
    });
  }

  return (
    <Button variant="ghost" {...buttonProps}>
      {buttonContent}
    </Button>
  );
};
