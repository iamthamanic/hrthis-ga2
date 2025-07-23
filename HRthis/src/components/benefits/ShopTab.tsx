import React, { useState } from 'react';

import type { ShopBenefit, ShopStore } from '../../state/shop';

import { BenefitCard } from './BenefitCard';
import { BenefitForm } from './BenefitForm';
import { CoinEventProgress } from './CoinEventProgress';

interface ShopTabProps {
  userBalance: number;
  isAdmin: boolean;
  shopStore: ShopStore;
  onPurchase: (benefitId: string, coinCost: number) => Promise<void>;
  onError: (error: string) => void;
}

const handleEditBenefit = (benefit: ShopBenefit, setEditingBenefit: (benefit: ShopBenefit | null) => void, setShowBenefitForm: (show: boolean) => void) => {
  setEditingBenefit(benefit);
  setShowBenefitForm(true);
};

const handleDeleteBenefit = async (benefitId: string, shopStore: ShopStore, onError: (error: string) => void) => {
  // TODO: Replace with modal confirmation component
  // if (window.confirm('Sind Sie sicher, dass Sie dieses Benefit löschen möchten?')) {
    try {
      await shopStore.deleteBenefit(benefitId);
    } catch (error) {
      onError('Fehler beim Löschen des Benefits');
    }
  // }
};

const resetBenefitForm = (setShowBenefitForm: (show: boolean) => void, setEditingBenefit: (benefit: ShopBenefit | null) => void) => {
  setShowBenefitForm(false);
  setEditingBenefit(null);
};

const renderShopHeader = (isAdmin: boolean, setShowBenefitForm: (show: boolean) => void) => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
    {isAdmin && (
      <button
        onClick={() => setShowBenefitForm(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        + Neues Benefit
      </button>
    )}
  </div>
);

const renderBenefitForm = (props: {
  showBenefitForm: boolean;
  isAdmin: boolean;
  editingBenefit: ShopBenefit | null;
  shopStore: ShopStore;
  resetFormCallback: () => void;
  onError: (error: string) => void;
}) => (
  props.showBenefitForm && props.isAdmin ? (
    <BenefitForm
      editingBenefit={props.editingBenefit}
      shopStore={props.shopStore}
      onClose={props.resetFormCallback}
      onError={props.onError}
    />
  ) : null
);

const renderBenefitsGrid = (props: {
  shopStore: ShopStore;
  userBalance: number;
  isAdmin: boolean;
  onPurchase: (benefitId: string, coinCost: number) => Promise<void>;
  onEditBenefit: (benefit: ShopBenefit) => void;
  onDeleteBenefit: (benefitId: string) => void;
}) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {props.shopStore.getActiveBenefits().map((benefit: ShopBenefit) => (
      <BenefitCard
        key={benefit.id}
        benefit={benefit}
        userBalance={props.userBalance}
        isAdmin={props.isAdmin}
        onPurchase={props.onPurchase}
        onEdit={props.onEditBenefit}
        onDelete={props.onDeleteBenefit}
      />
    ))}
  </div>
);

export const ShopTab: React.FC<ShopTabProps> = ({
  userBalance,
  isAdmin,
  shopStore,
  onPurchase,
  onError
}) => {
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<ShopBenefit | null>(null);

  const onEditBenefit = (benefit: ShopBenefit) => handleEditBenefit(benefit, setEditingBenefit, setShowBenefitForm);
  const onDeleteBenefit = (benefitId: string) => handleDeleteBenefit(benefitId, shopStore, onError);
  const resetFormCallback = () => resetBenefitForm(setShowBenefitForm, setEditingBenefit);

  return (
    <div className="space-y-4">
      <CoinEventProgress userBalance={userBalance} />
      {renderShopHeader(isAdmin, setShowBenefitForm)}
      {renderBenefitForm({ showBenefitForm, isAdmin, editingBenefit, shopStore, resetFormCallback, onError })}
      {renderBenefitsGrid({ shopStore, userBalance, isAdmin, onPurchase, onEditBenefit, onDeleteBenefit })}
    </div>
  );
};