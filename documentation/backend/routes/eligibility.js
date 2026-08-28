const express = require('express');
const router = express.Router();
const { memoryStore, isUsingMySQL, getMySQLPool } = require('../config/db');

// GET /api/eligibility/questions/:documentId
router.get('/questions/:documentId', async (req, res) => {
  try {
    const documentId = parseInt(req.params.documentId);

    let doc = null;
    let questions = [];

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [docRows] = await pool.query('SELECT * FROM documents WHERE id = ?', [documentId]);
      if (docRows.length === 0) return res.status(404).json({ success: false, message: 'Document not found' });
      doc = docRows[0];

      const [qRows] = await pool.query('SELECT * FROM eligibility_questions WHERE document_id = ? ORDER BY id ASC', [documentId]);
      questions = qRows.map(q => ({
        ...q,
        options: typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json
      }));
    } else {
      doc = memoryStore.data.documents.find(d => d.id === documentId);
      if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

      questions = memoryStore.data.eligibility_questions
        .filter(q => q.document_id === documentId)
        .map(q => ({
          ...q,
          options: typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json
        }));
    }

    res.json({
      success: true,
      document: doc,
      questions
    });
  } catch (err) {
    console.error("Get eligibility questions error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch eligibility questions' });
  }
});

// POST /api/eligibility/evaluate
router.post('/evaluate', async (req, res) => {
  try {
    const { document_id, answers, state } = req.body;
    if (!document_id) {
      return res.status(400).json({ success: false, message: 'document_id is required' });
    }

    const docId = parseInt(document_id);
    let doc = null;
    let questions = [];

    if (isUsingMySQL()) {
      const pool = getMySQLPool();
      const [docRows] = await pool.query('SELECT * FROM documents WHERE id = ?', [docId]);
      if (docRows.length === 0) return res.status(404).json({ success: false, message: 'Document not found' });
      doc = docRows[0];
      const [qRows] = await pool.query('SELECT * FROM eligibility_questions WHERE document_id = ?', [docId]);
      questions = qRows;
    } else {
      doc = memoryStore.data.documents.find(d => d.id === docId);
      if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
      questions = memoryStore.data.eligibility_questions.filter(q => q.document_id === docId);
    }

    // Dynamic scoring calculation
    let totalScore = 0;
    let maxScore = 0;
    const feedbackList = [];
    const requiredDocs = [];

    // Base document list
    if (doc.required_docs_summary) {
      requiredDocs.push(...doc.required_docs_summary);
    } else {
      requiredDocs.push(
        "Proof of Identity (Aadhaar / Voter ID / Passport)",
        "Proof of Residence / Address",
        "Recent Passport-size Photograph",
        "Self-Declaration / Application Form"
      );
    }

    questions.forEach(q => {
      const weight = q.weight || 25;
      maxScore += weight;
      const userAns = answers ? answers[q.field_key] : null;

      if (!userAns) {
        totalScore += weight * 0.7; // default moderate score
        return;
      }

      const ansStr = String(userAns).toLowerCase();

      // Heuristic checks
      if (ansStr.includes('no') && (ansStr.includes('court') || ansStr.includes('criminal') || ansStr.includes('not registered'))) {
        totalScore += weight; // positive response (no criminal record)
        feedbackList.push(`Passed background check criteria.`);
      } else if (ansStr.includes('yes') || ansStr.includes('18+') || ansStr.includes('adult') || ansStr.includes('resident') || ansStr.includes('available')) {
        totalScore += weight;
        feedbackList.push(`Criterion met: ${q.question.split('?')[0]}`);
      } else if (ansStr.includes('minor') || ansStr.includes('below 18') || ansStr.includes('5 to 17')) {
        totalScore += weight * 0.9;
        requiredDocs.push("Parent / Legal Guardian Identity Proof and Relationship Certificate");
        feedbackList.push(`Minor applicant: Representative assessee/parent documentation will be required.`);
      } else if (ansStr.includes('tatkaal')) {
        totalScore += weight;
        requiredDocs.push("3 Standard Identity Proofs (Mandatory for Tatkaal Scheme)");
      } else if (ansStr.includes('non-creamy layer') || ansStr.includes('below 8 lakh')) {
        totalScore += weight;
        requiredDocs.push("Income Certificate from Tahsildar (< ₹8 Lakhs) for Non-Creamy Layer");
      } else {
        totalScore += weight * 0.6;
        feedbackList.push(`Conditional validation for ${q.field_key}`);
      }
    });

    const calculatedPercentage = maxScore > 0 ? Math.min(100, Math.round((totalScore / maxScore) * 100)) : 95;
    
    let eligibilityStatus = 'Eligible';
    let statusColor = '#16A34A'; // Green
    if (calculatedPercentage < 60) {
      eligibilityStatus = 'Ineligible';
      statusColor = '#DC2626'; // Red
    } else if (calculatedPercentage < 85) {
      eligibilityStatus = 'Conditionally Eligible';
      statusColor = '#F59E0B'; // Orange
    }

    // Deduplicate required docs
    const uniqueRequiredDocs = Array.from(new Set(requiredDocs));

    // Log recent activity for demo user
    const activityItem = {
      id: Date.now(),
      user_id: 1,
      action_type: 'ELIGIBILITY_CHECK',
      title: `Checked Eligibility for ${doc.name}`,
      description: `Evaluated dynamic eligibility for ${doc.name} - Score: ${calculatedPercentage}% (${eligibilityStatus}).`,
      created_at: new Date().toISOString()
    };
    memoryStore.data.activity_logs.unshift(activityItem);
    if (memoryStore.data.activity_logs.length > 20) memoryStore.data.activity_logs.pop();
    memoryStore.saveToFile();

    res.json({
      success: true,
      data: {
        document_id: doc.id,
        document_name: doc.name,
        slug: doc.slug,
        is_eligible: calculatedPercentage >= 60,
        status: eligibilityStatus,
        status_color: statusColor,
        score: calculatedPercentage,
        processing_time: doc.processing_time,
        fee: doc.fee,
        official_link: doc.official_link,
        required_documents: uniqueRequiredDocs,
        feedback: feedbackList,
        next_step_url: `/guide/${doc.slug || doc.id}`,
        summary: `Based on your responses for ${doc.name}, you have a ${calculatedPercentage}% eligibility match with the issuing guidelines of ${doc.issuing_authority}.`
      }
    });
  } catch (err) {
    console.error("Evaluate eligibility error:", err);
    res.status(500).json({ success: false, message: 'Failed to evaluate eligibility' });
  }
});

module.exports = router;
