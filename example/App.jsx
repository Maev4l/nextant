import {
  NavigationContainer,
  createTabNavigator,
  createStackNavigator,
  useNavigation,
  Link,
  DarkTheme,
  LightTheme,
} from '@isnan/nextant';
import { Home, Settings, User, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// Create navigators
const Tab = createTabNavigator();
const Stack = createStackNavigator();

// Screens
const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <p className="text-gray-600 mb-6">Welcome to Nextant example app!</p>

      <div className="space-y-3">
        <button
          onClick={() => navigation.navigate('Details', { id: 1 })}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border hover:bg-gray-50"
        >
          <span>Go to Details (id: 1)</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <button
          onClick={() => navigation.navigate('Details', { id: 2 })}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg border hover:bg-gray-50"
        >
          <span>Go to Details (id: 2)</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>

        <Link
          screen="Profile"
          className="block w-full p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600"
        >
          Go to Profile (Link component)
        </Link>
      </div>
    </div>
  );
};

const DetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Details</h1>
      <p className="text-gray-600 mb-4">Item ID: {id}</p>

      <button
        onClick={() => navigation.goBack()}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        Go Back
      </button>
    </div>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-600 mb-4">User profile page</p>

      <button
        onClick={() => navigation.navigate('EditProfile')}
        className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Edit Profile
      </button>
    </div>
  );
};

const EditProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <p className="text-gray-600 mb-4">Swipe from left edge to go back!</p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
        />
        <button
          onClick={() => navigation.goBack()}
          className="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Save & Go Back
        </button>
      </div>
    </div>
  );
};

const SettingsScreen = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <div className="space-y-2">
      {['Notifications', 'Privacy', 'Theme', 'About'].map((item) => (
        <div
          key={item}
          className="flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <span>{item}</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      ))}
    </div>
  </div>
);

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ title: 'Home' }}
    />
    <Stack.Screen
      name="Details"
      component={DetailsScreen}
      options={({ route }) => ({
        title: `Details #${route.params?.id || ''}`,
      })}
    />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ title: 'Edit Profile' }}
    />
  </Stack.Navigator>
);

// Main App
const App = () => {
  const [isDark, setIsDark] = useState(false);

  const linking = {
    prefixes: [window.location.origin],
    config: {
      screens: {
        Home: {
          screens: {
            HomeMain: '',
            Details: 'details/:id',
          },
        },
        Profile: {
          screens: {
            ProfileMain: 'profile',
            EditProfile: 'profile/edit',
          },
        },
        Settings: 'settings',
      },
    },
  };

  return (
    <NavigationContainer
      linking={linking}
      theme={isDark ? DarkTheme : LightTheme}
      documentTitle={{
        formatter: (options, route) =>
          `${options?.title ?? route?.name} - Nextant`,
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home style={{ color }} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User style={{ color }} size={size} />
            ),
            tabBarBadge: 3,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Settings style={{ color }} size={size} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Theme toggle (fixed position) */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed bottom-20 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </NavigationContainer>
  );
};

export default App;
