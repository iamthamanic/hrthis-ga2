import React, { useState } from 'react';
import { z } from 'zod';

import { RequiredStep as _RequiredStep } from '../pipeline/annotations';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';

export const LoginScreen = () => {
  const [email, setEmail] = useState('max.mustermann@hrthis.de');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  // @RequiredStep: "validate-login-input"
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, 'E-Mail ist erforderlich')
      .email('Ungültige E-Mail-Adresse')
      .max(255, 'E-Mail ist zu lang'),
    password: z
      .string()
      .min(1, 'Passwort ist erforderlich')
      .min(3, 'Passwort muss mindestens 3 Zeichen lang sein')
      .max(128, 'Passwort ist zu lang')
  });

  const validateLoginInput = (email: string, password: string): boolean => {
    try {
      loginSchema.parse({ email, password });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        setError(firstError?.message || 'Eingabedaten sind ungültig');
      } else {
        setError('Unbekannter Validierungsfehler');
      }
      return false;
    }
  };

  // @RequiredStep: "handle-user-authentication"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateLoginInput(email, password)) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
            HRdiese
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Mitarbeiter Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              E-Mail
            </label>
            <input
              type="email"
              className="border border-gray-300 rounded-lg px-4 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ihre.email@firma.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Passwort
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg px-4 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Passwort eingeben"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={cn(
              "bg-blue-600 rounded-lg py-4 w-full text-white font-semibold text-base transition-opacity",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
          </button>
        </form>

        {(process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEMO_MODE === 'true') && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2 font-medium">🚀 Demo-Modus aktiv</p>
            <p className="text-xs text-blue-700">Mitarbeiter: max.mustermann@hrthis.de</p>
            <p className="text-xs text-blue-700">Admin: anna.admin@hrthis.de</p>
            <p className="text-xs text-blue-700">Passwort: <code className="bg-blue-100 px-1 rounded">demo</code></p>
          </div>
        )}
      </div>
    </div>
  );
};