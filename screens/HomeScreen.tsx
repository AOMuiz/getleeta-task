import { ProductCard } from '@/components/ProductCard';
import { ProductListSkeleton } from '@/components/SkeletonLoader';
import ScreenContainer from '@/components/screen-container';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { Product } from '@/types/api';
import { ms, wp } from '@/utils/responsive-dimensions';
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

// Theme colors (light mode)
const theme = Colors.light;

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
          <FontAwesome name="bell" size={ms(24)} color={theme.text} />
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <Pressable style={styles.searchBar}>
        <FontAwesome name="search" size={ms(20)} color={theme.textSecondary} />
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
        <ActivityIndicator size="small" color={theme.primary} />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  if (isLoading && !data) {
    return (
      <ScreenContainer withPadding={false}>
        <ProductListSkeleton />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer withPadding={false}>
        <View style={styles.errorContainer}>
          <FontAwesome
            name="exclamation-circle"
            size={ms(48)}
            color={theme.error}
          />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>
            Unable to load products. Please try again.
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  if (!products || products.length === 0) {
    return (
      <ScreenContainer withPadding={false}>
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="shopping-basket"
            size={ms(64)}
            color={theme.disabled}
          />
          <Text style={styles.emptyTitle}>No Products Found</Text>
          <Text style={styles.emptyMessage}>
            Check back later for new arrivals
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer withPadding={false} edges={['top', 'left', 'right']}>
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
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: wp(Spacing.lg),
    paddingBottom: ms(100),
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingTop: ms(60),
    paddingBottom: ms(Spacing.xl),
    // paddingHorizontal: wp(Spacing.lg),
    backgroundColor: theme.background,
  },
  greeting: {
    fontSize: ms(Typography.sizes.sm),
    color: theme.textSecondary,
    marginBottom: ms(Spacing.xs),
    fontWeight: Typography.weights.regular,
  },
  headerTitle: {
    fontSize: ms(Typography.sizes.xxl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
  },
  notificationButton: {
    width: ms(48),
    height: ms(48),
    borderRadius: BorderRadius.full,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: ms(12),
    right: ms(12),
    width: ms(8),
    height: ms(8),
    borderRadius: BorderRadius.full,
    backgroundColor: theme.error,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    // marginHorizontal: wp(Spacing.lg),
    marginBottom: ms(Spacing.lg),
    paddingHorizontal: wp(Spacing.lg),
    paddingVertical: ms(14),
    borderRadius: BorderRadius.md,
    gap: ms(Spacing.md),
    ...Shadows.sm,
  },
  searchPlaceholder: {
    fontSize: ms(Typography.sizes.base),
    color: theme.textTertiary,
    fontWeight: Typography.weights.regular,
  },
  categoriesContainer: {
    marginBottom: ms(Spacing.xl),
    // paddingHorizontal: wp(Spacing.lg),
  },
  categoriesContent: {
    flexDirection: 'row',
    gap: ms(Spacing.md),
  },
  categoryChip: {
    paddingHorizontal: wp(Spacing.xl),
    paddingVertical: ms(10),
    borderRadius: BorderRadius.xl,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  categoryChipText: {
    fontSize: ms(Typography.sizes.sm),
    fontWeight: Typography.weights.semibold,
    color: theme.textSecondary,
  },
  categoryChipTextActive: {
    color: theme.textInverse,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(Spacing.lg),
    // paddingHorizontal: wp(Spacing.lg),
  },
  sectionTitle: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
  },
  seeAll: {
    fontSize: ms(Typography.sizes.sm),
    color: theme.primary,
    fontWeight: Typography.weights.semibold,
  },
  loadingFooter: {
    paddingVertical: ms(Spacing.xl),
    alignItems: 'center',
    gap: ms(Spacing.sm),
  },
  loadingText: {
    fontSize: ms(Typography.sizes.sm),
    color: theme.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(Spacing.xxxl),
    backgroundColor: theme.background,
  },
  errorTitle: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
    marginTop: ms(Spacing.lg),
    marginBottom: ms(Spacing.sm),
  },
  errorMessage: {
    fontSize: ms(Typography.sizes.sm),
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: ms(Spacing.xxl),
  },
  retryButton: {
    paddingHorizontal: wp(Spacing.xxxl),
    paddingVertical: ms(14),
    backgroundColor: theme.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  retryButtonText: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.textInverse,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(Spacing.xxxl),
    backgroundColor: theme.background,
  },
  emptyTitle: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
    marginTop: ms(Spacing.lg),
    marginBottom: ms(Spacing.sm),
  },
  emptyMessage: {
    fontSize: ms(Typography.sizes.sm),
    color: theme.textSecondary,
    textAlign: 'center',
  },
});
