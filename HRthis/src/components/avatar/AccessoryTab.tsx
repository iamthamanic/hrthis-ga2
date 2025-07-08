import React from 'react';
import { Avatar, AvatarAccessory } from '../../types/learning';
import { cn } from '../../utils/cn';

interface AccessoryTabProps {
  accessories: AvatarAccessory[];
  previewAvatar: Avatar;
  ownedItems: string[];
  userCoins: number;
  onPreview: (accessory: AvatarAccessory) => void;
  onPurchase: (accessory: AvatarAccessory) => void;
  onRemove: (type: string) => void;
}

const getTypeLabel = (type: string) => {
  const labels = {
    hat: 'Kopfbedeckungen',
    glasses: 'Brillen',
    clothing: 'Kleidung'
  };
  return labels[type as keyof typeof labels] || type;
};

const AccessoryButton: React.FC<{
  accessory: AvatarAccessory;
  owned: boolean;
  equipped: boolean;
  affordable: boolean;
  onAction: () => void;
}> = ({ accessory, owned, equipped, affordable, onAction }) => (
  <button
    onClick={onAction}
    className={cn(
      "relative p-4 rounded-lg border-2 transition-all",
      equipped
        ? "border-blue-500 bg-blue-50"
        : owned || accessory.requiredLevel
        ? "border-gray-300 hover:border-gray-400 bg-white"
        : affordable
        ? "border-gray-300 hover:border-blue-300 bg-white"
        : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
    )}
    disabled={!owned && !accessory.requiredLevel && !affordable}
  >
    <div className="aspect-square bg-gray-100 rounded-lg mb-2 p-2">
      <img
        src={accessory.imageUrl}
        alt={accessory.name}
        className="w-full h-full object-contain"
      />
    </div>
    
    <p className="text-sm font-medium text-gray-900 truncate">
      {accessory.name}
    </p>
    
    {accessory.price && !owned && (
      <p className={cn(
        "text-xs mt-1",
        affordable ? "text-gray-600" : "text-red-600"
      )}>
        {accessory.price} 🪙
      </p>
    )}
    
    {accessory.requiredLevel && (
      <p className="text-xs mt-1 text-blue-600">
        Level {accessory.requiredLevel}
      </p>
    )}
    
    {owned && !equipped && (
      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
        Gekauft
      </div>
    )}
    
    {equipped && (
      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
        Angelegt
      </div>
    )}
  </button>
);

const useAccessoryTab = (previewAvatar: Avatar, ownedItems: string[], userCoins: number) => {
  const isEquipped = (accessory: AvatarAccessory) => {
    return previewAvatar.accessories.some(a => a.id === accessory.id);
  };

  const canAfford = (price?: number) => {
    return !price || userCoins >= price;
  };

  const isOwned = (id: string) => {
    return ownedItems.includes(id);
  };

  return { isEquipped, canAfford, isOwned };
};

const AccessoryGroup: React.FC<{
  type: string;
  items: AvatarAccessory[];
  isEquipped: (accessory: AvatarAccessory) => boolean;
  canAfford: (price?: number) => boolean;
  isOwned: (id: string) => boolean;
  onAction: (accessory: AvatarAccessory, equipped: boolean, owned: boolean) => void;
}> = ({ type, items, isEquipped, canAfford, isOwned, onAction }) => (
  <div>
    <h4 className="font-medium text-gray-700 mb-3 capitalize">
      {getTypeLabel(type)}
    </h4>
    
    <div className="grid grid-cols-3 gap-3">
      {items.map(accessory => {
        const owned = isOwned(accessory.id);
        const equipped = isEquipped(accessory);
        const affordable = canAfford(accessory.price);
        
        return (
          <AccessoryButton
            key={accessory.id}
            accessory={accessory}
            owned={owned}
            equipped={equipped}
            affordable={affordable}
            onAction={() => onAction(accessory, equipped, owned)}
          />
        );
      })}
    </div>
  </div>
);

export const AccessoryTab: React.FC<AccessoryTabProps> = ({
  accessories,
  previewAvatar,
  ownedItems,
  userCoins,
  onPreview,
  onPurchase,
  onRemove
}) => {
  const { isEquipped, canAfford, isOwned } = useAccessoryTab(previewAvatar, ownedItems, userCoins);
  
  const groupedAccessories = accessories.reduce((acc, accessory) => {
    if (!acc[accessory.type]) {
      acc[accessory.type] = [];
    }
    acc[accessory.type].push(accessory);
    return acc;
  }, {} as Record<string, AvatarAccessory[]>);

  const handleAccessoryAction = (accessory: AvatarAccessory, equipped: boolean, owned: boolean) => {
    if (equipped) {
      onRemove(accessory.type);
    } else if (owned || accessory.requiredLevel) {
      onPreview(accessory);
    } else {
      onPurchase(accessory);
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedAccessories).map(([type, items]) => (
        <AccessoryGroup
          key={type}
          type={type}
          items={items}
          isEquipped={isEquipped}
          canAfford={canAfford}
          isOwned={isOwned}
          onAction={handleAccessoryAction}
        />
      ))}
    </div>
  );
};