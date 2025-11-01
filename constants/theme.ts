/**
 * Theme constants and design tokens
 * Based on the food delivery app design with green primary color
 * Supports both light and dark themes
 */

export const Colors = {
  // Light theme colors (default)
  light: {
    // Backgrounds
    background: '#F8F9FA', // Main app background
    surface: '#FFFFFF', // Cards, containers
    surfaceVariant: '#F5F5F5', // Secondary surfaces

    // Primary brand color (Green)
    primary: '#2D9F5E', // Main green from design
    primaryLight: '#4CAF76', // Lighter shade
    primaryDark: '#1E7A45', // Darker shade
    primaryAlpha: 'rgba(45, 159, 94, 0.1)', // Transparent overlay

    // Accent colors
    secondary: '#FF6B6B', // Red for favorites, errors
    accent: '#FFC107', // Yellow for ratings, highlights
    info: '#0A84FF', // Blue for info

    // Text colors
    text: '#1A1A1A', // Primary text
    textSecondary: '#666666', // Secondary text
    textTertiary: '#999999', // Tertiary/placeholder text
    textInverse: '#FFFFFF', // Text on dark backgrounds

    // UI elements
    border: '#E1E9EE', // Borders, dividers
    borderLight: '#F0F0F0', // Lighter borders
    divider: '#EEEEEE',

    // Status colors
    error: '#FF6B6B',
    success: '#2D9F5E',
    warning: '#FFD60A',
    disabled: '#CCCCCC',

    // Skeleton loading
    skeleton: '#E0E0E0',
    skeletonHighlight: '#F0F0F0',

    // Shadows
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.15)',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdropLight: 'rgba(0, 0, 0, 0.3)',
  },

  // Dark theme colors
  dark: {
    // Backgrounds
    background: '#000000',
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',

    // Primary brand color (Green - adjusted for dark mode)
    primary: '#4CAF76', // Lighter green for better contrast
    primaryLight: '#6BC48E',
    primaryDark: '#2D9F5E',
    primaryAlpha: 'rgba(76, 175, 118, 0.15)',

    // Accent colors
    secondary: '#FF8A8A',
    accent: '#FFD93D',
    info: '#5AC8FA',

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#636366',
    textInverse: '#1A1A1A',

    // UI elements
    border: '#38383A',
    borderLight: '#2C2C2E',
    divider: '#38383A',

    // Status colors
    error: '#FF8A8A',
    success: '#4CAF76',
    warning: '#FFD93D',
    disabled: '#48484A',

    // Skeleton loading
    skeleton: '#2C2C2E',
    skeletonHighlight: '#3A3A3C',

    // Shadows
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    backdropLight: 'rgba(0, 0, 0, 0.5)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  sizes: {
    xxs: 10,
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const Animation = {
  durations: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  spring: {
    default: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
    gentle: {
      damping: 20,
      stiffness: 100,
      mass: 1,
    },
    bouncy: {
      damping: 10,
      stiffness: 200,
      mass: 1,
    },
  },
};

// Helper function to get theme colors
export const getThemeColors = (isDark: boolean = false) => {
  return isDark ? Colors.dark : Colors.light;
};

// Export default theme (light mode)
export const defaultTheme = {
  colors: Colors.light,
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
  shadows: Shadows,
  animation: Animation,
};

export type Theme = typeof defaultTheme;
export type ThemeColors = typeof Colors.light;
