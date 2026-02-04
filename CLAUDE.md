# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Authentication REST API built with Express 5, TypeScript, Prisma, and PostgreSQL. Study/learning project — not intended for production.

## Commands

```bash
# Development
npm run dev              # Start dev server with hot reload (tsx watch)
npm run dev:debug        # Dev server with Node.js inspector

# Build & Run
npm run build            # Compile TypeScript to dist/
npm start                # Run compiled build (node dist/server.js)

# Database (PostgreSQL via Prisma)
npm run prisma:generate  # Generate Prisma client (required after schema changes)
npm run prisma:migrate   # Run migrations (prisma migrate dev)
npm run prisma:studio    # Open Prisma Studio GUI

# Code Quality
npm run lint             # ESLint (src/ only)
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier (src/ only)
npm run format:check     # Check formatting
```

No test framework is configured yet.

## Architecture

Layered architecture: **Routes → Middleware (validation) → Controller → Service → Repository → Database**

All API routes are mounted under `/api`. Route groups live in `src/routes/api/<domain>/` and are aggregated in `src/routes/api/index.ts`.

### Key patterns

- **Controllers** — class-based, arrow function methods (for `this` binding), receive DTOs via `DTO.fromRequest(req.body)`, forward errors with `next(error)`.
- **Services** — class-based, contain business logic, throw custom exceptions (never return error codes). Constructor accepts optional dependencies for injection, defaults to `new Dependency()`.
- **Repositories** — class-based, thin data-access wrappers around the Prisma client. Use Prisma's generated types (`Prisma.UserCreateInput`, etc.).
- **Validation** — Zod schemas in `src/validators/` wrapping `{ body, query, params }`. Applied as route-level middleware via `validateRequest(schema)`. Returns 422 with `{ field, message }` array.
- **DTOs** — input DTOs are classes with a static `fromRequest()` factory; output DTOs are plain interfaces.
- **Exceptions** — hierarchy extending `HttpException(statusCode, message, errors?)`. Domain exceptions live in `src/exceptions/<domain>/`. Caught by global `errorHandler` middleware.
- **Utilities** — static classes (`HashUtils`, `JwtUtils`) for cross-cutting concerns.
- **Database** — Prisma client singleton in `src/config/database.ts` using `@prisma/adapter-pg`. Generated client outputs to `generated/prisma/`. Global caching in development to survive hot reloads.

### Response format

All success responses: `{ success: true, message | data }`. All error responses: `{ success: false, message, errors? }`.

## Module System & TypeScript

ESM (`"type": "module"` in package.json). Module resolution is `NodeNext` — use `.js` extensions in relative imports. Strict mode enabled. Target ES2022.

## Code Style

- Prettier: single quotes, semicolons, 2-space indent, trailing commas (ES5), 100 char line width.
- ESLint: recommended + typescript-eslint recommended rules.
- File naming: PascalCase for classes/DTOs/exceptions (`AuthController.ts`), camelCase for everything else (`authRoutes.ts`, `errorHandler.ts`).
- Class naming suffixes: `Controller`, `Service`, `Repository`, `DTO`, `Exception`, `Utils`.

## Environment Variables

Required: `DATABASE_URL`, `JWT_SECRET`. Optional: `PORT` (default 3000), `NODE_ENV`, `JWT_EXPIRES_IN_SECONDS` (default 3600), `BCRYPT_ROUNDS` (default 10).

## Database

PostgreSQL with Prisma 7. Schema at `prisma/schema.prisma`. Single `User` model with UUID v7 primary key. Run `npm run prisma:generate` after any schema change, then `npm run prisma:migrate` to apply.
