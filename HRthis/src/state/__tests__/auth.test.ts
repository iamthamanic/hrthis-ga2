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
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
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
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockToken = 'stored-token';
      const mockOrg = { id: 'org1', name: 'Test Org', slug: 'test-org' };
      
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'auth-storage') {
          return JSON.stringify({
            state: {
              user: mockUser,
              token: mockToken,
              organization: mockOrg,
              isAuthenticated: true,
            },
            version: 0,
          });
        }
        return null;
      });

      const { result } = renderHook(() => useAuthStore());

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

      expect(result.current.user).toBeTruthy();
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

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8002/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'username=test%40example.com&password=password',
        })
      );

      expect(result.current.user).toBeTruthy();
      expect(result.current.token).toBe('new-token');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle API login errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      const { result } = renderHook(() => useAuthStore());

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'wrong');
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should clear auth state on logout', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Set initial authenticated state
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
      expect(result.current.organization).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Update User', () => {
    it('should update user data', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Login first
      await act(async () => {
        await result.current.login('test@hrthis.de', 'demo');
      });

      const userId = result.current.user?.id;
      const updates = { position: 'Senior Developer' };

      await act(async () => {
        await result.current.updateUser(userId!, updates);
      });

      expect(result.current.user?.position).toBe('Senior Developer');
    });
  });

  describe('Create User', () => {
    it('should create new user in demo mode', async () => {
      delete process.env.REACT_APP_API_URL;
      
      const { result } = renderHook(() => useAuthStore());

      const newUserData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        position: 'Developer',
      };

      let createdUser;
      await act(async () => {
        createdUser = await result.current.createUser(newUserData);
      });

      expect(createdUser).toBeTruthy();
      expect(createdUser.email).toBe('new@example.com');
      expect(createdUser.firstName).toBe('New');
      expect(createdUser.lastName).toBe('User');
    });

    it('should create user via API when enabled', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      const mockResponse = {
        id: '123',
        email: 'new@example.com',
        first_name: 'New',
        last_name: 'User',
      };

      (apiClient.employees.create as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      // Set token for API calls
      act(() => {
        result.current.token = 'test-token';
      });

      const newUserData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
      };

      let createdUser;
      await act(async () => {
        createdUser = await result.current.createUser(newUserData);
      });

      expect(apiClient.employees.create).toHaveBeenCalledWith(newUserData, 'test-token');
      expect(createdUser).toBeTruthy();
    });
  });

  describe('Load Employees', () => {
    it('should load employees from mock data in demo mode', async () => {
      delete process.env.REACT_APP_API_URL;
      
      const { result } = renderHook(() => useAuthStore());

      let employees;
      await act(async () => {
        employees = await result.current.loadEmployees();
      });

      expect(employees).toBeTruthy();
      expect(Array.isArray(employees)).toBe(true);
      expect(employees.length).toBeGreaterThan(0);
      expect(result.current.cachedEmployees).toEqual(employees);
    });

    it('should load employees from API when enabled', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      const mockEmployees = [
        { id: '1', email: 'emp1@test.com' },
        { id: '2', email: 'emp2@test.com' },
      ];

      (apiClient.employees.getAll as jest.Mock).mockResolvedValue(mockEmployees);

      const { result } = renderHook(() => useAuthStore());

      // Set token for API calls
      act(() => {
        result.current.token = 'test-token';
      });

      let employees;
      await act(async () => {
        employees = await result.current.loadEmployees();
      });

      expect(apiClient.employees.getAll).toHaveBeenCalledWith('test-token');
      expect(employees).toEqual(mockEmployees);
      expect(result.current.cachedEmployees).toEqual(mockEmployees);
    });

    it('should fallback to mock data on API error', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      (apiClient.employees.getAll as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

      const { result } = renderHook(() => useAuthStore());

      let employees;
      await act(async () => {
        employees = await result.current.loadEmployees();
      });

      expect(employees).toBeTruthy();
      expect(Array.isArray(employees)).toBe(true);
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load employees'),
        expect.any(Error)
      );

      consoleWarn.mockRestore();
    });
  });

  describe('Get All Users', () => {
    it('should return mock users in demo mode', () => {
      delete process.env.REACT_APP_API_URL;
      
      const { result } = renderHook(() => useAuthStore());

      const users = result.current.getAllUsers();

      expect(users).toBeTruthy();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should return cached employees when API is enabled', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      const mockEmployees = [
        { id: '1', email: 'emp1@test.com' },
        { id: '2', email: 'emp2@test.com' },
      ];

      (apiClient.employees.getAll as jest.Mock).mockResolvedValue(mockEmployees);

      const { result } = renderHook(() => useAuthStore());

      // Load employees first
      await act(async () => {
        await result.current.loadEmployees();
      });

      const users = result.current.getAllUsers();
      expect(users).toEqual(mockEmployees);
    });

    it('should return empty array when API enabled but no cached data', () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      const { result } = renderHook(() => useAuthStore());

      const users = result.current.getAllUsers();
      expect(users).toEqual([]);
    });
  });

  describe('Loading State', () => {
    it('should set loading state during login', async () => {
      delete process.env.REACT_APP_API_URL;
      
      const { result } = renderHook(() => useAuthStore());

      const loginPromise = act(async () => {
        await result.current.login('test@hrthis.de', 'demo');
      });

      // Check loading state immediately after starting login
      expect(result.current.isLoading).toBe(true);

      await loginPromise;

      // Loading should be false after completion
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during user creation', async () => {
      delete process.env.REACT_APP_API_URL;
      
      const { result } = renderHook(() => useAuthStore());

      const createPromise = act(async () => {
        await result.current.createUser({ email: 'new@example.com' });
      });

      expect(result.current.isLoading).toBe(true);

      await createPromise;

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Helper Functions', () => {
    it('should get auth token correctly', async () => {
      const { getAuthToken } = require('../auth');
      
      const { result } = renderHook(() => useAuthStore());

      // Initially no token
      expect(getAuthToken()).toBeNull();

      // Set token
      act(() => {
        result.current.token = 'test-token';
      });

      expect(getAuthToken()).toBe('test-token');
    });
  });
});