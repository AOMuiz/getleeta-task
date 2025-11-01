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
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  containerStyle,
  contentStyle,
  withPadding = true,
  paddingHorizontal = 20,
  paddingVertical = 0,
  edges = ['left', 'right', 'top'],
  scrollable = false,
  keyboardShouldAvoidView = false,
  scrollViewProps,
}) => {
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
      style={[styles.screen, containerStyle]}
      edges={edges}
      // Add these two props to ensure full space utilization
      // pointerEvents="box-none"
      // mode="margin"
    >
      <KeyboardWrapper
        style={styles.keyboardWrapper}
        behavior={isIOS() ? 'padding' : undefined}
      >
        <ContentWrapper
          style={[styles.content, padding, contentStyle]}
          // bounces={false}
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
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  keyboardWrapper: {
    flex: 1,
  },
});

export default ScreenContainer;
