/**
 * Type-safe LocalStorage Hook
 * Provides localStorage wrapper with JSON serialization and cross-tab synchronization
 */

import { useState, useEffect, useCallback, useRef } from 'react';

type Serializer<T> = {
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
};

const defaultSerializer: Serializer<any> = {
  serialize: JSON.stringify,
  deserialize: JSON.parse
};

export interface UseLocalStorageOptions<T> {
  serializer?: Serializer<T>;
  syncTabs?: boolean;
  ttl?: number; // Time to live in milliseconds
  fallbackValue?: T;
  onError?: (error: Error) => void;
}

interface StoredValue<T> {
  value: T;
  timestamp?: number;
  ttl?: number;
}

/**
 * Custom hook for type-safe localStorage management
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Configuration options
 * @returns Tuple of [value, setValue, remove, refresh]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void, () => void] {
  const {
    serializer = defaultSerializer,
    syncTabs = true,
    ttl,
    fallbackValue = initialValue,
    onError
  } = options;

  // Get value from localStorage or use initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return initialValue;
      }

      const parsed: StoredValue<T> = serializer.deserialize(item);
      
      // Check if value has TTL and is expired
      if (parsed.ttl && parsed.timestamp) {
        const now = Date.now();
        const age = now - parsed.timestamp;
        
        if (age > parsed.ttl) {
          // Value expired, remove it
          window.localStorage.removeItem(key);
          return initialValue;
        }
      }

      // Return the value or the parsed item directly (for backward compatibility)
      return parsed.value !== undefined ? parsed.value : parsed as any;
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
      return fallbackValue;
    }
  }, [key, initialValue, fallbackValue, serializer, ttl, onError]);

  const [storedValue, setStoredValue] = useState<T>(readValue);
  const setValueRef = useRef<((value: T) => void) | null>(null);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to localStorage with TTL if specified
      if (typeof window !== 'undefined') {
        const storageValue: StoredValue<T> = ttl
          ? { value: valueToStore, timestamp: Date.now(), ttl }
          : { value: valueToStore };
        
        const serialized = ttl
          ? JSON.stringify(storageValue)
          : serializer.serialize(valueToStore);
        
        window.localStorage.setItem(key, serialized);
        
        // Dispatch custom event for cross-tab synchronization
        if (syncTabs) {
          window.dispatchEvent(new CustomEvent('local-storage', {
            detail: { key, value: valueToStore }
          }));
        }
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue, serializer, ttl, syncTabs, onError]);

  // Store setValue in ref for event listener
  setValueRef.current = setValue;

  // Remove value from localStorage
  const remove = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        // Dispatch custom event for cross-tab synchronization
        if (syncTabs) {
          window.dispatchEvent(new CustomEvent('local-storage', {
            detail: { key, value: null }
          }));
        }
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        console.warn(`Error removing localStorage key "${key}":`, error);
      }
    }
  }, [key, initialValue, syncTabs, onError]);

  // Refresh value from localStorage
  const refresh = useCallback(() => {
    setStoredValue(readValue());
  }, [readValue]);

  // Handle storage change events (cross-tab synchronization)
  useEffect(() => {
    if (!syncTabs || typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed: StoredValue<T> = serializer.deserialize(e.newValue);
          const value = parsed.value !== undefined ? parsed.value : parsed as any;
          setStoredValue(value);
        } catch (error) {
          if (onError) {
            onError(error as Error);
          }
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value ?? initialValue);
      }
    };

    // Listen to storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    // Listen to custom events from same tab
    window.addEventListener('local-storage' as any, handleCustomStorageChange as any);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage' as any, handleCustomStorageChange as any);
    };
  }, [key, initialValue, serializer, syncTabs, onError]);

  // Check for expired values on mount and periodically
  useEffect(() => {
    if (!ttl) return;

    const checkExpiry = () => {
      const current = readValue();
      if (current !== storedValue) {
        setStoredValue(current);
      }
    };

    // Check immediately
    checkExpiry();

    // Check periodically (every minute)
    const interval = setInterval(checkExpiry, 60000);

    return () => clearInterval(interval);
  }, [ttl, readValue, storedValue]);

  return [storedValue, setValue, remove, refresh];
}

/**
 * Hook for managing user preferences in localStorage
 */
export function useUserPreferences<T extends Record<string, any>>(
  userId: string,
  defaultPreferences: T
) {
  const key = `user-preferences-${userId}`;
  const [preferences, setPreferences, resetPreferences] = useLocalStorage(
    key,
    defaultPreferences,
    { syncTabs: true }
  );

  const updatePreference = useCallback(<K extends keyof T>(
    prefKey: K,
    value: T[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [prefKey]: value
    }));
  }, [setPreferences]);

  const updatePreferences = useCallback((updates: Partial<T>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences
  };
}

/**
 * Hook for managing application settings
 */
interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  compactMode: boolean;
  sidebarCollapsed: boolean;
  [key: string]: any;
}

export function useAppSettings(defaults?: Partial<AppSettings>) {
  const defaultSettings: AppSettings = {
    theme: 'light',
    language: 'de',
    notifications: true,
    compactMode: false,
    sidebarCollapsed: false,
    ...defaults
  };

  const [settings, setSettings, resetSettings] = useLocalStorage(
    'app-settings',
    defaultSettings,
    { syncTabs: true }
  );

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setSettings]);

  const toggleSetting = useCallback((key: keyof AppSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, [setSettings]);

  return {
    settings,
    updateSetting,
    toggleSetting,
    resetSettings
  };
}

/**
 * Hook for managing session storage (expires when tab closes)
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  options: Omit<UseLocalStorageOptions<T>, 'syncTabs'> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = defaultSerializer,
    onError
  } = options;

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? serializer.deserialize(item) : initialValue;
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      return initialValue;
    }
  }, [key, initialValue, serializer, onError]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, serializer.serialize(valueToStore));
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  }, [key, storedValue, serializer, onError]);

  const remove = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  }, [key, initialValue, onError]);

  return [storedValue, setValue, remove];
}