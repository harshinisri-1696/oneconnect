const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const {
  initialDocuments,
  eligibilityQuestions,
  applicationGuides,
  initialFaqs,
  initialDemoApplications,
  initialActivityLogs,
  initialNotifications
} = require('../data/initialData');

// Local in-memory persistent database fallback
class MemoryStore {
  constructor() {
    this.storageFile = path.join(__dirname, '..', 'data', 'local_storage.json');
    this.data = {
      users: [
        {
          id: 1,
          name: "Aarav Sharma",
          email: "aarav.sharma@example.com",
          password: "$2a$10$7Z8l1Uq5aE78Z4VvO6ZquOSQnK2f2P8vE8Fh3zQWd8VlY/y7kK5C.", // password123
          state: "Maharashtra",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          created_at: new Date().toISOString()
        }
      ],
      documents: [...initialDocuments],
      eligibility_questions: [...eligibilityQuestions],
      application_guides: [...applicationGuides],
      saved_applications: [...initialDemoApplications],
      faq: [...initialFaqs],
      activity_logs: [...initialActivityLogs],
      notifications: [...initialNotifications]
    };
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(this.storageFile)) {
        const raw = fs.readFileSync(this.storageFile, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      }
    } catch (err) {
      console.warn("Could not load local storage file, using in-memory defaults:", err.message);
    }
  }

  saveToFile() {
    try {
      const dir = path.dirname(this.storageFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storageFile, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.warn("Could not persist to local storage file:", err.message);
    }
  }
}

const memoryStore = new MemoryStore();
let mysqlPool = null;
let isUsingMySQL = false;

async function initDB() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'citizendoc_db';
  const dbPort = process.env.DB_PORT || 3306;

  // Attempt MySQL connection if credentials or flag provided
  try {
    const testPool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const [rows] = await testPool.query('SELECT 1 + 1 AS solution');
    if (rows && rows[0] && rows[0].solution === 2) {
      mysqlPool = testPool;
      isUsingMySQL = true;
      console.log(`[Database] Connected to MySQL Database "${dbName}" successfully on ${dbHost}:${dbPort}`);
      return;
    }
  } catch (err) {
    console.log(`[Database] MySQL not reachable (${err.message}). Using Embedded High-Speed Persistence Engine.`);
    isUsingMySQL = false;
  }
}

module.exports = {
  initDB,
  isUsingMySQL: () => isUsingMySQL,
  getMySQLPool: () => mysqlPool,
  memoryStore
};
