import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { ReactNode } from 'react';
import { useProductsList } from '../useProductsList';

// Mock the services
jest.mock('@/services/api', () => ({
  fetchProductsPage: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: 'Product 1',
        price: 99.99,
        description: 'Description 1',
        category: 'electronics',
        image: 'test1.jpg',
        rating: { rate: 4.5, count: 100 },
      },
    ])
  ),
  fetchCategories: jest.fn(() =>
    Promise.resolve([
      'electronics',
      'jewelry',
      "men's clothing",
      "women's clothing",
    ])
  ),
}));

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

describe('useProductsList', () => {
  it('should fetch products and categories', async () => {
    const { result } = renderHook(() => useProductsList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.categories).toHaveLength(4);
  });

  it('should initialize with no selected category', () => {
    const { result } = renderHook(() => useProductsList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.selectedCategory).toBeNull();
  });

  it('should handle category selection', async () => {
    const { result } = renderHook(() => useProductsList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Select a category wrapped in act
    act(() => {
      result.current.handleCategoryPress('electronics');
    });

    await waitFor(() => {
      expect(result.current.selectedCategory).toBe('electronics');
    });
  });
});
