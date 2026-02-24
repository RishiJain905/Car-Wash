# AGENTS.md - Development Guidelines for Car-Wash Project

## Project Overview

This is a **Next.js 16** (App Router) + **React 19** + **TypeScript** frontend project for a car detailing business. All code lives in the `frontend/` directory.

---

## Build, Lint, and Test Commands

### Working Directory
All commands should run from the `frontend/` directory:
```bash
cd frontend
```

### Development
```bash
npm run dev     # Start Next.js dev server at http://localhost:3000
```

### Build
```bash
npm run build   # Production build
npm run start   # Start production server
```

### Linting
```bash
npm run lint    # Run ESLint on all files
```

### Testing
This project currently has **no test setup** (no Jest, Vitest, or Playwright installed). When adding tests:

```bash
# Install a test framework first, e.g., Vitest:
npm install -D vitest @vitejs/plugin-react

# Run all tests:
npm test

# Run a single test file:
npx vitest run src/components/Navbar.test.tsx

# Or with a specific test pattern:
npx vitest run -t "test name pattern"
```

---

## Code Style Guidelines

### General Principles

- Use **TypeScript** with strict mode enabled (`strict: true` in tsconfig.json)
- Prefer **functional components** with hooks over class components
- Keep components small and focused on a single responsibility
- Use the App Router (`src/app/`) for all pages and API routes

### Imports

- Use **path aliases**: `@/*` maps to `./src/*`
  ```typescript
  import { Navbar } from "@/components/Navbar";
  import styles from "@/app/page.module.css";
  ```
- **Order imports** (ESLint enforces this):
  1. React/Next imports
  2. External libraries
  3. Path aliases (`@/`)
  4. Relative imports (`../`, `./`)
- Group imports logically; use empty lines between groups

### Formatting

- **2 spaces** for indentation (no tabs)
- **Single quotes** for strings in JS/JSX
- **Trailing commas** in multi-line objects/arrays
- **No semicolons** at end of statements
- Use **Prettier** for formatting (add to project if needed):
  ```bash
  npm install -D prettier
  npx prettier --write .
  ```

### TypeScript

- **Always** define return types for functions:
  ```typescript
  function getData(): Promise<Data> { ... }
  ```
- Use **explicit types** over `any`. If `any` is unavoidable, use `unknown` first
- Use **interfaces** for object shapes, **types** for unions/intersections
- Enable `strict: true` in tsconfig.json (already enabled)

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `Navbar.tsx`, `BookingForm.tsx` |
| Functions | camelCase | `handleSubmit()`, `getAvailability()` |
| Variables | camelCase | `isLoading`, `bookingData` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `API_BASE_URL` |
| Files (utils) | kebab-case | `date-utils.ts`, `validation.ts` |
| CSS Classes | kebab-case (Tailwind) | `bg-primary`, `text-center` |

### Component Structure

Follow this order in component files:
1. Imports
2. Type definitions (if component-specific)
3. Component function
4. Helper functions (if component-specific)

```typescript
// Good component structure:
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  title: string;
  onSubmit: () => void;
}

export function MyComponent({ title, onSubmit }: Props) {
  const [state, setState] = useState("");

  useEffect(() => { ... }, []);

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}
```

### Server vs Client Components

- **Server Components** (default): Use for fetching data, SEO-critical content
- **Client Components**: Add `"use client"` at the top when using:
  - `useState`, `useEffect`, `useRef`
  - Event handlers (`onClick`, `onChange`)
  - Browser-only APIs
  - Third-party components using hooks

### Error Handling

- Use **try/catch** for async operations with proper error states
- Display user-friendly error messages in UI
- Log errors server-side (use `console.error` for now):
  ```typescript
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
  ```

### Tailwind CSS

- Use **utility classes** for all styling (Tailwind v4)
- Use **dark mode** classes: `dark:bg-background-dark`
- Use **CSS variables** from `globals.css` for theme colors:
  - `bg-primary`, `bg-background-light`, `text-primary`
  - Use the design tokens defined in the project
- Keep class names organized; use Prettier to sort

### API Routes

- Use **Route Handlers** in `src/app/api/`:
  ```typescript
  // src/app/api/bookings/route.ts
  import { NextResponse } from "next/server";

  export async function GET() {
    const data = await fetchBookings();
    return NextResponse.json(data);
  }

  export async function POST(request: Request) {
    const body = await request.json();
    // ... validation and processing
  }
  ```
- Validate request bodies with **Zod** (install if needed: `npm install zod`)
- Return appropriate HTTP status codes:
  - `200` - Success
  - `201` - Created
  - `400` - Bad Request
  - `401` - Unauthorized
  - `404` - Not Found
  - `409` - Conflict
  - `500` - Server Error

### Environment Variables

- Store secrets in `.env.local` (already in `.gitignore`)
- Use `NEXT_PUBLIC_` prefix for client-side accessible variables
- Never commit secrets to version control

---

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/         # API Route Handlers
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable React components
│   └── styles/          # Global styles
├── public/              # Static assets
├── eslint.config.mjs    # ESLint config (Next.js + TypeScript)
├── tsconfig.json        # TypeScript config (strict mode)
├── tailwind.config.*    # Tailwind configuration
└── package.json         # Dependencies
```

---

## Future Considerations

- Add **Vitest** or **Jest** for unit testing
- Add **Playwright** for E2E testing
- Add **Prettier** for consistent formatting
- Consider adding **React Query** or **SWR** for data fetching
- Set up **Husky** pre-commit hooks for lint/typecheck
