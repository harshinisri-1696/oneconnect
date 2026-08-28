const express = require('express');
const router = express.Router();
const { memoryStore, isUsingMySQL, getMySQLPool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// GET /api/stats/dashboard - Get summary statistics, activities, and notifications
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || 1;

    let totalDocsCount = 12;
    let savedAppsCount = 0;
    let pendingCount = 0;
    let eligibleCount = 8;
    let popularServices = [];
    let recentActivities = [];
    let notifications = [];

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [docCountRow] = await pool.query('SELECT COUNT(*) as cnt FROM documents');
      totalDocsCount = docCountRow[0].cnt;

      const [appsRows] = await pool.query('SELECT status FROM saved_applications WHERE user_id = ?', [userId]);
      savedAppsCount = appsRows.length;
      pendingCount = appsRows.filter(a => ['Draft', 'Submitted', 'Received', 'In Review'].includes(a.status)).length;

      const [popRows] = await pool.query('SELECT id, name, slug, category, fee, processing_time, icon FROM documents LIMIT 6');
      popularServices = popRows;

      const [actRows] = await pool.query('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [userId]);
      recentActivities = actRows;

      const [notifRows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 6', [userId]);
      notifications = notifRows;
    } else {
      totalDocsCount = memoryStore.data.documents.length;
      const userApps = memoryStore.data.saved_applications.filter(a => a.user_id === userId);
      savedAppsCount = userApps.length;
      pendingCount = userApps.filter(a => ['Draft', 'Submitted', 'Received', 'In Review'].includes(a.status)).length;

      popularServices = memoryStore.data.documents.slice(0, 6);
      recentActivities = memoryStore.data.activity_logs.filter(a => a.user_id === userId).slice(0, 6);
      notifications = memoryStore.data.notifications.filter(n => n.user_id === userId).slice(0, 6);
    }

    res.json({
      success: true,
      data: {
        stats: {
          total_documents: totalDocsCount,
          eligible_documents: eligibleCount,
          saved_applications: savedAppsCount,
          pending_status: pendingCount
        },
        popular_services: popularServices,
        recent_activities: recentActivities,
        notifications: notifications,
        unread_notifications_count: notifications.filter(n => !n.is_read).length
      }
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

// POST /api/stats/notifications/read-all
router.post('/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    } else {
      memoryStore.data.notifications.forEach(n => {
        if (n.user_id === userId) n.is_read = true;
      });
      memoryStore.saveToFile();
    }
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
});

module.exports = router;
