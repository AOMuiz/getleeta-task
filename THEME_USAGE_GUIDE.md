# Theme System Usage Guide

## Table of Contents

1. [Overview](#overview)
2. [Why This Theme System?](#why-this-theme-system)
3. [Architecture](#architecture)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)
6. [Migration Guide](#migration-guide)
7. [Dark Mode Support](#dark-mode-support)

---

## Overview

This project implements a comprehensive, production-ready theme system that provides:

- **Consistent design language** across the entire application
- **Responsive scaling** for different device sizes
- **Dark mode support** out of the box
- **Type-safe** theme tokens using TypeScript
- **Centralized design tokens** for easy maintenance

The theme system is located in `/constants/theme.ts` and is used throughout all components for styling.

---

## Why This Theme System?

### Professional Standards

This theme system follows industry best practices used by companies like Airbnb, Shopify, and Meta:

1. **Design Tokens**: All design decisions (colors, spacing, typography) are centralized as tokens, making it easy to maintain consistency and make global changes.
2. **Scalability**: Adding new screens or components is faster because developers don't need to make styling decisions - they just use the existing tokens.
3. **Maintainability**: Need to change the primary color? Update it in one place (`theme.ts`) instead of searching through dozens of files.
4. **Accessibility**: The theme includes proper contrast ratios and responsive scaling to ensure the app is usable for all users.
5. **Developer Experience**: TypeScript autocomplete helps developers discover available colors, sizes, and other tokens without memorizing them.

### Technical Benefits

- **Performance**: Constants are more efficient than computed styles
- **Consistency**: Prevents "magic numbers" scattered throughout the codebase
- **Testability**: Theme tokens can be easily mocked in tests
- **Collaboration**: New developers can quickly understand the design system

---

## Architecture

### Core Files

```
constants/
  └── theme.ts              # All theme tokens and colors

utils/
  └── responsive-dimensions.ts  # Responsive scaling utilities

components/
  └── screen-container/     # Themed screen wrapper component
      └── index.tsx
```

### Theme Structure

```typescript
// constants/theme.ts
export const Colors = {
  light: {
    /* light theme colors */
  },
  dark: {
    /* dark theme colors */
  },
};

export const Spacing = {
  /* spacing scale */
};
export const Typography = {
  /* font sizes & weights */
};
export const BorderRadius = {
  /* border radius scale */
};
export const Shadows = {
  /* shadow presets */
};
export const Animation = {
  /* animation configs */
};
```

---

## Usage Examples

### 1. Using Colors

```typescript
import { Colors } from '@/constants/theme';

// Get the current theme
const theme = Colors.light; // or Colors.dark for dark mode

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.background, // Main app background
    borderColor: theme.border, // Borders & dividers
  },
  text: {
    color: theme.text, // Primary text
  },
  button: {
    backgroundColor: theme.primary, // Primary brand color (#2D9F5E)
  },
});
```

**Available Color Tokens:**

- `theme.background` - Main app background (#F8F9FA)
- `theme.surface` - Cards, containers (#FFFFFF)
- `theme.surfaceVariant` - Secondary surfaces (#F5F5F5)
- `theme.primary` - Primary brand color (#2D9F5E)
- `theme.secondary` - Red for favorites, errors (#FF6B6B)
- `theme.accent` - Yellow for ratings (#FFC107)
- `theme.text` - Primary text (#1A1A1A)
- `theme.textSecondary` - Secondary text (#666666)
- `theme.textInverse` - Text on dark backgrounds (#FFFFFF)
- `theme.border` - Borders, dividers (#E1E9EE)
- And more...

### 2. Using Spacing

```typescript
import { Spacing } from '@/constants/theme';
import { ms } from '@/utils/responsive-dimensions';

const styles = StyleSheet.create({
  container: {
    padding: ms(Spacing.lg), // 16px, scaled responsively
    margin: ms(Spacing.md), // 12px, scaled responsively
    gap: ms(Spacing.sm), // 8px, scaled responsively
  },
  header: {
    marginBottom: ms(Spacing.xl), // 24px, scaled responsively
  },
});
```

**Spacing Scale:**

- `Spacing.xs` - 4
- `Spacing.sm` - 8
- `Spacing.md` - 12
- `Spacing.lg` - 16
- `Spacing.xl` - 24
- `Spacing.xxl` - 32
- `Spacing.xxxl` - 48
- `Spacing.huge` - 64

### 3. Using Typography

```typescript
import { Typography } from '@/constants/theme';
import { ms } from '@/utils/responsive-dimensions';

const styles = StyleSheet.create({
  title: {
    fontSize: ms(Typography.sizes.xxl), // 28px, scaled
    fontWeight: Typography.weights.bold, // '700'
  },
  body: {
    fontSize: ms(Typography.sizes.base), // 16px, scaled
    fontWeight: Typography.weights.regular, // '400'
  },
  caption: {
    fontSize: ms(Typography.sizes.xs), // 12px, scaled
    fontWeight: Typography.weights.medium, // '500'
  },
});
```

**Typography Sizes:**

- `xxs: 10` - Tiny labels
- `xs: 12` - Captions
- `sm: 14` - Small text
- `base: 16` - Body text
- `lg: 18` - Subheadings
- `xl: 20` - Headings
- `xxl: 28` - Large headings
- `xxxl: 36` - Hero text
- `huge: 48` - Display text

**Typography Weights:**

- `light: '300'`
- `regular: '400'`
- `medium: '500'`
- `semibold: '600'`
- `bold: '700'`
- `extrabold: '800'`

### 4. Using Border Radius

```typescript
import { BorderRadius } from '@/constants/theme';

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg, // 16
  },
  button: {
    borderRadius: BorderRadius.md, // 12
  },
  avatar: {
    borderRadius: BorderRadius.full, // 9999 (circular)
  },
});
```

**Border Radius Scale:**

- `none: 0`
- `sm: 4`
- `md: 12`
- `lg: 16`
- `xl: 24`
- `xxl: 32`
- `full: 9999` (circular)

### 5. Using Shadows

```typescript
import { Shadows } from '@/constants/theme';

const styles = StyleSheet.create({
  card: {
    ...Shadows.md, // Medium shadow for cards
  },
  button: {
    ...Shadows.sm, // Small shadow for buttons
  },
  modal: {
    ...Shadows.lg, // Large shadow for modals
  },
});
```

**Shadow Presets:**

- `Shadows.none` - No shadow
- `Shadows.sm` - Small shadow (buttons, small cards)
- `Shadows.md` - Medium shadow (cards, dropdowns)
- `Shadows.lg` - Large shadow (modals, dialogs)
- `Shadows.xl` - Extra large shadow (popovers)
- `Shadows.xxl` - Maximum shadow (floating elements)

### 6. Responsive Utilities

```typescript
import { ms, wp, hp } from '@/utils/responsive-dimensions';

const styles = StyleSheet.create({
  container: {
    padding: ms(16), // Moderate scale (use for most UI)
    width: wp(90), // 90% of screen width
    height: hp(50), // 50% of screen height
  },
});
```

**When to Use Which:**

- `ms()` - **Moderate Scale**: Use for most UI elements (padding, margins, font sizes, icons)
- `wp()` - **Width Percentage**: Use for horizontal dimensions (container widths, horizontal spacing)
- `hp()` - **Height Percentage**: Use for vertical dimensions (container heights, vertical spacing)

### 7. Using ScreenContainer Component

```typescript
import { ScreenContainer } from '@/components/screen-container';

export default function MyScreen() {
  return <ScreenContainer>{/* Your content here */}</ScreenContainer>;
}

// With custom background
<ScreenContainer backgroundColor={theme.surfaceVariant}>
  {/* Content */}
</ScreenContainer>;
```

The `ScreenContainer` component automatically:

- Handles SafeAreaView
- Uses themed background colors
- Applies responsive padding
- Supports keyboard avoiding behavior

---

## Best Practices

### ✅ DO

```typescript
// Use theme tokens
backgroundColor: theme.primary

// Use responsive scaling
padding: ms(Spacing.lg)

// Use spread operator for shadows
...Shadows.md

// Use semantic color names
color: theme.text
```

### ❌ DON'T

```typescript
// Don't use hard-coded colors
backgroundColor: '#2D9F5E'

// Don't use fixed dimensions
padding: 16

// Don't manually create shadows
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1

// Don't use hex colors directly
color: '#666'
```

### Component Structure

```typescript
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { ms, wp } from '@/utils/responsive-dimensions';

const theme = Colors.light; // Define once at component level

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    padding: ms(Spacing.lg),
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  title: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
  },
});
```

---

## Migration Guide

### Converting Existing Components

**Before:**

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
```

**After:**

```typescript
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { ms } from '@/utils/responsive-dimensions';

const theme = Colors.light;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    padding: ms(Spacing.lg),
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  },
  text: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.text,
  },
});
```

### Step-by-Step Migration

1. **Add imports:**

   ```typescript
   import {
     Colors,
     Spacing,
     Typography,
     BorderRadius,
     Shadows,
   } from '@/constants/theme';
   import { ms, wp } from '@/utils/responsive-dimensions';
   ```

2. **Define theme constant:**

   ```typescript
   const theme = Colors.light;
   ```

3. **Replace colors:**

   - `'#fff'` → `theme.surface`
   - `'#2D9F5E'` → `theme.primary`
   - `'#666'` → `theme.textSecondary`

4. **Replace dimensions:**

   - `16` → `ms(Spacing.lg)`
   - `12` → `ms(Spacing.md)`

5. **Replace shadows:**

   - Manual shadow → `...Shadows.md`

6. **Replace border radius:**

   - `12` → `BorderRadius.md`

7. **Replace typography:**

   - `fontSize: 16` → `fontSize: ms(Typography.sizes.base)`
   - `fontWeight: '600'` → `fontWeight: Typography.weights.semibold`

---

## Dark Mode Support

The theme system is fully prepared for dark mode:

```typescript
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/theme';

export default function MyComponent() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>This text adapts to dark mode!</Text>
    </View>
  );
}
```

### Dark Mode Color Mappings

The dark theme automatically adjusts:

- **Backgrounds**: Dark surface colors (#000000, #1C1C1E)
- **Text**: Light text on dark backgrounds (#FFFFFF)
- **Primary**: Lighter shade for better contrast (#4CAF76)
- **Borders**: Darker, subtle borders (#38383A)

---

## Quick Reference

### Common Patterns

**Card Component:**

```typescript
container: {
  backgroundColor: theme.surface,
  borderRadius: BorderRadius.lg,
  padding: ms(Spacing.lg),
  ...Shadows.md,
}
```

**Button Component:**

```typescript
button: {
  backgroundColor: theme.primary,
  borderRadius: BorderRadius.md,
  paddingVertical: ms(Spacing.md),
  paddingHorizontal: ms(Spacing.xl),
  ...Shadows.sm,
}
```

**Text Heading:**

```typescript
heading: {
  fontSize: ms(Typography.sizes.xxl),
  fontWeight: Typography.weights.bold,
  color: theme.text,
  marginBottom: ms(Spacing.lg),
}
```

**Input Field:**

```typescript
input: {
  backgroundColor: theme.surface,
  borderColor: theme.border,
  borderWidth: 1,
  borderRadius: BorderRadius.md,
  padding: ms(Spacing.md),
  fontSize: ms(Typography.sizes.base),
  color: theme.text,
}
```

---

## Additional Resources

- **Theme Constants**: `/constants/theme.ts` - Full list of all tokens
- **Responsive Utils**: `/utils/responsive-dimensions.ts` - Scaling utilities
- **Example Component**: `/components/ProductCard.tsx` - Fully themed component
- **Example Screen**: `/screens/HomeScreen.tsx` - Fully themed screen

---

## Support

For questions or issues with the theme system:

1. Check this documentation
2. Review example components (`ProductCard.tsx`, `HomeScreen.tsx`)
3. Inspect the theme constants in `/constants/theme.ts`

---

**Version:** 1.0.0
**Last Updated:** November 2025
**Author:** Getleeta Task Project
