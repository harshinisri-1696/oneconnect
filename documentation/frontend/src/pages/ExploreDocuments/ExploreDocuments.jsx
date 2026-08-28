import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  Clock,
  IndianRupee,
  Building,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card, { CardBody } from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import SearchBar from '../../components/Common/SearchBar';
import Modal from '../../components/Common/Modal';
import EmptyState from '../../components/Common/EmptyState';
import DocumentIcon from '../../components/Common/DocumentIcon';

const CATEGORIES = [
  'All',
  'Identity & Proof',
  'Financial & Tax',
  'Civic & Electoral',
  'Travel & Identity',
  'Transport & Mobility',
  'Vital Records',
  'Welfare & Subsidies',
  'Certificates & Rights'
];

export const ExploreDocuments = () => {
  const { documents, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);
  const [officialPortalModal, setOfficialPortalModal] = useState(null);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = selectedCategory === 'All' || doc.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.issuing_authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  return (
    <div className="page-container">
      {/* Page Title */}
      <div className="page-title-section">
        <div className="page-eyebrow"><Sparkles size={13} /> National Document Directory</div>
        <h1 className="page-title">Explore Government Documents</h1>
        <p className="page-subtitle">
          Browse official Indian government documents, identity proofs, vital certificates, and subsidies.
          Select a document to begin its eligibility verification, or open its step-by-step application guide.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by document name (e.g. Passport, Aadhaar, Caste, PAN)…"
        />
        {/* Category Pills — horizontal scroll on mobile */}
        <div className="filter-pills-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid — responsive */}
      {filteredDocuments.length > 0 ? (
        <div className="grid-docs">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="card-interactive" onClick={() => navigateTo('details', { docId: doc.id })}>
              <CardBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Header: Icon & Category Tag */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div className="doc-card-icon-wrap">
                    <DocumentIcon iconName={doc.icon} size={26} />
                  </div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--light-blue)',
                      color: 'var(--primary)',
                      fontWeight: 600
                    }}
                  >
                    {doc.category}
                  </span>
                </div>

                {/* Title & Authority */}
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {doc.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <Building size={13} color="var(--text-muted)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.issuing_authority}
                  </span>
                </div>

                {/* Short Description */}
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                  {doc.description}
                </p>

                {/* Processing Time & Fee Highlights */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    padding: '12px',
                    backgroundColor: 'var(--secondary-bg)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Time
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                      {doc.processing_time.split('(')[0]}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IndianRupee size={12} /> Govt Fee
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                      {doc.fee.split('/')[0]}
                    </div>
                  </div>
                </div>

              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No documents found"
          description={`We couldn't find any government documents matching "${searchQuery}" in category "${selectedCategory}".`}
          actionText="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      )}

      {/* Quick Document Details Preview Modal */}
      {activePreviewDoc && (
        <Modal
          isOpen={Boolean(activePreviewDoc)}
          onClose={() => setActivePreviewDoc(null)}
          title={activePreviewDoc.name}
          subtitle={`Issued by ${activePreviewDoc.issuing_authority}`}
          size="lg"
          footer={
            <>
              <Button
                variant="outline"
                icon={<ExternalLink size={16} />}
                onClick={() => {
                  setOfficialPortalModal(activePreviewDoc);
                }}
              >
                Official Portal
              </Button>
              <Button
                variant="primary"
                icon={<BookOpen size={16} />}
                onClick={() => {
                  const docId = activePreviewDoc.id;
                  setActivePreviewDoc(null);
                  navigateTo('guide', { docId });
                }}
              >
                Open Full Guide
              </Button>
            </>
          }
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--light-blue)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <DocumentIcon iconName={activePreviewDoc.icon} size={30} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {activePreviewDoc.category}
                </span>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {activePreviewDoc.description}
                </p>
              </div>
            </div>

            {/* Metrics cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--secondary-bg)', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Standard Processing Time</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                  ⏱️ {activePreviewDoc.processing_time}
                </div>
              </div>
              <div style={{ padding: '14px', backgroundColor: 'var(--secondary-bg)', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Government Fee</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                  💳 {activePreviewDoc.fee}
                </div>
              </div>
            </div>

            {/* Eligibility summary */}
            {activePreviewDoc.eligibility_overview && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Eligibility Overview
                </h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {activePreviewDoc.eligibility_overview}
                </p>
              </div>
            )}

            {/* Required proofs */}
            {activePreviewDoc.required_docs_summary && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Standard Required Proofs
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activePreviewDoc.required_docs_summary.map((reqDoc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{reqDoc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Official Portal Redirect Modal */}
      {officialPortalModal && (
        <Modal
          isOpen={Boolean(officialPortalModal)}
          onClose={() => setOfficialPortalModal(null)}
          title="Redirecting to Official Portal"
          subtitle="Government of India Authorized Gateway"
          footer={
            <>
              <Button variant="outline" onClick={() => setOfficialPortalModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                iconRight={<ExternalLink size={16} />}
                onClick={() => {
                  window.open(officialPortalModal.official_link, '_blank', 'noopener,noreferrer');
                  setOfficialPortalModal(null);
                }}
              >
                Proceed to Official Portal
              </Button>
            </>
          }
        >
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--light-blue)', borderRadius: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={28} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '13px', color: 'var(--dark-blue)', lineHeight: 1.4 }}>
                You are being redirected to the authentic portal for <strong>{officialPortalModal.name}</strong> at:
                <br />
                <code style={{ fontSize: '12px', color: 'var(--primary)', wordBreak: 'break-all' }}>
                  {officialPortalModal.official_link}
                </code>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              CitizenDoc does not ask for your government passwords, Aadhaar OTPs, or bank account PINs. Please ensure you verify the browser address bar on the government portal.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExploreDocuments;
