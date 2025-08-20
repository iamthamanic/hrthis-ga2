import apiClient, { apiUtils } from '../api-client';

// Mock fetch
global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.REACT_APP_API_URL;
  });

  describe('apiUtils', () => {
    describe('isRealAPIEnabled', () => {
      it('should return false when REACT_APP_API_URL is not set', () => {
        expect(apiUtils.isRealAPIEnabled()).toBe(false);
      });

      it('should return false when REACT_APP_API_URL is empty', () => {
        process.env.REACT_APP_API_URL = '';
        expect(apiUtils.isRealAPIEnabled()).toBe(false);
      });

      it('should return true when REACT_APP_API_URL is set', () => {
        process.env.REACT_APP_API_URL = 'http://localhost:8002';
        expect(apiUtils.isRealAPIEnabled()).toBe(true);
      });
    });

    describe('transformBackendUser', () => {
      it('should transform backend user to frontend format', () => {
        const backendUser = {
          id: '123',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'EMPLOYEE',
          organization_id: 'org1',
          employee_number: '12345',
          position: 'Developer',
          department: 'IT',
          weekly_hours: 40,
          employment_type: 'FULL_TIME',
          join_date: '2024-01-01',
          employment_status: 'ACTIVE',
          vacation_days: 30,
        };

        const result = apiUtils.transformBackendUser(backendUser);

        expect(result).toMatchObject({
          id: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          name: 'John Doe',
          role: 'EMPLOYEE',
          organizationId: 'org1',
          employeeNumber: '12345',
          position: 'Developer',
          department: 'IT',
          weeklyHours: 40,
          employmentType: 'FULL_TIME',
          joinDate: '2024-01-01',
          employmentStatus: 'ACTIVE',
          vacationDays: 30,
        });
      });

      it('should handle missing optional fields', () => {
        const minimalUser = {
          id: '123',
          email: 'test@example.com',
        };

        const result = apiUtils.transformBackendUser(minimalUser);

        expect(result).toMatchObject({
          id: '123',
          email: 'test@example.com',
          name: ' ',
          role: 'EMPLOYEE',
        });
      });

      it('should transform nested address object', () => {
        const userWithAddress = {
          id: '123',
          email: 'test@example.com',
          address: {
            street: 'Main St 123',
            postal_code: '12345',
            city: 'Berlin',
          },
        };

        const result = apiUtils.transformBackendUser(userWithAddress);

        expect(result.address).toEqual({
          street: 'Main St 123',
          postalCode: '12345',
          city: 'Berlin',
        });
      });
    });
  });

  describe('employees API', () => {
    const mockToken = 'test-token';
    const apiUrl = 'http://localhost:8002';

    beforeEach(() => {
      process.env.REACT_APP_API_URL = apiUrl;
    });

    describe('getAll', () => {
      it('should fetch all employees', async () => {
        const mockEmployees = [
          { id: '1', email: 'emp1@test.com' },
          { id: '2', email: 'emp2@test.com' },
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockEmployees,
        });

        const result = await apiClient.employees.getAll(mockToken);

        expect(global.fetch).toHaveBeenCalledWith(
          `${apiUrl}/api/employees/`,
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': `Bearer ${mockToken}`,
            }),
          })
        );
        expect(result).toEqual(mockEmployees);
      });

      it('should handle fetch errors', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
        });

        await expect(apiClient.employees.getAll(mockToken))
          .rejects.toThrow('Failed to fetch employees: 401 Unauthorized');
      });
    });

    describe('getById', () => {
      it('should fetch employee by id', async () => {
        const mockEmployee = { id: '1', email: 'emp1@test.com' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockEmployee,
        });

        const result = await apiClient.employees.getById('1', mockToken);

        expect(global.fetch).toHaveBeenCalledWith(
          `${apiUrl}/api/employees/1`,
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': `Bearer ${mockToken}`,
            }),
          })
        );
        expect(result).toEqual(mockEmployee);
      });
    });

    describe('create', () => {
      it('should create new employee', async () => {
        const newEmployee = {
          email: 'new@test.com',
          firstName: 'New',
          lastName: 'Employee',
        };

        const createdEmployee = {
          id: '123',
          ...newEmployee,
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => createdEmployee,
        });

        const result = await apiClient.employees.create(newEmployee, mockToken);

        expect(global.fetch).toHaveBeenCalledWith(
          `${apiUrl}/api/employees/`,
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mockToken}`,
            }),
            body: JSON.stringify(expect.objectContaining({
              email: 'new@test.com',
              first_name: 'New',
              last_name: 'Employee',
            })),
          })
        );
        expect(result).toEqual(createdEmployee);
      });
    });

    describe('update', () => {
      it('should update employee', async () => {
        const updates = { position: 'Senior Developer' };
        const updatedEmployee = { id: '1', position: 'Senior Developer' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => updatedEmployee,
        });

        const result = await apiClient.employees.update('1', updates, mockToken);

        expect(global.fetch).toHaveBeenCalledWith(
          `${apiUrl}/api/employees/1`,
          expect.objectContaining({
            method: 'PATCH',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mockToken}`,
            }),
          })
        );
        expect(result).toEqual(updatedEmployee);
      });
    });

    describe('delete', () => {
      it('should delete employee', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Employee deleted' }),
        });

        await apiClient.employees.delete('1', mockToken);

        expect(global.fetch).toHaveBeenCalledWith(
          `${apiUrl}/api/employees/1`,
          expect.objectContaining({
            method: 'DELETE',
            headers: expect.objectContaining({
              'Authorization': `Bearer ${mockToken}`,
            }),
          })
        );
      });
    });
  });

  describe('auth API', () => {
    const apiUrl = 'http://localhost:8002';

    beforeEach(() => {
      process.env.REACT_APP_API_URL = apiUrl;
    });

    describe('login', () => {
      it('should login with credentials', async () => {
        const mockResponse = {
          user: { id: '1', email: 'test@example.com' },
          access_token: 'token123',
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await apiClient.auth.login('test@example.com', 'password');

        expect(global.fetch).toHaveBeenCalledWith(
          `${apiUrl}/api/auth/login`,
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/x-www-form-urlencoded',
            }),
          })
        );
        expect(result).toEqual(mockResponse);
      });

      it('should handle login errors', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          json: async () => ({ message: 'Invalid credentials' }),
        });

        await expect(apiClient.auth.login('test@example.com', 'wrong'))
          .rejects.toThrow('Invalid credentials');
      });
    });

    describe('refreshToken', () => {
      it('should refresh access token', async () => {
        const mockResponse = { access_token: 'new-token' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await apiClient.auth.refreshToken('old-token');

        expect(global.fetch).toHaveBeenCalledWith(
          `${apiUrl}/api/auth/refresh`,
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Authorization': 'Bearer old-token',
            }),
          })
        );
        expect(result).toEqual(mockResponse);
      });
    });
  });
});