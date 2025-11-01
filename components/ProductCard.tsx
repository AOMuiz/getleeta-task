import { IconSymbol } from '@/components/IconSymbol';
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import { Product } from '@/types/api';
import { blurhash } from '@/utils';
import { ms, wp } from '@/utils/responsive-dimensions';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - wp(Spacing.xxxl + Spacing.lg)) / 2; // 2 columns with responsive padding

// Theme colors (light mode)
const theme = Colors.light;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } =
    useStore();

  const isFav = isFavorite(product.id);
  const favoriteScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleFavoritePress = () => {
    favoriteScale.value = withSpring(1.3, {}, () => {
      favoriteScale.value = withSpring(1);
    });

    if (isFav) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={styles.container}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            placeholder={{ blurhash }}
            contentFit="cover"
          />
          <Animated.View style={[styles.favoriteButton, favoriteAnimatedStyle]}>
            <Pressable
              onPress={handleFavoritePress}
              hitSlop={8}
              testID="favorite-button"
            >
              <IconSymbol
                name={isFav ? 'heart.fill' : 'heart'}
                size={ms(20)}
                color={isFav ? theme.secondary : theme.textSecondary}
              />
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category} numberOfLines={1}>
              {product.category}
            </Text>
            <View style={styles.rating}>
              <IconSymbol name="star.fill" size={ms(14)} color={theme.accent} />
              <Text style={styles.ratingText}>{product.rating.rate}</Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>

          <View style={styles.footer}>
            <View>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
            <Pressable
              style={styles.addButton}
              onPress={handleAddToCart}
              hitSlop={8}
              testID="add-to-cart-button"
            >
              <IconSymbol name="plus" size={ms(16)} color={theme.textInverse} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Memoized ProductCard with custom comparison for better performance
export const ProductCard = React.memo(
  ProductCardComponent,
  (prevProps, nextProps) => {
    // Only re-render if product id or onPress reference changed
    // This prevents unnecessary re-renders when parent updates
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: theme.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: ms(Spacing.lg),
    ...Shadows.md,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: ms(200),
    backgroundColor: theme.surfaceVariant,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: ms(Spacing.md),
    right: ms(Spacing.md),
    width: ms(40),
    height: ms(40),
    borderRadius: BorderRadius.full,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  content: {
    padding: ms(Spacing.lg),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(Spacing.sm),
  },
  category: {
    fontSize: ms(Typography.sizes.xs),
    color: theme.textSecondary,
    textTransform: 'capitalize',
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(Spacing.xs),
  },
  ratingText: {
    fontSize: ms(Typography.sizes.xs),
    color: theme.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  title: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.text,
    marginBottom: ms(Spacing.md),
    lineHeight: ms(22),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.primary,
  },
  addButton: {
    width: ms(44),
    height: ms(44),
    borderRadius: BorderRadius.full,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
});
