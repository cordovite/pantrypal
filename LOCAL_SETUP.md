# Running PantryPal in VS Code

## Quick Setup Guide

### 1. Database Setup (Choose One Option)

**Option A: Free Online Database (Recommended)**
1. Go to https://neon.tech and create a free account
2. Create a new project/database
3. Copy the connection string (looks like: `postgresql://username:password@host/database`)

**Option B: Local PostgreSQL**
1. Install PostgreSQL on your computer
2. Create a new database: `createdb pantrypal`
3. Your connection string: `postgresql://postgres:yourpassword@localhost:5432/pantrypal`

### 2. Create Environment File
Create a `.env` file in the project root:

```
DATABASE_URL=your_postgresql_connection_string_here
SESSION_SECRET=your-secret-key-here-make-it-long-and-random
NODE_ENV=development
```

### 3. Initialize Database
Run the database setup script:
```bash
# If using online database, connect with their CLI tool or web interface
# If using local PostgreSQL:
psql -d pantrypal -f database_setup.sql
```

### 4. Install and Run
```bash
npm install
npm run db:push
npm run dev
```

## Authentication Note
The current project uses Replit Auth which won't work locally. You'll need to:
1. Comment out auth middleware temporarily, OR
2. Replace with a different auth system (Auth0, Firebase, etc.)

## Troubleshooting

**Database Connection Issues:**
- Verify your DATABASE_URL is correct
- Check if your database service is running
- Ensure firewall/network access is allowed

**Missing Dependencies:**
- Delete `node_modules` and run `npm install` again
- Check Node.js version (requires Node 18+)

**Port Issues:**
- The app runs on port 5000 by default
- Change in `server/index.ts` if needed