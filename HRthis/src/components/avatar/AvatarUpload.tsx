import React, { useState } from 'react';

import { FileUpload } from '../FileUpload';

import { AvatarCircle } from './AvatarCircle';

interface AvatarUploadProps {
  /** Current avatar URL */
  currentAvatarUrl?: string;
  /** Callback when avatar file is selected */
  onAvatarChange: (file: File | null) => void;
  /** Whether upload is in progress */
  isUploading?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether user can edit avatar */
  canEdit?: boolean;
}

interface AvatarDisplayProps {
  avatarUrl?: string;
  showEditButton: boolean;
  onEdit: () => void;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatarUrl, showEditButton, onEdit }) => (
  <div className="relative mb-6">
    <div className="w-40 h-40 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center relative overflow-hidden">
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
          
          <div className="relative z-10 w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
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

const UploadSection: React.FC<{
  onAvatarChange: (file: File | null) => void;
  isUploading: boolean;
  error?: string;
}> = ({ onAvatarChange, isUploading, error }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    onAvatarChange(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    onAvatarChange(null);
  };

  return (
    <div className="space-y-4">
      <FileUpload
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        selectedFile={selectedFile}
        accept=".png,.jpg,.jpeg"
        isUploading={isUploading}
        error={error}
        maxSize={5 * 1024 * 1024} // 5MB for avatars
        placeholder="Profilbild hier ablegen oder klicken zum Auswählen"
      />
      
      <div className="text-sm text-gray-600">
        <p>• Erlaubte Formate: PNG, JPG, JPEG</p>
        <p>• Maximale Dateigröße: 5 MB</p>
        <p>• Empfohlene Größe: Quadratisch (z.B. 400x400 Pixel)</p>
      </div>
    </div>
  );
};

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  onAvatarChange,
  isUploading = false,
  error,
  canEdit = true
}) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleEditClick = () => {
    if (canEdit) {
      setShowUpload(!showUpload);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <AvatarDisplay
        avatarUrl={currentAvatarUrl}
        showEditButton={canEdit}
        onEdit={handleEditClick}
      />

      {showUpload && canEdit && (
        <div className="w-full max-w-md">
          <UploadSection
            onAvatarChange={onAvatarChange}
            isUploading={isUploading}
            error={error}
          />
          
          <div className="flex gap-2 mt-4">
            {currentAvatarUrl && (
              <button
                onClick={() => onAvatarChange(null)}
                className="flex-1 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Bild entfernen
              </button>
            )}
            <button
              onClick={() => setShowUpload(false)}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};