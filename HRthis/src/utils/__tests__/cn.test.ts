import { cn } from '../cn';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2', 'py-1', 'bg-blue-500');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).toContain('bg-blue-500');
  });

  it('should handle conditional class names', () => {
    const isActive = true;
    const isDisabled = false;
    
    const result = cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled'
    );
    
    expect(result).toContain('base-class');
    expect(result).toContain('active');
    expect(result).not.toContain('disabled');
  });

  it('should merge conflicting Tailwind classes correctly', () => {
    // tailwind-merge should prioritize later classes
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(typeof result).toBe('string');
  });

  it('should handle null and undefined values', () => {
    const result = cn('base', null, undefined, 'end');
    expect(result).toContain('base');
    expect(result).toContain('end');
  });

  it('should handle arrays of class names', () => {
    const result = cn(['px-2', 'py-1'], 'bg-blue-500');
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
    expect(result).toContain('bg-blue-500');
  });

  it('should handle objects with boolean conditions', () => {
    const result = cn({
      'text-red-500': true,
      'text-blue-500': false,
      'font-bold': true
    });
    
    expect(result).toContain('text-red-500');
    expect(result).toContain('font-bold');
    expect(result).not.toContain('text-blue-500');
  });
});