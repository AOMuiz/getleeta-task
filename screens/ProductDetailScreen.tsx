import { IconSymbol } from '@/components/IconSymbol';
import { ErrorState, LoadingState } from '@/components/StateViews';
import ScreenContainer from '@/components/screen-container';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useProductDetail } from '@/hooks/useProductDetail';
import { isIOS } from '@/utils';
import { ms, wp } from '@/utils/responsive-dimensions';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const theme = Colors.light;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    product,
    isLoading,
    error,
    isFav,
    quantity,
    totalPrice,
    isAddingToCart,
    cartQuantity,
    handleFavoritePress,
    handleAddToCart,
    incrementQuantity,
    decrementQuantity,
    refetch,
    imageScale,
    favoriteScale,
    addToCartScale,
  } = useProductDetail(id || '');

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  const addToCartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addToCartScale.value }],
  }));

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading product details..." />
      </ScreenContainer>
    );
  }

  if (error || !product) {
    return (
      <ScreenContainer>
        <ErrorState
          title="Product Not Found"
          message="We couldn't load this product. Please try again."
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer withPadding={false} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header with back button and favorite */}
        <View style={styles.header}>
          <Animated.View entering={FadeIn.duration(400)}>
            <Pressable
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <IconSymbol
                name="chevron.left"
                size={ms(20)}
                color={theme.text}
              />
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(400).delay(100)}
            style={favoriteAnimatedStyle}
          >
            <Pressable
              style={styles.headerButton}
              onPress={handleFavoritePress}
            >
              <IconSymbol
                name={isFav ? 'heart.fill' : 'heart'}
                size={ms(24)}
                color={isFav ? theme.secondary : theme.text}
              />
            </Pressable>
          </Animated.View>
        </View>

        {/* Product Image */}
        <Animated.View
          style={[styles.imageContainer, imageAnimatedStyle]}
          entering={FadeInUp.duration(600)}
        >
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Product Details */}
        <Animated.View
          style={styles.detailsContainer}
          entering={FadeInDown.duration(600).delay(200)}
        >
          {/* Category and Rating */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={ms(18)} color={theme.accent} />
              <Text style={styles.ratingText}>{product.rating.rate}</Text>
              <Text style={styles.ratingCount}>
                ({product.rating.count} reviews)
              </Text>
            </View>
          </View>

          {/* In Cart Badge */}
          {cartQuantity > 0 && (
            <View style={styles.cartBadge}>
              <IconSymbol
                name="cart.fill"
                size={ms(16)}
                color={theme.primary}
              />
              <Text style={styles.cartBadgeText}>{cartQuantity} in cart</Text>
            </View>
          )}

          {/* Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Price */}
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <Pressable
                style={[
                  styles.quantityButton,
                  quantity === 1 && styles.quantityButtonDisabled,
                ]}
                onPress={decrementQuantity}
                disabled={quantity === 1}
              >
                <IconSymbol
                  name="minus.circle.fill"
                  size={ms(24)}
                  color={quantity === 1 ? theme.disabled : theme.text}
                />
              </Pressable>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <Pressable
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <IconSymbol
                  name="plus.circle.fill"
                  size={ms(24)}
                  color={theme.primary}
                />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View
        style={styles.bottomBar}
        entering={FadeInUp.duration(600).delay(400)}
      >
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.unitPrice}>${product.price.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.quantityBadge}>x{quantity}</Text>
          </View>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>

        <AnimatedPressable
          style={[
            styles.addToCartButton,
            isAddingToCart && styles.addToCartButtonDisabled,
            addToCartAnimatedStyle,
          ]}
          onPress={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color={theme.textInverse} />
          ) : (
            <>
              <IconSymbol
                name="cart.fill"
                size={ms(20)}
                color={theme.textInverse}
              />
              <Text style={styles.addToCartText}>
                {cartQuantity > 0 ? 'Update Cart' : 'Add to Cart'}
              </Text>
            </>
          )}
        </AnimatedPressable>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(Spacing.lg),
    paddingTop: isIOS() ? ms(Spacing.xl) : 0,
    paddingBottom: ms(Spacing.md),
    backgroundColor: theme.background,
  },
  headerButton: {
    width: ms(48),
    height: ms(48),
    borderRadius: BorderRadius.full,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  imageContainer: {
    width: width,
    height: height * 0.4,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(Spacing.xl),
  },
  image: {
    width: '80%',
    height: '80%',
  },
  detailsContainer: {
    backgroundColor: theme.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: wp(Spacing.lg),
    paddingTop: ms(Spacing.xxl),
    paddingBottom: ms(140), // Space for bottom bar
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(Spacing.lg),
  },
  categoryBadge: {
    paddingHorizontal: wp(Spacing.lg),
    paddingVertical: ms(8),
    backgroundColor: theme.primary + '20',
    borderRadius: BorderRadius.md,
  },
  categoryText: {
    fontSize: ms(Typography.sizes.sm),
    fontWeight: Typography.weights.semibold,
    color: theme.primary,
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(Spacing.xs),
  },
  ratingText: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.bold,
    color: theme.text,
  },
  ratingCount: {
    fontSize: ms(Typography.sizes.sm),
    color: theme.textSecondary,
  },
  cartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(Spacing.xs),
    backgroundColor: theme.primary + '15',
    paddingHorizontal: wp(Spacing.md),
    paddingVertical: ms(6),
    borderRadius: BorderRadius.md,
    marginBottom: ms(Spacing.md),
    alignSelf: 'flex-start',
  },
  cartBadgeText: {
    fontSize: ms(Typography.sizes.sm),
    fontWeight: Typography.weights.semibold,
    color: theme.primary,
  },
  title: {
    fontSize: ms(Typography.sizes.xxl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
    marginBottom: ms(Spacing.md),
    lineHeight: ms(32),
  },
  price: {
    fontSize: ms(Typography.sizes.xxxl),
    fontWeight: Typography.weights.bold,
    color: theme.primary,
    marginBottom: ms(Spacing.xxl),
  },
  section: {
    marginBottom: ms(Spacing.xxl),
  },
  sectionTitle: {
    fontSize: ms(Typography.sizes.lg),
    fontWeight: Typography.weights.bold,
    color: theme.text,
    marginBottom: ms(Spacing.md),
  },
  description: {
    fontSize: ms(Typography.sizes.base),
    color: theme.textSecondary,
    lineHeight: ms(24),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(Spacing.lg),
  },
  quantityButton: {
    width: ms(48),
    height: ms(48),
    borderRadius: BorderRadius.md,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityDisplay: {
    minWidth: ms(60),
    paddingHorizontal: wp(Spacing.md),
    paddingVertical: ms(8),
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.surface,
    paddingHorizontal: wp(Spacing.lg),
    paddingTop: ms(Spacing.lg),
    paddingBottom: ms(Spacing.xxl),
    borderTopWidth: 1,
    borderTopColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(Spacing.md),
    ...Shadows.lg,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: ms(Typography.sizes.xs),
    color: theme.textSecondary,
    marginBottom: ms(2),
  },
  unitPrice: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.text,
  },
  divider: {
    width: 1,
    height: ms(40),
    backgroundColor: theme.border,
  },
  totalSection: {
    flex: 1.2,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(Spacing.xs),
    marginBottom: ms(2),
  },
  totalLabel: {
    fontSize: ms(Typography.sizes.xs),
    color: theme.textSecondary,
  },
  quantityBadge: {
    fontSize: ms(Typography.sizes.xs),
    fontWeight: Typography.weights.semibold,
    color: theme.primary,
    backgroundColor: theme.primary + '20',
    paddingHorizontal: wp(Spacing.sm),
    paddingVertical: ms(2),
    borderRadius: BorderRadius.sm,
  },
  totalPrice: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.primary,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(Spacing.sm),
    backgroundColor: theme.primary,
    paddingHorizontal: wp(Spacing.lg),
    paddingVertical: ms(14),
    borderRadius: BorderRadius.md,
    minWidth: ms(140),
    ...Shadows.md,
  },
  addToCartButtonDisabled: {
    opacity: 0.7,
  },
  addToCartText: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.bold,
    color: theme.textInverse,
  },
});
