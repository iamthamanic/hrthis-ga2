import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

/**
 * Lazy-loaded route components for code splitting
 * This reduces the initial bundle size by loading routes on demand
 */

// Lazy load all screen components
export const DashboardScreen = lazy(() => 
  import('../screens/DashboardScreen').then(module => ({
    default: module.DashboardScreen
  }))
);

export const LoginScreen = lazy(() => 
  import('../screens/LoginScreen').then(module => ({
    default: module.LoginScreen
  }))
);

export const EmployeesScreen = lazy(() => 
  import('../screens/EmployeesScreen').then(module => ({
    default: module.EmployeesScreen
  }))
);

export const EmployeeFormScreen = lazy(() => 
  import('../screens/EmployeeFormScreen').then(module => ({
    default: module.EmployeeFormScreen
  }))
);

export const TimeRecordsScreen = lazy(() => 
  import('../screens/TimeRecordsScreen').then(module => ({
    default: module.TimeRecordsScreen
  }))
);

export const LeavesScreen = lazy(() => 
  import('../screens/LeavesScreen').then(module => ({
    default: module.LeavesScreen
  }))
);

export const BenefitsScreen = lazy(() => 
  import('../screens/BenefitsScreen').then(module => ({
    default: module.BenefitsScreen
  }))
);

export const LearningScreen = lazy(() => 
  import('../screens/LearningScreen').then(module => ({
    default: module.LearningScreen
  }))
);

export const DocumentsScreen = lazy(() => 
  import('../screens/DocumentsScreen').then(module => ({
    default: module.DocumentsScreen
  }))
);

export const SettingsScreen = lazy(() => 
  import('../screens/SettingsScreen').then(module => ({
    default: module.SettingsScreen
  }))
);

export const AdminScreen = lazy(() => 
  import('../screens/AdminScreen').then(module => ({
    default: module.AdminScreen
  }))
);

export const ShopScreen = lazy(() => 
  import('../screens/ShopScreen').then(module => ({
    default: module.ShopScreen
  }))
);

export const ReminderFormScreen = lazy(() => 
  import('../screens/ReminderFormScreen').then(module => ({
    default: module.ReminderFormScreen
  }))
);

export const NotificationsScreen = lazy(() => 
  import('../screens/NotificationsScreen').then(module => ({
    default: module.NotificationsScreen
  }))
);

export const ProfileScreen = lazy(() => 
  import('../screens/ProfileScreen').then(module => ({
    default: module.ProfileScreen
  }))
);

// Loading fallback component
export const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="large" />
    <span className="ml-3 text-gray-600">Lade Seite...</span>
  </div>
);

// Wrapper component for lazy-loaded routes
interface LazyRouteProps {
  children: React.ReactNode;
}

export const LazyRoute: React.FC<LazyRouteProps> = ({ children }) => (
  <Suspense fallback={<RouteLoadingFallback />}>
    {children}
  </Suspense>
);