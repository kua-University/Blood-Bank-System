# Software Requirements Specification (SRS): Integrated Blood Bank Donation and Request System

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) details the functional and non-functional requirements for the Integrated Blood Bank Donation and Request System. The purpose of this document is to provide a comprehensive understanding of the system to all stakeholders, including developers, testers, and end-users, ensuring that the developed software meets their needs and expectations.

### 1.2 Scope
The system will provide a full-stack web application to manage blood donations, inventory, and requests. It will cater to three primary user roles: Administrator, Hospital, and Donor. The scope includes user authentication, donor registration, hospital registration, blood inventory management, donation tracking, emergency request processing, and basic analytics.

### 1.3 Definitions, Acronyms, and Abbreviations
-   **API**: Application Programming Interface
-   **CI/CD**: Continuous Integration/Continuous Deployment
-   **DB**: Database
-   **ERD**: Entity-Relationship Diagram
-   **FE**: Frontend
-   **BE**: Backend
-   **JWT**: JSON Web Token
-   **NFR**: Non-Functional Requirement
-   **SPA**: Single Page Application
-   **SRS**: Software Requirements Specification
-   **UI/UX**: User Interface/User Experience

### 1.4 References
-   Project Brief: `pasted_content.txt`
-   [React.js Documentation](https://react.dev/)
-   [Node.js Documentation](https://nodejs.org/en/docs/)
-   [Express.js Documentation](https://expressjs.com/)
-   [PostgreSQL Documentation](https://www.postgresql.org/docs/)
-   [Tailwind CSS Documentation](https://tailwindcss.com/docs/)

## 2. Overall Description

### 2.1 Product Perspective
The Integrated Blood Bank Donation and Request System is a standalone web application designed to centralize and optimize blood bank operations. It will integrate with external deployment platforms (Vercel, Render, Neon) but will not directly integrate with other existing blood bank systems or hospital management systems in its initial release.

### 2.2 Product Functions
The system will provide the following major functions:
-   User Management (Registration, Login, Profile Management)
-   Role-Based Access Control (Admin, Hospital, Donor)
-   Blood Inventory Tracking
-   Blood Donation Management
-   Emergency Blood Request Management
-   Notification System
-   Dashboard and Basic Analytics

### 2.3 User Characteristics
-   **Administrator**: Technical proficiency required. Manages users, inventory, and oversees all system operations. Needs access to all features.
-   **Hospital User**: Moderate technical proficiency. Manages hospital profile, creates blood requests, views request status. Needs secure access to request and inventory features.
-   **Donor User**: Low technical proficiency. Registers, views donation history, updates profile. Needs an intuitive interface for personal data management.

### 2.4 General Constraints
-   **Technology Stack**: Must use React.js for frontend, Node.js/Express.js for backend, and PostgreSQL for the database.
-   **Security**: Must implement JWT for authentication and bcrypt for password hashing.
-   **Deployment**: Must be deployable on Vercel (frontend), Render (backend), and Neon (database).
-   **Containerization**: Must use Docker for containerization.
-   **CI/CD**: Must implement GitHub Actions for CI/CD.

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Management
-   **FR1.1**: The system SHALL allow users to register with their name, email, and password.
-   **FR1.2**: The system SHALL assign a default role of 'donor' to new registrations, unless specified by an admin.
-   **FR1.3**: The system SHALL allow users to log in using their email and password.
-   **FR1.4**: The system SHALL issue a JWT upon successful login.
-   **FR1.5**: The system SHALL allow authenticated users to view and update their profile information.
-   **FR1.6**: The system SHALL allow administrators to manage (create, view, update, delete) all user accounts and roles.

#### 3.1.2 Role-Based Access Control
-   **FR2.1**: The system SHALL restrict access to certain API endpoints based on user roles (Admin, Hospital, Donor).
    -   Admin: Full access to all features.
    -   Hospital: Can create/view requests, view inventory.
    -   Donor: Can view/update own profile, view donation history.

#### 3.1.3 Blood Inventory Management
-   **FR3.1**: The system SHALL display the current quantity of each blood type in the inventory.
-   **FR3.2**: The system SHALL allow administrators to add or subtract units from any blood type in the inventory.
-   **FR3.3**: The system SHALL update the `last_updated` timestamp for inventory changes.

#### 3.1.4 Blood Donation Management
-   **FR4.1**: The system SHALL allow donors to record their donation details (blood type, units, date).
-   **FR4.2**: The system SHALL allow administrators to approve or reject pending donation records.
-   **FR4.3**: The system SHALL update the blood inventory upon approval of a donation.

#### 3.1.5 Emergency Blood Request Management
-   **FR5.1**: The system SHALL allow hospital users to create new blood requests, specifying blood type, quantity, reason, and urgency.
-   **FR5.2**: The system SHALL allow administrators to view all pending blood requests.
-   **FR5.3**: The system SHALL allow administrators to update the status of a blood request (e.g., `pending`, `approved`, `in-transit`, `completed`, `rejected`).
-   **FR5.4**: The system SHALL notify the requesting hospital when the status of their request changes.

#### 3.1.6 Notification System
-   **FR6.1**: The system SHALL generate notifications for relevant events (e.g., request status change, low blood stock).
-   **FR6.2**: The system SHALL allow users to view their notifications.
-   **FR6.3**: The system SHALL mark notifications as read.

#### 3.1.7 Dashboard and Analytics
-   **FR7.1**: The system SHALL provide a dashboard displaying key metrics (e.g., total units, pending requests, donation trends).
-   **FR7.2**: The system SHALL present blood inventory breakdown by type using charts.

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance
-   **NFR1.1**: The system SHALL respond to user requests within 2 seconds under normal load (up to 100 concurrent users).
-   **NFR1.2**: Database queries SHALL execute within 500ms for common operations.

#### 3.2.2 Security
-   **NFR2.1**: All user passwords SHALL be hashed using bcrypt before storage.
-   **NFR2.2**: User authentication SHALL be implemented using JWT with a secure secret and expiration.
-   **NFR2.3**: The system SHALL protect against common web vulnerabilities (e.g., XSS, CSRF, SQL Injection) through input validation and secure coding practices.
-   **NFR2.4**: All communication between frontend and backend SHALL be secured using HTTPS in production.
-   **NFR2.5**: Role-based access control SHALL be strictly enforced on all API endpoints.

#### 3.2.3 Reliability
-   **NFR3.1**: The system SHALL maintain 99.9% uptime in production.
-   **NFR3.2**: Data SHALL be backed up daily with a recovery point objective (RPO) of 24 hours and a recovery time objective (RTO) of 4 hours.

#### 3.2.4 Usability
-   **NFR4.1**: The user interface SHALL be intuitive and easy to navigate for all user roles.
-   **NFR4.2**: The system SHALL provide clear feedback to users on their actions and system status.
-   **NFR4.3**: The application SHALL be fully responsive and accessible on desktop, tablet, and mobile devices.

#### 3.2.5 Maintainability
-   **NFR5.1**: The codebase SHALL adhere to established coding standards and best practices for React.js and Node.js.
-   **NFR5.2**: The system SHALL be modular, allowing for independent development and deployment of frontend and backend components.
-   **NFR5.3**: Comprehensive documentation (API, architecture, deployment) SHALL be provided.

#### 3.2.6 Scalability
-   **NFR6.1**: The backend API SHALL be capable of horizontal scaling to handle increased load.
-   **NFR6.2**: The database (PostgreSQL) SHALL be configured to support read replicas and potential sharding for future growth.

#### 3.2.7 Portability
-   **NFR7.1**: The application SHALL be containerized using Docker, ensuring consistent behavior across different environments.

## 4. User Interface Requirements

### 4.1 General UI/UX Principles
-   **Modern Aesthetic**: Premium SaaS dashboard design with clean layouts.
-   **Visual Effects**: Glassmorphism effects, smooth animations (Framer Motion).
-   **Interactivity**: Interactive tables, charts, and toast notifications.
-   **Theming**: Dark mode support.
-   **Branding**: Professional hospital management look and feel.

### 4.2 Page-Specific UI Requirements
-   **Landing Page**: Engaging, informative, clear calls to action for login/register.
-   **Login/Register Pages**: Clean, secure forms with validation and clear navigation.
-   **Donor Dashboard**: Overview of donation history, upcoming donation opportunities.
-   **Hospital Dashboard**: Overview of requests, inventory status, quick actions.
-   **Admin Dashboard**: Comprehensive overview of system health, user activity, critical alerts.
-   **Blood Inventory Page**: Interactive table for viewing and managing blood stock, filtering, search.
-   **Donation Requests Page**: List of donation requests, status updates, approval/rejection actions.
-   **Emergency Requests Page**: List of emergency requests, urgency indicators, status updates.
-   **Analytics Page**: Detailed charts and graphs for donation trends, inventory usage.
-   **Profile Page**: User-specific details, editable fields.
-   **Settings Page**: Configuration options for users and administrators.
-   **404/Error Pages**: User-friendly error messages with navigation options.

## 5. Data Model Requirements

-   **Database**: PostgreSQL.
-   **Schema**: Defined in `database/schema.sql` including tables for `users`, `donors`, `hospitals`, `blood_inventory`, `donations`, `emergency_requests`, `notifications`, `activity_logs`.
-   **Relationships**: Clearly defined foreign key relationships between tables.
-   **Indexes**: Appropriate indexes on frequently queried columns (e.g., `users.email`, `blood_inventory.blood_type`).
-   **Data Integrity**: Constraints (NOT NULL, UNIQUE, CHECK) to ensure data validity.

## 6. Testing Requirements

-   **Unit Tests**: Backend (Node.js/Express.js) and Frontend (React.js) components shall have unit tests covering critical logic.
-   **Integration Tests**: Backend API endpoints shall have integration tests to ensure proper interaction with the database and other services.
-   **API Testing**: Manual and automated API testing using tools like Postman/Insomnia or Supertest.
-   **End-to-End Tests**: (Optional for initial release, but recommended) High-level tests simulating user flows.
-   **UI Tests**: (Optional for initial release) Tests for critical UI components and interactions.

## 7. Deployment Requirements

-   **Frontend**: Vercel-ready configuration.
-   **Backend**: Render-ready configuration.
-   **Database**: Neon PostgreSQL integration.
-   **HTTPS**: Automatic HTTPS configuration for deployed applications.
-   **Environment Variables**: Secure management of environment variables for production.
-   **Auto Deployment**: CI/CD pipeline for automatic deployment on code changes to main branch.

This SRS will serve as the foundational document for the development of the Integrated Blood Bank Donation and Request System, guiding the implementation and verification processes.
