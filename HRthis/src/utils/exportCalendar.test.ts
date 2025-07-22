import { CalendarEntry } from '../types/calendar';
import { exportToCSV, exportToPDF } from './exportCalendar';

// Mock date-fns and jsPDF to avoid ES module issues
jest.mock('date-fns', () => ({
  format: jest.fn((_date: Date | string, _formatStr: string) => '2025-01-06')
}));

jest.mock('date-fns/locale', () => ({
  de: {}
}));

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    save: jest.fn(),
    internal: {
      pageSize: { width: 210 }
    }
  }));
});

jest.mock('jspdf-autotable', () => jest.fn());

// Test data
const testEntries: CalendarEntry[] = [
  { userId: '1', userName: 'Max Mustermann', date: '2025-01-06', type: 'urlaub', status: 'genehmigt' },
  { userId: '1', userName: 'Max Mustermann', date: '2025-01-07', type: 'urlaub', status: 'genehmigt' },
  { userId: '2', userName: 'Anna Admin', date: '2025-01-07', type: 'krank' },
  { userId: '3', userName: 'Tom Teilzeit', date: '2025-01-08', type: 'meeting' },
  { userId: '1', userName: 'Max Mustermann', date: '2025-01-09', type: 'zeit', stunden: 8.5 },
  { userId: '2', userName: 'Anna Admin', date: '2025-01-09', type: 'zeit', stunden: 6.0 },
  { userId: '3', userName: 'Tom Teilzeit', date: '2025-01-09', type: 'zeit', stunden: 4.0 },
];

const testUsers = [
  { userId: '1', userName: 'Max Mustermann' },
  { userId: '2', userName: 'Anna Admin' },
  { userId: '3', userName: 'Tom Teilzeit' },
];

const testDateRange = [
  new Date('2025-01-06'),
  new Date('2025-01-07'),
  new Date('2025-01-08'),
  new Date('2025-01-09'),
];

// Manual test functions (to be run in browser console)
export const testCSVExport = (): void => {
  // Test CSV export functionality
  exportToCSV(testEntries, testDateRange, testUsers, 'monat', new Date('2025-01-01'));
};

export const testPDFExport = (): void => {
  // Test PDF export functionality
  exportToPDF(testEntries, testDateRange, testUsers, 'monat', new Date('2025-01-01'));
};

// Export test functions to window for easy testing
interface WindowWithTestFunctions extends Window {
  testCSVExport?: typeof testCSVExport;
  testPDFExport?: typeof testPDFExport;
}

if (typeof window !== 'undefined') {
  (window as WindowWithTestFunctions).testCSVExport = testCSVExport;
  (window as WindowWithTestFunctions).testPDFExport = testPDFExport;
}