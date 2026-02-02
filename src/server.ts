import dotenv from "dotenv";
dotenv.config();

import app from './app';
import {prisma} from './config/database';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown - disconnect Prisma when the app shuts down
process.on('SIGINT', async () => {
    console.log('🔴 SIGINT signal received: closing HTTP server');

    await prisma.$disconnect();

    server.close(() => {
        console.log('👋 HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    console.log('🔴 SIGTERM signal received: closing HTTP server');

    await prisma.$disconnect();

    server.close(() => {
        console.log('👋 HTTP server closed');
        process.exit(0);
    });
});
