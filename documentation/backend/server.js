require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const eligibilityRoutes = require('./routes/eligibility');
const guideRoutes = require('./routes/guides');
const applicationRoutes = require('./routes/applications');
const faqRoutes = require('./routes/faq');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CitizenDoc API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if present
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  const indexHtml = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send('CitizenDoc Backend API is running on port ' + PORT);
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
async function startServer() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`
=====================================================
  CitizenDoc Backend REST API Server is RUNNING
  Port:    http://localhost:${PORT}
  Health:  http://localhost:${PORT}/api/health
  Theme:   Royal Blue (#4169E1) Premium Design System
=====================================================
    `);
  });
}

startServer();
