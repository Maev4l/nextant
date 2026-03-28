import { forwardRef } from 'react';
import {
  TabRouter,
  useNavigationBuilder,
  createNavigatorFactory,
} from '@react-navigation/core';
import { TabView } from '../views/TabView.jsx';

/**
 * Tab Navigator component
 * Uses TabRouter for state management
 *
 * Supports react-navigation compatible options:
 * - tabBar: custom tab bar component
 * - tabBarPosition: 'bottom' | 'top'
 * - lazy: lazy load screens
 * - animation: 'none' | 'fade' | 'shift'
 * - All tabBar* styling options in screenOptions
 */
const TabNavigator = forwardRef(({
  initialRouteName,
  backBehavior = 'firstRoute',
  children,
  screenOptions,
  screenListeners,
  tabBar,
  tabBarPosition = 'bottom',
  lazy = true,
  animation = 'none',
  sceneContainerStyle,
  ...rest
}, _ref) => {
  const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(
    TabRouter,
    {
      initialRouteName,
      backBehavior,
      children,
      screenOptions,
      screenListeners,
    }
  );

  // Extract navigator-level tab bar options from screenOptions
  // These can be overridden per-screen
  const resolvedScreenOptions = typeof screenOptions === 'function'
    ? {}  // Can't extract defaults from function
    : (screenOptions || {});

  return (
    <NavigationContent>
      <TabView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        tabBar={tabBar}
        tabBarPosition={tabBarPosition}
        lazy={lazy}
        animation={animation}
        sceneContainerStyle={sceneContainerStyle}
        // Pass navigator-level tab bar options
        tabBarStyle={resolvedScreenOptions.tabBarStyle}
        tabBarBackground={resolvedScreenOptions.tabBarBackground}
        tabBarActiveTintColor={resolvedScreenOptions.tabBarActiveTintColor}
        tabBarInactiveTintColor={resolvedScreenOptions.tabBarInactiveTintColor}
        tabBarActiveBackgroundColor={resolvedScreenOptions.tabBarActiveBackgroundColor}
        tabBarInactiveBackgroundColor={resolvedScreenOptions.tabBarInactiveBackgroundColor}
        tabBarLabelStyle={resolvedScreenOptions.tabBarLabelStyle}
        tabBarIconStyle={resolvedScreenOptions.tabBarIconStyle}
        tabBarItemStyle={resolvedScreenOptions.tabBarItemStyle}
        tabBarShowLabel={resolvedScreenOptions.tabBarShowLabel}
        tabBarLabelPosition={resolvedScreenOptions.tabBarLabelPosition}
      />
    </NavigationContent>
  );
});

TabNavigator.displayName = 'TabNavigator';

/**
 * Create a tab navigator
 *
 * @example
 * const Tab = createTabNavigator();
 *
 * <Tab.Navigator
 *   screenOptions={{
 *     tabBarActiveTintColor: '#007AFF',
 *     tabBarInactiveTintColor: '#8E8E93',
 *     tabBarStyle: { backgroundColor: '#fff' },
 *   }}
 *   animation="fade"
 * >
 *   <Tab.Screen
 *     name="Home"
 *     component={HomeScreen}
 *     options={{
 *       tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
 *       tabBarBadge: 3,
 *     }}
 *   />
 *   <Tab.Screen name="Settings" component={SettingsScreen} />
 * </Tab.Navigator>
 */
export const createTabNavigator = createNavigatorFactory(TabNavigator);
