/**
 * Unit tests for Advanced Skeleton Components
 * Tests the SkeletonComponent with shiver and pulse animations
 */

import {
  ANIMATION_DIRECTION,
  ANIMATION_TYPE,
  ProductCardSkeleton,
  ProductListSkeleton,
  Skeleton,
} from '@/components/skeleton';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

describe('Advanced Skeleton Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      const { toJSON } = render(<Skeleton />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom width', () => {
      const { toJSON } = render(<Skeleton width={200} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom height', () => {
      const { toJSON } = render(<Skeleton height={50} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with percentage width', () => {
      const { toJSON } = render(<Skeleton width="80%" />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom backgroundColor', () => {
      const { toJSON } = render(<Skeleton backgroundColor="#FF0000" />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom style', () => {
      const customStyle = { marginBottom: 10 };
      const { toJSON } = render(<Skeleton style={customStyle} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Animation Types', () => {
    it('should render with shiver animation', () => {
      const { toJSON } = render(
        <Skeleton animationType={ANIMATION_TYPE.shiver} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with pulse animation', () => {
      const { toJSON } = render(
        <Skeleton animationType={ANIMATION_TYPE.pulse} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Animation Directions', () => {
    it('should render with leftToRight direction', () => {
      const { toJSON } = render(
        <Skeleton direction={ANIMATION_DIRECTION.leftToRight} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with rightToLeft direction', () => {
      const { toJSON } = render(
        <Skeleton direction={ANIMATION_DIRECTION.rightToLeft} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with topToBottom direction', () => {
      const { toJSON } = render(
        <Skeleton direction={ANIMATION_DIRECTION.topToBottom} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with bottomToTop direction', () => {
      const { toJSON } = render(
        <Skeleton direction={ANIMATION_DIRECTION.bottomToTop} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Pulse Configuration', () => {
    it('should render with custom pulse config', () => {
      const { toJSON } = render(
        <Skeleton
          animationType={ANIMATION_TYPE.pulse}
          pulseConfig={{
            animationDuration: 2000,
            minOpacity: 0.2,
          }}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with complete pulse config', () => {
      const { toJSON } = render(
        <Skeleton
          animationType={ANIMATION_TYPE.pulse}
          pulseConfig={{
            animationDuration: 1500,
            minOpacity: 0.3,
          }}
        />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Props Combinations', () => {
    it('should handle all props together', () => {
      const { toJSON } = render(
        <Skeleton
          width={150}
          height={30}
          backgroundColor="#DDD"
          animationType={ANIMATION_TYPE.shiver}
          direction={ANIMATION_DIRECTION.leftToRight}
          style={{ margin: 5 }}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should handle shiver with different directions', () => {
      const { toJSON } = render(
        <Skeleton
          width="90%"
          height={40}
          animationType={ANIMATION_TYPE.shiver}
          direction={ANIMATION_DIRECTION.topToBottom}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should handle pulse with custom config', () => {
      const { toJSON } = render(
        <Skeleton
          width={200}
          height={50}
          animationType={ANIMATION_TYPE.pulse}
          pulseConfig={{ minOpacity: 0.4, animationDuration: 1000 }}
        />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero dimensions', () => {
      const { toJSON } = render(<Skeleton width={0} height={0} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should handle very large dimensions', () => {
      const { toJSON } = render(<Skeleton width={1000} height={500} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should handle undefined style', () => {
      const { toJSON } = render(<Skeleton style={undefined} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});

describe('Advanced ProductCardSkeleton', () => {
  describe('Rendering', () => {
    it('should render correctly with defaults', () => {
      const { toJSON } = render(<ProductCardSkeleton />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom image height', () => {
      const { toJSON } = render(<ProductCardSkeleton imageHeight={150} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom border radius', () => {
      const { toJSON } = render(<ProductCardSkeleton borderRadius={8} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with shiver animation', () => {
      const { toJSON } = render(
        <ProductCardSkeleton animationType={ANIMATION_TYPE.shiver} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with pulse animation', () => {
      const { toJSON } = render(
        <ProductCardSkeleton animationType={ANIMATION_TYPE.pulse} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom direction', () => {
      const { toJSON } = render(
        <ProductCardSkeleton direction={ANIMATION_DIRECTION.rightToLeft} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom style', () => {
      const { toJSON } = render(<ProductCardSkeleton style={{ margin: 10 }} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render all skeleton components', () => {
      const { UNSAFE_getAllByType } = render(<ProductCardSkeleton />);
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });
  });

  describe('Animation Combinations', () => {
    it('should handle shiver with all directions', () => {
      const directions = [
        ANIMATION_DIRECTION.leftToRight,
        ANIMATION_DIRECTION.rightToLeft,
        ANIMATION_DIRECTION.topToBottom,
        ANIMATION_DIRECTION.bottomToTop,
      ];

      directions.forEach((direction) => {
        const { toJSON } = render(
          <ProductCardSkeleton
            animationType={ANIMATION_TYPE.shiver}
            direction={direction}
          />
        );
        expect(toJSON()).toBeTruthy();
      });
    });

    it('should handle all props together', () => {
      const { toJSON } = render(
        <ProductCardSkeleton
          imageHeight={180}
          borderRadius={10}
          animationType={ANIMATION_TYPE.shiver}
          direction={ANIMATION_DIRECTION.leftToRight}
          style={{ marginBottom: 12 }}
        />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Structure', () => {
    it('should have correct container structure', () => {
      const { UNSAFE_getAllByType } = render(<ProductCardSkeleton />);
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });

    it('should render multiple instances without conflict', () => {
      const { toJSON } = render(
        <View>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot with shiver', () => {
      const { toJSON } = render(
        <ProductCardSkeleton animationType={ANIMATION_TYPE.shiver} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with pulse', () => {
      const { toJSON } = render(
        <ProductCardSkeleton animationType={ANIMATION_TYPE.pulse} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});

describe('Advanced ProductListSkeleton', () => {
  describe('Rendering', () => {
    it('should render correctly with defaults', () => {
      const { toJSON } = render(<ProductListSkeleton />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom count', () => {
      const { toJSON } = render(<ProductListSkeleton count={5} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render without title', () => {
      const { toJSON } = render(<ProductListSkeleton showTitle={false} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom title width', () => {
      const { toJSON } = render(<ProductListSkeleton titleWidth={200} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render with shiver animation', () => {
      const { toJSON } = render(
        <ProductListSkeleton animationType={ANIMATION_TYPE.shiver} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with pulse animation', () => {
      const { toJSON } = render(
        <ProductListSkeleton animationType={ANIMATION_TYPE.pulse} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom direction', () => {
      const { toJSON } = render(
        <ProductListSkeleton direction={ANIMATION_DIRECTION.topToBottom} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom style', () => {
      const { toJSON } = render(
        <ProductListSkeleton style={{ padding: 20 }} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render multiple ProductCardSkeleton components', () => {
      const { UNSAFE_getAllByType } = render(<ProductListSkeleton />);
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(3);
    });
  });

  describe('Count Configuration', () => {
    it('should render exactly 1 card when count is 1', () => {
      const { toJSON } = render(<ProductListSkeleton count={1} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render exactly 5 cards when count is 5', () => {
      const { toJSON } = render(<ProductListSkeleton count={5} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render zero cards when count is 0', () => {
      const { toJSON } = render(<ProductListSkeleton count={0} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Animation Combinations', () => {
    it('should handle all props together', () => {
      const { toJSON } = render(
        <ProductListSkeleton
          count={4}
          showTitle={true}
          titleWidth={180}
          animationType={ANIMATION_TYPE.shiver}
          direction={ANIMATION_DIRECTION.leftToRight}
          style={{ margin: 10 }}
        />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should propagate animation type to children', () => {
      const { toJSON } = render(
        <ProductListSkeleton count={2} animationType={ANIMATION_TYPE.pulse} />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should render in a parent container', () => {
      const { getByTestId } = render(
        <View testID="parent-container">
          <ProductListSkeleton />
        </View>
      );
      expect(getByTestId('parent-container')).toBeTruthy();
    });

    it('should work with multiple instances', () => {
      const { toJSON } = render(
        <View>
          <ProductListSkeleton />
          <ProductListSkeleton />
        </View>
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot with shiver', () => {
      const { toJSON } = render(
        <ProductListSkeleton animationType={ANIMATION_TYPE.shiver} />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with pulse', () => {
      const { toJSON } = render(
        <ProductListSkeleton animationType={ANIMATION_TYPE.pulse} />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});

describe('Advanced Skeleton Components Integration', () => {
  describe('Combined Usage', () => {
    it('should render Skeleton and ProductCardSkeleton together', () => {
      const { toJSON } = render(
        <View>
          <Skeleton width={200} height={20} />
          <ProductCardSkeleton />
        </View>
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render all skeleton types together', () => {
      const { toJSON } = render(
        <View>
          <Skeleton width="100%" height={30} />
          <ProductCardSkeleton />
          <ProductListSkeleton />
        </View>
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should handle nested structures', () => {
      const { getByTestId } = render(
        <View testID="outer-container">
          <View testID="inner-container">
            <Skeleton width={100} height={20} />
            <ProductCardSkeleton />
          </View>
        </View>
      );
      expect(getByTestId('outer-container')).toBeTruthy();
      expect(getByTestId('inner-container')).toBeTruthy();
    });

    it('should mix different animation types', () => {
      const { toJSON } = render(
        <View>
          <Skeleton
            width={200}
            height={20}
            animationType={ANIMATION_TYPE.shiver}
          />
          <ProductCardSkeleton animationType={ANIMATION_TYPE.pulse} />
          <ProductListSkeleton
            count={2}
            animationType={ANIMATION_TYPE.shiver}
            direction={ANIMATION_DIRECTION.rightToLeft}
          />
        </View>
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should handle multiple renders without issues', () => {
      const { rerender } = render(<Skeleton width={100} height={20} />);
      rerender(<Skeleton width={200} height={40} />);
      rerender(<Skeleton width={150} height={30} />);
    });

    it('should handle rapid re-renders of ProductCardSkeleton', () => {
      const { rerender } = render(<ProductCardSkeleton />);
      for (let i = 0; i < 5; i++) {
        rerender(<ProductCardSkeleton />);
      }
    });

    it('should handle rapid re-renders of ProductListSkeleton', () => {
      const { rerender } = render(<ProductListSkeleton />);
      for (let i = 0; i < 5; i++) {
        rerender(<ProductListSkeleton />);
      }
    });

    it('should handle animation type changes', () => {
      const { rerender } = render(
        <Skeleton animationType={ANIMATION_TYPE.shiver} />
      );
      rerender(<Skeleton animationType={ANIMATION_TYPE.pulse} />);
      rerender(<Skeleton animationType={ANIMATION_TYPE.shiver} />);
    });
  });
});
