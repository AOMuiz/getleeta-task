import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { ms, wp } from '@/utils/responsive-dimensions';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const theme = Colors.light;

interface EmptyStateProps {
  icon?: keyof typeof FontAwesome.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={ms(64)} color={theme.disabled} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Oops! Something went wrong',
  message = 'Unable to load data. Please try again.',
  onRetry,
  retryLabel = 'Retry',
}) => {
  return (
    <View style={styles.container}>
      <FontAwesome
        name="exclamation-circle"
        size={ms(64)}
        color={theme.error}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'large',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(Spacing.xxxl),
    backgroundColor: theme.background,
  },
  title: {
    fontSize: ms(Typography.sizes.xl),
    fontWeight: Typography.weights.bold,
    color: theme.text,
    marginTop: ms(Spacing.lg),
    marginBottom: ms(Spacing.sm),
    textAlign: 'center',
  },
  message: {
    fontSize: ms(Typography.sizes.base),
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: ms(Spacing.xxl),
    lineHeight: ms(24),
  },
  actionButton: {
    paddingHorizontal: wp(Spacing.xxxl),
    paddingVertical: ms(14),
    backgroundColor: theme.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  actionButtonText: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.textInverse,
  },
  retryButton: {
    paddingHorizontal: wp(Spacing.xxxl),
    paddingVertical: ms(14),
    backgroundColor: theme.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  retryButtonText: {
    fontSize: ms(Typography.sizes.base),
    fontWeight: Typography.weights.semibold,
    color: theme.textInverse,
  },
  loadingText: {
    fontSize: ms(Typography.sizes.base),
    color: theme.textSecondary,
    marginTop: ms(Spacing.lg),
    fontWeight: Typography.weights.medium,
  },
});
