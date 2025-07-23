import React, { useState } from 'react';

import type { CoinEvent, EventsStore } from '../../state/coinEvents';
import type { CoinsStore } from '../../state/coins';
import type { User } from '../../types';

import { CoinEventForm } from './CoinEventForm';
import { CoinGrantForm } from './CoinGrantForm';

interface ManageTabProps {
  user: User;
  coinsStore: CoinsStore;
  eventsStore: EventsStore;
  onError: (error: string) => void;
}

const handleEditEvent = (event: CoinEvent, setEditingEvent: (event: CoinEvent | null) => void, setShowEventForm: (show: boolean) => void) => {
  setEditingEvent(event);
  setShowEventForm(true);
};

const handleDeleteEvent = async (eventId: string, eventsStore: EventsStore, onError: (error: string) => void) => {
  // TODO: Replace with modal confirmation component
  // if (window.confirm('Sind Sie sicher, dass Sie dieses Event löschen möchten?')) {
    try {
      await eventsStore.deleteEvent(eventId);
    } catch (error) {
      onError('Fehler beim Löschen des Events');
    }
  // }
};

const resetEventForm = (setShowEventForm: (show: boolean) => void, setEditingEvent: (event: CoinEvent | null) => void) => {
  setShowEventForm(false);
  setEditingEvent(null);
};

const renderCoinGrantSection = (user: User, coinsStore: CoinsStore, onError: (error: string) => void) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Coins verteilen</h2>
    <CoinGrantForm
      user={user}
      coinsStore={coinsStore}
      onError={onError}
    />
  </div>
);

const renderEventManagementHeader = (setShowEventForm: (show: boolean) => void) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-gray-900">Coin Events verwalten</h2>
    <button
      onClick={() => setShowEventForm(true)}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
    >
      + Neues Event
    </button>
  </div>
);

const renderEventForm = (props: {
  showEventForm: boolean;
  editingEvent: CoinEvent | null;
  eventsStore: EventsStore;
  resetFormCallback: () => void;
  onError: (error: string) => void;
}) => (
  props.showEventForm ? (
    <CoinEventForm
      editingEvent={props.editingEvent}
      eventsStore={props.eventsStore}
      onClose={props.resetFormCallback}
      onError={props.onError}
    />
  ) : null
);

const renderEventsList = (eventsStore: EventsStore, onEditEvent: (event: CoinEvent) => void, onDeleteEvent: (eventId: string) => void) => (
  <div className="space-y-3">
    {eventsStore.getActiveEvents().map((event: CoinEvent) => (
      <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium text-purple-600">
                🎯 {event.requiredCoins} Coins benötigt
              </span>
              <span className="text-sm text-gray-500">
                🎁 {event.reward}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEditEvent(event)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              ✏️
            </button>
            <button
              onClick={() => onDeleteEvent(event.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ManageTab: React.FC<ManageTabProps> = ({
  user,
  coinsStore,
  eventsStore,
  onError
}) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CoinEvent | null>(null);

  const onEditEvent = (event: CoinEvent) => handleEditEvent(event, setEditingEvent, setShowEventForm);
  const onDeleteEvent = (eventId: string) => handleDeleteEvent(eventId, eventsStore, onError);
  const resetFormCallback = () => resetEventForm(setShowEventForm, setEditingEvent);

  return (
    <div className="space-y-6">
      {renderCoinGrantSection(user, coinsStore, onError)}
      
      <div>
        {renderEventManagementHeader(setShowEventForm)}
        {renderEventForm({ showEventForm, editingEvent, eventsStore, resetFormCallback, onError })}
        {renderEventsList(eventsStore, onEditEvent, onDeleteEvent)}
      </div>
    </div>
  );
};