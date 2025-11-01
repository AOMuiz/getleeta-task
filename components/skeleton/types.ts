import type { DimensionValue, ViewStyle } from 'react-native';
import type {
  EasingFunction,
  EasingFunctionFactory,
} from 'react-native-reanimated';
import { ANIMATION_DIRECTION, ANIMATION_TYPE } from './config';

export type TSkaletonComponent = {
  viewHeight: DimensionValue;
  viewWidth: DimensionValue;
  style?: ViewStyle;
  backgroundColor?: string;
  direction?: ANIMATION_DIRECTION;
  animationType?: ANIMATION_TYPE;
  pulseConfig?: {
    animationDuration?: number;
    easing?: EasingFunction | EasingFunctionFactory;
    minOpacity?: number;
  };
};
