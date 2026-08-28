const express = require('express');
const router = express.Router();
const { memoryStore, isUsingMySQL, getMySQLPool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const STATUS_ORDER = ['Draft', 'Submitted', 'Received', 'In Review', 'Approved', 'Completed'];

// Helper function to build timeline stages with colored indicators (Green = completed, Orange = current, Gray = upcoming)
function buildApplicationTimeline(status, appliedDate, lastUpdated) {
  const currentIdx = STATUS_ORDER.indexOf(status);
  const effectiveIdx = currentIdx === -1 ? 0 : currentIdx;

  const stageDefinitions = [
    {
      key: 'Draft',
      title: 'Application Created / Drafted',
      description: 'Application drafted and required supporting proofs assembled.',
      date: appliedDate || 'Day 1'
    },
    {
      key: 'Submitted',
      title: 'Submitted to Portal / Kendra',
      description: 'Form submitted on official government portal with fee acknowledgement.',
      date: appliedDate ? new Date(new Date(appliedDate).getTime() + 86400000).toISOString().split('T')[0] : 'Day 2'
    },
    {
      key: 'Received',
      title: 'Acknowledged & Received by Authority',
      description: 'Document processing cell acknowledged receipt and assigned reference ARN.',
      date: appliedDate ? new Date(new Date(appliedDate).getTime() + 86400000 * 3).toISOString().split('T')[0] : 'Day 4'
    },
    {
      key: 'In Review',
      title: 'Scrutiny & Field Verification',
      description: 'Demographic scrutiny, address check, or officer field verification in progress.',
      date: lastUpdated ? new Date(lastUpdated).toISOString().split('T')[0] : 'In Progress'
    },
    {
      key: 'Approved',
      title: 'Verification Approved',
      description: 'Document verified and clearance granted by Competent Authority.',
      date: status === 'Approved' || status === 'Completed' ? (lastUpdated ? new Date(lastUpdated).toISOString().split('T')[0] : 'Approved') : 'Pending'
    },
    {
      key: 'Completed',
      title: 'Issued / Dispatched via Speed Post',
      description: 'Physical card / certificate printed and dispatched or digital copy generated.',
      date: status === 'Completed' ? (lastUpdated ? new Date(lastUpdated).toISOString().split('T')[0] : 'Completed') : 'Upcoming'
    }
  ];

  if (status === 'Rejected') {
    return [
      {
        key: 'Draft',
        title: 'Application Created',
        description: 'Initial application draft saved.',
        state: 'completed', // Green
        color: '#16A34A',
        date: appliedDate
      },
      {
        key: 'Submitted',
        title: 'Submitted to Portal',
        description: 'Submitted for verification.',
        state: 'completed', // Green
        color: '#16A34A',
        date: appliedDate
      },
      {
        key: 'Rejected',
        title: 'Application Disapproved / Query Raised',
        description: 'Application was rejected due to document mismatch or incomplete proofs.',
        state: 'current', // Red / Attention
        color: '#DC2626',
        date: lastUpdated || appliedDate
      }
    ];
  }

  return stageDefinitions.map((stage, idx) => {
    let stageState = 'upcoming'; // Gray
    let color = '#94A3B8';

    if (idx < effectiveIdx) {
      stageState = 'completed'; // Green
      color = '#16A34A';
    } else if (idx === effectiveIdx) {
      stageState = 'current'; // Orange
      color = '#F59E0B';
    }

    return {
      ...stage,
      state: stageState,
      color: color,
      isCurrent: idx === effectiveIdx,
      isCompleted: idx < effectiveIdx,
      isUpcoming: idx > effectiveIdx
    };
  });
}

// GET /api/applications - Get all saved applications for user with search, filter, sort
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    const { search, document_id, status, sort } = req.query;

    let apps = [];

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      let query = `
        SELECT sa.*, d.name as document_name, d.slug as document_slug, d.category as document_category, 
               d.official_link, d.icon as document_icon, d.fee as document_fee, d.processing_time
        FROM saved_applications sa
        JOIN documents d ON sa.document_id = d.id
        WHERE sa.user_id = ?
      `;
      const params = [userId];

      if (document_id && document_id !== 'All') {
        query += ' AND sa.document_id = ?';
        params.push(document_id);
      }
      if (status && status !== 'All') {
        query += ' AND sa.status = ?';
        params.push(status);
      }
      if (search) {
        query += ' AND (d.name LIKE ? OR sa.application_id LIKE ? OR sa.notes LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      if (sort === 'oldest') {
        query += ' ORDER BY sa.applied_date ASC, sa.id ASC';
      } else {
        query += ' ORDER BY sa.applied_date DESC, sa.id DESC';
      }

      const [rows] = await pool.query(query, params);
      apps = rows;
    } else {
      apps = memoryStore.data.saved_applications
        .filter(app => app.user_id === userId)
        .map(app => {
          const doc = memoryStore.data.documents.find(d => d.id === app.document_id) || {};
          return {
            ...app,
            document_name: doc.name || 'Government Document',
            document_slug: doc.slug || 'document',
            document_category: doc.category || 'General',
            official_link: doc.official_link || 'https://india.gov.in',
            document_icon: doc.icon || 'FileText',
            document_fee: doc.fee || '₹0',
            processing_time: doc.processing_time || '15 Days'
          };
        });

      if (document_id && document_id !== 'All') {
        apps = apps.filter(a => a.document_id === parseInt(document_id));
      }
      if (status && status !== 'All') {
        apps = apps.filter(a => a.status.toLowerCase() === status.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        apps = apps.filter(a =>
          a.document_name.toLowerCase().includes(q) ||
          a.application_id.toLowerCase().includes(q) ||
          (a.notes && a.notes.toLowerCase().includes(q))
        );
      }

      if (sort === 'oldest') {
        apps.sort((a, b) => new Date(a.applied_date) - new Date(b.applied_date));
      } else {
        apps.sort((a, b) => new Date(b.applied_date) - new Date(a.applied_date));
      }
    }

    // Attach timeline to each application
    const enrichedApps = apps.map(app => ({
      ...app,
      timeline: buildApplicationTimeline(app.status, app.applied_date, app.last_updated)
    }));

    res.json({
      success: true,
      count: enrichedApps.length,
      data: enrichedApps
    });
  } catch (err) {
    console.error("Get saved applications error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch saved applications' });
  }
});

// GET /api/applications/:id - Get single application details with timeline & official tracker
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const appId = parseInt(req.params.id);
    let app = null;

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query(`
        SELECT sa.*, d.name as document_name, d.slug as document_slug, d.category as document_category, 
               d.official_link, d.icon as document_icon, d.issuing_authority, d.fee, d.processing_time
        FROM saved_applications sa
        JOIN documents d ON sa.document_id = d.id
        WHERE sa.id = ?
      `, [appId]);
      if (rows.length > 0) app = rows[0];
    } else {
      const found = memoryStore.data.saved_applications.find(a => a.id === appId);
      if (found) {
        const doc = memoryStore.data.documents.find(d => d.id === found.document_id) || {};
        app = {
          ...found,
          document_name: doc.name,
          document_slug: doc.slug,
          document_category: doc.category,
          official_link: doc.official_link,
          document_icon: doc.icon,
          issuing_authority: doc.issuing_authority,
          fee: doc.fee,
          processing_time: doc.processing_time
        };
      }
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const timeline = buildApplicationTimeline(app.status, app.applied_date, app.last_updated);

    res.json({
      success: true,
      data: {
        ...app,
        timeline,
        official_tracking_url: `${app.official_link}`
      }
    });
  } catch (err) {
    console.error("Get single application error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch application details' });
  }
});

// POST /api/applications - Save / Create new application
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    const { document_id, state, status, notes, tracking_number, applied_date } = req.body;

    if (!document_id) {
      return res.status(400).json({ success: false, message: 'document_id is required' });
    }

    const docId = parseInt(document_id);
    const doc = memoryStore.data.documents.find(d => d.id === docId) || { name: 'Document', slug: 'doc' };
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const prefix = (doc.slug || 'DOC').substring(0, 3).toUpperCase();
    const generatedAppId = `APP-${prefix}-2026-${randomCode}`;
    const dateStr = applied_date || new Date().toISOString().split('T')[0];
    const initialStatus = status || 'Draft';
    const initialNotes = notes || `Application for ${doc.name} initiated on CitizenDoc.`;
    const trackingNum = tracking_number || `${prefix}${randomCode}IN`;

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [result] = await pool.query(
        'INSERT INTO saved_applications (user_id, document_id, application_id, applied_date, state, status, notes, tracking_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, docId, generatedAppId, dateStr, state || 'Maharashtra', initialStatus, initialNotes, trackingNum]
      );

      const [newRow] = await pool.query('SELECT * FROM saved_applications WHERE id = ?', [result.insertId]);
      return res.status(201).json({
        success: true,
        message: 'Application saved successfully!',
        data: newRow[0]
      });
    } else {
      const newApp = {
        id: Date.now(),
        user_id: userId,
        document_id: docId,
        application_id: generatedAppId,
        applied_date: dateStr,
        state: state || 'Maharashtra',
        status: initialStatus,
        last_updated: new Date().toISOString().replace('T', ' ').substring(0, 19),
        notes: initialNotes,
        tracking_number: trackingNum
      };

      memoryStore.data.saved_applications.unshift(newApp);

      // Add to activity log
      memoryStore.data.activity_logs.unshift({
        id: Date.now() + 1,
        user_id: userId,
        action_type: 'APPLICATION_SAVED',
        title: `Saved ${doc.name} Application`,
        description: `Application #${generatedAppId} added to your tracker in ${initialStatus} status.`,
        created_at: new Date().toISOString()
      });

      memoryStore.saveToFile();

      res.status(201).json({
        success: true,
        message: 'Application saved successfully!',
        data: newApp
      });
    }
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ success: false, message: 'Failed to create application' });
  }
});

// PUT /api/applications/:id - Update application status, notes, state
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const appId = parseInt(req.params.id);
    const { status, notes, state, tracking_number } = req.body;

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      await pool.query(
        'UPDATE saved_applications SET status = COALESCE(?, status), notes = COALESCE(?, notes), state = COALESCE(?, state), tracking_number = COALESCE(?, tracking_number), last_updated = CURRENT_TIMESTAMP WHERE id = ?',
        [status, notes, state, tracking_number, appId]
      );
      const [rows] = await pool.query('SELECT * FROM saved_applications WHERE id = ?', [appId]);
      return res.json({ success: true, message: 'Application updated successfully', data: rows[0] });
    } else {
      const app = memoryStore.data.saved_applications.find(a => a.id === appId);
      if (!app) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      if (status) app.status = status;
      if (notes !== undefined) app.notes = notes;
      if (state) app.state = state;
      if (tracking_number) app.tracking_number = tracking_number;
      app.last_updated = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Add to activity log
      const doc = memoryStore.data.documents.find(d => d.id === app.document_id) || { name: 'Document' };
      memoryStore.data.activity_logs.unshift({
        id: Date.now(),
        user_id: req.user.id || 1,
        action_type: 'STATUS_UPDATE',
        title: `Updated ${doc.name} Status`,
        description: `Application #${app.application_id} updated to "${app.status}".`,
        created_at: new Date().toISOString()
      });

      memoryStore.saveToFile();

      res.json({
        success: true,
        message: 'Application updated successfully',
        data: app
      });
    }
  } catch (err) {
    console.error("Update application error:", err);
    res.status(500).json({ success: false, message: 'Failed to update application' });
  }
});

// DELETE /api/applications/:id - Delete saved application
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const appId = parseInt(req.params.id);

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      await pool.query('DELETE FROM saved_applications WHERE id = ?', [appId]);
      return res.json({ success: true, message: 'Application removed successfully' });
    } else {
      const index = memoryStore.data.saved_applications.findIndex(a => a.id === appId);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      const deleted = memoryStore.data.saved_applications.splice(index, 1)[0];
      memoryStore.saveToFile();

      res.json({
        success: true,
        message: 'Application removed successfully',
        data: deleted
      });
    }
  } catch (err) {
    console.error("Delete application error:", err);
    res.status(500).json({ success: false, message: 'Failed to delete application' });
  }
});

module.exports = router;
