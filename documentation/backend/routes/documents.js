const express = require('express');
const router = express.Router();
const { memoryStore, isUsingMySQL, getMySQLPool } = require('../config/db');

// GET /api/documents - Get all documents with optional search & category filter
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      let query = 'SELECT * FROM documents WHERE 1=1';
      const params = [];

      if (category && category !== 'All') {
        query += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ? OR issuing_authority LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      query += ' ORDER BY id ASC';
      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let docs = [...memoryStore.data.documents];

    if (category && category !== 'All') {
      docs = docs.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.issuing_authority.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
});

// GET /api/documents/:idOrSlug - Get single document with questions & guide preview
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isNum = !isNaN(idOrSlug);

    let doc = null;
    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const query = isNum ? 'SELECT * FROM documents WHERE id = ?' : 'SELECT * FROM documents WHERE slug = ?';
      const [rows] = await pool.query(query, [idOrSlug]);
      if (rows.length > 0) doc = rows[0];
    } else {
      doc = memoryStore.data.documents.find(d => isNum ? d.id === parseInt(idOrSlug) : d.slug === idOrSlug);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Attach questions and guides
    let questions = [];
    let guides = [];

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [qRows] = await pool.query('SELECT * FROM eligibility_questions WHERE document_id = ? ORDER BY id ASC', [doc.id]);
      const [gRows] = await pool.query('SELECT * FROM application_guides WHERE document_id = ? ORDER BY step_number ASC', [doc.id]);
      questions = qRows;
      guides = gRows;
    } else {
      questions = memoryStore.data.eligibility_questions.filter(q => q.document_id === doc.id);
      guides = memoryStore.data.application_guides.filter(g => g.document_id === doc.id).sort((a, b) => a.step_number - b.step_number);
    }

    res.json({
      success: true,
      data: {
        ...doc,
        questions,
        guides
      }
    });
  } catch (err) {
    console.error("Fetch single document error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch document' });
  }
});

module.exports = router;
