import { fireEvent, render } from '@testing-library/react-native';
import { EmptyState, ErrorState, LoadingState } from '../StateViews';

describe('StateViews', () => {
  describe('EmptyState', () => {
    it('renders with required props', () => {
      const { getByText } = render(
        <EmptyState title="No Items" message="No items found" />
      );

      expect(getByText('No Items')).toBeTruthy();
      expect(getByText('No items found')).toBeTruthy();
    });

    it('renders with action button', () => {
      const onAction = jest.fn();
      const { getByText } = render(
        <EmptyState
          title="No Items"
          message="No items found"
          actionLabel="Add Item"
          onAction={onAction}
        />
      );

      const button = getByText('Add Item');
      fireEvent.press(button);
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('renders with custom icon', () => {
      const { getByText } = render(
        <EmptyState
          icon="heart"
          title="No Favorites"
          message="You haven't favorited any items"
        />
      );

      // Icon is rendered (checking for the text content)
      expect(getByText('No Favorites')).toBeTruthy();
    });
  });

  describe('ErrorState', () => {
    it('renders with default props', () => {
      const { getByText } = render(<ErrorState />);

      expect(getByText('Oops! Something went wrong')).toBeTruthy();
      expect(getByText('Unable to load data. Please try again.')).toBeTruthy();
    });

    it('renders with custom props', () => {
      const { getByText } = render(
        <ErrorState title="Custom Error" message="Custom error message" />
      );

      expect(getByText('Custom Error')).toBeTruthy();
      expect(getByText('Custom error message')).toBeTruthy();
    });

    it('calls onRetry when retry button is pressed', () => {
      const onRetry = jest.fn();
      const { getByText } = render(<ErrorState onRetry={onRetry} />);

      const retryButton = getByText('Retry');
      fireEvent.press(retryButton);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('renders custom retry label', () => {
      const onRetry = jest.fn();
      const { getByText } = render(
        <ErrorState onRetry={onRetry} retryLabel="Try Again" />
      );

      expect(getByText('Try Again')).toBeTruthy();
    });
  });

  describe('LoadingState', () => {
    it('renders with default message', () => {
      const { getByText } = render(<LoadingState />);

      expect(getByText('Loading...')).toBeTruthy();
    });

    it('renders with custom message', () => {
      const { getByText } = render(<LoadingState message="Please wait" />);

      expect(getByText('Please wait')).toBeTruthy();
    });
  });
});
