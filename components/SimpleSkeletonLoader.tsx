/**
 * SimpleSkeletonLoader Component
 *
 * A simple, lightweight skeleton loader with pulse animation.
 * Uses basic opacity animation for loading states.
 *
 * For more advanced skeleton animations (shiver, gradient effects),
 * use the SkeletonComponent from @/components/skeleton
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SimpleSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  backgroundColor?: string;
  animationDuration?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

/**
 * SimpleSkeleton - Basic skeleton component with pulse animation
 */
export const SimpleSkeleton: React.FC<SimpleSkeletonProps> = ({
  width: skeletonWidth = '100%',
  height = 20,
  borderRadius = 4,
  style,
  backgroundColor = '#E1E9EE',
  animationDuration = 1000,
  minOpacity = 0.3,
  maxOpacity = 1,
}) => {
  const opacity = useSharedValue(minOpacity);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(maxOpacity, { duration: animationDuration }),
      -1,
      true
    );
  }, [animationDuration, maxOpacity, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: skeletonWidth as any,
          height,
          borderRadius,
          backgroundColor,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

interface ProductCardSkeletonProps {
  imageHeight?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * SimpleProductCardSkeleton - Skeleton for product card layout
 */
export const SimpleProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  imageHeight = 200,
  borderRadius = 12,
  style,
}) => {
  return (
    <View style={[styles.cardContainer, { borderRadius }, style]}>
      <SimpleSkeleton
        width="100%"
        height={imageHeight}
        borderRadius={borderRadius}
      />
      <View style={styles.cardContent}>
        <SimpleSkeleton width="80%" height={20} style={styles.titleSkeleton} />
        <SimpleSkeleton
          width="60%"
          height={16}
          style={styles.descriptionSkeleton}
        />
        <View style={styles.cardFooter}>
          <SimpleSkeleton width={80} height={24} borderRadius={8} />
          <SimpleSkeleton width={40} height={40} borderRadius={20} />
        </View>
      </View>
    </View>
  );
};

interface ProductListSkeletonProps {
  count?: number;
  showTitle?: boolean;
  titleWidth?: number;
  style?: ViewStyle;
}

/**
 * SimpleProductListSkeleton - Skeleton for product list layout
 */
export const SimpleProductListSkeleton: React.FC<ProductListSkeletonProps> = ({
  count = 3,
  showTitle = true,
  titleWidth = 150,
  style,
}) => {
  return (
    <View style={[styles.listContainer, style]}>
      {showTitle && (
        <SimpleSkeleton
          width={titleWidth}
          height={32}
          style={styles.listTitle}
        />
      )}
      {Array.from({ length: count }).map((_, index) => (
        <SimpleProductCardSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
  },
  listContainer: {
    padding: 16,
  },
  listTitle: {
    marginBottom: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 12,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  descriptionSkeleton: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

// Deprecated exports - for backward compatibility
// TODO: Remove these in next major version
export const Skeleton = SimpleSkeleton;
export const ProductCardSkeleton = SimpleProductCardSkeleton;
export const ProductListSkeleton = SimpleProductListSkeleton;
