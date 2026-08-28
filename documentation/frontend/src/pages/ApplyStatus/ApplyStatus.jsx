import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Calendar,
  MapPin,
  FileText,
  Edit3,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Play,
  RotateCw,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card, { CardBody } from '../../components/Common/Card';
import Badge from '../../components/Common/Badge';
import Button from '../../components/Common/Button';
import SearchBar from '../../components/Common/SearchBar';
import Modal from '../../components/Common/Modal';
import EmptyState from '../../components/Common/EmptyState';
import DocumentIcon from '../../components/Common/DocumentIcon';
import VerticalTimeline from '../../components/Timeline/VerticalTimeline';

const STATUS_FILTERS = ['All', 'Draft', 'Submitted', 'Received', 'In Review', 'Approved', 'Rejected', 'Completed'];
const STATUS_SEQUENCE = ['Draft', 'Submitted', 'Received', 'In Review', 'Approved', 'Completed'];

export const ApplyStatus = () => {
  const { savedApplications, navigateTo, refreshApplications, refreshStats } = useApp();
  const { token, user } = useAuth();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  // New application form state
  const { documents } = useApp();
  const [newDocId, setNewDocId] = useState(documents[0]?.id || 1);
  const [newAppNotes, setNewAppNotes] = useState('');

  const filteredApplications = savedApplications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      app.document_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleOpenDetailModal = (app) => {
    setSelectedApp(app);
    setEditedNotes(app.notes || '');
    setIsEditingNotes(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: editedNotes })
      });

      const json = await res.json();
      if (json.success) {
        setSelectedApp(prev => ({ ...prev, notes: editedNotes }));
        refreshApplications();
        setIsEditingNotes(false);
        success("Application notes updated");
      }
    } catch (e) {
      error("Failed to update notes");
    }
  };

  const handleAdvanceStatus = async (newStatus) => {
    if (!selectedApp) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const json = await res.json();
      if (json.success) {
        // Refetch single application to refresh timeline
        const singleRes = await fetch(`/api/applications/${selectedApp.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const singleJson = await singleRes.json();
        if (singleJson.success) {
          setSelectedApp(singleJson.data);
        }
        refreshApplications();
        refreshStats();
        success(`Application stage advanced to "${newStatus}"!`);
      }
    } catch (e) {
      error("Failed to update application status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCreateNewApp = async () => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          document_id: newDocId,
          state: user.state,
          status: 'Submitted',
          notes: newAppNotes || 'Application registered for active status tracking.'
        })
      });

      const json = await res.json();
      if (json.success) {
        refreshApplications();
        refreshStats();
        setIsNewAppModalOpen(false);
        setNewAppNotes('');
        success("New application added for tracking!");
      }
    } catch (e) {
      error("Failed to create application");
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
            <Activity size={14} /> Live Application Tracking
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Application Status Tracker
          </h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
            Monitor real-time verification milestones, police clearance, and issuance timelines for your government applications.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsNewAppModalOpen(true)}
        >
          Track New Application
        </Button>
      </div>

      {/* Search & Status Filter Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
        <div style={{ maxWidth: '420px' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by ID (e.g. APP-PAN) or document name..."
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12.5px',
                fontWeight: 600,
                border: '1.5px solid',
                borderColor: statusFilter === st ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: statusFilter === st ? 'var(--light-blue)' : 'var(--white)',
                color: statusFilter === st ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s'
              }}
            >
              {st} {st === 'All' ? `(${savedApplications.length})` : `(${savedApplications.filter(a => a.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards Grid */}
      {filteredApplications.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredApplications.map((app) => (
            <Card
              key={app.id}
              className="card-interactive"
              onClick={() => handleOpenDetailModal(app)}
            >
              <CardBody style={{ padding: '22px' }}>
                {/* Header: Document Name & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--light-blue)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <DocumentIcon iconName={app.document_icon} size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {app.document_name}
                      </h3>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {app.document_category}
                      </span>
                    </div>
                  </div>

                  <Badge status={app.status} />
                </div>

                {/* Application ID Pill */}
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--secondary-bg)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: 'var(--dark-blue)',
                    fontWeight: 600,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{app.application_id}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-family)' }}>REF ID</span>
                </div>

                {/* Details list: Applied date, state */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    <span>Applied Date: <strong>{new Date(app.applied_date).toLocaleDateString()}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--text-muted)" />
                    <span>State Jurisdiction: <strong>{app.state}</strong></span>
                  </div>
                </div>

                {/* Card Footer: Notes preview & View Timeline CTA */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #F1F5F9'
                  }}
                >
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.notes || 'No custom notes'}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Progress <ChevronRight size={14} />
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications found"
          description={
            statusFilter !== 'All'
              ? `No applications with status "${statusFilter}" currently.`
              : "You haven't saved any government document applications yet. Select a document to verify eligibility or explore a guide to save one!"
          }
          actionText="Explore Documents"
          onAction={() => navigateTo('explore')}
        />
      )}

      {/* Detailed Application Modal with Colored Vertical Timeline */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title={`${selectedApp.document_name} Application`}
          subtitle={`Application ID: ${selectedApp.application_id}`}
          size="lg"
          footer={
            <>
              <Button
                variant="outline"
                icon={<ExternalLink size={16} />}
                onClick={() => window.open(selectedApp.official_link, '_blank', 'noopener,noreferrer')}
              >
                Official Portal Tracker
              </Button>
              <Button variant="secondary" onClick={() => setSelectedApp(null)}>
                Close Details
              </Button>
            </>
          }
        >
          <div>
            {/* Status & Summary Header Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '16px 20px',
                backgroundColor: 'var(--light-blue)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px'
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: 'var(--dark-blue)', fontWeight: 600 }}>CURRENT APPLICATION STATUS</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Badge status={selectedApp.status} />
                  <span>{selectedApp.status}</span>
                </div>
              </div>

              {/* Stage Simulation Advancer (For paired interactive testing) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Update Stage:</span>
                <select
                  className="form-select"
                  value={selectedApp.status}
                  onChange={(e) => handleAdvanceStatus(e.target.value)}
                  disabled={updatingStatus}
                  style={{ width: '150px', padding: '6px 10px', fontSize: '13px' }}
                >
                  {STATUS_SEQUENCE.map((seq) => (
                    <option key={seq} value={seq}>{seq}</option>
                  ))}
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Applied Date</div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                  {new Date(selectedApp.applied_date).toLocaleDateString()}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>State</div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                  {selectedApp.state}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Tracking Reference</div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--primary)', marginTop: '2px' }}>
                  {selectedApp.tracking_number || selectedApp.application_id}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Last Activity</div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                  {selectedApp.last_updated ? new Date(selectedApp.last_updated).toLocaleDateString() : 'Recent'}
                </div>
              </div>
            </div>

            {/* Vertical Colored Progress Timeline */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Vertical Progress Timeline
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} /> Completed
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} /> Current
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} /> Upcoming
                  </span>
                </div>
              </div>

              <VerticalTimeline stages={selectedApp.timeline} />
            </div>

            {/* Application Notes Editor */}
            <div style={{ padding: '16px', backgroundColor: 'var(--secondary-bg)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Edit3 size={15} color="var(--primary)" /> Application Notes & Remarks
                </h4>
                {!isEditingNotes && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Edit Notes
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Add personal notes, appointment date, or document checklist remarks..."
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSaveNotes}>
                      Save Notes
                    </Button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {selectedApp.notes || 'No notes added yet. Click edit to record your visit dates or appointment slots.'}
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Track New Application Modal */}
      {isNewAppModalOpen && (
        <Modal
          isOpen={isNewAppModalOpen}
          onClose={() => setIsNewAppModalOpen(false)}
          title="Track New Application"
          subtitle="Record an application submitted on a government portal"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsNewAppModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateNewApp}>
                Add to Tracker
              </Button>
            </>
          }
        >
          <div>
            <div className="form-group">
              <label className="form-label">Select Government Document</label>
              <select
                className="form-select"
                value={newDocId}
                onChange={(e) => setNewDocId(parseInt(e.target.value))}
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.issuing_authority})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Custom Notes / Appointment Reference</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Appointment scheduled at PSK Pune for next Wednesday..."
                value={newAppNotes}
                onChange={(e) => setNewAppNotes(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApplyStatus;
