import { exportToICS, formatEventDescription, createICSEvent } from './exportCalendar';

describe('Calendar Export Utils', () => {
  describe('formatEventDescription', () => {
    it('should format event description correctly', () => {
      const description = formatEventDescription(
        'Team Meeting',
        'Conference Room A',
        'Discuss Q4 goals'
      );
      
      expect(description).toContain('Team Meeting');
      expect(description).toContain('Conference Room A');
      expect(description).toContain('Discuss Q4 goals');
    });

    it('should handle missing fields gracefully', () => {
      const description = formatEventDescription('Meeting');
      expect(description).toContain('Meeting');
    });
  });

  describe('createICSEvent', () => {
    it('should create valid ICS event string', () => {
      const event = {
        title: 'Test Event',
        start: new Date('2024-01-15T10:00:00'),
        end: new Date('2024-01-15T11:00:00'),
        description: 'Test Description',
        location: 'Test Location'
      };
      
      const icsEvent = createICSEvent(event);
      
      expect(icsEvent).toContain('BEGIN:VEVENT');
      expect(icsEvent).toContain('END:VEVENT');
      expect(icsEvent).toContain('SUMMARY:Test Event');
      expect(icsEvent).toContain('DESCRIPTION:Test Description');
      expect(icsEvent).toContain('LOCATION:Test Location');
    });
  });

  describe('exportToICS', () => {
    // Mock URL.createObjectURL and document.createElement
    const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
    const mockRevokeObjectURL = jest.fn();
    const mockClick = jest.fn();
    
    beforeEach(() => {
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'a') {
          return {
            click: mockClick,
            href: '',
            download: '',
            style: {},
          } as any;
        }
        return document.createElement(tagName);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should export single event to ICS file', () => {
      const event = {
        id: '1',
        title: 'Meeting',
        start: new Date('2024-01-15T10:00:00'),
        end: new Date('2024-01-15T11:00:00'),
      };
      
      exportToICS([event], 'test-calendar.ics');
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('should export multiple events to ICS file', () => {
      const events = [
        {
          id: '1',
          title: 'Meeting 1',
          start: new Date('2024-01-15T10:00:00'),
          end: new Date('2024-01-15T11:00:00'),
        },
        {
          id: '2',
          title: 'Meeting 2',
          start: new Date('2024-01-16T14:00:00'),
          end: new Date('2024-01-16T15:00:00'),
        },
      ];
      
      exportToICS(events, 'meetings.ics');
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });
});