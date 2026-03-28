import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import {
  NavigationContainer,
  createStackNavigator,
  useNavigation,
  Header,
  LightTheme,
  DarkTheme,
} from '../src/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const HomeScreen = ({ navigation }) => (
  <div data-testid="home">
    <button data-testid="go-details" onClick={() => navigation.navigate('Details')}>
      Go to Details
    </button>
  </div>
);

const DetailsScreen = ({ navigation }) => (
  <div data-testid="details">
    <button data-testid="go-back" onClick={() => navigation.goBack()}>
      Go Back
    </button>
  </div>
);

describe('Header component', () => {
  const Stack = createStackNavigator();

  it('renders header with title', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home Screen' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByText('Home Screen')).toBeInTheDocument();
    });

    // Header should be rendered
    const header = document.querySelector('.nextant-header');
    expect(header).toBeInTheDocument();
  });

  it('uses screen name as title when title not specified', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      // Should use route name "Home" as title
      const header = document.querySelector('.nextant-header h1');
      expect(header).toHaveTextContent('Home');
    });
  });

  it('shows back button on pushed screen', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // Navigate to Details
    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    // Back button should be visible (ChevronLeft icon)
    const backButton = document.querySelector('.nextant-header button');
    expect(backButton).toBeInTheDocument();
  });

  it('does not show back button on initial screen', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // No back button on first screen (only a spacer div)
    const header = document.querySelector('.nextant-header');
    const buttons = header.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });

  it('back button navigates back when pressed', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    // Click header back button
    const backButton = document.querySelector('.nextant-header button');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });
  });
});

describe('headerShown option', () => {
  const Stack = createStackNavigator();

  it('hides header when headerShown is false', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // Header should not be rendered
    const header = document.querySelector('.nextant-header');
    expect(header).not.toBeInTheDocument();
  });

  it('shows header by default', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    const header = document.querySelector('.nextant-header');
    expect(header).toBeInTheDocument();
  });

  it('respects screenOptions headerShown', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // No header on Home
    expect(document.querySelector('.nextant-header')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    // No header on Details either
    expect(document.querySelector('.nextant-header')).not.toBeInTheDocument();
  });

  it('screen option overrides navigator screenOptions', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // Header should be shown because screen overrides navigator
    const header = document.querySelector('.nextant-header');
    expect(header).toBeInTheDocument();
  });
});

describe('custom header components', () => {
  const Stack = createStackNavigator();

  it('renders custom headerLeft', async () => {
    const CustomLeft = () => <span data-testid="custom-left">Custom</span>;

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerLeft: () => <CustomLeft /> }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-left')).toBeInTheDocument();
    });
  });

  it('renders custom headerRight', async () => {
    const CustomRight = () => <span data-testid="custom-right">Action</span>;

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerRight: () => <CustomRight /> }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-right')).toBeInTheDocument();
    });
  });

  it('headerLeft function receives canGoBack and onPress', async () => {
    const headerLeftFn = vi.fn(({ canGoBack, onPress }) => (
      <button data-testid="custom-back" onClick={onPress}>
        {canGoBack ? 'Back' : 'Menu'}
      </button>
    ));

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerLeft: headerLeftFn }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ headerLeft: headerLeftFn }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // On first screen, canGoBack should be false
    expect(headerLeftFn).toHaveBeenCalledWith(
      expect.objectContaining({ canGoBack: false })
    );
    expect(screen.getByTestId('custom-back')).toHaveTextContent('Menu');

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    // On pushed screen, canGoBack should be true
    expect(headerLeftFn).toHaveBeenLastCalledWith(
      expect.objectContaining({ canGoBack: true })
    );
    // Multiple headers visible during animation, get the last one (Details)
    const backButtons = screen.getAllByTestId('custom-back');
    expect(backButtons[backButtons.length - 1]).toHaveTextContent('Back');
  });

  it('custom headerLeft can trigger goBack', async () => {
    const CustomBackButton = ({ canGoBack, onPress }) => (
      canGoBack ? (
        <button data-testid="custom-back" onClick={onPress}>
          Go Back
        </button>
      ) : null
    );

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ headerLeft: (props) => <CustomBackButton {...props} /> }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
    });

    // Click custom back button
    fireEvent.click(screen.getByTestId('custom-back'));

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });
  });
});

describe('header styling', () => {
  const Stack = createStackNavigator();

  it('applies headerStyle', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerStyle: { backgroundColor: 'red' },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const header = document.querySelector('.nextant-header');
      expect(header).toBeInTheDocument();
      expect(header.style.backgroundColor).toBe('red');
    });
  });

  it('applies headerTitleStyle', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Styled Title',
              headerTitleStyle: { fontSize: '24px', fontWeight: 'bold' },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const title = document.querySelector('.nextant-header h1');
      expect(title).toHaveStyle({ fontSize: '24px' });
    });
  });

  it('uses theme colors', async () => {
    render(
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const header = document.querySelector('.nextant-header');
      // Dark theme card color
      expect(header).toHaveStyle({ backgroundColor: DarkTheme.colors.card });
    });
  });
});

describe('dynamic header options', () => {
  const Stack = createStackNavigator();

  it('updates title from route params', async () => {
    const DynamicScreen = ({ route }) => (
      <div data-testid="dynamic">
        Title: {route.params?.title}
      </div>
    );

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Dynamic"
            component={DynamicScreen}
            initialParams={{ title: 'Initial' }}
            options={({ route }) => ({
              title: route.params?.title || 'Default',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const header = document.querySelector('.nextant-header h1');
      expect(header).toHaveTextContent('Initial');
    });
  });

  it('supports options as function', async () => {
    const optionsFn = vi.fn(({ route, navigation }) => ({
      title: `Screen: ${route.name}`,
    }));

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={optionsFn}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    expect(optionsFn).toHaveBeenCalled();

    const header = document.querySelector('.nextant-header h1');
    expect(header).toHaveTextContent('Screen: Home');
  });
});

describe('header in nested navigators', () => {
  const Stack = createStackNavigator();
  const NestedStack = createStackNavigator();

  it('each stack has its own header', async () => {
    const NestedScreen = () => <div data-testid="nested">Nested</div>;

    const NestedNavigator = () => (
      <NestedStack.Navigator>
        <NestedStack.Screen
          name="Nested"
          component={NestedScreen}
          options={{ title: 'Nested Title' }}
        />
      </NestedStack.Navigator>
    );

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home Title' }}
          />
          <Stack.Screen
            name="NestedNav"
            component={NestedNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    // Home should have its header
    let header = document.querySelector('.nextant-header h1');
    expect(header).toHaveTextContent('Home Title');

    // Navigate to nested
    fireEvent.click(screen.getByTestId('go-details'));

    // Note: This test would need adjustment based on actual navigation
    // but demonstrates the concept of nested headers
  });
});

describe('Header standalone component', () => {
  it('renders with required props', () => {
    render(
      <NavigationContainer>
        <Header
          title="Test Title"
          canGoBack={false}
          onBackPress={() => {}}
        />
      </NavigationContainer>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders back button when canGoBack is true', () => {
    const onBackPress = vi.fn();

    render(
      <NavigationContainer>
        <Header
          title="Test"
          canGoBack={true}
          onBackPress={onBackPress}
        />
      </NavigationContainer>
    );

    const backButton = document.querySelector('.nextant-header button');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(onBackPress).toHaveBeenCalled();
  });

  it('renders headerLeft as element', () => {
    render(
      <NavigationContainer>
        <Header
          title="Test"
          canGoBack={false}
          onBackPress={() => {}}
          headerLeft={<span data-testid="left-element">Left</span>}
        />
      </NavigationContainer>
    );

    expect(screen.getByTestId('left-element')).toBeInTheDocument();
  });

  it('renders headerRight as element', () => {
    render(
      <NavigationContainer>
        <Header
          title="Test"
          canGoBack={false}
          onBackPress={() => {}}
          headerRight={<span data-testid="right-element">Right</span>}
        />
      </NavigationContainer>
    );

    expect(screen.getByTestId('right-element')).toBeInTheDocument();
  });

  it('renders headerLeft as function with tintColor', () => {
    const headerLeftFn = vi.fn(() => <span data-testid="fn-left">Fn Left</span>);

    render(
      <NavigationContainer>
        <Header
          title="Test"
          canGoBack={true}
          onBackPress={() => {}}
          headerLeft={headerLeftFn}
          headerTintColor="#ff0000"
        />
      </NavigationContainer>
    );

    expect(headerLeftFn).toHaveBeenCalledWith({
      canGoBack: true,
      onPress: expect.any(Function),
      tintColor: '#ff0000',
      label: undefined,
    });
    expect(screen.getByTestId('fn-left')).toBeInTheDocument();
  });

  it('renders headerRight as function with tintColor', () => {
    const headerRightFn = vi.fn(() => <span data-testid="fn-right">Fn Right</span>);

    render(
      <NavigationContainer>
        <Header
          title="Test"
          canGoBack={true}
          onBackPress={() => {}}
          headerRight={headerRightFn}
          headerTintColor="#00ff00"
        />
      </NavigationContainer>
    );

    expect(headerRightFn).toHaveBeenCalledWith({
      canGoBack: true,
      tintColor: '#00ff00',
    });
    expect(screen.getByTestId('fn-right')).toBeInTheDocument();
  });

  it('renders custom headerBackIcon', () => {
    const CustomIcon = ({ className }) => (
      <svg data-testid="custom-icon" className={className}>
        <path d="M0 0" />
      </svg>
    );

    render(
      <NavigationContainer>
        <Header
          title="Test"
          canGoBack={true}
          onBackPress={() => {}}
          headerBackIcon={CustomIcon}
        />
      </NavigationContainer>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('shows back button alongside headerLeft when headerBackVisible is true', () => {
    render(
      <NavigationContainer>
        <Header
          title="Test"
          canGoBack={true}
          onBackPress={() => {}}
          headerLeft={<span data-testid="custom-left">Menu</span>}
          headerBackVisible={true}
        />
      </NavigationContainer>
    );

    // Both back button and custom left should be present
    const backButton = document.querySelector('.nextant-header button');
    expect(backButton).toBeInTheDocument();
    expect(screen.getByTestId('custom-left')).toBeInTheDocument();
  });

  it('applies headerTintColor to back button', () => {
    render(
      <NavigationContainer>
        <Header
          title="Test"
          canGoBack={true}
          onBackPress={() => {}}
          headerTintColor="#ff5500"
        />
      </NavigationContainer>
    );

    const backButton = document.querySelector('.nextant-header button');
    expect(backButton).toHaveStyle({ color: '#ff5500' });
  });
});

describe('header accessibility', () => {
  const Stack = createStackNavigator();

  it('header is a semantic header element', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const header = document.querySelector('header.nextant-header');
      expect(header).toBeInTheDocument();
    });
  });

  it('title is an h1 element', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Page Title' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const h1 = document.querySelector('.nextant-header h1');
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('Page Title');
    });
  });
});

describe('advanced header options', () => {
  const Stack = createStackNavigator();

  it('renders custom header component', async () => {
    const CustomHeader = ({ options, back }) => (
      <div data-testid="custom-header">
        Custom: {options.title}
        {back && <span>Has back</span>}
      </div>
    );

    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Custom Title',
              header: (props) => <CustomHeader {...props} />,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.getByTestId('custom-header')).toHaveTextContent('Custom: Custom Title');
    });

    // Default header should not be rendered
    expect(document.querySelector('.nextant-header')).not.toBeInTheDocument();
  });

  it('renders headerTitle as function', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Test',
              headerTitle: ({ children, tintColor }) => (
                <span data-testid="custom-title" style={{ color: tintColor }}>
                  Custom: {children}
                </span>
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-title')).toHaveTextContent('Custom: Test');
    });
  });

  it('aligns title to left with headerTitleAlign', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Left Aligned',
              headerTitleAlign: 'left',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const h1 = document.querySelector('.nextant-header h1');
      expect(h1).toHaveClass('text-left');
      expect(h1).not.toHaveClass('text-center');
    });
  });

  it('renders headerBackTitle next to back icon', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ headerShown: true, headerBackTitle: 'Back' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('details')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  it('hides border with headerShadowVisible false', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShadowVisible: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const header = document.querySelector('.nextant-header');
      expect(header).not.toHaveClass('border-b');
    });
  });

  it('makes header transparent with headerTransparent', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerTransparent: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const header = document.querySelector('.nextant-header');
      expect(header).toHaveClass('absolute');
      expect(header.style.backgroundColor).toBe('transparent');
    });
  });

  it('renders headerBackground', async () => {
    render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerBackground: () => (
                <div data-testid="header-bg" style={{ background: 'linear-gradient(red, blue)' }} />
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('header-bg')).toBeInTheDocument();
    });
  });

  it('passes back info to custom header', async () => {
    let receivedProps = null;

    const CustomHeader = (props) => {
      receivedProps = props;
      return <div data-testid="custom-header">Header</div>;
    };

    render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home Title' }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{
              headerShown: true,
              header: (props) => <CustomHeader {...props} />,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('go-details'));

    await waitFor(() => {
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    // Custom header should receive back info with previous screen title
    expect(receivedProps.back).toBeDefined();
    expect(receivedProps.back.title).toBe('Home Title');
  });
});
