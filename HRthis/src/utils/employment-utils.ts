import { EmploymentType } from '../types';

export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type TimePeriod = 'day' | 'week' | 'month' | 'year';

/**
 * Get display label for employment type
 */
export const getEmploymentTypeLabel = (type: EmploymentType | string | null | undefined, customText?: string): string => {
  if (!type) return '';
  
  switch (type) {
    case 'FULL_TIME':
      return 'Vollzeit';
    case 'PART_TIME':
      return 'Teilzeit';
    case 'MINI_JOB':
      return 'Minijob';
    case 'INTERN':
    case 'INTERNSHIP':
      return 'Praktikum';
    case 'WORKING_STUDENT':
      return 'Werkstudent';
    case 'FREELANCER':
      return 'Freiberufler';
    case 'OTHER':
      return customText || 'Sonstige';
    default:
      return type;
  }
};

/**
 * Get display label for employment status
 */
export const getEmploymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Aktiv';
    case 'INACTIVE':
      return 'Inaktiv';
    case 'ON_LEAVE':
      return 'Beurlaubt';
    case 'TERMINATED':
      return 'Ausgeschieden';
    default:
      return status;
  }
};

/**
 * Calculate vacation days based on employment type and weekly hours
 */
export const calculateVacationDays = (employmentType: string, weeklyHours: number): number => {
  if (weeklyHours <= 0) return 0;
  
  const BASE_VACATION_DAYS = 30;
  
  switch (employmentType) {
    case 'FULL_TIME':
      return BASE_VACATION_DAYS;
    case 'PART_TIME':
      return Math.round((weeklyHours / 40) * BASE_VACATION_DAYS);
    case 'MINI_JOB':
      return Math.round((weeklyHours / 40) * 20);
    case 'INTERNSHIP':
    case 'INTERN':
      return 20;
    case 'WORKING_STUDENT':
      return Math.max(10, Math.round((weeklyHours / 40) * 20));
    case 'FREELANCER':
      return 0;
    default:
      return Math.round((weeklyHours / 40) * BASE_VACATION_DAYS);
  }
};

/**
 * Format employee number with prefix
 */
export const formatEmployeeNumber = (number: string | null | undefined): string => {
  if (!number) return 'PN-00000';
  const cleanNumber = number.replace(/[^0-9]/g, '');
  if (!cleanNumber) return 'PN-00000';
  return `PN-${cleanNumber.padStart(5, '0')}`;
};

/**
 * Check if employee is full-time
 */
export const isFullTimeEmployee = (employmentType: string | null | undefined, weeklyHours?: number): boolean => {
  if (!employmentType) return false;
  if (employmentType === 'FULL_TIME') return true;
  if (employmentType === 'PART_TIME' && weeklyHours && weeklyHours >= 35) return true;
  return false;
};

/**
 * Calculate working hours for different periods
 */
export const calculateWorkingHours = (weeklyHours: number, period: TimePeriod | string): number => {
  if (weeklyHours <= 0) return 0;
  
  switch (period) {
    case 'day':
      return weeklyHours / 5;
    case 'week':
      return weeklyHours;
    case 'month':
      return weeklyHours * 4.33;
    case 'year':
      return weeklyHours * 52;
    default:
      return weeklyHours;
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
  { value: 'WORKING_STUDENT', label: 'Werkstudent' },
  { value: 'FREELANCER', label: 'Freiberufler' },
  { value: 'OTHER', label: 'Sonstige' },
] as const;

/**
 * Check if employment type requires custom text
 */
export const requiresCustomText = (type: EmploymentType): boolean => {
  return type === 'OTHER';
};