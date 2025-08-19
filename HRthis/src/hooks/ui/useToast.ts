/**
 * Toast Notification Hook
 * Manages toast notifications with different types and auto-dismiss functionality
 */

import { create } from 'zustand';
import { useCallback, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  position?: ToastPosition;
  persistent?: boolean;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
}

// Global toast store
const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    // Auto-dismiss if not persistent
    if (!toast.persistent && toast.duration !== 0) {
      const duration = toast.duration || 5000;
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }));
        
        if (toast.onClose) {
          toast.onClose();
        }
      }, duration);
    }
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => {
      const toast = state.toasts.find(t => t.id === id);
      if (toast?.onClose) {
        toast.onClose();
      }
      
      return {
        toasts: state.toasts.filter(t => t.id !== id)
      };
    });
  },
  
  clearToasts: () => {
    set((state) => {
      state.toasts.forEach(toast => {
        if (toast.onClose) {
          toast.onClose();
        }
      });
      
      return { toasts: [] };
    });
  },
  
  updateToast: (id, updates) => {
    set((state) => ({
      toasts: state.toasts.map(toast =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    }));
  }
}));

interface UseToastOptions {
  position?: ToastPosition;
  duration?: number;
  persistent?: boolean;
}

interface UseToastReturn {
  // Display methods
  success: (title: string, message?: string, options?: UseToastOptions) => string;
  error: (title: string, message?: string, options?: UseToastOptions) => string;
  warning: (title: string, message?: string, options?: UseToastOptions) => string;
  info: (title: string, message?: string, options?: UseToastOptions) => string;
  
  // Generic show method
  show: (toast: Omit<Toast, 'id'>) => string;
  
  // Promise-based toasts
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => Promise<T>;
  
  // Management methods
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, updates: Partial<Toast>) => void;
  
  // State
  toasts: Toast[];
  isActive: (id: string) => boolean;
}

/**
 * Custom hook for managing toast notifications
 * @param defaultOptions - Default options for all toasts
 * @returns Toast utilities
 */
export function useToast(defaultOptions?: UseToastOptions): UseToastReturn {
  const { toasts, addToast, removeToast, clearToasts, updateToast } = useToastStore();

  // Success toast
  const success = useCallback((
    title: string,
    message?: string,
    options?: UseToastOptions
  ): string => {
    return addToast({
      type: 'success',
      title,
      message,
      ...defaultOptions,
      ...options
    });
  }, [addToast, defaultOptions]);

  // Error toast
  const error = useCallback((
    title: string,
    message?: string,
    options?: UseToastOptions
  ): string => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 7000, // Errors stay longer
      ...defaultOptions,
      ...options
    });
  }, [addToast, defaultOptions]);

  // Warning toast
  const warning = useCallback((
    title: string,
    message?: string,
    options?: UseToastOptions
  ): string => {
    return addToast({
      type: 'warning',
      title,
      message,
      ...defaultOptions,
      ...options
    });
  }, [addToast, defaultOptions]);

  // Info toast
  const info = useCallback((
    title: string,
    message?: string,
    options?: UseToastOptions
  ): string => {
    return addToast({
      type: 'info',
      title,
      message,
      ...defaultOptions,
      ...options
    });
  }, [addToast, defaultOptions]);

  // Generic show method
  const show = useCallback((toast: Omit<Toast, 'id'>): string => {
    return addToast({
      ...defaultOptions,
      ...toast
    });
  }, [addToast, defaultOptions]);

  // Promise-based toast
  const promise = useCallback(async <T,>(
    promiseFn: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ): Promise<T> => {
    // Show loading toast
    const loadingId = addToast({
      type: 'info',
      title: messages.loading,
      persistent: true,
      ...defaultOptions
    });

    try {
      const result = await promiseFn;
      
      // Remove loading toast
      removeToast(loadingId);
      
      // Show success toast
      const successMessage = typeof messages.success === 'function'
        ? messages.success(result)
        : messages.success;
      
      success(successMessage);
      
      return result;
    } catch (err) {
      // Remove loading toast
      removeToast(loadingId);
      
      // Show error toast
      const errorMessage = typeof messages.error === 'function'
        ? messages.error(err as Error)
        : messages.error;
      
      error(errorMessage);
      
      throw err;
    }
  }, [addToast, removeToast, success, error, defaultOptions]);

  // Dismiss a specific toast
  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, [removeToast]);

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    clearToasts();
  }, [clearToasts]);

  // Update a toast
  const update = useCallback((id: string, updates: Partial<Toast>) => {
    updateToast(id, updates);
  }, [updateToast]);

  // Check if a toast is active
  const isActive = useCallback((id: string): boolean => {
    return toasts.some(t => t.id === id);
  }, [toasts]);

  return {
    success,
    error,
    warning,
    info,
    show,
    promise,
    dismiss,
    dismissAll,
    update,
    toasts,
    isActive
  };
}

/**
 * Hook for API response toasts
 */
export function useApiToast() {
  const toast = useToast();

  const handleApiResponse = useCallback(async <T,>(
    apiCall: Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string | ((data: T) => string);
      errorMessage?: string | ((error: Error) => string);
      showSuccess?: boolean;
    }
  ): Promise<T> => {
    const {
      loadingMessage = 'Verarbeitung läuft...',
      successMessage = 'Erfolgreich!',
      errorMessage = 'Ein Fehler ist aufgetreten',
      showSuccess = true
    } = options || {};

    const loadingId = toast.info(loadingMessage, undefined, { persistent: true });

    try {
      const result = await apiCall;
      toast.dismiss(loadingId);
      
      if (showSuccess) {
        const message = typeof successMessage === 'function'
          ? successMessage(result)
          : successMessage;
        toast.success(message);
      }
      
      return result;
    } catch (error: any) {
      toast.dismiss(loadingId);
      
      const message = typeof errorMessage === 'function'
        ? errorMessage(error)
        : error.message || errorMessage;
      
      toast.error('Fehler', message);
      throw error;
    }
  }, [toast]);

  return {
    ...toast,
    handleApiResponse
  };
}

/**
 * Hook for form submission toasts
 */
export function useFormToast() {
  const toast = useToast();

  const handleFormSubmit = useCallback(async <T,>(
    submitFn: () => Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<T | null> => {
    const {
      successMessage = 'Formular erfolgreich gesendet',
      errorMessage = 'Fehler beim Senden des Formulars',
      onSuccess,
      onError
    } = options || {};

    try {
      const result = await submitFn();
      toast.success(successMessage);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error: any) {
      const message = error.message || errorMessage;
      toast.error('Fehler', message);
      
      if (onError) {
        onError(error);
      }
      
      return null;
    }
  }, [toast]);

  return {
    ...toast,
    handleFormSubmit
  };
}