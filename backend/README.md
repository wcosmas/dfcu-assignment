# dfcu Bank Payment Gateway

A secure, reliable payment processing backend system built with Node.js, TypeScript, Express, and PostgreSQL.

## Features

- Secure authentication with JWT tokens and refresh token rotation
- Payment transaction processing with status simulation
- Transaction status tracking
- Role-based access control
- API documentation with Swagger
- PostgreSQL database with Prisma ORM

## Technology Stack

- **Runtime Environment**: Node.js (v18+)
- **Language**: TypeScript 5.0+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Authentication**: JWT with refresh token rotation
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest with Supertest

## Prerequisites

- Node.js v18+ and npm
- PostgreSQL 15+
- Git

## Getting Started

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd dfcu-payment-gateway
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. Generate seed data (optional)
   ```bash
   npm run seed
   ```

### Running the Application

#### Development

```bash
npm run dev
```

#### Production

```bash
npm run build
npm start
```

### API Documentation

API documentation is available at `/api-docs` endpoint when the server is running.

## API Endpoints

### Authentication APIs

- **Login**: `POST /api/auth/login`
- **Refresh Token**: `POST /api/auth/refresh`
- **Logout**: `POST /api/auth/logout`
- **Register** (optional): `POST /api/auth/register`

### Payment APIs

- **Payment Initiation**: `POST /api/payments/initiate`
- **Payment Status Check**: `GET /api/payments/status/:transactionReference`

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## License

This project is licensed under the ISC License.
