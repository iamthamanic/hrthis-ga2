import {
  getEmploymentTypeLabel,
  getEmploymentStatusLabel,
  calculateVacationDays,
  formatEmployeeNumber,
  isFullTimeEmployee,
  calculateWorkingHours
} from '../employment-utils';

describe('employment-utils', () => {
  describe('getEmploymentTypeLabel', () => {
    it('should return correct labels for employment types', () => {
      expect(getEmploymentTypeLabel('FULL_TIME')).toBe('Vollzeit');
      expect(getEmploymentTypeLabel('PART_TIME')).toBe('Teilzeit');
      expect(getEmploymentTypeLabel('MINI_JOB')).toBe('Minijob');
      expect(getEmploymentTypeLabel('INTERNSHIP')).toBe('Praktikum');
      expect(getEmploymentTypeLabel('WORKING_STUDENT')).toBe('Werkstudent');
      expect(getEmploymentTypeLabel('FREELANCER')).toBe('Freiberufler');
    });

    it('should return original value for unknown types', () => {
      expect(getEmploymentTypeLabel('UNKNOWN_TYPE')).toBe('UNKNOWN_TYPE');
      expect(getEmploymentTypeLabel('')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(getEmploymentTypeLabel(null as any)).toBe('');
      expect(getEmploymentTypeLabel(undefined as any)).toBe('');
    });
  });

  describe('getEmploymentStatusLabel', () => {
    it('should return correct labels for employment status', () => {
      expect(getEmploymentStatusLabel('ACTIVE')).toBe('Aktiv');
      expect(getEmploymentStatusLabel('INACTIVE')).toBe('Inaktiv');
      expect(getEmploymentStatusLabel('ON_LEAVE')).toBe('Beurlaubt');
      expect(getEmploymentStatusLabel('TERMINATED')).toBe('Ausgeschieden');
    });

    it('should return original value for unknown status', () => {
      expect(getEmploymentStatusLabel('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('calculateVacationDays', () => {
    it('should calculate vacation days for full-time employees', () => {
      expect(calculateVacationDays('FULL_TIME', 40)).toBe(30);
      expect(calculateVacationDays('FULL_TIME', 38)).toBe(30);
    });

    it('should calculate vacation days for part-time employees', () => {
      expect(calculateVacationDays('PART_TIME', 20)).toBe(15); // 50% of full-time
      expect(calculateVacationDays('PART_TIME', 30)).toBe(23); // 75% of full-time
    });

    it('should calculate vacation days for mini-job employees', () => {
      expect(calculateVacationDays('MINI_JOB', 10)).toBe(5); // 10/40 * 20 = 5
    });

    it('should calculate vacation days for internships', () => {
      expect(calculateVacationDays('INTERNSHIP', 40)).toBe(20);
    });

    it('should calculate vacation days for working students', () => {
      expect(calculateVacationDays('WORKING_STUDENT', 20)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(calculateVacationDays('FULL_TIME', 0)).toBe(0);
      expect(calculateVacationDays('PART_TIME', -10)).toBe(0);
      expect(calculateVacationDays('UNKNOWN' as any, 40)).toBe(30);
    });

    it('should round vacation days appropriately', () => {
      expect(calculateVacationDays('PART_TIME', 25)).toBe(19); // 62.5% rounds to 19
    });
  });

  describe('formatEmployeeNumber', () => {
    it('should format employee numbers correctly', () => {
      expect(formatEmployeeNumber('12345')).toBe('PN-12345');
      expect(formatEmployeeNumber('1')).toBe('PN-00001');
      expect(formatEmployeeNumber('999')).toBe('PN-00999');
    });

    it('should handle already formatted numbers', () => {
      expect(formatEmployeeNumber('PN-12345')).toBe('PN-12345');
      expect(formatEmployeeNumber('PN-00001')).toBe('PN-00001');
    });

    it('should pad numbers to 5 digits', () => {
      expect(formatEmployeeNumber('1')).toBe('PN-00001');
      expect(formatEmployeeNumber('12')).toBe('PN-00012');
      expect(formatEmployeeNumber('123')).toBe('PN-00123');
      expect(formatEmployeeNumber('1234')).toBe('PN-01234');
      expect(formatEmployeeNumber('12345')).toBe('PN-12345');
    });

    it('should handle long numbers', () => {
      expect(formatEmployeeNumber('123456')).toBe('PN-123456');
      expect(formatEmployeeNumber('9999999')).toBe('PN-9999999');
    });

    it('should handle edge cases', () => {
      expect(formatEmployeeNumber('')).toBe('PN-00000');
      expect(formatEmployeeNumber(null as any)).toBe('PN-00000');
      expect(formatEmployeeNumber(undefined as any)).toBe('PN-00000');
    });

    it('should handle numbers with special characters', () => {
      expect(formatEmployeeNumber('123-45')).toBe('PN-12345');
      expect(formatEmployeeNumber('ABC123')).toBe('PN-00123');
    });
  });

  describe('isFullTimeEmployee', () => {
    it('should identify full-time employees', () => {
      expect(isFullTimeEmployee('FULL_TIME')).toBe(true);
      expect(isFullTimeEmployee('FULL_TIME', 40)).toBe(true);
      expect(isFullTimeEmployee('FULL_TIME', 38)).toBe(true);
    });

    it('should identify non-full-time employees', () => {
      expect(isFullTimeEmployee('PART_TIME')).toBe(false);
      expect(isFullTimeEmployee('MINI_JOB')).toBe(false);
      expect(isFullTimeEmployee('INTERNSHIP')).toBe(false);
      expect(isFullTimeEmployee('WORKING_STUDENT')).toBe(false);
    });

    it('should consider hours for part-time employees', () => {
      expect(isFullTimeEmployee('PART_TIME', 40)).toBe(true); // Full hours
      expect(isFullTimeEmployee('PART_TIME', 35)).toBe(true); // Near full
      expect(isFullTimeEmployee('PART_TIME', 30)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isFullTimeEmployee('')).toBe(false);
      expect(isFullTimeEmployee(null as any)).toBe(false);
      expect(isFullTimeEmployee(undefined as any)).toBe(false);
    });
  });

  describe('calculateWorkingHours', () => {
    it('should calculate monthly working hours', () => {
      expect(calculateWorkingHours(40, 'month')).toBeCloseTo(173.2, 1); // 40 * 4.33
      expect(calculateWorkingHours(20, 'month')).toBeCloseTo(86.6, 1);  // 20 * 4.33
    });

    it('should calculate yearly working hours', () => {
      expect(calculateWorkingHours(40, 'year')).toBe(2080);
      expect(calculateWorkingHours(20, 'year')).toBe(1040);
    });

    it('should calculate weekly working hours', () => {
      expect(calculateWorkingHours(40, 'week')).toBe(40);
      expect(calculateWorkingHours(20, 'week')).toBe(20);
    });

    it('should calculate daily working hours', () => {
      expect(calculateWorkingHours(40, 'day')).toBe(8);
      expect(calculateWorkingHours(20, 'day')).toBe(4);
      expect(calculateWorkingHours(30, 'day')).toBe(6);
    });

    it('should handle edge cases', () => {
      expect(calculateWorkingHours(0, 'month')).toBe(0);
      expect(calculateWorkingHours(-10, 'month')).toBe(0);
      expect(calculateWorkingHours(40, 'unknown' as any)).toBe(40);
    });

    it('should handle fractional hours', () => {
      expect(calculateWorkingHours(37.5, 'day')).toBe(7.5);
      expect(calculateWorkingHours(38.5, 'week')).toBe(38.5);
    });
  });

  describe('integration tests', () => {
    it('should work together for employee calculations', () => {
      const employeeType = 'PART_TIME';
      const weeklyHours = 20;
      
      const label = getEmploymentTypeLabel(employeeType);
      const vacationDays = calculateVacationDays(employeeType, weeklyHours);
      const monthlyHours = calculateWorkingHours(weeklyHours, 'month');
      const isFullTime = isFullTimeEmployee(employeeType, weeklyHours);
      
      expect(label).toBe('Teilzeit');
      expect(vacationDays).toBe(15);
      expect(monthlyHours).toBeCloseTo(86.6, 1);
      expect(isFullTime).toBe(false);
    });

    it('should handle full employee data processing', () => {
      const employee = {
        employeeNumber: '123',
        employmentType: 'FULL_TIME' as const,
        employmentStatus: 'ACTIVE' as const,
        weeklyHours: 40
      };
      
      const formattedNumber = formatEmployeeNumber(employee.employeeNumber);
      const typeLabel = getEmploymentTypeLabel(employee.employmentType);
      const statusLabel = getEmploymentStatusLabel(employee.employmentStatus);
      const vacation = calculateVacationDays(employee.employmentType, employee.weeklyHours);
      
      expect(formattedNumber).toBe('PN-00123');
      expect(typeLabel).toBe('Vollzeit');
      expect(statusLabel).toBe('Aktiv');
      expect(vacation).toBe(30);
    });
  });
});