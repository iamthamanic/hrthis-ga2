import React, { useState } from 'react';

import type { CoinRule, CoinsStore } from '../../state/coins';

import { CoinRuleForm } from './CoinRuleForm';

interface EarnTabProps {
  isAdmin: boolean;
  coinsStore: CoinsStore;
  onError: (error: string) => void;
}

const handleEditRule = (rule: CoinRule, setEditingRule: (rule: CoinRule | null) => void, setShowRuleForm: (show: boolean) => void) => {
  setEditingRule(rule);
  setShowRuleForm(true);
};

const handleDeleteRule = async (ruleId: string, coinsStore: CoinsStore, onError: (error: string) => void) => {
  // TODO: Replace with modal confirmation component
  // if (window.confirm('Sind Sie sicher, dass Sie diese Regel löschen möchten?')) {
    try {
      await coinsStore.deleteCoinRule(ruleId);
    } catch (error) {
      onError('Fehler beim Löschen der Regel');
    }
  // }
};

const resetRuleForm = (setShowRuleForm: (show: boolean) => void, setEditingRule: (rule: CoinRule | null) => void) => {
  setShowRuleForm(false);
  setEditingRule(null);
};

const renderRuleHeader = (isAdmin: boolean, setShowRuleForm: (show: boolean) => void) => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-900">Wie bekomme ich Coins?</h2>
    {isAdmin && (
      <button
        onClick={() => setShowRuleForm(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        + Neue Regel
      </button>
    )}
  </div>
);

const renderRuleForm = (props: {
  showRuleForm: boolean;
  isAdmin: boolean;
  editingRule: CoinRule | null;
  coinsStore: CoinsStore;
  resetFormCallback: () => void;
  onError: (error: string) => void;
}) => (
  props.showRuleForm && props.isAdmin ? (
    <CoinRuleForm
      editingRule={props.editingRule}
      coinsStore={props.coinsStore}
      onClose={props.resetFormCallback}
      onError={props.onError}
    />
  ) : null
);

const renderRulesList = (props: {
  coinsStore: CoinsStore;
  isAdmin: boolean;
  onEditRule: (rule: CoinRule) => void;
  onDeleteRule: (ruleId: string) => void;
}) => (
  <div className="space-y-3">
    {props.coinsStore.getCoinRules().map((rule: CoinRule) => (
      <div key={rule.id} className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{rule.title}</h3>
            <p className="text-sm text-gray-600">{rule.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">+{rule.coinAmount}</p>
              <p className="text-xs text-gray-500">Coins</p>
            </div>
            {props.isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => props.onEditRule(rule)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => props.onDeleteRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const EarnTab: React.FC<EarnTabProps> = ({
  isAdmin,
  coinsStore,
  onError
}) => {
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<CoinRule | null>(null);

  const onEditRule = (rule: CoinRule) => handleEditRule(rule, setEditingRule, setShowRuleForm);
  const onDeleteRule = (ruleId: string) => handleDeleteRule(ruleId, coinsStore, onError);
  const resetFormCallback = () => resetRuleForm(setShowRuleForm, setEditingRule);

  return (
    <div className="space-y-4">
      {renderRuleHeader(isAdmin, setShowRuleForm)}
      {renderRuleForm({ showRuleForm, isAdmin, editingRule, coinsStore, resetFormCallback, onError })}
      {renderRulesList({ coinsStore, isAdmin, onEditRule, onDeleteRule })}
    </div>
  );
};