import { create } from 'zustand';
import { User } from '../types';
import apiClient from '../api/api-client';

interface EmployeeFilters {
  search: string;
  department: string | null;
  employmentStatus: string | null;
  employmentType: string | null;
}

interface EmployeeStore {
  employees: User[];
  selectedEmployee: User | null;
  isLoading: boolean;
  error: string | null;
  filters: EmployeeFilters;
  
  // Actions
  setEmployees: (employees: User[]) => void;
  addEmployee: (employee: User) => void;
  updateEmployee: (id: string, updates: Partial<User>) => void;
  deleteEmployee: (id: string) => void;
  setSelectedEmployee: (employee: User | null) => void;
  clearSelectedEmployee: () => void;
  
  // Filter actions
  setFilters: (filters: Partial<EmployeeFilters>) => void;
  clearFilters: () => void;
  getFilteredEmployees: () => User[];
  
  // Statistics
  getStatistics: () => {
    total: number;
    active: number;
    inactive: number;
    byDepartment: Record<string, number>;
    byEmploymentType: Record<string, number>;
  };
  
  // Sorting
  getSortedEmployees: (sortBy: string, order: 'asc' | 'desc') => User[];
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // API operations
  loadEmployees: (token?: string) => Promise<void>;
  createEmployee: (employee: Partial<User>, token?: string) => Promise<User>;
  updateEmployeeAsync: (id: string, updates: Partial<User>, token?: string) => Promise<void>;
  deleteEmployeeAsync: (id: string, token?: string) => Promise<void>;
  
  // Utility functions
  getEmployeeById: (id: string) => User | undefined;
  getDepartments: () => string[];
  hasEmployee: (id: string) => boolean;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    department: null,
    employmentStatus: null,
    employmentType: null,
  },
  
  // Actions
  setEmployees: (employees) => set({ employees }),
  
  addEmployee: (employee) => 
    set((state) => ({ employees: [...state.employees, employee] })),
  
  updateEmployee: (id, updates) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updates } : emp
      ),
    })),
  
  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),
  
  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  clearSelectedEmployee: () => set({ selectedEmployee: null }),
  
  // Filter actions
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  
  clearFilters: () =>
    set({
      filters: {
        search: '',
        department: null,
        employmentStatus: null,
        employmentType: null,
      },
    }),
  
  getFilteredEmployees: () => {
    const state = get();
    let filtered = [...state.employees];
    
    // Search filter
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase();
      filtered = filtered.filter((emp) =>
        emp.firstName?.toLowerCase().includes(searchLower) ||
        emp.lastName?.toLowerCase().includes(searchLower) ||
        emp.email?.toLowerCase().includes(searchLower) ||
        emp.employeeNumber?.toLowerCase().includes(searchLower) ||
        emp.position?.toLowerCase().includes(searchLower)
      );
    }
    
    // Department filter
    if (state.filters.department) {
      filtered = filtered.filter(
        (emp) => emp.department === state.filters.department
      );
    }
    
    // Employment status filter
    if (state.filters.employmentStatus) {
      filtered = filtered.filter(
        (emp) => emp.employmentStatus === state.filters.employmentStatus
      );
    }
    
    // Employment type filter
    if (state.filters.employmentType) {
      filtered = filtered.filter(
        (emp) => emp.employmentType === state.filters.employmentType
      );
    }
    
    return filtered;
  },
  
  // Statistics
  getStatistics: () => {
    const state = get();
    const stats = {
      total: state.employees.length,
      active: 0,
      inactive: 0,
      byDepartment: {} as Record<string, number>,
      byEmploymentType: {} as Record<string, number>,
    };
    
    state.employees.forEach((emp) => {
      // Count by status
      if (emp.employmentStatus === 'ACTIVE') {
        stats.active++;
      } else if (emp.employmentStatus === 'INACTIVE') {
        stats.inactive++;
      }
      
      // Count by department
      if (emp.department) {
        stats.byDepartment[emp.department] = 
          (stats.byDepartment[emp.department] || 0) + 1;
      }
      
      // Count by employment type
      if (emp.employmentType) {
        stats.byEmploymentType[emp.employmentType] = 
          (stats.byEmploymentType[emp.employmentType] || 0) + 1;
      }
    });
    
    return stats;
  },
  
  // Sorting
  getSortedEmployees: (sortBy, order) => {
    const state = get();
    const sorted = [...state.employees];
    
    sorted.sort((a, b) => {
      let aValue: any = a[sortBy as keyof User];
      let bValue: any = b[sortBy as keyof User];
      
      // Handle special cases
      if (sortBy === 'name') {
        aValue = `${a.firstName} ${a.lastName}`.trim();
        bValue = `${b.firstName} ${b.lastName}`.trim();
      }
      
      // Convert to comparable values
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      // Compare
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  },
  
  // Loading states
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // API operations
  loadEmployees: async (token) => {
    const state = get();
    state.setLoading(true);
    state.clearError();
    
    try {
      const employees = await apiClient.employees.getAll(token);
      state.setEmployees(employees);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load employees';
      state.setError(message);
      throw error;
    } finally {
      state.setLoading(false);
    }
  },
  
  createEmployee: async (employee, token) => {
    const state = get();
    state.setLoading(true);
    state.clearError();
    
    try {
      const newEmployee = await apiClient.employees.create(employee, token);
      state.addEmployee(newEmployee);
      return newEmployee;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create employee';
      state.setError(message);
      throw error;
    } finally {
      state.setLoading(false);
    }
  },
  
  updateEmployeeAsync: async (id, updates, token) => {
    const state = get();
    state.setLoading(true);
    state.clearError();
    
    try {
      const updatedEmployee = await apiClient.employees.update(id, updates, token);
      state.updateEmployee(id, updatedEmployee);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update employee';
      state.setError(message);
      throw error;
    } finally {
      state.setLoading(false);
    }
  },
  
  deleteEmployeeAsync: async (id, token) => {
    const state = get();
    state.setLoading(true);
    state.clearError();
    
    try {
      await apiClient.employees.delete(id, token);
      state.deleteEmployee(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete employee';
      state.setError(message);
      throw error;
    } finally {
      state.setLoading(false);
    }
  },
  
  // Utility functions
  getEmployeeById: (id) => {
    return get().employees.find((emp) => emp.id === id);
  },
  
  getDepartments: () => {
    const state = get();
    const departments = new Set<string>();
    state.employees.forEach((emp) => {
      if (emp.department) {
        departments.add(emp.department);
      }
    });
    return Array.from(departments).sort();
  },
  
  hasEmployee: (id) => {
    return get().employees.some((emp) => emp.id === id);
  },
}));