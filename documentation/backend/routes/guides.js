const express = require('express');
const router = express.Router();
const { memoryStore, isUsingMySQL, getMySQLPool } = require('../config/db');

// GET /api/guides/:docIdOrSlug
router.get('/:docIdOrSlug', async (req, res) => {
  try {
    const { docIdOrSlug } = req.params;
    const isNum = !isNaN(docIdOrSlug);

    let doc = null;
    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const query = isNum ? 'SELECT * FROM documents WHERE id = ?' : 'SELECT * FROM documents WHERE slug = ?';
      const [rows] = await pool.query(query, [docIdOrSlug]);
      if (rows.length > 0) doc = rows[0];
    } else {
      doc = memoryStore.data.documents.find(d => isNum ? d.id === parseInt(docIdOrSlug) : d.slug === docIdOrSlug);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    let guides = [];
    let faqs = [];

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [gRows] = await pool.query('SELECT * FROM application_guides WHERE document_id = ? ORDER BY step_number ASC', [doc.id]);
      const [fRows] = await pool.query('SELECT * FROM faq WHERE document_id = ?', [doc.id]);
      guides = gRows;
      faqs = fRows;
    } else {
      guides = memoryStore.data.application_guides.filter(g => g.document_id === doc.id).sort((a, b) => a.step_number - b.step_number);
      faqs = memoryStore.data.faq.filter(f => f.document_id === doc.id);
    }

    res.json({
      success: true,
      data: {
        document: doc,
        steps: guides,
        faqs,
        important_notes: [
          `Ensure all supporting documents are clearly scanned in original color format.`,
          `Government fee of ${doc.fee} should only be paid directly via the authorized ${doc.issuing_authority} portal (${doc.official_link}). CitizenDoc does not charge any intermediary service fees.`,
          `Keep your Application Reference Number / Acknowledgement Slip secure to track status directly.`
        ]
      }
    });
  } catch (err) {
    console.error("Get guide error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch application guide' });
  }
});

module.exports = router;
