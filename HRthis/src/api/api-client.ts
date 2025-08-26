/**
 * Central API client for HRthis Frontend-Backend communication
 * Handles environment-based API switching between mock data and real backend
 */

import { User } from '../types';

// API configuration
const getApiBaseUrl = () => process.env.REACT_APP_API_URL;
const isRealApiEnabled = () => Boolean(getApiBaseUrl() && getApiBaseUrl()!.trim() !== '');

// API endpoints (base path is already included in API_BASE_URL)
const ENDPOINTS = {
  employees: '/api/employees',
  auth: '/api/auth',
  login: '/api/auth/login',
} as const;

/**
 * Generic API request handler
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!isRealApiEnabled()) {
    throw new Error('API_URL not configured - falling back to mock data');
  }
  
  const API_BASE_URL = getApiBaseUrl();

  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    try {
      const err = await response.json();
      if (err?.message) {
        throw new Error(err.message);
      }
    } catch {
      // ignore parse errors
    }
    // Tailor fallback error: login vs generic API
    const status = (response as any)?.status ?? 0;
    const statusText = (response as any)?.statusText ?? 'Error';
    if (endpoint.includes('/api/auth/login')) {
      throw new Error('Invalid credentials');
    }
    throw new Error(`API request failed: ${status} ${statusText}`);
  }

  return response.json();
}

/**
 * Authentication API calls
 */
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    });
  },

  getCurrentUser: async (token: string) => {
    return apiRequest('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  refreshToken: async (token: string) => {
    return apiRequest('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

/**
 * Employee API calls
 */
export const employeesAPI = {
  getAll: async (token?: string): Promise<User[]> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return apiRequest<User[]>(ENDPOINTS.employees, {
      headers,
    });
  },

  // Compatibility alias for older tests expecting `employees.list`
  list: async (token?: string): Promise<User[]> => {
    return employeesAPI.getAll(token);
  },

  getById: async (id: string, token?: string): Promise<User> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return apiRequest<User>(`${ENDPOINTS.employees}/${id}`, {
      headers,
    });
  },

  create: async (userData: Partial<User>, token?: string): Promise<User> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return apiRequest<User>(ENDPOINTS.employees, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, userData: Partial<User>, token?: string): Promise<User> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return apiRequest<User>(`${ENDPOINTS.employees}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string, token?: string): Promise<void> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return apiRequest<void>(`${ENDPOINTS.employees}/${id}`, {
      method: 'DELETE',
      headers,
    });
  },
};

/**
 * Utility functions
 */
export const apiUtils = {
  isRealAPIEnabled: () => isRealApiEnabled(),
  getBaseURL: () => getApiBaseUrl(),
  
  // Transform backend user data to frontend User type
  transformBackendUser: (backendUser: any): User => {
    return {
      id: backendUser.id || backendUser.employee_id,
      email: backendUser.email,
      name: `${backendUser.first_name || ''} ${backendUser.last_name || ''}`.trim(),
      firstName: backendUser.first_name || '',
      lastName: backendUser.last_name || '',
      employeeNumber: backendUser.employee_number || backendUser.employeeNumber || '',
      role: backendUser.role || 'EMPLOYEE',
      organizationId: backendUser.organization_id || 'org1',
      position: backendUser.position || '',
      department: backendUser.department || '',
      weeklyHours: backendUser.weekly_hours || 40,
      employmentType: backendUser.employment_type || 'FULL_TIME',
      joinDate: backendUser.join_date || new Date().toISOString().split('T')[0],
      employmentStatus: backendUser.employment_status || 'ACTIVE',
      vacationDays: backendUser.vacation_days || 30,
      coinWallet: backendUser.coin_wallet || 0,
      coinProgress: backendUser.coin_progress || 0,
      level: backendUser.level || 1,
      teamIds: backendUser.team_ids || [],
      primaryTeamId: backendUser.primary_team_id,
      address: backendUser.address,
      phone: backendUser.phone,
      birthDate: backendUser.birth_date,
      bankDetails: backendUser.bank_details,
      clothingSizes: backendUser.clothing_sizes,
    };
  },
};

export default {
  auth: authAPI,
  employees: employeesAPI,
  utils: apiUtils,
};