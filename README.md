# 💰 Smart Ledger

A modern, full-stack **Account Manager & Expense Tracker** built with React, Vite, Tailwind CSS, shadcn/ui, and Supabase.

![Smart Ledger Preview](https://via.placeholder.com/1200x600/6366f1/ffffff?text=Smart+Ledger)

## ✨ Features

- 🔐 **Authentication** — Signup, Login, Logout via Supabase Auth
- 📊 **Dashboard** — Balance, Income, Expense cards with animated counters
- 💸 **Transactions** — Add, Edit, Delete with category system
- 🔍 **Search & Filter** — By type, category, date range, and keyword
- 📈 **Analytics** — Pie chart, Bar chart, spending breakdown
- 📄 **Export** — Download PDF reports and CSV files
- 🌙 **Dark/Light Mode** — System-aware theme toggle
- 📱 **Responsive** — Mobile-first design
- ⚡ **Animations** — Framer Motion throughout

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (Auth + PostgreSQL) |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| PDF Export | jsPDF + jsPDF-AutoTable |
| Deployment | Vercel |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://npmjs.com/) or [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com/) account (free tier works)

---

### 1. Install Dependencies

```bash
cd "Smart Ledger"
npm install
```

---

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **SQL Editor** in the left sidebar
3. Copy the contents of `supabase/schema.sql` and run it
4. Go to **Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

---

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Never commit `.env` to version control. It's already in `.gitignore`.

---

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
smart-ledger/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── ExpensePieChart.jsx
│   │   │   └── MonthlyBarChart.jsx
│   │   ├── dashboard/
│   │   │   ├── RecentTransactions.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── transactions/
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionRow.jsx
│   │   ├── ui/                    # shadcn/ui components
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAnimatedCounter.js
│   │   └── useTransactions.js
│   ├── lib/
│   │   ├── supabase.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── AnalyticsPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── TransactionsPage.jsx
│   ├── services/
│   │   └── transactionService.js
│   ├── utils/
│   │   ├── categories.js
│   │   └── exportUtils.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/
│   └── schema.sql
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 🗄 Database Schema

### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | References auth.users |
| full_name | TEXT | User's display name |
| email | TEXT | User's email |
| avatar_url | TEXT | Profile picture URL |
| currency | TEXT | Preferred currency (default: USD) |

### `transactions`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| type | TEXT | 'income' or 'expense' |
| title | TEXT | Transaction name |
| amount | DECIMAL | Transaction amount |
| category | TEXT | Category ID |
| date | DATE | Transaction date |
| notes | TEXT | Optional notes |
| created_at | TIMESTAMPTZ | Auto-set |

---

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**

> The `vercel.json` file is already configured for SPA routing.

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🎨 Categories

| Category | Type |
|----------|------|
| 🍽 Food & Dining | Expense |
| 🛍 Shopping | Expense |
| ⚡ Bills & Utilities | Expense |
| 💼 Salary | Income |
| ✈️ Travel | Both |
| 🏠 Housing | Expense |
| 🚗 Transport | Expense |
| ❤️ Health | Expense |
| 🎓 Education | Expense |
| 🎮 Entertainment | Expense |
| 📈 Investment | Income |
| ⚙️ Other | Both |

---

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Environment variables for sensitive credentials
- Supabase handles authentication securely

---

## 📝 License

MIT License — free to use for personal and commercial projects.

---

Built with ❤️ using React + Supabase
