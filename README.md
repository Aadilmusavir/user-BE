# User Manager API - Backend

A secure Node.js + Express + MongoDB API with JWT authentication and RBAC (Role-Based Access Control).

## Features

✨ **Features:**
- 🔐 JWT-based authentication
- 🛡️ RBAC with 3 roles: User, Moderator, Admin
- 📝 User registration and login
- 🔑 Token-based authorization
- 🔒 Password hashing with bcryptjs
- 📊 Comprehensive user management API
- ✅ Input validation
- 🌐 CORS enabled
- 📝 Logging middleware

## Technology Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

## Project Structure

```
user-BE/
├── models/           # Database schemas
│   └── user.model.js
├── controllers/      # Business logic
│   ├── auth.controller.js
│   └── user.controller.js
├── routes/          # API routes
│   └── user.routes.js
├── middlewares/     # Custom middleware
│   ├── auth.middleware.js
│   └── logger.middleware.js
├── configs/         # Configuration files
│   ├── env.config.js
│   └── mongo.config.js
├── utils/          # Utility functions
│   ├── jwt.utils.js
│   └── commonUtils.js
├── app.js          # Express app setup
├── index.js        # Server entry point
├── .env            # Environment variables
└── package.json
```

## Installation

### Prerequisites
- Node.js 16+
- MongoDB running locally or cloud connection
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
DB_CONNECTION_STRING=mongodb://localhost:27017/user-manager
SERVER_PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=7d
```

3. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "gender": "male"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "age": 25,
    "gender": "male",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Profile
```
GET /api/auth/profile
```
**Headers:**
```
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/auth/profile
```
**Headers:**
```
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Jane Doe",
  "age": 26,
  "gender": "female"
}
```

#### Logout
```
POST /api/auth/logout
```
**Headers:**
```
Authorization: Bearer <token>
```

### User Management Routes (Protected)

#### Get All Users (Admin Only)
```
GET /api/users
```
**Headers:**
```
Authorization: Bearer <admin-token>
```

#### Create User (Admin Only)
```
POST /api/users
```
**Headers:**
```
Authorization: Bearer <admin-token>
```
**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "age": 28,
  "gender": "female",
  "role": "moderator"
}
```

#### Get User By ID
```
GET /api/users/:id
```
**Headers:**
```
Authorization: Bearer <token>
```

#### Update User
```
PUT /api/users/:id
```
**Headers:**
```
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Updated Name",
  "age": 30,
  "gender": "female"
}
```
**Note:** Admins can also update role and isActive fields

#### Delete User (Admin Only)
```
DELETE /api/users/:id
```
**Headers:**
```
Authorization: Bearer <admin-token>
```

#### Get Users By Role (Admin Only)
```
GET /api/users/role/:role
```
**Headers:**
```
Authorization: Bearer <admin-token>
```
**Roles:** `user`, `moderator`, `admin`

## Authentication & Authorization

### Token Format
Tokens are JWT tokens with 3 main claims:
- `userId` - User's MongoDB ID
- `email` - User's email
- `role` - User's role

### Roles & Permissions

**User Role:**
- Can view their own profile
- Can update their own profile
- Can view user list

**Moderator Role:**
- All User permissions
- Can moderate user activities

**Admin Role:**
- All permissions
- Can create, read, update, delete users
- Can assign roles
- Can activate/deactivate users

### Authorization Middleware

The `authenticateToken` middleware validates the JWT token and extracts user data.

The `authorizeRole(...roles)` middleware checks if the user has one of the allowed roles.

## Error Handling

All errors return appropriate HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (Email exists) |
| 500 | Server Error |

## Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ CORS enabled
- ✅ Input validation
- ✅ Environment variable protection
- ✅ Automatic password removal from responses

## Running Tests

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Invalid Token Error
- Token may have expired
- Check JWT_SECRET is correct
- Ensure token format: `Bearer <token>`

### Role Forbidden Error
- User doesn't have required permissions
- Check user role in database
- Ensure proper admin account exists

## Creating Admin User

To create the first admin user manually:

1. Start the server
2. Register a normal user via `/api/auth/register`
3. Access MongoDB directly and update the user:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_CONNECTION_STRING | MongoDB connection URI | mongodb://localhost:27017/user-manager |
| SERVER_PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT signing secret | (required) |
| JWT_EXPIRY | Token expiration time | 7d |

## License

MIT
