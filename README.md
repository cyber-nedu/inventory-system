# KYYP

KYYP is a transportation management platform designed to help transportation businesses manage their operations and teams from one centralized system.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Git & GitHub

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root of the project.

Add the required Supabase variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit `.env.local` or any credentials to the repository.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically update when changes are made.

## Running the Project

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

## Git Workflow

Create a feature branch before working on a feature:

```bash
git checkout -b feature/your-feature-name
```

After making changes:

```bash
git add .
git commit -m "Describe your changes"
```

Push the branch:

```bash
git push origin feature/your-feature-name
```

Avoid pushing directly to `main` unless specifically agreed by the team.

## Team Development

Before changing an existing feature:

1. Understand the current implementation.
2. Check the related database tables and relationships.
3. Check existing Supabase RLS policies.
4. Make the smallest required change.
5. Test the change locally.
6. Commit the changes clearly.

For database changes, communicate schema changes with the frontend implementation so both sides remain synchronized.