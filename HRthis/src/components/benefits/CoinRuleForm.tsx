import React, { useState, useEffect } from 'react';

import type { CoinRule } from '../../state/coins';
import { cn } from '../../utils/cn';

interface CoinsStore {
  addCoinRule: (rule: Omit<CoinRule, 'id' | 'createdAt'>) => Promise<void>;
  updateCoinRule: (ruleId: string, updates: Partial<CoinRule>) => Promise<void>;
  isLoading: boolean;
}

interface CoinRuleFormProps {
  editingRule: CoinRule | null;
  coinsStore: CoinsStore;
  onClose: () => void;
  onError: (error: string) => void;
}

interface RuleFormData {
  title: string;
  description: string;
  amount: string;
}

const validateRuleForm = (formData: RuleFormData): string | null => {
  if (!formData.title || !formData.description || !formData.amount) {
    return 'Bitte füllen Sie alle Felder aus';
  }

  const amount = parseInt(formData.amount);
  if (isNaN(amount) || amount <= 0) {
    return 'Bitte geben Sie eine gültige Coin-Anzahl ein';
  }

  return null;
};

const createRuleData = (formData: RuleFormData) => ({
  title: formData.title,
  description: formData.description,
  coinAmount: parseInt(formData.amount)
});

const useRuleForm = (editingRule: CoinRule | null) => {
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [ruleAmount, setRuleAmount] = useState('');

  useEffect(() => {
    if (editingRule) {
      setRuleTitle(editingRule.title);
      setRuleDescription(editingRule.description);
      setRuleAmount(editingRule.coinAmount.toString());
    }
  }, [editingRule]);

  return {
    ruleTitle, setRuleTitle,
    ruleDescription, setRuleDescription,
    ruleAmount, setRuleAmount
  };
};

const renderRuleFormHeader = (editingRule: CoinRule | null, onClose: () => void) => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold text-gray-900">
      {editingRule ? 'Regel bearbeiten' : 'Neue Regel erstellen'}
    </h3>
    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
  </div>
);

const renderRuleFormFields = (formState: ReturnType<typeof useRuleForm>, inputClassName: string, labelClassName: string) => (
  <>
    <div>
      <label className={labelClassName}>Titel</label>
      <input
        type="text"
        value={formState.ruleTitle}
        onChange={(e) => formState.setRuleTitle(e.target.value)}
        className={inputClassName}
        placeholder="z.B. Schulung abgeschlossen"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>Beschreibung</label>
      <textarea
        value={formState.ruleDescription}
        onChange={(e) => formState.setRuleDescription(e.target.value)}
        className={`${inputClassName} h-20 resize-none`}
        placeholder="Beschreibung der Regel..."
        required
      />
    </div>

    <div>
      <label className={labelClassName}>Coin-Anzahl</label>
      <input
        type="number"
        value={formState.ruleAmount}
        onChange={(e) => formState.setRuleAmount(e.target.value)}
        className={inputClassName}
        placeholder="z.B. 20"
        min="1"
        required
      />
    </div>
  </>
);

const renderRuleFormButtons = (onClose: () => void, coinsStore: CoinsStore, editingRule: CoinRule | null) => (
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
      disabled={coinsStore.isLoading}
      className={cn(
        "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
        coinsStore.isLoading 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      )}
    >
      {coinsStore.isLoading ? 'Speichert...' : editingRule ? 'Aktualisieren' : 'Erstellen'}
    </button>
  </div>
);

export const CoinRuleForm: React.FC<CoinRuleFormProps> = ({
  editingRule,
  coinsStore,
  onClose,
  onError
}) => {
  const formState = useRuleForm(editingRule);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: RuleFormData = {
      title: formState.ruleTitle,
      description: formState.ruleDescription,
      amount: formState.ruleAmount
    };

    const validationError = validateRuleForm(formData);
    if (validationError) {
      onError(validationError);
      return;
    }

    try {
      const ruleData = createRuleData(formData);
      
      if (editingRule) {
        await coinsStore.updateCoinRule(editingRule.id, ruleData);
      } else {
        await coinsStore.addCoinRule({ ...ruleData, isActive: true });
      }
      
      onClose();
    } catch (error) {
      onError('Fehler beim Speichern der Regel');
    }
  };

  const inputClassName = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClassName = "text-sm font-medium text-gray-700 mb-2 block";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border-2 border-blue-200">
      {renderRuleFormHeader(editingRule, onClose)}
      {renderRuleFormFields(formState, inputClassName, labelClassName)}
      {renderRuleFormButtons(onClose, coinsStore, editingRule)}
    </form>
  );
};