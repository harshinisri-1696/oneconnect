-- =======================================================
-- CitizenDoc - MySQL Database Schema
-- =======================================================

CREATE DATABASE IF NOT EXISTS citizendoc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE citizendoc_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    state VARCHAR(100) DEFAULT 'Maharashtra',
    avatar VARCHAR(255) DEFAULT 'default_avatar.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    processing_time VARCHAR(100) NOT NULL,
    fee VARCHAR(100) NOT NULL,
    official_link VARCHAR(500) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL,
    icon VARCHAR(100) NOT NULL,
    eligibility_overview TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Eligibility Questions Table
CREATE TABLE IF NOT EXISTS eligibility_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    question TEXT NOT NULL,
    input_type VARCHAR(50) NOT NULL, -- 'select', 'radio', 'number', 'text', 'boolean'
    field_key VARCHAR(100) NOT NULL,
    options_json TEXT, -- JSON array of possible options
    help_text VARCHAR(255),
    weight INT DEFAULT 10,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- 4. Application Guides Table
CREATE TABLE IF NOT EXISTS application_guides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    step_number INT NOT NULL,
    step_title VARCHAR(255) NOT NULL,
    step_description TEXT NOT NULL,
    icon_name VARCHAR(100) DEFAULT 'FileCheck',
    tips TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- 5. Saved Applications Table
CREATE TABLE IF NOT EXISTS saved_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_id INT NOT NULL,
    application_id VARCHAR(100) NOT NULL UNIQUE,
    applied_date DATE NOT NULL,
    state VARCHAR(100) NOT NULL,
    status ENUM('Draft', 'Submitted', 'Received', 'In Review', 'Approved', 'Rejected', 'Completed') DEFAULT 'Draft',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    tracking_number VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- 6. FAQ Table
CREATE TABLE IF NOT EXISTS faq (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NULL,
    category VARCHAR(100) DEFAULT 'General',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
);

-- 7. Activity Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
