import React from 'react';
import { CalendarDay, CalendarViewMode } from '../../types/calendar';
import { LeaveRequest, TimeRecord } from '../../types';

interface Reminder {
  id: string;
  message: string;
  date: string;
  userId: string;
}

interface DayDetailModalProps {
  selectedDay: CalendarDay | null;
  viewMode: CalendarViewMode;
  getUserName: (userId: string) => string;
  onClose: () => void;
}

const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('de-DE', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const ModalHeader: React.FC<{ selectedDay: CalendarDay; onClose: () => void }> = ({ selectedDay, onClose }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold">
      {formatDate(selectedDay.date)}
    </h3>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600"
    >
      ✕
    </button>
  </div>
);

const UserLeaveEvents: React.FC<{ leaves: LeaveRequest[] }> = ({ leaves }) => (
  <>
    {leaves.map(leave => (
      <div key={leave.id} className="p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <span className="text-2xl mr-3">
            {leave.type === 'VACATION' ? '🏖️' : '🏥'}
          </span>
          <div>
            <p className="font-medium">
              {leave.type === 'VACATION' ? 'Urlaub' : 'Krankheit'}
            </p>
            {leave.comment && (
              <p className="text-sm text-gray-600">{leave.comment}</p>
            )}
          </div>
        </div>
      </div>
    ))}
  </>
);

const TimeRecordEvent: React.FC<{ timeRecord: TimeRecord }> = ({ timeRecord }) => (
  <div className="p-3 bg-green-50 rounded-lg">
    <div className="flex items-center">
      <span className="text-2xl mr-3">⏰</span>
      <div>
        <p className="font-medium">
          {timeRecord.totalHours.toFixed(1)}h gearbeitet
        </p>
        <p className="text-sm text-gray-600">
          {timeRecord.timeIn} - {timeRecord.timeOut || 'läuft'}
          {timeRecord.breakMinutes > 0 && (
            <span> (Pause: {timeRecord.breakMinutes}min)</span>
          )}
        </p>
      </div>
    </div>
  </div>
);

const TeamLeaveEvents: React.FC<{ leaves: LeaveRequest[]; getUserName: (userId: string) => string }> = ({ leaves, getUserName }) => (
  <>
    {leaves.map(leave => (
      <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <span className="text-2xl mr-3">
            {leave.type === 'VACATION' ? '🏖️' : '🏥'}
          </span>
          <div>
            <p className="font-medium">
              {getUserName(leave.userId)} - {leave.type === 'VACATION' ? 'Urlaub' : 'Krankheit'}
            </p>
            {leave.comment && (
              <p className="text-sm text-gray-600">{leave.comment}</p>
            )}
          </div>
        </div>
      </div>
    ))}
  </>
);

const ReminderEvents: React.FC<{ reminders: Reminder[] }> = ({ reminders }) => (
  <>
    {reminders.map(reminder => (
      <div key={reminder.id} className="p-3 bg-orange-50 rounded-lg">
        <div className="flex items-center">
          <span className="text-2xl mr-3">🔔</span>
          <div>
            <p className="font-medium">Erinnerung</p>
            <p className="text-sm text-gray-600">{reminder.message}</p>
          </div>
        </div>
      </div>
    ))}
  </>
);

const EmptyState: React.FC<{ selectedDay: CalendarDay }> = ({ selectedDay }) => {
  const hasEvents = (selectedDay.userLeaves?.length || 0) > 0 || 
                   selectedDay.userTimeRecord || 
                   (selectedDay.leaves?.length || 0) > 0 || 
                   (selectedDay.reminders?.length || 0) > 0;

  if (hasEvents) return null;

  return (
    <div className="text-center py-4">
      <p className="text-gray-500">Keine Ereignisse für diesen Tag</p>
    </div>
  );
};

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  selectedDay,
  viewMode,
  getUserName,
  onClose
}) => {
  if (!selectedDay) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <ModalHeader selectedDay={selectedDay} onClose={onClose} />
        
        <div className="space-y-3">
          {selectedDay.userLeaves && (
            <UserLeaveEvents leaves={selectedDay.userLeaves} />
          )}
          
          {selectedDay.userTimeRecord && (
            <TimeRecordEvent timeRecord={selectedDay.userTimeRecord} />
          )}
          
          {viewMode === 'team' && selectedDay.leaves && (
            <TeamLeaveEvents leaves={selectedDay.leaves} getUserName={getUserName} />
          )}
          
          {selectedDay.reminders && (
            <ReminderEvents reminders={selectedDay.reminders} />
          )}
          
          <EmptyState selectedDay={selectedDay} />
        </div>
      </div>
    </div>
  );
};