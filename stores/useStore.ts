/**
 * Zustand Store for Global State Management
 *
 * This store manages:
 * - Shopping cart
 * - Favorites/wishlist
 * - UI state (filters, sorting, etc.)
 */

import type { CartItem, Product, SortOption } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Store State Interface
interface StoreState {
  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Favorites State
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;

  // UI State
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Update quantity if item exists
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Add new item
          return {
            cart: [...state.cart, { product, quantity }],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getCartItemsCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Favorites State
      favorites: [],

      addToFavorites: (product) => {
        set((state) => {
          const exists = state.favorites.find((p) => p.id === product.id);
          if (exists) return state;

          return {
            favorites: [...state.favorites, product],
          };
        });
      },

      removeFromFavorites: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      // UI State
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      sortBy: 'name',
      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: 'app-storage', // unique name for AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist cart and favorites, not UI state
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
      }),
    }
  )
);

/**
 * Example usage in components:
 *
 * const ProductCard = ({ product }: { product: Product }) => {
 *   const { addToCart, addToFavorites, isFavorite } = useStore();
 *   const isLiked = isFavorite(product.id);
 *
 *   return (
 *     <View>
 *       <Text>{product.title}</Text>
 *       <Button onPress={() => addToCart(product)}>Add to Cart</Button>
 *       <Button onPress={() => addToFavorites(product)}>
 *         {isLiked ? 'Unlike' : 'Like'}
 *       </Button>
 *     </View>
 *   );
 * };
 *
 * const CartBadge = () => {
 *   const itemsCount = useStore((state) => state.getCartItemsCount());
 *   return <Text>{itemsCount}</Text>;
 * };
 */
