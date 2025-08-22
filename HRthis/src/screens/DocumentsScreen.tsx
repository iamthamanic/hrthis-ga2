import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

// Sub-components for different document views
import { DocumentsOverview } from './documents/DocumentsOverview';
import { DocumentsList } from './documents/DocumentsList';

export const DocumentsScreen = () => {
  const location = useLocation();
  
  // Categories configuration
  const categories = [
    { id: 'vertrag', label: 'Vertrag', icon: '📄' },
    { id: 'zertifikat', label: 'Zertifikat', icon: '🏆' },
    { id: 'lohnabrechnung', label: 'Lohnabrechnung', icon: '💰' },
    { id: 'sonstige', label: 'Sonstige', icon: '📁' }
  ];

  // Check if we're on a category page
  const currentCategory = location.pathname.split('/').pop();
  const isOnCategoryPage = categories.some(cat => cat.id === currentCategory);

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with tabs - only show on category pages */}
        {isOnCategoryPage && (
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {categories.map((category) => {
                  const isActive = currentCategory === category.id;
                  return (
                    <Link
                      key={category.id}
                      to={`/documents/${category.id}`}
                      className={cn(
                        "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                        isActive
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      )}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Search bar */}
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Dokumente suchen..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route index element={<DocumentsOverview />} />
          <Route path="vertrag" element={<DocumentsList category="vertrag" />} />
          <Route path="zertifikat" element={<DocumentsList category="zertifikat" />} />
          <Route path="lohnabrechnung" element={<DocumentsList category="lohnabrechnung" />} />
          <Route path="sonstige" element={<DocumentsList category="sonstige" />} />
          <Route path="*" element={<Navigate to="/documents" replace />} />
        </Routes>
      </div>
    </div>
  );
};