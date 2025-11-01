import { IconSymbol } from '@/components/IconSymbol';
import { ProductCard } from '@/components/ProductCard';
import { ProductListSkeleton } from '@/components/SkeletonLoader';
import { EmptyState, ErrorState } from '@/components/StateViews';
import ScreenContainer, {
  edgesHorizontal,
} from '@/components/screen-container';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useProductsList } from '@/hooks/useProductsList';
import { Product } from '@/types/api';
import { ms, wp } from '@/utils/responsive-dimensions';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Theme colors (light mode)
const theme = Colors.light;

export default function HomeScreen() {
  const router = useRouter();

  const {
    products,
    categories,
    selectedCategory,
    isLoading,
    isFetchingNextPage,
    refreshing,
    error,
    hasNextPage,
    handleCategoryPress,
    handleLoadMore,
    onRefresh,
    refetch,
  } = useProductsList();

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product-detail',
      params: { id: product.id.toString() },
    });
  };

  // Memoize renderItem to prevent unnecessary re-renders
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={() => handleProductPress(item)} />
    ),
    [] // handleProductPress is stable, so empty deps array is fine
  );

  // Memoize keyExtractor
  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.headerTitle}>Special For You</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <IconSymbol name="bell.fill" size={ms(24)} color={theme.text} />
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <Pressable style={styles.searchBar}>
        <IconSymbol
          name="magnifyingglass"
          size={ms(20)}
          color={theme.textSecondary}
        />
        <Text style={styles.searchPlaceholder}>Search for products</Text>
      </Pressable>

      {/* Categories Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <Pressable
          style={[
            styles.categoryChip,
            selectedCategory === null && styles.categoryChipActive,
          ]}
          onPress={() => handleCategoryPress(null)}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === null && styles.categoryChipTextActive,
            ]}
          >
            All
          </Text>
        </Pressable>
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

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

  const renderContent = () => {
    // Show error state (only if no products to show)
    if (error && products.length === 0) {
      return (
        <ErrorState
          title="Oops! Something went wrong"
          message="Unable to load products. Please try again."
          onRetry={() => refetch()}
        />
      );
    }

    // Show empty state (only when not loading and no products)
    if (!isLoading && (!products || products.length === 0)) {
      return (
        <EmptyState
          icon="shopping-basket"
          title="No Products Found"
          message="Check back later for new arrivals"
        />
      );
    }

    // Show products list (or skeleton on initial load)
    return (
      <FlatList
        data={isLoading && products.length === 0 ? [] : products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading && products.length === 0 ? <ProductListSkeleton /> : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || (isLoading && products.length > 0)}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
    );
  };

  return (
    <ScreenContainer withPadding={false} edges={['top', ...edgesHorizontal]}>
      {renderContent()}
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
    maxHeight: ms(60),
  },
  categoriesContent: {
    flexDirection: 'row',
    gap: ms(Spacing.md),
    paddingRight: wp(Spacing.lg),
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
});
