import React, { useState, useEffect } from 'react';

// Direct imports with explicit paths - v3
import { EarnTab } from '../components/benefits/EarnTab';
import { HistoryTab } from '../components/benefits/HistoryTab';
import { ManageTab } from '../components/benefits/ManageTab';
import { ShopTab } from '../components/benefits/ShopTab';
import { useAuthStore } from '../state/auth';
import { useCoinEventsStore, EventsStore } from '../state/coinEvents';
import { useCoinsStore, CoinsStore } from '../state/coins';
import { useShopStore, ShopStore } from '../state/shop';
import { User } from '../types';
import { cn } from '../utils/cn';

type TabType = 'shop' | 'earn' | 'history' | 'manage';

// Constants to avoid duplicate strings
const TAB_STYLES = {
  ACTIVE: "bg-blue-500 text-white",
  INACTIVE: "bg-transparent text-gray-700 hover:bg-gray-100"
} as const;

const ADMIN_ROLES: ReadonlyArray<'ADMIN' | 'SUPERADMIN'> = ['ADMIN', 'SUPERADMIN'] as const;

/**
 * Main benefits management screen
 * Provides interfaces for:
 * - Shopping for benefits with coins
 * - Viewing coin earning rules
 * - Transaction history
 * - Admin: Managing coins, benefits, rules, and events
 */
interface InitializeUserDataParams {
  user: User;
  coinsStore: CoinsStore;
  handlers: {
    setUserBalance: (balance: number) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    setActiveTab: (tab: TabType) => void;
  };
}

const initializeUserData = ({
  user,
  coinsStore,
  handlers: { setUserBalance, setIsAdmin, setActiveTab }
}: InitializeUserDataParams) => {
  const balance = coinsStore.getUserBalance(user.id);
  setUserBalance(balance.currentBalance);
  
  const adminStatus = (ADMIN_ROLES as readonly string[]).includes(user.role);
  setIsAdmin(adminStatus);
  
  // Default to shop for regular users, manage for admins
  if (adminStatus) {
    setActiveTab('manage');
  }
};

interface PurchaseBenefitParams {
  benefitId: string;
  coinCost: number;
  user: User;
  userBalance: number;
  stores: {
    shopStore: ShopStore;
    coinsStore: CoinsStore;
  };
  handlers: {
    setUserBalance: (balance: number) => void;
    setError: (error: string) => void;
  };
}

const handlePurchaseBenefit = async ({
  benefitId,
  coinCost,
  user,
  userBalance,
  stores: { shopStore, coinsStore },
  handlers: { setUserBalance, setError }
}: PurchaseBenefitParams) => {
  if (!user) return;
  
  if (userBalance < coinCost) {
    setError('Nicht genügend Coins für diesen Kauf');
    return;
  }

  try {
    await shopStore.purchaseBenefit(user.id, benefitId);
    const newBalance = coinsStore.getUserBalance(user.id);
    setUserBalance(newBalance.currentBalance);
  } catch (error) {
    setError('Fehler beim Kauf des Benefits');
  }
};

interface TabContentProps {
  activeTab: TabType;
  userBalance: number;
  isAdmin: boolean;
  user: User;
  stores: {
    shopStore: ShopStore;
    coinsStore: CoinsStore;
    eventsStore: EventsStore;
  };
  handlers: {
    onPurchaseBenefit: (benefitId: string, coinCost: number) => Promise<void>;
    setError: (error: string) => void;
  };
}

const renderTabContent = ({
  activeTab,
  userBalance,
  isAdmin,
  user,
  stores: { shopStore, coinsStore, eventsStore },
  handlers: { onPurchaseBenefit, setError }
}: TabContentProps) => {
  switch (activeTab) {
    case 'shop':
      return (
        <ShopTab
          userBalance={userBalance}
          isAdmin={isAdmin}
          shopStore={shopStore}
          onPurchase={onPurchaseBenefit}
          onError={setError}
        />
      );
    case 'earn':
      return (
        <EarnTab
          isAdmin={isAdmin}
          coinsStore={coinsStore}
          onError={setError}
        />
      );
    case 'history':
      return (
        <HistoryTab
          isAdmin={isAdmin}
          user={user}
          coinsStore={coinsStore}
        />
      );
    case 'manage':
      return isAdmin ? (
        <ManageTab
          user={user}
          coinsStore={coinsStore}
          eventsStore={eventsStore}
          onError={setError}
        />
      ) : null;
    default:
      return null;
  }
};

const renderHeader = (userBalance: number) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-xl font-bold text-gray-900">
      Benefits & Coins
    </h1>
    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
      <span className="text-sm text-gray-500">Meine Coins: </span>
      <span className="text-lg font-bold text-blue-600">{userBalance}</span>
    </div>
  </div>
);

const renderErrorMessage = (error: string) => (
  error ? (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
      <p className="text-red-800 text-sm">{error}</p>
    </div>
  ) : null
);

interface TabButtonProps {
  tabId: TabType;
  label: string;
  icon: string;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const renderTabButton = ({ tabId, label, icon, activeTab, setActiveTab }: TabButtonProps) => (
  <button
    onClick={() => setActiveTab(tabId)}
    className={cn(
      "flex-1 py-2 px-3 rounded-md transition-colors",
      activeTab === tabId ? TAB_STYLES.ACTIVE : TAB_STYLES.INACTIVE
    )}
  >
    <span className="text-center font-medium text-sm">
      {icon} {label}
    </span>
  </button>
);

const renderTabNavigation = (activeTab: TabType, isAdmin: boolean, setActiveTab: (tab: TabType) => void) => (
  <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
    {renderTabButton({ tabId: 'shop', label: 'Coins einlösen', icon: '🪙', activeTab, setActiveTab })}
    {renderTabButton({ tabId: 'earn', label: 'Coins bekommen', icon: '💰', activeTab, setActiveTab })}
    {renderTabButton({ tabId: 'history', label: 'Historie', icon: '📊', activeTab, setActiveTab })}
    {isAdmin && renderTabButton({ tabId: 'manage', label: 'Verwaltung', icon: '⚙️', activeTab, setActiveTab })}
  </div>
);

export const BenefitsScreen = () => {
  const { user } = useAuthStore();
  const coinsStore = useCoinsStore();
  const shopStore = useShopStore();
  const eventsStore = useCoinEventsStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('shop');
  const [userBalance, setUserBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      initializeUserData({
        user,
        coinsStore,
        handlers: { setUserBalance, setIsAdmin, setActiveTab }
      });
    }
  }, [user, coinsStore]);

  const onPurchaseBenefit = async (benefitId: string, coinCost: number) => 
    await handlePurchaseBenefit({
      benefitId,
      coinCost,
      user: user!,
      userBalance,
      stores: { shopStore, coinsStore },
      handlers: { setUserBalance, setError }
    });

  if (!user) return null;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {renderHeader(userBalance)}
        {renderErrorMessage(error)}
        {renderTabNavigation(activeTab, isAdmin, setActiveTab)}
        {renderTabContent({
          activeTab,
          userBalance,
          isAdmin,
          user,
          stores: { shopStore, coinsStore, eventsStore },
          handlers: { onPurchaseBenefit, setError }
        })}
      </div>
    </div>
  );
};