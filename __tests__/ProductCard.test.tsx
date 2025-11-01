/**
 * Unit tests for ProductCard Component
 */

import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/stores/useStore';
import { Product } from '@/types/api';
import { fireEvent, render } from '@testing-library/react-native';

// Mock the store
jest.mock('@/stores/useStore');

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'Test description',
  category: 'electronics',
  image: 'https://via.placeholder.com/150',
  rating: {
    rate: 4.5,
    count: 100,
  },
};

const mockUseStore = {
  addToCart: jest.fn(),
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  isFavorite: jest.fn(() => false),
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as unknown as jest.Mock).mockReturnValue(mockUseStore);
  });

  describe('Rendering', () => {
    it('should render product information correctly', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      expect(getByText('Test Product')).toBeTruthy();
      expect(getByText('$29.99')).toBeTruthy(); // Price with 2 decimals
      expect(getByText('4.5')).toBeTruthy(); // Rating
    });

    it('should render product image', () => {
      const onPressMock = jest.fn();
      const { getByTestId, UNSAFE_getByType } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      const image = UNSAFE_getByType(require('react-native').Image);
      expect(image.props.source.uri).toBe('https://via.placeholder.com/150');
    });
  });

  describe('Interactions', () => {
    it('should call onPress when card is pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      fireEvent.press(getByText('Test Product'));
      expect(onPressMock).toHaveBeenCalled();
    });

    it('should add product to cart when add button is pressed', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      const addButton = getByTestId('add-to-cart-button');
      fireEvent.press(addButton);
      expect(mockUseStore.addToCart).toHaveBeenCalledWith(mockProduct, 1);
    });

    it('should add to favorites when not favorited', () => {
      mockUseStore.isFavorite.mockReturnValue(false);
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      const favoriteButton = getByTestId('favorite-button');
      fireEvent.press(favoriteButton);
      expect(mockUseStore.addToFavorites).toHaveBeenCalledWith(mockProduct);
    });

    it('should remove from favorites when already favorited', () => {
      mockUseStore.isFavorite.mockReturnValue(true);
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      const favoriteButton = getByTestId('favorite-button');
      fireEvent.press(favoriteButton);
      expect(mockUseStore.removeFromFavorites).toHaveBeenCalledWith(
        mockProduct.id
      );
    });
  });

  describe('Favorite State', () => {
    it('should display filled heart icon when product is favorited', () => {
      mockUseStore.isFavorite.mockReturnValue(true);
      const onPressMock = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      // Check for FontAwesome icons
      const icons = UNSAFE_getAllByType(
        require('@expo/vector-icons').FontAwesome
      );
      // First icon should be the favorite heart
      const favoriteIcon = icons[0];
      expect(favoriteIcon.props.name).toBe('heart');
    });

    it('should display outline heart icon when product is not favorited', () => {
      mockUseStore.isFavorite.mockReturnValue(false);
      const onPressMock = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      const icons = UNSAFE_getAllByType(
        require('@expo/vector-icons').FontAwesome
      );
      const favoriteIcon = icons[0];
      expect(favoriteIcon.props.name).toBe('heart-o');
    });
  });

  describe('Price Formatting', () => {
    it('should display price with 2 decimal places', () => {
      const productWithDecimalPrice = {
        ...mockProduct,
        price: 29.49,
      };
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ProductCard product={productWithDecimalPrice} onPress={onPressMock} />
      );

      expect(getByText('$29.49')).toBeTruthy();
    });

    it('should handle high prices correctly', () => {
      const expensiveProduct = {
        ...mockProduct,
        price: 999.99,
      };
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ProductCard product={expensiveProduct} onPress={onPressMock} />
      );

      expect(getByText('$999.99')).toBeTruthy();
    });
  });

  describe('Rating Display', () => {
    it('should display product rating', () => {
      const onPressMock = jest.fn();
      const { getByText, UNSAFE_getAllByType } = render(
        <ProductCard product={mockProduct} onPress={onPressMock} />
      );

      expect(getByText('4.5')).toBeTruthy();

      // Check for star icon
      const icons = UNSAFE_getAllByType(
        require('@expo/vector-icons').FontAwesome
      );
      const starIcon = icons.find((icon) => icon.props.name === 'star');
      expect(starIcon).toBeTruthy();
    });

    it('should display different ratings correctly', () => {
      const productWithLowRating = {
        ...mockProduct,
        rating: {
          rate: 2.3,
          count: 10,
        },
      };
      const onPressMock = jest.fn();
      const { getByText } = render(
        <ProductCard product={productWithLowRating} onPress={onPressMock} />
      );

      expect(getByText('2.3')).toBeTruthy();
    });
  });
});
