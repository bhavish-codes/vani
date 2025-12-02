# Fullstack Authentication App

A complete fullstack authentication application with JWT-based authentication, built with React and Node.js.

## 🚀 Features

- ✅ User Registration (Signup)
- ✅ User Login with JWT Authentication
- ✅ Protected Routes
- ✅ Logout Functionality
- ✅ Toast Notifications
- ✅ Form Validation (Frontend & Backend)
- ✅ Password Hashing with Bcrypt
- ✅ Modern, Responsive UI
- ✅ Comprehensive Debug Logging

## 📁 Project Structure

```
fullstack app 2/
├── backend/                 # Node.js + Express Backend
│   ├── src/
│   │   ├── controllers/    # Auth controllers
│   │   ├── middleware/     # Validation middleware
│   │   ├── models/         # MongoDB models
│   │   └── routes/         # API routes
│   ├── .env               # Environment variables
│   └── index.js           # Server entry point
│
└── frontend/               # React Frontend
    ├── src/
    │   ├── pages/         # Page components
    │   │   ├── Signup.js
    │   │   ├── Login.js
    │   │   └── Home.js
    │   └── App.js         # Main app with routing
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **React Toastify** - Toast notifications
- **CSS3** - Styling with gradients and animations

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
PORT=8080
MONGO_CONN=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

4. Start the server:
```bash
npm run dev
```

Backend runs on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## 🔌 API Endpoints

### Authentication Routes

#### POST `/auth/signup`
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "Signup successful",
  "success": true,
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/auth/login`
Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## 🎨 Frontend Routes

- `/` - Redirects to login
- `/signup` - User registration page
- `/login` - User login page
- `/home` - Protected dashboard (requires authentication)

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 24-hour expiration
- Input validation on both frontend and backend
- Protected routes with authentication checks
- CORS enabled for cross-origin requests
- Secure HTTP status codes (401, 403, 409, etc.)

## 🐛 Debugging

The application includes comprehensive console logging with emojis for easy debugging:

- 🚀 Process start
- 📝 Data logging
- 📡 API requests
- 📥 Responses
- ✅ Success
- ❌ Errors
- 🔄 Redirects
- 🏁 Completion

Open browser DevTools Console to see detailed logs.

## 📝 Validation Rules

### Signup
- **Name**: 3-100 characters, required
- **Email**: Valid email format, required
- **Password**: 6-100 characters, required

### Login
- **Email**: Valid email format, required
- **Password**: 6-100 characters, required

## 🎯 Usage Flow

1. **Signup**: Create a new account at `/signup`
2. **Login**: Login with credentials at `/login`
3. **Dashboard**: Access protected home page at `/home`
4. **Logout**: Click logout button to clear session

## 🚨 Error Handling

The app handles various error scenarios:

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid credentials)
- **409** - Conflict (user already exists)
- **500** - Internal Server Error

All errors are displayed via toast notifications.

## 🌟 Features Highlights

### Modern UI
- Gradient backgrounds
- Smooth animations
- Glassmorphism effects
- Responsive design
- Loading states

### User Experience
- Real-time validation feedback
- Toast notifications for all actions
- Smooth page transitions
- Auto-redirect after actions
- Protected route handling

## 📄 License

ISC

## 👨‍💻 Author

Built with ❤️ using React and Node.js
