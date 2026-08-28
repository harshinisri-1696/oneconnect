# Implementation Plan - CitizenDoc Platform

CitizenDoc is a smart citizen assistance platform built with React, Node.js (Express), CSS, and MySQL/SQLite. It helps citizens discover government documents, dynamically check eligibility, follow step-by-step application guides, track application progress with colored timelines, manage saved applications, and access official portal links.

## User Review Required

> [!IMPORTANT]
> - The database will be fully configured with MySQL schema (`schema.sql`) and seed data (`seed.sql`). We also provide an embedded database layer (SQLite / persistent JSON storage with identical schema and API contracts) so the application works seamlessly right away without requiring manual MySQL server initialization, while allowing easy switch to a live MySQL instance via environment variables.
> - The design system strictly implements the requested color palette: Primary Royal Blue (`#4169E1`), Dark Blue (`#1E3A8A`), Light Blue (`#E8F0FF`), Secondary Background (`#F7F9FC`), Text (`#172033`), along with the exact specifications for Primary and Secondary buttons and responsive sidebar/bottom-nav layouts.

## Architecture & Features

```
CitizenDoc Full-Stack Webpage
├── backend/
│   ├── server.js (Express API server)
│   ├── config/ (db.js supporting MySQL + SQLite fallback)
│   ├── routes/
│   │   ├── authRoutes.js (Login, Register, Profile, Settings)
│   │   ├── documentRoutes.js (12 documents with full metadata)
│   │   ├── eligibilityRoutes.js (Dynamic questions + live scoring)
│   │   ├── guideRoutes.js (Step-by-step guides with illustrations)
│   │   ├── applicationRoutes.js (CRUD applications, status management, timeline updates)
│   │   ├── faqRoutes.js (Categorized FAQs)
│   │   └── statsRoutes.js (User stats & recent activities)
│   └── database/
│       ├── schema.sql (Complete MySQL table schema)
│       └── seed.sql (Comprehensive dataset for all 12 documents)
│
└── frontend/
    ├── index.html (Inter & Poppins typography, meta tags)
    ├── src/
    │   ├── App.jsx (Root layout, routing, toast notifications, auth provider)
    │   ├── index.css (Theme tokens, glassmorphism, responsive utilities, button styles)
    │   ├── context/
    │   │   ├── AuthContext.jsx (Authentication state & user profile)
    │   │   └── ToastContext.jsx (Toast notifications)
    │   ├── components/
    │   │   ├── Navigation/ (Desktop Sidebar + Mobile Bottom Nav + Header)
    │   │   ├── Common/ (Button, Card, Modal, Badge, Toast, Tooltip, Breadcrumb, Tabs, SearchBar, Skeleton)
    │   │   └── Timeline/ (Vertical colored timeline with Green/Orange/Gray indicators)
    │   └── pages/
    │       ├── Dashboard/ (Welcome banner, Stats, Quick Actions, Popular Services, Activities, Notifications)
    │       ├── ExploreDocuments/ (Search, Category filters, Document cards, Details modal)
    │       ├── EligibilityCheck/ (Dynamic wizard per document, live scoring, checklist, save action)
    │       ├── ApplicationGuide/ (Interactive steps, fee/time badges, checklist, official apply links)
    │       ├── ApplyStatus/ (Cards with status badges, detailed view modal, timeline, notes editor, official tracker)
    │       ├── SavedApplications/ (Search, filter by doc/status, sort, edit, delete modal, export)
    │       ├── FAQ/ (Searchable categorized accordion FAQs with feedback)
    │       └── Profile/ (User details, State selector, activity history, preferences, auth modal)
```

## Database Schema Design (MySQL)

1. **`users`**: `id`, `name`, `email`, `password`, `state`, `avatar`, `created_at`
2. **`documents`**: `id`, `name`, `slug`, `category`, `description`, `processing_time`, `fee`, `official_link`, `icon`, `issuing_authority`
3. **`eligibility_questions`**: `id`, `document_id`, `question`, `input_type`, `options_json`, `required_value`, `weight`
4. **`application_guides`**: `id`, `document_id`, `step_number`, `step_title`, `step_description`, `icon_name`, `tips`
5. **`saved_applications`**: `id`, `user_id`, `document_id`, `application_id`, `applied_date`, `state`, `status` (`Draft`, `Submitted`, `Received`, `In Review`, `Approved`, `Rejected`, `Completed`), `last_updated`, `notes`, `tracking_number`
6. **`faq`**: `id`, `document_id`, `category`, `question`, `answer`
7. **`activity_logs`**: `id`, `user_id`, `action_type`, `title`, `description`, `created_at`
8. **`notifications`**: `id`, `user_id`, `title`, `message`, `is_read`, `created_at`

## Supported Documents (Full Comprehensive Data)
1. Aadhaar Card (Unique Identification Authority of India - UIDAI)
2. PAN Card (Income Tax Department / NSDL / UTIITSL)
3. Voter ID (Election Commission of India - ECI / NVSP)
4. Passport (Ministry of External Affairs - MEA / Passport Seva)
5. Driving Licence (Ministry of Road Transport & Highways - MoRTH / Parivahan)
6. Birth Certificate (Municipal Corporation / Civil Registration System - CRS)
7. Income Certificate (State Revenue Department / e-District)
8. Community / Caste Certificate (Tehsildar / Revenue Department)
9. Domicile / Residence Certificate (Revenue Department / e-District)
10. Ration Card (Department of Food & Civil Supplies)
11. Marriage Certificate (Registrar of Marriages / Revenue Department)
12. Death Certificate (Civil Registration System / Municipal Corporation)

## Verification Plan

### Automated / Build Verification
- Verify server starts and responds to health and API endpoints:
  - `GET /api/documents`
  - `GET /api/documents/:id/eligibility`
  - `POST /api/eligibility/evaluate`
  - `GET /api/applications`
  - `POST /api/applications`
  - `PUT /api/applications/:id`
  - `DELETE /api/applications/:id`
- Verify frontend builds cleanly with Vite (`npm run build`).

### Browser Verification
- Using `browser_subagent`:
  - Open application homepage on desktop layout (check sidebar, statistics, quick actions, popular services).
  - Open on mobile viewport (check bottom navigation, responsive drawer).
  - Navigate to **Explore Documents**, filter by category, search for a document.
  - Navigate to **Eligibility Check**, complete dynamic questions for Passport/PAN, verify score calculation and document checklist.
  - Open **Application Guide**, check numbered steps and official apply link.
  - Test **Apply Status** & **Saved Applications**, add a new application, open detailed progress timeline modal, update status stage, and verify green/orange/gray timeline indicators.
  - Test **FAQ** search and expandable accordion.
  - Test **Profile** page with state preferences and activity log.
