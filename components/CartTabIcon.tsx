import { ms } from '@/utils/responsive-dimensions';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { IconSymbol } from './IconSymbol';

interface CartTabIconProps {
  color: string;
  count: number;
}

export default function CartTabIcon({ color, count }: CartTabIconProps) {
  const scale = useSharedValue(1);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      scale.value = withTiming(1.2, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
    }
    prevCount.current = count;
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ position: 'relative' }}>
      <IconSymbol name="cart.fill" size={ms(24)} color={color} />
      {count > 0 && (
        <Animated.View style={[styles.badge, animatedStyle]}>
          <Text style={styles.badgeText}>{count}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: ms(-6),
    right: ms(-8),
    backgroundColor: 'red',
    borderRadius: ms(9),
    minWidth: ms(18),
    height: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: ms(10),
    fontWeight: 'bold',
  },
});
