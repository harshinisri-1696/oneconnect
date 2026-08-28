import React, { useState, useMemo } from 'react';
import {
  BookmarkCheck,
  Search,
  Filter,
  Trash2,
  Edit2,
  ExternalLink,
  Calendar,
  MapPin,
  FileText,
  Download,
  AlertTriangle,
  ChevronDown,
  ArrowUpDown,
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

export const SavedApplications = () => {
  const { savedApplications, documents, navigateTo, refreshApplications, refreshStats } = useApp();
  const { token, user } = useAuth();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocFilter, setSelectedDocFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'oldest'

  // Modals
  const [editingApp, setEditingApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editState, setEditState] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Filtered & Sorted applications
  const processedApplications = useMemo(() => {
    return savedApplications
      .filter((app) => {
        const matchesDoc = selectedDocFilter === 'All' || app.document_id === parseInt(selectedDocFilter);
        const matchesStatus = selectedStatusFilter === 'All' || app.status.toLowerCase() === selectedStatusFilter.toLowerCase();
        const matchesSearch =
          app.document_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.application_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesDoc && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.applied_date) - new Date(b.applied_date);
        }
        return new Date(b.applied_date) - new Date(a.applied_date);
      });
  }, [savedApplications, selectedDocFilter, selectedStatusFilter, searchQuery, sortBy]);

  const handleOpenEdit = (app, e) => {
    e.stopPropagation();
    setEditingApp(app);
    setEditNotes(app.notes || '');
    setEditState(app.state || user.state);
    setEditStatus(app.status || 'Draft');
  };

  const handleSaveEdit = async () => {
    if (!editingApp) return;
    try {
      const res = await fetch(`/api/applications/${editingApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notes: editNotes,
          state: editState,
          status: editStatus
        })
      });

      const json = await res.json();
      if (json.success) {
        refreshApplications();
        refreshStats();
        setEditingApp(null);
        success("Application updated successfully!");
      }
    } catch (e) {
      error("Failed to update application");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingApp) return;
    try {
      const res = await fetch(`/api/applications/${deletingApp.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const json = await res.json();
      if (json.success) {
        refreshApplications();
        refreshStats();
        setDeletingApp(null);
        success("Application removed from saved list");
      }
    } catch (e) {
      error("Failed to delete application");
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedApplications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CitizenDoc_Applications_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    success("Applications exported to JSON");
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
            <BookmarkCheck size={14} /> Personal Vault
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Saved Applications ({savedApplications.length})
          </h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
            Manage, edit, or delete your bookmarked government document records and drafts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExportData}>
            Export Records
          </Button>
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigateTo('explore')}>
            Add New Document
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 2fr) minmax(180px, 1fr) minmax(160px, 1fr) minmax(150px, 1fr)',
          gap: '12px',
          marginBottom: '28px'
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ID, name, or notes..."
        />

        {/* Filter by Document */}
        <select
          className="form-select"
          value={selectedDocFilter}
          onChange={(e) => setSelectedDocFilter(e.target.value)}
        >
          <option value="All">All Documents</option>
          {documents.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        {/* Filter by Status */}
        <select
          className="form-select"
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Submitted">Submitted</option>
          <option value="Received">Received</option>
          <option value="In Review">In Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Sort */}
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
        </select>
      </div>

      {/* Applications Table / Cards */}
      {processedApplications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {processedApplications.map((app) => (
            <Card
              key={app.id}
              className="card-interactive"
              onClick={() => navigateTo('status')}
            >
              <CardBody style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  {/* Left: Document Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--light-blue)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <DocumentIcon iconName={app.document_icon} size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {app.document_name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                          {app.application_id}
                        </span>
                        <span>•</span>
                        <span>📍 {app.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Applied Date & Notes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} color="var(--text-muted)" />
                      <span>Applied: <strong>{new Date(app.applied_date).toLocaleDateString()}</strong></span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.notes || 'No notes added'}
                    </p>
                  </div>

                  {/* Right: Badge & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} onClick={(e) => e.stopPropagation()}>
                    <Badge status={app.status} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={(e) => handleOpenEdit(app, e)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Edit application notes or status"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingApp(app);
                        }}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Delete application"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved applications found"
          description="Try modifying your filters or search keywords to find your saved applications."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedDocFilter('All');
            setSelectedStatusFilter('All');
          }}
        />
      )}

      {/* Edit Modal */}
      {editingApp && (
        <Modal
          isOpen={Boolean(editingApp)}
          onClose={() => setEditingApp(null)}
          title={`Edit ${editingApp.document_name}`}
          subtitle={`Application ID: ${editingApp.application_id}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setEditingApp(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </>
          }
        >
          <div>
            <div className="form-group">
              <label className="form-label">Application Status</label>
              <select
                className="form-select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Received">Received</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Jurisdiction State</label>
              <input
                type="text"
                className="form-input"
                value={editState}
                onChange={(e) => setEditState(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Personal Notes & Remarks</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Enter personal notes or appointment slot details..."
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingApp && (
        <Modal
          isOpen={Boolean(deletingApp)}
          onClose={() => setDeletingApp(null)}
          title="Delete Saved Application?"
          subtitle={`Are you sure you want to remove ${deletingApp.document_name} (#${deletingApp.application_id})?`}
          footer={
            <>
              <Button variant="outline" onClick={() => setDeletingApp(null)}>
                Keep Application
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Yes, Delete Application
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '12px 0' }}>
            <AlertTriangle size={28} color="var(--error)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              This will permanently remove this record and its custom timeline tracking from your CitizenDoc vault. You can always re-add it in the future if needed.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SavedApplications;
