# Authorization-Based TODO Application

A secure TODO application with JWT-based authentication using Node.js, Express, and Supabase.

## 🚀 Features

- ✅ User Authentication (Signup & Login)
- ✅ JWT-based Authorization
- ✅ Protected Routes with Middleware
- ✅ User-specific TODO Management (CRUD)
- ✅ Secure Password Hashing with bcrypt
- ✅ Authorization Rules (Users can only access their own todos)
- ✅ Supabase Database Integration

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account ([Sign up here](https://supabase.com/))

## 🗄️ Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `todo-app` (or any name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your location
4. Click **"Create New Project"** and wait for it to finish setting up

### Step 2: Get Your Supabase Credentials

1. In your project dashboard, click on **"Settings"** (gear icon)
2. Navigate to **"API"** section
3. Copy the following:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon/public key**: This is your `SUPABASE_KEY`

### Step 3: Create Database Tables

1. In your Supabase dashboard, go to **"SQL Editor"**
2. Click **"New Query"**
3. Copy and paste the following SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_users_email ON users(email);
```

4. Click **"Run"** to execute the SQL
5. Verify tables were created by going to **"Table Editor"** in the sidebar

### Step 4: Configure Row Level Security (Optional but Recommended)

For additional security, you can enable RLS:

```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - your app handles authorization via JWT)
-- These are backup policies in case of direct database access
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own todos" 
  ON todos FOR ALL 
  USING (auth.uid() = user_id);
```

## 📦 Installation

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd Authorization-Todo-Application

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

1. Create a `.env` file in the root directory:

```bash
# Copy the example file
copy .env.example .env
```

2. Edit `.env` and add your credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration (Replace with your actual credentials)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here

# JWT Configuration (Change this to a random secure string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h
```

**Important**: 
- Replace `SUPABASE_URL` and `SUPABASE_KEY` with your actual Supabase credentials
- Change `JWT_SECRET` to a long, random, secure string
- Never commit the `.env` file to version control

## 🏃 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### 1. Signup (Register New User)

**Endpoint**: `POST /signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-01-31T12:00:00Z"
  }
}
```

#### 2. Login

**Endpoint**: `POST /login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note**: Save the `token` - you'll need it for all TODO operations!

### TODO Endpoints (Protected - Requires Authentication)

**All TODO endpoints require Authorization header:**
```
Authorization: Bearer <your_jwt_token>
```

#### 3. Create Todo

**Endpoint**: `POST /todos`

**Headers**:
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Buy groceries",
  "completed": false
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Todo created successfully.",
  "data": {
    "id": "uuid-here",
    "title": "Buy groceries",
    "completed": false,
    "user_id": "user-uuid",
    "created_at": "2026-01-31T12:00:00Z"
  }
}
```

#### 4. Get All Todos

**Endpoint**: `GET /todos`

**Headers**:
```
Authorization: Bearer <your_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Todos retrieved successfully.",
  "count": 2,
  "data": [
    {
      "id": "uuid-1",
      "title": "Buy groceries",
      "completed": false,
      "user_id": "user-uuid",
      "created_at": "2026-01-31T12:00:00Z"
    },
    {
      "id": "uuid-2",
      "title": "Complete project",
      "completed": true,
      "user_id": "user-uuid",
      "created_at": "2026-01-31T11:00:00Z"
    }
  ]
}
```

#### 5. Update Todo

**Endpoint**: `PUT /todos/:id`

**Headers**:
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "title": "Buy groceries and cook dinner",
  "completed": true
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Todo updated successfully.",
  "data": {
    "id": "uuid-here",
    "title": "Buy groceries and cook dinner",
    "completed": true,
    "user_id": "user-uuid",
    "created_at": "2026-01-31T12:00:00Z"
  }
}
```

#### 6. Delete Todo

**Endpoint**: `DELETE /todos/:id`

**Headers**:
```
Authorization: Bearer <your_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Todo deleted successfully."
}
```

### Error Responses

#### 400 - Bad Request
```json
{
  "success": false,
  "message": "Please provide name, email, and password."
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### 403 - Forbidden
```json
{
  "success": false,
  "message": "You are not authorized to update this todo."
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "message": "Todo not found."
}
```

#### 409 - Conflict
```json
{
  "success": false,
  "message": "User with this email already exists."
}
```

#### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Error creating user account.",
  "error": "Detailed error message"
}
```

## 🧪 Testing the Application

### Option 1: Using cURL (Command Line)

#### 1. Signup a new user
```bash
curl -X POST http://localhost:3000/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

#### 2. Login and get token
```bash
curl -X POST http://localhost:3000/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Copy the token from the response!**

#### 3. Create a todo (replace YOUR_TOKEN)
```bash
curl -X POST http://localhost:3000/todos ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"title\":\"Buy groceries\"}"
```

#### 4. Get all todos
```bash
curl -X GET http://localhost:3000/todos ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 5. Update a todo (replace TODO_ID and YOUR_TOKEN)
```bash
curl -X PUT http://localhost:3000/todos/TODO_ID ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"completed\":true}"
```

#### 6. Delete a todo
```bash
curl -X DELETE http://localhost:3000/todos/TODO_ID ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Option 2: Using Postman

1. **Download Postman**: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Create a new collection**: "TODO App Tests"

3. **Test Signup**:
   - Method: POST
   - URL: `http://localhost:3000/signup`
   - Body (JSON):
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "test123"
     }
     ```

4. **Test Login**:
   - Method: POST
   - URL: `http://localhost:3000/login`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "test123"
     }
     ```
   - Copy the `token` from response

5. **Test Create Todo**:
   - Method: POST
   - URL: `http://localhost:3000/todos`
   - Headers: 
     - Key: `Authorization`
     - Value: `Bearer <paste_your_token>`
   - Body (JSON):
     ```json
     {
       "title": "My first todo"
     }
     ```

6. **Test Get Todos**:
   - Method: GET
   - URL: `http://localhost:3000/todos`
   - Headers: `Authorization: Bearer <your_token>`

7. **Test Update Todo**:
   - Method: PUT
   - URL: `http://localhost:3000/todos/<todo_id>`
   - Headers: `Authorization: Bearer <your_token>`
   - Body (JSON):
     ```json
     {
       "title": "Updated todo",
       "completed": true
     }
     ```

8. **Test Delete Todo**:
   - Method: DELETE
   - URL: `http://localhost:3000/todos/<todo_id>`
   - Headers: `Authorization: Bearer <your_token>`

### Option 3: Using VS Code REST Client Extension

1. Install "REST Client" extension in VS Code
2. Create a file `test.http` in your project
3. Add the following:

```http
### Signup
POST http://localhost:3000/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}

### Login
POST http://localhost:3000/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}

### Create Todo (Replace YOUR_TOKEN)
POST http://localhost:3000/todos
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "Buy groceries"
}

### Get All Todos
GET http://localhost:3000/todos
Authorization: Bearer YOUR_TOKEN

### Update Todo (Replace TODO_ID)
PUT http://localhost:3000/todos/TODO_ID
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "completed": true
}

### Delete Todo (Replace TODO_ID)
DELETE http://localhost:3000/todos/TODO_ID
Authorization: Bearer YOUR_TOKEN
```

Click "Send Request" above each section to test!

## 🧪 Testing Authorization

### Test that users cannot access other users' todos:

1. **Create User 1**:
   ```bash
   curl -X POST http://localhost:3000/signup ^
     -H "Content-Type: application/json" ^
     -d "{\"name\":\"User One\",\"email\":\"user1@test.com\",\"password\":\"pass123\"}"
   ```

2. **Login as User 1** and save token1

3. **Create a todo as User 1**:
   ```bash
   curl -X POST http://localhost:3000/todos ^
     -H "Content-Type: application/json" ^
     -H "Authorization: Bearer TOKEN1" ^
     -d "{\"title\":\"User 1 Todo\"}"
   ```
   Save the `todo_id`

4. **Create User 2** and login to get token2

5. **Try to access User 1's todo with User 2's token**:
   ```bash
   curl -X PUT http://localhost:3000/todos/USER1_TODO_ID ^
     -H "Content-Type: application/json" ^
     -H "Authorization: Bearer TOKEN2" ^
     -d "{\"completed\":true}"
   ```

   **Expected**: 403 Forbidden - "You are not authorized to update this todo."

6. **Try to delete User 1's todo as User 2**:
   ```bash
   curl -X DELETE http://localhost:3000/todos/USER1_TODO_ID ^
     -H "Authorization: Bearer TOKEN2"
   ```

   **Expected**: 403 Forbidden

## 📂 Project Structure

```
Authorization-Todo-Application/
├── src/
│   ├── config/
│   │   └── supabase.js          # Supabase client configuration
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT verification middleware
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   └── todo.controller.js   # TODO CRUD operations
│   ├── routes/
│   │   ├── auth.routes.js       # Authentication routes
│   │   └── todo.routes.js       # TODO routes
│   ├── app.js                   # Express app setup
│   └── server.js                # Server startup
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with 1-hour expiration
- ✅ Protected routes with middleware
- ✅ User-specific data access (authorization rules)
- ✅ Input validation
- ✅ Error handling
- ✅ Environment variables for sensitive data

## 🛠️ Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Supabase**: PostgreSQL database
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **dotenv**: Environment variables
- **cors**: Cross-origin resource sharing

## 📝 Notes

- JWT tokens expire after 1 hour (configurable in `.env`)
- Users can only access their own todos
- All passwords are hashed before storage
- Database uses UUID for primary keys
- Todos are automatically linked to authenticated user

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure `.env` file exists and contains valid `SUPABASE_URL` and `SUPABASE_KEY`

### Issue: "Token has expired"
**Solution**: Login again to get a new token

### Issue: "User with this email already exists"
**Solution**: Use a different email or login with existing credentials

### Issue: "Cannot connect to Supabase"
**Solution**: 
- Check your internet connection
- Verify Supabase credentials in `.env`
- Ensure Supabase project is active

### Issue: "Todo not found"
**Solution**: 
- Verify the todo ID is correct
- Check if you're using the correct user token
- Ensure the todo belongs to the authenticated user

## 📧 Support

If you encounter any issues, please:
1. Check the error message in the API response
2. Review the server console logs
3. Verify your Supabase database tables are set up correctly
4. Ensure all environment variables are configured

## 🎉 Submission Checklist

- ✅ Complete project structure
- ✅ User authentication (signup/login)
- ✅ JWT authorization middleware
- ✅ Protected TODO routes
- ✅ User-specific data access
- ✅ Supabase integration
- ✅ Environment variables
- ✅ README.md with setup instructions
- ✅ API documentation
- ✅ .env.example file
- ✅ .gitignore configured

---

**Happy Coding! 🚀**
