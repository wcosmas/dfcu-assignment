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
- [Testing](#testing)
- [License](#license)

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
PORT=8000
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
npm run prisma:migrate
npm run prisma:generate

# Optional: Generate seed data
npm run seed

# Development mode
npm run dev

# Production mode
npm run build
npm start
```

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
- Backend API: http://localhost:8000/api
- API Documentation: http://localhost:8000/api-docs

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

## Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing

```bash
cd frontend

# Run all tests
npm test
```

## License

This project is licensed under the ISC License.
