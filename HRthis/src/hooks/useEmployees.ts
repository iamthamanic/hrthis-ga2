/**
 * Custom hook for managing employee data
 * Automatically switches between API and mock data based on environment
 */

import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { useAuthStore } from '../state/auth';
import { apiUtils } from '../api/api-client';

interface UseEmployeesReturn {
  employees: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isUsingRealAPI: boolean;
}

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { loadEmployees, getAllUsers } = useAuthStore();
  const isUsingRealAPI = apiUtils.isRealAPIEnabled();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isUsingRealAPI) {
        // Load from API
        const data = await loadEmployees();
        setEmployees(data);
      } else {
        // Load from mock data
        const mockData = getAllUsers();
        setEmployees(mockData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load employees';
      setError(errorMessage);
      console.error('Error loading employees:', err);
      
      // Fallback to mock data on error
      if (isUsingRealAPI) {
        const mockData = getAllUsers();
        setEmployees(mockData);
      }
    } finally {
      setLoading(false);
    }
  }, [loadEmployees, getAllUsers, isUsingRealAPI]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
    isUsingRealAPI,
  };
};

export default useEmployees;