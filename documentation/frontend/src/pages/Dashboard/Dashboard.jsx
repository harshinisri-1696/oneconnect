import React from 'react';
import { Building, Clock, FileText, IndianRupee } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card, { CardBody } from '../../components/Common/Card';
import SearchBar from '../../components/Common/SearchBar';
import DocumentIcon from '../../components/Common/DocumentIcon';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';

export const Dashboard = () => {
  const { navigateTo, documents, loadingDocs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter(document =>
      [document.name, document.description, document.category, document.issuing_authority]
        .some(value => value?.toLowerCase().includes(query))
    );
  }, [documents, searchQuery]);

  const suggestions = searchQuery.trim() ? filteredDocuments.slice(0, 5) : [];

  const selectDocument = (documentId) => {
    setSearchQuery('');
    navigateTo('details', { docId: documentId });
  };

  return (
    <div className="page-container">
      <div className="page-title-section">
        <div className="page-eyebrow"><FileText size={13} /> Citizen Services</div>
        <h1 className="page-title">Documents</h1>
        <p className="page-subtitle">Select a document to review its details and begin eligibility verification.</p>
      </div>

      <div className="home-search-section">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search documents, certificates, or services..." />
        {suggestions.length > 0 && (
          <div className="document-search-suggestions" role="listbox" aria-label="Document suggestions">
            {suggestions.map(document => (
              <button
                key={document.id}
                type="button"
                className="document-search-suggestion"
                onClick={() => selectDocument(document.id)}
              >
                <span className="suggestion-icon"><DocumentIcon iconName={document.icon} size={18} /></span>
                <span className="suggestion-copy">
                  <strong>{document.name}</strong>
                  <small>{document.category} · {document.issuing_authority}</small>
                </span>
                <span className="suggestion-arrow">View</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loadingDocs ? <LoadingSkeleton count={6} type="card" /> : (
        <div className="grid-docs">
          {filteredDocuments.map(document => (
            <Card key={document.id} interactive onClick={() => navigateTo('details', { docId: document.id })}>
              <CardBody>
                <div className="document-card-topline">
                  <div className="doc-card-icon-wrap"><DocumentIcon iconName={document.icon} size={24} /></div>
                  <span className="document-category">{document.category}</span>
                </div>
                <h2 className="document-card-title">{document.name}</h2>
                <div className="document-authority"><Building size={13} /> {document.issuing_authority}</div>
                <p className="document-card-description">{document.description}</p>
                <div className="document-card-facts">
                  <span><Clock size={13} /> {document.processing_time?.split('(')[0]}</span>
                  <span><IndianRupee size={13} /> {document.fee?.split('/')[0]}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
