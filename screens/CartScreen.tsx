import { IconSymbol } from '@/components/IconSymbol';
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
import { useStore } from '@/stores/useStore';
import { CartItem, Product } from '@/types/api';
import { blurhash } from '@/utils';
import { ms, wp } from '@/utils/responsive-dimensions';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const theme = Colors.light;

type TabType = 'cart' | 'favorites';

export default function CartScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('cart');
  const router = useRouter();

  const {
    cart,
    favorites,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    removeFromFavorites,
    addToCart,
    clearFavorites,
  } = useStore();

  const handleIncrement = (item: CartItem) => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      handleRemoveItem(item.product.id);
    }
  };

  const handleRemoveItem = (productId: number) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFromCart(productId),
      },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearFavorites(),
        },
      ]
    );
  };

  const handleProductPress = (productId: number) => {
    router.push({
      pathname: '/product-detail',
      params: { id: productId.toString() },
    });
  };

  const handleAddFavoriteToCart = (product: Product) => {
    addToCart(product, 1);
    Alert.alert('Success', `${product.title} added to cart!`);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      style={styles.cartItem}
    >
      <Pressable
        style={styles.cartItemContent}
        onPress={() => handleProductPress(item.product.id)}
      >
        <Image
          source={{ uri: item.product.image }}
          style={styles.itemImage}
          contentFit="contain"
          placeholder={{ blurhash }}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.product.title}
          </Text>
          <Text style={styles.itemCategory}>{item.product.category}</Text>
          <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>
        </View>
      </Pressable>

      <View style={styles.itemActions}>
        <View style={styles.quantityControl}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleDecrement(item)}
          >
            <IconSymbol
              name={item.quantity === 1 ? 'trash' : 'minus.circle.fill'}
              size={ms(22)}
              color={item.quantity === 1 ? theme.error : theme.text}
            />
          </Pressable>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => handleIncrement(item)}
          >
            <IconSymbol
              name="plus.circle.fill"
              size={ms(22)}
              color={theme.primary}
            />
          </Pressable>
        </View>
        <Text style={styles.itemTotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </Animated.View>
  );

  const renderFavoriteItem = ({ item }: { item: Product }) => (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      style={styles.favoriteItem}
    >
      <Pressable
        style={styles.favoriteItemContent}
        onPress={() => handleProductPress(item.id)}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.favoriteImage}
          resizeMode="contain"
        />
        <View style={styles.favoriteDetails}>
          <Text style={styles.favoriteTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.favoriteCategory}>{item.category}</Text>
          <View style={styles.favoriteFooter}>
            <Text style={styles.favoritePrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.favoriteRating}>
              <IconSymbol name="star.fill" size={ms(14)} color={theme.accent} />
              <Text style={styles.ratingText}>{item.rating.rate}</Text>
            </View>
          </View>
        </View>
      </Pressable>

      <View style={styles.favoriteActions}>
        <Pressable
          style={styles.addToCartBtn}
          onPress={() => handleAddFavoriteToCart(item)}
        >
          <IconSymbol
            name="cart.fill"
            size={ms(18)}
            color={theme.textInverse}
          />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
        <Pressable
          style={styles.removeBtn}
          onPress={() => removeFromFavorites(item.id)}
        >
          <IconSymbol name="trash" size={ms(18)} color={theme.error} />
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="cart.fill" size={ms(80)} color={theme.disabled} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptyMessage}>
        Add items to your cart to see them here
      </Text>
    </View>
  );

  const renderEmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="heart.fill" size={ms(80)} color={theme.disabled} />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyMessage}>
        Save items you love to find them easily later
      </Text>
    </View>
  );

  return (
    <ScreenContainer withPadding={false} edges={['top', ...edgesHorizontal]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === 'cart' ? 'Shopping Cart' : 'Favorites'}
        </Text>
        {((activeTab === 'cart' && cart.length > 0) ||
          (activeTab === 'favorites' && favorites.length > 0)) && (
          <Pressable
            onPress={
              activeTab === 'cart' ? handleClearCart : handleClearFavorites
            }
          >
            <Text style={styles.clearButton}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'cart' && styles.activeTab]}
          onPress={() => setActiveTab('cart')}
        >
          <IconSymbol
            name="cart.fill"
            size={ms(20)}
            color={activeTab === 'cart' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'cart' && styles.activeTabText,
            ]}
          >
            Cart {cart.length > 0 && `(${cart.length})`}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <IconSymbol
            name="heart.fill"
            size={ms(20)}
            color={
              activeTab === 'favorites' ? theme.primary : theme.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'favorites' && styles.activeTabText,
            ]}
          >
            Favorites {favorites.length > 0 && `(${favorites.length})`}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === 'cart' ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyCart}
            showsVerticalScrollIndicator={false}
          />

          {/* Checkout Bar */}
          {cart.length > 0 && (
            <View style={styles.checkoutBar}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  ${getCartTotal().toFixed(2)}
                </Text>
              </View>
              <Pressable style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
                <IconSymbol
                  name="arrow.forward.circle.fill"
                  size={ms(20)}
                  color={theme.textInverse}
                />
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyFavorites}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(Spacing.lg),
    paddingVertical: ms(Spacing.lg),
    backgroundColor: theme.background,
  },
  headerTitle: {
    fontSize: ms(Typography.sizes.xxl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
  },
  clearButton: {
    fontSize: ms(Typography.sizes.sm),
    fontWeight: Typography.weights.semibold,
    color: theme.error,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(Spacing.lg),
    gap: ms(Spacing.md),
    marginBottom: ms(Spacing.lg),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(Spacing.sm),
    paddingVertical: ms(12),
    borderRadius: BorderRadius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activeTab: {
    backgroundColor: theme.primary + '15',
    borderColor: theme.primary,
  },
  tabText: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.textSecondary,
  },
  activeTabText: {
    color: theme.primary,
  },
  listContent: {
    paddingHorizontal: wp(Spacing.lg),
    paddingBottom: ms(120),
    flexGrow: 1,
  },
  cartItem: {
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    padding: ms(Spacing.lg),
    marginBottom: ms(Spacing.md),
    ...Shadows.sm,
  },
  cartItemContent: {
    flexDirection: 'row',
    marginBottom: ms(Spacing.md),
  },
  itemImage: {
    width: ms(80),
    height: ms(80),
    borderRadius: BorderRadius.md,
    backgroundColor: theme.surfaceVariant,
  },
  itemDetails: {
    flex: 1,
    marginLeft: ms(Spacing.md),
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.text,
    lineHeight: ms(20),
  },
  itemCategory: {
    fontSize: ms(Typography.sizes.xs),
    color: theme.textSecondary,
    textTransform: 'capitalize',
  },
  itemPrice: {
    fontSize: ms(Typography.sizes.lg),
    fontWeight: Typography.weights.bold,
    color: theme.primary,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(Spacing.md),
  },
  quantityButton: {
    padding: ms(4),
  },
  quantityText: {
    fontSize: ms(Typography.sizes.lg),
    fontWeight: Typography.weights.bold,
    color: theme.text,
    minWidth: ms(30),
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
  },
  favoriteItem: {
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    padding: ms(Spacing.lg),
    marginBottom: ms(Spacing.md),
    ...Shadows.sm,
  },
  favoriteItemContent: {
    flexDirection: 'row',
    marginBottom: ms(Spacing.md),
  },
  favoriteImage: {
    width: ms(90),
    height: ms(90),
    borderRadius: BorderRadius.md,
    backgroundColor: theme.surfaceVariant,
  },
  favoriteDetails: {
    flex: 1,
    marginLeft: ms(Spacing.md),
  },
  favoriteTitle: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.text,
    lineHeight: ms(20),
    marginBottom: ms(Spacing.xs),
  },
  favoriteCategory: {
    fontSize: ms(Typography.sizes.xs),
    color: theme.textSecondary,
    textTransform: 'capitalize',
    marginBottom: ms(Spacing.sm),
  },
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoritePrice: {
    fontSize: ms(Typography.sizes.lg),
    fontWeight: Typography.weights.bold,
    color: theme.primary,
  },
  favoriteRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(Spacing.xs),
  },
  ratingText: {
    fontSize: ms(Typography.sizes.sm),
    fontWeight: Typography.weights.semibold,
    color: theme.textSecondary,
  },
  favoriteActions: {
    flexDirection: 'row',
    gap: ms(Spacing.md),
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(Spacing.sm),
    backgroundColor: theme.primary,
    paddingVertical: ms(12),
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  addToCartText: {
    fontSize: ms(Typography.sizes.sm),
    fontWeight: Typography.weights.bold,
    color: theme.textInverse,
  },
  removeBtn: {
    width: ms(48),
    height: ms(48),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.error + '15',
    borderRadius: BorderRadius.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ms(60),
  },
  emptyTitle: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
    marginTop: ms(Spacing.xl),
    marginBottom: ms(Spacing.sm),
  },
  emptyMessage: {
    fontSize: ms(Typography.sizes.base),
    color: theme.textSecondary,
    textAlign: 'center',
    paddingHorizontal: wp(Spacing.xxxl),
  },
  checkoutBar: {
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
    ...Shadows.lg,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(Spacing.md),
  },
  totalLabel: {
    fontSize: ms(Typography.sizes.base),
    color: theme.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  totalAmount: {
    fontSize: ms(Typography.sizes.xxxl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(Spacing.sm),
    backgroundColor: theme.primary,
    paddingVertical: ms(16),
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  },
  checkoutButtonText: {
    fontSize: ms(Typography.sizes.lg),
    fontWeight: Typography.weights.bold,
    color: theme.textInverse,
  },
});
