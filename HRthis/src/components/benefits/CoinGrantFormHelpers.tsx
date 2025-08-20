import React from 'react';

import { useEmployees } from '../../hooks/useEmployees';
import type { CoinRule } from '../../state/coins';
import { cn } from '../../utils/cn';

interface CoinsStore {
  getCoinRules: () => CoinRule[];
  isLoading: boolean;
}

interface FormState {
  selectedUserId: string;
  coinAmount: string;
  coinReason: string;
  selectedRuleId: string;
  isCustomReason: boolean;
}

// Moved to useEmployees hook - no longer needed

export const validateGrantForm = (formState: FormState): string | null => {
  if (!formState.selectedUserId) {
    return 'Bitte wählen Sie einen Mitarbeiter aus';
  }

  if (!formState.isCustomReason && !formState.selectedRuleId) {
    return 'Bitte wählen Sie eine Regel aus';
  }

  if (formState.isCustomReason && (!formState.coinAmount || !formState.coinReason)) {
    return 'Bitte geben Sie Anzahl und Begründung ein';
  }

  return null;
};

export const getAmountAndReason = (formState: FormState, coinsStore: CoinsStore): { amount: number; reason: string } | { error: string } => {
  if (formState.isCustomReason) {
    const amount = parseInt(formState.coinAmount);
    if (isNaN(amount) || amount <= 0) {
      return { error: 'Bitte geben Sie eine gültige Coin-Anzahl ein' };
    }
    return { amount, reason: formState.coinReason };
  } else {
    const selectedRule = coinsStore.getCoinRules().find((rule: CoinRule) => rule.id === formState.selectedRuleId);
    if (!selectedRule) {
      return { error: 'Ungültige Regel ausgewählt' };
    }
    return { amount: selectedRule.coinAmount, reason: selectedRule.title };
  }
};

export const resetFormState = (setters: {
  setSelectedUserId: (value: string) => void;
  setCoinAmount: (value: string) => void;
  setCoinReason: (value: string) => void;
  setSelectedRuleId: (value: string) => void;
  setIsCustomReason: (value: boolean) => void;
}) => {
  setters.setSelectedUserId('');
  setters.setCoinAmount('');
  setters.setCoinReason('');
  setters.setSelectedRuleId('');
  setters.setIsCustomReason(false);
};

// React Component für User Selection
export const UserSelection: React.FC<{
  selectedUserId: string;
  setSelectedUserId: (value: string) => void;
}> = ({ selectedUserId, setSelectedUserId }) => {
  const { employees, loading, error, isUsingRealAPI } = useEmployees();

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Mitarbeiter auswählen
        {isUsingRealAPI && (
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
            Live API
          </span>
        )}
      </label>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        disabled={loading}
      >
        <option value="">
          {loading ? 'Lade Mitarbeiter...' : 'Mitarbeiter auswählen...'}
        </option>
        {employees.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.department || 'Keine Abteilung'})
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error} - Fallback zu Mock-Daten
        </p>
      )}
      {!isUsingRealAPI && (
        <p className="mt-1 text-xs text-gray-500">
          Verwende Mock-Daten (REACT_APP_API_URL nicht gesetzt)
        </p>
      )}
    </div>
  );
};

export const renderCustomReasonOption = (
  isCustomReason: boolean,
  setIsCustomReason: (value: boolean) => void,
  setSelectedRuleId: (value: string) => void
) => (
  <label className="flex items-start">
    <input
      type="radio"
      name="coinReason"
      checked={isCustomReason}
      onChange={() => {
        setIsCustomReason(true);
        setSelectedRuleId('');
      }}
      className="mt-1 mr-3"
    />
    <div className="flex-1">
      <p className="font-medium text-gray-900">Eigene Begründung</p>
      <p className="text-sm text-gray-600">Geben Sie eine individuelle Begründung und Coin-Anzahl ein</p>
    </div>
  </label>
);

export const renderSubmitButton = (coinsStore: CoinsStore) => (
  <button
    type="submit"
    disabled={coinsStore.isLoading}
    className={cn(
      "w-full py-2 px-4 rounded-lg font-medium transition-colors",
      coinsStore.isLoading 
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    )}
  >
    {coinsStore.isLoading ? 'Verteilt...' : 'Coins verteilen'}
  </button>
);

export type { FormState };