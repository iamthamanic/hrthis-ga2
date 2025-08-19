/**
 * Permission Hook for Role-Based Access Control
 * Manages user permissions and UI element visibility based on roles
 */

import React, { useMemo, useCallback } from 'react';
import { useAuthStore } from '../../state/auth';
import { User } from '../../types';

// Permission types
export type UserRole = 'EMPLOYEE' | 'ADMIN' | 'SUPERADMIN';
export type Permission = 
  | 'view:employees'
  | 'create:employees'
  | 'edit:employees'
  | 'delete:employees'
  | 'view:salary'
  | 'edit:salary'
  | 'view:documents'
  | 'upload:documents'
  | 'delete:documents'
  | 'manage:benefits'
  | 'manage:vacation'
  | 'approve:vacation'
  | 'manage:training'
  | 'view:analytics'
  | 'manage:system'
  | 'manage:organization';

// Role-Permission mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  EMPLOYEE: [
    'view:employees',
    'view:documents',
    'upload:documents',
    'view:analytics'
  ],
  ADMIN: [
    'view:employees',
    'create:employees',
    'edit:employees',
    'view:salary',
    'edit:salary',
    'view:documents',
    'upload:documents',
    'delete:documents',
    'manage:benefits',
    'manage:vacation',
    'approve:vacation',
    'manage:training',
    'view:analytics'
  ],
  SUPERADMIN: [
    // Superadmin has all permissions
    'view:employees',
    'create:employees',
    'edit:employees',
    'delete:employees',
    'view:salary',
    'edit:salary',
    'view:documents',
    'upload:documents',
    'delete:documents',
    'manage:benefits',
    'manage:vacation',
    'approve:vacation',
    'manage:training',
    'view:analytics',
    'manage:system',
    'manage:organization'
  ]
};

// Resource-based permissions
interface ResourcePermission {
  resource: string;
  action: string;
  condition?: (user: User, resource: any) => boolean;
}

const resourcePermissions: ResourcePermission[] = [
  {
    resource: 'employee',
    action: 'edit:self',
    condition: (user, employee) => user.id === employee.id
  },
  {
    resource: 'document',
    action: 'view:own',
    condition: (user, document) => user.id === document.userId
  },
  {
    resource: 'vacation',
    action: 'edit:own',
    condition: (user, vacation) => user.id === vacation.userId
  },
  {
    resource: 'team',
    action: 'manage',
    condition: (user, team) => team.leaderId === user.id
  }
];

export interface UsePermissionReturn {
  // Basic permission checks
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  // Role checks
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEmployee: boolean;
  
  // Resource-based checks
  canAccess: (resource: string, action: string, resourceData?: any) => boolean;
  canEdit: (resource: any) => boolean;
  canDelete: (resource: any) => boolean;
  canView: (resource: any) => boolean;
  
  // UI helpers
  ifPermitted: <T>(permission: Permission, value: T, fallback?: T) => T | undefined;
  showIf: (permission: Permission) => boolean;
  hideIf: (permission: Permission) => boolean;
  
  // User info
  user: User | null;
  permissions: Permission[];
}

/**
 * Custom hook for managing permissions
 * @returns Permission utilities and user information
 */
export function usePermission(): UsePermissionReturn {
  const { user } = useAuthStore();

  // Get user's permissions based on role
  const permissions = useMemo(() => {
    if (!user) return [];
    return rolePermissions[user.role as UserRole] || [];
  }, [user]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission: Permission): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback((perms: Permission[]): boolean => {
    return perms.some(p => permissions.includes(p));
  }, [permissions]);

  // Check if user has all specified permissions
  const hasAllPermissions = useCallback((perms: Permission[]): boolean => {
    return perms.every(p => permissions.includes(p));
  }, [permissions]);

  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return roles.includes(user?.role as UserRole);
  }, [user]);

  // Role shortcuts
  const isAdmin = useMemo(() => 
    hasAnyRole(['ADMIN', 'SUPERADMIN']), 
    [hasAnyRole]
  );
  
  const isSuperAdmin = useMemo(() => 
    hasRole('SUPERADMIN'), 
    [hasRole]
  );
  
  const isEmployee = useMemo(() => 
    hasRole('EMPLOYEE'), 
    [hasRole]
  );

  // Check resource-based permissions
  const canAccess = useCallback((
    resource: string, 
    action: string, 
    resourceData?: any
  ): boolean => {
    if (!user) return false;

    // Check basic role permissions first
    const permissionKey = `${action}:${resource}` as Permission;
    if (hasPermission(permissionKey)) return true;

    // Check resource-specific permissions
    const resourcePerm = resourcePermissions.find(
      rp => rp.resource === resource && rp.action === action
    );

    if (resourcePerm && resourcePerm.condition) {
      return resourcePerm.condition(user, resourceData);
    }

    return false;
  }, [user, hasPermission]);

  // Common resource actions
  const canEdit = useCallback((resource: any): boolean => {
    if (!user) return false;
    
    // Admin can edit everything
    if (isAdmin) return true;
    
    // Check if user owns the resource
    if (resource.userId === user.id) return true;
    if (resource.ownerId === user.id) return true;
    if (resource.createdBy === user.id) return true;
    
    return false;
  }, [user, isAdmin]);

  const canDelete = useCallback((resource: any): boolean => {
    if (!user) return false;
    
    // Only admin can delete in most cases
    if (isAdmin) return true;
    
    // Some resources may allow self-deletion
    if (resource.allowSelfDelete && resource.userId === user.id) {
      return true;
    }
    
    return false;
  }, [user, isAdmin]);

  const canView = useCallback((resource: any): boolean => {
    if (!user) return false;
    
    // Admin can view everything
    if (isAdmin) return true;
    
    // Check if resource is public
    if (resource.isPublic) return true;
    
    // Check if user owns or is associated with the resource
    if (resource.userId === user.id) return true;
    if (resource.sharedWith?.includes(user.id)) return true;
    if (resource.teamId && user.teamIds?.includes(resource.teamId)) return true;
    
    return false;
  }, [user, isAdmin]);

  // UI helper: conditionally return value based on permission
  const ifPermitted = useCallback(<T,>(
    permission: Permission, 
    value: T, 
    fallback?: T
  ): T | undefined => {
    return hasPermission(permission) ? value : fallback;
  }, [hasPermission]);

  // UI helper: show element if user has permission
  const showIf = useCallback((permission: Permission): boolean => {
    return hasPermission(permission);
  }, [hasPermission]);

  // UI helper: hide element if user has permission
  const hideIf = useCallback((permission: Permission): boolean => {
    return !hasPermission(permission);
  }, [hasPermission]);

  return {
    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Role checks
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    isEmployee,
    
    // Resource checks
    canAccess,
    canEdit,
    canDelete,
    canView,
    
    // UI helpers
    ifPermitted,
    showIf,
    hideIf,
    
    // User info
    user,
    permissions
  };
}

/**
 * Higher-Order Component for permission-based rendering
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission | Permission[],
  FallbackComponent?: React.ComponentType<any>
): React.ComponentType<P> {
  return function PermissionWrapper(props: P) {
    const { hasPermission, hasAnyPermission } = usePermission();
    
    const hasAccess = Array.isArray(permission)
      ? hasAnyPermission(permission)
      : hasPermission(permission);
    
    if (!hasAccess) {
      return FallbackComponent ? React.createElement(FallbackComponent, props) : null;
    }
    
    return React.createElement(Component, props);
  };
}

/**
 * Component for conditional rendering based on permissions
 */
interface PermissionGateProps {
  permission: Permission | Permission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
  requireAll?: boolean;
}

export function PermissionGate({ 
  permission, 
  fallback = null, 
  children,
  requireAll = false 
}: PermissionGateProps): React.ReactElement | null {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
  
  const hasAccess = Array.isArray(permission)
    ? (requireAll ? hasAllPermissions(permission) : hasAnyPermission(permission))
    : hasPermission(permission);
  
  return hasAccess ? React.createElement(React.Fragment, null, children) : (fallback as React.ReactElement | null);
}