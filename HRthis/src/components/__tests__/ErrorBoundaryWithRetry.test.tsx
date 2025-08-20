import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import { ErrorBoundaryWithRetry } from '../ErrorBoundaryWithRetry';

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component that throws an error in useEffect
const ThrowErrorInEffect: React.FC = () => {
  React.useEffect(() => {
    throw new Error('Effect error');
  }, []);
  return <div>Component</div>;
};

describe('ErrorBoundaryWithRetry', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundaryWithRetry>
        <div>Test content</div>
      </ErrorBoundaryWithRetry>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should display error UI when child component throws', () => {
    render(
      <ErrorBoundaryWithRetry>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    expect(screen.getByText('Anwendungsfehler')).toBeInTheDocument();
    expect(screen.getByText('Ein unerwarteter Fehler ist aufgetreten.')).toBeInTheDocument();
  });

  it('should display retry button and allow retry', () => {
    const { rerender } = render(
      <ErrorBoundaryWithRetry>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    // Error UI should be displayed
    expect(screen.getByText('Anwendungsfehler')).toBeInTheDocument();
    
    // Click retry button
    const retryButton = screen.getByText('Erneut versuchen');
    fireEvent.click(retryButton);

    // Rerender with non-throwing component
    rerender(
      <ErrorBoundaryWithRetry>
        <ThrowError shouldThrow={false} />
      </ErrorBoundaryWithRetry>
    );

    // Should show content after retry
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should limit retry attempts', () => {
    const maxRetries = 2;
    
    const { rerender } = render(
      <ErrorBoundaryWithRetry maxRetries={maxRetries}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    // Retry maxRetries times
    for (let i = 0; i < maxRetries; i++) {
      const retryButton = screen.getByText('Erneut versuchen');
      expect(screen.getByText(`Versuch ${i + 1} von ${maxRetries}`)).toBeInTheDocument();
      fireEvent.click(retryButton);
      
      rerender(
        <ErrorBoundaryWithRetry maxRetries={maxRetries}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundaryWithRetry>
      );
    }

    // After max retries, retry button should not be present
    expect(screen.queryByText('Erneut versuchen')).not.toBeInTheDocument();
    expect(screen.getByText('Seite neu laden')).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundaryWithRetry onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error'
      }),
      expect.objectContaining({
        componentStack: expect.any(String)
      }),
      0 // retry count
    );
  });

  it('should use custom fallback when provided', () => {
    const customFallback = (error: Error, retry: () => void) => (
      <div>
        <p>Custom error: {error.message}</p>
        <button onClick={retry}>Custom retry</button>
      </div>
    );

    render(
      <ErrorBoundaryWithRetry fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
    expect(screen.getByText('Custom retry')).toBeInTheDocument();
  });

  it('should display reload button', () => {
    // Mock window.location.reload
    const reloadMock = jest.fn();
    Object.defineProperty(window.location, 'reload', {
      configurable: true,
      value: reloadMock
    });

    render(
      <ErrorBoundaryWithRetry>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    const reloadButton = screen.getByText('Seite neu laden');
    fireEvent.click(reloadButton);

    expect(reloadMock).toHaveBeenCalled();
  });

  it('should display home button', () => {
    // Mock window.location.href
    const originalHref = window.location.href;
    delete (window as any).location;
    (window as any).location = { href: originalHref };

    render(
      <ErrorBoundaryWithRetry>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    const homeButton = screen.getByText('Zur Startseite');
    fireEvent.click(homeButton);

    expect(window.location.href).toBe('/');
  });

  it('should show developer details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundaryWithRetry>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    // Developer details should be present
    const detailsElement = screen.getByText('Entwickler-Details anzeigen');
    expect(detailsElement).toBeInTheDocument();

    // Click to expand details
    fireEvent.click(detailsElement);

    // Error details should be visible
    expect(screen.getByText(/Test error/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should not show developer details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundaryWithRetry>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    // Developer details should not be present
    expect(screen.queryByText('Entwickler-Details anzeigen')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should reset retry count after successful render', async () => {
    jest.useFakeTimers();
    
    const { rerender } = render(
      <ErrorBoundaryWithRetry maxRetries={3}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    // First retry
    fireEvent.click(screen.getByText('Erneut versuchen'));
    
    // Render successfully
    rerender(
      <ErrorBoundaryWithRetry maxRetries={3}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundaryWithRetry>
    );

    // Wait for reset timeout
    jest.advanceTimersByTime(5000);

    // Throw error again
    rerender(
      <ErrorBoundaryWithRetry maxRetries={3}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundaryWithRetry>
    );

    // Retry count should be reset
    await waitFor(() => {
      expect(screen.queryByText('Versuch 1 von 3')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should clean up timeout on unmount', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = render(
      <ErrorBoundaryWithRetry>
        <ThrowError shouldThrow={false} />
      </ErrorBoundaryWithRetry>
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });
});