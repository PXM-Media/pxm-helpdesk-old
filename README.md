> [!CAUTION]
> **PROJECT DISCONTINUED**
>
> This project has been permanently discontinued and is no longer maintained due to excessive technical debt and persistent stability issues.

# PXM-Helpdesk Project Documentation

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18+)
- **Docker** & **Docker Compose**
- **npm**

## Setup Instructions

1.  **Install Dependencies**
    Run the following commands in order:
    ```bash
    # Root
    npm install

    # API
    cd apps/api
    npm install

    # Web Client
    cd ../web
    npm install
    cd ../..
    ```

2.  **Start Infrastructure Services**
    Start the database, redis, search engine, and mail server:
    ```bash
    docker-compose up -d
    ```
    *Note: Ensure ports 3306 (MySQL), 6379 (Redis), 9000/9001 (MinIO), 7700 (Meilisearch), and 8025/1025 (Mailpit) are free.*

3.  **Run Development Servers**
    Open two terminal windows:

    **Terminal 1 (Backend API):**
    ```bash
    cd apps/api
    npm run start:dev
    ```
    The API will run at `http://localhost:3001`.

    **Terminal 2 (Frontend Web):**
    ```bash
    cd apps/web
    npm run dev
    ```
    The Web App will run at `http://localhost:3000`.

## Architecture Overview
- **Apps/API**: NestJS backend. Handles detailed business logic, database connections, email processing, and automations.
- **Apps/Web**: Next.js (App Router) frontend. Provides the User Portal and Agent/Admin Dashboard.
- **Database**: MariaDB (MySQL compatible).
- **Email**: Uses `nodemailer` (SMTP) and `imap-simple` (IMAP). In dev, Mailpit intercepts outgoing emails at `http://localhost:8025`.

## Key Features Implemented
- **Authentication**: JWT-based login/register.
- **Ticketing**: CRUD, Comments, Status/Priority workflow.
- **Forms**: Admin Form Builder & Public Form Renderer.
- **Email**: Ingestion (mocked) & Sending.
- **Automations**: Trigger-based rules engine.
- **Knowledge Base**: Articles & Categories.
- **Reporting**: Basic aggregation metrics.

## Next Steps
- Implement Frontend pages for KB, Automations, and Reporting.
- Configure real SMTP/IMAP credentials in `.env`.
- Deploy to a production server (e.g. Ubuntu + Docker).
