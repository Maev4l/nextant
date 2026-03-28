/**
 * @isnan/nextant
 * Web/PWA navigation library for React
 *
 * A lightweight rewrite of react-navigation for the browser
 */

// Re-export everything from @react-navigation/core
export {
  // Hooks (useNavigation is overridden below)
  useNavigationContainerRef,
  useNavigationState,
  useRoute,
  useFocusEffect,
  useIsFocused,
  useTheme,
  usePreventRemove,
  // Builder hooks
  useNavigationBuilder,
  // Contexts
  NavigationContext,
  NavigationHelpersContext,
  NavigationContainerRefContext,
  // Factory
  createNavigatorFactory,
  // State utilities
  getStateFromPath,
  getPathFromState,
  getActionFromState,
  getFocusedRouteNameFromRoute,
  findFocusedRoute,
  // Theme
  ThemeProvider,
  ThemeContext,
  // Types/validation
  validatePathConfig,
  // Base container (for advanced use)
  BaseNavigationContainer,
  // Static navigation helpers
  createComponentForStaticNavigation,
  createPathConfigForStaticNavigation,
} from '@react-navigation/core';

// Re-export routers
export {
  // Routers
  StackRouter,
  TabRouter,
  DrawerRouter,
  // Actions
  CommonActions,
  StackActions,
  TabActions,
  DrawerActions,
} from '@react-navigation/routers';

// Web-specific implementations (override core)
export { useNavigation } from './useNavigation.js';
export { NavigationContainer } from './NavigationContainer.jsx';
export { Link } from './Link.jsx';
export { LinkingContext, useLinkingContext } from './LinkingContext.js';
export { useLinking } from './useLinking.js';
export { useLinkTo } from './useLinkTo.js';
export { useLinkProps } from './useLinkProps.js';
export { useLinkBuilder } from './useLinkBuilder.js';
export { useDocumentTitle } from './useDocumentTitle.js';
export { createMemoryHistory } from './createMemoryHistory.js';

// Themes
export { LightTheme, DarkTheme, DefaultTheme } from './themes/index.js';

// Navigators
export { createTabNavigator } from './navigators/createTabNavigator.jsx';
export { createStackNavigator } from './navigators/createStackNavigator.jsx';
export { createDrawerNavigator } from './navigators/createDrawerNavigator.jsx';

// Views (for customization)
export { TabView } from './views/TabView.jsx';
export { TabBar } from './views/TabBar.jsx';
export { TabBarItem } from './views/TabBarItem.jsx';
export { StackView } from './views/StackView.jsx';
export { StackItem } from './views/StackItem.jsx';
export { Header } from './views/Header.jsx';
export { DrawerView } from './views/DrawerView.jsx';
export { DrawerContent } from './views/DrawerContent.jsx';
export { DrawerItem } from './views/DrawerItem.jsx';

// UI components
export { Button, buttonVariants } from './ui/button.jsx';
export { Badge, badgeVariants } from './ui/badge.jsx';

// Utilities
export { cn } from './utils/cn.js';
