# Passing Parameters

Learn how to pass and read data between screens.

## Passing Parameters

Pass params as the second argument to `navigate`:

```jsx
navigation.navigate('Details', {
  itemId: 86,
  otherParam: 'anything',
});
```

## Reading Parameters

Use `useRoute` to access the current route and its params:

```jsx
import { useRoute } from '@isnan/nextant';

const DetailsScreen = () => {
  const route = useRoute();
  const { itemId, otherParam } = route.params;

  return (
    <div className="p-4">
      <p>Item ID: {itemId}</p>
      <p>Other: {otherParam}</p>
    </div>
  );
};
```

## Initial Params

Set default params when defining a screen:

```jsx
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  initialParams={{ itemId: 0 }}
/>
```

## Updating Params

Update the current screen's params:

```jsx
navigation.setParams({ itemId: 100 });
```

## Passing Params to Nested Navigators

When navigating to a nested navigator, include params for the nested screen:

```jsx
navigation.navigate('Root', {
  screen: 'Profile',
  params: { userId: 'jane' },
});
```

## Accessing Parent Navigator Params

Use `getParent` to access the parent navigator:

```jsx
const route = useRoute();
const navigation = useNavigation();

// Get params from parent route
const parentRoute = navigation.getParent()?.getState().routes[0];
```

## Type-Safe Params

While Nextant is JavaScript-only, you can use JSDoc for type hints:

```jsx
/**
 * @typedef {Object} DetailsParams
 * @property {number} itemId
 * @property {string} [otherParam]
 */

const DetailsScreen = () => {
  const route = useRoute();
  /** @type {DetailsParams} */
  const params = route.params;

  return <div>Item: {params.itemId}</div>;
};
```

## Next Steps

- [Deep Linking](./deep-linking.md) - URL params integration
- [Navigation State](./navigation-state.md) - Understanding state structure
