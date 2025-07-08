import React from 'react';
import { CalendarEntry, colorMap, abbreviationMap, getWorkTimeColor } from '../../types/calendar';
import { cn } from '../../utils/cn';
import { format, isToday } from 'date-fns';
import { de } from 'date-fns/locale';

// Constants
const DATE_FORMAT = 'yyyy-MM-dd';

interface TeamCalendarGridProps {
  view: 'monat' | 'jahr';
  dateRange: Date[];
  users: { userId: string; userName: string }[];
  filteredEntries: Map<string, CalendarEntry>;
  selectedMonth: Date;
  hoveredCell: { userId: string; date: string } | null;
  onCellClick?: (userId: string, date: string) => void;
  onCellHover: (userId: string, date: string) => void;
  onCellLeave: () => void;
}

/**
 * Get calendar entry for a specific user and date
 */
const getEntry = (userId: string, date: Date, filteredEntries: Map<string, CalendarEntry>): CalendarEntry | undefined => {
  const dateStr = format(date, DATE_FORMAT);
  return filteredEntries.get(`${userId}-${dateStr}`);
};

/**
 * Generate cell content with appropriate styling based on entry type
 */
const getCellContent = (entry: CalendarEntry | undefined) => {
  if (!entry) return null;

  const abbreviation = entry.type === 'zeit' 
    ? abbreviationMap.zeit(entry.stunden)
    : abbreviationMap[entry.type];

  const backgroundColor = entry.type === 'zeit'
    ? getWorkTimeColor(entry.stunden)
    : colorMap[entry.type];

  const textColor = entry.type === 'krank' ? 'white' : 'black';

  return (
    <div 
      className={cn(
        "absolute bottom-0 left-0 right-0 text-xs font-medium text-center py-0.5 rounded-sm",
        entry.status === 'beantragt' && "opacity-60 border border-dashed border-gray-400"
      )}
      style={{ backgroundColor, color: textColor }}
    >
      {abbreviation}
    </div>
  );
};

/**
 * Generate tooltip content for calendar entries
 */
const getTooltipContent = (entry: CalendarEntry) => {
  let content = `${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}`;
  if (entry.type === 'zeit' && entry.stunden) {
    content += ` (${entry.stunden}h)`;
  }
  if (entry.status) {
    content += ` - ${entry.status}`;
  }
  return content;
};

const HEADER_BASE_CLASS = "border-b border-gray-200 text-center";
const TODAY_HIGHLIGHT_CLASS = "bg-blue-50";

const MonthHeaderCell: React.FC<{ date: Date }> = ({ date }) => (
  <th
    key={date.toISOString()}
    className={cn(
      "p-1 text-xs font-medium text-gray-600 min-w-[40px]",
      HEADER_BASE_CLASS,
      isToday(date) && TODAY_HIGHLIGHT_CLASS
    )}
  >
    <div>{format(date, 'EEE', { locale: de })}</div>
    <div className="text-sm font-semibold">{format(date, 'd')}</div>
  </th>
);

const YearHeaderCells: React.FC<{ selectedMonth: Date }> = ({ selectedMonth }) => (
  <>
    {Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(selectedMonth.getFullYear(), i, 1);
      const daysInMonth = new Date(selectedMonth.getFullYear(), i + 1, 0).getDate();
      return (
        <th
          key={i}
          colSpan={daysInMonth}
          className={cn("p-2 text-sm font-medium text-gray-700", HEADER_BASE_CLASS)}
        >
          {format(monthDate, 'MMM', { locale: de })}
        </th>
      );
    })}
  </>
);

const YearDateRow: React.FC<{ dateRange: Date[] }> = ({ dateRange }) => (
  <tr>
    <th className="sticky left-0 bg-white z-10 border-b border-r border-gray-200"></th>
    {dateRange.map((date) => (
      <th
        key={date.toISOString()}
        className={cn(
          "p-0.5 text-xs font-normal text-gray-500 min-w-[25px]",
          HEADER_BASE_CLASS,
          isToday(date) && TODAY_HIGHLIGHT_CLASS
        )}
      >
        {format(date, 'd')}
      </th>
    ))}
  </tr>
);

const TableHeader: React.FC<{
  view: 'monat' | 'jahr';
  dateRange: Date[];
  selectedMonth: Date;
}> = ({ view, dateRange, selectedMonth }) => (
  <thead>
    <tr>
      <th className="sticky left-0 bg-white z-10 p-2 border-b border-r border-gray-200 text-left text-sm font-medium text-gray-700 min-w-[150px]">
        Mitarbeiter
      </th>
      {view === 'monat' && dateRange.map((date) => (
        <MonthHeaderCell key={date.toISOString()} date={date} />
      ))}
      {view === 'jahr' && <YearHeaderCells selectedMonth={selectedMonth} />}
    </tr>
    {view === 'jahr' && <YearDateRow dateRange={dateRange} />}
  </thead>
);

const CalendarCell: React.FC<{
  user: { userId: string; userName: string };
  date: Date;
  view: 'monat' | 'jahr';
  filteredEntries: Map<string, CalendarEntry>;
  hoveredCell: { userId: string; date: string } | null;
  onCellClick?: (userId: string, date: string) => void;
  onCellHover: (userId: string, date: string) => void;
  onCellLeave: () => void;
}> = ({ user, date, view, filteredEntries, hoveredCell, onCellClick, onCellHover, onCellLeave }) => {
  const entry = getEntry(user.userId, date, filteredEntries);
  const isHovered = hoveredCell?.userId === user.userId && hoveredCell?.date === format(date, DATE_FORMAT);

  return (
    <td
      key={date.toISOString()}
      className={cn(
        "relative p-0 border border-gray-100 cursor-pointer transition-colors",
        view === 'monat' ? "h-12" : "h-8",
        isToday(date) && TODAY_HIGHLIGHT_CLASS,
        isHovered && "bg-gray-100",
        date.getDay() === 0 || date.getDay() === 6 ? "bg-gray-50" : ""
      )}
      onClick={() => onCellClick?.(user.userId, format(date, DATE_FORMAT))}
      onMouseEnter={() => onCellHover(user.userId, format(date, DATE_FORMAT))}
      onMouseLeave={onCellLeave}
    >
      {view === 'monat' && (
        <div className="text-xs text-gray-400 text-center mt-0.5">
          {format(date, 'd')}
        </div>
      )}
      {getCellContent(entry)}
      {entry && isHovered && (
        <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          {getTooltipContent(entry)}
        </div>
      )}
    </td>
  );
};

const UserRow: React.FC<{
  user: { userId: string; userName: string };
  dateRange: Date[];
  view: 'monat' | 'jahr';
  filteredEntries: Map<string, CalendarEntry>;
  hoveredCell: { userId: string; date: string } | null;
  onCellClick?: (userId: string, date: string) => void;
  onCellHover: (userId: string, date: string) => void;
  onCellLeave: () => void;
}> = ({ user, dateRange, view, filteredEntries, hoveredCell, onCellClick, onCellHover, onCellLeave }) => (
  <tr key={user.userId} className="hover:bg-gray-50">
    <td className="sticky left-0 bg-white z-10 p-2 border-r border-gray-200 text-sm font-medium text-gray-900 whitespace-nowrap">
      {user.userName}
    </td>
    {dateRange.map((date) => (
      <CalendarCell
        key={date.toISOString()}
        user={user}
        date={date}
        view={view}
        filteredEntries={filteredEntries}
        hoveredCell={hoveredCell}
        onCellClick={onCellClick}
        onCellHover={onCellHover}
        onCellLeave={onCellLeave}
      />
    ))}
  </tr>
);

export const TeamCalendarGrid: React.FC<TeamCalendarGridProps> = ({
  view,
  dateRange,
  users,
  filteredEntries,
  selectedMonth,
  hoveredCell,
  onCellClick,
  onCellHover,
  onCellLeave
}) => (
  <div className={cn(
    "overflow-x-auto border border-gray-200 rounded-lg",
    view === 'jahr' && "max-w-full"
  )}>
    <table className="w-full border-collapse">
      <TableHeader view={view} dateRange={dateRange} selectedMonth={selectedMonth} />
      <tbody>
        {users.map((user) => (
          <UserRow
            key={user.userId}
            user={user}
            dateRange={dateRange}
            view={view}
            filteredEntries={filteredEntries}
            hoveredCell={hoveredCell}
            onCellClick={onCellClick}
            onCellHover={onCellHover}
            onCellLeave={onCellLeave}
          />
        ))}
      </tbody>
    </table>
  </div>
);