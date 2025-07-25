import { VacationReminder } from './reminders';

import { LeaveRequest } from './index';

/**
 * Calendar entry type for tracking absences and work times
 */
export type CalendarEntry = {
  userId: string;
  userName: string;
  date: string; // Format: YYYY-MM-DD
  type: "urlaub" | "krank" | "meeting" | "fortbildung" | "ux" | "zeit";
  stunden?: number; // nur bei Arbeitszeiteinträgen
  status?: "beantragt" | "genehmigt" | "abgelehnt";
  title?: string;
  color?: string;
};

/**
 * Calendar view modes
 */
export type CalendarViewMode = "month" | "week" | "day" | "personal" | "team" | "year";

/**
 * Calendar view configuration
 */
export type CalendarView = CalendarViewMode;

/**
 * User leave information for calendar display
 */
export interface UserLeave {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  type: 'VACATION' | 'SICK';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comment?: string;
}

/**
 * User time record for calendar display
 */
export interface UserTimeRecord {
  id: string;
  userId: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  breakMinutes: number;
  totalHours: number;
}

/**
 * Leave entry for calendar display
 */
export interface LeaveEntry {
  id: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  type: 'VACATION' | 'SICK';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comment?: string;
}

/**
 * Reminder entry for calendar display
 */
export interface ReminderEntry {
  id: string;
  title: string;
  description?: string;
  date: string;
  userId?: string;
  type: 'personal' | 'team' | 'organization';
}

/**
 * Calendar day representation
 */
export type CalendarDay = {
  date: Date | string;
  entries: CalendarEntry[];
  isToday: boolean;
  isWeekend: boolean;
  isCurrentMonth?: boolean;
  userLeaves?: UserLeave[];
  userTimeRecord?: UserTimeRecord;
  leaves?: LeaveRequest[];
  reminders?: VacationReminder[];
};

/**
 * Calendar event (alias for CalendarEntry for backward compatibility)
 */
export type CalendarEvent = CalendarEntry;

/**
 * Calendar filter modes for UI
 */
export type CalendarFilterMode = 'all' | 'leaves' | 'work';

/**
 * Vacation statistics
 */
export type VacationStats = {
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  pendingDays: number;
};

/**
 * Calendar filter options
 */
export type CalendarFilter = {
  userId?: string;
  type?: CalendarEntry['type'];
  dateRange?: {
    start: string;
    end: string;
  };
};

/**
 * Color mapping for different entry types
 */
export const colorMap = {
  urlaub: "#9df09d",
  krank: "#000000",
  meeting: "#5b8df6",
  fortbildung: "#ffc966",
  ux: "#f55959",
  zeit: {
    vollzeit: "#98c1f2",
    teilzeit: "#f7d560",
    unter6h: "#f2a19e"
  }
};

/**
 * Abbreviations for entry types
 */
export const abbreviationMap = {
  urlaub: "U",
  krank: "K",
  meeting: "M",
  fortbildung: "F",
  ux: "Ux",
  zeit: (hours?: number) => {
    if (!hours) return "?";
    if (hours >= 8) return "Le";
    if (hours >= 6) return "Te";
    return "Ue";
  }
};

/**
 * Get color for work time based on hours
 */
export const getWorkTimeColor = (hours?: number): string => {
  if (!hours) return colorMap.zeit.unter6h;
  if (hours >= 8) return colorMap.zeit.vollzeit;
  if (hours >= 6) return colorMap.zeit.teilzeit;
  return colorMap.zeit.unter6h;
};