import { forwardRef } from 'react';
import {
  StackRouter,
  useNavigationBuilder,
  createNavigatorFactory,
} from '@react-navigation/core';
import { StackView } from '../views/StackView.jsx';

/**
 * Stack Navigator component
 * Uses StackRouter for state management
 */
const StackNavigator = forwardRef(({
  initialRouteName,
  children,
  screenOptions,
  screenListeners,
  ...rest
}, _ref) => {
  const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(
    StackRouter,
    {
      initialRouteName,
      children,
      screenOptions,
      screenListeners,
    }
  );

  return (
    <NavigationContent>
      <StackView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
});

StackNavigator.displayName = 'StackNavigator';

/**
 * Create a stack navigator
 *
 * @example
 * const Stack = createStackNavigator();
 *
 * <Stack.Navigator>
 *   <Stack.Screen name="Home" component={HomeScreen} />
 *   <Stack.Screen name="Details" component={DetailsScreen} />
 * </Stack.Navigator>
 */
export const createStackNavigator = createNavigatorFactory(StackNavigator);
