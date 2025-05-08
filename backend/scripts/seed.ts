import { PrismaClient, UserRole, TransactionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

/**
 * Generate a unique transaction reference
 */
function generateTransactionReference(): string {
    const timestamp = Date.now();
    const randomString = randomBytes(4).toString('hex');
    return `TRX-${timestamp}-${randomString}`;
}

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        console.log('Clearing existing data...');
        await prisma.refreshToken.deleteMany({});
        await prisma.transaction.deleteMany({});
        await prisma.user.deleteMany({});

        console.log('Creating admin user...');
        const adminPassword = await bcrypt.hash('Admin@123', 12);
        const admin = await prisma.user.create({
            data: {
                username: 'admin_user',
                email: 'admin@example.com',
                password: adminPassword,
                fullName: 'System Administrator',
                accountNumber: '1000000001',
                role: UserRole.ADMIN,
            },
        });

        console.log('Creating regular users...');
        const userPassword = await bcrypt.hash('User@123', 12);

        const user1 = await prisma.user.create({
            data: {
                username: 'john_doe',
                email: 'john@example.com',
                password: userPassword,
                fullName: 'John Doe',
                accountNumber: '1000000002',
                role: UserRole.USER,
            },
        });

        const user2 = await prisma.user.create({
            data: {
                username: 'jane_smith',
                email: 'jane@example.com',
                password: userPassword,
                fullName: 'Jane Smith',
                accountNumber: '1000000003',
                role: UserRole.USER,
            },
        });

        const user3 = await prisma.user.create({
            data: {
                username: 'alice_cooper',
                email: 'alice@example.com',
                password: userPassword,
                fullName: 'Alice Cooper',
                accountNumber: '1000000004',
                role: UserRole.USER,
            },
        });

        console.log('Creating sample transactions...');

        // Create successful transaction
        await prisma.transaction.create({
            data: {
                transactionReference: generateTransactionReference(),
                amount: 1000.00,
                currency: 'UGX',
                payerReference: 'Payment for services',
                status: TransactionStatus.SUCCESSFUL,
                statusCode: 200,
                message: 'Transaction successfully processed',
                payerId: user1.id,
                payeeId: user2.id,
                payerAccountNumber: user1.accountNumber,
                payeeAccountNumber: user2.accountNumber,
            },
        });

        // Create pending transaction
        await prisma.transaction.create({
            data: {
                transactionReference: generateTransactionReference(),
                amount: 500.50,
                currency: 'UGX',
                payerReference: 'Monthly subscription',
                status: TransactionStatus.PENDING,
                statusCode: 100,
                message: 'Transaction Pending',
                payerId: user2.id,
                payeeId: user3.id,
                payerAccountNumber: user2.accountNumber,
                payeeAccountNumber: user3.accountNumber,
            },
        });

        // Create failed transaction
        await prisma.transaction.create({
            data: {
                transactionReference: generateTransactionReference(),
                amount: 2500.00,
                currency: 'UGX',
                payerReference: 'Invoice payment',
                status: TransactionStatus.FAILED,
                statusCode: 400,
                message: 'Transaction failed: Insufficient funds',
                payerId: user3.id,
                payeeId: user1.id,
                payerAccountNumber: user3.accountNumber,
                payeeAccountNumber: user1.accountNumber,
            },
        });

        console.log('✅ Seeding completed successfully');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed(); 