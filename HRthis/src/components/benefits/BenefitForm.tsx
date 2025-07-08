import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { ShopBenefit } from '../../state/shop';

interface BenefitFormProps {
  editingBenefit: ShopBenefit | null;
  shopStore: any;
  onClose: () => void;
  onError: (error: string) => void;
}

interface FormData {
  title: string;
  description: string;
  cost: string;
  category: 'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER';
  stockLimit: string;
  unlimited: boolean;
}

const validateForm = (formData: FormData): string | null => {
  const { title, description, cost, category, stockLimit, unlimited } = formData;
  
  if (!title || !description || !cost || !category) {
    return 'Bitte füllen Sie alle Pflichtfelder aus';
  }
  
  const parsedCost = parseInt(cost);
  if (isNaN(parsedCost) || parsedCost <= 0) {
    return 'Bitte geben Sie einen gültigen Coin-Preis ein';
  }
  
  if (!unlimited) {
    const parsedStockLimit = parseInt(stockLimit);
    if (isNaN(parsedStockLimit) || parsedStockLimit <= 0) {
      return 'Bitte geben Sie einen gültigen Lagerbestand ein';
    }
  }
  
  return null;
};

const createBenefitData = (formData: FormData) => {
  const cost = parseInt(formData.cost);
  const stockLimit = formData.unlimited ? undefined : parseInt(formData.stockLimit);
  
  return {
    title: formData.title,
    description: formData.description,
    coinCost: cost,
    category: formData.category,
    stockLimit: stockLimit,
    currentStock: stockLimit
  };
};

const useBenefitForm = (editingBenefit: ShopBenefit | null) => {
  const [benefitTitle, setBenefitTitle] = useState('');
  const [benefitDescription, setBenefitDescription] = useState('');
  const [benefitCost, setBenefitCost] = useState('');
  const [benefitCategory, setBenefitCategory] = useState<'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER'>('WELLNESS');
  const [benefitStockLimit, setBenefitStockLimit] = useState('');
  const [benefitUnlimited, setBenefitUnlimited] = useState(true);

  useEffect(() => {
    if (editingBenefit) {
      setBenefitTitle(editingBenefit.title);
      setBenefitDescription(editingBenefit.description);
      setBenefitCost(editingBenefit.coinCost.toString());
      setBenefitCategory(editingBenefit.category);
      setBenefitUnlimited(!editingBenefit.stockLimit);
      setBenefitStockLimit(editingBenefit.stockLimit?.toString() || '');
    }
  }, [editingBenefit]);

  return {
    benefitTitle, setBenefitTitle,
    benefitDescription, setBenefitDescription,
    benefitCost, setBenefitCost,
    benefitCategory, setBenefitCategory,
    benefitStockLimit, setBenefitStockLimit,
    benefitUnlimited, setBenefitUnlimited
  };
};

interface FormSubmitParams {
  e: React.FormEvent;
  formData: FormData;
  editingBenefit: ShopBenefit | null;
  shopStore: any;
  handlers: {
    onClose: () => void;
    onError: (error: string) => void;
  };
}

const handleFormSubmit = async ({
  e,
  formData,
  editingBenefit,
  shopStore,
  handlers: { onClose, onError }
}: FormSubmitParams) => {
  e.preventDefault();

  const validationError = validateForm(formData);
  if (validationError) {
    onError(validationError);
    return;
  }

  try {
    const benefitData = createBenefitData(formData);
    
    if (editingBenefit) {
      await shopStore.updateBenefit(editingBenefit.id, benefitData);
    } else {
      await shopStore.addBenefit({ ...benefitData, isActive: true });
    }
    
    onClose();
  } catch (error) {
    onError('Fehler beim Speichern des Benefits');
  }
};

const renderFormHeader = (editingBenefit: ShopBenefit | null, onClose: () => void) => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold text-gray-900">
      {editingBenefit ? 'Benefit bearbeiten' : 'Neues Benefit erstellen'}
    </h3>
    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
  </div>
);

const renderBasicFields = (formState: ReturnType<typeof useBenefitForm>, inputClassName: string, labelClassName: string) => (
  <>
    <div>
      <label className={labelClassName}>Titel</label>
      <input
        type="text"
        value={formState.benefitTitle}
        onChange={(e) => formState.setBenefitTitle(e.target.value)}
        className={inputClassName}
        placeholder="z.B. Massage Gutschein"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>Beschreibung</label>
      <textarea
        value={formState.benefitDescription}
        onChange={(e) => formState.setBenefitDescription(e.target.value)}
        className={`${inputClassName} h-20 resize-none`}
        placeholder="Beschreibung des Benefits..."
        required
      />
    </div>
  </>
);

const renderPriceAndCategoryFields = (formState: ReturnType<typeof useBenefitForm>, inputClassName: string, labelClassName: string) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className={labelClassName}>Coin-Preis</label>
      <input
        type="number"
        value={formState.benefitCost}
        onChange={(e) => formState.setBenefitCost(e.target.value)}
        className={inputClassName}
        placeholder="z.B. 150"
        min="1"
        required
      />
    </div>
    <div>
      <label className={labelClassName}>Kategorie</label>
      <select
        value={formState.benefitCategory}
        onChange={(e) => formState.setBenefitCategory(e.target.value as 'WELLNESS' | 'FOOD' | 'TECH' | 'TIME_OFF' | 'OTHER')}
        className={inputClassName}
        required
      >
        <option value="WELLNESS">Wellness</option>
        <option value="FOOD">Essen & Trinken</option>
        <option value="TECH">Technologie</option>
        <option value="TIME_OFF">Freizeit</option>
        <option value="OTHER">Sonstiges</option>
      </select>
    </div>
  </div>
);

const renderStockFields = (formState: ReturnType<typeof useBenefitForm>, inputClassName: string) => (
  <div>
    <label className="flex items-center mb-2">
      <input
        type="checkbox"
        checked={formState.benefitUnlimited}
        onChange={(e) => formState.setBenefitUnlimited(e.target.checked)}
        className="mr-2"
      />
      <span className="text-sm font-medium text-gray-700">Unbegrenzter Lagerbestand</span>
    </label>
    {!formState.benefitUnlimited && (
      <input
        type="number"
        value={formState.benefitStockLimit}
        onChange={(e) => formState.setBenefitStockLimit(e.target.value)}
        className={inputClassName}
        placeholder="Lagerbestand (z.B. 10)"
        min="1"
        required
      />
    )}
  </div>
);

const renderFormButtons = (onClose: () => void, shopStore: any, editingBenefit: ShopBenefit | null) => (
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
      disabled={shopStore.isLoading}
      className={cn(
        "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
        shopStore.isLoading 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      )}
    >
      {shopStore.isLoading ? 'Speichert...' : editingBenefit ? 'Aktualisieren' : 'Erstellen'}
    </button>
  </div>
);

export const BenefitForm: React.FC<BenefitFormProps> = ({
  editingBenefit,
  shopStore,
  onClose,
  onError
}) => {
  const formState = useBenefitForm(editingBenefit);
  
  const handleSubmit = (e: React.FormEvent) => {
    const formData: FormData = {
      title: formState.benefitTitle,
      description: formState.benefitDescription,
      cost: formState.benefitCost,
      category: formState.benefitCategory,
      stockLimit: formState.benefitStockLimit,
      unlimited: formState.benefitUnlimited
    };
    
    return handleFormSubmit({
      e,
      formData,
      editingBenefit,
      shopStore,
      handlers: { onClose, onError }
    });
  };

  const inputClassName = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClassName = "text-sm font-medium text-gray-700 mb-2 block";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 border-2 border-blue-200">
      {renderFormHeader(editingBenefit, onClose)}
      {renderBasicFields(formState, inputClassName, labelClassName)}
      {renderPriceAndCategoryFields(formState, inputClassName, labelClassName)}
      {renderStockFields(formState, inputClassName)}
      {renderFormButtons(onClose, shopStore, editingBenefit)}
    </form>
  );
};