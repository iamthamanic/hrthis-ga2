import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';
import { AppNavigator } from './navigation/AppNavigator';
import { startPerformanceMonitoring } from './utils/performance-monitoring';
import { errorTracker } from './utils/error-tracking';

// Get base path from environment variable or default to empty string
const basename = process.env.REACT_APP_BASE_PATH || '';

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize error tracking
    if (process.env.REACT_APP_SENTRY_DSN) {
      errorTracker.init(process.env.REACT_APP_SENTRY_DSN);
    }

    // Initialize performance monitoring
    startPerformanceMonitoring({
      enableLogging: process.env.NODE_ENV === 'development',
      reportCallback: (data) => {
        // Report poor performance to error tracking
        if (data.rating === 'poor') {
          errorTracker.captureMessage(
            `Poor performance: ${data.metric} - ${data.value}ms`,
            'warning'
          );
        }
      },
      batchSize: 20,
      batchInterval: 60000, // 1 minute
    });

    // Log app initialization
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 HRthis App initialized with performance monitoring');
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router basename={basename}>
        <AppNavigator />
        <ToastProvider />
      </Router>
    </ErrorBoundary>
  );
}

export default App;