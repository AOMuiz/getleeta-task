import { Colors } from '@/constants/theme';
import { isIOS } from '@/utils';
import { hp, wp } from '@/utils/responsive-dimensions';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

export const edgesHorizontal = ['left', 'right'] as Edge[];
export const edgesVertical = ['top', 'bottom'] as Edge[];

export interface ScreenContainerProps {
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  // Add control for padding
  withPadding?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  // Add control for edges
  edges?: Edge[];
  // Add control for status bar
  statusBarStyle?: 'light-content' | 'dark-content';
  hideStatusBar?: boolean;
  // Add control for background color
  backgroundColor?: string;
  // Add loading state
  isLoading?: boolean;
  // Add scroll capability flag
  scrollable?: boolean;
  // Add keyboard handling
  keyboardShouldAvoidView?: boolean;
  scrollViewProps?: ScrollViewProps;
  // Theme mode
  isDark?: boolean;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  containerStyle,
  contentStyle,
  withPadding = true,
  paddingHorizontal = 16,
  paddingVertical = 0,
  edges = ['left', 'right', 'top'],
  scrollable = false,
  keyboardShouldAvoidView = false,
  scrollViewProps,
  backgroundColor,
  isDark = false,
}) => {
  const theme = isDark ? Colors.dark : Colors.light;

  // Calculate padding based on props and insets
  const padding = {
    paddingHorizontal: withPadding ? wp(paddingHorizontal) : 0,
    paddingVertical: withPadding ? hp(paddingVertical) : 0,
  };

  // Determine the content component based on scrollable prop
  // If keyboard avoidance is enabled, force scrollable to be true
  const shouldScroll = scrollable || keyboardShouldAvoidView;
  const ContentWrapper = shouldScroll ? ScrollView : View;

  // Keyboard avoiding view for iOS
  const KeyboardWrapper =
    keyboardShouldAvoidView && Platform.OS === 'ios'
      ? KeyboardAvoidingView
      : View;

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { backgroundColor: backgroundColor || theme.background },
        containerStyle,
      ]}
      edges={edges}
    >
      <KeyboardWrapper
        style={styles.keyboardWrapper}
        behavior={isIOS() ? 'padding' : undefined}
      >
        <ContentWrapper
          style={[styles.content, padding, contentStyle]}
          showsVerticalScrollIndicator={false}
          {...(scrollable && scrollViewProps)}
        >
          {children}
        </ContentWrapper>
      </KeyboardWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  keyboardWrapper: {
    flex: 1,
  },
});

export default ScreenContainer;
