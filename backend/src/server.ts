import 'dotenv/config';
import App from './app';
import { PrismaClient } from '@prisma/client';

// Database connection
const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('💾 Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};

// Initialize application
const initializeApp = async () => {
    await connectDB();
    const app = new App();
    app.listen();
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Start the application
initializeApp(); 