# Quick Start Guide

## Get Running in 5 Minutes

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **iOS Simulator** (macOS) or **Android Studio** (any OS)

### Installation

```bash
# 1. Clone and navigate
git clone https://github.com/AOMuiz/getleeta-task
cd getleeta-task

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

### Running the App

**iOS (macOS only):**

```bash
npm run ios
# Or press 'i' in the terminal after npm start
```

**Android:**

```bash
npm run android
# Or press 'a' in the terminal after npm start
```

**Physical Device:**

1. Install **Expo Go** app from App Store/Play Store
2. Scan QR code from terminal

### What You'll See

**Home Screen:**

- Product grid with 2 columns
- Category filter chips
- Infinite scroll pagination
- Pull-to-refresh

**Product Card Features:**

- Product image with blurhash placeholder
- Category badge and rating
- Price and add-to-cart button
- Favorite heart icon (animated on toggle)

**Interactions:**

- Tap card → View product details
- Tap heart → Add/remove from favorites
- Tap plus → Add to cart
- Scroll down → Load more products
- Pull down → Refresh products
- Tap category → Filter by category

## Project Structure Overview

```text
app/                    # Screens (Expo Router)
  (tabs)/              # Tab navigation
    index.tsx          # Home (Product list)
    cart.tsx           # Shopping cart
    profile.tsx        # User profile

components/            # Reusable UI components
  ProductCard.tsx      # Product card with animations
  SkeletonLoader.tsx   # Loading states
  StateViews.tsx       # Empty/Error states

hooks/                 # Custom React hooks
  useAPI.ts           # TanStack Query hooks
  useProductsList.ts  # Product list logic

services/             # API layer
  api.ts              # API functions
  api-client.ts       # Axios configuration

stores/               # State management
  useStore.ts         # Zustand store (cart, favorites)

config/               # Configuration
  endpoints.ts        # API endpoints
```

## Key Technologies

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **React Native**   | Cross-platform mobile framework |
| **Expo**           | Development toolchain           |
| **TypeScript**     | Type safety                     |
| **TanStack Query** | Server state & caching          |
| **Zustand**        | Client state (cart, favorites)  |
| **Reanimated**     | Smooth 60fps animations         |
| **Axios**          | HTTP client                     |

## Common Commands

```bash
# Development
npm start              # Start dev server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run in browser

# Testing
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode

# Code Quality
npm run lint          # Run linter
```

## Features Checklist

- ✅ Product list with infinite scroll
- ✅ Category filtering
- ✅ Product detail view
- ✅ Shopping cart with persistence
- ✅ Favorites/wishlist
- ✅ Pull-to-refresh
- ✅ Loading states (skeletons)
- ✅ Error states (with retry)
- ✅ Empty states
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Component tests

## Need Help?

### Documentation

- **[Main README](../README.md)** - Project overview
- **[Dev Docs](./README.md)** - In-depth technical guides
- **[Architecture](./ARCHITECTURE.md)** - System design
- **[State Management](./STATE_MANAGEMENT.md)** - TanStack Query + Zustand
- **[API Layer](./API_LAYER.md)** - API architecture

### Common Issues

**Metro bundler not starting:**

```bash
# Clear cache and restart
npx expo start -c
```

**iOS build fails:**

```bash
# Clean build folder
cd ios && xcodebuild clean && cd ..
npx expo run:ios
```

**Android build fails:**

```bash
# Clean gradle
cd android && ./gradlew clean && cd ..
npx expo run:android
```

**TypeScript errors:**

```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Tests failing:**

```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

### Performance Issues

**App is slow:**

1. Run on physical device (simulators are slower)
2. Enable Release build for testing
3. Check FlatList props in `HomeScreen.tsx`

**Images loading slowly:**

- Check network connection
- Images are cached after first load
- Blurhash placeholders show while loading

## Next Steps

1. **Explore the code** - Start with `app/(tabs)/index.tsx`
2. **Read the docs** - Check out `/dev-docs` for deep dives
3. **Run the tests** - `npm test` to see test coverage
4. **Make changes** - Try modifying a component
5. **Add features** - Follow patterns in existing code

## Quick Tips

**Hot Reload:**

- Save file → Changes appear instantly
- Sometimes need to refresh (shake device or Cmd+D)

**Debugging:**

- Shake device → Open developer menu
- Press `j` in terminal → Open debugger
- Use React DevTools for component inspection

**State Management:**

- Server data → Use TanStack Query hooks (`useProducts()`)
- Cart/Favorites → Use Zustand (`useStore()`)

**Adding New Screen:**

1. Create file in `app/` folder (e.g., `app/settings.tsx`)
2. Auto-added to routes
3. Navigate with `router.push('/settings')`

**Adding New Component:**

1. Create file in `components/` folder
2. Export component
3. Import where needed

**Adding New API Endpoint:**

1. Add to `config/endpoints.ts`
2. Add function to `services/api.ts`
3. Add hook to `hooks/useAPI.ts`
4. Use hook in component

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)

## Happy Coding! 🚀

For any questions or issues, check the documentation or create an issue.
