# FasoHabita - Real Estate Platform

## Overview

FasoHabita is a professional real estate marketplace platform for Burkina Faso, enabling users to list, browse, and manage property listings for rent and sale. The tagline is "Votre maison, à portée de clic" (Your home, at the click of a button). The application is bilingual with French as the primary language for the UI content.

The platform supports three user roles: property owners/agencies publish listings with photos, visitors browse and filter properties, and authenticated users manage their listings through a personal dashboard. Property types include villas, apartments, houses, shared courtyards (cour commune), offices, and shops.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled with Vite
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, custom design tokens for a warm/professional color palette (dark blue, forest green, beige, white)
- **Forms**: react-hook-form with Zod validation via @hookform/resolvers
- **Animations**: Framer Motion for page transitions and hover effects
- **File Uploads**: Uppy with AWS S3 presigned URL flow
- **Fonts**: DM Sans (body) and Playfair Display (display/headings)

Path aliases:
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets` → `./attached_assets/`

### Backend Architecture
- **Framework**: Express.js with TypeScript, running on Node.js
- **Runtime**: tsx for development, esbuild for production builds
- **API Pattern**: RESTful JSON API under `/api/*` prefix
- **Authentication**: Replit Auth via OpenID Connect (OIDC) with Passport.js, session-based with PostgreSQL session store (connect-pg-simple)
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **File Storage**: Google Cloud Storage via Replit Object Storage integration with presigned URL upload pattern
- **Build**: Custom build script (`script/build.ts`) that uses Vite for client and esbuild for server, outputting to `dist/`

### Database Schema (PostgreSQL via Drizzle)
- **users** - User accounts (id, email, firstName, lastName, profileImageUrl, timestamps). Required for Replit Auth.
- **sessions** - Session storage table. Required for Replit Auth.
- **listings** - Property listings (title, description, type [location/vente], category [villa/appartement/maison/cour_commune/bureau/magasin], price, currency, city, district, bedrooms, bathrooms, area, amenities as JSONB, status [disponible/loué/vendu], ownerId FK to users)
- **listing_images** - Images for listings (listingId, url, isMain flag)

Schema is defined in `shared/schema.ts` with relations. Migrations go to `./migrations/`. Use `npm run db:push` to push schema changes.

### API Routes
- `GET /api/listings` - Public listing search with filters (search, type, category, city, district, price range, bedrooms)
- `GET /api/listings/:id` - Get single listing details
- `POST /api/listings` - Create listing (authenticated)
- `PUT /api/listings/:id` - Update listing (authenticated, owner only)
- `DELETE /api/listings/:id` - Delete listing (authenticated, owner only)
- `GET /api/listings/my` - Get current user's listings (authenticated)
- `GET /api/auth/user` - Get current authenticated user
- `POST /api/uploads/request-url` - Get presigned URL for file upload

Route definitions are shared between client and server via `shared/routes.ts`.

### Key Pages
- `/` - Home page with hero, search bar, featured listings
- `/explore` - Browse/filter all listings
- `/listings/:id` - Individual listing details
- `/dashboard` - User's listing management (authenticated)
- `/create-listing` - Create new listing form (authenticated)
- `/edit-listing/:id` - Edit existing listing (authenticated)

### Development vs Production
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Static files served from `dist/public`, server bundled to `dist/index.cjs`

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Used for all data storage including sessions.
- **Replit Auth (OIDC)**: Authentication provider using OpenID Connect. Requires `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables.
- **Replit Object Storage**: File storage for listing images via Google Cloud Storage client library. Uses presigned URL upload pattern through a local sidecar at `http://127.0.0.1:1106`. Configured via `PUBLIC_OBJECT_SEARCH_PATHS` environment variable.
- **Unsplash**: External image URLs used as placeholder/seed images for listings.
- **Google Fonts**: DM Sans and Playfair Display loaded externally.