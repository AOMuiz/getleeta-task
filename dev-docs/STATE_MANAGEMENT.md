# State Management Guide

## Overview

This project uses a **two-state pattern**:

- **TanStack Query** for server state (API data)
- **Zustand** for client state (cart, favorites, UI)

## Why Two Libraries?

### The Problem with Single-State Solutions

Traditional approaches (Redux, MobX) treat all state the same:

```typescript
// ❌ Mixing concerns in one store
{
  products: [...],        // Server data
  loading: true,         // Server state
  error: null,           // Server state
  cart: [...],           // Client state
  selectedCategory: ''   // Client state
}
```

**Problems:**

- Lots of boilerplate (actions, reducers, selectors)
- Manual loading/error handling
- No automatic caching or refetching
- Mixing server and client concerns

### The Two-State Solution

```typescript
// ✅ Server state (TanStack Query)
const { data: products, isLoading, error } = useProducts();

// ✅ Client state (Zustand)
const { cart, addToCart } = useStore();
```

**Benefits:**

- Less boilerplate (90% reduction)
- Automatic caching and loading states
- Clear separation of concerns
- Better TypeScript support

## TanStack Query (Server State)

### Core Concepts

**Query** - Fetch and cache data:

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['products', category],
  queryFn: () => fetchProducts(category),
  staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
});
```

**Infinite Query** - Pagination:

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['products-infinite', category],
  queryFn: ({ pageParam = 0 }) => fetchPage(pageParam),
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.length < 10 ? undefined : allPages.length;
  },
  initialPageParam: 0,
});
```

### Query Keys

**Purpose:** Unique identifier for cached data

**Pattern:**

```typescript
// Simple key
['products'][
  // With parameters
  ('products', category)
][('product', productId)][
  // Hierarchical
  ('products', 'category', 'electronics')
];
```

**Best Practices:**

1. **Most specific last:**

   ```typescript
   ['products', category, sortBy][(sortBy, category, 'products')]; // ✅ // ❌
   ```

2. **Use variables consistently:**

   ```typescript
   const category = 'electronics';
   ['products', category][('products', 'electronics')]; // ✅ // ❌ (if category changes)
   ```

3. **Array format always:**
   ```typescript
   ['products']; // ✅
   ('products'); // ❌
   ```

### Cache Configuration

**Global Config** (services/queryClient.ts):

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      gcTime: 10 * 60 * 1000, // 10 min (renamed from cacheTime)
      retry: 2, // Retry failed requests 2x
      refetchOnWindowFocus: false, // Don't refetch on focus
      refetchOnReconnect: true, // Refetch on reconnect
    },
  },
});
```

**Per-Query Override:**

```typescript
useQuery({
  queryKey: ['product', id],
  queryFn: () => fetchProduct(id),
  staleTime: 10 * 60 * 1000, // Override: 10 min for this query
  gcTime: 30 * 60 * 1000, // Override: 30 min cache
});
```

### Loading States

**Multiple states available:**

```typescript
const {
  data,
  isLoading,        // Initial load
  isFetching,       // Any fetch (including background)
  isRefetching,     // Refetch after data exists
  isPending,        // No data yet
  isSuccess,        // Has data
  isError,          // Error occurred
} = useQuery(...);
```

**Common Patterns:**

```typescript
// Show skeleton on initial load only
if (isLoading) return <Skeleton />;

// Show loading indicator for background refetch
if (isFetching) return <LoadingIndicator />;

// Show data with loading overlay
return (
  <View>
    {isFetching && <Spinner />}
    <ProductList products={data} />
  </View>
);
```

### Error Handling

**Global Error Handler:**

```typescript
// services/api-client.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);
```

**Component-Level:**

```typescript
const { data, error, isError, refetch } = useProducts();

if (isError) {
  return (
    <ErrorState
      title="Failed to load products"
      message={error.message}
      onRetry={refetch}
    />
  );
}
```

### Optimistic Updates (Future)

```typescript
const mutation = useMutation({
  mutationFn: updateProduct,
  onMutate: async (newProduct) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['products'] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['products']);

    // Optimistically update
    queryClient.setQueryData(['products'], (old) => [...old, newProduct]);

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['products'], context.previous);
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
});
```

## Zustand (Client State)

### Store Structure

```typescript
// stores/useStore.ts
interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Favorites
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  isFavorite: (productId: number) => boolean;

  // UI
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}
```

### Creating the Store

```typescript
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // State
      cart: [],

      // Actions
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find(
            (item) => item.product.id === product.id
          );

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { product, quantity }],
          };
        });
      },

      // Computed values (selectors)
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        // Don't persist UI state
      }),
    }
  )
);
```

### Using the Store

**Full Store:**

```typescript
const { cart, addToCart, removeFromCart } = useStore();
```

**Selector (Better Performance):**

```typescript
// ✅ Only re-render when cart count changes
const cartCount = useStore((state) => state.getCartItemsCount());

// ❌ Re-renders on any store change
const { cart } = useStore();
const cartCount = cart.length;
```

**Multiple Selectors:**

```typescript
const cart = useStore((state) => state.cart);
const total = useStore((state) => state.getCartTotal());
const addToCart = useStore((state) => state.addToCart);
```

### Persistence

**What to Persist:**

```typescript
✅ Cart items
✅ Favorites
✅ User preferences
❌ UI state (selected category)
❌ Form inputs
❌ Temporary flags
```

**Configuration:**

```typescript
persist(
  (set, get) => ({
    /* store */
  }),
  {
    name: 'app-storage', // AsyncStorage key
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      cart: state.cart, // Only persist cart
      favorites: state.favorites, // and favorites
    }),
    version: 1, // For migrations
    migrate: (persistedState, version) => {
      // Handle version migrations
      return persistedState;
    },
  }
);
```

### Actions vs Selectors

**Actions** - Modify state:

```typescript
addToCart: (product) =>
  set((state) => ({
    cart: [...state.cart, product],
  }));
```

**Selectors** - Compute derived values:

```typescript
getCartTotal: () => get().cart.reduce(...)
```

**When to use each:**

- **Actions:** Any state modification
- **Selectors:** Computed/derived values that don't need persistence

## Best Practices

### 1. Keep Queries Simple

```typescript
// ✅ Good
const { data } = useProducts();

// ❌ Too complex
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  select: (data) => data.filter(...).map(...).sort(...),
});

// ✅ Better: Transform in component or custom hook
const products = data?.filter(...).map(...).sort(...);
```

### 2. Use Custom Hooks

```typescript
// hooks/useProductsList.ts
export const useProductsList = () => {
  const [category, setCategory] = useState(null);

  const { data, ...queryProps } = useInfiniteProducts(category, 10);

  const products = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  return {
    products,
    category,
    setCategory,
    ...queryProps,
  };
};
```

### 3. Minimize Store Subscriptions

```typescript
// ❌ Re-renders on any cart change
const Component = () => {
  const { cart } = useStore();
  return <Badge>{cart.length}</Badge>;
};

// ✅ Only re-renders when count changes
const Component = () => {
  const count = useStore((state) => state.getCartItemsCount());
  return <Badge>{count}</Badge>;
};
```

### 4. Invalidate Queries on Mutations

```typescript
const { mutate } = useMutation({
  mutationFn: addToCart,
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  },
});
```

### 5. Handle Loading States Gracefully

```typescript
const { data, isLoading, isFetching } = useProducts();

// Show skeleton on initial load
if (isLoading && !data) return <Skeleton />;

// Show data with loading indicator for refetch
return (
  <>
    {isFetching && <RefreshIndicator />}
    <ProductList products={data} />
  </>
);
```

## Common Patterns

### Infinite Scroll

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteProducts(category, 10);

const handleLoadMore = () => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};

return (
  <FlatList
    data={data?.pages.flat()}
    onEndReached={handleLoadMore}
    onEndReachedThreshold={0.5}
    ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
  />
);
```

### Pull to Refresh

```typescript
const { data, refetch } = useProducts();
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
};

return (
  <FlatList
    data={data}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  />
);
```

### Category Filtering

```typescript
const [category, setCategory] = useState<string | null>(null);

const { data } = useInfiniteProducts(category, 10);

// When category changes, TanStack Query automatically:
// 1. Cancels previous request
// 2. Shows previous data while loading (placeholderData)
// 3. Fetches new data
// 4. Updates when ready
```

## Testing

### Testing TanStack Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

test('loads products', async () => {
  const queryClient = createTestQueryClient();

  const { result } = renderHook(() => useProducts(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(10);
});
```

### Testing Zustand

```typescript
import { useStore } from '@/stores/useStore';

beforeEach(() => {
  useStore.setState({ cart: [], favorites: [] });
});

test('adds product to cart', () => {
  const { result } = renderHook(() => useStore());

  act(() => {
    result.current.addToCart(mockProduct, 1);
  });

  expect(result.current.cart).toHaveLength(1);
  expect(result.current.getCartItemsCount()).toBe(1);
});
```

## Debugging

### TanStack Query DevTools (Future)

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {__DEV__ && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

### Zustand DevTools

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        /* store */
      }),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
);
```

## Migration Guide

### From Redux to This Pattern

**Before (Redux):**

```typescript
// Actions
const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';

// Action creators
const fetchProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  const data = await api.getProducts();
  dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    // ... more cases
  }
};

// Component
const { products, loading } = useSelector((state) => state.products);
useEffect(() => {
  dispatch(fetchProducts());
}, []);
```

**After (TanStack Query + Zustand):**

```typescript
// Just use the hook
const { data: products, isLoading } = useProducts();
```

**Lines of code:** ~50 → ~1 (98% reduction)

## Conclusion

The two-state pattern gives us:

- ✅ **Less code** - 90% reduction in boilerplate
- ✅ **Better UX** - Automatic loading/error states
- ✅ **Performance** - Smart caching and refetching
- ✅ **Type safety** - Full TypeScript support
- ✅ **Testability** - Easy to mock and test

For more details, see:

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)
