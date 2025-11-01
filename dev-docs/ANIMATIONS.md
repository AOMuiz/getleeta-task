# Animation System Guide

## Overview

This project uses **React Native Reanimated 2** for high-performance animations that run on the native thread.

## Why Reanimated?

### Comparison

| Feature     | Animated API | Reanimated 2  |
| ----------- | ------------ | ------------- |
| Thread      | JS Thread    | Native Thread |
| FPS         | 30-60        | 60+           |
| Gestures    | Limited      | Full support  |
| Performance | Good         | Excellent     |
| Bundle Size | Included     | +~300KB       |

**Verdict:** Reanimated 2 for production apps with smooth interactions

## Core Concepts

### 1. Shared Values

**Purpose:** Store animated values that can be accessed from both JS and native thread

```typescript
import { useSharedValue } from 'react-native-reanimated';

const scale = useSharedValue(1); // Initial value: 1
```

**Key Points:**

- Created with `useSharedValue(initialValue)`
- Access with `.value`: `scale.value = 2`
- Reactive: Changes trigger re-animations
- Not reactive in React: Doesn't trigger component re-render

### 2. Animated Styles

**Purpose:** Create styles that respond to shared values

```typescript
import { useAnimatedStyle } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
  opacity: opacity.value,
}));
```

**Usage:**

```typescript
<Animated.View style={[styles.box, animatedStyle]}>
  {/* content */}
</Animated.View>
```

### 3. Animation Functions

**withSpring** - Natural, bouncy animations:

```typescript
import { withSpring } from 'react-native-reanimated';

scale.value = withSpring(1.5, {
  damping: 15, // Bounciness (lower = more bounce)
  stiffness: 150, // Speed (higher = faster)
  mass: 1, // Weight
  overshootClamping: false, // Allow overshoot
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
});
```

**withTiming** - Linear or eased animations:

```typescript
import { withTiming, Easing } from 'react-native-reanimated';

opacity.value = withTiming(0, {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
});
```

**withSequence** - Chain animations:

```typescript
import { withSequence } from 'react-native-reanimated';

scale.value = withSequence(
  withSpring(1.3), // Scale up
  withSpring(1) // Scale back
);
```

**withDelay** - Delayed animations:

```typescript
import { withDelay } from 'react-native-reanimated';

opacity.value = withDelay(500, withTiming(1, { duration: 300 }));
```

## Implemented Animations

### 1. Press Animations (ProductCard)

**Pattern:** Scale down on press, spring back on release

```typescript
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.98);
};

const handlePressOut = () => {
  scale.value = withSpring(1);
};

return (
  <Animated.View style={animatedStyle}>
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {/* content */}
    </Pressable>
  </Animated.View>
);
```

**Why this works:**

- Provides tactile feedback
- Feels natural with spring physics
- Runs at 60fps on native thread
- Doesn't block JS thread

### 2. Favorite Heart Animation

**Pattern:** Bounce when toggled

```typescript
const favoriteScale = useSharedValue(1);

const favoriteAnimatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: favoriteScale.value }],
}));

const handleFavoritePress = () => {
  // Animate scale up then back
  favoriteScale.value = withSpring(1.3, {}, () => {
    // Callback after first animation
    favoriteScale.value = withSpring(1);
  });

  // Toggle favorite in state
  if (isFav) {
    removeFromFavorites(product.id);
  } else {
    addToFavorites(product);
  }
};

return (
  <Animated.View style={favoriteAnimatedStyle}>
    <Pressable onPress={handleFavoritePress}>
      <IconSymbol
        name={isFav ? 'heart.fill' : 'heart'}
        color={isFav ? theme.secondary : theme.textSecondary}
      />
    </Pressable>
  </Animated.View>
);
```

**Enhancements:**

- Could add rotation for more personality
- Could use `withSequence` for complex sequences
- Could add haptic feedback on iOS

### 3. Skeleton Loaders

**Two implementations:**

#### Simple Pulse (SimpleSkeletonLoader)

```typescript
const opacity = useSharedValue(0.3);

useEffect(() => {
  // Infinite loop animation
  opacity.value = withRepeat(
    withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0.3, { duration: 1000 })
    ),
    -1, // Infinite
    false
  );
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));
```

#### Advanced Shiver (SkeletonComponent)

```typescript
const shimmerTranslate = useSharedValue(-1);

useEffect(() => {
  shimmerTranslate.value = withRepeat(
    withTiming(1, {
      duration: 1500,
      easing: Easing.linear,
    }),
    -1,
    false
  );
}, []);

const animatedStyle = useAnimatedStyle(() => {
  const translateX = interpolate(
    shimmerTranslate.value,
    [-1, 1],
    [-width, width]
  );

  return {
    transform: [{ translateX }],
  };
});
```

### 4. Fade In (Content Loading)

**Pattern:** Fade in when data loads

```typescript
const opacity = useSharedValue(0);

useEffect(() => {
  if (data) {
    opacity.value = withTiming(1, { duration: 300 });
  }
}, [data]);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));
```

## Best Practices

### 1. Memoize Animated Components

```typescript
// ❌ Re-creates animations on every render
const Component = ({ product }) => {
  const scale = useSharedValue(1);
  // ...
};

// ✅ Memoized to prevent re-creation
const Component = React.memo(({ product }) => {
  const scale = useSharedValue(1);
  // ...
});
```

### 2. Use Callbacks for Sequential Animations

```typescript
// ✅ Good: Clear sequence with callback
scale.value = withSpring(1.3, {}, () => {
  scale.value = withSpring(1);
});

// ✅ Better: Use withSequence
scale.value = withSequence(withSpring(1.3), withSpring(1));
```

### 3. Clean Up Animations

```typescript
useEffect(() => {
  // Start animation
  opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1);

  return () => {
    // Cancel animation on unmount
    cancelAnimation(opacity);
  };
}, []);
```

### 4. Combine with React State Carefully

```typescript
// ❌ Don't rely on shared values in useEffect deps
useEffect(() => {
  console.log(scale.value); // Won't trigger effect
}, [scale.value]);

// ✅ Use React state if you need reactivity
const [isPressed, setIsPressed] = useState(false);

useEffect(() => {
  scale.value = withSpring(isPressed ? 0.98 : 1);
}, [isPressed]);
```

### 5. Optimize Styles

```typescript
// ❌ Unnecessary style recalculations
const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    {
      scale: scale.value,
      rotate: `${rotation.value}deg`, // String interpolation
    },
  ],
  backgroundColor: `rgba(0, 0, 0, ${opacity.value})`, // Color calc
}));

// ✅ Pre-calculate when possible
const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: scale.value },
    { rotate: rotation.value }, // No string interpolation
  ],
  opacity: opacity.value,
}));
```

## Advanced Patterns

### 1. Gestures (Future Enhancement)

```typescript
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const translateX = useSharedValue(0);

const pan = Gesture.Pan()
  .onChange((event) => {
    translateX.value = event.translationX;
  })
  .onEnd(() => {
    translateX.value = withSpring(0);

    // Run JS function from native thread
    if (Math.abs(translateX.value) > 100) {
      runOnJS(onSwipe)();
    }
  });

return (
  <GestureDetector gesture={pan}>
    <Animated.View style={animatedStyle}>{/* content */}</Animated.View>
  </GestureDetector>
);
```

### 2. Layout Animations

```typescript
import { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

const Component = () => (
  <Animated.View
    entering={FadeIn.duration(300)}
    exiting={FadeOut.duration(300)}
    layout={Layout.springify()}
  >
    {/* Content that animates in/out and on layout changes */}
  </Animated.View>
);
```

### 3. Shared Element Transitions (Future)

```typescript
import { SharedElement } from 'react-navigation-shared-element';

// On list screen
<SharedElement id={`product.${product.id}.image`}>
  <Image source={{ uri: product.image }} />
</SharedElement>

// On detail screen
<SharedElement id={`product.${product.id}.image`}>
  <Image source={{ uri: product.image }} />
</SharedElement>
```

## Performance Tips

### 1. Run on Native Thread

```typescript
// ✅ Runs on native thread (smooth)
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

// ❌ Runs on JS thread (can jank)
const animatedStyle = {
  transform: [{ scale: scale.value }],
};
```

### 2. Avoid Heavy Calculations

```typescript
// ❌ Heavy calculation in animation
const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    {
      scale: complexCalculation(scale.value), // Runs every frame!
    },
  ],
}));

// ✅ Pre-calculate or use interpolation
const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    {
      scale: interpolate(scale.value, [0, 1], [0, 1.5]),
    },
  ],
}));
```

### 3. Limit Animated Components

```typescript
// ❌ Animating large tree
<Animated.View style={animatedStyle}>
  <LargeComponentTree />
</Animated.View>

// ✅ Animate only what needs to move
<View>
  <LargeComponentTree />
  <Animated.View style={animatedStyle}>
    <SmallComponent />
  </Animated.View>
</View>
```

## Debugging

### 1. Enable Debug Mode

```typescript
// Enable reanimated debug mode
import { enableLayoutAnimations } from 'react-native-reanimated';

if (__DEV__) {
  enableLayoutAnimations(true);
}
```

### 2. Log from Native Thread

```typescript
import { runOnJS } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => {
  // Can't use console.log directly
  runOnJS(console.log)(scale.value); // ✅ Works

  return {
    transform: [{ scale: scale.value }],
  };
});
```

### 3. Visualize Animations

```typescript
// Add borders to see animation boundaries
<Animated.View
  style={[animatedStyle, __DEV__ && { borderWidth: 1, borderColor: 'red' }]}
/>
```

## Common Gotchas

### 1. Shared Values Don't Trigger Re-renders

```typescript
// ❌ Won't update text
const count = useSharedValue(0);
return <Text>{count.value}</Text>;

// ✅ Use React state for UI updates
const [count, setCount] = useState(0);
return <Text>{count}</Text>;
```

### 2. Can't Access Props Directly

```typescript
// ❌ Won't work
const animatedStyle = useAnimatedStyle(() => ({
  opacity: props.isVisible ? 1 : 0, // props not accessible
}));

// ✅ Use shared value or derived value
const opacity = useSharedValue(props.isVisible ? 1 : 0);

useEffect(() => {
  opacity.value = withTiming(props.isVisible ? 1 : 0);
}, [props.isVisible]);
```

### 3. Cleanup Repeating Animations

```typescript
// ❌ Animation continues after unmount
useEffect(() => {
  opacity.value = withRepeat(withTiming(1), -1);
}, []);

// ✅ Cancel on cleanup
useEffect(() => {
  opacity.value = withRepeat(withTiming(1), -1);

  return () => {
    cancelAnimation(opacity);
  };
}, []);
```

## Testing

### Testing Animated Components

```typescript
import { render, fireEvent } from '@testing-library/react-native';

test('animates on press', () => {
  const { getByTestId } = render(<AnimatedButton />);

  const button = getByTestId('button');

  // Note: Animation values aren't testable directly
  // Test behavior, not animation details
  fireEvent.press(button);

  // Test result of animation (e.g., onPress callback)
  expect(mockCallback).toHaveBeenCalled();
});
```

## Resources

- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Reanimated Examples](https://github.com/software-mansion/react-native-reanimated/tree/main/example)
- [Animation Principles](https://www.youtube.com/watch?v=NU_wNR_UeNE)

## Conclusion

Reanimated 2 provides:

- ✅ **60fps animations** on native thread
- ✅ **Rich API** for complex interactions
- ✅ **Type safety** with TypeScript
- ✅ **Gesture support** for interactive UIs
- ✅ **Layout animations** built-in

Use it for production apps where performance matters.
