# DFCU Payment Gateway Frontend

This is the frontend application for the DFCU Bank Payment Gateway, a lightweight payment processing system designed to facilitate secure financial transactions.

## Features

- User authentication with JWT tokens
- Payment initiation
- Payment status tracking
- Dashboard with transaction history
- Responsive design for mobile and desktop

## Tech Stack

- **Next.js 14**: React framework for server-side rendering and static site generation
- **TypeScript**: Typed JavaScript for better developer experience
- **TailwindCSS**: Utility-first CSS framework
- **React Query**: Data fetching, caching and state management
- **React Hook Form**: Form validation and handling
- **Zod**: Schema validation
- **Axios**: HTTP client for API requests

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:

```bash
cd "DFCU Assignment/frontend"
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Adjust the API URL based on your backend setup.

## Project Structure

- `src/api`: API client and service functions
- `src/app`: Next.js pages using the App Router
- `src/components`: Reusable React components
- `src/hooks`: Custom React hooks
  - `src/hooks/api`: React Query hooks for data fetching
- `src/lib`: Utility libraries
  - `src/lib/react-query.tsx`: React Query provider
  - `src/lib/query-keys.ts`: Centralized query keys
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions

## Authentication

The authentication system uses JWT tokens with:

- Short-lived access tokens (stored in HTTP-only cookies)
- Refresh tokens (stored in cookies with proper security settings)
- Automatic token refresh
- Protected routes with middleware
- Secure cookie management for enhanced security

## Data Fetching with React Query

The application uses React Query for data fetching and state management:

- Automatic caching and stale-while-revalidate pattern
- Optimistic updates
- Centralized query keys
- Automatic error handling
- Request deduplication
- Background refetching

For more details on the React Query implementation, see [React Query README](./src/hooks/api/README.md).

## Deployment

Build the application for production:

```bash
npm run build
# or
yarn build
```

Then, start the production server:

```bash
npm start
# or
yarn start
```

## Related Projects

- [DFCU Payment Gateway Backend](../backend): The backend API service for this application

## License

Proprietary - All rights reserved
