import { renderHook, act } from '@testing-library/react';
import { useEmployeeStore } from '../employees';
import apiClient from '../../api/api-client';

// Mock API client
jest.mock('../../api/api-client');

describe('Employee Store', () => {
  const mockEmployees = [
    {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      employeeNumber: 'PN-12345',
      position: 'Developer',
      department: 'IT',
      employmentStatus: 'ACTIVE',
      role: 'EMPLOYEE',
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      name: 'Jane Smith',
      employeeNumber: 'PN-12346',
      position: 'Manager',
      department: 'HR',
      employmentStatus: 'ACTIVE',
      role: 'ADMIN',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    const { result } = renderHook(() => useEmployeeStore());
    act(() => {
      result.current.setEmployees([]);
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useEmployeeStore());

      expect(result.current.employees).toEqual([]);
      expect(result.current.selectedEmployee).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.filters).toEqual({
        search: '',
        department: null,
        employmentStatus: null,
        employmentType: null,
      });
    });
  });

  describe('Employee Management', () => {
    it('should set employees', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      expect(result.current.employees).toEqual(mockEmployees);
    });

    it('should add employee', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees([mockEmployees[0]]);
      });

      const newEmployee = {
        id: '3',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'Employee',
        name: 'New Employee',
        employeeNumber: 'PN-12347',
        position: 'Junior Dev',
        department: 'IT',
        employmentStatus: 'ACTIVE',
        role: 'EMPLOYEE',
      };

      act(() => {
        result.current.addEmployee(newEmployee);
      });

      expect(result.current.employees).toHaveLength(2);
      expect(result.current.employees[1]).toEqual(newEmployee);
    });

    it('should update employee', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      const updates = { position: 'Senior Developer' };

      act(() => {
        result.current.updateEmployee('1', updates);
      });

      expect(result.current.employees[0].position).toBe('Senior Developer');
      expect(result.current.employees[1].position).toBe('Manager'); // Unchanged
    });

    it('should delete employee', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      act(() => {
        result.current.deleteEmployee('1');
      });

      expect(result.current.employees).toHaveLength(1);
      expect(result.current.employees[0].id).toBe('2');
    });

    it('should select employee', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
        result.current.setSelectedEmployee(mockEmployees[0]);
      });

      expect(result.current.selectedEmployee).toEqual(mockEmployees[0]);
    });

    it('should clear selected employee', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
        result.current.setSelectedEmployee(mockEmployees[0]);
      });

      expect(result.current.selectedEmployee).toEqual(mockEmployees[0]);

      act(() => {
        result.current.clearSelectedEmployee();
      });

      expect(result.current.selectedEmployee).toBeNull();
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useEmployeeStore());
      act(() => {
        result.current.setEmployees(mockEmployees);
      });
    });

    it('should filter by search term', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setFilters({ search: 'John' });
      });

      expect(result.current.filters.search).toBe('John');
      
      const filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].firstName).toBe('John');
    });

    it('should filter by department', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setFilters({ department: 'IT' });
      });

      const filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].department).toBe('IT');
    });

    it('should filter by employment status', () => {
      const employeesWithStatus = [
        { ...mockEmployees[0], employmentStatus: 'ACTIVE' },
        { ...mockEmployees[1], employmentStatus: 'ACTIVE' },
        {
          id: '3',
          email: 'inactive@example.com',
          firstName: 'Inactive',
          lastName: 'User',
          name: 'Inactive User',
          employeeNumber: 'PN-12347',
          position: 'Former',
          department: 'IT',
          employmentStatus: 'INACTIVE',
          role: 'EMPLOYEE',
        },
      ];

      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(employeesWithStatus);
        result.current.setFilters({ employmentStatus: 'ACTIVE' });
      });

      const filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(e => e.employmentStatus === 'ACTIVE')).toBe(true);
    });

    it('should filter by employment type', () => {
      const employeesWithTypes = mockEmployees.map((emp, i) => ({
        ...emp,
        employmentType: i === 0 ? 'FULL_TIME' : 'PART_TIME',
      }));

      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(employeesWithTypes);
        result.current.setFilters({ employmentType: 'FULL_TIME' });
      });

      const filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].employmentType).toBe('FULL_TIME');
    });

    it('should apply multiple filters', () => {
      const { result } = renderHook(() => useEmployeeStore());

      const employeesWithStatus = mockEmployees.map(emp => ({
        ...emp,
        employmentStatus: 'ACTIVE' as const,
      }));

      act(() => {
        result.current.setEmployees(employeesWithStatus);
        result.current.setFilters({
          search: 'John',
          department: 'IT',
          employmentStatus: 'ACTIVE',
        });
      });

      const filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].firstName).toBe('John');
      expect(filtered[0].department).toBe('IT');
    });

    it('should clear filters', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setFilters({
          search: 'John',
          department: 'IT',
        });
      });

      expect(result.current.filters.search).toBe('John');

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({
        search: '',
        department: null,
        employmentStatus: null,
        employmentType: null,
      });

      const filtered = result.current.getFilteredEmployees();
      expect(filtered).toEqual(mockEmployees);
    });

    it('should be case-insensitive for search', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setFilters({ search: 'JOHN' });
      });

      const filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].firstName).toBe('John');
    });

    it('should search across multiple fields', () => {
      const { result } = renderHook(() => useEmployeeStore());

      // Search by email
      act(() => {
        result.current.setFilters({ search: 'doe@example' });
      });

      let filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].email).toContain('doe@example');

      // Search by employee number
      act(() => {
        result.current.setFilters({ search: 'PN-12345' });
      });

      filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].employeeNumber).toBe('PN-12345');

      // Search by position
      act(() => {
        result.current.setFilters({ search: 'Developer' });
      });

      filtered = result.current.getFilteredEmployees();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].position).toBe('Developer');
    });
  });

  describe('Statistics', () => {
    it('should calculate employee statistics', () => {
      const employeesWithData = [
        ...mockEmployees,
        {
          id: '3',
          email: 'part@example.com',
          firstName: 'Part',
          lastName: 'Timer',
          name: 'Part Timer',
          employeeNumber: 'PN-12347',
          position: 'Assistant',
          department: 'Sales',
          employmentStatus: 'ACTIVE',
          employmentType: 'PART_TIME',
          role: 'EMPLOYEE',
        },
        {
          id: '4',
          email: 'inactive@example.com',
          firstName: 'Inactive',
          lastName: 'User',
          name: 'Inactive User',
          employeeNumber: 'PN-12348',
          position: 'Former',
          department: 'IT',
          employmentStatus: 'INACTIVE',
          employmentType: 'FULL_TIME',
          role: 'EMPLOYEE',
        },
      ];

      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(employeesWithData);
      });

      const stats = result.current.getStatistics();

      expect(stats.total).toBe(4);
      expect(stats.active).toBe(3);
      expect(stats.inactive).toBe(1);
      expect(stats.byDepartment['IT']).toBe(2);
      expect(stats.byDepartment['HR']).toBe(1);
      expect(stats.byDepartment['Sales']).toBe(1);
      expect(stats.byEmploymentType['FULL_TIME']).toBe(1); // Only counting those with explicit type
      expect(stats.byEmploymentType['PART_TIME']).toBe(1);
    });

    it('should handle empty employee list', () => {
      const { result } = renderHook(() => useEmployeeStore());

      const stats = result.current.getStatistics();

      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.inactive).toBe(0);
      expect(stats.byDepartment).toEqual({});
      expect(stats.byEmploymentType).toEqual({});
    });
  });

  describe('Sorting', () => {
    it('should sort employees by name', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      const sorted = result.current.getSortedEmployees('name', 'asc');
      expect(sorted[0].name).toBe('Jane Smith');
      expect(sorted[1].name).toBe('John Doe');

      const sortedDesc = result.current.getSortedEmployees('name', 'desc');
      expect(sortedDesc[0].name).toBe('John Doe');
      expect(sortedDesc[1].name).toBe('Jane Smith');
    });

    it('should sort employees by department', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      const sorted = result.current.getSortedEmployees('department', 'asc');
      expect(sorted[0].department).toBe('HR');
      expect(sorted[1].department).toBe('IT');
    });

    it('should sort employees by employee number', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      const sorted = result.current.getSortedEmployees('employeeNumber', 'asc');
      expect(sorted[0].employeeNumber).toBe('PN-12345');
      expect(sorted[1].employeeNumber).toBe('PN-12346');
    });
  });

  describe('Loading and Error States', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useEmployeeStore());

      const errorMessage = 'Failed to load employees';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Async Operations', () => {
    it('should load employees from API', async () => {
      const { result } = renderHook(() => useEmployeeStore());

      (apiClient.employees.getAll as jest.Mock).mockResolvedValue(mockEmployees);

      await act(async () => {
        await result.current.loadEmployees('test-token');
      });

      expect(apiClient.employees.getAll).toHaveBeenCalledWith('test-token');
      expect(result.current.employees).toEqual(mockEmployees);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle API errors when loading', async () => {
      const { result } = renderHook(() => useEmployeeStore());

      const errorMessage = 'Network error';
      (apiClient.employees.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await act(async () => {
        try {
          await result.current.loadEmployees('test-token');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });

    it('should create employee via API', async () => {
      const { result } = renderHook(() => useEmployeeStore());

      const newEmployee = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'Employee',
      };

      const createdEmployee = {
        id: '3',
        ...newEmployee,
        name: 'New Employee',
      };

      (apiClient.employees.create as jest.Mock).mockResolvedValue(createdEmployee);

      await act(async () => {
        const created = await result.current.createEmployee(newEmployee, 'test-token');
        expect(created).toEqual(createdEmployee);
      });

      expect(apiClient.employees.create).toHaveBeenCalledWith(newEmployee, 'test-token');
      expect(result.current.employees).toContainEqual(createdEmployee);
    });

    it('should update employee via API', async () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      const updates = { position: 'Senior Developer' };
      const updatedEmployee = { ...mockEmployees[0], ...updates };

      (apiClient.employees.update as jest.Mock).mockResolvedValue(updatedEmployee);

      await act(async () => {
        await result.current.updateEmployeeAsync('1', updates, 'test-token');
      });

      expect(apiClient.employees.update).toHaveBeenCalledWith('1', updates, 'test-token');
      expect(result.current.employees[0].position).toBe('Senior Developer');
    });

    it('should delete employee via API', async () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      (apiClient.employees.delete as jest.Mock).mockResolvedValue({});

      await act(async () => {
        await result.current.deleteEmployeeAsync('1', 'test-token');
      });

      expect(apiClient.employees.delete).toHaveBeenCalledWith('1', 'test-token');
      expect(result.current.employees).toHaveLength(1);
      expect(result.current.employees[0].id).toBe('2');
    });
  });

  describe('Utility Functions', () => {
    it('should get employee by ID', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      const employee = result.current.getEmployeeById('1');
      expect(employee).toEqual(mockEmployees[0]);

      const notFound = result.current.getEmployeeById('999');
      expect(notFound).toBeUndefined();
    });

    it('should get departments list', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      const departments = result.current.getDepartments();
      expect(departments).toEqual(['HR', 'IT']);
    });

    it('should check if employee exists', () => {
      const { result } = renderHook(() => useEmployeeStore());

      act(() => {
        result.current.setEmployees(mockEmployees);
      });

      expect(result.current.hasEmployee('1')).toBe(true);
      expect(result.current.hasEmployee('999')).toBe(false);
    });
  });
});