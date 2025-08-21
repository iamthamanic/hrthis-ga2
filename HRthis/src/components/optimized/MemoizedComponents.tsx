import React, { memo, useMemo, useCallback } from 'react';
import { User } from '../../types';

/**
 * Optimized, memoized components for better performance
 * These components only re-render when their props actually change
 */

// Memoized Employee Card
interface EmployeeCardProps {
  employee: User;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export const MemoizedEmployeeCard = memo<EmployeeCardProps>(
  ({ employee, onEdit, onDelete, onView }) => {
    const handleEdit = useCallback(() => {
      onEdit?.(employee.id);
    }, [employee.id, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete?.(employee.id);
    }, [employee.id, onDelete]);

    const handleView = useCallback(() => {
      onView?.(employee.id);
    }, [employee.id, onView]);

    const statusColor = useMemo(() => {
      switch (employee.employmentStatus) {
        case 'ACTIVE':
          return 'bg-green-100 text-green-800';
        case 'INACTIVE':
          return 'bg-gray-100 text-gray-800';
        case 'ON_LEAVE':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }, [employee.employmentStatus]);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.position}</p>
            <p className="text-sm text-gray-500">{employee.department}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                {employee.employmentStatus}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            {onView && (
              <button
                onClick={handleView}
                className="text-blue-600 hover:text-blue-800"
                aria-label="View employee"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
            {onEdit && (
              <button
                onClick={handleEdit}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Edit employee"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
                aria-label="Delete employee"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for better performance
    return (
      prevProps.employee.id === nextProps.employee.id &&
      prevProps.employee.employmentStatus === nextProps.employee.employmentStatus &&
      prevProps.employee.position === nextProps.employee.position &&
      prevProps.employee.department === nextProps.employee.department &&
      prevProps.onEdit === nextProps.onEdit &&
      prevProps.onDelete === nextProps.onDelete &&
      prevProps.onView === nextProps.onView
    );
  }
);

MemoizedEmployeeCard.displayName = 'MemoizedEmployeeCard';

// Memoized Statistics Card
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export const MemoizedStatCard = memo<StatCardProps>(
  ({ title, value, icon, trend, color = 'blue' }) => {
    const colorClasses = useMemo(() => {
      const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        red: 'bg-red-50 text-red-600 border-red-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
      };
      return colors[color];
    }, [color]);

    const trendIcon = useMemo(() => {
      if (!trend) return null;
      
      const iconClass = trend.isPositive ? 'text-green-500' : 'text-red-500';
      const rotation = trend.isPositive ? 'rotate-0' : 'rotate-180';
      
      return (
        <div className={`flex items-center ${iconClass}`}>
          <svg className={`w-4 h-4 ${rotation}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="ml-1 text-sm">{Math.abs(trend.value)}%</span>
        </div>
      );
    }, [trend]);

    return (
      <div className={`rounded-lg border p-6 ${colorClasses}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trendIcon}
          </div>
          {icon && (
            <div className="opacity-80">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MemoizedStatCard.displayName = 'MemoizedStatCard';

// Memoized Table Row
interface TableRowProps {
  data: Record<string, any>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: Record<string, any>) => React.ReactNode;
  }>;
  onRowClick?: (row: Record<string, any>) => void;
}

export const MemoizedTableRow = memo<TableRowProps>(
  ({ data, columns, onRowClick }) => {
    const handleClick = useCallback(() => {
      onRowClick?.(data);
    }, [data, onRowClick]);

    return (
      <tr 
        onClick={handleClick}
        className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
      >
        {columns.map((column) => (
          <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {column.render ? column.render(data[column.key], data) : data[column.key]}
          </td>
        ))}
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // Deep comparison for data object
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
           prevProps.columns === nextProps.columns &&
           prevProps.onRowClick === nextProps.onRowClick;
  }
);

MemoizedTableRow.displayName = 'MemoizedTableRow';

// Memoized Filter Component
interface FilterProps {
  filters: {
    search: string;
    department: string | null;
    status: string | null;
  };
  onFilterChange: (filters: any) => void;
  departments: string[];
  statuses: string[];
}

export const MemoizedFilters = memo<FilterProps>(
  ({ filters, onFilterChange, departments, statuses }) => {
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange({ ...filters, search: e.target.value });
    }, [filters, onFilterChange]);

    const handleDepartmentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({ ...filters, department: e.target.value || null });
    }, [filters, onFilterChange]);

    const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({ ...filters, status: e.target.value || null });
    }, [filters, onFilterChange]);

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Suche
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Name, E-Mail oder Nummer..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Abteilung
            </label>
            <select
              id="department"
              value={filters.department || ''}
              onChange={handleDepartmentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Alle Abteilungen</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={filters.status || ''}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Alle Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
);

MemoizedFilters.displayName = 'MemoizedFilters';

// Export all memoized components
export default {
  MemoizedEmployeeCard,
  MemoizedStatCard,
  MemoizedTableRow,
  MemoizedFilters,
};