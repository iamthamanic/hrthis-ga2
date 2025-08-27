/**
 * Error tracking configuration
 * Can be extended with Sentry or other error tracking services
 */

interface ErrorContext {
  user?: {
    id: string;
    email: string;
  };
  extra?: Record<string, any>;
  tags?: Record<string, string>;
  level?: 'error' | 'warning' | 'info';
}

class ErrorTracker {
  private initialized = false;
  private queue: Array<{ error: Error; context?: ErrorContext }> = [];

  /**
   * Initialize error tracking service
   * In production, this would initialize Sentry or similar service
   */
  init(dsn?: string): void {
    if (this.initialized) return;

    if (process.env.NODE_ENV === 'production' && dsn) {
      // Initialize Sentry
      // import * as Sentry from '@sentry/react';
      // Sentry.init({
      //   dsn,
      //   environment: process.env.NODE_ENV,
      //   tracesSampleRate: 0.1,
      //   integrations: [
      //     new Sentry.BrowserTracing(),
      //     new Sentry.Replay()
      //   ],
      // });
      
      this.initialized = true;
      
      // Process queued errors
      this.queue.forEach(({ error, context }) => {
        this.captureException(error, context);
      });
      this.queue = [];
    }

    // Set up global error handlers
    this.setupGlobalHandlers();
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: ErrorContext): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', error, context);
      return;
    }

    // Queue if not initialized
    if (!this.initialized) {
      this.queue.push({ error, context });
      return;
    }

    // Send to Sentry in production
    // Sentry.captureException(error, {
    //   contexts: { custom: context?.extra },
    //   tags: context?.tags,
    //   level: context?.level || 'error',
    //   user: context?.user
    // });
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'info'): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}]`, message);
      return;
    }

    // Sentry.captureMessage(message, level);
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email: string; username?: string } | null): void {
    if (!this.initialized) return;

    // Sentry.setUser(user);
  }

  /**
   * Add breadcrumb for better error context
   */
  addBreadcrumb(_breadcrumb: {
    message: string;
    category?: string;
    level?: 'debug' | 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }): void {
    if (!this.initialized) return;

    // Sentry.addBreadcrumb(breadcrumb);
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          level: 'error',
          extra: {
            reason: event.reason,
            promise: event.promise
          }
        }
      );
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.captureException(
        event.error || new Error(event.message),
        {
          level: 'error',
          extra: {
            message: event.message,
            source: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        }
      );
    });
  }

  /**
   * Wrap async function with error tracking
   */
  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: Partial<ErrorContext>
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.captureException(
          error instanceof Error ? error : new Error(String(error)),
          context
        );
        throw error;
      }
    }) as T;
  }

  /**
   * React Error Boundary integration
   */
  errorBoundaryHandler(error: Error, errorInfo: { componentStack: string }): void {
    this.captureException(error, {
      level: 'error',
      extra: {
        componentStack: errorInfo.componentStack
      },
      tags: {
        source: 'error-boundary'
      }
    });
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

// Export types
export type { ErrorContext };

// Convenience functions
export const trackError = (error: Error, context?: ErrorContext): void => {
  errorTracker.captureException(error, context);
};

export const trackMessage = (
  message: string,
  level: 'error' | 'warning' | 'info' = 'info'
): void => {
  errorTracker.captureMessage(message, level);
};

export const setUserContext = (_user: { id: string; email: string } | null): void => {
  errorTracker.setUser(_user);
};

// Initialize on import (can be configured later)
if (typeof window !== 'undefined') {
  errorTracker.init(process.env.REACT_APP_SENTRY_DSN);
}