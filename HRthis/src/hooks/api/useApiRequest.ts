/**
 * Advanced API Request Hook with Caching, Retry Logic, and Optimistic Updates
 * Provides comprehensive API call management with loading states, error handling, and caching
 */

import { useState, useEffect, useCallback, useRef, DependencyList } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface UseApiRequestOptions<T> {
  immediate?: boolean;
  ttl?: number; // Time to live in milliseconds
  retries?: number;
  retryDelay?: number;
  optimisticUpdate?: (currentData: T | null) => T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheKey?: string;
  refetchInterval?: number;
  enabled?: boolean;
}

export interface UseApiRequestReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | null>;
  refetch: () => Promise<T | null>;
  mutate: (data: T | ((current: T | null) => T)) => void;
  reset: () => void;
  isStale: boolean;
}

// Global cache store
const apiCache = new Map<string, CacheEntry<any>>();

// Cache management functions
const cacheUtils = {
  get<T>(key: string): T | null {
    const entry = apiCache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      apiCache.delete(key);
      return null;
    }
    
    return entry.data;
  },

  set<T>(key: string, data: T, ttl: number) {
    apiCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  },

  invalidate(pattern?: string) {
    if (!pattern) {
      apiCache.clear();
      return;
    }
    
    Array.from(apiCache.keys())
      .filter(key => key.includes(pattern))
      .forEach(key => apiCache.delete(key));
  },

  isStale(key: string): boolean {
    const entry = apiCache.get(key);
    if (!entry) return true;
    
    const age = Date.now() - entry.timestamp;
    return age > entry.ttl * 0.75; // Consider stale at 75% of TTL
  }
};

/**
 * Custom hook for API requests with advanced features
 * @template T - The expected response data type
 * @param requestFn - The async function that makes the API call
 * @param deps - Dependencies that trigger re-execution
 * @param options - Configuration options
 * @returns API state and control methods
 */
export function useApiRequest<T = any>(
  requestFn: (...args: any[]) => Promise<T>,
  deps: DependencyList = [],
  options: UseApiRequestOptions<T> = {}
): UseApiRequestReturn<T> {
  const {
    immediate = true,
    ttl = 5 * 60 * 1000, // 5 minutes default
    retries = 3,
    retryDelay = 1000,
    optimisticUpdate,
    onSuccess,
    onError,
    cacheKey,
    refetchInterval,
    enabled = true
  } = options;

  const [data, setData] = useState<T | null>(() => {
    // Initialize with cached data if available
    return cacheKey ? cacheUtils.get<T>(cacheKey) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retriesRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Execute API request with retry logic
   */
  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    if (!enabled) return null;

    // Check cache first
    if (cacheKey) {
      const cachedData = cacheUtils.get<T>(cacheKey);
      if (cachedData && !cacheUtils.isStale(cacheKey)) {
        setData(cachedData);
        return cachedData;
      }
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Apply optimistic update
    if (optimisticUpdate && data !== null) {
      const optimisticData = optimisticUpdate(data);
      setData(optimisticData);
    }

    setLoading(true);
    setError(null);
    retriesRef.current = 0;

    const attemptRequest = async (): Promise<T | null> => {
      try {
        // Pass abort signal if the request function accepts it
        const result = await requestFn(...args, {
          signal: abortControllerRef.current?.signal
        });

        if (!mountedRef.current) return null;

        setData(result);
        setError(null);

        // Cache the result
        if (cacheKey) {
          cacheUtils.set(cacheKey, result, ttl);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err: any) {
        // Ignore abort errors
        if (err.name === 'AbortError') {
          return null;
        }

        if (!mountedRef.current) return null;

        // Retry logic
        if (retriesRef.current < retries) {
          retriesRef.current++;
          
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, retriesRef.current - 1);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          
          if (mountedRef.current) {
            return attemptRequest();
          }
        }

        // Max retries reached
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Revert optimistic update on error
        if (optimisticUpdate && cacheKey) {
          const previousData = cacheUtils.get<T>(cacheKey);
          if (previousData) {
            setData(previousData);
          }
        }

        // Call error callback
        if (onError) {
          onError(error);
        }

        return null;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    return attemptRequest();
  }, [enabled, cacheKey, ttl, optimisticUpdate, data, requestFn, retries, retryDelay, onSuccess, onError]);

  /**
   * Refetch data (bypasses cache)
   */
  const refetch = useCallback(async (): Promise<T | null> => {
    // Invalidate cache for this key
    if (cacheKey) {
      apiCache.delete(cacheKey);
    }
    
    return execute();
  }, [cacheKey, execute]);

  /**
   * Manually update data (useful for optimistic updates)
   */
  const mutate = useCallback((newData: T | ((current: T | null) => T)) => {
    const updatedData = typeof newData === 'function' 
      ? (newData as (current: T | null) => T)(data)
      : newData;
    
    setData(updatedData);
    
    // Update cache
    if (cacheKey) {
      cacheUtils.set(cacheKey, updatedData, ttl);
    }
  }, [data, cacheKey, ttl]);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  /**
   * Check if cached data is stale
   */
  const isStale = cacheKey ? cacheUtils.isStale(cacheKey) : false;

  // Execute on mount if immediate is true
  useEffect(() => {
    if (immediate && enabled) {
      execute();
    }
  }, [...deps, immediate, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set up refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        refetch();
      }, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refetchInterval, enabled, refetch]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    mutate,
    reset,
    isStale
  };
}

/**
 * Hook for managing multiple API requests
 */
export function useMultipleApiRequests<T extends Record<string, any>>(
  requests: {
    [K in keyof T]: {
      fn: () => Promise<T[K]>;
      options?: UseApiRequestOptions<T[K]>;
    };
  }
) {
  const results: any = {};
  
  Object.keys(requests).forEach(key => {
    const { fn, options } = requests[key as keyof T];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[key] = useApiRequest(fn, [], options);
  });
  
  return results as {
    [K in keyof T]: UseApiRequestReturn<T[K]>;
  };
}

/**
 * Hook for paginated API requests
 */
export function usePaginatedApiRequest<T>(
  requestFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  pageSize: number = 10,
  options: UseApiRequestOptions<{ data: T[]; total: number }> = {}
) {
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState<T[]>([]);
  
  const { data, loading, error, execute, refetch } = useApiRequest(
    () => requestFn(page, pageSize),
    [page, pageSize],
    {
      ...options,
      onSuccess: (result) => {
        if (page === 1) {
          setAllData(result.data);
        } else {
          setAllData(prev => [...prev, ...result.data]);
        }
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
      }
    }
  );
  
  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);
  
  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
  }, []);
  
  const hasMore = data ? allData.length < data.total : false;
  
  return {
    data: allData,
    loading,
    error,
    page,
    pageSize,
    total: data?.total || 0,
    hasMore,
    loadMore,
    refetch,
    reset
  };
}

// Export cache utilities for external use
export const apiCacheUtils = cacheUtils;