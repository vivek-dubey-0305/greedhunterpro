import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';

// Import routes
import userRoutes from './routes/user.route.js';
import quizRoutes from './routes/quiz.route.js';
import eventRoutes from './routes/event.route.js';
import walletRoutes from './routes/wallet.route.js';
import logRoutes from './routes/log.route.js';
import challengeRoutes from './routes/challenge.route.js';
import missionRoutes from './routes/mission.route.js';
import communityRoutes from './routes/community.route.js';
import storeRoutes from './routes/store.route.js';
import notificationRoutes from './routes/notification.route.js';
import adminRoutes from './routes/admin.route.js';

// Import middlewares
import { errorMiddleware } from './middlewares/error.middleware.js';
import { asyncHandler } from './middlewares/asyncHandler.middleware.js';

// Import utilities
import { logActivity } from './utils/logActivity.utils.js';

// Load environment variables
config();

// Initialize Express app
const app = express();

// Create HTTP server for Socket.IO
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
        credentials: true
    }
});

// Middleware setup
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session middleware for Passport.js OAuth
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware for OAuth
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/logs', logRoutes);
app.use('/api/v1/challenges', challengeRoutes);
app.use('/api/v1/missions', missionRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(errorMiddleware);
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user-specific room for personalized updates
    socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined room user-${userId}`);
    });

    // Join quiz room for real-time leaderboard updates
    socket.on('join-quiz-room', (quizId) => {
        socket.join(`quiz-${quizId}`);
        console.log(`User joined quiz room: quiz-${quizId}`);
    });

    // Join event room for real-time updates
    socket.on('join-event-room', (eventId) => {
        socket.join(`event-${eventId}`);
        console.log(`User joined event room: event-${eventId}`);
    });

    // Handle quiz participation updates
    socket.on('quiz-participation-update', async (data) => {
        try {
            const { quizId, userId, score, timeTaken } = data;

            // Emit to quiz room for leaderboard updates
            io.to(`quiz-${quizId}`).emit('leaderboard-update', {
                userId,
                score,
                timeTaken,
                timestamp: new Date()
            });

            // Log activity
            await logActivity(userId, 'quiz_participation', {
                quizId,
                score,
                timeTaken
            });

        } catch (error) {
            console.error('Error handling quiz participation:', error);
        }
    });

    // Handle wallet transaction updates
    socket.on('wallet-transaction', async (data) => {
        try {
            const { userId, transactionType, amount, description } = data;

            // Emit to user room for wallet updates
            io.to(`user-${userId}`).emit('wallet-update', {
                transactionType,
                amount,
                description,
                timestamp: new Date()
            });

            // Log activity
            await logActivity(userId, 'wallet_transaction', {
                transactionType,
                amount,
                description
            });

        } catch (error) {
            console.error('Error handling wallet transaction:', error);
        }
    });

    // Handle event participation
    socket.on('event-participation', async (data) => {
        try {
            const { eventId, userId, action } = data;

            // Emit to event room
            io.to(`event-${eventId}`).emit('event-update', {
                userId,
                action,
                timestamp: new Date()
            });

            // Log activity
            await logActivity(userId, 'event_participation', {
                eventId,
                action
            });

        } catch (error) {
            console.error('Error handling event participation:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Global error handler (must be last)

// Export app and server for use in server.js
export { app, server, io };