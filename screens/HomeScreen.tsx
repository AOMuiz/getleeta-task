import { ProductCard } from '@/components/ProductCard';
import { ProductListSkeleton } from '@/components/SkeletonLoader';
import { Product } from '@/types/api';
import { FontAwesome } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ITEMS_PER_PAGE = 10;

const fetchProductsPage = async ({ pageParam = 0 }) => {
  const { data } = await axios.get<Product[]>(
    'https://fakestoreapi.com/products',
    {
      params: {
        limit: ITEMS_PER_PAGE,
        offset: pageParam,
      },
    }
  );
  return data;
};

export default function HomeScreen() {
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products-infinite'],
    queryFn: fetchProductsPage,
    getNextPageParam: (lastPage, allPages) => {
      // Fake Store API has limited products, so we'll simulate pagination
      // In a real app, you'd check if there are more pages from the API response
      const totalLoaded = allPages.length * ITEMS_PER_PAGE;
      return totalLoaded < 20 ? allPages.length : undefined; // Max 20 items
    },
    initialPageParam: 0,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleProductPress = (product: Product) => {
    // TODO: Navigate to product detail screen
    // router.push({
    //   pathname: '/product-detail',
    //   params: { id: product.id },
    // });
    console.log('Product pressed:', product.title);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Flatten all pages into a single array
  const products = React.useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.headerTitle}>Special For You</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <FontAwesome name="bell" size={24} color="#1a1a1a" />
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <Pressable style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="#666" />
        <Text style={styles.searchPlaceholder}>Search for food</Text>
      </Pressable>

      {/* Categories Chips */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesContent}>
          <Pressable style={[styles.categoryChip, styles.categoryChipActive]}>
            <Text
              style={[styles.categoryChipText, styles.categoryChipTextActive]}
            >
              All
            </Text>
          </Pressable>
          <Pressable style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>Electronics</Text>
          </Pressable>
          <Pressable style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>Clothing</Text>
          </Pressable>
          <Pressable style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>Jewelry</Text>
          </Pressable>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <Pressable>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>
    </>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#2D9F5E" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ProductListSkeleton />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>
            Unable to load products. Please try again.
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="shopping-basket" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Products Found</Text>
        <Text style={styles.emptyMessage}>
          Check back later for new arrivals
        </Text>
      </View>
    );
  };

  if (isLoading && !data) {
    return (
      <View style={styles.container}>
        <ProductListSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-circle" size={48} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>
          Unable to load products. Please try again.
        </Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="shopping-basket" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Products Found</Text>
        <Text style={styles.emptyMessage}>
          Check back later for new arrivals
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2D9F5E"
            colors={['#2D9F5E']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F8F9FA',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E1E9EE',
  },
  categoryChipActive: {
    backgroundColor: '#2D9F5E',
    borderColor: '#2D9F5E',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  seeAll: {
    fontSize: 14,
    color: '#2D9F5E',
    fontWeight: '600',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#2D9F5E',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
