import React, { useState, useMemo } from 'react';

import { CalendarEntry } from '../types/calendar';

import { TeamCalendarGrid } from './calendar/TeamCalendarGrid';
import {
  generateDateRange
} from './calendar/TeamCalendarHelpers';
import { TeamCalendarLegend } from './calendar/TeamCalendarLegend';
import { TeamCalendarNavigation } from './calendar/TeamCalendarNavigation';

interface TeamCalendarViewProps {
  view: 'monat' | 'jahr';
  entries: CalendarEntry[];
  users: { userId: string; userName: string }[];
  onCellClick?: (userId: string, date: string) => void;
  isAdmin?: boolean;
  showLegend?: boolean;
}

interface TeamCalendarLogicReturn {
  dateRange: Date[];
  entriesByUserAndDate: Map<string, CalendarEntry>;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  hoveredCell: { userId: string; date: string } | null;
  setHoveredCell: (cell: { userId: string; date: string } | null) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  handleNavigate: (direction: 'prev' | 'next') => void;
  userEntries: Map<string, CalendarEntry[]>;
}

const useTeamCalendarLogic = (view: 'monat' | 'jahr', entries: CalendarEntry[]): TeamCalendarLogicReturn => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [hoveredCell, setHoveredCell] = useState<{ userId: string; date: string } | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const dateRange = useMemo(() => {
    return generateDateRange(view, selectedMonth);
  }, [view, selectedMonth]);

  const entriesByUserAndDate = useMemo(() => {
    const map = new Map<string, CalendarEntry>();
    entries.forEach(entry => {
      const key = `${entry.userId}-${entry.date}`;
      map.set(key, entry);
    });
    return map;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (filterType === 'all') return entriesByUserAndDate;
    
    const filtered = new Map<string, CalendarEntry>();
    entriesByUserAndDate.forEach((entry, key) => {
      if (entry.type === filterType) {
        filtered.set(key, entry);
      }
    });
    return filtered;
  }, [entriesByUserAndDate, filterType]);

  const navigateMonth = (direction: number): void => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  const [selectedWeek, setSelectedWeek] = useState(0);
  
  const handleNavigate = (direction: 'prev' | 'next'): void => {
    navigateMonth(direction === 'prev' ? -1 : 1);
  };
  
  const userEntries = new Map<string, CalendarEntry[]>();
  entries.forEach(entry => {
    const existing = userEntries.get(entry.userId) || [];
    userEntries.set(entry.userId, [...existing, entry]);
  });

  return {
    dateRange,
    entriesByUserAndDate: filteredEntries,
    selectedMonth,
    setSelectedMonth,
    hoveredCell,
    setHoveredCell,
    filterType,
    setFilterType,
    selectedWeek,
    setSelectedWeek,
    handleNavigate,
    userEntries
  };
};

/**
 * TeamCalendarView Component
 * Displays a scrollable calendar view with absence status for all team members
 * Each user has a horizontal row, each day has a cell with info & color
 */
export const TeamCalendarView: React.FC<TeamCalendarViewProps> = ({
  view,
  entries,
  users,
  onCellClick,
  isAdmin: _isAdmin = false,
  showLegend = true
}) => {
  const calendarLogic = useTeamCalendarLogic(view, entries);

  return (
    <div className="w-full">
      <TeamCalendarNavigation
        view={view}
        selectedMonth={calendarLogic.selectedMonth}
        filterType={calendarLogic.filterType}
        onNavigateMonth={(direction: number) => calendarLogic.handleNavigate(direction > 0 ? 'next' : 'prev')}
        onFilterChange={calendarLogic.setFilterType}
      />
      
      <TeamCalendarGrid
        view={view}
        dateRange={calendarLogic.dateRange}
        users={users}
        filteredEntries={calendarLogic.entriesByUserAndDate}
        selectedMonth={calendarLogic.selectedMonth}
        hoveredCell={calendarLogic.hoveredCell}
        onCellClick={onCellClick}
        onCellHover={(userId: string, date: string) => calendarLogic.setHoveredCell({ userId, date })}
        onCellLeave={() => calendarLogic.setHoveredCell(null)}
      />
      
      <TeamCalendarLegend showLegend={showLegend} />
    </div>
  );
};