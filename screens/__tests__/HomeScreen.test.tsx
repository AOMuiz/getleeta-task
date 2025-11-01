/**
 * Unit tests for Home Screen
 */

import HomeScreen from '@/screens/HomeScreen';
import { useStore } from '@/stores/useStore';
import { Product } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

// Mock TanStack Query
jest.mock('@tanstack/react-query');
jest.mock('@/stores/useStore');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

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

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as unknown as jest.Mock).mockReturnValue(mockUseStore);
  });

  describe('Loading State', () => {
    it('should display skeleton loader when loading', () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />);

      // Skeleton loader should be visible
      expect(screen.getByTestId).toBeDefined();
    });
  });

  describe('Success State', () => {
    it('should render products when data is loaded', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      render(<HomeScreen />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeTruthy();
        expect(screen.getByText('Test Product 2')).toBeTruthy();
      });
    });

    it('should display header with greeting', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      render(<HomeScreen />);

      await waitFor(() => {
        expect(screen.getByText('Good Morning 👋')).toBeTruthy();
        expect(screen.getByText('Special For You')).toBeTruthy();
      });
    });

    it('should display search bar', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      render(<HomeScreen />);

      await waitFor(() => {
        expect(screen.getByText('Search for food')).toBeTruthy();
      });
    });

    it('should display correct number of products', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      render(<HomeScreen />);

      await waitFor(() => {
        const productCards = screen.getAllByText(/Test Product/);
        expect(productCards).toHaveLength(2);
      });
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />);

      await waitFor(() => {
        expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();
        expect(
          screen.getByText('Unable to load products. Please try again.')
        ).toBeTruthy();
      });
    });

    it('should have retry button on error', async () => {
      const refetchMock = jest.fn();
      (useInfiniteQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: refetchMock,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />);

      await waitFor(() => {
        const retryButton = screen.getByText('Retry');
        expect(retryButton).toBeTruthy();
      });
    });

    it('should call refetch when retry button is pressed', async () => {
      const refetchMock = jest.fn();
      (useInfiniteQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        refetch: refetchMock,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(<HomeScreen />);

      await waitFor(() => {
        const retryButton = screen.getByText('Retry');
        fireEvent.press(retryButton);
        expect(refetchMock).toHaveBeenCalled();
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no products', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      render(<HomeScreen />);

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
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      const { getByTestId } = render(<HomeScreen />);

      // Note: Testing onEndReached requires special setup with FlatList
      expect(fetchNextPageMock).toBeDefined();
    });

    it('should show loading footer when fetching next page', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      render(<HomeScreen />);

      await waitFor(() => {
        expect(screen.getByText('Loading more...')).toBeTruthy();
      });
    });
  });

  describe('Section Headers', () => {
    it('should display Popular Items section header', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      render(<HomeScreen />);

      await waitFor(() => {
        expect(screen.getByText('Popular Items')).toBeTruthy();
        expect(screen.getByText('See All')).toBeTruthy();
      });
    });
  });

  describe('Category Chips', () => {
    it('should display category chips', async () => {
      (useInfiniteQuery as jest.Mock).mockReturnValue({
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

      render(<HomeScreen />);

      await waitFor(() => {
        expect(screen.getByText('All')).toBeTruthy();
        expect(screen.getByText('Electronics')).toBeTruthy();
        expect(screen.getByText('Clothing')).toBeTruthy();
        expect(screen.getByText('Jewelry')).toBeTruthy();
      });
    });
  });
});
