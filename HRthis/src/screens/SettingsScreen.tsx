import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AvatarUpload } from '../components/avatar/AvatarUpload';
import { useAuthStore } from '../state/auth';
import { User } from '../types';
import { cn } from '../utils/cn';

/**
 * Settings/Profile screen for user management
 * Provides interface for editing personal and work information
 */
export const SettingsScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState('');
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    privateEmail: user?.privateEmail || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    postalCode: user?.address?.postalCode || '',
    city: user?.address?.city || '',
    iban: user?.bankDetails?.iban || '',
    bic: user?.bankDetails?.bic || '',
    // Work information (admin editable)
    email: user?.email || '', // Work email
    position: user?.position || '',
    department: user?.department || '',
    weeklyHours: user?.weeklyHours?.toString() || '',
    vacationDays: user?.vacationDays?.toString() || '',
    employmentType: user?.employmentType || 'FULL_TIME',
    employmentStatus: user?.employmentStatus || 'ACTIVE'
  });

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN';

  /**
   * Validates form data before submission
   */
  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'Vorname ist erforderlich';
    if (!formData.lastName.trim()) return 'Nachname ist erforderlich';
    if (formData.privateEmail && !/\S+@\S+\.\S+/.test(formData.privateEmail)) {
      return 'Ungültige private E-Mail-Adresse';
    }
    if (isAdmin && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Ungültige Arbeits-E-Mail-Adresse';
    }
    if (isAdmin && formData.weeklyHours && (parseInt(formData.weeklyHours) < 1 || parseInt(formData.weeklyHours) > 60)) {
      return 'Wochenstunden müssen zwischen 1 und 60 liegen';
    }
    if (isAdmin && formData.vacationDays && (parseInt(formData.vacationDays) < 0 || parseInt(formData.vacationDays) > 50)) {
      return 'Urlaubstage müssen zwischen 0 und 50 liegen';
    }
    return null;
  };

  /**
   * Converts file to base64 data URL for storage
   */
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Handles avatar file selection
   */
  const handleAvatarChange = async (file: File | null) => {
    setAvatarError('');
    setAvatarFile(file);
    
    if (file) {
      // Validate file size (already handled by FileUpload, but double-check)
      if (file.size > 5 * 1024 * 1024) {
        setAvatarError('Datei ist zu groß. Maximum: 5 MB');
        return;
      }
      
      // Validate file type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setAvatarError('Unsupported file type. Use PNG, JPG, or JPEG.');
        return;
      }
    }
  };

  /**
   * Handles avatar upload and immediate user update
   */
  const handleAvatarUpload = async () => {
    if (!avatarFile || !user) return;
    
    setIsAvatarUploading(true);
    setAvatarError('');
    
    try {
      // Convert file to data URL for storage
      const avatarUrl = await fileToDataUrl(avatarFile);
      
      // Update user with new avatar URL
      await updateUser(user.id, { avatarUrl });
      
      setSuccess('Profilbild erfolgreich aktualisiert');
      setAvatarFile(null);
    } catch (err) {
      setAvatarError('Fehler beim Hochladen des Profilbildes');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  /**
   * Handles avatar removal
   */
  const handleAvatarRemove = async () => {
    if (!user) return;
    
    setIsAvatarUploading(true);
    
    try {
      await updateUser(user.id, { avatarUrl: undefined });
      setSuccess('Profilbild erfolgreich entfernt');
      setAvatarFile(null);
    } catch (err) {
      setAvatarError('Fehler beim Entfernen des Profilbildes');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  /**
   * Handles form submission and user update
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    const updateData: Partial<User> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      privateEmail: formData.privateEmail,
      phone: formData.phone,
      address: {
        street: formData.street,
        postalCode: formData.postalCode,
        city: formData.city
      },
      bankDetails: {
        iban: formData.iban,
        bic: formData.bic
      }
    };

    // Add work information if admin
    if (isAdmin) {
      updateData.email = formData.email; // Work email
      updateData.position = formData.position;
      updateData.department = formData.department;
      updateData.weeklyHours = formData.weeklyHours ? parseInt(formData.weeklyHours) : undefined;
      updateData.vacationDays = formData.vacationDays ? parseInt(formData.vacationDays) : undefined;
      updateData.employmentType = formData.employmentType;
      updateData.employmentStatus = formData.employmentStatus;
    }

    try {
      // Handle avatar upload first if there's a new avatar file
      if (avatarFile) {
        const avatarUrl = await fileToDataUrl(avatarFile);
        updateData.avatarUrl = avatarUrl;
        setAvatarFile(null);
      }
      
      await updateUser(user.id, updateData);
      
      setSuccess('Profil erfolgreich aktualisiert');
    } catch (err) {
      setError('Fehler beim Speichern der Daten');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Zurück
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie Ihre persönlichen Daten</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Profilbild
            </h2>
            
            <div className="flex flex-col items-center">
              <AvatarUpload
                currentAvatarUrl={user.avatarUrl}
                onAvatarChange={handleAvatarChange}
                isUploading={isAvatarUploading}
                error={avatarError}
                canEdit={true}
              />
              
              {avatarFile && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={isAvatarUploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isAvatarUploading ? 'Hochladen...' : 'Bild hochladen'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarFile(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                </div>
              )}
              
              {user.avatarUrl && !avatarFile && (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  disabled={isAvatarUploading}
                  className="mt-4 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isAvatarUploading ? 'Entfernen...' : 'Profilbild entfernen'}
                </button>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Persönliche Informationen
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vorname
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ihr Vorname"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nachname
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ihr Nachname"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Private E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={formData.privateEmail}
                  onChange={(e) => setFormData({...formData, privateEmail: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="max.privat@gmail.com"
                />
                <p className="text-xs text-gray-500 mt-1">Ihre persönliche E-Mail-Adresse</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+49 30 12345678"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Adresse
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Straße & Hausnummer
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Musterstraße 123"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postleitzahl
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ort
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Berlin"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Bankverbindung
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN
                </label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => setFormData({...formData, iban: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DE89 3704 0044 0532 0130 00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BIC
                </label>
                <input
                  type="text"
                  value={formData.bic}
                  onChange={(e) => setFormData({...formData, bic: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="COBADEFFXXX"
                />
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Arbeitsinformationen
              {!isAdmin && (
                <span className="text-sm text-gray-500 font-normal ml-2">
                  (nur durch HR bearbeitbar)
                </span>
              )}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arbeits-E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!isAdmin}
                  className={cn(
                    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    !isAdmin && "bg-gray-50 text-gray-500"
                  )}
                  placeholder="max.mustermann@hrthis.de"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isAdmin ? 'System-Login E-Mail' : 'Nur durch HR bearbeitbar'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  disabled={!isAdmin}
                  className={cn(
                    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    !isAdmin && "bg-gray-50 text-gray-500"
                  )}
                  placeholder="Position"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abteilung
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  disabled={!isAdmin}
                  className={cn(
                    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    !isAdmin && "bg-gray-50 text-gray-500"
                  )}
                  placeholder="Abteilung"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wochenstunden
                </label>
                <input
                  type="number"
                  value={formData.weeklyHours}
                  onChange={(e) => setFormData({...formData, weeklyHours: e.target.value})}
                  disabled={!isAdmin}
                  className={cn(
                    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    !isAdmin && "bg-gray-50 text-gray-500"
                  )}
                  placeholder="40"
                  min="1"
                  max="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urlaubstage/Jahr
                </label>
                <input
                  type="number"
                  value={formData.vacationDays}
                  onChange={(e) => setFormData({...formData, vacationDays: e.target.value})}
                  disabled={!isAdmin}
                  className={cn(
                    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    !isAdmin && "bg-gray-50 text-gray-500"
                  )}
                  placeholder="30"
                  min="0"
                  max="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschäftigungsart
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({...formData, employmentType: e.target.value as 'FULL_TIME' | 'PART_TIME' | 'MINI_JOB'})}
                  disabled={!isAdmin}
                  className={cn(
                    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    !isAdmin && "bg-gray-50 text-gray-500"
                  )}
                >
                  <option value="FULL_TIME">Vollzeit</option>
                  <option value="PART_TIME">Teilzeit</option>
                  <option value="MINI_JOB">Minijob</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({...formData, employmentStatus: e.target.value as 'ACTIVE' | 'PARENTAL_LEAVE' | 'TERMINATED'})}
                  disabled={!isAdmin}
                  className={cn(
                    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    !isAdmin && "bg-gray-50 text-gray-500"
                  )}
                >
                  <option value="ACTIVE">Aktiv</option>
                  <option value="PARENTAL_LEAVE">Elternzeit</option>
                  <option value="TERMINATED">Ausgeschieden</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eintrittsdatum
                </label>
                <input
                  type="text"
                  value={user.joinDate ? new Date(user.joinDate).toLocaleDateString('de-DE') : '-'}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Kann nur bei Erstellung gesetzt werden</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-colors",
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {isLoading ? 'Speichern...' : 'Änderungen speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};