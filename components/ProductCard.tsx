import { useStore } from '@/stores/useStore';
import { Product } from '@/types/api';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ProductCard: React.FC<ProductCardProps> = ({
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
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <Animated.View style={[styles.favoriteButton, favoriteAnimatedStyle]}>
          <Pressable
            onPress={handleFavoritePress}
            hitSlop={8}
            testID="favorite-button"
          >
            <FontAwesome
              name={isFav ? 'heart' : 'heart-o'}
              size={20}
              color={isFav ? '#FF6B6B' : '#666'}
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
            <FontAwesome name="star" size={14} color="#FFC107" />
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
            <FontAwesome name="plus" size={16} color="#fff" />
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D9F5E',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2D9F5E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D9F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
