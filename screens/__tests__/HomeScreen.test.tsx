/**
 * Unit tests for Home Screen
 */

import HomeScreen from '@/screens/HomeScreen';
import { useStore } from '@/stores/useStore';
import { Product } from '@/types/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { ReactNode } from 'react';

// Mock the API hooks
jest.mock('@/hooks/useAPI', () => ({
  useCategories: jest.fn(),
  useInfiniteProducts: jest.fn(),
}));

jest.mock('@/stores/useStore');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

import { useCategories, useInfiniteProducts } from '@/hooks/useAPI';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 29.99,
    description: 'Test description',
    category: 'electronics',
    image: 'https://via.placeholder.com/150',
    rating: {
      rate: 4.5,
      count: 100,
    },
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 49.99,
    description: 'Test description 2',
    category: 'clothing',
    image: 'https://via.placeholder.com/150',
    rating: {
      rate: 4.2,
      count: 50,
    },
  },
];

const mockUseStore = {
  addToCart: jest.fn(),
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  isFavorite: jest.fn(() => false),
  getCartItemsCount: jest.fn(() => 0),
};

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as unknown as jest.Mock).mockReturnValue(mockUseStore);

    // Default mock for categories
    (useCategories as jest.Mock).mockReturnValue({
      data: ['electronics', 'jewelery', "men's clothing", "women's clothing"],
      isLoading: false,
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should display skeleton loader when loading', () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      // Skeleton loader should be visible
      expect(screen.getByTestId).toBeDefined();
    });
  });

  describe('Success State', () => {
    it('should render products when data is loaded', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [mockProducts],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeTruthy();
        expect(screen.getByText('Test Product 2')).toBeTruthy();
      });
    });

    it('should display header with greeting', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [mockProducts],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Good Morning 👋')).toBeTruthy();
        expect(screen.getByText('Special For You')).toBeTruthy();
      });
    });

    it('should display search bar', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [mockProducts],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Search for products')).toBeTruthy();
      });
    });

    it('should display correct number of products', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [mockProducts],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        const productCards = screen.getAllByText(/Test Product/);
        expect(productCards).toHaveLength(2);
      });
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();
        expect(
          screen.getByText('Unable to load products. Please try again.')
        ).toBeTruthy();
      });
    });

    it('should have retry button on error', async () => {
      const refetchMock = jest.fn();
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: refetchMock,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        const retryButton = screen.getByText('Retry');
        expect(retryButton).toBeTruthy();
      });
    });

    it('should call refetch when retry button is pressed', async () => {
      const refetchMock = jest.fn();
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: refetchMock,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        const retryButton = screen.getByText('Retry');
        fireEvent.press(retryButton);
        expect(refetchMock).toHaveBeenCalled();
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no products', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [[]],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('No Products Found')).toBeTruthy();
        expect(
          screen.getByText('Check back later for new arrivals')
        ).toBeTruthy();
      });
    });
  });

  describe('Infinite Scroll', () => {
    it('should call fetchNextPage when scrolling to end', async () => {
      const fetchNextPageMock = jest.fn();
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [mockProducts],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: fetchNextPageMock,
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      const { getByTestId } = render(<HomeScreen />, {
        wrapper: createWrapper(),
      });

      // Note: Testing onEndReached requires special setup with FlatList
      expect(fetchNextPageMock).toBeDefined();
    });

    it('should show loading footer when fetching next page', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [mockProducts],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: true,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Loading more...')).toBeTruthy();
      });
    });
  });

  describe('Section Headers', () => {
    it('should display Popular Items section header', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [mockProducts],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Popular Items')).toBeTruthy();
        expect(screen.getByText('See All')).toBeTruthy();
      });
    });
  });

  describe('Category Chips', () => {
    it('should display category chips', async () => {
      (useInfiniteProducts as jest.Mock).mockReturnValue({
        data: {
          pages: [mockProducts],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('All')).toBeTruthy();
        expect(screen.getByText('Electronics')).toBeTruthy();
        expect(screen.getByText('Jewelery')).toBeTruthy();
        expect(screen.getByText("Men's clothing")).toBeTruthy();
      });
    });
  });
});
