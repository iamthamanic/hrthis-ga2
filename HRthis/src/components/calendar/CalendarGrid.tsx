import React from 'react';
import { CalendarDay, CalendarEvent, CalendarFilterMode } from '../../types/calendar';
import { cn } from '../../utils/cn';

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  events: CalendarEvent[];
  filterMode: CalendarFilterMode;
  onDayClick: (day: CalendarDay) => void;
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const getFilteredEvents = (events: CalendarEvent[], day: CalendarDay, filterMode: CalendarFilterMode): CalendarEvent[] => {
  const dayDateString = day.date instanceof Date ? day.date.toISOString().split('T')[0] : day.date;
  const dayEvents = events.filter(event => event.date === dayDateString);
  
  return dayEvents.filter(event => {
    if (filterMode === 'all') return true;
    if (filterMode === 'leaves') return event.type === 'urlaub' || event.type === 'krank';
    if (filterMode === 'work') return event.type === 'zeit';
    return true;
  });
};

const getDayNumber = (day: CalendarDay): number => {
  return day.date instanceof Date ? day.date.getDate() : new Date(day.date).getDate();
};

const getDayOfWeek = (day: CalendarDay): number => {
  return day.date instanceof Date ? day.date.getDay() : new Date(day.date).getDay();
};

const EventList: React.FC<{ events: CalendarEvent[] }> = ({ events }) => (
  <div className="flex-1 space-y-0.5">
    {events.slice(0, 3).map((event, index) => (
      <div key={`event-${index}`} className={cn(
        "text-xs px-1 py-0.5 rounded text-white truncate",
        event.color
      )}>
        {event.title}
      </div>
    ))}
    
    {events.length > 3 && (
      <div className="text-xs text-gray-500">
        +{events.length - 3} mehr
      </div>
    )}
  </div>
);

const DayContent: React.FC<{ day: CalendarDay; events: CalendarEvent[] }> = ({ day, events }) => (
  <div className="h-full flex flex-col p-1">
    <span className={cn(
      "text-sm font-medium mb-1",
      !day.isCurrentMonth && "text-gray-400",
      day.isToday && "text-blue-600 font-bold",
      day.isWeekend && day.isCurrentMonth && "text-gray-600"
    )}>
      {getDayNumber(day)}
    </span>
    
    <EventList events={events} />
    
    {day.isWeekend && day.isCurrentMonth && (
      <div className="text-xs text-gray-400 mt-auto">
        {getDayOfWeek(day) === 6 ? 'SA' : 'SO'}
      </div>
    )}
  </div>
);

const WeekdayHeaders: React.FC = () => (
  <div className="grid grid-cols-7 mb-2">
    {WEEKDAYS.map((day) => (
      <div key={day} className="flex items-center justify-center py-3">
        <span className="text-sm font-semibold text-gray-500">{day}</span>
      </div>
    ))}
  </div>
);

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  events,
  filterMode,
  onDayClick
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <WeekdayHeaders />
      
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {calendarDays.map((day, index) => {
          const filteredEvents = getFilteredEvents(events, day, filterMode);
          
          return (
            <button
              key={`day-${index}`}
              className={cn(
                "aspect-square border-b border-r border-gray-100 text-left hover:bg-gray-50 transition-colors relative",
                !day.isCurrentMonth && "bg-gray-50",
                day.isToday && "bg-blue-50 border-blue-200",
                day.isWeekend && "bg-gray-25"
              )}
              onClick={() => onDayClick(day)}
            >
              <DayContent day={day} events={filteredEvents} />
            </button>
          );
        })}
      </div>
    </div>
  );
};