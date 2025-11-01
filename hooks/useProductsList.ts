import { useCategories, useInfiniteProducts } from '@/hooks/useAPI';
import { useCallback, useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 10;

export const useProductsList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch categories using API hook
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();

  const categories = useMemo(() => {
    return categoriesData || [];
  }, [categoriesData]);

  // Fetch products with infinite scroll using API hook
  const {
    data,
    isLoading: isProductsLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(selectedCategory, ITEMS_PER_PAGE);

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
