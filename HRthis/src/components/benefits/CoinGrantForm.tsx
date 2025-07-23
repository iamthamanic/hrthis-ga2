import React, { useState } from 'react';

import type { CoinRule } from '../../state/coins';
import type { User } from '../../types';

import { 
  validateGrantForm, 
  getAmountAndReason, 
  resetFormState, 
  renderUserSelection, 
  renderCustomReasonOption, 
  renderSubmitButton,
  type FormState 
} from './CoinGrantFormHelpers';

interface CoinsStore {
  getCoinRules: () => CoinRule[];
  grantCoins: (userId: string, amount: number, reason: string, adminId: string) => Promise<void>;
  isLoading: boolean;
}

interface CoinGrantFormProps {
  user: User;
  coinsStore: CoinsStore;
  onError: (error: string) => void;
}

const useGrantForm = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [coinAmount, setCoinAmount] = useState('');
  const [coinReason, setCoinReason] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [isCustomReason, setIsCustomReason] = useState(false);

  return {
    selectedUserId, setSelectedUserId,
    coinAmount, setCoinAmount,
    coinReason, setCoinReason,
    selectedRuleId, setSelectedRuleId,
    isCustomReason, setIsCustomReason
  };
};


interface RuleOptionsProps {
  coinsStore: CoinsStore;
  selectedRuleId: string;
  isCustomReason: boolean;
  setSelectedRuleId: (value: string) => void;
  setIsCustomReason: (value: boolean) => void;
}

const renderRuleOptions = ({
  coinsStore,
  selectedRuleId,
  isCustomReason,
  setSelectedRuleId,
  setIsCustomReason
}: RuleOptionsProps) => (
  <div className="space-y-2">
    {coinsStore.getCoinRules().map((rule: CoinRule) => (
      <label key={rule.id} className="flex items-start">
        <input
          type="radio"
          name="coinReason"
          value={rule.id}
          checked={selectedRuleId === rule.id && !isCustomReason}
          onChange={(e) => {
            setSelectedRuleId(e.target.value);
            setIsCustomReason(false);
          }}
          className="mt-1 mr-3"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-900">{rule.title}</p>
          <p className="text-sm text-gray-600">{rule.description}</p>
          <p className="text-sm font-semibold text-green-600">+{rule.coinAmount} Coins</p>
        </div>
      </label>
    ))}
  </div>
);


interface CustomFieldsProps {
  isCustomReason: boolean;
  coinAmount: string;
  setCoinAmount: (value: string) => void;
  coinReason: string;
  setCoinReason: (value: string) => void;
}

const renderCustomFields = ({
  isCustomReason,
  coinAmount,
  setCoinAmount,
  coinReason,
  setCoinReason
}: CustomFieldsProps) => (
  isCustomReason ? (
    <>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Anzahl Coins
        </label>
        <input
          type="number"
          value={coinAmount}
          onChange={(e) => setCoinAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="z.B. 25"
          min="1"
          required={isCustomReason}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Begründung
        </label>
        <textarea
          value={coinReason}
          onChange={(e) => setCoinReason(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Grund für die Coin-Vergabe..."
          required={isCustomReason}
        />
      </div>
    </>
  ) : null
);

interface GrantFormSubmitParams {
  e: React.FormEvent;
  formState: ReturnType<typeof useGrantForm>;
  user: User;
  coinsStore: CoinsStore;
  onError: (error: string) => void;
}

const handleGrantFormSubmit = async ({
  e,
  formState,
  user,
  coinsStore,
  onError
}: GrantFormSubmitParams) => {
  e.preventDefault();
  
  const formData: FormState = {
    selectedUserId: formState.selectedUserId,
    coinAmount: formState.coinAmount,
    coinReason: formState.coinReason,
    selectedRuleId: formState.selectedRuleId,
    isCustomReason: formState.isCustomReason
  };

  const validationError = validateGrantForm(formData);
  if (validationError) {
    onError(validationError);
    return;
  }

  const result = getAmountAndReason(formData, coinsStore);
  if ('error' in result) {
    onError(result.error);
    return;
  }

  try {
    await coinsStore.grantCoins(formState.selectedUserId, result.amount, result.reason, user.id);
    resetFormState({
      setSelectedUserId: formState.setSelectedUserId,
      setCoinAmount: formState.setCoinAmount,
      setCoinReason: formState.setCoinReason,
      setSelectedRuleId: formState.setSelectedRuleId,
      setIsCustomReason: formState.setIsCustomReason
    });
  } catch (error) {
    onError('Fehler beim Verteilen der Coins');
  }
};

const renderReasonSection = (formState: ReturnType<typeof useGrantForm>, coinsStore: CoinsStore) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Grund auswählen
    </label>
    <div className="space-y-2">
      {renderRuleOptions({
        coinsStore,
        selectedRuleId: formState.selectedRuleId,
        isCustomReason: formState.isCustomReason,
        setSelectedRuleId: formState.setSelectedRuleId,
        setIsCustomReason: formState.setIsCustomReason
      })}
      {renderCustomReasonOption(
        formState.isCustomReason,
        formState.setIsCustomReason,
        formState.setSelectedRuleId
      )}
    </div>
  </div>
);


export const CoinGrantForm: React.FC<CoinGrantFormProps> = ({
  user,
  coinsStore,
  onError
}) => {
  const formState = useGrantForm();

  const handleSubmit = (e: React.FormEvent) => 
    handleGrantFormSubmit({
      e,
      formState,
      user,
      coinsStore,
      onError
    });

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
      {renderUserSelection(formState.selectedUserId, formState.setSelectedUserId)}
      {renderReasonSection(formState, coinsStore)}
      {renderCustomFields({
        isCustomReason: formState.isCustomReason,
        coinAmount: formState.coinAmount,
        setCoinAmount: formState.setCoinAmount,
        coinReason: formState.coinReason,
        setCoinReason: formState.setCoinReason
      })}
      {renderSubmitButton(coinsStore)}
    </form>
  );
};