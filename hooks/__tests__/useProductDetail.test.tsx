import { renderHook, waitFor } from '@testing-library/react-native';
import { useProductDetail } from '../useProductDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock the services
jest.mock('@/services/api', () => ({
  fetchProduct: jest.fn(() =>
    Promise.resolve({
      id: 1,
      title: 'Test Product',
      price: 99.99,
      description: 'Test description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 100 },
    })
  ),
}));

// Mock the store
jest.mock('@/stores/useStore', () => ({
  useStore: jest.fn(() => ({
    addToCart: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    isFavorite: jest.fn(() => false),
  })),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

// Mock Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProductDetail', () => {
  it('should fetch product data', async () => {
    const { result } = renderHook(() => useProductDetail('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.product).toBeDefined();
    expect(result.current.product?.title).toBe('Test Product');
  });

  it('should initialize quantity to 1', () => {
    const { result } = renderHook(() => useProductDetail('1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.quantity).toBe(1);
  });

  it('should calculate total price correctly', async () => {
    const { result } = renderHook(() => useProductDetail('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.product).toBeDefined();
    });

    // Initial total with quantity 1
    expect(result.current.totalPrice).toBe(99.99);
  });
});
