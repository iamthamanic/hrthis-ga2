import React from 'react';

import { CalendarView, CalendarViewMode } from '../../types/calendar';

interface CalendarHeaderProps {
  viewMode: CalendarViewMode;
  calendarView: CalendarView;
  currentDate: Date;
  isAdmin: boolean;
  onNavigate: (to: string) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onNavigateYear: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
}

const getMonthYearText = (currentDate: Date): string => {
  return currentDate.toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric'
  });
};

const ActionButtons: React.FC<{
  isAdmin: boolean;
  onNavigate: (to: string) => void;
  onGoToToday: () => void;
}> = ({ isAdmin, onNavigate, onGoToToday }) => (
  <div className="flex items-center space-x-3">
    {isAdmin && (
      <button
        onClick={() => onNavigate('/team-calendar')}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
      >
        📊 Team-Kalender
      </button>
    )}
    
    <button
      onClick={() => onNavigate('/request-leave')}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
    >
      + Urlaub
    </button>
    
    <button
      onClick={onGoToToday}
      className="bg-white px-3 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm border"
    >
      Heute
    </button>
  </div>
);

const NavigationControls: React.FC<{
  calendarView: CalendarView;
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onNavigateYear: (direction: 'prev' | 'next') => void;
}> = ({ calendarView, currentDate, onNavigateMonth, onNavigateYear }) => (
  <div className="flex items-center space-x-2">
    <button 
      onClick={() => calendarView === 'month' ? onNavigateMonth('prev') : onNavigateYear('prev')}
      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg text-gray-600">‹</span>
    </button>
    <h2 className="text-lg font-semibold text-gray-900 min-w-40 text-center">
      {calendarView === 'month' ? getMonthYearText(currentDate) : currentDate.getFullYear()}
    </h2>
    <button 
      onClick={() => calendarView === 'month' ? onNavigateMonth('next') : onNavigateYear('next')}
      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg text-gray-600">›</span>
    </button>
  </div>
);

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewMode,
  calendarView,
  currentDate,
  isAdmin,
  onNavigate,
  onNavigateMonth,
  onNavigateYear,
  onGoToToday
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold text-gray-900">
        {viewMode === 'personal' ? 'Mein Kalender' : 'Team Kalender'}
      </h1>
      
      <div className="flex items-center space-x-3">
        <ActionButtons 
          isAdmin={isAdmin}
          onNavigate={onNavigate}
          onGoToToday={onGoToToday}
        />
        
        <NavigationControls
          calendarView={calendarView}
          currentDate={currentDate}
          onNavigateMonth={onNavigateMonth}
          onNavigateYear={onNavigateYear}
        />
      </div>
    </div>
  );
};