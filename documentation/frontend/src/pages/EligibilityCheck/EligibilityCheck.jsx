import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookmarkPlus,
  BookOpen,
  Check,
  ShieldAlert,
  Info,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card, { CardBody, CardHeader } from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import DocumentIcon from '../../components/Common/DocumentIcon';

export const EligibilityCheck = () => {
  const { documents, pageParams, navigateTo, refreshApplications, refreshStats, markEligibilityComplete } = useApp();
  const { user, token } = useAuth();
  const { success, error, info } = useToast();

  const [selectedDocId, setSelectedDocId] = useState(
    pageParams.docId ? parseInt(pageParams.docId) : (documents[0]?.id || 1)
  );
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [savedAsApp, setSavedAsApp] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  useEffect(() => {
    if (!pageParams.docId) navigateTo('explore');
  }, [pageParams.docId, navigateTo]);

  // Fetch dynamic questions when document changes
  useEffect(() => {
    if (!selectedDocId || !pageParams.docId) return;

    let isMounted = true;
    setLoadingQuestions(true);
    setEvaluationResult(null);
    setAnswers({});
    setCurrentStep(0);
    setSavedAsApp(false);
    setCheckedDocs({});

    fetch(`/api/eligibility/questions/${selectedDocId}`)
      .then(res => res.json())
      .then(json => {
        if (isMounted && json.success) {
          setQuestions(json.questions || []);
        }
      })
      .catch(err => {
        console.error("Failed to load questions:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingQuestions(false);
      });

    return () => { isMounted = false; };
  }, [selectedDocId]);

  const handleAnswerSelect = (fieldKey, value) => {
    setAnswers(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res = await fetch('/api/eligibility/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          document_id: selectedDocId,
          answers: answers,
          state: user.state
        })
      });

      const json = await res.json();
      if (json.success) {
        setEvaluationResult(json.data);
        if (json.data.is_eligible) {
          const applicationResponse = await fetch('/api/applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              document_id: selectedDocId,
              state: user.state,
              status: 'Draft',
              notes: `Eligibility verified on CitizenDoc (Score: ${json.data.score}%). Ready for application.`
            })
          });
          if (applicationResponse.ok) {
            markEligibilityComplete(selectedDocId);
            setSavedAsApp(true);
            refreshApplications();
          } else {
            error('Eligibility passed, but the application record could not be saved.');
          }
        }
        refreshStats();

        // Trigger celebratory confetti on high eligibility score
        if (json.data.score >= 80) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        error(json.message || "Could not evaluate eligibility");
      }
    } catch (err) {
      error("Evaluation request failed");
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveDraft = async () => {
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
          notes: `Eligibility checked on CitizenDoc (Score: ${evaluationResult?.score || 90}%). Ready for application submission.`
        })
      });

      const json = await res.json();
      if (json.success) {
        setSavedAsApp(true);
        refreshApplications();
        refreshStats();
        success(`Saved ${activeDoc.name} application draft to your dashboard!`);
      }
    } catch (e) {
      error("Failed to save draft application");
    }
  };

  const toggleDocumentCheck = (docText) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docText]: !prev[docText]
    }));
  };

  return (
    <div className="page-container">
      {/* Page Title */}
      <div className="page-title-section">
        <div className="page-eyebrow"><Sparkles size={13} /> Smart Eligibility Engine</div>
        <h1 className="page-title">Dynamic Eligibility Verification</h1>
        <p className="page-subtitle">
          Verify your qualification for any government certificate in seconds. Our engine calculates your exact readiness score and personalizes your required proof checklist.
        </p>
      </div>

      {/* Document Selector */}
      <Card style={{ marginBottom: '28px' }}>
        <CardBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--light-blue)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {activeDoc && <DocumentIcon iconName={activeDoc.icon} size={24} />}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Selected Document</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>{activeDoc?.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1', minWidth: '200px', maxWidth: '280px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Change Document</label>
            <select
              className="form-select"
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(parseInt(e.target.value))}
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Main Content: Quiz Wizard OR Result View */}
      {!evaluationResult ? (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {loadingQuestions ? (
            <Card>
              <CardBody style={{ padding: '48px', textAlign: 'center' }}>
                <div className="skeleton" style={{ width: '60%', height: '24px', margin: '0 auto 16px auto' }} />
                <div className="skeleton" style={{ width: '80%', height: '48px', margin: '0 auto 12px auto' }} />
                <div className="skeleton" style={{ width: '80%', height: '48px', margin: '0 auto' }} />
              </CardBody>
            </Card>
          ) : questions.length > 0 ? (
            <Card>
              {/* Wizard Progress Bar */}
              <div style={{ padding: '16px 24px 0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {Math.round(((currentStep + 1) / questions.length) * 100)}% Completed
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question Body */}
              <CardBody style={{ padding: '32px 28px' }}>
                {(() => {
                  const q = questions[currentStep];
                  if (!q) return null;
                  const currentAnswer = answers[q.field_key];

                  return (
                    <div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                        Verification Criterion
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                        {q.question}
                      </h2>
                      {q.help_text && (
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Info size={15} color="var(--primary)" /> {q.help_text}
                        </p>
                      )}

                      {/* Options */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                        {q.options && q.options.map((opt, idx) => {
                          const isSelected = currentAnswer === opt;
                          return (
                            <label
                              key={idx}
                              className={`option-card-label ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleAnswerSelect(q.field_key, opt)}
                            >
                              <input
                                type="radio"
                                name={q.field_key}
                                className="option-radio"
                                checked={isSelected}
                                onChange={() => handleAnswerSelect(q.field_key, opt)}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14.5px', fontWeight: isSelected ? 600 : 500, color: isSelected ? 'var(--dark-blue)' : 'var(--text-main)' }}>
                                  {opt}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </CardBody>

              {/* Wizard Navigation Footer */}
              <div
                style={{
                  padding: '20px 28px',
                  borderTop: '1px solid var(--border-color)',
                  backgroundColor: '#FAFAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  variant="outline"
                  disabled={currentStep === 0}
                  icon={<ArrowLeft size={16} />}
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                >
                  Previous
                </Button>

                {currentStep < questions.length - 1 ? (
                  <Button
                    variant="primary"
                    iconRight={<ArrowRight size={16} />}
                    onClick={() => setCurrentStep(prev => prev + 1)}
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    loading={evaluating}
                    iconRight={<Sparkles size={16} />}
                    onClick={handleEvaluate}
                  >
                    Calculate Eligibility Result
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <CardBody style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  No specific prerequisite questions for this document. You are generally eligible!
                </p>
                <Button variant="primary" onClick={handleEvaluate}>
                  View Requirements
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      ) : (
        /* Evaluation Result Display */
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <Card style={{ overflow: 'visible', marginBottom: '24px' }}>
            <CardBody style={{ padding: '36px 32px' }}>
              {/* Score & Badge Top Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '24px',
                  paddingBottom: '28px',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', backgroundColor: evaluationResult.score >= 80 ? 'var(--success-bg)' : 'var(--warning-bg)', color: evaluationResult.score >= 80 ? 'var(--success)' : '#B45309', fontWeight: 700, fontSize: '13px', marginBottom: '10px' }}>
                    <CheckCircle2 size={16} />
                    {evaluationResult.status}
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>
                    Eligibility Score: {evaluationResult.score}%
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '520px' }}>
                    {evaluationResult.summary}
                  </p>
                </div>

                {/* Circular Score Visual Gauge */}
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `conic-gradient(${evaluationResult.status_color} ${evaluationResult.score * 3.6}deg, #E2E8F0 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <div
                    style={{
                      width: '78px',
                      height: '78px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      fontWeight: 800,
                      color: evaluationResult.status_color
                    }}
                  >
                    {evaluationResult.score}%
                  </div>
                </div>
              </div>

              {/* Required Documents Interactive Checklist */}
              <div style={{ marginTop: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>
                      Personalized Required Documents
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Check off the documents you currently possess before proceeding:
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
                    {Object.values(checkedDocs).filter(Boolean).length} of {evaluationResult.required_documents?.length || 0} Ready
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {evaluationResult.required_documents?.map((docText, idx) => {
                    const isChecked = !!checkedDocs[docText];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleDocumentCheck(docText)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid',
                          borderColor: isChecked ? 'var(--success)' : 'var(--border-color)',
                          backgroundColor: isChecked ? 'var(--success-bg)' : 'var(--white)',
                          cursor: 'pointer',
                          transition: 'all 0.18s'
                        }}
                      >
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '6px',
                            border: isChecked ? 'none' : '2px solid #CBD5E1',
                            backgroundColor: isChecked ? 'var(--success)' : 'var(--white)',
                            color: 'var(--white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: isChecked ? 600 : 500,
                            color: isChecked ? '#14532D' : 'var(--text-main)',
                            textDecoration: isChecked ? 'none' : 'none'
                          }}
                        >
                          {docText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '1px solid var(--border-color)'
                }}
              >
                <Button
                  variant="outline"
                  icon={<RotateCcw size={16} />}
                  onClick={() => {
                    setEvaluationResult(null);
                    setCurrentStep(0);
                  }}
                >
                  Retake Questions
                </Button>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Button
                    variant="secondary"
                    icon={<BookmarkPlus size={16} />}
                    onClick={handleSaveDraft}
                    disabled={savedAsApp}
                  >
                    {savedAsApp ? 'Saved in Applications ✓' : 'Save Application Draft'}
                  </Button>
                  <Button
                    variant="primary"
                    iconRight={<ArrowRight size={16} />}
                    onClick={() => navigateTo('guide', { docId: activeDoc.id })}
                  >
                    Continue to Application Guide
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EligibilityCheck;
