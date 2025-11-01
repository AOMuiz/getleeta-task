import { fetchProduct } from '@/services/api';
import { useStore } from '@/stores/useStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';

export const useProductDetail = (productId: string) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } =
    useStore();

  // Fetch product data
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(Number(productId)),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Animation values
  const imageScale = useSharedValue(1);
  const favoriteScale = useSharedValue(1);
  const addToCartScale = useSharedValue(1);

  // Check if product is favorited
  const isFav = product ? isFavorite(product.id) : false;

  // Handlers
  const handleFavoritePress = () => {
    if (!product) return;

    favoriteScale.value = withSpring(1.3, {}, () => {
      favoriteScale.value = withSpring(1);
    });

    if (isFav) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    addToCartScale.value = withSpring(0.9, {}, () => {
      addToCartScale.value = withSpring(1);
    });

    try {
      addToCart(product, quantity);

      // Show success feedback
      Alert.alert(
        'Added to Cart',
        `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
        [
          {
            text: 'Continue Shopping',
            style: 'cancel',
            onPress: () => setIsAddingToCart(false),
          },
          {
            text: 'View Cart',
            onPress: () => {
              setIsAddingToCart(false);
              router.push('/(tabs)/cart');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const totalPrice = product ? product.price * quantity : 0;

  return {
    // Data
    product,
    isLoading,
    error,
    isFav,
    quantity,
    totalPrice,
    isAddingToCart,

    // Actions
    handleFavoritePress,
    handleAddToCart,
    incrementQuantity,
    decrementQuantity,
    refetch,

    // Animation values
    imageScale,
    favoriteScale,
    addToCartScale,
  };
};
