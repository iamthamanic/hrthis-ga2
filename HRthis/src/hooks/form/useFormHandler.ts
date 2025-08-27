/**
 * Generic Form Handler Hook with Zod Validation
 * Provides complete form state management with validation, error handling, and submission logic
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';

export type FormErrors<T> = {
  [K in keyof T]?: string;
}

export type FormTouched<T> = {
  [K in keyof T]?: boolean;
}

export interface UseFormHandlerOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit: (values: T) => Promise<void> | void;
  onError?: (error: Error) => void;
}

export interface UseFormHandlerReturn<T> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  setValues: (values: Partial<T>) => void;
  resetForm: (newValues?: T) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
}

/**
 * Custom hook for form handling with validation
 * @template T - The shape of form values
 * @param options - Form handler configuration
 * @returns Form state and handlers
 */
export function useFormHandler<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  validateOnChange = true,
  validateOnBlur = true,
  onSubmit,
  onError
}: UseFormHandlerOptions<T>): UseFormHandlerReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);

  // Check if form is dirty (values changed from initial)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  /**
   * Validate a single field
   */
  const validateField = useCallback((field: keyof T) => {
    if (!validationSchema) return;

    try {
      // Validate the entire form but only update error for this field
      validationSchema.parse(values);
      
      // Clear error if validation passes
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(e => e.path[0] === field);
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [field]: fieldError.message
          }));
        } else {
          // Clear error if no error for this field
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      }
    }
  }, [values, validationSchema]);

  /**
   * Validate entire form
   */
  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors<T> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as keyof T;
          if (field && !newErrors[field]) {
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  }, [values, validationSchema]);

  /**
   * Handle field value change
   */
  const handleChange = useCallback((field: keyof T) => (value: any) => {
    // Handle event or direct value
    const newValue = value?.target ? value.target.value : value;
    
    setValuesState(prev => ({
      ...prev,
      [field]: newValue
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate on change if enabled
    if (validateOnChange && validationSchema) {
      // Use setTimeout to validate after state update
      setTimeout(() => validateField(field), 0);
    }
  }, [validateOnChange, validationSchema, validateField]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    if (validateOnBlur && validationSchema) {
      validateField(field);
    }
  }, [validateOnBlur, validationSchema, validateField]);

  /**
   * Set single field value programmatically
   */
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({
      ...prev,
      [field]: value
    }));

    if (validateOnChange && touched[field]) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateOnChange, touched, validateField]);

  /**
   * Set single field error programmatically
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  /**
   * Set field touched state
   */
  const setFieldTouched = useCallback((field: keyof T, touchedValue: boolean = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: touchedValue
    }));
  }, []);

  /**
   * Set multiple values at once
   */
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  /**
   * Reset form to initial or new values
   */
  const resetForm = useCallback((newValues?: T) => {
    const resetValues = newValues || initialValuesRef.current;
    setValuesState(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    
    if (newValues) {
      initialValuesRef.current = newValues;
    }
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched: FormTouched<T> = {};
    Object.keys(values).forEach(key => {
      allTouched[key as keyof T] = true;
    });
    setTouched(allTouched);

    // Validate form
    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
      // Reset form on successful submission
      resetForm();
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        console.error('Form submission error:', error);
      }
      
      // Handle validation errors from backend
      if (error && typeof error === 'object' && 'fields' in error) {
        const fieldErrors = (error as any).fields;
        const newErrors: FormErrors<T> = {};
        
        Object.keys(fieldErrors).forEach(field => {
          newErrors[field as keyof T] = fieldErrors[field];
        });
        
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, onError, resetForm]);

  // Effect to update initial values if they change
  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    resetForm,
    validateField,
    validateForm
  };
}

/**
 * Helper to create form field props
 */
export function getFieldProps<T>(
  form: UseFormHandlerReturn<T>,
  field: keyof T
) {
  return {
    value: form.values[field],
    onChange: form.handleChange(field),
    onBlur: form.handleBlur(field),
    error: form.touched[field] ? form.errors[field] : undefined
  };
}