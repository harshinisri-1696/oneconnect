import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  IndianRupee,
  ExternalLink,
  ShieldCheck,
  Building,
  AlertTriangle,
  FileCheck,
  Check,
  ChevronRight,
  Sparkles,
  BookmarkPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card, { CardBody, CardHeader } from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import DocumentIcon from '../../components/Common/DocumentIcon';
import Modal from '../../components/Common/Modal';

export const ApplicationGuide = () => {
  const { documents, pageParams, navigateTo, refreshApplications, refreshStats, hasCompletedEligibility } = useApp();
  const { user, token } = useAuth();
  const { success, error } = useToast();

  const [selectedDocId, setSelectedDocId] = useState(
    pageParams.docId ? parseInt(pageParams.docId) : (documents[0]?.id || 1)
  );
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);
  const [savedAsApp, setSavedAsApp] = useState(false);

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  useEffect(() => {
    if (!pageParams.docId) {
      navigateTo('explore');
    } else if (!hasCompletedEligibility(selectedDocId)) {
      navigateTo('details', { docId: selectedDocId });
    }
  }, [pageParams.docId]);

  useEffect(() => {
    if (!selectedDocId) return;

    let isMounted = true;
    setLoading(true);
    setCompletedSteps({});
    setSavedAsApp(false);

    fetch(`/api/guides/${selectedDocId}`)
      .then(res => res.json())
      .then(json => {
        if (isMounted && json.success) {
          setGuideData(json.data);
        }
      })
      .catch(err => {
        console.error("Guide fetch error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedDocId]);

  const toggleStep = (stepNum) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const handleSaveApplication = async () => {
    if (!activeDoc) return;
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          document_id: activeDoc.id,
          state: user.state,
          status: 'Draft',
          notes: `Started following application guide on CitizenDoc. Processing time: ${activeDoc.processing_time}.`
        })
      });

      const json = await res.json();
      if (json.success) {
        setSavedAsApp(true);
        refreshApplications();
        refreshStats();
        success(`Saved ${activeDoc.name} to your Saved Applications!`);
      }
    } catch (e) {
      error("Failed to save application");
    }
  };

  const steps = guideData?.steps || [];
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="page-container">
      {/* Header with Document Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
            <Sparkles size={14} /> Official Application Blueprint
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            {activeDoc?.name} Application Guide
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Authority: <strong>{activeDoc?.issuing_authority}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            value={selectedDocId}
            onChange={(e) => navigateTo('details', { docId: parseInt(e.target.value) })}
            style={{ width: '220px', padding: '9px 14px' }}
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <Button
            variant="secondary"
            icon={<BookmarkPlus size={16} />}
            onClick={handleSaveApplication}
            disabled={savedAsApp}
          >
            {savedAsApp ? 'Saved in Applications ✓' : 'Save Application'}
          </Button>

          <Button
            variant="primary"
            iconRight={<ExternalLink size={16} />}
            onClick={() => setIsOfficialModalOpen(true)}
          >
            Official Apply
          </Button>
        </div>
      </div>

      {/* Top Highlight Metric Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <Card>
          <CardBody style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--light-blue)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Processing Time</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{activeDoc?.processing_time}</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IndianRupee size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Government Fee</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{activeDoc?.fee}</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#E0E7FF', color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Jurisdiction</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                {activeDoc?.issuing_authority}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--warning-bg)', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Your Progress</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{completedCount} / {steps.length} Steps Done ({progressPercent}%)</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Progress Bar Card */}
      <Card style={{ marginBottom: '28px' }}>
        <CardBody style={{ padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
              Step Completion Progress ({progressPercent}%)
            </span>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
              {completedCount === steps.length && steps.length > 0 ? '🎉 All Steps Completed!' : 'Mark steps as you finish them'}
            </span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </CardBody>
      </Card>

      {/* Layout Grid: Guide Steps (Left) + Overview/Docs/Important Notes (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '28px' }}>
        {/* Left Column: Numbered Step Cards */}
        <div>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-main)' }}>
              Step-by-Step Application Procedure
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              Follow these official chronological instructions to complete your application without delays.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {steps.map((step, idx) => {
              const isDone = !!completedSteps[step.step_number];

              return (
                <Card
                  key={step.id || idx}
                  style={{
                    borderColor: isDone ? 'var(--success)' : 'var(--border-color)',
                    backgroundColor: isDone ? '#F9FDFB' : 'var(--white)',
                    transition: 'all 0.2s'
                  }}
                >
                  <CardBody style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                      {/* Step Number Circle */}
                      <div
                        onClick={() => toggleStep(step.step_number)}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? 'var(--success)' : 'var(--light-blue)',
                          color: isDone ? 'var(--white)' : 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          flexShrink: 0,
                          boxShadow: isDone ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none',
                          transition: 'all 0.2s'
                        }}
                        title="Click to toggle completed"
                      >
                        {isDone ? <Check size={20} strokeWidth={3} /> : step.step_number}
                      </div>

                      {/* Step Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                          <h4 style={{ fontSize: '16.5px', fontWeight: 700, color: isDone ? '#14532D' : 'var(--text-main)' }}>
                            {step.step_title}
                          </h4>
                          <button
                            onClick={() => toggleStep(step.step_number)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: isDone ? 'var(--success)' : 'var(--text-muted)',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isDone ? 'Completed ✓' : 'Mark done'}
                          </button>
                        </div>

                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: step.tips ? '14px' : '0' }}>
                          {step.step_description}
                        </p>

                        {/* Pro Tip Box */}
                        {step.tips && (
                          <div
                            style={{
                              padding: '12px 14px',
                              backgroundColor: isDone ? '#EBF7EE' : 'var(--secondary-bg)',
                              borderRadius: 'var(--radius-md)',
                              borderLeft: `3px solid ${isDone ? 'var(--success)' : 'var(--primary)'}`,
                              fontSize: '13px',
                              color: 'var(--text-main)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px'
                            }}
                          >
                            <Sparkles size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span><strong>Pro Tip:</strong> {step.tips}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column: Overview, Required Documents, Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Document Overview Card */}
          <Card>
            <CardHeader>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                Document Overview
              </h4>
            </CardHeader>
            <CardBody>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {activeDoc?.description}
              </p>
              {activeDoc?.eligibility_overview && (
                <div style={{ padding: '12px', backgroundColor: 'var(--light-blue)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--dark-blue)', lineHeight: 1.4 }}>
                  <strong>Eligibility:</strong> {activeDoc.eligibility_overview}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Required Documents Card */}
          <Card>
            <CardHeader>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                Required Documents Checklist
              </h4>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(activeDoc?.required_docs_summary || [
                  "Proof of Identity (POI)",
                  "Proof of Address (POA)",
                  "Proof of Date of Birth (DOB)",
                  "Color Passport Photographs"
                ]).map((reqDoc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{reqDoc}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Important Notes Banner */}
          <Card style={{ backgroundColor: '#FFFDF5', borderColor: '#FDE68A' }}>
            <CardHeader style={{ borderBottomColor: '#FEF3C7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309', fontWeight: 600, fontSize: '14px' }}>
                <AlertTriangle size={17} /> Important Guidelines & Caveats
              </div>
            </CardHeader>
            <CardBody>
              <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#78350F', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>CitizenDoc connects you directly with the official portal without intermediary commission.</li>
                <li>Make sure uploaded document photocopies or PDF scans are clear and not blurry.</li>
                <li>Always preserve the printed Application Reference Number (ARN) for real-time tracking.</li>
              </ul>
            </CardBody>
          </Card>

          {/* Direct Apply Call-to-Action */}
          <Card style={{ backgroundColor: 'var(--dark-blue)', color: 'var(--white)', border: 'none' }}>
            <CardBody style={{ textAlign: 'center', padding: '28px 20px' }}>
              <ShieldCheck size={36} color="var(--white)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--white)', marginBottom: '6px' }}>
                Ready to Apply Officially?
              </h4>
              <p style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '18px' }}>
                Launch the secure Government of India portal for {activeDoc?.name}.
              </p>
              <Button
                variant="secondary"
                iconRight={<ExternalLink size={16} />}
                onClick={() => setIsOfficialModalOpen(true)}
                style={{ width: '100%', backgroundColor: 'var(--white)', color: 'var(--primary)', borderColor: 'var(--white)' }}
              >
                Go to Official Government Portal
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Official Portal Redirect Modal */}
      {isOfficialModalOpen && (
        <Modal
          isOpen={isOfficialModalOpen}
          onClose={() => setIsOfficialModalOpen(false)}
          title={`Open Official Portal: ${activeDoc?.name}`}
          subtitle={`Authority: ${activeDoc?.issuing_authority}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOfficialModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                iconRight={<ExternalLink size={16} />}
                onClick={() => {
                  window.open(activeDoc?.official_link, '_blank', 'noopener,noreferrer');
                  setIsOfficialModalOpen(false);
                }}
              >
                Open Official Portal
              </Button>
            </>
          }
        >
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--light-blue)', borderRadius: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={28} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '13px', color: 'var(--dark-blue)', lineHeight: 1.4 }}>
                Target Official URL:
                <br />
                <code style={{ fontSize: '12.5px', color: 'var(--primary)', wordBreak: 'break-all' }}>
                  {activeDoc?.official_link}
                </code>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              You will be navigated to the official Government of India portal in a new tab. After submitting your application there, copy your Application Reference ID and track its real-time progress inside CitizenDoc.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApplicationGuide;
