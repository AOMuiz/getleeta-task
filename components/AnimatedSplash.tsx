import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;

  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const circleScale = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    // Start animations sequence
    // 1. Circle expansion
    circleScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });

    // 2. Logo animations (delayed)
    logoOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );

    logoScale.value = withDelay(
      200,
      withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      )
    );

    logoRotate.value = withDelay(
      200,
      withSequence(
        withTiming(360, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 })
      )
    );

    // 3. Text animation (more delayed)
    textOpacity.value = withDelay(
      800,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );

    textTranslateY.value = withDelay(
      800,
      withSpring(0, { damping: 12, stiffness: 100 })
    );

    // 4. Fade out everything (after 2.5 seconds)
    backgroundOpacity.value = withDelay(
      2500,
      withTiming(
        0,
        { duration: 500, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(onFinish)();
          }
        }
      )
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const logoContainerStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={
          isDark
            ? [themeColors.background, themeColors.surface]
            : [themeColors.primary, themeColors.primaryLight]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Animated circle background */}
        <Animated.View style={[styles.circle, circleStyle]}>
          <View
            style={[
              styles.circleInner,
              {
                backgroundColor: isDark
                  ? themeColors.primaryAlpha
                  : 'rgba(255, 255, 255, 0.1)',
              },
            ]}
          />
        </Animated.View>

        {/* Logo container */}
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logoWrapper, logoContainerStyle]}>
            <View
              style={[
                styles.iconBackground,
                { backgroundColor: isDark ? themeColors.surface : 'white' },
              ]}
            >
              <Ionicons
                name="restaurant"
                size={80}
                color={themeColors.primary}
              />
            </View>
          </Animated.View>

          {/* App name */}
          <Animated.Text
            style={[
              styles.appName,
              textStyle,
              { color: isDark ? themeColors.text : 'white' },
            ]}
          >
            Getleeta
          </Animated.Text>
          <Animated.Text
            style={[
              styles.tagline,
              textStyle,
              {
                color: isDark
                  ? themeColors.textSecondary
                  : 'rgba(255, 255, 255, 0.9)',
              },
            ]}
          >
            Delicious food, delivered fast
          </Animated.Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: (width * 1.5) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 1.5) / 2,
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoWrapper: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
