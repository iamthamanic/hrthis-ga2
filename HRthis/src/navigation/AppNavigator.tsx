import React from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';


// Removed unused imports for requests functionality

// Screens
import { AdminCoinsScreen } from '../screens/AdminCoinsScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { BenefitsScreen } from '../screens/BenefitsScreen';
import { CoinHistoryScreen } from '../screens/CoinHistoryScreen';
import { CreateTrainingScreen } from '../screens/CreateTrainingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { LearningAdmin } from '../screens/LearningAdmin';
import { LearningDashboard } from '../screens/LearningDashboard';
import { LoginScreen } from '../screens/LoginScreen';
import { NotFoundScreen } from '../screens/NotFoundScreen';
import { RequestLeaveScreen } from '../screens/RequestLeaveScreen';
// import { TimeRecordsScreen } from '../screens/TimeRecordsScreen';
// import { MyRequestsScreen } from '../screens/MyRequestsScreen';
// import { CalendarScreen } from '../screens/CalendarScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TakeLessonScreen } from '../screens/TakeLessonScreen';
import { TeamCalendarScreen } from '../screens/TeamCalendarScreen';
import { TeamMemberDetailsScreen } from '../screens/TeamMemberDetailsScreen';
import { TeamsOverviewScreen } from '../screens/TeamsOverviewScreen';
import { TimeAndVacationScreen } from '../screens/TimeAndVacationScreen';
// import { TrainingOverviewScreen } from '../screens/TrainingOverviewScreen';
import { TrainingDetailsScreen } from '../screens/TrainingDetailsScreen';
import { TrainingManagementScreen } from '../screens/TrainingManagementScreen';
import { VideoLearningScreen } from '../screens/VideoLearningScreen';
// import { LearningShop } from '../screens/LearningShop';
// import { TeamManagementScreen } from '../screens/TeamManagementScreen';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';
// import { ROUTES } from '../utils/navigation';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  // Removed unused notification logic for requests tab
  
  const getNotificationCount = (_tabPath: string): number => {
    // Future: Could add training-related notifications here
    return 0;
  };
  
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  
  const tabs = [
    { path: '/dashboard', label: 'Übersicht', icon: '🏠' },
    { path: '/time-vacation', label: 'Zeit & Urlaub', icon: '⏰' },
    { path: '/learning', label: 'Lernen', icon: '🎓' },
    { path: '/benefits', label: 'Benefits', icon: '🎁' },
    { path: '/documents', label: 'Dokumente', icon: '📄' },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: '🔧' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center h-16 px-4">
          {/* HRdiese Logo */}
          <div className="flex items-center mr-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">HRdiese</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex justify-around items-center flex-1">
            {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            const notificationCount = getNotificationCount(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative",
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <span className="text-lg mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </Link>
            );
            })}
          </div>
          
          {/* Power Button with Dropdown */}
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-xl">⚙️</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
              <button 
                onClick={() => navigate('/user/personal-file')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
              >
                Einstellungen
              </button>
              <hr className="border-gray-200" />
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout><Navigate to="/dashboard" /></MainLayout>} />
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<MainLayout><DashboardScreen /></MainLayout>} />
      {/* Route removed: Requests functionality moved to Zeit & Urlaub */}
      <Route path="/time-vacation" element={<MainLayout><TimeAndVacationScreen /></MainLayout>} />
      {/* Legacy routes - redirect to time-vacation */}
      <Route path="/time" element={<Navigate to="/time-vacation" />} />
      <Route path="/calendar" element={<Navigate to="/time-vacation" />} />
      <Route path="/learning" element={<MainLayout><LearningDashboard /></MainLayout>} />
      <Route path="/benefits" element={<MainLayout><BenefitsScreen /></MainLayout>} />
      <Route path="/documents" element={<MainLayout><DocumentsScreen /></MainLayout>} />
      <Route path="/admin/*" element={<MainLayout><AdminScreen /></MainLayout>} />
      <Route path="/team-calendar" element={<MainLayout><TeamCalendarScreen /></MainLayout>} />
      
      {/* Modal-like routes */}
      <Route path="/request-leave" element={<RequestLeaveScreen />} />
      <Route path="/settings" element={<Navigate to="/user/personal-file" replace />} /> {/* Redirect old route */}
      <Route path="/user/personal-file" element={<SettingsScreen />} />
      <Route path="/coin-history" element={<CoinHistoryScreen />} />
      <Route path="/admin-coins" element={<AdminCoinsScreen />} />
      <Route path="/learning/video/:videoId" element={<VideoLearningScreen />} />
      <Route path="/learning/admin" element={<LearningAdmin />} />
      <Route path="/create-training" element={<CreateTrainingScreen />} />
      <Route path="/training/:id" element={<TrainingDetailsScreen />} />
      <Route path="/training/:trainingId/lesson/:lessonId" element={<TakeLessonScreen />} />
      <Route path="/training-management" element={<TrainingManagementScreen />} />
      <Route path="/team-management/user/:userId" element={<TeamMemberDetailsScreen />} />
      <Route path="/team-management/teams" element={<TeamsOverviewScreen />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<MainLayout><NotFoundScreen /></MainLayout>} />
    </Routes>
  );
};