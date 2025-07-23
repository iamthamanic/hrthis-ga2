import React, { useState } from 'react';

import type { CoinTransaction, CoinsStore } from '../../state/coins';
import type { User } from '../../types';
import { cn } from '../../utils/cn';

interface HistoryTabProps {
  isAdmin: boolean;
  user: User;
  coinsStore: CoinsStore;
}

const availableUsers = [
  { id: '1', name: 'Max M.' },
  { id: '2', name: 'Anna A.' },
  { id: '3', name: 'Tom K.' },
  { id: '4', name: 'Lisa S.' },
  { id: '5', name: 'Julia B.' },
  { id: '6', name: 'Marco L.' }
];

const getUserName = (userId: string): string => {
  const names: { [key: string]: string } = {
    '1': 'Max M.',
    '2': 'Anna A.',
    '3': 'Tom K.',
    '4': 'Lisa S.',
    '5': 'Julia B.',
    '6': 'Marco L.'
  };
  return names[userId] || 'Unbekannt';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTransactions = (isAdmin: boolean, selectedUserId: string, coinsStore: CoinsStore, user: User) => {
  if (isAdmin) {
    if (selectedUserId) {
      return coinsStore.getUserTransactions(selectedUserId);
    } else {
      return coinsStore.getAllTransactions();
    }
  } else {
    return coinsStore.getUserTransactions(user.id);
  }
};

const getTransactionTypeStyle = (type: string) => {
  switch (type) {
    case 'BENEFIT_PURCHASE':
      return 'px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full';
    case 'ADMIN_GRANT':
      return 'px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full';
    case 'RULE_EARNED':
      return 'px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full';
    default:
      return 'px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full';
  }
};

const getTransactionTypeLabel = (type: string) => {
  switch (type) {
    case 'BENEFIT_PURCHASE':
      return 'Kauf';
    case 'ADMIN_GRANT':
      return 'Vergabe';
    case 'RULE_EARNED':
      return 'Verdient';
    default:
      return 'Unbekannt';
  }
};

const renderHeader = (isAdmin: boolean, selectedUserId: string, setSelectedUserId: (value: string) => void) => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-900">
      {isAdmin ? 'Coin-Historie' : 'Meine Coin-Historie'}
    </h2>
    
    {isAdmin && (
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Alle Mitarbeiter</option>
        {availableUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    )}
  </div>
);

const renderTransactionItem = (transaction: CoinTransaction, isAdmin: boolean, selectedUserId: string) => (
  <div key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-gray-900">{transaction.reason}</p>
          <span className={getTransactionTypeStyle(transaction.type)}>
            {getTransactionTypeLabel(transaction.type)}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {formatDate(transaction.createdAt)}
          {transaction.adminId && ` • von ${getUserName(transaction.adminId)}`}
          {isAdmin && !selectedUserId && ` • ${getUserName(transaction.userId)}`}
        </p>
      </div>
      <div className="text-right">
        <p className={cn(
          "text-lg font-bold",
          transaction.amount > 0 ? "text-green-600" : "text-red-600"
        )}>
          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
        </p>
        <p className="text-xs text-gray-500">Coins</p>
      </div>
    </div>
  </div>
);

const renderTransactionsList = (transactions: CoinTransaction[], isAdmin: boolean, selectedUserId: string) => (
  <div className="space-y-3">
    {transactions.map((transaction: CoinTransaction) => renderTransactionItem(transaction, isAdmin, selectedUserId))}
  </div>
);

const renderEmptyState = (isAdmin: boolean, selectedUserId: string) => (
  <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-sm">
    <span className="text-4xl mb-4">📊</span>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Keine Transaktionen
    </h3>
    <p className="text-gray-600 text-center">
      {isAdmin && selectedUserId 
        ? `${getUserName(selectedUserId)} hat noch keine Coin-Transaktionen.`
        : isAdmin 
          ? 'Es gibt noch keine Coin-Transaktionen im System.'
          : 'Sie haben noch keine Coin-Transaktionen.'
      }
    </p>
  </div>
);

export const HistoryTab: React.FC<HistoryTabProps> = ({
  isAdmin,
  user,
  coinsStore
}) => {
  const [selectedHistoryUserId, setSelectedHistoryUserId] = useState('');

  const transactions = getTransactions(isAdmin, selectedHistoryUserId, coinsStore, user);

  return (
    <div className="space-y-4">
      {renderHeader(isAdmin, selectedHistoryUserId, setSelectedHistoryUserId)}
      {transactions.length > 0 
        ? renderTransactionsList(transactions, isAdmin, selectedHistoryUserId)
        : renderEmptyState(isAdmin, selectedHistoryUserId)
      }
    </div>
  );
};