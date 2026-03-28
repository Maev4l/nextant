import { forwardRef } from 'react';
import {
  DrawerRouter,
  useNavigationBuilder,
  createNavigatorFactory,
} from '@react-navigation/core';
import { DrawerView } from '../views/DrawerView.jsx';

/**
 * Drawer Navigator component
 * Uses DrawerRouter for state management
 *
 * Supports react-navigation compatible options:
 * - drawerContent: custom drawer content component
 * - drawerPosition: 'left' | 'right'
 * - drawerType: 'front' | 'back' | 'slide' | 'permanent'
 * - drawerStyle: width, backgroundColor
 * - overlayStyle: overlay styling
 * - overlayAccessibilityLabel: accessibility label
 * - sceneStyle: main content style
 * - lazy: lazy load screens
 * - gestureEnabled: enable swipe gestures
 * - All drawer item styling options in screenOptions
 */
const DrawerNavigator = forwardRef(({
  initialRouteName,
  backBehavior = 'firstRoute',
  children,
  screenOptions,
  screenListeners,
  drawerContent,
  drawerPosition = 'left',
  drawerType = 'front',
  drawerStyle,
  overlayStyle,
  overlayAccessibilityLabel,
  sceneStyle,
  lazy = true,
  gestureEnabled = true,
  ...rest
}, _ref) => {
  const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(
    DrawerRouter,
    {
      initialRouteName,
      backBehavior,
      children,
      screenOptions,
      screenListeners,
    }
  );

  // Extract navigator-level drawer options from screenOptions
  const resolvedScreenOptions = typeof screenOptions === 'function'
    ? {}
    : (screenOptions || {});

  return (
    <NavigationContent>
      <DrawerView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        drawerContent={drawerContent}
        drawerPosition={drawerPosition}
        drawerType={drawerType}
        drawerStyle={drawerStyle}
        overlayStyle={overlayStyle}
        overlayAccessibilityLabel={overlayAccessibilityLabel}
        sceneStyle={sceneStyle}
        lazy={lazy}
        gestureEnabled={gestureEnabled}
        // Pass navigator-level drawer item options
        drawerContentStyle={resolvedScreenOptions.drawerContentStyle}
        drawerContentContainerStyle={resolvedScreenOptions.drawerContentContainerStyle}
        drawerActiveTintColor={resolvedScreenOptions.drawerActiveTintColor}
        drawerInactiveTintColor={resolvedScreenOptions.drawerInactiveTintColor}
        drawerActiveBackgroundColor={resolvedScreenOptions.drawerActiveBackgroundColor}
        drawerInactiveBackgroundColor={resolvedScreenOptions.drawerInactiveBackgroundColor}
        drawerLabelStyle={resolvedScreenOptions.drawerLabelStyle}
        drawerItemStyle={resolvedScreenOptions.drawerItemStyle}
      />
    </NavigationContent>
  );
});

DrawerNavigator.displayName = 'DrawerNavigator';

/**
 * Create a drawer navigator
 *
 * @example
 * const Drawer = createDrawerNavigator();
 *
 * <Drawer.Navigator
 *   screenOptions={{
 *     drawerActiveTintColor: '#007AFF',
 *     drawerInactiveTintColor: '#8E8E93',
 *   }}
 *   drawerType="slide"
 * >
 *   <Drawer.Screen
 *     name="Home"
 *     component={HomeScreen}
 *     options={{
 *       drawerIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
 *     }}
 *   />
 *   <Drawer.Screen name="Settings" component={SettingsScreen} />
 * </Drawer.Navigator>
 */
export const createDrawerNavigator = createNavigatorFactory(DrawerNavigator);
