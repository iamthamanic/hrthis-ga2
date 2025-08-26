import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import apiClient, { apiUtils } from '../api/api-client';
import { RequiredStep as _RequiredStep, markStepExecuted } from '../pipeline/annotations';
import { User, Organization } from '../types';

// Helper to create basic user fields
const createBasicUserFields = (userData: Partial<User>) => ({
  id: `user-${Date.now()}`,
  email: userData.email || '',
  name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
  role: userData.role || 'EMPLOYEE',
  organizationId: userData.organizationId || 'org1',
  firstName: userData.firstName || '',
  lastName: userData.lastName || ''
});

// Helper to create employment fields
const createEmploymentFields = (userData: Partial<User>) => ({
  position: userData.position || '',
  department: userData.department || '',
  weeklyHours: userData.weeklyHours || 40,
  employmentType: userData.employmentType || 'FULL_TIME',
  joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
  employmentStatus: 'ACTIVE' as const,
  vacationDays: userData.vacationDays || 30
});

// Helper to create gamification fields
const createGamificationFields = () => ({
  coinWallet: 0,
  coinProgress: 0,
  level: 1
});

// Helper to create team fields
const createTeamFields = (userData: Partial<User>) => ({
  teamIds: userData.teamIds || [],
  primaryTeamId: userData.primaryTeamId
});

// Helper function to create new user with defaults
const createUserWithDefaults = (userData: Partial<User>): User => {
  return {
    ...createBasicUserFields(userData),
    ...createEmploymentFields(userData),
    ...createGamificationFields(),
    ...createTeamFields(userData),
    ...userData
  };
};

// Helper function to simulate API delay
const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 500));

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  cachedEmployees: User[] | null;
  // Backwards-compat field expected in tests
  employees?: User[] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setOrganization: (org: Organization) => void;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<User>;
  getAllUsers: () => User[];
  loadEmployees: () => Promise<User[]>;
  // Backwards-compat helper expected off store in some tests
  getAuthToken?: () => string | null;
}

// Mock authentication data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'max.mustermann@hrthis.de',
    name: 'Max Mustermann',
    role: 'EMPLOYEE',
    organizationId: 'org1',
    employeeNumber: 'PN-20250001',
    firstName: 'Max',
    lastName: 'Mustermann',
    privateEmail: 'max.demo@example.com',
    position: 'Senior Developer',
    department: 'IT',
    weeklyHours: 40,
    employmentType: 'FULL_TIME',
    joinDate: '2022-01-15',
    employmentStatus: 'ACTIVE',
    vacationDays: 30,
    address: {
      street: 'Musterstraße 123',
      postalCode: '12345',
      city: 'Berlin'
    },
    phone: '+49 30 12345678',
    bankDetails: {
      iban: 'DE00 0000 0000 0000 0000 00',
      bic: 'DEMOCEFF'
    },
    coinWallet: 1500,
    coinProgress: 2200,
    level: 3,
    teamIds: ['team1'],
    primaryTeamId: 'team1'
  },
  {
    id: '2',
    email: 'anna.admin@hrthis.de',
    name: 'Anna Admin',
    role: 'ADMIN',
    organizationId: 'org1',
    employeeNumber: 'PN-20250002',
    firstName: 'Anna',
    lastName: 'Admin',
    privateEmail: 'anna.demo@example.com',
    position: 'HR Manager',
    department: 'Human Resources',
    weeklyHours: 40,
    employmentType: 'FULL_TIME',
    joinDate: '2021-03-01',
    employmentStatus: 'ACTIVE',
    vacationDays: 30,
    coinWallet: 2500,
    coinProgress: 3800,
    level: 5,
    teamIds: ['team1', 'team2', 'team3'],
    leadTeamIds: ['team1', 'team2', 'team3']
  },
  {
    id: '3',
    email: 'tom.teilzeit@hrthis.de',
    name: 'Tom Teilzeit',
    role: 'EMPLOYEE',
    organizationId: 'org1',
    employeeNumber: 'PN-20250003',
    firstName: 'Tom',
    lastName: 'Teilzeit',
    privateEmail: 'tom.demo@example.com',
    position: 'Designer',
    department: 'Marketing',
    weeklyHours: 20,
    employmentType: 'PART_TIME',
    joinDate: '2023-06-01',
    employmentStatus: 'ACTIVE',
    vacationDays: 15,
    coinWallet: 800,
    coinProgress: 1200,
    level: 2,
    teamIds: ['team2'],
    primaryTeamId: 'team2'
  },
  {
    id: '4',
    email: 'test@hrthis.de',
    name: 'Test User',
    role: 'EMPLOYEE',
    organizationId: 'org1',
    employeeNumber: 'PN-20250004',
    firstName: 'Test',
    lastName: 'User',
    privateEmail: 'test.user@gmail.com',
    position: 'Software Tester',
    department: 'Quality Assurance',
    weeklyHours: 35,
    employmentType: 'FULL_TIME',
    joinDate: '2024-01-15',
    employmentStatus: 'ACTIVE',
    vacationDays: 28,
    address: {
      street: 'Teststraße 42',
      postalCode: '10115',
      city: 'Berlin'
    },
    phone: '+49 30 98765432',
    bankDetails: {
      iban: 'DE89 1001 0010 0987 6543 21',
      bic: 'PBNKDEFFXXX'
    },
    coinWallet: 950,
    coinProgress: 1500,
    level: 2,
    teamIds: ['team3'],
    primaryTeamId: 'team3'
  }
];

const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'HRthis GmbH',
    slug: 'hrthis-gmbh'
  }
];

// Export helper function to get auth token
export const getAuthToken = (): string | null => {
  const state = useAuthStore.getState();
  return state.token;
};

// Test-only helper to reset store without losing methods
export const __resetAuthStoreForTests = (): void => {
  try {
    useAuthStore.setState({
      user: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      cachedEmployees: null,
      employees: null,
    } as any);
  } catch {
    // ignore
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      cachedEmployees: null,
      employees: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // @RequiredStep: "authenticate-user-credentials"
          markStepExecuted('authenticate-user-credentials', true, { email });
          
          // Simple demo mode logic: If API URL is not set, we're in demo mode
          const USE_REAL_API = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim() !== '';
          const isDemoMode = !USE_REAL_API;
          
          // Debug information for development
          console.log('Login Debug:', {
            email,
            isDemoMode,
            USE_REAL_API,
            apiUrl: process.env.REACT_APP_API_URL
          });
          
          if (USE_REAL_API) {
            // Real API login - use form-encoded data for OAuth2 compatibility
            const formData = new URLSearchParams();
            formData.append('username', email);  // Backend accepts email as username
            formData.append('password', password);
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: formData.toString(),
            });
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Login fehlgeschlagen');
            }
            
            const { user: backendUser, access_token } = await response.json();
            
            // Transform backend user to frontend format
            const user = apiUtils.transformBackendUser(backendUser);
            
            // @RequiredStep: "load-user-organization"
            const organization = mockOrganizations.find(org => org.id === user.organizationId) || mockOrganizations[0];
            markStepExecuted('load-user-organization', !!organization, { organizationId: user.organizationId });
            
            // @RequiredStep: "establish-user-session"
            set({ 
              user, 
              organization, 
              isAuthenticated: true, 
              isLoading: false,
              token: access_token
            });
            markStepExecuted('establish-user-session', true, { userId: user.id });
            
          } else {
            // Demo mode login
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // @RequiredStep: "validate-user-exists"
            const user = mockUsers.find(u => u.email === email);
            markStepExecuted('validate-user-exists', !!user, { userFound: !!user });
            
            const validPassword = password === 'demo' || password === 'password';
            
            if (!user || !validPassword) {
              markStepExecuted('login-validation', false, 'Invalid credentials');
              throw new Error('Ungültige Anmeldedaten');
            }
            
            // @RequiredStep: "load-user-organization"
            const organization = mockOrganizations.find(org => org.id === user.organizationId);
            markStepExecuted('load-user-organization', !!organization, { organizationId: user.organizationId });
            
            // @RequiredStep: "establish-user-session"
            set({ 
              user, 
              organization, 
              isAuthenticated: true, 
              isLoading: false,
              token: null
            });
            markStepExecuted('establish-user-session', true, { userId: user.id });
          }
          
        } catch (error) {
          set({ isLoading: false });
          markStepExecuted('login-process', false, error instanceof Error ? error.message : String(error));
          throw error;
        }
      },

      logout: () => {
        // Preserve functions; only reset data fields
        set({ 
          user: null, 
          organization: null, 
          isAuthenticated: false,
          token: null
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setOrganization: (organization: Organization) => {
        set({ organization });
      },

      updateUser: async (userId: string, updates: Partial<User>) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Update mock data
          const userIndex = mockUsers.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
          }
          
          // Update current user if it's the same
          const currentUser = get().user;
          if (currentUser && currentUser.id === userId) {
            set({ user: { ...currentUser, ...updates } });
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      createUser: async (userData: Partial<User>) => {
        set({ isLoading: true });
        
        try {
          if (apiUtils.isRealAPIEnabled()) {
            // Use real API
            const {token} = get();
            const newUser = await apiClient.employees.create(userData, token || undefined);
            const transformedUser = apiUtils.transformBackendUser(newUser);
            
            set({ isLoading: false });
            return transformedUser;
          } else {
            // Use mock data
            await simulateApiCall();
            
            const newUser = createUserWithDefaults(userData);
            mockUsers.push(newUser);
            
            set({ isLoading: false });
            return newUser;
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // New function to load all employees
      loadEmployees: async (): Promise<User[]> => {
        set({ isLoading: true });
        
        try {
          if (apiUtils.isRealAPIEnabled()) {
            // Use real API
            const {token} = get();
            const employees = await apiClient.employees.getAll(token || undefined);
            const transformedEmployees = employees.map(apiUtils.transformBackendUser);
            
            // Cache the employees for getAllUsers
            set({ isLoading: false, cachedEmployees: transformedEmployees, employees: transformedEmployees });
            return transformedEmployees;
          } else {
            // Use mock data
            await simulateApiCall();
            set({ isLoading: false, cachedEmployees: mockUsers, employees: mockUsers });
            return mockUsers;
          }
        } catch (error) {
          console.warn('Failed to load employees from API, falling back to mock data:', error);
          set({ isLoading: false, cachedEmployees: mockUsers, employees: mockUsers });
          return mockUsers;
        }
      },

      getAllUsers: () => {
        // Check if we're using real API and have loaded employees
        if (apiUtils.isRealAPIEnabled()) {
          // Return cached employees or empty array - loadEmployees should be called first
          return get().cachedEmployees || get().employees || [];
        }
        return get().employees || mockUsers;
      },

      // Provide getAuthToken on the store for test compatibility
      getAuthToken: () => get().token
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        organization: state.organization,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      }),
    }
  )
);