# Skipense — Business Expense Tracker

A production-quality expense tracker built with **React (Vite) + Tailwind CSS + Supabase**.  
Track expenses, visualise spending by category, and manage your team's finances from a clean dashboard.

---

## 🔑 Quick Demo Credentials

For testing and reviewing the live demo application, feel free to use these credentials:

- **Email:** `skittex@gmail.com`
- **Password:** `testing123`

---

## Stack

| Layer      | Technology                         |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite                     |
| Styling    | Tailwind CSS (Manrope font)         |
| Backend    | Supabase (Postgres + Auth + RLS)    |
| Charts     | Recharts                            |
| Icons      | lucide-react                        |
| Routing    | React Router DOM v6                 |
| Deployment | Vercel                              |

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd skipense
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these values:**  
Supabase Dashboard → Your project → Settings → API → Project URL + anon/public key.

### 3. Run the dev server

```bash
npm run dev
```

Navigate to `http://localhost:5173`.

---

## Supabase Setup Recap

### Table

Run this SQL in the Supabase SQL Editor (Dashboard → SQL Editor):

```sql
create table public.expenses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  amount      numeric(12,2) not null check (amount > 0),
  date        date not null,
  category    text not null,
  description text,
  created_at  timestamptz default now() not null
);

create index idx_expenses_user_date
  on public.expenses(user_id, date desc);
create index idx_expenses_user_category
  on public.expenses(user_id, category);
```

### Row Level Security (RLS)

```sql
alter table public.expenses enable row level security;

create policy "Users can view own expenses"
  on public.expenses for select using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert with check (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update using (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete using (auth.uid() = user_id);
```

### Auth Configuration

In your Supabase Dashboard:  
**Authentication → Providers → Email** → **Confirm email: OFF**  
This enables instant signup for demo purposes (no email verification step).

---

## How RLS Protects Your Data

The anon key is safe to expose in client-side JS because Postgres RLS policies enforce access control at the database level — not the application level.

Every query includes the user's JWT, which Postgres decodes to get `auth.uid()`.  
The policy `USING (auth.uid() = user_id)` silently filters every query to only return rows belonging to the current user.  
Even if someone stole the anon key, they could only access data for their own authenticated session.

---

## Vercel Deployment

1. Push your code to GitHub (`.env.local` is gitignored — never commits).
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. In the Vercel project settings → **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Click **Deploy**. Vercel detects Vite automatically.

> **Important:** Add your Vercel deployment URL to Supabase → Authentication → URL Configuration → Site URL and Redirect URLs.

---

## How to Test

### Basic flow

1. Visit `/signup` → create a user (e.g., `alice@test.com`)
2. You're redirected to `/app`
3. Add a few expenses: different categories, amounts, dates
4. Verify they appear in the list and update the charts
5. Filter by category → list narrows, count updates live
6. Click Edit → form populates → update → list refreshes instantly (optimistic UI)
7. Click Delete → confirm dialog → row removed instantly
8. Log out

### RLS verification (two-user test)

This confirms that RLS is working — a user can never see another user's data.

1. Sign up as `alice@test.com` → add 3 expenses → log out
2. Sign up as `bob@test.com` → **expense list is empty**
3. Bob adds his own expenses → he only sees his own
4. Log in as Alice again → she only sees her original 3

If Alice can see Bob's expenses (or vice versa), your RLS policies are not enabled.  
Go to Supabase → Table Editor → `expenses` → RLS → verify all 4 policies are active.

---

## Folder Structure

```
src/
  components/
    TopBar.jsx        # Dashboard sticky header
    Navbar.jsx        # Landing page nav
    Footer.jsx        # Landing page footer
    ExpenseForm.jsx   # Add + Edit form (dual mode)
    ExpenseList.jsx   # Table (desktop) + cards (mobile)
    Filters.jsx       # Category + date range filter
    Charts.jsx        # Pie + bar charts (Recharts)
    EmptyState.jsx    # Empty list illustration
    Skeleton.jsx      # Loading shimmer rows
  hooks/
    useAuth.js        # Auth state + signIn/signUp/signOut
    useExpenses.js    # CRUD + filter + totals
  lib/
    supabase.js       # Supabase client singleton (SUPABASE 101)
    helpers.js        # formatCurrency, formatDate, getCategoryStyle
  pages/
    Landing.jsx       # Public marketing page
    Login.jsx         # Auth — sign in
    Signup.jsx        # Auth — create account
    Dashboard.jsx     # Protected — main app
  App.jsx             # Routes + ProtectedRoute
  main.jsx            # Entry point
  index.css           # Tailwind + animations
```

---

## Design System

| Token              | Value                                |
|--------------------|--------------------------------------|
| `skipense-dark`    | `#1B3530` — primary dark green       |
| `skipense-lime`    | `#C7F269` — accent (used sparingly)  |
| `skipense-ink`     | `#112320` — near-black text          |
| `skipense-mist`    | `#ECECEC` — soft backgrounds         |
| `Font`             | Manrope 400 / 500 / 700              |
| Shadow `soft`      | `0 2px 8px rgba(0,0,0,0.04)`         |
| Shadow `card`      | `0 4px 20px rgba(17,35,32,0.06)`     |
