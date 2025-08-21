import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid error logs in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Etwas ist schiefgelaufen')).toBeInTheDocument();
    expect(screen.getByText('Ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Seite neu laden' })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Etwas ist schiefgelaufen')).not.toBeInTheDocument();
  });

  it('logs error in production mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('shows developer info in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Entwicklerinfo')).toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('reloads page when reload button is clicked', () => {
    // Save original reload
    const originalReload = window.location.reload;
    
    // Create a new mock function
    const reloadMock = jest.fn();
    
    // Replace reload with our mock
    delete (window.location as any).reload;
    window.location.reload = reloadMock;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: 'Seite neu laden' });
    reloadButton.click();

    expect(window.location.reload).toHaveBeenCalled();

    // Restore original reload
    window.location.reload = originalReload;
  });
});