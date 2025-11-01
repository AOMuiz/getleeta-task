/**
 * Custom hooks using TanStack Query for Fake Store API
 * This shows how to use React Query for data fetching with Fake Store API
 */

import {
  fetchCategories,
  fetchProduct,
  fetchProducts,
  fetchProductsByCategory,
  fetchProductsPage,
} from '@/services/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch all products
 * Includes automatic caching, loading states, and error handling
 * @param limit - Optional limit for pagination
 */
export const useProducts = (limit?: number) => {
  return useQuery({
    queryKey: ['products', limit],
    queryFn: () => fetchProducts(limit),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

/**
 * Hook to fetch a single product by ID
 */
export const useProduct = (id: number | string) => {
  const productId = typeof id === 'string' ? Number(id) : id;

  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!id && productId > 0, // Only fetch if ID is valid
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // Categories don't change often
  });
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: category.length > 0, // Only fetch if category is provided
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch products with infinite scroll pagination
 * @param category - Optional category filter
 * @param limit - Items per page
 */
export const useInfiniteProducts = (category: string | null, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['products-infinite', category],
    queryFn: ({ pageParam = 0 }) =>
      fetchProductsPage({
        pageParam,
        limit,
        category: category || undefined,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages
      if (lastPage.length < limit) {
        return undefined; // No more pages
      }
      return allPages.length;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    // Keep previous data while fetching new category to avoid flashing
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Example usage in a component:
 *
 * const ProductList = () => {
 *   const { data, isLoading, isError, error, refetch } = useProducts(10);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (isError) return <ErrorMessage error={error} onRetry={refetch} />;
 *   if (!data || data.length === 0) return <EmptyState />;
 *
 *   return (
 *     <FlatList
 *       data={data}
 *       renderItem={({ item }) => <ProductCard product={item} />}
 *     />
 *   );
 * };
 */
