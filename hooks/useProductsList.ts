import { fetchCategories, fetchProductsPage } from '@/services/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 10;

export const useProductsList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const categories = useMemo(() => {
    return categoriesData || [];
  }, [categoriesData]);

  // Fetch products with infinite scroll
  const {
    data,
    isLoading: isProductsLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products-infinite', selectedCategory],
    queryFn: ({ pageParam = 0 }) =>
      fetchProductsPage({
        pageParam,
        limit: ITEMS_PER_PAGE,
        category: selectedCategory || undefined,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined; // No more pages
      }
      return allPages.length;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Flatten all pages into a single array
  const products = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Category selection handler
  const handleCategoryPress = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  return {
    // Data
    products,
    categories,
    selectedCategory,

    // Loading states
    isLoading: isProductsLoading,
    isCategoriesLoading,
    isFetchingNextPage,
    refreshing,

    // Error
    error,

    // Pagination
    hasNextPage,

    // Actions
    handleCategoryPress,
    handleLoadMore,
    onRefresh,
    refetch,
  };
};
