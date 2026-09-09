import 'dotenv/config';
import http from 'http';
import app from './app';
import prisma from './utils/prisma';
import { initStandupReminderCron } from './jobs/standupReminderJob';
import { initSocketServer } from './sockets/socket.server';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize the socket server (optional fallback for local legacy sockets)
try {
  initSocketServer(server);
} catch (wsErr) {
  console.warn('Local Socket.io server omitted (Realtime handled via Supabase):', wsErr);
}

async function startServer() {
  try {
    // Connect to Database
    await prisma.$connect();
    console.log('Connected to PostgreSQL Database via Prisma.');

    // Initialize daily standup reminder cron job
    initStandupReminderCron();
    console.log('Daily standup reminder cron job initialized.');
    console.log('Daily slack cron job initialized.');

    server.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
