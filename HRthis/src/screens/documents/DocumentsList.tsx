import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  category: string;
}

interface DocumentsListProps {
  category: 'vertrag' | 'zertifikat' | 'lohnabrechnung' | 'sonstige';
}

const mockDocuments: Record<string, Document[]> = {
  vertrag: [
    {
      id: '1',
      name: 'Arbeitsvertrag_Anna_Admin_22.04.2022.pdf',
      type: 'PDF',
      size: '420 KB',
      lastModified: '22. Aug. 2022',
      category: 'vertrag',
    },
    {
      id: '2',
      name: 'Zusatzvereinbarung_Homeoffice_2023.pdf',
      type: 'PDF',
      size: '215 KB',
      lastModified: '15. Jan. 2023',
      category: 'vertrag',
    },
  ],
  zertifikat: [
    {
      id: '3',
      name: 'Datenschutz_Schulung_2024.pdf',
      type: 'PDF',
      size: '1.2 MB',
      lastModified: '10. März 2024',
      category: 'zertifikat',
    },
    {
      id: '4',
      name: 'Erste_Hilfe_Kurs_2023.pdf',
      type: 'PDF',
      size: '850 KB',
      lastModified: '5. Juni 2023',
      category: 'zertifikat',
    },
    {
      id: '5',
      name: 'Brandschutz_Unterweisung_2024.pdf',
      type: 'PDF',
      size: '650 KB',
      lastModified: '20. Jan. 2024',
      category: 'zertifikat',
    },
    {
      id: '6',
      name: 'IT_Security_Training_2024.pdf',
      type: 'PDF',
      size: '2.1 MB',
      lastModified: '1. Feb. 2024',
      category: 'zertifikat',
    },
    {
      id: '7',
      name: 'Compliance_Schulung_2023.pdf',
      type: 'PDF',
      size: '1.5 MB',
      lastModified: '15. Nov. 2023',
      category: 'zertifikat',
    },
  ],
  lohnabrechnung: [
    {
      id: '8',
      name: 'Lohnabrechnung_Januar_2025.pdf',
      type: 'PDF',
      size: '320 KB',
      lastModified: '1. Feb. 2025',
      category: 'lohnabrechnung',
    },
    {
      id: '9',
      name: 'Lohnabrechnung_Dezember_2024.pdf',
      type: 'PDF',
      size: '318 KB',
      lastModified: '1. Jan. 2025',
      category: 'lohnabrechnung',
    },
    {
      id: '10',
      name: 'Lohnabrechnung_November_2024.pdf',
      type: 'PDF',
      size: '315 KB',
      lastModified: '1. Dez. 2024',
      category: 'lohnabrechnung',
    },
    // Add more for the full 12 count...
  ],
  sonstige: [
    {
      id: '20',
      name: 'Mitarbeiterhandbuch_2024.pdf',
      type: 'PDF',
      size: '5.2 MB',
      lastModified: '1. Jan. 2024',
      category: 'sonstige',
    },
    {
      id: '21',
      name: 'Parkplatz_Berechtigung.pdf',
      type: 'PDF',
      size: '120 KB',
      lastModified: '15. Apr. 2023',
      category: 'sonstige',
    },
    {
      id: '22',
      name: 'IT_Equipment_Übergabeprotokoll.pdf',
      type: 'PDF',
      size: '250 KB',
      lastModified: '22. Apr. 2022',
      category: 'sonstige',
    },
  ],
};

const categoryLabels = {
  vertrag: 'Verträge',
  zertifikat: 'Zertifikate',
  lohnabrechnung: 'Lohnabrechnungen',
  sonstige: 'Sonstige Dokumente',
};

export const DocumentsList: React.FC<DocumentsListProps> = ({ category }) => {
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  
  const documents = mockDocuments[category] || [];
  const categoryLabel = categoryLabels[category];

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  const handleDownload = (doc: Document) => {
    // Mock download
    console.log('Downloading:', doc.name);
    // In real app, would trigger actual file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = doc.name;
    link.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{categoryLabel}</h1>
            <p className="text-gray-600 mt-1">{documents.length} Dokumente</p>
          </div>
          <button
            onClick={() => navigate('/documents')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Zurück zur Übersicht
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Größe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zuletzt geändert
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {doc.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.lastModified}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleView(doc)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Ansehen
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showViewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDocument.name}
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-gray-600">PDF-Vorschau</p>
                <p className="text-sm text-gray-500 mt-2">
                  In der echten Anwendung würde hier das PDF-Dokument angezeigt werden.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => handleDownload(selectedDocument)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};