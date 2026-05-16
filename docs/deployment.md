# Deployment Guide: Integrated Blood Bank Donation and Request System

This document provides detailed instructions for deploying the Integrated Blood Bank Donation and Request System to production environments. The application leverages Vercel for frontend deployment, Render for backend deployment, and Neon for PostgreSQL database hosting.

## 1. Prerequisites
Before proceeding with deployment, ensure you have:
- A GitHub account with access to the project repository.
- Accounts with [Vercel](https://vercel.com/), [Render](https://render.com/), and [Neon](https://neon.tech/).
- Necessary environment variables configured for both frontend and backend services.

## 2. Deployment Workflow Overview
Deployment is automated using GitHub Actions, which trigger builds, tests, and deployments upon pushes to the `main` branch. The general flow is as follows:

1.  Code is pushed to the `main` branch on GitHub.
2.  GitHub Actions workflow (`.github/workflows/main.yml`) is triggered.
3.  The workflow builds and tests both frontend and backend.
4.  Upon successful tests, the frontend is deployed to Vercel.
5.  The backend is deployed to Render.
6.  The database (Neon PostgreSQL) is managed separately but integrated via connection strings.

## 3. Frontend Deployment (Vercel)

The frontend is a React Single Page Application (SPA) deployed on Vercel for optimal performance and developer experience.

### Steps:
1.  **Connect GitHub Repository**: Log in to your Vercel account and import your GitHub repository. Vercel will automatically detect the React project.
2.  **Configure Project Settings**: 
    -   **Framework Preset**: React
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist` (Vite's default output directory)
3.  **Environment Variables**: Add any necessary environment variables that your frontend might need (e.g., `VITE_API_BASE_URL` pointing to your deployed backend API URL). These should be prefixed with `VITE_` for Vite to expose them to the client-side code.
4.  **Automatic Deployments**: Once configured, Vercel will automatically deploy new versions of your frontend application on every push to the `main` branch (or any branch you configure for production deployments).

## 4. Backend Deployment (Render)

The Node.js/Express.js backend API is deployed on Render, providing continuous deployment and managed infrastructure.

### Steps:
1.  **Connect GitHub Repository**: Log in to your Render account and create a new Web Service. Connect it to your GitHub repository.
2.  **Configure Web Service**: 
    -   **Runtime**: Node.js
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start` (ensure your `package.json` script for `start` is correctly defined, e.g., `node src/server.js`)
    -   **Root Directory**: Specify `backend/` if your backend code is in a subdirectory.
3.  **Environment Variables**: Crucially, add all environment variables required by your backend (as defined in `backend/.env.example`). This includes:
    -   `PORT`: (e.g., `5000`, Render will expose this internally)
    -   `NODE_ENV`: `production`
    -   `DATABASE_URL`: The connection string obtained from your Neon PostgreSQL database.
    -   `JWT_SECRET`: A strong, unique secret key.
    -   `JWT_EXPIRE`: Token expiration time.
4.  **Automatic Deployments**: Render will automatically build and deploy your backend service whenever changes are pushed to the connected GitHub branch.

## 5. Database Deployment (Neon PostgreSQL)

Neon provides a serverless PostgreSQL database that is highly scalable and reliable, ideal for production environments.

### Steps:
1.  **Create a Neon Project**: Sign up or log in to Neon. Create a new project and a new database within that project.
2.  **Obtain Connection String**: From your Neon project dashboard, retrieve the connection string for your database. This string will be used as the `DATABASE_URL` environment variable for your backend service on Render.
3.  **Initialize Database Schema**: 
    -   You can connect to your Neon database using a PostgreSQL client (like `psql`, DBeaver, or pgAdmin).
    -   Execute the `database/schema.sql` file to create all necessary tables, indexes, and constraints.
    -   Optionally, execute the `database/seed.sql` file to populate your database with initial data (e.g., admin user, initial blood types).
    -   For a more automated approach, consider integrating database migrations into your CI/CD pipeline or using a migration tool within your backend application.

## 6. HTTPS Configuration

Both Vercel and Render automatically provide HTTPS for your deployed applications. For custom domains, you will need to configure DNS records (CNAME or A records) in your domain registrar and link them within Vercel and Render settings.

## 7. Monitoring and Logging

- **Backend**: The backend uses Winston for logging. In a production environment, configure Winston to output logs to a centralized logging service (e.g., Loggly, Datadog, or cloud-native logging solutions) for easier monitoring and debugging.
- **Platform-level Monitoring**: Vercel and Render provide built-in dashboards for monitoring application health, performance, and logs.

By following these steps, your Integrated Blood Bank Donation and Request System will be successfully deployed and running in a production-ready environment.
