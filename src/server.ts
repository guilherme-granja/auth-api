import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startScheduledJobs, stopScheduledJobs } from './jobs/scheduler';
import { prisma } from './config/database';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);

  startScheduledJobs();
});

// Graceful Shutdown - disconnect Prisma when the app shuts down
const onServerShutdown = async () => {
  console.log('🔴 SIGINT|SIGTERM signal received: closing HTTP server');

  await prisma.$disconnect();
  stopScheduledJobs();

  server.close(() => {
    console.log('👋 HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGINT', onServerShutdown);
process.on('SIGTERM', onServerShutdown);
