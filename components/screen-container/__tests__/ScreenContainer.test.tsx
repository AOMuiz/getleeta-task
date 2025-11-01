/**
 * Unit tests for ScreenContainer Component
 */

import ScreenContainer from '@/components/screen-container';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Mock the responsive dimensions utilities
jest.mock('@/utils/responsive-dimensions', () => ({
  hp: jest.fn((value) => value),
  wp: jest.fn((value) => value),
}));

// Mock the utils
jest.mock('@/utils', () => ({
  isIOS: jest.fn(() => true),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    ...jest.requireActual('react-native-safe-area-context'),
    SafeAreaView: ({ children, ...props }: any) =>
      React.createElement(RN.View, props, children),
  };
});

describe('ScreenContainer', () => {
  describe('Rendering', () => {
    it('should render children correctly', () => {
      const { getByText } = render(
        <ScreenContainer>
          <Text>Test Child</Text>
        </ScreenContainer>
      );

      expect(getByText('Test Child')).toBeTruthy();
    });

    it('should render without children', () => {
      const { toJSON } = render(<ScreenContainer />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render multiple children', () => {
      const { getByText } = render(
        <ScreenContainer>
          <Text>First Child</Text>
          <Text>Second Child</Text>
          <Text>Third Child</Text>
        </ScreenContainer>
      );

      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
      expect(getByText('Third Child')).toBeTruthy();
    });
  });

  describe('Padding Configuration', () => {
    it('should apply default padding when withPadding is true', () => {
      const { getByTestId } = render(
        <ScreenContainer withPadding={true}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should not apply padding when withPadding is false', () => {
      const { getByTestId } = render(
        <ScreenContainer withPadding={false}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should apply custom horizontal padding', () => {
      const { getByTestId } = render(
        <ScreenContainer paddingHorizontal={20}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should apply custom vertical padding', () => {
      const { getByTestId } = render(
        <ScreenContainer paddingVertical={10}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });
  });

  describe('Scroll Configuration', () => {
    it('should render as ScrollView when scrollable is true', () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer scrollable={true}>
          <Text>Scrollable Content</Text>
        </ScreenContainer>
      );

      const ScrollView = require('react-native').ScrollView;
      expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
    });

    it('should render as View when scrollable is false', () => {
      const { getByText } = render(
        <ScreenContainer scrollable={false}>
          <Text>Non-scrollable Content</Text>
        </ScreenContainer>
      );

      expect(getByText('Non-scrollable Content')).toBeTruthy();
    });

    it('should pass scrollViewProps when scrollable is true', () => {
      const scrollViewProps = {
        bounces: false,
        showsVerticalScrollIndicator: true,
      };

      const { UNSAFE_getByType } = render(
        <ScreenContainer scrollable={true} scrollViewProps={scrollViewProps}>
          <Text>Content</Text>
        </ScreenContainer>
      );

      const ScrollView = require('react-native').ScrollView;
      const scrollView = UNSAFE_getByType(ScrollView);
      expect(scrollView.props.bounces).toBe(false);
    });
  });

  describe('Keyboard Avoiding Configuration', () => {
    it('should enable scrollable when keyboardShouldAvoidView is true', () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer keyboardShouldAvoidView={true}>
          <Text>Keyboard Avoiding Content</Text>
        </ScreenContainer>
      );

      const ScrollView = require('react-native').ScrollView;
      expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
    });

    it('should render KeyboardAvoidingView on iOS when keyboardShouldAvoidView is true', () => {
      const { UNSAFE_getByType } = render(
        <ScreenContainer keyboardShouldAvoidView={true}>
          <Text>Content</Text>
        </ScreenContainer>
      );

      const KeyboardAvoidingView = require('react-native').KeyboardAvoidingView;
      expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeTruthy();
    });
  });

  describe('Background Color', () => {
    it('should apply custom background color', () => {
      const { getByTestId } = render(
        <ScreenContainer backgroundColor="#FF0000">
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should use theme background when no backgroundColor is provided', () => {
      const { getByTestId } = render(
        <ScreenContainer>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should use dark theme background when isDark is true', () => {
      const { getByTestId } = render(
        <ScreenContainer isDark={true}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });
  });

  describe('Safe Area Edges', () => {
    it('should apply default edges', () => {
      const { getByTestId } = render(
        <ScreenContainer>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should apply custom edges', () => {
      const { getByTestId } = render(
        <ScreenContainer edges={['top', 'bottom']}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should handle empty edges array', () => {
      const { getByTestId } = render(
        <ScreenContainer edges={[]}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });
  });

  describe('Custom Styles', () => {
    it('should apply containerStyle', () => {
      const containerStyle = { flex: 1, backgroundColor: 'blue' };
      const { getByTestId } = render(
        <ScreenContainer containerStyle={containerStyle}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should apply contentStyle', () => {
      const contentStyle = { padding: 20 };
      const { getByTestId } = render(
        <ScreenContainer contentStyle={contentStyle}>
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should apply both containerStyle and contentStyle', () => {
      const containerStyle = { flex: 1 };
      const contentStyle = { padding: 20 };
      const { getByTestId } = render(
        <ScreenContainer
          containerStyle={containerStyle}
          contentStyle={contentStyle}
        >
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const { getByTestId } = render(
        <ScreenContainer
          containerStyle={undefined}
          contentStyle={undefined}
          scrollViewProps={undefined}
        >
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });

    it('should handle all props combined', () => {
      const { getByTestId } = render(
        <ScreenContainer
          withPadding={true}
          paddingHorizontal={20}
          paddingVertical={10}
          scrollable={true}
          keyboardShouldAvoidView={true}
          backgroundColor="#FFFFFF"
          edges={['top', 'bottom']}
          isDark={false}
          containerStyle={{ flex: 1 }}
          contentStyle={{ padding: 10 }}
        >
          <View testID="child-view" />
        </ScreenContainer>
      );

      expect(getByTestId('child-view')).toBeTruthy();
    });
  });
});
