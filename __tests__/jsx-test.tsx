/**
 * Simple test to verify JSX configuration is working
 */

describe('JSX Configuration', () => {
  it('should allow JSX syntax without --jsx flag error', () => {
    // This test just verifies that JSX syntax works
    const element = <div>test</div>;
    expect(element.type).toBe('div');
    expect(element.props.children).toBe('test');
  });

  it('should support TypeScript with JSX', () => {
    interface TestProps {
      title: string;
    }

    const TestComponent = ({ title }: TestProps) => {
      return <span>{title}</span>;
    };

    const element = <TestComponent title="Hello" />;
    expect(element.props.title).toBe('Hello');
  });
});
