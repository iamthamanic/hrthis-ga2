import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { AppNavigator } from './navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <Router>
        <AppNavigator />
      </Router>
    </ErrorBoundary>
  );
}

export default App;