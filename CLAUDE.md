# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Tech Stack

- **Framework:** Next.js 15 (App Router) with Turbopack
- **Database/Auth:** Supabase with SSR
- **Styling:** Tailwind CSS + Radix UI primitives
- **AI:** OpenAI/DeepSeek via Vercel AI SDK
- **Payments:** MercadoPago SDK
- **Data Parsing:** Cheerio + PapaParse

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - Route groups: `(coleccion)` for product browsing sections
  - `api/` - API routes (chat, mercadopago)
- `components/` - Organized by feature
  - `ui/` - Base Radix UI components with Tailwind
  - `header/`, `hero/`, `shared/`, `vehiculo/` - Feature components
- `lib/` - Server actions (`actions.ts`) and utilities
- `types/` - TypeScript interfaces (`interface.ts`)
- `utils/supabase/` - Supabase client configuration
- `hooks/` - React hooks (`usePriceCalculation.ts`, `useDebounce.ts`)

### Supabase Tables

- `wps-31-01-2025` - Main product catalog
- `productos` - Used/alternative products

### Key Utilities

- `lib/utils.ts` - `cn()` function (clsx + tailwind-merge)
- `lib/actions.ts` - Server actions for data fetching (CSV, JSON, Supabase)
- `hooks/usePriceCalculation.ts` - Price calculation with USD/ARS conversion

### API Routes

- `POST /api/chat` - AI product description generator (OpenAI GPT-3.5)
- `POST /api/mercadopago` - Create payment preferences

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
DEEPSEEK_API_KEY=
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_DOLAR_BLUE=1650
NEXT_PUBLIC_SHIPPING_RATE=12
```

## Component Pattern

Use Radix UI primitives in `components/ui/` with Tailwind classes. Merge classes with `cn()` utility. Server actions go in `lib/actions.ts`. Types defined in `types/interface.ts`.

## Clerk Authentication (Coming Soon)

When implementing Clerk authentication, follow these **mandatory** guidelines:

### Correct App Router Pattern

```bash
# Install
npm install @clerk/nextjs@latest
```

```typescript
// proxy.ts (root)
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

```typescript
// app/layout.tsx
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

// Wrap entire layout with ClerkProvider
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### ALWAYS

- Use `clerkMiddleware()` from `@clerk/nextjs/server`
- Wrap app with `<ClerkProvider>` in `app/layout.tsx`
- Import from `@clerk/nextjs` (components) and `@clerk/nextjs/server` (middleware)
- Use async/await for server-side auth functions

### NEVER

- Reference `_app.tsx` or pages router approach
- Use `authMiddleware()` (deprecated, replaced by `clerkMiddleware()`)
- Create files under `pages/` directory
- Import deprecated APIs like `withAuth` or `currentUser` from old versions
