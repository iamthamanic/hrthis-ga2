import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { AppNavigator } from './navigation/AppNavigator';
import { ToastProvider } from './components/ToastProvider';

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