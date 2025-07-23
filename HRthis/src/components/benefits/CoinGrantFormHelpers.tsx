import React from 'react';

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

const availableUsers = [
  { id: '1', name: 'Max M.' },
  { id: '2', name: 'Anna A.' },
  { id: '3', name: 'Tom K.' },
  { id: '4', name: 'Lisa S.' },
  { id: '5', name: 'Julia B.' },
  { id: '6', name: 'Marco L.' }
];

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

export const renderUserSelection = (selectedUserId: string, setSelectedUserId: (value: string) => void) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Mitarbeiter auswählen
    </label>
    <select
      value={selectedUserId}
      onChange={(e) => setSelectedUserId(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Mitarbeiter auswählen...</option>
      {availableUsers.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  </div>
);

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