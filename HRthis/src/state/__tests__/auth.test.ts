import { User } from '../../types';
import { useAuthStore, getAuthToken } from '../auth';

// Mock the pipeline annotations to avoid errors in tests
jest.mock('../../pipeline/annotations', () => ({
  RequiredStep: () => () => {},
  markStepExecuted: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Auth Store', () => {
  beforeEach(() => {
    // Force demo mode for tests
    delete process.env.REACT_APP_API_URL;
    
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      cachedEmployees: null,
    });
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials in demo mode', async () => {
      const { login } = useAuthStore.getState();
      
      await login('anna.admin@hrthis.de', 'demo');
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeDefined();
      expect(state.user?.email).toBe('anna.admin@hrthis.de');
      expect(state.user?.role).toBe('ADMIN');
      expect(state.organization).toBeDefined();
    });

    it('should fail login with invalid credentials', async () => {
      const { login } = useAuthStore.getState();
      
      await expect(login('invalid@email.com', 'wrongpassword')).rejects.toThrow('Ungültige Anmeldedaten');
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it('should set loading state during login', async () => {
      const { login } = useAuthStore.getState();
      
      const loginPromise = login('anna.admin@hrthis.de', 'demo');
      
      // Check loading state immediately
      const loadingState = useAuthStore.getState();
      expect(loadingState.isLoading).toBe(true);
      
      await loginPromise;
      
      const finalState = useAuthStore.getState();
      expect(finalState.isLoading).toBe(false);
    });

    it('should handle API login when REACT_APP_API_URL is set', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      const mockResponse = {
        user: {
          id: 'test-user',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'EMPLOYEE',
          organization_id: 'org1'
        },
        access_token: 'test-token-123'
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const { login } = useAuthStore.getState();
      await login('test@example.com', 'password');
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('test-token-123');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8002/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
      );
      
      // Clean up
      delete process.env.REACT_APP_API_URL;
    });

    it('should handle API login failure', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' })
      });
      
      const { login } = useAuthStore.getState();
      
      await expect(login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      
      // Clean up
      delete process.env.REACT_APP_API_URL;
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', async () => {
      // First login
      const { login, logout } = useAuthStore.getState();
      await login('anna.admin@hrthis.de', 'demo');
      
      // Verify logged in
      let state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeDefined();
      
      // Logout
      logout();
      
      // Verify logged out
      state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.organization).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe('getAuthToken', () => {
    it('should return null when not authenticated', () => {
      const token = getAuthToken();
      expect(token).toBeNull();
    });

    it('should return token when authenticated with API', async () => {
      process.env.REACT_APP_API_URL = 'http://localhost:8002';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: 'test', email: 'test@example.com', role: 'EMPLOYEE' },
          access_token: 'test-token-456'
        })
      });
      
      const { login } = useAuthStore.getState();
      await login('test@example.com', 'password');
      
      const token = getAuthToken();
      expect(token).toBe('test-token-456');
      
      // Clean up
      delete process.env.REACT_APP_API_URL;
    });
  });

  describe('createUser', () => {
    beforeEach(async () => {
      // Login as admin
      const { login } = useAuthStore.getState();
      await login('anna.admin@hrthis.de', 'demo');
    });

    it('should create a new user with required fields', async () => {
      const { createUser } = useAuthStore.getState();
      
      const newUserData = {
        email: 'new.user@hrthis.de',
        firstName: 'New',
        lastName: 'User',
        role: 'EMPLOYEE' as const,
        organizationId: 'org1',
        position: 'Developer',
        department: 'IT'
      };
      
      const newUser = await createUser(newUserData);
      
      expect(newUser).toBeDefined();
      expect(newUser.email).toBe('new.user@hrthis.de');
      expect(newUser.firstName).toBe('New');
      expect(newUser.lastName).toBe('User');
      expect(newUser.role).toBe('EMPLOYEE');
      expect(newUser.id).toBeDefined();
    });

    it('should set default values for optional fields', async () => {
      const { createUser } = useAuthStore.getState();
      
      const minimalUserData = {
        email: 'minimal@hrthis.de',
        firstName: 'Min',
        lastName: 'User'
      };
      
      const newUser = await createUser(minimalUserData);
      
      expect(newUser.role).toBe('EMPLOYEE'); // Default role
      expect(newUser.weeklyHours).toBe(40); // Default hours
      expect(newUser.employmentType).toBe('FULL_TIME'); // Default type
      expect(newUser.vacationDays).toBe(30); // Default vacation
      expect(newUser.coinWallet).toBe(0); // Default coins
      expect(newUser.level).toBe(1); // Default level
    });

    it('should generate unique IDs for new users', async () => {
      const { createUser } = useAuthStore.getState();
      
      const user1 = await createUser({ email: 'user1@hrthis.de' });
      const user2 = await createUser({ email: 'user2@hrthis.de' });
      
      expect(user1.id).toBeDefined();
      expect(user2.id).toBeDefined();
      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('updateUser', () => {
    beforeEach(async () => {
      const { login } = useAuthStore.getState();
      await login('anna.admin@hrthis.de', 'demo');
    });

    it('should update user data', async () => {
      const { updateUser, getAllUsers } = useAuthStore.getState();
      
      // Get existing user
      const users = getAllUsers();
      const userToUpdate = users.find(u => u.email === 'max.mustermann@hrthis.de');
      expect(userToUpdate).toBeDefined();
      
      // Update user
      await updateUser(userToUpdate!.id, {
        position: 'Senior Developer',
        department: 'Engineering'
      });
      
      // Verify update
      const updatedUsers = getAllUsers();
      const updatedUser = updatedUsers.find(u => u.id === userToUpdate!.id);
      expect(updatedUser?.position).toBe('Senior Developer');
      expect(updatedUser?.department).toBe('Engineering');
    });

    it('should update current user if updating self', async () => {
      const { updateUser, user } = useAuthStore.getState();
      
      expect(user).toBeDefined();
      const currentUserId = user!.id;
      
      await updateUser(currentUserId, {
        position: 'HR Director'
      });
      
      const updatedState = useAuthStore.getState();
      expect(updatedState.user?.position).toBe('HR Director');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users after login', async () => {
      const { login, getAllUsers } = useAuthStore.getState();
      await login('anna.admin@hrthis.de', 'demo');
      
      const users = getAllUsers();
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      expect(users.some(u => u.email === 'anna.admin@hrthis.de')).toBe(true);
      expect(users.some(u => u.email === 'max.mustermann@hrthis.de')).toBe(true);
    });
  });

  describe('loadEmployees', () => {
    it('should load and cache employees', async () => {
      const { login, loadEmployees } = useAuthStore.getState();
      await login('anna.admin@hrthis.de', 'demo');
      
      const employees = await loadEmployees();
      
      expect(Array.isArray(employees)).toBe(true);
      expect(employees.length).toBeGreaterThan(0);
      
      // Check if cached
      const state = useAuthStore.getState();
      expect(state.cachedEmployees).toEqual(employees);
    });

    it('should return cached employees on subsequent calls', async () => {
      const { login, loadEmployees } = useAuthStore.getState();
      await login('anna.admin@hrthis.de', 'demo');
      
      // First call
      const employees1 = await loadEmployees();
      
      // Second call should return cached
      const employees2 = await loadEmployees();
      
      expect(employees1).toEqual(employees2);
      expect(employees1).toBe(employees2); // Same reference
    });
  });

  describe('persistence', () => {
    it('should persist auth state to localStorage', async () => {
      const { login } = useAuthStore.getState();
      await login('anna.admin@hrthis.de', 'demo');
      
      // Check localStorage
      const persistedData = localStorage.getItem('auth-storage');
      expect(persistedData).toBeDefined();
      
      const parsed = JSON.parse(persistedData!);
      expect(parsed.state.isAuthenticated).toBe(true);
      expect(parsed.state.user.email).toBe('anna.admin@hrthis.de');
    });

    it('should restore auth state from localStorage', async () => {
      // Set up localStorage
      const authData = {
        state: {
          user: { id: 'test', email: 'test@example.com', role: 'ADMIN' },
          organization: { id: 'org1', name: 'Test Org' },
          isAuthenticated: true,
          token: 'stored-token'
        }
      };
      localStorage.setItem('auth-storage', JSON.stringify(authData));
      
      // Create new store instance (simulates page reload)
      const { user, isAuthenticated, token } = useAuthStore.getState();
      
      // Note: In a real scenario, the store would be rehydrated on mount
      // For testing, we need to manually trigger rehydration
      useAuthStore.persist.rehydrate();
      
      // Wait for rehydration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const rehydratedState = useAuthStore.getState();
      expect(rehydratedState.isAuthenticated).toBe(true);
      expect(rehydratedState.user?.email).toBe('test@example.com');
      expect(rehydratedState.token).toBe('stored-token');
    });
  });
});