import { useTheme } from '@react-navigation/core';
import { DrawerItem } from './DrawerItem.jsx';
import { cn } from '../utils/cn.js';

/**
 * Default drawer content component
 *
 * Supports react-navigation compatible options:
 * - drawerContentStyle: wrapper style
 * - drawerContentContainerStyle: items container style
 * - All drawerItem* options passed through
 */
export const DrawerContent = ({
  state,
  navigation,
  descriptors,
  // Navigator-level options
  drawerContentStyle,
  drawerContentContainerStyle,
  drawerActiveTintColor,
  drawerInactiveTintColor,
  drawerActiveBackgroundColor,
  drawerInactiveBackgroundColor,
  drawerLabelStyle,
  drawerItemStyle,
  className,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <nav
      className={cn(
        'nextant-drawer-content flex flex-col h-full',
        'pt-[env(safe-area-inset-top)]',
        'pb-[env(safe-area-inset-bottom)]',
        className
      )}
      style={{
        backgroundColor: colors.card,
        ...style,
        ...drawerContentStyle,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-6 border-b"
        style={{ borderColor: colors.border }}
      >
        <h2
          className="text-lg font-semibold"
          style={{ color: colors.text }}
        >
          Menu
        </h2>
      </div>

      {/* Navigation items */}
      <div
        className="flex-1 py-2 overflow-auto"
        style={drawerContentContainerStyle}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label = options.drawerLabel ?? options.title ?? route.name;
          const icon = options.drawerIcon;

          const onPress = () => {
            // Emit drawerItemPress event with canPreventDefault
            const event = navigation.emit({
              type: 'drawerItemPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
              navigation.closeDrawer();
            }
          };

          // Merge navigator-level options with screen-level options
          const mergedOptions = {
            drawerActiveTintColor: options.drawerActiveTintColor ?? drawerActiveTintColor,
            drawerInactiveTintColor: options.drawerInactiveTintColor ?? drawerInactiveTintColor,
            drawerActiveBackgroundColor: options.drawerActiveBackgroundColor ?? drawerActiveBackgroundColor,
            drawerInactiveBackgroundColor: options.drawerInactiveBackgroundColor ?? drawerInactiveBackgroundColor,
            drawerLabelStyle: { ...drawerLabelStyle, ...options.drawerLabelStyle },
            drawerItemStyle: { ...drawerItemStyle, ...options.drawerItemStyle },
            drawerItemTestID: options.drawerItemTestID,
          };

          return (
            <DrawerItem
              key={route.key}
              label={label}
              icon={icon}
              isFocused={isFocused}
              onPress={onPress}
              options={mergedOptions}
            />
          );
        })}
      </div>
    </nav>
  );
};
