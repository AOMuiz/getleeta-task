/**
 * Advanced Skeleton Component
 *
 * Exports the MemoizedSkeletonComponent with shiver/gradient animations
 * and helper components for common use cases.
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  ANIMATION_DIRECTION,
  ANIMATION_TYPE,
  DEFAULT_BG_COLOR,
} from './config';
import { MemoizedSkeletonComponent } from './SkeletonComponent';
import type { TSkaletonComponent } from './types';

export { ANIMATION_DIRECTION, ANIMATION_TYPE } from './config';
export { MemoizedSkeletonComponent as SkeletonComponent } from './SkeletonComponent';
export type { TSkaletonComponent } from './types';

interface SkeletonProps extends Partial<TSkaletonComponent> {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
}

/**
 * Skeleton - Convenience wrapper for SkeletonComponent
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  backgroundColor = DEFAULT_BG_COLOR,
  direction = ANIMATION_DIRECTION.leftToRight,
  animationType = ANIMATION_TYPE.shiver,
  pulseConfig,
  style,
}) => {
  return (
    <MemoizedSkeletonComponent
      viewWidth={width as any}
      viewHeight={height as any}
      backgroundColor={backgroundColor}
      direction={direction}
      animationType={animationType}
      pulseConfig={pulseConfig || {}}
      style={style || {}}
    />
  );
};

interface ProductCardSkeletonProps {
  imageHeight?: number;
  borderRadius?: number;
  animationType?: ANIMATION_TYPE;
  direction?: ANIMATION_DIRECTION;
  style?: ViewStyle;
}

/**
 * ProductCardSkeleton - Advanced skeleton for product cards
 */
export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  imageHeight = 200,
  borderRadius = 12,
  animationType = ANIMATION_TYPE.shiver,
  direction = ANIMATION_DIRECTION.leftToRight,
  style,
}) => {
  return (
    <View style={[styles.cardContainer, { borderRadius }, style]}>
      <Skeleton
        width="100%"
        height={imageHeight}
        animationType={animationType}
        direction={direction}
      />
      <View style={styles.cardContent}>
        <Skeleton
          width="80%"
          height={20}
          style={styles.titleSkeleton}
          animationType={animationType}
          direction={direction}
        />
        <Skeleton
          width="60%"
          height={16}
          style={styles.descriptionSkeleton}
          animationType={animationType}
          direction={direction}
        />
        <View style={styles.cardFooter}>
          <Skeleton
            width={80}
            height={24}
            animationType={animationType}
            direction={direction}
          />
          <Skeleton
            width={40}
            height={40}
            animationType={animationType}
            direction={direction}
          />
        </View>
      </View>
    </View>
  );
};

interface ProductListSkeletonProps {
  count?: number;
  showTitle?: boolean;
  titleWidth?: number;
  animationType?: ANIMATION_TYPE;
  direction?: ANIMATION_DIRECTION;
  style?: ViewStyle;
}

/**
 * ProductListSkeleton - Advanced skeleton for product lists
 */
export const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({
  count = 3,
  showTitle = true,
  titleWidth = 150,
  animationType = ANIMATION_TYPE.shiver,
  direction = ANIMATION_DIRECTION.leftToRight,
  style,
}) => {
  return (
    <View style={[styles.listContainer, style]}>
      {showTitle && (
        <Skeleton
          width={titleWidth}
          height={32}
          style={styles.listTitle}
          animationType={animationType}
          direction={direction}
        />
      )}
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton
          key={index}
          animationType={animationType}
          direction={direction}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
