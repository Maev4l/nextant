import { useTheme } from '@react-navigation/core';
import { TabBarItem } from './TabBarItem.jsx';
import { cn } from '../utils/cn.js';

/**
 * Default Tab Bar component
 *
 * Supports react-navigation compatible options:
 * - tabBarStyle: container styling (backgroundColor, display)
 * - tabBarBackground: custom background element
 * - tabBarActiveTintColor: active color (passed to items)
 * - tabBarInactiveTintColor: inactive color (passed to items)
 */
export const TabBar = ({
  state,
  navigation,
  descriptors,
  onTabPress,
  // Navigator-level options (from screenOptions)
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
  style,
  className,
}) => {
  const { colors } = useTheme();

  // Check if tab bar should be hidden
  if (tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <nav
      className={cn(
        'nextant-tab-bar flex border-t relative',
        'pb-[env(safe-area-inset-bottom)]',
        className
      )}
      style={{
        backgroundColor: tabBarStyle?.backgroundColor || colors.card,
        borderColor: colors.border,
        ...style,
      }}
      role="tablist"
    >
      {/* Custom background layer */}
      {tabBarBackground && (
        <div className="absolute inset-0 -z-10">
          {typeof tabBarBackground === 'function' ? tabBarBackground() : tabBarBackground}
        </div>
      )}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label = options.tabBarLabel ?? options.title ?? route.name;
        const icon = options.tabBarIcon;
        const badge = options.tabBarBadge;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            onTabPress?.(index);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Merge navigator-level options with screen-level options
        // Screen-level options take precedence
        const mergedOptions = {
          tabBarActiveTintColor: options.tabBarActiveTintColor ?? tabBarActiveTintColor,
          tabBarInactiveTintColor: options.tabBarInactiveTintColor ?? tabBarInactiveTintColor,
          tabBarActiveBackgroundColor: options.tabBarActiveBackgroundColor ?? tabBarActiveBackgroundColor,
          tabBarInactiveBackgroundColor: options.tabBarInactiveBackgroundColor ?? tabBarInactiveBackgroundColor,
          tabBarLabelStyle: { ...tabBarLabelStyle, ...options.tabBarLabelStyle },
          tabBarIconStyle: { ...tabBarIconStyle, ...options.tabBarIconStyle },
          tabBarItemStyle: { ...tabBarItemStyle, ...options.tabBarItemStyle },
          tabBarBadgeStyle: options.tabBarBadgeStyle,
          tabBarShowLabel: options.tabBarShowLabel ?? tabBarShowLabel,
          tabBarLabelPosition: options.tabBarLabelPosition ?? tabBarLabelPosition,
          tabBarAccessibilityLabel: options.tabBarAccessibilityLabel,
          tabBarButton: options.tabBarButton,
        };

        return (
          <TabBarItem
            key={route.key}
            label={label}
            icon={icon}
            badge={badge}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            options={mergedOptions}
          />
        );
      })}
    </nav>
  );
};
