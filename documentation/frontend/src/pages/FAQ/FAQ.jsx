import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
  FileQuestion,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Card, { CardBody } from '../../components/Common/Card';
import SearchBar from '../../components/Common/SearchBar';
import EmptyState from '../../components/Common/EmptyState';

export const FAQ = () => {
  const { documents } = useApp();
  const { success } = useToast();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(1);
  const [votedIds, setVotedIds] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch('/api/faq')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setFaqs(json.data);
        }
      })
      .catch(err => console.error("FAQ fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const list = ['All'];
    documents.forEach(d => {
      if (!list.includes(d.name)) list.push(d.name);
    });
    return list;
  }, [documents]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      const matchesCategory = selectedCategory === 'All' ||
        (f.category && f.category.toLowerCase() === selectedCategory.toLowerCase()) ||
        (f.document_name && f.document_name.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch =
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const handleVoteHelpful = async (faqId, e) => {
    e.stopPropagation();
    if (votedIds[faqId]) return;
    try {
      await fetch(`/api/faq/${faqId}/helpful`, { method: 'POST' });
      setVotedIds(prev => ({ ...prev, [faqId]: true }));
      success("Thanks for your feedback!");
    } catch (e) {}
  };

  const toggleAccordion = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="page-container">
      {/* Page Title */}
      <div className="page-title-section">
        <div className="page-eyebrow"><HelpCircle size={13} /> Knowledge Base &amp; Support</div>
        <h1 className="page-title">Frequently Asked Questions</h1>
        <p className="page-subtitle">
          Find instant answers about document eligibility, fees, offline visits, biometric rules, and verification standards.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search questions (e.g. Baal Aadhaar, Tatkaal, Minor PAN, Police)…"
        />
        {/* Category pills — scrollable on mobile */}
        <div className="filter-pills-row">
          {categories.map((cat) => (
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

      {/* Accordion FAQ List */}
      {filteredFaqs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '900px' }}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const hasVoted = !!votedIds[faq.id];

            return (
              <Card
                key={faq.id}
                style={{
                  border: isExpanded ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                  boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                  transition: 'all 0.2s'
                }}
              >
                <div
                  onClick={() => toggleAccordion(faq.id)}
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? '#FAFBFD' : 'var(--white)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isExpanded ? 'var(--primary)' : 'var(--light-blue)',
                        color: isExpanded ? 'var(--white)' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      Q
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        {faq.category || faq.document_name}
                      </span>
                      <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isExpanded ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {isExpanded && (
                  <CardBody
                    style={{
                      padding: '0 24px 24px 24px',
                      backgroundColor: '#FAFBFD',
                      borderTop: '1px solid #F1F5F9'
                    }}
                  >
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, paddingTop: '16px' }}>
                      {faq.answer}
                    </p>

                    {/* Helpfulness Footer */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '20px',
                        paddingTop: '14px',
                        borderTop: '1px solid #E2E8F0',
                        fontSize: '12.5px',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <span>Was this answer helpful?</span>
                      <button
                        onClick={(e) => handleVoteHelpful(faq.id, e)}
                        disabled={hasVoted}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          backgroundColor: hasVoted ? 'var(--success-bg)' : 'var(--white)',
                          color: hasVoted ? 'var(--success)' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: hasVoted ? 'default' : 'pointer'
                        }}
                      >
                        <ThumbsUp size={13} /> {hasVoted ? 'Marked Helpful ✓' : 'Yes, Helpful'}
                      </button>
                    </div>
                  </CardBody>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No questions found"
          description={`We couldn't find any FAQs matching "${searchQuery}".`}
          actionText="Reset Search"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      )}
    </div>
  );
};

export default FAQ;
