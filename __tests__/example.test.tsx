/**
 * Example component test
 * This demonstrates how to test React Native components
 */

import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

// Example simple component to test
const ExampleComponent = ({ title }: { title: string }) => {
  return (
    <View testID="example-container">
      <Text testID="example-title">{title}</Text>
    </View>
  );
};

describe('ExampleComponent', () => {
  it('renders correctly with given title', () => {
    const title = 'Hello World';
    render(<ExampleComponent title={title} />);

    expect(screen.getByTestId('example-container')).toBeTruthy();
    expect(screen.getByText(title)).toBeTruthy();
  });

  it('displays the correct text content', () => {
    render(<ExampleComponent title="Test Title" />);

    const titleElement = screen.getByTestId('example-title');
    expect(titleElement.props.children).toBe('Test Title');
  });
});

/**
 * When you create your own components, write similar tests:
 *
 * 1. Test rendering with different props
 * 2. Test user interactions (press events, etc.)
 * 3. Test loading/error states
 * 4. Test conditional rendering
 *
 * Example for a component with loading state:
 *
 * describe('PostList', () => {
 *   it('shows loading indicator when data is loading', () => {
 *     render(<PostList isLoading={true} data={[]} />);
 *     expect(screen.getByTestId('loading-indicator')).toBeTruthy();
 *   });
 *
 *   it('shows posts when data is loaded', () => {
 *     const posts = [{ id: 1, title: 'Test' }];
 *     render(<PostList isLoading={false} data={posts} />);
 *     expect(screen.getByText('Test')).toBeTruthy();
 *   });
 * });
 */
