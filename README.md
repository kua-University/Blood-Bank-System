[README.md](https://github.com/user-attachments/files/27852033/README.md)
# Integrated Blood Bank Donation and Request System

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Setup Guide](#setup-guide)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Examples](#api-examples)
- [Deployment Instructions](#deployment-instructions)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This project is a complete, production-ready full-stack web application for an **Integrated Blood Bank Donation and Request System**. It is designed to be modern, scalable, secure, and enterprise-level, facilitating seamless management of blood donations, inventory, and emergency requests between donors, hospitals, and administrators.

## Features
- **User Authentication & Authorization**: Secure login/registration with role-based access control (Admin, Donor, Hospital).
- **Donor Management**: Track donor information, blood types, and donation history.
- **Hospital Management**: Manage hospital profiles and their blood requests.
- **Blood Inventory Tracking**: Real-time monitoring of blood stock levels by type.
- **Donation Management**: Process and track blood donation events.
- **Emergency Request System**: Handle urgent and emergency blood requests from hospitals.
- **Notification System**: Keep users informed about request statuses and critical updates.
- **Modern UI/UX**: Intuitive and responsive interface with a premium SaaS dashboard design, glassmorphism effects, and smooth animations.
- **RESTful APIs**: Well-documented and secure APIs for all functionalities.
- **DevOps & CI/CD**: Automated build, test, and deployment pipelines using Docker and GitHub Actions.

## Tech Stack

| Category        | Technology                                     | Description                                                               |
| :-------------- | :--------------------------------------------- | :------------------------------------------------------------------------ |
| **Frontend**    | React.js, Tailwind CSS, React Router, Axios, Framer Motion | Modern SPA framework, utility-first CSS, routing, HTTP client, animation library. |
| **Backend**     | Node.js, Express.js, JWT, bcrypt, express-validator | JavaScript runtime, web framework, authentication, password hashing, input validation. |
| **Database**    | PostgreSQL (Neon)                              | Robust, open-source relational database with cloud-native capabilities.   |
| **DevOps**      | Docker, Docker Compose, Nginx, GitHub Actions  | Containerization, multi-container orchestration, reverse proxy, CI/CD.    |
| **Deployment**  | Vercel (Frontend), Render (Backend), Neon (Database) | Cloud platforms for scalable and automated deployments.                   |

## Architecture Overview

The application follows a microservices-oriented architecture, separating concerns into distinct frontend, backend, and database layers, orchestrated by Docker.

- **Frontend**: A React Single Page Application (SPA) provides a rich, interactive user experience. It communicates with the backend via RESTful APIs.
- **Backend**: A Node.js/Express.js API serves as the central hub, handling business logic, data validation, authentication, and communication with the database.
- **Database**: PostgreSQL is used for persistent data storage, ensuring data integrity and reliability.
- **DevOps**: Docker containers encapsulate each service, ensuring consistency across environments. Docker Compose orchestrates these containers for local development. GitHub Actions automate testing and deployment processes.
- **Nginx**: Acts as a reverse proxy for the frontend, serving static files and forwarding API requests to the backend service.

```mermaid
graph TD
    A[Client Browser] -->|HTTP/HTTPS| B(Nginx Reverse Proxy)
    B -->|Static Files| C(Frontend Service - React.js)
    B -->|API Requests| D(Backend Service - Node.js/Express.js)
    D -->|SQL Queries| E(PostgreSQL Database)
    F[GitHub] -->|Push/PR| G(GitHub Actions CI/CD)
    G -->|Build & Test| C
    G -->|Build & Test| D
    G -->|Deploy Frontend| H(Vercel)
    G -->|Deploy Backend| I(Render)
    G -->|Manage Database| J(Neon PostgreSQL)
```

## Folder Structure

```
project-root/
│
├── backend/
│   ├── src/
│   │   ├── config/             # Database and other configurations
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Database interaction logic (if using ORM)
│   │   ├── routes/             # API routes definitions
│   │   ├── middleware/         # Express middleware (auth, error handling)
│   │   ├── services/           # Business logic services
│   │   ├── validators/         # Input validation schemas
│   │   ├── utils/              # Utility functions (logger, etc.)
│   │   ├── tests/              # Backend unit/integration tests
│   │   ├── app.js              # Express application setup
│   │   └── server.js           # Server entry point
│   │
│   ├── uploads/                # File uploads (e.g., user profiles)
│   ├── logs/                   # Application logs
│   ├── package.json            # Backend dependencies and scripts
│   ├── .env.example            # Example environment variables
│   └── README.md               # Backend specific README
│
├── frontend/
│   ├── public/                 # Static assets
│   │
│   ├── src/
│   │   ├── assets/             # Images, icons, fonts
│   │   ├── animations/         # Framer Motion animations
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page-level React components
│   │   ├── layouts/            # Layout components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # Frontend API interaction services
│   │   ├── context/            # React Context API for state management
│   │   ├── routes/             # Frontend routing definitions
│   │   ├── styles/             # Tailwind CSS configurations, global styles
│   │   ├── utils/              # Frontend utility functions
│   │   ├── constants/          # Global constants
│   │   ├── tests/              # Frontend unit/integration tests
│   │   ├── App.jsx             # Main React application component
│   │   └── main.jsx            # React entry point
│   │
│   ├── package.json            # Frontend dependencies and scripts
│   └── README.md               # Frontend specific README
│
├── database/
│   ├── schema.sql              # Database schema definition
│   ├── seed.sql                # Initial seed data
│   ├── migrations/             # Database migration scripts
│   └── backups/                # Database backup files
│
├── devops/
│   ├── docker/                 # Docker-related files (e.g., Dockerfiles for other services)
│   ├── nginx/                  # Nginx configuration files
│   ├── scripts/                # Deployment or utility scripts
│   ├── monitoring/             # Monitoring configurations
│   └── README.md               # DevOps specific README
│
├── docs/                       # Project documentation
│   ├── SRS.md                  # Software Requirements Specification
│   ├── API.md                  # API Documentation
│   ├── architecture.md         # Detailed Architecture Document
│   ├── deployment.md           # Detailed Deployment Guide
│   └── database.md             # Detailed Database Design
│
├── tests/                      # Overall project tests (e.g., end-to-end)
│
├── .github/
│   └── workflows/              # GitHub Actions CI/CD workflows
│
├── docker-compose.yml          # Docker Compose configuration for local development
├── README.md                   # Main project README
├── package.json                # Root package.json (for workspace or global scripts)
└── .gitignore                  # Git ignore file
```

## Setup Guide

### Prerequisites
Before you begin, ensure you have the following installed:
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/en/download/) (LTS version, e.g., 18.x)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Engine and Docker Compose)

### Environment Variables
Create a `.env` file in the `backend/` directory based on `backend/.env.example` and fill in the necessary values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/bloodbank
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

- `PORT`: Port for the backend server.
- `NODE_ENV`: Node.js environment (e.g., `development`, `production`).
- `DATABASE_URL`: Connection string for your PostgreSQL database. For local Docker setup, this will be `postgresql://postgres:password@db:5432/bloodbank`.
- `JWT_SECRET`: A strong, secret key for JWT token signing. Generate a complex one.
- `JWT_EXPIRE`: Expiration time for JWT tokens (e.g., `30d`, `1h`).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/blood-bank-system.git
    cd blood-bank-system
    ```

2.  **Build and run with Docker Compose:**
    This will build the Docker images, create the containers, set up the database, and seed initial data.
    ```bash
    docker-compose up --build -d
    ```
    The `-d` flag runs the containers in detached mode.

3.  **Verify services are running:**
    ```bash
    docker-compose ps
    ```
    You should see `bloodbank_db`, `bloodbank_backend`, and `bloodbank_frontend` in a healthy state.

### Running the Application

Once Docker Compose is up, the application will be accessible:
- **Frontend**: `http://localhost:80`
- **Backend API**: `http://localhost:5000/api/v1` (or via Nginx proxy at `http://localhost/api/v1`)

**Default Admin Credentials (for local setup):**
- **Email**: `admin@bloodbank.com`
- **Password**: `password123`

## API Examples

### Authentication

**Register User**
`POST /api/v1/auth/register`
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "role": "donor" 
}
```

**Login User**
`POST /api/v1/auth/login`
```json
{
  "email": "admin@bloodbank.com",
  "password": "password123"
}
```

**Get Current User**
`GET /api/v1/auth/me`
(Requires `Authorization: Bearer <token>` header)

### Blood Inventory

**Get All Inventory**
`GET /api/v1/inventory`

**Update Inventory (Admin Only)**
`PUT /api/v1/inventory`
(Requires `Authorization: Bearer <admin_token>` header)
```json
{
  "blood_type": "O+",
  "quantity": 10,
  "action": "add" 
}
```

### Emergency Requests

**Create New Request (Hospital/Admin Only)**
`POST /api/v1/requests`
(Requires `Authorization: Bearer <hospital_token>` header)
```json
{
  "blood_type": "O-",
  "quantity": 3,
  "reason": "Urgent surgery for accident victim",
  "hospital_id": 1, 
  "urgency": "emergency"
}
```

**Get All Requests**
`GET /api/v1/requests`
(Requires `Authorization: Bearer <token>` header)

**Update Request Status (Admin Only)**
`PATCH /api/v1/requests/:id`
(Requires `Authorization: Bearer <admin_token>` header)
```json
{
  "status": "approved"
}
```

## Deployment Instructions

### Frontend (Vercel)
1.  **Connect GitHub Repository**: Link your project repository to Vercel.
2.  **Configure Build Settings**: Vercel will automatically detect the React project. Ensure the build command is `npm run build` and the output directory is `dist`.
3.  **Environment Variables**: Add any necessary environment variables for the frontend (e.g., `VITE_API_BASE_URL`).
4.  **Deploy**: Vercel will automatically deploy on every push to the main branch.

### Backend (Render)
1.  **Connect GitHub Repository**: Link your project repository to Render.
2.  **Create a Web Service**: Choose Node.js as the runtime.
3.  **Build Command**: `npm install`
4.  **Start Command**: `npm start`
5.  **Environment Variables**: Add all backend environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`). Ensure `DATABASE_URL` points to your Neon PostgreSQL instance.
6.  **Deploy**: Render will automatically deploy on every push to the main branch.

### Database (Neon PostgreSQL)
1.  **Create a Neon Project**: Sign up for Neon and create a new project.
2.  **Get Connection String**: Obtain the connection string for your database. This will be used as `DATABASE_URL` in your backend environment variables.
3.  **Initialize Schema**: You can manually run the `database/schema.sql` and `database/seed.sql` scripts using a PostgreSQL client or integrate migrations into your CI/CD pipeline.

## Screenshots

*(Screenshots will be added here once the application is running.)*

## Testing

- **Backend Tests**: Unit and integration tests for API endpoints, services, and middleware.
- **Frontend Tests**: Unit tests for React components and integration tests for user flows.
- **API Testing**: Use tools like Postman or Insomnia to test API endpoints manually.

## Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Blood-Bank-System
