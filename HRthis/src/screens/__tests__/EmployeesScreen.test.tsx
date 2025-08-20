import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { EmployeesScreen } from '../EmployeesScreen';
import { useEmployeeStore } from '../../state/employees';
import { useAuthStore } from '../../state/auth';
import apiClient from '../../api/api-client';

// Mock dependencies
jest.mock('../../state/employees');
jest.mock('../../state/auth');
jest.mock('../../api/api-client');

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('EmployeesScreen', () => {
  const mockEmployees = [
    {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      employeeNumber: 'PN-12345',
      position: 'Developer',
      department: 'IT',
      employmentStatus: 'ACTIVE',
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      employeeNumber: 'PN-12346',
      position: 'Manager',
      department: 'HR',
      employmentStatus: 'ACTIVE',
    },
  ];

  const mockSetEmployees = jest.fn();
  const mockAddEmployee = jest.fn();
  const mockUpdateEmployee = jest.fn();
  const mockDeleteEmployee = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useEmployeeStore as unknown as jest.Mock).mockReturnValue({
      employees: mockEmployees,
      setEmployees: mockSetEmployees,
      addEmployee: mockAddEmployee,
      updateEmployee: mockUpdateEmployee,
      deleteEmployee: mockDeleteEmployee,
      isLoading: false,
    });

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      token: 'test-token',
      user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      isAuthenticated: true,
    });

    (apiClient.employees.getAll as jest.Mock) = jest.fn().mockResolvedValue(mockEmployees);
  });

  const renderEmployeesScreen = () => {
    return render(
      <BrowserRouter>
        <EmployeesScreen />
      </BrowserRouter>
    );
  };

  it('should render employees list', async () => {
    renderEmployeesScreen();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should fetch employees on mount', async () => {
    renderEmployeesScreen();

    await waitFor(() => {
      expect(apiClient.employees.getAll).toHaveBeenCalledWith('test-token');
      expect(mockSetEmployees).toHaveBeenCalledWith(mockEmployees);
    });
  });

  it('should search employees by name', async () => {
    renderEmployeesScreen();

    const searchInput = screen.getByPlaceholderText(/Suche nach Name/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('should filter employees by department', async () => {
    renderEmployeesScreen();

    const departmentFilter = screen.getByLabelText(/Abteilung/i);
    fireEvent.change(departmentFilter, { target: { value: 'IT' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('should filter employees by status', async () => {
    const employeesWithInactive = [
      ...mockEmployees,
      {
        id: '3',
        email: 'inactive@example.com',
        firstName: 'Inactive',
        lastName: 'User',
        employeeNumber: 'PN-12347',
        position: 'Former Employee',
        department: 'IT',
        employmentStatus: 'INACTIVE',
      },
    ];

    (useEmployeeStore as unknown as jest.Mock).mockReturnValue({
      employees: employeesWithInactive,
      setEmployees: mockSetEmployees,
      isLoading: false,
    });

    renderEmployeesScreen();

    const statusFilter = screen.getByLabelText(/Status/i);
    fireEvent.change(statusFilter, { target: { value: 'ACTIVE' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('Inactive User')).not.toBeInTheDocument();
    });
  });

  it('should navigate to add employee form', async () => {
    renderEmployeesScreen();

    const addButton = screen.getByRole('button', { name: /Mitarbeiter hinzufügen/i });
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/employees/new');
  });

  it('should navigate to edit employee', async () => {
    renderEmployeesScreen();

    await waitFor(() => {
      const editButton = screen.getAllByRole('button', { name: /Bearbeiten/i })[0];
      fireEvent.click(editButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/employees/1/edit');
  });

  it('should delete employee with confirmation', async () => {
    (apiClient.employees.delete as jest.Mock) = jest.fn().mockResolvedValue({});
    
    // Mock window.confirm
    window.confirm = jest.fn().mockReturnValue(true);

    renderEmployeesScreen();

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button', { name: /Löschen/i })[0];
      fireEvent.click(deleteButton);
    });

    expect(window.confirm).toHaveBeenCalledWith(
      'Möchten Sie diesen Mitarbeiter wirklich löschen?'
    );
    
    await waitFor(() => {
      expect(apiClient.employees.delete).toHaveBeenCalledWith('1', 'test-token');
      expect(mockDeleteEmployee).toHaveBeenCalledWith('1');
    });
  });

  it('should not delete employee when cancelled', async () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn().mockReturnValue(false);

    renderEmployeesScreen();

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button', { name: /Löschen/i })[0];
      fireEvent.click(deleteButton);
    });

    expect(apiClient.employees.delete).not.toHaveBeenCalled();
    expect(mockDeleteEmployee).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    (useEmployeeStore as unknown as jest.Mock).mockReturnValue({
      employees: [],
      isLoading: true,
    });

    renderEmployeesScreen();

    expect(screen.getByText(/Lade Mitarbeiter/i)).toBeInTheDocument();
  });

  it('should show empty state when no employees', async () => {
    (useEmployeeStore as unknown as jest.Mock).mockReturnValue({
      employees: [],
      setEmployees: mockSetEmployees,
      isLoading: false,
    });

    (apiClient.employees.getAll as jest.Mock).mockResolvedValue([]);

    renderEmployeesScreen();

    await waitFor(() => {
      expect(screen.getByText(/Keine Mitarbeiter gefunden/i)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    (apiClient.employees.getAll as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    renderEmployeesScreen();

    await waitFor(() => {
      expect(screen.getByText(/Fehler beim Laden der Mitarbeiter/i)).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('should sort employees by name', async () => {
    renderEmployeesScreen();

    await waitFor(() => {
      const sortButton = screen.getByRole('button', { name: /Sortieren/i });
      fireEvent.click(sortButton);
    });

    const sortByName = screen.getByText(/Nach Name/i);
    fireEvent.click(sortByName);

    await waitFor(() => {
      const employeeNames = screen.getAllByTestId('employee-name');
      expect(employeeNames[0]).toHaveTextContent('Jane Smith');
      expect(employeeNames[1]).toHaveTextContent('John Doe');
    });
  });

  it('should export employees to CSV', async () => {
    // Mock URL.createObjectURL and document.createElement
    const mockCreateObjectURL = jest.fn(() => 'blob:url');
    const mockClick = jest.fn();
    const mockCreateElement = jest.spyOn(document, 'createElement');
    
    global.URL.createObjectURL = mockCreateObjectURL;
    
    mockCreateElement.mockImplementation((tagName) => {
      if (tagName === 'a') {
        return { click: mockClick, href: '', download: '' } as any;
      }
      return document.createElement(tagName);
    });

    renderEmployeesScreen();

    const exportButton = screen.getByRole('button', { name: /Exportieren/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    mockCreateElement.mockRestore();
  });

  it('should handle permission-based actions', () => {
    // Test as regular employee (not admin)
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      token: 'test-token',
      user: { id: '1', email: 'employee@example.com', role: 'EMPLOYEE' },
      isAuthenticated: true,
    });

    renderEmployeesScreen();

    // Add button should not be visible for regular employees
    expect(screen.queryByRole('button', { name: /Mitarbeiter hinzufügen/i })).not.toBeInTheDocument();
    
    // Delete buttons should not be visible
    expect(screen.queryByRole('button', { name: /Löschen/i })).not.toBeInTheDocument();
  });
});