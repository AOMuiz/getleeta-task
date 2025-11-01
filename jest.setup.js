// Setup for React Native Testing Library
// Note: extend-expect is built-in to @testing-library/react-native v12.4+

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, Image, ScrollView, Pressable } = require('react-native');

  return {
    default: {
      createAnimatedComponent: (Component) => Component,
      View,
      Text,
      Image,
      ScrollView,
      Pressable,
    },
    View,
    Text,
    Image,
    ScrollView,
    Pressable,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((value) => value),
    withTiming: jest.fn((value) => value),
    withRepeat: jest.fn((value) => value),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
    },
    createAnimatedComponent: (Component) => Component,
  };
});

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
    platform: {
      ios: {},
      android: {},
    },
  },
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock('expo-router', () => ({
  Stack: () => null,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  DarkTheme: {},
  DefaultTheme: {},
  ThemeProvider: ({ children }) => children,
}));

// Mock useColorScheme
jest.mock('./components/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

// Mock FontAwesome icons
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: 'FontAwesome',
}));
