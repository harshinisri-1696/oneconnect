const express = require('express');
const router = express.Router();
const { memoryStore, isUsingMySQL, getMySQLPool } = require('../config/db');

// GET /api/faq - Get FAQs with optional search & category filter
router.get('/', async (req, res) => {
  try {
    const { category, search, document_id } = req.query;

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      let query = 'SELECT f.*, d.name as document_name FROM faq f LEFT JOIN documents d ON f.document_id = d.id WHERE 1=1';
      const params = [];

      if (document_id && document_id !== 'All') {
        query += ' AND f.document_id = ?';
        params.push(document_id);
      }
      if (category && category !== 'All') {
        query += ' AND (f.category = ? OR d.name = ?)';
        params.push(category, category);
      }
      if (search) {
        query += ' AND (f.question LIKE ? OR f.answer LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term);
      }

      query += ' ORDER BY f.id ASC';
      const [rows] = await pool.query(query, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let faqs = [...memoryStore.data.faq].map(f => {
      const doc = memoryStore.data.documents.find(d => d.id === f.document_id);
      return {
        ...f,
        document_name: doc ? doc.name : f.category
      };
    });

    if (document_id && document_id !== 'All') {
      faqs = faqs.filter(f => f.document_id === parseInt(document_id));
    }
    if (category && category !== 'All') {
      faqs = faqs.filter(f => (f.category && f.category.toLowerCase() === category.toLowerCase()) || (f.document_name && f.document_name.toLowerCase() === category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      faqs = faqs.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.category && f.category.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (err) {
    console.error("Get FAQ error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
});

// POST /api/faq/:id/helpful - Vote FAQ as helpful
router.post('/:id/helpful', async (req, res) => {
  try {
    const faqId = parseInt(req.params.id);
    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      await pool.query('UPDATE faq SET helpful_count = helpful_count + 1 WHERE id = ?', [faqId]);
      return res.json({ success: true, message: 'Thank you for your feedback!' });
    }

    const faq = memoryStore.data.faq.find(f => f.id === faqId);
    if (faq) {
      faq.helpful_count = (faq.helpful_count || 0) + 1;
      memoryStore.saveToFile();
    }
    res.json({ success: true, message: 'Thank you for your feedback!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record feedback' });
  }
});

module.exports = router;
