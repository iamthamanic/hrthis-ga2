import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useFormHandler, useToast } from '../hooks';
import { RequiredStep as _RequiredStep } from '../pipeline/annotations';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';

// Validation schema
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

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // @RequiredStep: "handle-user-authentication"
  const form = useFormHandler<LoginFormData>({
    initialValues: {
      email: 'max.mustermann@hrthis.de',
      password: ''
    },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        toast.success('Anmeldung erfolgreich', 'Sie werden weitergeleitet...');
        // Navigation will happen automatically via useEffect when isAuthenticated changes
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
        toast.error('Anmeldung fehlgeschlagen', errorMessage);
      }
    },
    onError: (error) => {
      toast.error('Fehler', error.message);
    }
  });

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

        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              E-Mail
            </label>
            <input
              type="email"
              className={cn(
                "border rounded-lg px-4 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                form.touched.email && form.errors.email ? "border-red-500" : "border-gray-300"
              )}
              placeholder="ihre.email@firma.de"
              value={form.values.email}
              onChange={(e) => form.handleChange('email')(e.target.value)}
              onBlur={form.handleBlur('email')}
              autoCapitalize="none"
              autoCorrect="off"
            />
            {form.touched.email && form.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Passwort
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={cn(
                  "border rounded-lg px-4 py-3 pr-12 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  form.touched.password && form.errors.password ? "border-red-500" : "border-gray-300"
                )}
                placeholder="Passwort eingeben"
                value={form.values.password}
                onChange={(e) => form.handleChange('password')(e.target.value)}
                onBlur={form.handleBlur('password')}
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                title={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                className="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {form.touched.password && form.errors.password && (
              <p className="text-red-500 text-sm mt-1">{form.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={cn(
              "bg-blue-600 rounded-lg py-4 w-full text-white font-semibold text-base transition-all",
              form.isSubmitting 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-blue-700 active:scale-98",
              !form.isValid && form.isDirty && "opacity-75"
            )}
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? 'Anmeldung läuft...' : 'Anmelden'}
          </button>

          {/* Form State Debug Info (nur in Development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
              <p>Valid: {form.isValid ? '✅' : '❌'} | Dirty: {form.isDirty ? '✅' : '❌'}</p>
            </div>
          )}
        </form>

        {(process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEMO_MODE === 'true') && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-2 font-medium">🚀 Demo-Modus aktiv</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  form.setValues({ email: 'max.mustermann@hrthis.de', password: 'demo' });
                  form.handleSubmit();
                }}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 py-1"
              >
                → Als Mitarbeiter anmelden (Max Mustermann)
              </button>
              <button
                type="button"
                onClick={() => {
                  form.setValues({ email: 'anna.admin@hrthis.de', password: 'demo' });
                  form.handleSubmit();
                }}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 py-1"
              >
                → Als Admin anmelden (Anna Admin)
              </button>
            </div>
            <p className="text-xs text-blue-700 mt-2">Passwort: <code className="bg-blue-100 px-1 rounded">demo</code></p>
          </div>
        )}
      </div>
    </div>
  );
};