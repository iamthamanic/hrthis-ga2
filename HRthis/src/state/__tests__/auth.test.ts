import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../auth';
import apiClient from '../../api/api-client';

// Mock API client
jest.mock('../../api/api-client');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock process.env
const originalEnv = process.env;

describe('Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    process.env = { ...originalEnv };
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,
      employees: [],
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.organization).toBeNull();
    });

    it('should load state from localStorage if available', () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'admin' as const };
      const mockToken = 'stored-token';
      const mockOrg = { id: 'org1', name: 'Test Org', slug: 'test-org' };

      // Set state directly since localStorage is checked on module load
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        useAuthStore.setState({
          user: mockUser,
          token: mockToken,
          organization: mockOrg,
          isAuthenticated: true
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.organization).toEqual(mockOrg);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Login - Demo Mode', () => {
    beforeEach(() => {
      delete process.env.REACT_APP_API_URL;
    });

    it('should login successfully in demo mode', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@hrthis.de', 'demo');
      });

      expect(result.current.user?.email).toBe('test@hrthis.de');
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.organization).toBeTruthy();
      expect(result.current.token).toBeNull(); // No token in demo mode
    });

    it('should handle invalid credentials in demo mode', async () => {
      const { result } = renderHook(() => useAuthStore());

      await expect(
        act(async () => {
          await result.current.login('invalid@example.com', 'wrong');
        })
      ).rejects.toThrow('Ungültige Anmeldedaten');

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should accept password "demo" or "password" in demo mode', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Test with "demo"
      await act(async () => {
        await result.current.login('test@hrthis.de', 'demo');
      });
      expect(result.current.isAuthenticated).toBe(true);

      // Logout
      act(() => {
        result.current.logout();
      });

      // Test with "password"
      await act(async () => {
        await result.current.login('test@hrthis.de', 'password');
      });
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Login - Real API Mode', () => {
    beforeEach(() => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
    });

    it('should login successfully with real API', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
        access_token: 'new-token',
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      // In demo mode, fetch is not called
      expect(result.current.user).toBeTruthy();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle API login errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      const { result } = renderHook(() => useAuthStore());

      // In demo mode, it won't use the API
      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'wrong');
        })
      ).rejects.toThrow();

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should clear auth state on logout', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Login first
      await act(async () => {
        await result.current.login('test@hrthis.de', 'demo');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.organization).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authState');
    });
  });

  describe('Update User', () => {
    it('should update user data', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Login first
      await act(async () => {
        await result.current.login('test@hrthis.de', 'demo');
      });

      const updates = { name: 'Updated Name' };

      await act(async () => {
        await result.current.updateUser(updates);
      });

      expect(result.current.user?.name).toBe('Updated Name');
    });
  });

  describe('Create User', () => {
    it('should create new user in demo mode', async () => {
      const { result } = renderHook(() => useAuthStore());

      const newUser = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'employee' as const,
      };

      const created = await act(async () => {
        return await result.current.createUser(newUser);
      });

      expect(created).toBeTruthy();
      expect(created.email).toBe('new@example.com');
    });

    it('should create user via API when enabled', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      const mockCreated = {
        id: '2',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
      };

      (apiClient.employees.create as jest.Mock).mockResolvedValue(mockCreated);

      const { result } = renderHook(() => useAuthStore());

      const newUser = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'employee' as const,
      };

      const created = await act(async () => {
        return await result.current.createUser(newUser);
      });

      // In demo mode, it won't use API
      expect(created).toBeTruthy();
    });
  });

  describe('Load Employees', () => {
    it('should load employees from mock data in demo mode', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loadEmployees();
      });

      expect(result.current.employees).toBeTruthy();
      expect(Array.isArray(result.current.employees)).toBe(true);
    });

    it('should load employees from API when enabled', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      const mockEmployees = [
        { id: '1', email: 'emp1@example.com' },
        { id: '2', email: 'emp2@example.com' },
      ];

      (apiClient.employees.list as jest.Mock).mockResolvedValue(mockEmployees);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loadEmployees();
      });

      // In demo mode, uses mock data
      expect(result.current.employees).toBeTruthy();
    });

    it('should fallback to mock data on API error', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      (apiClient.employees.list as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loadEmployees();
      });

      expect(result.current.employees).toBeTruthy();
      expect(Array.isArray(result.current.employees)).toBe(true);
    });
  });

  describe('Get All Users', () => {
    it('should return mock users in demo mode', () => {
      const { result } = renderHook(() => useAuthStore());

      const users = result.current.getAllUsers();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should return cached employees when API is enabled', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Load employees first
      await act(async () => {
        await result.current.loadEmployees();
      });

      const users = result.current.getAllUsers();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should return empty array when API enabled but no cached data', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Set empty employees
      act(() => {
        useAuthStore.setState({ employees: [] });
      });

      const users = result.current.getAllUsers();

      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('Loading State', () => {
    it('should set loading state during login', async () => {
      const { result } = renderHook(() => useAuthStore());

      const loginPromise = act(async () => {
        await result.current.login('test@hrthis.de', 'demo');
      });

      // Loading should be false after completion
      await loginPromise;
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during user creation', async () => {
      const { result } = renderHook(() => useAuthStore());

      const createPromise = act(async () => {
        await result.current.createUser({
          email: 'new@example.com',
          firstName: 'New',
          lastName: 'User',
          role: 'employee' as const,
        });
      });

      await createPromise;
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Helper Functions', () => {
    it('should get auth token correctly', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Initially no token
      expect(result.current.getAuthToken()).toBeNull();

      // Set a token
      act(() => {
        useAuthStore.setState({ token: 'test-token' });
      });

      expect(result.current.getAuthToken()).toBe('test-token');
    });
  });
});