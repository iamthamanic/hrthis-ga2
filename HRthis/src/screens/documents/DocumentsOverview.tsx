import React from 'react';
import { Link } from 'react-router-dom';

export const DocumentsOverview = () => {
  const categories = [
    { 
      id: 'vertrag', 
      label: 'Verträge', 
      icon: '📄', 
      description: 'Arbeitsverträge und Vereinbarungen',
      count: 2,
      color: 'blue'
    },
    { 
      id: 'zertifikat', 
      label: 'Zertifikate', 
      icon: '🏆', 
      description: 'Schulungsnachweise und Qualifikationen',
      count: 5,
      color: 'green'
    },
    { 
      id: 'lohnabrechnung', 
      label: 'Lohnabrechnungen', 
      icon: '💰', 
      description: 'Monatliche Gehaltsabrechnungen',
      count: 12,
      color: 'purple'
    },
    { 
      id: 'sonstige', 
      label: 'Sonstige', 
      icon: '📁', 
      description: 'Weitere Dokumente',
      count: 3,
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
    };
    return colors[color] || colors.gray;
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dokumente</h1>
        <p className="text-gray-600">
          Hier findest du alle deine Unterlagen und Dokumente.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const colors = getColorClasses(category.color);
          return (
            <Link
              key={category.id}
              to={`/documents/${category.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${colors.bg} ${colors.text} p-3 rounded-lg text-2xl`}>
                  {category.icon}
                </div>
                <span className={`${colors.bg} ${colors.text} px-2 py-1 rounded-full text-sm font-medium`}>
                  {category.count}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {category.label}
              </h3>
              <p className="text-sm text-gray-500">
                {category.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent Documents Section */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Zuletzt hinzugefügt</h2>
          <div className="space-y-3">
            {/* Mock recent documents */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Arbeitsvertrag_2025.pdf</p>
                  <p className="text-xs text-gray-500">Vor 2 Tagen hinzugefügt</p>
                </div>
              </div>
              <Link 
                to="/documents/vertrag" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ansehen →
              </Link>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Datenschutz_Zertifikat.pdf</p>
                  <p className="text-xs text-gray-500">Vor 1 Woche hinzugefügt</p>
                </div>
              </div>
              <Link 
                to="/documents/zertifikat" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ansehen →
              </Link>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Lohnabrechnung_Januar_2025.pdf</p>
                  <p className="text-xs text-gray-500">Vor 3 Wochen hinzugefügt</p>
                </div>
              </div>
              <Link 
                to="/documents/lohnabrechnung" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ansehen →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};