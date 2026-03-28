# Link Component

The `Link` component renders an anchor element with navigation behavior.

## Basic Usage

```jsx
import { Link } from '@isnan/nextant';

const MyComponent = () => {
  return (
    <Link screen="Profile" params={{ id: '123' }}>
      View Profile
    </Link>
  );
};
```

## Props

### `screen`

Name of the screen to navigate to.

**Type:** `string`

```jsx
<Link screen="Settings">Settings</Link>
```

### `params`

Parameters to pass to the screen.

**Type:** `object`

```jsx
<Link screen="Profile" params={{ userId: '123' }}>
  View Profile
</Link>
```

### `action`

Custom navigation action to dispatch.

**Type:** `object`

```jsx
import { StackActions } from '@isnan/nextant';

<Link action={StackActions.push('Details', { id: 1 })}>
  Push Details
</Link>
```

### `href`

Direct URL path (requires linking to be enabled).

**Type:** `string`

```jsx
<Link href="/user/123">View Profile</Link>
```

### `target`

Standard anchor `target` attribute. If set, navigation is handled by the browser.

**Type:** `string`

```jsx
<Link href="https://example.com" target="_blank">
  External Link
</Link>
```

### `style`

Inline styles for the link.

**Type:** `object`

```jsx
<Link screen="Home" style={{ fontWeight: 'bold' }}>
  Home
</Link>
```

### `className`

CSS class names.

**Type:** `string`

```jsx
<Link screen="Home" className="text-blue-500 hover:underline">
  Home
</Link>
```

## Screen vs Href Navigation

### Screen-based

Navigate using screen names (doesn't require deep linking):

```jsx
<Link screen="Profile" params={{ id: '123' }}>
  Profile
</Link>
```

### Href-based

Navigate using URL paths (requires deep linking):

```jsx
// Requires linking config in NavigationContainer
<Link href="/user/123">Profile</Link>
```

Both generate the same URL if linking is configured:

```jsx
const linking = {
  config: {
    screens: {
      Profile: 'user/:id',
    },
  },
};
```

## Styling

Link uses theme colors by default:

```jsx
const Link = () => {
  // Default styles:
  // - color: theme.colors.primary
  // - textDecoration: 'none'
  // - cursor: 'pointer'
};
```

Override with style or className:

```jsx
<Link
  screen="Home"
  style={{
    color: '#333',
    textDecoration: 'underline',
  }}
>
  Home
</Link>

// Or with Tailwind
<Link screen="Home" className="text-gray-700 underline hover:text-gray-900">
  Home
</Link>
```

## Modifier Keys

Link respects modifier keys for standard browser behavior:

- **Cmd/Ctrl + Click** - Opens in new tab
- **Shift + Click** - Opens in new window
- **Alt + Click** - Downloads the link

## Accessibility

Link renders a native `<a>` element with proper semantics:

```jsx
<Link screen="Profile" params={{ id: '123' }}>
  Profile
</Link>

// Renders:
<a href="/user/123" role="link">Profile</a>
```

For improved accessibility, use descriptive link text:

```jsx
// Good
<Link screen="Profile" params={{ id: user.id }}>
  View {user.name}'s profile
</Link>

// Avoid
<Link screen="Profile" params={{ id: user.id }}>
  Click here
</Link>
```

## Related Hooks

### useLinkProps

Build link props programmatically:

```jsx
import { useLinkProps } from '@isnan/nextant';

const MyLink = ({ children }) => {
  const props = useLinkProps({
    screen: 'Profile',
    params: { id: '123' },
  });

  return (
    <a href={props.href} onClick={props.onPress}>
      {children}
    </a>
  );
};
```

### useLinkTo

Navigate to a path imperatively:

```jsx
import { useLinkTo } from '@isnan/nextant';

const MyComponent = () => {
  const linkTo = useLinkTo();

  return (
    <button onClick={() => linkTo('/user/123')}>
      Go to Profile
    </button>
  );
};
```

### useLinkBuilder

Build URLs for screens:

```jsx
import { useLinkBuilder } from '@isnan/nextant';

const MyComponent = () => {
  const { buildHref } = useLinkBuilder();

  const profileUrl = buildHref('Profile', { id: '123' });

  return (
    <div>
      <a href={profileUrl}>Native anchor</a>
    </div>
  );
};
```

## Examples

### Navigation List

```jsx
const NavigationList = () => {
  const items = [
    { screen: 'Home', label: 'Home' },
    { screen: 'Profile', label: 'Profile', params: { id: 'me' } },
    { screen: 'Settings', label: 'Settings' },
  ];

  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item.screen}>
            <Link screen={item.screen} params={item.params}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

### Styled Link Button

```jsx
const LinkButton = ({ screen, params, children }) => {
  return (
    <Link
      screen={screen}
      params={params}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </Link>
  );
};

// Usage
<LinkButton screen="Checkout">Proceed to Checkout</LinkButton>
```

### Conditional Link

```jsx
const ConditionalLink = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <Link screen="Login">Sign in to continue</Link>
    );
  }

  return (
    <Link screen="Dashboard">Go to Dashboard</Link>
  );
};
```
