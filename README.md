# MERN Task Management Application

A comprehensive task management platform built with MongoDB, Express.js, React, and Node.js.

## Features

- User authentication (signup/login with JWT)
- Task creation and assignment
- Progress tracking with visual indicators
- File upload and submission system
- Assessment criteria management
- Responsive design for web and mobile
- Real-time updates

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB on your system
2. Start MongoDB service
3. The application will connect to `mongodb://localhost:27017/taskmanagement`

### Option 2: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id/progress` - Update task progress
- `POST /api/tasks/:id/submit` - Submit task files
- `PATCH /api/tasks/:id/assessment` - Update assessment criteria

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update user profile

## Usage

1. Register a new account or login with existing credentials
2. Create tasks with categories, deadlines, and assessment criteria
3. Assign tasks to team members
4. Track progress and submit work
5. Monitor task completion through the dashboard

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, JWT
- **Database**: MongoDB, Mongoose
- **File Upload**: Multer
- **Authentication**: JWT with bcrypt password hashing