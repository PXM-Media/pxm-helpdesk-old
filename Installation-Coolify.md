# How to Deploy PXM-Helpdesk on Coolify

This guide explains how to deploy the PXM-Helpdesk application (NestJS API + Next.js Frontend + Database stack) using [Coolify](https://coolify.io).

## Prerequisites

1.  A **Coolify** instance installed and running.
2.  This project pushed to a Git repository (GitHub, GitLab, etc.) that Coolify can access.

## Step 1: Prepare the Project

Ensure your repository has the correct structure:
- `docker-compose.yml` at the root.
- `apps/api` with its `Dockerfile`.
- `apps/web` with its `Dockerfile`.

**Note:** Ensure your `docker-compose.yml` is production-ready. For Coolify, you typically want to:
- Remove direct port bindings for services that don't need public access (like MariaDB or Redis), or ensure firewalls are set.
- Ensure the `web` and `api` services are exposed so Coolify can route traffic to them (Coolify automatically detects exposed ports or you configure them in the UI).

## Step 2: Create a New Project in Coolify

1.  Log in to your Coolify dashboard.
2.  Click **"+ New Resource"**.
3.  Select **"Project"** or use an existing one.
4.  Select the **Environment** (e.g., "Production").

## Step 3: Select Source

1.  Click **"+ New Resource"** inside the environment.
2.  Select **"Git Repository"** (Public or Private).
3.  Choose the repository containing this PXM-Helpdesk code.
    - *If private, you'll need to configure a GitHub App or Deploy Key in Coolify first.*

## Step 4: Configure the Build Pack

1.  Coolify will ask for the **Build Pack**. Select **"Docker Compose"**.
2.  It should automatically detect the `docker-compose.yml` in the root.
3.  Click **"Continue"**.

## Step 5: Service Configuration

Coolify will parse your `docker-compose.yml` and list the services (api, web, mysql, redis, etc.).

### 1. Networking & Domains
For each service that needs to be publicly accessible (usually `web` and `api`):
- Go to the service settings in Coolify.
- **Domains**: Set the public domain (e.g., `https://helpdesk.yourdomain.com` for the web, `https://api.helpdesk.yourdomain.com` for the api).
- **Port**: Ensure the internal port matches what the app listens on (Web: 3000, API: 3001).

### 2. Environment Variables
You need to add the environment variables defined in your `.env` files into Coolify's **"Environment Variables"** tab for the respective services (or shared across the stack).

**Required Variables:**

**API Service:**
```
DB_HOST=mysql
DB_PORT=3306
DB_USER=helpdesk
DB_PASSWORD=your_secure_password
DB_NAME=helpdesk
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_long_random_secret
MAIL_HOST=mailpit (or real SMTP host)
MAIL_PORT=1025 (or real SMTP port)
```

**Web Service:**
```
NEXT_PUBLIC_API_URL=https://api.helpdesk.yourdomain.com (The public URL of your API)
```

**Database (MariaDB):**
```
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=helpdesk
MYSQL_USER=helpdesk
MYSQL_PASSWORD=your_secure_password
```

## Step 6: Deploy

1.  Click **"Deploy"** in the top right corner.
2.  Coolify will pull the code, build the Docker images for `api` and `web`, pull the standard images for `mariadb`, `redis`, etc., and start the stack.
3.  Check the **"Logs"** tab to verify the build process.

## Step 7: Post-Deployment Verification

1.  Visit your Web URL (`https://helpdesk.yourdomain.com`).
2.  Visit your API URL (`https://api.helpdesk.yourdomain.com/health` or `/api`).
3.  Enjoy your self-hosted Helpdesk!
