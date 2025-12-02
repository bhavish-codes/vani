# Backend API

This is the backend for the Fullstack App 2.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT, Bcrypt

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   DATABASE_URL="mysql://root@localhost:3306/mydb"
   PORT=8080
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
