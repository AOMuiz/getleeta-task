# Development Documentation Index

Welcome to the technical documentation for the GetLeeta E-Commerce Mobile App.

## 📚 Documentation Structure

### Getting Started

- **[Quick Start Guide](./QUICK_START.md)** - Get running in 5 minutes
  - Installation steps
  - Running the app
  - Common commands
  - Troubleshooting

### Core Concepts

- **[Architecture Overview](./ARCHITECTURE.md)** - System design and patterns

  - Three-tier API architecture
  - Two-state pattern (TanStack Query + Zustand)
  - File-based routing
  - Component architecture
  - Data flow diagrams

- **[State Management](./STATE_MANAGEMENT.md)** - TanStack Query + Zustand deep dive

  - Why two libraries?
  - Query hooks and caching strategies
  - Zustand store patterns
  - Best practices and common patterns
  - Testing state management

- **[API Layer](./API_LAYER.md)** - Three-tier API architecture
  - Configuration layer (endpoints.ts)
  - HTTP client layer (api-client.ts)
  - Business logic layer (api.ts)
  - Adding new endpoints
  - Testing strategies

### Performance & Optimization

- **[Performance Optimization](./PERFORMANCE.md)** - Making it fast

  - FlatList optimization
  - React.memo and memoization
  - Image optimization
  - Animation performance
  - Bundle size optimization
  - Performance monitoring

- **[Animation System](./ANIMATIONS.md)** - React Native Reanimated guide
  - Core concepts (shared values, animated styles)
  - Implemented animations
  - Best practices
  - Advanced patterns
  - Common gotchas

## 🎯 By Use Case

### I want to...

**Understand the project**

1. Start with [Quick Start Guide](./QUICK_START.md)
2. Read [Architecture Overview](./ARCHITECTURE.md)
3. Explore the codebase

**Add a new feature**

1. Review [Architecture Overview](./ARCHITECTURE.md)
2. Check [API Layer](./API_LAYER.md) for API integration
3. Reference [State Management](./STATE_MANAGEMENT.md) for data handling
4. Follow existing patterns in the codebase

**Optimize performance**

1. Read [Performance Optimization](./PERFORMANCE.md)
2. Use React DevTools Profiler
3. Implement FlatList optimizations
4. Add memoization where needed

**Add animations**

1. Review [Animation System](./ANIMATIONS.md)
2. Study existing animations in ProductCard
3. Use Reanimated patterns
4. Test on physical devices

**Write tests**

1. Check existing tests in `__tests__` folders
2. Follow patterns in component tests
3. Mock TanStack Query and Zustand
4. Aim for 80%+ coverage

## 🏗️ Architecture Quick Reference

### Data Flow

```text
User Action
    ↓
Component
    ↓
Custom Hook (e.g., useProductsList)
    ↓
TanStack Query Hook (e.g., useInfiniteProducts)
    ↓
API Function (e.g., fetchProductsPage)
    ↓
Axios Client
    ↓
API Endpoint
    ↓
Fake Store API
```

### State Layers

```text
┌─────────────────────────────────────────┐
│         Component Layer                  │
│  (ProductCard, HomeScreen, etc.)        │
└──────────┬──────────────────────────────┘
           │
           ├──────────────┬─────────────────┐
           │              │                 │
           ▼              ▼                 ▼
    ┌──────────┐   ┌──────────┐   ┌────────────┐
    │ TanStack │   │  Zustand │   │   Local    │
    │  Query   │   │  Store   │   │   State    │
    │          │   │          │   │            │
    │ Products │   │   Cart   │   │ isPressed  │
    │Categories│   │Favorites │   │  focused   │
    │  etc.    │   │UI State  │   │            │
    └──────────┘   └──────────┘   └────────────┘
    (Server)       (Persisted)     (Ephemeral)
```

### Project Structure

```text
app/                      # Screens (Expo Router)
├── (tabs)/
│   ├── index.tsx        # Home → useProductsList → useInfiniteProducts
│   ├── cart.tsx         # Cart → useStore (cart state)
│   ├── menu.tsx         # Menu → useCategories
│   └── profile.tsx      # Profile → User preferences
└── product-detail.tsx   # Detail → useProduct(id)

components/              # Reusable components
├── ProductCard.tsx      # Memoized with animations
├── SkeletonLoader.tsx   # Loading states
└── StateViews.tsx       # Empty, Error, Loading

hooks/                   # Custom hooks
├── useAPI.ts           # TanStack Query wrappers
├── useProductsList.ts  # Business logic for list
└── useProductDetail.ts # Business logic for detail

services/               # API layer
├── api.ts              # API functions
├── api-client.ts       # Axios instance
└── queryClient.ts      # TanStack Query config

stores/                 # State management
└── useStore.ts         # Zustand store

config/                 # Configuration
└── endpoints.ts        # API endpoints
```

## 📊 Technology Decisions

### Why These Technologies?

| Technology         | Alternative      | Why Chosen                                     |
| ------------------ | ---------------- | ---------------------------------------------- |
| **Expo**           | Bare RN          | Faster development, OTA updates, easier setup  |
| **TanStack Query** | Redux            | 90% less code, automatic caching, better DX    |
| **Zustand**        | Redux            | Simple API, less boilerplate, great TS support |
| **Reanimated**     | Animated API     | 60fps native thread animations                 |
| **Expo Router**    | React Navigation | Type-safe routes, file-based, cleaner code     |
| **Axios**          | Fetch            | Interceptors, better error handling, timeout   |
| **Jest**           | Other            | Industry standard, great RN support            |

## 🔍 Code Examples

### Adding a New Screen

```typescript
// 1. Create app/reviews.tsx
export default function ReviewsScreen() {
  const { data, isLoading } = useReviews();

  if (isLoading) return <LoadingState />;

  return <ReviewsList reviews={data} />;
}

// 2. Navigate to it
router.push('/reviews');

// That's it! Auto-added to routes
```

### Adding a New API Endpoint

```typescript
// 1. config/endpoints.ts
reviews: {
  byProduct: (id: number) => `/reviews/product/${id}`,
}

// 2. services/api.ts
export const fetchReviews = async (productId: number) => {
  const { data } = await apiClient.get(
    Endpoints.reviews.byProduct(productId)
  );
  return data;
};

// 3. hooks/useAPI.ts
export const useReviews = (productId: number) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => api.fetchReviews(productId),
  });
};

// 4. Use in component
const { data: reviews } = useReviews(productId);
```

### Adding State to Store

```typescript
// stores/useStore.ts
interface StoreState {
  // ... existing state

  // New state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ... existing state

      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        // ... existing persisted state
        theme: state.theme, // Add to persisted state
      }),
    }
  )
);

// Use in component
const { theme, setTheme } = useStore();
```

## 🧪 Testing Patterns

### Component Test

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from '@/components/ProductCard';

test('adds product to cart on button press', () => {
  const { getByTestId } = render(
    <ProductCard product={mockProduct} onPress={jest.fn()} />
  );

  fireEvent.press(getByTestId('add-to-cart-button'));

  expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
});
```

### Hook Test

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { useProducts } from '@/hooks/useAPI';

test('fetches products', async () => {
  const { result } = renderHook(() => useProducts());

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toHaveLength(10);
});
```

## 🚀 Performance Tips

1. **Use React.memo** for list items
2. **Use useCallback** for stable function references
3. **Use useMemo** for expensive calculations
4. **Optimize FlatList** with proper props
5. **Use Reanimated** for smooth animations
6. **Implement TanStack Query** stale times
7. **Use Zustand selectors** to minimize re-renders

## 📝 Best Practices

### Do's ✅

- Memoize list items with custom comparison
- Use TypeScript for all files
- Write tests for new components
- Use custom hooks for complex logic
- Keep components focused and small
- Use semantic naming
- Document complex logic
- Handle loading/error/empty states

### Don'ts ❌

- Don't use inline functions in renders
- Don't skip error handling
- Don't mutate state directly
- Don't overuse useEffect
- Don't create context providers unnecessarily
- Don't ignore TypeScript errors
- Don't skip testing

## 🔗 External Resources

### Official Docs

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Learning Resources

- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [TanStack Query Tutorial](https://tanstack.com/query/latest/docs/react/quick-start)
- [Reanimated Examples](https://github.com/software-mansion/react-native-reanimated/tree/main/example)

## 💡 Pro Tips

1. **Use TypeScript strict mode** - Catches bugs early
2. **Profile before optimizing** - Don't guess, measure
3. **Keep hooks simple** - One responsibility per hook
4. **Test user behavior** - Not implementation details
5. **Use Expo DevTools** - Great for debugging
6. **Enable Fast Refresh** - Instant feedback
7. **Check bundle size** - Keep it under 5MB

## 🆘 Getting Help

### In Order of Preference

1. Check these docs (you're here!)
2. Search issues in the repo
3. Check official documentation
4. Search Stack Overflow
5. Create an issue

### When Creating an Issue

Include:

- What you're trying to do
- What you expected to happen
- What actually happened
- Steps to reproduce
- Environment (OS, Node version, etc.)
- Relevant code snippets
- Error messages (full stack trace)

## 📈 Project Stats

- **Lines of Code**: ~3,500
- **Components**: 15+
- **Screens**: 5
- **Custom Hooks**: 8+
- **Test Coverage**: 80%+
- **Bundle Size**: 3.2MB
- **Technologies**: 12+

## 🎓 Learning Outcomes

After studying this codebase, you'll understand:

- Modern React Native development with Expo
- Advanced state management patterns
- Performance optimization techniques
- Animation with Reanimated 2
- Testing best practices
- TypeScript in production
- Clean architecture principles
- API integration patterns

## ✨ Contributing

### Before Contributing

1. Read the documentation
2. Check existing issues
3. Follow the code style
4. Write tests
5. Update documentation

### Code Style

- Use TypeScript
- Follow ESLint rules
- Use functional components
- Use hooks for logic
- Keep files under 300 lines
- Write descriptive commit messages

## 📄 License

This project is for evaluation purposes.

---

**Last Updated**: November 2024

**Version**: 1.0.0

**Status**: ✅ Production Ready
