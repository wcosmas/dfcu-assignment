# DFCU Bank Payment Gateway

A secure, reliable payment processing system built with Node.js, Express, Next.js, and PostgreSQL.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Application Screenshots](#application-screenshots)
- [Testing](#testing)
- [License](#license)
- [Docker Deployment](#docker-deployment)
  - [Prerequisites](#prerequisites-1)
  - [Production Deployment Guide](#production-deployment-guide)
  - [Production Best Practices](#production-best-practices)
  - [Troubleshooting](#troubleshooting)
  - [Deployment with Reverse Proxy](#deployment-with-reverse-proxy)

## Project Overview

This application is a comprehensive payment gateway solution for DFCU Bank, facilitating secure financial transactions. The system comprises two main components:

- **Backend**: A robust API server handling authentication, payment processing, and transaction management
- **Frontend**: A modern, responsive web application providing an intuitive interface for users to initiate and track payments

## Features

### Core Features

- Secure user authentication with JWT tokens and refresh token rotation
- Payment transaction processing with status simulation
- Transaction history tracking and monitoring
- Role-based access control (User/Admin)
- Responsive design for all device sizes

### Backend Features

- RESTful API architecture
- Swagger/OpenAPI documentation
- Comprehensive error handling and logging
- Database management with Prisma ORM
- Security measures (rate limiting, CORS, helmet)

### Frontend Features

- Modern UI built with Next.js and TailwindCSS
- Real-time data fetching with React Query
- Form validation with Zod and React Hook Form
- Responsive design for mobile and desktop
- Client-side authentication state management

## Project Structure

```
DFCU Assignment/
├── backend/                      # Backend application
│   ├── prisma/                   # Database schema and migrations
│   ├── src/                      # Source code
│   │   ├── config/               # Application configuration
│   │   ├── controllers/          # Request handlers
│   │   ├── docs/                 # API documentation
│   │   ├── dtos/                 # Data transfer objects
│   │   ├── interfaces/           # TypeScript interfaces
│   │   ├── middlewares/          # Express middlewares
│   │   ├── routes/               # API routes
│   │   ├── schemas/              # Validation schemas
│   │   └── utils/                # Utility functions
│   └── tests/                    # Test suites
│       ├── e2e/                  # End-to-end tests
│       ├── integration/          # Integration tests
│       └── unit/                 # Unit tests
│
├── frontend/                     # Frontend application
│   ├── public/                   # Static assets
│   └── src/                      # Source code
│       ├── api/                  # API client and services
│       ├── app/                  # Next.js pages
│       │   ├── auth/             # Authentication pages
│       │   ├── dashboard/        # Dashboard page
│       │   ├── payment/          # Payment pages
│       │   ├── profile/          # User profile page
│       │   └── transactions/     # Transaction history page
│       ├── components/           # React components
│       │   ├── auth/             # Authentication components
│       │   ├── layout/           # Layout components
│       │   ├── payment/          # Payment components
│       │   └── ui/               # UI components
│       ├── hooks/                # Custom React hooks
│       ├── lib/                  # Utility libraries
│       ├── types/                # TypeScript type definitions
│       └── utils/                # Utility functions
│
└── README.md                     # Project documentation
```

## Technology Stack

### Backend

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript 5.0+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Authentication**: JWT with refresh token rotation
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest with Supertest

### Frontend

- **Framework**: Next.js 15+
- **Language**: TypeScript 5.0+
- **UI Components**:
  - TailwindCSS
  - Radix UI
  - Shadcn UI
- **State Management**:
  - React Query for server state
  - React Context for local state
- **Form Handling**:
  - React Hook Form
  - Zod for validation
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js v18+ and npm
- PostgreSQL 15+
- Git

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd dfcu-payment-gateway
   ```

2. Set up the backend

   ```bash
   cd backend
   npm install
   ```

3. Set up the frontend
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dfcu_payment_gateway

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
```

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Running the Application

#### Backend

```bash
# Navigate to backend directory
cd backend

# Set up the database
npx prisma generate
npx prisma db push

# Optional: Generate seed data
npm run seed

# Development mode
npm run dev

# Production mode
npm run build
npm start
```

#### Database Seeding

The backend includes a seeding script that populates the database with sample data for testing and development purposes:

```bash
# Run the seeding script
npm run seed
```

**What the seed script creates:**

1. **Users**:

   - Admin user: `admin_user` (password: `Admin@123`)
   - Regular users:
     - `john_doe` (password: `User@123`)
     - `jane_smith` (password: `User@123`)
     - `alice_cooper` (password: `User@123`)

2. **Transactions**:
   - Successful transaction (from John to Jane)
   - Pending transaction (from Jane to Alice)
   - Failed transaction (from Alice to John)

**Note**: The seeding script will clear existing data in the users, transactions, and refresh tokens tables before inserting sample data. Do not run this script in production environments.

#### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Access the application at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API Documentation: http://localhost:3001/api-docs

## API Documentation

### Authentication APIs

- **Login**: `POST /api/auth/login`
- **Refresh Token**: `POST /api/auth/refresh`
- **Logout**: `POST /api/auth/logout`
- **Register**: `POST /api/auth/register`

### Payment APIs

- **Payment Initiation**: `POST /api/payments/initiate`
- **Payment Status Check**: `GET /api/payments/status/:transactionReference`
- **Transaction History**: `GET /api/payments/history`

### User APIs

- **Get Profile**: `GET /api/users/profile`
- **Update Profile**: `PUT /api/users/profile`

## Application Screenshots

Below are screenshots showcasing the backend documentation with swagger:
![Sawgger Doc](/screenshots/Screenshot%202025-05-08%20at%2023.27.37.png)

![Sawgger Doc](/screenshots/Screenshot%202025-05-08%20at%2023.28.00.png)

Below are screenshots showcasing the application's frontend web interface and functionality:

![Login Page](/screenshots/Screenshot%202025-05-08%20at%2019.16.35.png)

![Dashboard Page](/screenshots/Screenshot%202025-05-08%20at%2019.14.46.png)

![Dashboard Page](/screenshots/Screenshot%202025-05-08%20at%2019.15.39.png)

![Transaction Flow](/screenshots/Screenshot%202025-05-08%20at%2019.14.57.png)

![Check Status Page](/screenshots/Screenshot%202025-05-08%20at%2019.15.06.png)

![Ongoing Payments Page](/screenshots/Screenshot%202025-05-08%20at%2019.15.14.png)

![Payment Details](/screenshots/Screenshot%202025-05-08%20at%2019.15.26.png)

![User Profile](/screenshots/Screenshot%202025-05-08%20at%2019.15.58.png)

![Change Password](/screenshots/Screenshot%202025-05-08%20at%2019.16.14.png)

## Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## License

This project is licensed under the ISC License.

## Docker Deployment

The application is containerized and can be easily deployed using Docker Compose.

### Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)

### Production Deployment Guide

#### 1. Prepare Environment

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd dfcu-payment-gateway
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```bash
   # PostgreSQL Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=secure_password_here
   POSTGRES_DB=dfcu_payment_gateway

   # JWT Configuration
   JWT_SECRET=your_production_jwt_secret_key
   JWT_EXPIRES_IN=1d

   # Backend Configuration
   DATABASE_URL=postgresql://postgres:secure_password_here@postgres:5432/dfcu_payment_gateway
   JWT_ACCESS_SECRET=your_access_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Frontend Configuration
   NEXT_PUBLIC_API_URL=http://your-domain.com/api  # Update with your actual domain
   ```

   **Important**: Replace placeholders with secure credentials for production deployments.

#### 2. Configure Docker Compose for Production

The included `docker-compose.yml` is already configured for production, but you may need to adjust:

- Port mappings if you're using a reverse proxy
- Volume mounts for persistent data
- Environment-specific variables

#### 3. Build and Start Services

1. Build and start all containers in detached mode

   ```bash
   docker-compose up -d --build
   ```

2. Verify all services are running:
   ```bash
   docker-compose ps
   ```

#### 4. Initialize the Database

1. Run database migrations:

   ```bash
   docker-compose exec backend npx prisma db push
   ```

2. (Optional) Seed the database with initial data:
   ```bash
   docker-compose exec backend npm run seed
   ```

#### 5. Access the Application

- Frontend: http://your-domain.com (or http://localhost:3000 for local deployment)
- Backend API: http://your-domain.com/api (or http://localhost:8000/api for local deployment)
- API Documentation: http://your-domain.com/api-docs (or http://localhost:8000/api-docs for local deployment)

### Production Best Practices

#### Security Considerations

1. **Use HTTPS**: Configure SSL/TLS for production using a reverse proxy like Nginx or Traefik

2. **Secure Environment Variables**: Never commit `.env` files to version control

3. **Regular Updates**: Keep Docker images updated with security patches

#### Monitoring and Maintenance

1. **Container Health Checks**:

   ```bash
   # Check container status
   docker-compose ps

   # View container logs
   docker-compose logs -f
   ```

2. **Database Backups**:

   ```bash
   # Create a database backup
   docker-compose exec postgres pg_dump -U postgres dfcu_payment_gateway > backup_$(date +%Y%m%d).sql

   # Restore from backup
   cat backup_file.sql | docker exec -i dfcu-postgres psql -U postgres -d dfcu_payment_gateway
   ```

#### Scaling and Updates

1. **Zero Downtime Updates**:

   ```bash
   # Pull latest images
   docker-compose pull

   # Restart services one by one
   docker-compose up -d --no-deps --build service-name
   ```

2. **Resource Allocation**:
   For high-traffic environments, adjust container resources in the `docker-compose.yml` file:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: "0.5"
             memory: 512M
   ```

### Troubleshooting

#### Common Issues

1. **Database Connection Issues**:

   - Verify PostgreSQL container is running: `docker-compose ps postgres`
   - Check DATABASE_URL in the backend environment
   - Ensure PostgreSQL is accepting connections: `docker-compose exec postgres pg_isready`

2. **Backend Not Starting**:

   - Check logs: `docker-compose logs backend`
   - Verify Prisma migrations: `docker-compose exec backend npx prisma migrate status`

3. **Frontend Not Connecting to Backend**:
   - Verify NEXT_PUBLIC_API_URL is correct
   - Check backend health: `curl -I http://localhost:8000/api/health`

#### Resetting the Environment

If you need to start fresh:

```bash
# Stop all containers
docker-compose down

# Remove volumes (CAUTION: This deletes all data)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

### Deployment with Reverse Proxy

For production deployments, it's recommended to use a reverse proxy like Nginx:

1. Create an nginx configuration file `nginx.conf`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://frontend:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://backend:8000/api;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api-docs {
           proxy_pass http://backend:8000/api-docs;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

2. Add Nginx service to `docker-compose.yml`:
   ```yaml
   nginx:
     image: nginx:alpine
     ports:
       - "80:80"
       - "443:443"
     volumes:
       - ./nginx.conf:/etc/nginx/conf.d/default.conf
       - ./ssl:/etc/nginx/ssl
     depends_on:
       - frontend
       - backend
     networks:
       - dfcu-network
   ```
