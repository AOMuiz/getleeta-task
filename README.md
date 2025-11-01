# GetLeeta Task - React Native Mobile UI

A modern, polished mobile application built with React Native and Expo, featuring clean design, smooth micro-interactions, and efficient data fetching.

## 📱 Tech Stack

### Core Technologies

- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (~54.0.20) - Development platform and toolchain
- **Expo Router** (~6.0.13) - File-based routing system
- **TypeScript** (~5.9.2) - Type-safe development

### Data Management

- **TanStack Query (React Query)** (^5.90.5) - Server state management
  - Automatic caching and revalidation
  - Built-in loading, error, and success states
  - Optimistic updates and background refetching
  - Offline support with cache persistence
- **Zustand** (^5.0.2) - Global client state management
  - Lightweight and performant
  - Simple API with React hooks
  - Persistent state with AsyncStorage
  - TypeScript support
- **Axios** (^1.7.9) - HTTP client for API requests

### Animations & Interactions

- **React Native Reanimated** (~4.1.1) - High-performance animations
- **React Native Gesture Handler** (^2.29.0) - Native touch handling

### Storage & Persistence

- **AsyncStorage** (^2.2.0) - Local data persistence and cache storage

### Testing

- **Jest** (^30.2.0) - Testing framework
- **React Native Testing Library** (^13.3.3) - Component testing utilities

## 🎨 Design Approach

- **Clean Typography**: Consistent font sizes and weights for visual hierarchy
- **Thoughtful Spacing**: Using a consistent 8pt grid system
- **Accessible Contrast**: WCAG AA compliant color combinations
- **Responsive Layout**: Adapts to different screen sizes
- **Theme**: Dark theme with modern aesthetics

## 🚀 Data Fetching Methodology

### Why TanStack Query?

I chose **TanStack Query (React Query)** for several key reasons:

1. **Automatic State Management**: Eliminates boilerplate for loading/error/success states
2. **Smart Caching**: Reduces unnecessary API calls and improves performance
3. **Background Updates**: Keeps data fresh without user interaction
4. **Offline Support**: Works seamlessly with AsyncStorage for offline-first experience
5. **DevTools**: Built-in debugging tools for query inspection

### Implementation Strategy

```typescript
// Example query hook with caching
const { data, isLoading, isError, error, refetch } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
});
```

### Features Implemented

- ✅ Loading states with skeleton loaders
- ✅ Error states with retry functionality
- ✅ Empty states with helpful messaging
- ✅ Pull-to-refresh functionality
- ✅ Optimistic updates for better UX
- ✅ Cache persistence across app restarts

## 📦 API Choice

**Selected API**: **Fake Store API** (https://fakestoreapi.com/)

- Free REST API for e-commerce/shopping applications
- No authentication required
- Rich product data with images, prices, ratings, and categories
- Supports filtering, sorting, and pagination
- Perfect for showcasing product lists, detail views, and shopping cart UI

### Available Endpoints:

- `/products` - All products with optional limit
- `/products/{id}` - Single product details
- `/products/categories` - Product categories
- `/products/category/{category}` - Products by category
- `/carts` - Shopping carts data

## 🏛️ Architecture

### API Layer (Three-Tier)

1. **`/config/endpoints.ts`** - Centralized endpoint definitions

   - All API URLs organized by resource (products, carts, users)
   - Type-safe endpoint functions
   - Single source of truth for API routes

2. **`/services/api-client.ts`** - HTTP client configuration

   - Axios instance with base URL and timeout
   - Request/response interceptors
   - Error handling and logging

3. **`/services/api.ts`** - API business logic
   - Typed API functions (fetchProducts, fetchProduct, etc.)
   - Uses endpoints from config
   - Error transformation and handling

### State Management (Two-State Pattern)

1. **Server State** (TanStack Query via `/hooks/useAPI.ts`)

   - Product data, categories, carts
   - Automatic caching and background updates
   - Loading/error states built-in

2. **Client State** (Zustand via `/stores/useStore.ts`)
   - Shopping cart management
   - Favorites/wishlist
   - UI state (filters, search, sorting)
   - Persisted to AsyncStorage

### Data Flow

```
Component → useProducts() → fetchProducts() → apiClient.get() → Endpoints.products.all → API
```

## 🏗️ Project Structure

```
.
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Main list/grid view
│   │   ├── explore.tsx    # Secondary tab
│   │   └── _layout.tsx    # Tab layout configuration
│   ├── [id].tsx           # Detail view (dynamic route)
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   ├── loading/          # Loading states & skeletons
│   └── errors/           # Error components
├── config/               # Configuration files
│   ├── endpoints.ts      # API endpoint definitions
│   └── index.ts          # Config exports
├── hooks/                # Custom hooks
│   ├── useAPI.ts         # TanStack Query hooks for API
│   └── useAnimations.ts  # Animation hooks (future)
├── services/             # API & HTTP layer
│   ├── api-client.ts     # Axios instance + interceptors
│   ├── api.ts            # API functions (fetchProducts, etc.)
│   ├── interceptors.ts   # Request/response interceptors
│   └── queryClient.ts    # TanStack Query configuration
├── stores/               # Zustand state management
│   └── useStore.ts       # Global store (cart, favorites, UI)
├── types/                # TypeScript type definitions
│   ├── api.ts            # API-related types
│   └── index.ts          # Type exports
├── constants/            # App constants
│   └── theme.ts          # Theme tokens (colors, spacing, etc.)
└── __tests__/           # Test files
    └── example.test.tsx  # Example tests
```

## 💻 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- iOS Simulator (Mac only) or Android Studio with emulator
- Expo Go app (optional, for physical device testing)

### Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd getleeta-task
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm start
```

### Running on Devices/Emulators

#### iOS (Mac only)

```bash
npm run ios
```

- Requires Xcode and iOS Simulator
- Press `i` in terminal after `npm start` to launch iOS simulator

#### Android

```bash
npm run android
```

- Requires Android Studio and Android Emulator
- Press `a` in terminal after `npm start` to launch Android emulator

#### Web (for quick testing)

```bash
npm run web
```

#### Physical Device

1. Install **Expo Go** from App Store or Play Store
2. Run `npm start`
3. Scan the QR code with your device camera

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## ✨ Micro-Interactions Implemented

1. **Button Press States**

   - Scale animation on press
   - Haptic feedback (on supported devices)
   - Color transitions

2. **List Item Interactions**

   - Smooth press animations
   - Swipe gestures (if applicable)
   - Loading shimmer effects

3. **Pull-to-Refresh**

   - Custom animated refresh indicator
   - Smooth spring animations

4. **Navigation Transitions**

   - Slide and fade animations
   - Shared element transitions (if applicable)

5. **Loading States**

   - Skeleton loaders matching content layout
   - Smooth fade-in when data loads

6. **Toast Notifications**
   - Slide-in animations for success/error messages
   - Auto-dismiss with progress indicator

## 🎯 Key Features

- ✅ **File-based routing** with Expo Router
- ✅ **TypeScript** for type safety
- ✅ **Modern animations** with Reanimated
- ✅ **Smart caching** with TanStack Query
- ✅ **Offline support** with AsyncStorage
- ✅ **Component testing** with Jest & Testing Library
- ✅ **Loading/Error/Empty states** for better UX
- ✅ **Pull-to-refresh** functionality
- ✅ **Dark theme** with consistent design system
- ✅ **Centralized endpoints** configuration
- ✅ **Two-state architecture** (server + client state)

## 📚 Available Hooks

### API Hooks (TanStack Query)

Located in `/hooks/useAPI.ts`:

```typescript
// Fetch all products (with optional limit)
const { data, isLoading, isError, refetch } = useProducts(10);

// Fetch single product by ID
const { data: product } = useProduct(5);

// Fetch all categories
const { data: categories } = useCategories();

// Fetch products by category
const { data: products } = useProductsByCategory('electronics');
```

### Store Hooks (Zustand)

Located in `/stores/useStore.ts`:

```typescript
// Cart management
const { cart, addToCart, removeFromCart, clearCart } = useStore();
const itemsCount = useStore((state) => state.getCartItemsCount());
const total = useStore((state) => state.getCartTotal());

// Favorites
const { favorites, addToFavorites, removeFromFavorites } = useStore();
const isFavorite = useStore((state) => state.isFavorite(productId));

// UI state
const { selectedCategory, setSelectedCategory } = useStore();
const { searchQuery, setSearchQuery } = useStore();
const { sortBy, setSortBy } = useStore();
```

## ⚠️ Known Limitations & Trade-offs

### Trade-offs

1. **Expo vs Bare React Native**: Chose Expo for faster development and built-in features

   - Trade-off: Limited to Expo-compatible native modules
   - Benefit: Easier setup, OTA updates, faster iteration

2. **TanStack Query vs Redux**: Chose TanStack Query for server state

   - Trade-off: Less control over global client state
   - Benefit: Less boilerplate, better DX, automatic caching

3. **File-based Routing**: Using Expo Router instead of React Navigation manually
   - Trade-off: Newer, less community examples
   - Benefit: Cleaner code, type-safe routes, less configuration

### Known Limitations

- Web support is basic (optimized for mobile)
- Animations may not be as smooth on older Android devices
- Limited offline functionality (cache-based, not full offline-first)

## 🔄 Development Workflow

1. **Start the dev server**: `npm start`
2. **Make changes**: Edit files in `app/` or `components/`
3. **See changes**: Hot reload updates automatically
4. **Test**: Run `npm test` for component tests
5. **Build**: Use `eas build` for production builds (requires EAS setup)

## 📝 Code Quality

- **Linting**: ESLint configured for React Native
- **Formatting**: Prettier for consistent code style
- **Type Safety**: TypeScript with strict mode
- **Testing**: Jest + React Native Testing Library

## 🚀 Next Steps for Production

1. Set up EAS Build for app store deployment
2. Add comprehensive E2E tests with Detox
3. Implement analytics and crash reporting
4. Add proper error boundaries
5. Optimize bundle size and performance
6. Add accessibility features (screen reader support)
7. Implement proper app icons and splash screens

## 📄 License

This project is for evaluation purposes.

## 👤 Author

Submitted for GetLeeta Frontend Task

---

**Built with ❤️ using React Native & Expo**
