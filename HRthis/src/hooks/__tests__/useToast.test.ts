import { renderHook, act } from '@testing-library/react';

import { useToast } from '../ui/useToast';

// Import the store to reset it between tests
import { useToastStore } from '../ui/useToast';

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Reset the toast store before each test
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    jest.useRealTimers();
    // Clear all toasts after each test
    useToastStore.setState({ toasts: [] });
  });

  it('should initialize with no toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test message',
      type: 'success'
    });
  });

  it('should add multiple toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('First message', 'success');
      result.current.showToast('Second message', 'error');
      result.current.showToast('Third message', 'info');
    });

    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].title).toBe('First message');
    expect(result.current.toasts[1].title).toBe('Second message');
    expect(result.current.toasts[2].title).toBe('Third message');
  });

  it('should generate unique IDs for toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Message 1', 'success');
      result.current.showToast('Message 2', 'success');
    });

    const ids = result.current.toasts.map(t => t.id);
    expect(new Set(ids).size).toBe(2); // All IDs should be unique
  });

  it('should remove a toast by ID', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Message to remove', 'success');
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should auto-remove toast after duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Auto-remove message', 'success', 3000);
    });

    expect(result.current.toasts).toHaveLength(1);

    // Advance timers by 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should handle different toast types', () => {
    const { result } = renderHook(() => useToast());
    const types: Array<'success' | 'error' | 'warning' | 'info'> = [
      'success',
      'error',
      'warning',
      'info'
    ];

    types.forEach(type => {
      act(() => {
        result.current.showToast(`${type} message`, type);
      });
    });

    expect(result.current.toasts).toHaveLength(4);
    result.current.toasts.forEach((toast, index) => {
      expect(toast.type).toBe(types[index]);
    });
  });

  it('should use default duration if not specified', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Default duration', 'info');
    });

    expect(result.current.toasts).toHaveLength(1);

    // Default duration is usually 5000ms
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should not auto-remove if duration is 0', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Persistent toast', 'info', 0);
    });

    expect(result.current.toasts).toHaveLength(1);

    // Advance time significantly
    act(() => {
      jest.advanceTimersByTime(100000);
    });

    // Toast should still be there
    expect(result.current.toasts).toHaveLength(1);
  });

  it('should clear all toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Toast 1', 'success');
      result.current.showToast('Toast 2', 'error');
      result.current.showToast('Toast 3', 'info');
    });

    expect(result.current.toasts).toHaveLength(3);

    act(() => {
      result.current.clearToasts();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should handle rapid toast additions', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.showToast(`Message ${i}`, 'info');
      }
    });

    expect(result.current.toasts).toHaveLength(10);
  });

  it('should maintain toast order (FIFO)', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('First', 'info');
      result.current.showToast('Second', 'info');
      result.current.showToast('Third', 'info');
    });

    expect(result.current.toasts[0].title).toBe('First');
    expect(result.current.toasts[1].title).toBe('Second');
    expect(result.current.toasts[2].title).toBe('Third');
  });

  it('should handle removing non-existent toast gracefully', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test', 'info');
    });

    expect(result.current.toasts).toHaveLength(1);

    // Try to remove a non-existent toast
    act(() => {
      result.current.removeToast('non-existent-id');
    });

    // Original toast should still be there
    expect(result.current.toasts).toHaveLength(1);
  });
});