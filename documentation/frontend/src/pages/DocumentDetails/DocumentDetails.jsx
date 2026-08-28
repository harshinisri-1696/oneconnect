import React from 'react';
import { ArrowRight, Building, CheckCircle2, Clock, FileText, IndianRupee, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card, { CardBody, CardHeader } from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import DocumentIcon from '../../components/Common/DocumentIcon';

const DocumentDetails = () => {
  const { documents, pageParams, navigateTo } = useApp();
  const documentId = pageParams.docId ? parseInt(pageParams.docId) : null;
  const document = documents.find(item => item.id === documentId);

  if (!document) {
    return (
      <div className="page-container">
        <Card>
          <CardBody style={{ textAlign: 'center', padding: '48px 24px' }}>
            <FileText size={32} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
            <h1 className="section-title">Document not found</h1>
            <p className="page-subtitle" style={{ margin: '6px auto 20px' }}>Choose a document from the directory to continue.</p>
            <Button variant="primary" onClick={() => navigateTo('dashboard')}>Browse Documents</Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-title-section">
        <div className="page-eyebrow"><ShieldCheck size={13} /> Document Details</div>
        <h1 className="page-title">{document.name}</h1>
        <p className="page-subtitle">Review the purpose, requirements, fee, and processing time before starting verification.</p>
      </div>

      <div className="document-detail-layout">
        <Card>
          <CardBody>
            <div className="document-detail-heading">
              <div className="doc-card-icon-wrap"><DocumentIcon iconName={document.icon} size={30} /></div>
              <div>
                <h2 className="section-title">{document.name}</h2>
                <div className="document-authority"><Building size={14} /> {document.issuing_authority}</div>
              </div>
            </div>
            <div className="document-detail-purpose">
              <h3>Purpose</h3>
              <p>{document.description}</p>
            </div>
            <Button variant="primary" size="lg" icon={<CheckCircle2 size={18} />} onClick={() => navigateTo('eligibility', { docId: document.id })}>
              Check Eligibility <ArrowRight size={17} />
            </Button>
          </CardBody>
        </Card>

        <div className="document-detail-facts">
          <Card>
            <CardHeader><h3 className="detail-card-title"><FileText size={17} /> Required Documents</h3></CardHeader>
            <CardBody>
              <ul className="detail-list">
                {(document.required_docs_summary || []).map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </CardBody>
          </Card>
          <div className="document-fact-grid">
            <Card><CardBody><div className="detail-fact-label"><IndianRupee size={15} /> Government Fee</div><strong>{document.fee}</strong></CardBody></Card>
            <Card><CardBody><div className="detail-fact-label"><Clock size={15} /> Processing Time</div><strong>{document.processing_time}</strong></CardBody></Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
