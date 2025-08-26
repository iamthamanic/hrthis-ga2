// Mock date-fns to avoid ESM issues
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'dd.MM.yyyy') {
      return '01.01.2024';
    }
    if (formatStr === 'HH:mm') {
      return '09:00';
    }
    if (formatStr === "yyyyMMdd'T'HHmmss") {
      return '20240101T090000';
    }
    return '2024-01-01';
  })
}));

jest.mock('date-fns/locale', () => ({
  de: {}
}));

jest.mock('jspdf');
jest.mock('jspdf-autotable');

import { exportToCSV, exportToPDF } from './exportCalendar';

describe('Calendar Export Utils', () => {
  const mockEntries = [
    {
      id: '1',
      date: new Date('2024-01-01'),
      type: 'holiday' as const,
      title: 'Neujahr',
      description: 'Feiertag',
      status: 'approved' as const,
      isAllDay: true
    },
    {
      id: '2',
      date: new Date('2024-01-02'),
      type: 'vacation' as const,
      title: 'Urlaub',
      description: 'Jahresurlaub',
      status: 'pending' as const,
      isAllDay: true
    }
  ];

  const mockDateRange = {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31')
  };

  describe('exportToCSV', () => {
    beforeEach(() => {
      // Mock DOM methods
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();
      
      // Mock document.createElement with proper element
      const mockLink = document.createElement('a');
      mockLink.click = jest.fn();
      mockLink.remove = jest.fn();
      mockLink.setAttribute = jest.fn();
      
      const originalCreateElement = document.createElement;
      document.createElement = jest.fn((tagName: string) => {
        if (tagName === 'a') {
          return mockLink;
        }
        return originalCreateElement.call(document, tagName);
      });
      document.body.appendChild = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should export entries to CSV file', () => {
      exportToCSV(mockEntries, mockDateRange);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should handle empty entries array', () => {
      exportToCSV([], mockDateRange);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should create CSV with proper filename', () => {
      exportToCSV(mockEntries, mockDateRange);

      const mockLink = document.createElement('a');
      expect(mockLink.download).toContain('.csv');
    });
  });

  describe('exportToPDF', () => {
    beforeEach(() => {
      // Mock jsPDF methods
      const mockJsPDF = {
        setFontSize: jest.fn(),
        text: jest.fn(),
        setFont: jest.fn(),
        setTextColor: jest.fn(),
        setDrawColor: jest.fn(),
        setLineWidth: jest.fn(),
        line: jest.fn(),
        save: jest.fn(),
        internal: {
          pageSize: {
            width: 210,
            height: 297
          }
        },
        autoTable: jest.fn()
      };

      const jsPDF = require('jspdf');
      jsPDF.default = jest.fn(() => mockJsPDF);
      jsPDF.jsPDF = jest.fn(() => mockJsPDF);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should export entries to PDF file', () => {
      const jsPDF = require('jspdf');
      const mockInstance = new jsPDF.jsPDF();
      
      exportToPDF(mockEntries, mockDateRange, 'John Doe');

      expect(jsPDF.jsPDF).toHaveBeenCalled();
      expect(mockInstance.save).toHaveBeenCalled();
    });

    it('should handle empty entries array', () => {
      const jsPDF = require('jspdf');
      const mockInstance = new jsPDF.jsPDF();
      
      exportToPDF([], mockDateRange, 'John Doe');

      expect(jsPDF.jsPDF).toHaveBeenCalled();
      expect(mockInstance.save).toHaveBeenCalled();
    });

    it('should include employee name in PDF', () => {
      const jsPDF = require('jspdf');
      const mockInstance = new jsPDF.jsPDF();
      
      exportToPDF(mockEntries, mockDateRange, 'Jane Smith');

      expect(jsPDF.jsPDF).toHaveBeenCalled();
      expect(mockInstance.text).toHaveBeenCalled();
    });

    it('should create PDF with proper filename', () => {
      const jsPDF = require('jspdf');
      const mockInstance = new jsPDF.jsPDF();
      
      exportToPDF(mockEntries, mockDateRange, 'John Doe');

      expect(mockInstance.save).toHaveBeenCalledWith(
        expect.stringContaining('.pdf')
      );
    });
  });
});