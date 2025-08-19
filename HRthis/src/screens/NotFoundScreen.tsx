import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/navigation';

/**
 * 404 Not Found Screen
 * Displayed when user navigates to a non-existent route
 */
export const NotFoundScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
            <span className="text-4xl">🔍</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Seite nicht gefunden
        </h2>
        <p className="text-gray-600 mb-8">
          Die angeforderte Seite konnte nicht gefunden werden. 
          Möglicherweise wurde sie verschoben oder existiert nicht mehr.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zur Übersicht
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Zurück zur vorherigen Seite
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Häufig besuchte Seiten:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate(ROUTES.TIME_VACATION)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Zeit & Urlaub
            </button>
            <button
              onClick={() => navigate(ROUTES.LEARNING)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Lernen
            </button>
            <button
              onClick={() => navigate(ROUTES.BENEFITS)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Benefits
            </button>
            <button
              onClick={() => navigate(ROUTES.PERSONAL_FILE)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Personalakte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};