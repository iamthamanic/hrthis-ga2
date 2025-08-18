import { EmploymentType } from '../types';

/**
 * Get display label for employment type
 */
export const getEmploymentTypeLabel = (type: EmploymentType, customText?: string): string => {
  switch (type) {
    case 'FULL_TIME':
      return 'Vollzeit';
    case 'PART_TIME':
      return 'Teilzeit';
    case 'MINI_JOB':
      return 'Minijob';
    case 'INTERN':
      return 'Praktikant';
    case 'OTHER':
      return customText || 'Sonstige';
    default:
      return type;
  }
};

/**
 * Employment type options for select inputs
 */
export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: 'Vollzeit' },
  { value: 'PART_TIME', label: 'Teilzeit' },
  { value: 'MINI_JOB', label: 'Minijob' },
  { value: 'INTERN', label: 'Praktikant' },
  { value: 'OTHER', label: 'Sonstige' },
] as const;

/**
 * Check if employment type requires custom text
 */
export const requiresCustomText = (type: EmploymentType): boolean => {
  return type === 'OTHER';
};