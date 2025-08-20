/**
 * Toast Provider Component
 * Renders toast notifications from the global toast store
 */

import React, { useEffect } from 'react';

import { useToast } from '../hooks';
import { cn } from '../utils/cn';

export const ToastProvider: React.FC = () => {
  const { toasts, dismiss } = useToast();

  // Auto-dismiss toasts with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toasts.length > 0) {
        dismiss(toasts[toasts.length - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in",
            {
              'bg-green-50 border border-green-200': toast.type === 'success',
              'bg-red-50 border border-red-200': toast.type === 'error',
              'bg-yellow-50 border border-yellow-200': toast.type === 'warning',
              'bg-blue-50 border border-blue-200': toast.type === 'info',
            }
          )}
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            {toast.type === 'success' && (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className={cn(
              "font-medium text-sm",
              {
                'text-green-900': toast.type === 'success',
                'text-red-900': toast.type === 'error',
                'text-yellow-900': toast.type === 'warning',
                'text-blue-900': toast.type === 'info',
              }
            )}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={cn(
                "mt-1 text-sm",
                {
                  'text-green-700': toast.type === 'success',
                  'text-red-700': toast.type === 'error',
                  'text-yellow-700': toast.type === 'warning',
                  'text-blue-700': toast.type === 'info',
                }
              )}>
                {toast.message}
              </p>
            )}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className={cn(
                  "mt-2 text-sm font-medium underline",
                  {
                    'text-green-700 hover:text-green-800': toast.type === 'success',
                    'text-red-700 hover:text-red-800': toast.type === 'error',
                    'text-yellow-700 hover:text-yellow-800': toast.type === 'warning',
                    'text-blue-700 hover:text-blue-800': toast.type === 'info',
                  }
                )}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => dismiss(toast.id)}
            className={cn(
              "flex-shrink-0 rounded-md p-1 hover:bg-opacity-20 transition-colors",
              {
                'hover:bg-green-600': toast.type === 'success',
                'hover:bg-red-600': toast.type === 'error',
                'hover:bg-yellow-600': toast.type === 'warning',
                'hover:bg-blue-600': toast.type === 'info',
              }
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;
document.head.appendChild(style);