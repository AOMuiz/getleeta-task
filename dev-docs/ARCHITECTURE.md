# Architecture Overview

## System Design Philosophy

This project follows a **modular, layered architecture** with clear separation of concerns:

- **Presentation Layer** - React components and screens
- **Business Logic Layer** - Custom hooks and state management
- **Data Layer** - API clients and data transformation
- **Configuration Layer** - Constants, themes, and endpoints

## Architecture Patterns

### 1. Three-Tier API Architecture

```text
┌─────────────────────────────────────────────────────┐
│                 Presentation Layer                   │
│         (Components, Screens, Hooks)                 │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              Business Logic Layer                    │
│     ┌─────────────────┐    ┌──────────────────┐    │
│     │  useAPI.ts      │    │  useStore.ts     │    │
│     │  (TanStack      │    │  (Zustand)       │    │
│     │   Query)        │    │                  │    │
│     └────────┬────────┘    └──────────────────┘    │
└──────────────┼──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│                   Data Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ api.ts       │  │ api-client.ts│  │endpoints  │ │
│  │ (Functions)  │→ │ (Axios)      │→ │  .ts      │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
              ┌─────────────────┐
              │  External API   │
              │  (Fake Store)   │
              └─────────────────┘
```

### 2. Two-State Pattern

We separate **server state** and **client state**:

**Server State (TanStack Query):**

- Data from external APIs
- Automatically cached
- Background refetching
- Loading/error states managed

**Client State (Zustand):**

- UI state (filters, search)
- Shopping cart
- Favorites/wishlist
- Persisted to AsyncStorage

**Why this separation?**

- **Server state** has different concerns (caching, refetching, synchronization)
- **Client state** is purely local and transient
- Reduces complexity by using specialized tools for each concern

### 3. File-Based Routing (Expo Router)

```text
app/
├── (tabs)/              # Tab navigation group
│   ├── index.tsx        # → /
│   ├── menu.tsx         # → /menu
│   ├── cart.tsx         # → /cart
│   └── profile.tsx      # → /profile
├── product-detail.tsx   # → /product-detail?id=123
└── _layout.tsx          # Root layout wrapper
```

**Benefits:**

- Type-safe navigation
- Automatic deep linking
- Cleaner than manual route configuration
- Built-in route params handling

## Data Flow

### Product List Flow

```text
HomeScreen
    ↓
useProductsList (custom hook)
    ↓
useInfiniteProducts (TanStack Query)
    ↓
fetchProductsPage (API function)
    ↓
apiClient.get (Axios instance)
    ↓
Endpoints.products.all (URL builder)
    ↓
Fake Store API
```

### Shopping Cart Flow

```text
ProductCard
    ↓
addToCart (Zustand action)
    ↓
Update cart state
    ↓
Persist to AsyncStorage (automatic)
    ↓
Re-render components using cart
```

## Key Design Decisions

### 1. Custom Hooks for Business Logic

**Pattern:**

```typescript
// hooks/useProductsList.ts
export const useProductsList = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data, fetchNextPage, ... } = useInfiniteProducts(
    selectedCategory,
    10
  );

  // Business logic here
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  return {
    products,
    handleCategoryPress,
    // ... other exports
  };
};
```

**Benefits:**

- Encapsulates complex logic
- Easy to test in isolation
- Reusable across components
- Clear separation of concerns

### 2. Component Memoization

**Pattern:**

```typescript
const ProductCardComponent = ({ product, onPress }) => {
  // Component logic
};

export const ProductCard = React.memo(
  ProductCardComponent,
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.product.id === nextProps.product.id;
  }
);
```

**Why:**

- Prevents unnecessary re-renders
- Improves FlatList performance
- Essential for large lists

### 3. Centralized Configuration

**Pattern:**

```typescript
// config/endpoints.ts
export const Endpoints = {
  products: {
    all: (limit?: number) => `/products${limit ? `?limit=${limit}` : ''}`,
    byId: (id: number) => `/products/${id}`,
    byCategory: (category: string) => `/products/category/${category}`,
  },
};
```

**Benefits:**

- Single source of truth
- Easy to update URLs
- Type-safe endpoint building
- Better maintainability

## Component Architecture

### Screen Components

**Responsibility:**

- Layout and composition
- Coordinate multiple sub-components
- Use custom hooks for data/logic
- Handle navigation

**Example:**

```typescript
// screens/HomeScreen.tsx
export default function HomeScreen() {
  const router = useRouter();
  const { products, isLoading, ... } = useProductsList();

  return (
    <ScreenContainer>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product-detail?id=${item.id}`)}
          />
        )}
      />
    </ScreenContainer>
  );
}
```

### Presentational Components

**Responsibility:**

- Rendering UI
- Handling user interactions (callbacks)
- Local animations
- Self-contained logic

**Example:**

```typescript
// components/ProductCard.tsx
export const ProductCard = ({ product, onPress }) => {
  const { addToCart, isFavorite } = useStore();
  const scale = useSharedValue(1);

  // Only presentation logic here
  return <Animated.View>{/* UI elements */}</Animated.View>;
};
```

### Container Components

**Responsibility:**

- Fetch data
- Manage state
- Pass data to presentational components
- Handle side effects

**We use custom hooks instead of traditional container components:**

```typescript
// Instead of:
// containers/ProductListContainer.tsx

// We use:
// hooks/useProductsList.ts
```

## Error Handling Strategy

### API Layer

```typescript
// services/api-client.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error
    console.error('API Error:', error);

    // Transform error
    return Promise.reject({
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status,
    });
  }
);
```

### Component Layer

```typescript
const { data, isError, error, refetch } = useProducts();

if (isError) {
  return <ErrorState message={error.message} onRetry={refetch} />;
}
```

## Performance Considerations

### 1. Code Splitting

- Lazy load screens with dynamic imports (future enhancement)
- Split large bundles by route

### 2. Image Optimization

- Use Expo Image with blurhash placeholders
- Lazy load images as user scrolls
- Cache images aggressively

### 3. List Rendering

- Use FlatList with optimization props
- Memoize list items
- Use `getItemLayout` when possible
- Implement windowing for very large lists

## Security Considerations

### 1. API Keys

- No API keys required for Fake Store API
- If added, use environment variables
- Never commit secrets to git

### 2. Data Validation

- Validate API responses with TypeScript
- Sanitize user inputs (search, etc.)
- Handle malformed data gracefully

### 3. Storage

- AsyncStorage is unencrypted
- Don't store sensitive data (passwords, tokens)
- Clear sensitive data on logout

## Scalability Path

### Adding New Features

**1. New API Endpoint:**

```typescript
// 1. Add to config/endpoints.ts
reviews: {
  byProduct: (id: number) => `/products/${id}/reviews`,
}

// 2. Add to services/api.ts
export const fetchReviews = async (productId: number) => {
  const { data } = await apiClient.get(
    Endpoints.reviews.byProduct(productId)
  );
  return data;
};

// 3. Create hook in hooks/useAPI.ts
export const useReviews = (productId: number) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(productId),
  });
};
```

**2. New Screen:**

```typescript
// 1. Create file: app/reviews.tsx
export default function ReviewsScreen() {
  const { reviews } = useReviews();
  return <ReviewsList reviews={reviews} />;
}

// 2. Navigate to it:
router.push('/reviews');
```

### Growing the Team

**Onboarding Checklist:**

1. Read this architecture doc
2. Review State Management guide
3. Study Component Architecture patterns
4. Run and explore the app locally
5. Fix a good first issue
6. Write tests for your changes

### Technical Debt Management

**Current Known Debt:**

- [ ] Add E2E tests
- [ ] Implement proper error boundaries
- [ ] Add analytics tracking
- [ ] Improve TypeScript strictness
- [ ] Add bundle size monitoring

**Process:**

- Document debt in backlog
- Prioritize by impact
- Address during refactoring cycles
- Never let debt block features

## Conclusion

This architecture prioritizes:

- **Developer Experience** - Easy to understand and modify
- **Performance** - Optimized for mobile constraints
- **Maintainability** - Clear patterns and conventions
- **Scalability** - Room to grow without major rewrites

For specific implementation details, see the other docs in this folder.
