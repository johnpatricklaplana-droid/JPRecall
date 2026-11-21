# JPRecall

JPRecall is a web application for planning and managing study reviews. It gives learners one place to record a topic, choose a future review date, revisit due topics, and preserve completed knowledge in a long-term memory library.

The app is built for a practical review workflow rather than large-course management:

1. Log what you studied.
2. Choose 1 day, 3 days, 1 week, or a custom date for the next review.
3. Review active topics from a daily schedule.
4. Mark completed topics as reviewed.
5. Search and manage reviewed topics in long-term memory.
6. Return a topic to the review schedule when more practice is needed.

## Product pages

### Log Study

Create a topic and schedule its next review. The page validates the topic name and prevents past or invalid review dates.

### Review Schedule

Review active topics in one list, organized by:

- Today
- Overdue
- Upcoming

Each topic can be marked as reviewed or deleted.

### Long-Term Memory

Topics marked as reviewed appear in the memory library. The library supports:

- Real-time text search
- Storage counts
- A this-month reviewed count
- Deletion
- Returning a topic to review with a new schedule

### Account

Users can register or sign in with email and password, use Google OAuth, view profile data supplied by Supabase, and log out after confirmation.

## Built with

- React 19
- React Router 7
- TypeScript
- Vite
- Tailwind CSS 4
- Supabase Auth
- Supabase Postgres and Data API
- Lucide React

## How it works

```text
Browser
  |
  | React Router and protected routes
  v
Supabase Auth
  |
  | Authenticated Supabase client
  v
Postgres table: public.to_review
```

Review state is stored in `to_review.is_reviewed`:

| State | Behavior |
| --- | --- |
| `false` | Topic appears in the Review Schedule |
| `true` | Topic appears in Long-Term Memory |

Returning a topic to review updates the existing row with a new `scheduled_at` date and sets `is_reviewed` to `false`. It does not create a duplicate topic.

## Getting started

### Requirements

- Node.js compatible with Vite
- npm
- A Supabase project

### 1. Install dependencies

```bash
cd JP_Recall_App
npm install
```

### 2. Configure Supabase

Create a local environment file:

```dotenv
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These values are read by `src/lib/supbase.ts`.

Restart Vite after adding or changing environment variables.

### 3. Create the database table

JPRecall uses a `public.to_review` table.

A compatible schema is:

| Column | PostgreSQL type | Purpose |
| --- | --- | --- |
| `id` | `uuid` | Unique topic identifier |
| `name` | `text` | Topic name |
| `scheduled_at` | `date` | Next review date |
| `created_at` | `timestamptz` | Record creation time |
| `is_reviewed` | `boolean` | Whether the topic is in long-term memory |

The table should expose `id`, `name`, `scheduled_at`, `created_at`, and `is_reviewed` through the Supabase Data API.

> **Security note:** Before exposing the app to multiple users, add a `user_id` column referencing `auth.users(id)`, filter inserts and queries by the authenticated user, and enforce Row Level Security policies. The current application code authenticates users but its topic queries do not yet include a user ownership column.

### 4. Configure authentication redirects

In the Supabase dashboard, open **Authentication > URL Configuration** and allow:

```text
http://localhost:5173
http://localhost:5173/auth-callback
```

For production, replace the origin with the deployed application URL.

The app uses the `/auth-callback` route to exchange OAuth or email confirmation codes for a Supabase session.

### 5. Enable Google OAuth

Google sign-in is optional.

1. Enable Google in **Supabase Authentication > Providers**.
2. Create a Google OAuth client in Google Cloud Console.
3. Add the Google credentials to Supabase.
4. Add the Supabase callback URL to the Google OAuth client.
5. Add the local and production app URLs to Supabase redirect settings.

## Run the app

```bash
npm run dev
```

The default Vite URL is:

```text
http://localhost:5173
```

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Application structure

```text
src/
├── components/          Reusable navigation and scheduling UI
├── helpers/             Date and review-state utilities
├── lib/                 Supabase client configuration
├── pages/               Main study, review, and memory pages
├── services/           Authentication operations
└── types/               Shared TypeScript types
```

Main entry points:

- `src/App.tsx`: routes and authentication guards
- `src/LoginPage.tsx`: email and Google login
- `src/RegisterPage.tsx`: email and Google registration
- `src/AuthCallback.tsx`: Supabase auth callback handling
- `src/ProfilePage.tsx`: account data and logout confirmation
- `src/pages/LogStudy.tsx`: topic and review-date entry
- `src/pages/ReviewSched.tsx`: active review schedule
- `src/pages/LongTermMemo.tsx`: reviewed-topic library

## Current status

JPRecall includes:

- Working authentication flows
- Supabase-backed topic storage
- Active and reviewed topic states
- Date-based scheduling
- Responsive navigation
- Profile and logout handling
- Loading, empty, success, and error states

Areas that still need production hardening:

- Per-user topic ownership and Row Level Security
- Automated tests
- Review history with audit timestamps
- Editing existing topics
- Rescheduling active topics
- Deployment configuration and monitoring
