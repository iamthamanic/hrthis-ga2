import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';
import { AppNavigator } from './navigation/AppNavigator';

// Get base path from environment variable or default to empty string
const basename = process.env.REACT_APP_BASE_PATH || '';

function App(): React.JSX.Element {
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