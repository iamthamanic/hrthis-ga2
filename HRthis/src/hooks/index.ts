/**
 * Central export file for all custom hooks
 * Organized by category for easy import
 */

// Form Hooks
export { useFormHandler, getFieldProps } from './form/useFormHandler';
export type { 
  UseFormHandlerOptions, 
  UseFormHandlerReturn,
  FormErrors,
  FormTouched 
} from './form/useFormHandler';

// API Hooks
export { 
  useApiRequest,
  useMultipleApiRequests,
  usePaginatedApiRequest,
  apiCacheUtils 
} from './api/useApiRequest';
export type { UseApiRequestOptions, UseApiRequestReturn } from './api/useApiRequest';

// Utility Hooks
export { 
  useDebounce,
  useDebouncedCallback,
  useDebouncedSearch,
  useDebouncedInput,
  useThrottle 
} from './utils/useDebounce';

// Core Hooks
export { 
  usePermission,
  withPermission,
  PermissionGate 
} from './core/usePermission';
export type { 
  UserRole,
  Permission,
  UsePermissionReturn 
} from './core/usePermission';

// UI Hooks
export { 
  useToast,
  useApiToast,
  useFormToast 
} from './ui/useToast';
export type { 
  Toast,
  ToastType,
  ToastPosition 
} from './ui/useToast';

// State Hooks
export { 
  useLocalStorage,
  useUserPreferences,
  useAppSettings,
  useSessionStorage 
} from './state/useLocalStorage';
export type { UseLocalStorageOptions } from './state/useLocalStorage';