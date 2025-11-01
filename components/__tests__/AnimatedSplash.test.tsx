import { render, waitFor } from '@testing-library/react-native';
import AnimatedSplash from '../AnimatedSplash';

// Mock Animated from react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock useColorScheme
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('AnimatedSplash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    const onFinish = jest.fn();
    const { getByText } = render(<AnimatedSplash onFinish={onFinish} />);

    expect(getByText('Getleeta')).toBeTruthy();
    expect(getByText('Shop smart, live better')).toBeTruthy();
  });

  it('calls onFinish after animation completes', async () => {
    const onFinish = jest.fn();
    render(<AnimatedSplash onFinish={onFinish} />);

    // Fast forward time to after the animation should complete
    jest.advanceTimersByTime(3500);

    // Wait for the callback to be called
    await waitFor(
      () => {
        expect(onFinish).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 }
    );
  });

  it('renders with dark theme', () => {
    const useColorScheme =
      require('@/components/useColorScheme').useColorScheme;
    useColorScheme.mockReturnValue('dark');

    const onFinish = jest.fn();
    const { getByText } = render(<AnimatedSplash onFinish={onFinish} />);

    expect(getByText('Getleeta')).toBeTruthy();
  });

  it('displays app name and tagline', () => {
    const onFinish = jest.fn();
    const { getByText } = render(<AnimatedSplash onFinish={onFinish} />);

    expect(getByText('Getleeta')).toBeTruthy();
    expect(getByText('Shop smart, live better')).toBeTruthy();
  });
});
