import React from 'react';

interface AvatarCircleProps {
  /** Avatar image URL */
  avatarUrl?: string;
  /** Whether to show edit button */
  showEditButton?: boolean;
  /** Edit button click handler */
  onEdit?: () => void;
  /** Size of the avatar (default: 40 for w-40 h-40) */
  size?: number;
}

export const AvatarCircle: React.FC<AvatarCircleProps> = ({
  avatarUrl,
  showEditButton = false,
  onEdit,
  size = 40
}) => {
  const sizeClass = `w-${size} h-${size}`;
  const innerSize = Math.floor(size * 0.6);
  const innerSizeClass = `w-${innerSize} h-${innerSize}`;

  return (
    <div className="relative mb-6">
      <div className={`${sizeClass} bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center relative overflow-hidden`}>
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Profilbild" 
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className={`relative z-10 ${innerSizeClass} bg-gray-600 rounded-full flex items-center justify-center`}>
              <span className="text-white text-3xl">👤</span>
            </div>
          </>
        )}
      </div>

      {showEditButton && (
        <button
          onClick={onEdit}
          className="absolute top-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        >
          <span className="text-gray-600">✏️</span>
        </button>
      )}
    </div>
  );
};