# Auth API

A RESTful authentication API built with Node.js, Express, and TypeScript. This project implements user registration and login with JWT-based authentication, following a clean layered architecture.

> **Disclaimer:** This project was built for **study and learning purposes only**. It is not intended for production use. The goal is to practice backend development concepts such as layered architecture, input validation, password hashing, JWT authentication, and database management with an ORM.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [License](#license)

---

## Tech Stack

| Category          | Technology                                                       |
| ----------------- | ---------------------------------------------------------------- |
| Runtime           | [Node.js](https://nodejs.org/) >= 20                             |
| Language          | [TypeScript](https://www.typescriptlang.org/) 5.9                |
| Framework         | [Express](https://expressjs.com/) 5.2                            |
| Database          | [PostgreSQL](https://www.postgresql.org/)                        |
| ORM               | [Prisma](https://www.prisma.io/) 7.3                             |
| Validation        | [Zod](https://zod.dev/) 4.3                                      |
| Authentication    | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 9.0   |
| Password Hashing  | [bcrypt](https://github.com/kelektiv/node.bcrypt.js) 6.0         |
| Security Headers  | [Helmet](https://helmetjs.github.io/) 8.1                        |
| Linting           | [ESLint](https://eslint.org/) 9.39                                |
| Formatting        | [Prettier](https://prettier.io/) 3.8                              |

---

## Architecture

The project follows a **layered architecture** with clear separation of concerns:

```
Request → Routes → Middleware (validation) → Controller → Service → Repository → Database
                                                  ↓
                                          Middleware (error handler) → Response
```

| Layer          | Responsibility                                    |
| -------------- | ------------------------------------------------- |
| **Routes**     | Define endpoints and attach validation middleware  |
| **Controllers**| Handle HTTP requests and responses                 |
| **Services**   | Contain business logic                             |
| **Repositories**| Data access through Prisma ORM                    |
| **Middlewares** | Cross-cutting concerns (validation, error handling)|
| **DTOs**       | Define data transfer shapes between layers         |
| **Exceptions** | Custom typed HTTP errors                           |
| **Validators** | Zod schemas for request validation                 |

---

## Database

### Engine

**PostgreSQL** — connected through Prisma ORM with the native `@prisma/adapter-pg` driver.

### Schema

The database currently contains a single table:

#### `User`

| Column             | Type       | Constraints                | Description                         |
| ------------------ | ---------- | -------------------------- | ----------------------------------- |
| `id`               | `String`   | PK, UUID v7, auto-generated | Unique user identifier             |
| `email`            | `String`   | Unique, required            | User email address                 |
| `password`         | `String`   | Required                    | Bcrypt-hashed password             |
| `resetToken`       | `String?`  | Optional                    | Password reset token (future use)  |
| `resetTokenExpiry` | `DateTime?`| Optional                    | Reset token expiration (future use)|
| `createdAt`        | `DateTime` | Auto-generated              | Record creation timestamp          |
| `updatedAt`        | `DateTime` | Auto-updated                | Record last update timestamp       |

### Prisma Schema Definition

```prisma
model User {
  id               String    @id @default(uuid(7))
  email            String    @unique
  password         String
  resetToken       String?
  resetTokenExpiry DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

---

## API Endpoints

Base URL: `/api`

### Health Check

```
GET /api/health
```

**Response** `200 OK`

```json
{
  "status": "OK",
  "timestamp": "2026-02-04T12:00:00.000Z"
}
```

---

### Register

```
POST /api/auth/register
```

Creates a new user account.

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "MySecurePass1!"
}
```

**Validation Rules**

| Field      | Rules                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------- |
| `email`    | Required, valid email format, automatically lowercased and trimmed                           |
| `password` | Required, minimum 8 characters, must contain: uppercase, lowercase, number, special character|

**Response** `201 Created`

```json
{
  "success": true,
  "message": "User created"
}
```

**Error** `409 Conflict` — user with the given email already exists

```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### Login

```
POST /api/auth/login
```

Authenticates a user and returns a JWT access token.

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "MySecurePass1!"
}
```

**Response** `200 OK`

```json
{
  "success": true,
  "data": {
    "tokenType": "Bearer",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2026-02-04T13:00:00.000Z"
  }
}
```

**Error** `401 Unauthorized` — email not found or password does not match

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Validation Error (applies to all endpoints)

**Error** `422 Unprocessable Entity`

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "body.email",
      "message": "Invalid email"
    },
    {
      "field": "body.password",
      "message": "String must contain at least 8 character(s)"
    }
  ]
}
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20 (a `.nvmrc` file is provided)
- [PostgreSQL](https://www.postgresql.org/) running locally or remotely
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/auth-api.git
   cd auth-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root (see [Environment Variables](#environment-variables) for details):

   ```bash
   cp .env.example .env
   # or create it manually
   ```

4. **Set up the database**

   Make sure PostgreSQL is running, then generate the Prisma client and run migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000` (or the port configured in `.env`).

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN_SECONDS=3600

# Bcrypt
BCRYPT_ROUNDS=10
```

| Variable                 | Required | Default | Description                                  |
| ------------------------ | -------- | ------- | -------------------------------------------- |
| `PORT`                   | No       | `3000`  | Port the server listens on                   |
| `NODE_ENV`               | No       | —       | Environment (`development` / `production`)   |
| `DATABASE_URL`           | Yes      | —       | PostgreSQL connection string                 |
| `JWT_SECRET`             | Yes      | —       | Secret key used to sign JWT tokens           |
| `JWT_EXPIRES_IN_SECONDS` | No       | `3600`  | Token expiration time in seconds (1 hour)    |
| `BCRYPT_ROUNDS`          | No       | `10`    | Number of salt rounds for password hashing   |

---

## Available Scripts

| Script                  | Command                   | Description                                        |
| ----------------------- | ------------------------- | -------------------------------------------------- |
| `npm run dev`           | `tsx watch src/server.ts` | Start dev server with hot reload                   |
| `npm run dev:debug`     | `tsx --inspect ...`       | Start dev server with Node.js debugger attached    |
| `npm run build`         | `tsc`                     | Compile TypeScript to JavaScript in `dist/`        |
| `npm start`             | `node dist/server.js`     | Run the compiled production build                  |
| `npm run format`        | `prettier --write .`      | Format all files with Prettier                     |
| `npm run format:check`  | `prettier --check .`      | Check if files are formatted                       |
| `npm run lint`          | `eslint .`                | Lint the codebase with ESLint                      |
| `npm run lint:fix`      | `eslint . --fix`          | Auto-fix linting issues                            |
| `npm run prisma:generate`| `prisma generate`        | Generate the Prisma client                         |
| `npm run prisma:migrate` | `prisma migrate dev`     | Run database migrations                            |
| `npm run prisma:studio`  | `prisma studio`          | Open Prisma Studio (database GUI)                  |

---

## Project Structure

```
auth-api/
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   └── migrations/                # Database migration files
├── generated/
│   └── prisma/                    # Auto-generated Prisma client
├── src/
│   ├── server.ts                  # Entry point — starts the HTTP server
│   ├── app.ts                     # Express app setup and middleware
│   ├── config/
│   │   └── database.ts            # Prisma client singleton
│   ├── routes/
│   │   └── api/
│   │       ├── index.ts           # API route aggregator
│   │       └── auth/
│   │           └── authRoutes.ts  # Auth endpoint definitions
│   ├── controllers/
│   │   └── AuthController.ts      # Handles auth HTTP requests
│   ├── services/
│   │   └── AuthService.ts         # Authentication business logic
│   ├── repositories/
│   │   └── UserRepository.ts      # User database operations
│   ├── middlewares/
│   │   ├── errorHandler.ts        # Global error handling middleware
│   │   └── validateRequest.ts     # Zod-based request validation
│   ├── validators/
│   │   └── authSchemas.ts         # Zod schemas for auth endpoints
│   ├── dtos/
│   │   ├── auth/
│   │   │   ├── RegisterDTO.ts     # Registration input shape
│   │   │   ├── LoginDTO.ts        # Login input shape
│   │   │   └── LoginResult.ts     # Login response shape
│   │   └── jwt/
│   │       └── GeneratedToken.ts  # Token generation result shape
│   ├── exceptions/
│   │   ├── HttpException.ts       # Base HTTP exception
│   │   ├── ConflictException.ts   # 409 Conflict
│   │   ├── UnauthorizedException.ts # 401 Unauthorized
│   │   └── auth/
│   │       ├── UserAlreadyExistsException.ts
│   │       └── InvalidCredentialsException.ts
│   └── utils/
│       ├── hash.ts                # Bcrypt hashing utilities
│       └── jwt.ts                 # JWT generation and verification
├── .env                           # Environment variables (git-ignored)
├── .nvmrc                         # Node.js version (20)
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.mts              # ESLint configuration
├── .prettierrc                    # Prettier configuration
└── package.json                   # Dependencies and scripts
```

---

## Error Handling

The API uses a custom exception hierarchy for consistent error responses:

```
Error
  └── HttpException (base)
        ├── ConflictException (409)
        │     └── UserAlreadyExistsException
        └── UnauthorizedException (401)
              └── InvalidCredentialsException
```

All errors are caught by a global error handler middleware that returns a consistent response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Unhandled errors return a `500 Internal Server Error` response.

---

## Security

The following security measures are in place:

- **Password hashing** — Passwords are hashed with bcrypt before being stored. The API also supports automatic rehashing when the configured salt rounds change.
- **JWT authentication** — Stateless token-based authentication with configurable expiration.
- **Helmet** — Sets various HTTP security headers automatically.
- **CORS** — Cross-Origin Resource Sharing middleware enabled.
- **Input validation** — All incoming requests are validated with Zod schemas before reaching the controller layer.
- **Environment variables** — Sensitive configuration is loaded from `.env` and excluded from version control.

---

## License

This project is for educational purposes only.
