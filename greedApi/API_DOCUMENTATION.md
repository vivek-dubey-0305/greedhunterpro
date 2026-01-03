# GreedHunter API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

All protected routes require a valid JWT token sent as:
- Cookie: `accessToken`
- Header: `Authorization: Bearer <token>`

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/register` | Register new user | ❌ |
| POST | `/users/login` | Login user | ❌ |
| POST | `/users/logout` | Logout user | ✅ |
| POST | `/users/refresh-token` | Refresh access token | ❌ |
| POST | `/users/forgot-password` | Send password reset email | ❌ |
| POST | `/users/reset-password/:token` | Reset password | ❌ |
| POST | `/users/send-otp` | Send OTP to email | ✅ |
| POST | `/users/verify-otp` | Verify OTP | ❌ |
| GET | `/users/auth/google` | Google OAuth | ❌ |
| GET | `/users/auth/github` | GitHub OAuth | ❌ |

---

## User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get logged-in user profile | ✅ |
| PUT | `/users/profile` | Update user profile | ✅ |
| GET | `/users/stats` | Get user stats (level, xp, etc.) | ✅ |
| PUT | `/users/privacy` | Update privacy settings | ✅ |
| PUT | `/users/change-password` | Change password | ✅ |
| PUT | `/users/avatar` | Update avatar (multipart) | ✅ |
| DELETE | `/users/delete` | Delete account | ✅ |
| POST | `/users/follow/:userId` | Follow a user | ✅ |
| POST | `/users/unfollow/:userId` | Unfollow a user | ✅ |
| GET | `/users/leaderboard` | Get leaderboard | ❌ |
| GET | `/users/:userId` | Get user by ID | ❌ |

---

## Events Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/events` | Get all events | ❌ |
| GET | `/events/:eventId` | Get event by ID | ❌ |
| GET | `/events/:eventId/leaderboard` | Get event leaderboard | ❌ |
| POST | `/events` | Create event | ✅ Admin |
| PUT | `/events/:eventId` | Update event | ✅ Admin |
| DELETE | `/events/:eventId` | Delete event | ✅ Admin |
| POST | `/events/:eventId/join` | Join event | ✅ |
| POST | `/events/:eventId/leave` | Leave event | ✅ |
| POST | `/events/:eventId/submit` | Submit to event | ✅ |
| GET | `/events/user/my-events` | Get user's events | ✅ |

### Query Parameters (GET /events)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (upcoming, ongoing, completed)
- `category` - Filter by category

---

## Challenges Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/challenges` | Get all challenges | ❌ |
| GET | `/challenges/:challengeId` | Get challenge by ID | ❌ |
| GET | `/challenges/user/my-challenges` | Get user's challenges | ✅ |
| POST | `/challenges/:challengeId/progress` | Update progress | ✅ |
| GET | `/challenges/admin/all` | Admin: Get all challenges | ✅ Admin |
| POST | `/challenges` | Create challenge | ✅ Admin |
| PUT | `/challenges/:challengeId` | Update challenge | ✅ Admin |
| DELETE | `/challenges/:challengeId` | Delete challenge | ✅ Admin |

### Query Parameters (GET /challenges)
- `page`, `limit`
- `type` - daily, weekly, monthly, special
- `difficulty` - easy, medium, hard, expert
- `category`
- `isActive` - true/false

---

## Missions Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/missions` | Get all missions | ❌ |
| GET | `/missions/:missionId` | Get mission by ID | ❌ |
| GET | `/missions/user/my-missions` | Get user's missions | ✅ |
| POST | `/missions/:missionId/progress` | Update progress | ✅ |
| GET | `/missions/admin/all` | Admin: Get all | ✅ Admin |
| GET | `/missions/admin/stats` | Admin: Get stats | ✅ Admin |
| POST | `/missions/admin/reset-daily` | Reset daily missions | ✅ Admin |
| POST | `/missions` | Create mission | ✅ Admin |
| PUT | `/missions/:missionId` | Update mission | ✅ Admin |
| DELETE | `/missions/:missionId` | Delete mission | ✅ Admin |

---

## Communities Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/communities` | Get all communities | ❌ |
| GET | `/communities/:communityId` | Get community by ID | ❌ |
| GET | `/communities/user/my-communities` | Get user's communities | ✅ |
| POST | `/communities` | Create community | ✅ Verified |
| PUT | `/communities/:communityId` | Update community | ✅ Owner |
| POST | `/communities/:communityId/join` | Join community | ✅ |
| POST | `/communities/:communityId/leave` | Leave community | ✅ |
| POST | `/communities/:communityId/requests/:userId` | Handle join request | ✅ Mod |
| POST | `/communities/:communityId/moderators/:userId` | Manage moderators | ✅ Owner |
| GET | `/communities/admin/all` | Admin: Get all | ✅ Admin |
| POST | `/communities/:communityId/suspend` | Suspend community | ✅ Admin |
| POST | `/communities/:communityId/unsuspend` | Unsuspend community | ✅ Admin |
| DELETE | `/communities/:communityId` | Delete community | ✅ Admin |

---

## Store Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/store` | Get all items | ❌ |
| GET | `/store/featured` | Get featured items | ❌ |
| GET | `/store/categories` | Get categories | ❌ |
| GET | `/store/:itemId` | Get item by ID | ❌ |
| GET | `/store/user/inventory` | Get user's inventory | ✅ |
| POST | `/store/:itemId/purchase` | Purchase item | ✅ |
| GET | `/store/admin/all` | Admin: Get all items | ✅ Admin |
| POST | `/store` | Create item | ✅ Admin |
| PUT | `/store/:itemId` | Update item | ✅ Admin |
| DELETE | `/store/:itemId` | Delete item | ✅ Admin |

---

## Notifications Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/notifications` | Get user notifications | ✅ |
| GET | `/notifications/unread-count` | Get unread count | ✅ |
| POST | `/notifications/:notificationId/read` | Mark as read | ✅ |
| POST | `/notifications/mark-all-read` | Mark all as read | ✅ |
| DELETE | `/notifications/:notificationId` | Hide notification | ✅ |
| GET | `/notifications/admin/all` | Admin: Get all | ✅ Admin |
| GET | `/notifications/admin/stats` | Admin: Get stats | ✅ Admin |
| POST | `/notifications/admin/process-scheduled` | Process scheduled | ✅ Admin |
| POST | `/notifications` | Create notification | ✅ Admin |
| PUT | `/notifications/:notificationId` | Update notification | ✅ Admin |
| POST | `/notifications/:notificationId/send` | Send now | ✅ Admin |
| DELETE | `/notifications/admin/:notificationId` | Delete notification | ✅ Admin |

---

## Wallet Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/wallet` | Get wallet info | ✅ |
| GET | `/wallet/transactions` | Get transaction history | ✅ |
| GET | `/wallet/stats` | Get wallet stats | ✅ |
| POST | `/wallet/transfer` | Transfer coins | ✅ |
| POST | `/wallet/add-coins` | Admin: Add coins | ✅ Admin |
| POST | `/wallet/deduct-coins` | Admin: Deduct coins | ✅ Admin |
| POST | `/wallet/freeze` | Admin: Freeze wallet | ✅ Admin |
| POST | `/wallet/unfreeze` | Admin: Unfreeze wallet | ✅ Admin |

---

## Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/dashboard` | Get dashboard stats | ✅ Admin |
| GET | `/admin/activity-logs` | Get activity logs | ✅ Admin |
| GET | `/admin/analytics/user-growth` | User growth analytics | ✅ Admin |
| GET | `/admin/users` | Get all users | ✅ Admin |
| GET | `/admin/users/:userId` | Get user by ID | ✅ Admin |
| PUT | `/admin/users/:userId` | Update user | ✅ Admin |
| POST | `/admin/users/:userId/ban` | Ban user | ✅ Admin |
| POST | `/admin/users/:userId/unban` | Unban user | ✅ Admin |
| POST | `/admin/users/:userId/role` | Change role | ✅ Super Admin |
| DELETE | `/admin/users/:userId` | Delete user | ✅ Admin |
| POST | `/admin/users/:userId/add-coins` | Add coins | ✅ Admin |
| POST | `/admin/users/:userId/deduct-coins` | Deduct coins | ✅ Admin |

---

## Quiz Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/quizzes` | Get all quizzes | ❌ |
| GET | `/quizzes/:quizId` | Get quiz by ID | ❌ |
| POST | `/quizzes` | Create quiz | ✅ |
| PUT | `/quizzes/:quizId` | Update quiz | ✅ |
| DELETE | `/quizzes/:quizId` | Delete quiz | ✅ |
| POST | `/quizzes/:quizId/submit` | Submit quiz attempt | ✅ |
| GET | `/quizzes/:quizId/leaderboard` | Get quiz leaderboard | ❌ |
| GET | `/quizzes/user/my-quizzes` | Get user's quizzes | ✅ |

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "statusCode": 400
  }
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Pagination Response Format

All paginated endpoints return:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| General | 100 requests/15 min |
| Auth (login/register) | 5 requests/15 min |
| Password Reset | 3 requests/hour |
| OTP | 5 requests/15 min |
| Wallet Operations | 20 requests/15 min |
| Admin | 200 requests/15 min |

---

## Environment Variables Required

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/greedhunter

# JWT
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Session
SESSION_SECRET=your-session-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-app-password

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend
FRONTEND_URL=http://localhost:5173
```
