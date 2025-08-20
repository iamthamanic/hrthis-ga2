/**
 * Navigation utility functions for HRthis app
 * Handles base path prefixing for all routes
 */

// Get base path from environment variable
const BASE_PATH = process.env.REACT_APP_BASE_PATH || '';

/**
 * Prefixes a route with the base path for external navigation
 * @param route - The route without base path (e.g., '/dashboard')
 * @returns The route with base path (e.g., '/hrthis/dashboard')
 */
export function getRoute(route: string): string {
  // Since we're using Router basename, we don't need to prefix routes
  // This function now just ensures the route starts with /
  return route.startsWith('/') ? route : `/${route}`;
}

/**
 * Common app routes
 */
export const ROUTES = {
  // Auth routes
  LOGIN: getRoute('/login'),
  LOGOUT: getRoute('/logout'),
  
  // Main routes
  DASHBOARD: getRoute('/dashboard'),
  SETTINGS: getRoute('/settings'), // Deprecated - use PERSONAL_FILE
  PERSONAL_FILE: getRoute('/user/personal-file'),
  
  // Feature routes
  TIME_VACATION: getRoute('/time-vacation'),
  LEARNING: getRoute('/learning'),
  BENEFITS: getRoute('/benefits'),
  DOCUMENTS: getRoute('/documents'),
  CALENDAR: getRoute('/calendar'),
  MY_REQUESTS: getRoute('/my-requests'),
  REQUEST_LEAVE: getRoute('/request-leave'),
  
  // Learning sub-routes
  VIDEO_LEARNING: getRoute('/video-learning'),
  LEARNING_DASHBOARD: getRoute('/learning-dashboard'),
  
  // Admin routes
  ADMIN: getRoute('/admin'),
  ADMIN_DASHBOARD: getRoute('/admin/dashboard'),
  TEAM_MANAGEMENT: getRoute('/admin/team-management'),
  TEAMS_OVERVIEW: getRoute('/admin/teams'),
  ADD_EMPLOYEE: getRoute('/admin/add-employee'),
  TEAM_MEMBER_DETAILS: (id: string) => getRoute(`/admin/team-management/user/${id}`),
  
  // Avatar system routes
  AVATAR_SYSTEM: getRoute('/avatar-system'),
  AVATAR_ADMIN: getRoute('/avatar-system-admin'),
  
  // Shop routes
  SHOP: getRoute('/shop'),
} as const;

/**
 * Checks if the current path matches a route
 * @param currentPath - The current location pathname
 * @param route - The route to check against
 * @returns true if the paths match
 */
export function isActiveRoute(currentPath: string, route: string): boolean {
  // Remove trailing slashes for comparison
  const cleanCurrent = currentPath.replace(/\/$/, '');
  const cleanRoute = route.replace(/\/$/, '');
  
  return cleanCurrent === cleanRoute || cleanCurrent.startsWith(cleanRoute + '/');
}

/**
 * Gets the path without the base prefix
 * Useful for route matching in React Router
 * @param fullPath - The full path including base
 * @returns The path without base prefix
 */
export function getRelativePath(fullPath: string): string {
  if (BASE_PATH && fullPath.startsWith(BASE_PATH)) {
    return fullPath.slice(BASE_PATH.length) || '/';
  }
  return fullPath;
}