# GreedHunter API

A comprehensive backend API for the GreedHunter platform, built with Node.js, Express, MongoDB, and Socket.IO. Features real-time quiz competitions, event management, wallet system with GreedCoins, and OAuth authentication.

## Features

- **User Management**: Registration, authentication, profile management with OAuth (Google/GitHub)
- **Quiz System**: Create and participate in search hunt quizzes with scoring algorithms
- **Event Management**: Schedule events with prizes and participant management
- **Wallet System**: GreedCoins management with transaction history
- **Activity Logging**: Comprehensive logging with embedded activities for performance
- **Real-time Features**: Socket.IO integration for live leaderboards and updates
- **Security**: JWT authentication, input validation, rate limiting, CORS
- **File Uploads**: Avatar uploads with Cloudinary integration
- **Email Services**: OTP verification and password reset emails

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Authentication**: JWT, Passport.js (OAuth)
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Joi, Validator
- **Security**: bcrypt, helmet, cors, express-rate-limit

## Prerequisites

- Node.js >= 18.0.0
- MongoDB
- Redis (optional, for caching)
- Kafka (optional, for activity streaming)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd greedhunter/greedApi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:8000` by default.

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/refresh-token` - Refresh access token
- `GET /api/v1/users/auth/google` - Google OAuth
- `GET /api/v1/users/auth/github` - GitHub OAuth

### User Management
- `GET /api/v1/users/me` - Get current user info
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/avatar` - Update user avatar
- `DELETE /api/v1/users/account` - Delete user account

### Quiz Management
- `GET /api/v1/quizzes` - Get all quizzes
- `POST /api/v1/quizzes` - Create quiz (admin)
- `GET /api/v1/quizzes/:id` - Get quiz by ID
- `PUT /api/v1/quizzes/:id` - Update quiz (admin)
- `DELETE /api/v1/quizzes/:id` - Delete quiz (admin)
- `POST /api/v1/quizzes/:id/participate` - Participate in quiz

### Event Management
- `GET /api/v1/events` - Get all events
- `POST /api/v1/events` - Create event (admin)
- `GET /api/v1/events/:id` - Get event by ID
- `PUT /api/v1/events/:id` - Update event (admin)
- `DELETE /api/v1/events/:id` - Delete event (admin)

### Wallet System
- `GET /api/v1/wallet/balance` - Get user balance
- `GET /api/v1/wallet/transactions` - Get transaction history
- `POST /api/v1/wallet/transfer` - Transfer GreedCoins

### Activity Logs
- `GET /api/v1/logs/user/:userId` - Get user activity logs
- `GET /api/v1/logs/analytics` - Get analytics (admin)

## Socket.IO Events

### Client Events
- `join-user-room` - Join user-specific room
- `join-quiz-room` - Join quiz room for updates
- `join-event-room` - Join event room for updates
- `quiz-participation-update` - Update quiz participation
- `wallet-transaction` - Wallet transaction update
- `event-participation` - Event participation update

### Server Events
- `leaderboard-update` - Quiz leaderboard updates
- `wallet-update` - Wallet balance updates
- `event-update` - Event participation updates

## Project Structure

```
greedApi/
├── configs/
│   └── passport.js          # OAuth configuration
├── controllers/             # Route controllers
├── middlewares/            # Custom middlewares
├── models/                 # MongoDB models
├── routes/                 # API routes
├── services/               # Business logic services
├── templates/              # Email templates
├── utils/                  # Utility functions
├── app.js                  # Express app setup
├── server.js               # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Environment Variables

See `.env.example` for all required environment variables.

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### API Documentation

The API uses RESTful conventions with JSON responses. All protected routes require JWT authentication via Authorization header: `Bearer <token>`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC