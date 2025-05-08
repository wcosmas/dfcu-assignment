# Database Scripts

This directory contains utility scripts for database management and seeding.

## Seeding

The `seed.ts` script populates the database with sample data for testing and development purposes.

### What it creates:

1. **Users**:

   - Admin user: `admin_user` with password `Admin@123`
   - Regular users:
     - `john_doe` with password `User@123`
     - `jane_smith` with password `User@123`
     - `alice_cooper` with password `User@123`

2. **Transactions**:
   - Successful transaction (from John to Jane)
   - Pending transaction (from Jane to Alice)
   - Failed transaction (from Alice to John)

### Usage

To run the seed script:

```bash
npm run seed
```

**Note**: The script will delete all existing data in the `users`, `transactions`, and `refresh_tokens` tables before inserting the sample data. Do not run this in production environments.

### Customization

To modify the seed data, edit the `seed.ts` file in this directory. You can adjust:

- User credentials and details
- Number of sample users
- Transaction types and details
- Default password hashing strength (currently set to cost factor 12)

## Prerequisites

Before running the seed script, ensure:

1. Your database is properly set up and running
2. The `DATABASE_URL` environment variable is correctly set in your `.env` file
3. You have run Prisma migrations (`npm run prisma:migrate`)
