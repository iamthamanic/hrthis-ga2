import React, { useState, useEffect } from 'react';

import type { CoinEvent } from '../../state/coinEvents';
import { cn } from '../../utils/cn';

interface EventsStore {
  addEvent: (event: Omit<CoinEvent, 'id' | 'createdAt'>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<CoinEvent>) => Promise<void>;
  isLoading: boolean;
}

interface CoinEventFormProps {
  editingEvent: CoinEvent | null;
  eventsStore: EventsStore;
  onClose: () => void;
  onError: (error: string) => void;
}

interface EventFormData {
  title: string;
  description: string;
  requiredCoins: string;
  reward: string;
}

const validateEventForm = (formData: EventFormData): string | null => {
  const { title, description, requiredCoins, reward } = formData;
  
  if (!title || !description || !requiredCoins || !reward) {
    return 'Bitte füllen Sie alle Felder aus';
  }
  
  const parsedCoins = parseInt(requiredCoins);
  if (isNaN(parsedCoins) || parsedCoins <= 0) {
    return 'Bitte geben Sie eine gültige Coin-Anzahl ein';
  }
  
  return null;
};

const createEventData = (formData: EventFormData) => ({
  title: formData.title,
  description: formData.description,
  requiredCoins: parseInt(formData.requiredCoins),
  reward: formData.reward
});

const useEventForm = (editingEvent: CoinEvent | null) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventRequiredCoins, setEventRequiredCoins] = useState('');
  const [eventReward, setEventReward] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setEventTitle(editingEvent.title);
      setEventDescription(editingEvent.description);
      setEventRequiredCoins(editingEvent.requiredCoins.toString());
      setEventReward(editingEvent.reward);
    }
  }, [editingEvent]);

  return {
    eventTitle, setEventTitle,
    eventDescription, setEventDescription,
    eventRequiredCoins, setEventRequiredCoins,
    eventReward, setEventReward
  };
};

const renderEventFormHeader = (editingEvent: CoinEvent | null, onClose: () => void) => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold text-gray-900">
      {editingEvent ? 'Event bearbeiten' : 'Neues Event erstellen'}
    </h3>
    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
  </div>
);

const renderEventBasicFields = (formState: ReturnType<typeof useEventForm>, inputClassName: string, labelClassName: string) => (
  <>
    <div>
      <label className={labelClassName}>Titel</label>
      <input
        type="text"
        value={formState.eventTitle}
        onChange={(e) => formState.setEventTitle(e.target.value)}
        className={inputClassName}
        placeholder="z.B. Bronze Status"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>Beschreibung</label>
      <textarea
        value={formState.eventDescription}
        onChange={(e) => formState.setEventDescription(e.target.value)}
        className={`${inputClassName} h-20 resize-none`}
        placeholder="Beschreibung des Events..."
        required
      />
    </div>
  </>
);

const renderEventDetailsFields = (formState: ReturnType<typeof useEventForm>, inputClassName: string, labelClassName: string) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className={labelClassName}>Benötigte Coins</label>
      <input
        type="number"
        value={formState.eventRequiredCoins}
        onChange={(e) => formState.setEventRequiredCoins(e.target.value)}
        className={inputClassName}
        placeholder="z.B. 100"
        min="1"
        required
      />
    </div>
    <div>
      <label className={labelClassName}>Belohnung</label>
      <input
        type="text"
        value={formState.eventReward}
        onChange={(e) => formState.setEventReward(e.target.value)}
        className={inputClassName}
        placeholder="z.B. Exklusiver Badge + 5% Rabatt"
        required
      />
    </div>
  </div>
);

const renderEventFormButtons = (onClose: () => void, eventsStore: EventsStore, editingEvent: CoinEvent | null) => (
  <div className="flex space-x-3">
    <button
      type="button"
      onClick={onClose}
      className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
    >
      Abbrechen
    </button>
    <button
      type="submit"
      disabled={eventsStore.isLoading}
      className={cn(
        "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
        eventsStore.isLoading 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-purple-600 text-white hover:bg-purple-700"
      )}
    >
      {eventsStore.isLoading ? 'Speichert...' : editingEvent ? 'Aktualisieren' : 'Erstellen'}
    </button>
  </div>
);

export const CoinEventForm: React.FC<CoinEventFormProps> = ({
  editingEvent,
  eventsStore,
  onClose,
  onError
}) => {
  const formState = useEventForm(editingEvent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: EventFormData = {
      title: formState.eventTitle,
      description: formState.eventDescription,
      requiredCoins: formState.eventRequiredCoins,
      reward: formState.eventReward
    };

    const validationError = validateEventForm(formData);
    if (validationError) {
      onError(validationError);
      return;
    }

    try {
      const eventData = createEventData(formData);
      
      if (editingEvent) {
        await eventsStore.updateEvent(editingEvent.id, eventData);
      } else {
        await eventsStore.addEvent({ ...eventData, isActive: true });
      }
      
      onClose();
    } catch (error) {
      onError('Fehler beim Speichern des Events');
    }
  };

  const inputClassName = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500";
  const labelClassName = "text-sm font-medium text-gray-700 mb-2 block";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border-2 border-purple-200 mb-4">
      {renderEventFormHeader(editingEvent, onClose)}
      {renderEventBasicFields(formState, inputClassName, labelClassName)}
      {renderEventDetailsFields(formState, inputClassName, labelClassName)}
      {renderEventFormButtons(onClose, eventsStore, editingEvent)}
    </form>
  );
};