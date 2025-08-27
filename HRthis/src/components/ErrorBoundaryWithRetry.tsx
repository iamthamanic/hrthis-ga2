import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  maxRetries?: number;
  onError?: (error: Error, errorInfo: ErrorInfo, retryCount: number) => void;
}

/**
 * Enhanced Error Boundary with retry mechanism and better error reporting
 */
export class ErrorBoundaryWithRetry extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError } = this.props;
    const { retryCount } = this.state;
    
    this.setState({ error, errorInfo });
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo, retryCount);
    }
    
    // Log error with context
    const errorContext = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      retryCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service (e.g., Sentry)
      console.error('Production Error:', errorContext);
    } else {
      console.error('ErrorBoundary caught an error:', errorContext);
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  handleReset = (): void => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;
    
    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
      
      // Auto-reset after successful render
      this.resetTimeoutId = setTimeout(() => {
        this.setState({ retryCount: 0 });
      }, 5000);
    }
  };

  render(): ReactNode {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, maxRetries = 3 } = this.props;
    
    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.handleReset);
      }

      const canRetry = retryCount < maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Anwendungsfehler
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Ein unerwarteter Fehler ist aufgetreten.</p>
                    {retryCount > 0 && (
                      <p className="mt-1">
                        Versuch {retryCount} von {maxRetries}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex gap-2">
                {canRetry && (
                  <button
                    onClick={this.handleReset}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Erneut versuchen
                  </button>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Seite neu laden
                </button>
              </div>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full mt-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Zur Startseite
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="px-4 pb-4">
                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                  Entwickler-Details anzeigen
                </summary>
                <div className="mt-2 space-y-2">
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-xs font-mono text-gray-700">
                      {error.name}: {error.message}
                    </p>
                  </div>
                  {error.stack && (
                    <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto max-h-40">
                      Component Stack:{this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}