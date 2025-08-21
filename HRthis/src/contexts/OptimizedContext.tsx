import React, { createContext, useContext, useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Optimized Context Pattern
 * Prevents unnecessary re-renders by splitting context and using memoization
 */

// Split contexts for better performance
interface AppStateContextType {
  user: any;
  theme: 'light' | 'dark';
  locale: string;
  isLoading: boolean;
}

interface AppActionsContextType {
  setUser: (user: any) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLocale: (locale: string) => void;
  setLoading: (loading: boolean) => void;
}

// Separate contexts for state and actions
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);
const AppActionsContext = createContext<AppActionsContextType | undefined>(undefined);

// Custom hooks for accessing context
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};

export const useAppActions = () => {
  const context = useContext(AppActionsContext);
  if (!context) {
    throw new Error('useAppActions must be used within AppProvider');
  }
  return context;
};

// Optimized provider component
interface AppProviderProps {
  children: React.ReactNode;
  initialState?: Partial<AppStateContextType>;
}

export const OptimizedAppProvider: React.FC<AppProviderProps> = ({ 
  children, 
  initialState = {} 
}) => {
  // Use refs to track state without causing re-renders
  const [state, setState] = React.useState<AppStateContextType>({
    user: initialState.user || null,
    theme: initialState.theme || 'light',
    locale: initialState.locale || 'de',
    isLoading: initialState.isLoading || false,
  });

  // Memoized actions that never change
  const actions = useMemo<AppActionsContextType>(() => ({
    setUser: (user) => setState(prev => ({ ...prev, user })),
    setTheme: (theme) => setState(prev => ({ ...prev, theme })),
    setLocale: (locale) => setState(prev => ({ ...prev, locale })),
    setLoading: (loading) => setState(prev => ({ ...prev, isLoading: loading })),
  }), []);

  // Memoize state value
  const stateValue = useMemo(() => state, [state]);

  return (
    <AppStateContext.Provider value={stateValue}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
};

// Performance monitoring context
interface PerformanceContextType {
  metrics: Map<string, number>;
  recordMetric: (name: string, value: number) => void;
  getMetric: (name: string) => number | undefined;
  clearMetrics: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
};

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const metricsRef = useRef(new Map<string, number>());
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const recordMetric = useCallback((name: string, value: number) => {
    metricsRef.current.set(name, value);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric: ${name} = ${value}ms`);
    }
  }, []);

  const getMetric = useCallback((name: string) => {
    return metricsRef.current.get(name);
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current.clear();
    forceUpdate();
  }, []);

  const value = useMemo(() => ({
    metrics: metricsRef.current,
    recordMetric,
    getMetric,
    clearMetrics,
  }), [recordMetric, getMetric, clearMetrics]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Render tracking HOC
export function withRenderTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return React.memo((props: P) => {
    const renderCount = useRef(0);
    const renderTime = useRef(0);
    const performance = usePerformance();

    useEffect(() => {
      renderCount.current++;
      const startTime = performance.now();
      
      return () => {
        renderTime.current = performance.now() - startTime;
        performance.recordMetric(`${componentName}_render_time`, renderTime.current);
        
        if (process.env.NODE_ENV === 'development' && renderCount.current > 10) {
          console.warn(`⚠️ ${componentName} has rendered ${renderCount.current} times`);
        }
      };
    });

    return <Component {...props} />;
  });
}

// Subscription-based state manager for fine-grained updates
class StateManager<T> {
  private state: T;
  private listeners: Map<keyof T, Set<() => void>> = new Map();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  getValue<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }

  setValue<K extends keyof T>(key: K, value: T[K]): void {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.notifyListeners(key);
    }
  }

  subscribe<K extends keyof T>(key: K, callback: () => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  private notifyListeners<K extends keyof T>(key: K): void {
    this.listeners.get(key)?.forEach(callback => callback());
  }
}

// Hook for using the state manager
export function useStateManager<T, K extends keyof T>(
  manager: StateManager<T>,
  key: K
): [T[K], (value: T[K]) => void] {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  useEffect(() => {
    return manager.subscribe(key, forceUpdate);
  }, [manager, key]);

  const value = manager.getValue(key);
  const setValue = useCallback((newValue: T[K]) => {
    manager.setValue(key, newValue);
  }, [manager, key]);

  return [value, setValue];
}

// Example usage of state manager
interface GlobalState {
  count: number;
  user: any;
  theme: string;
}

export const globalStateManager = new StateManager<GlobalState>({
  count: 0,
  user: null,
  theme: 'light',
});

// Virtual list hook for performance with large lists
interface VirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualList<T>(
  items: T[],
  options: VirtualListOptions
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const { itemHeight, containerHeight, overscan = 3 } = options;

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex + 1),
      offsetY: startIndex * itemHeight,
      totalHeight: items.length * itemHeight,
    };
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    ...visibleRange,
    handleScroll,
  };
}

// Export all optimized components and hooks
export default {
  OptimizedAppProvider,
  useAppState,
  useAppActions,
  PerformanceProvider,
  usePerformance,
  withRenderTracking,
  StateManager,
  useStateManager,
  globalStateManager,
  useVirtualList,
};