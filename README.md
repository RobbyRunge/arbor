# Arbor — Personal Finance Manager

Arbor is a full-stack personal finance application built as a showcase project. It lets users track transactions, manage budgets, monitor account balances, and export financial reports.

---

## Screenshots

> Coming soon.

---

## Features

### Implemented

- User registration & login with JWT authentication
- Email verification on registration (token-based, via email)
- Password reset via email (request + confirm flow)
- Logout with token invalidation
- Custom user model (email-based login)
- Default categories created automatically on registration
- Account management with automatic balance recalculation
- Full CRUD for transactions, accounts, categories, and budgets
- Budget limit warnings via notifications
- Dashboard with charts (income vs. expenses bar chart, expenses by category donut chart)
- Transactions page with filters (month, type, search) grouped by calendar week
- Budget progress bars with warning and over-budget states
- Accounts, Categories, Notifications pages
- Settings with profile management
- Animated splash screen on first load
- Responsive auth pages with animated panel transitions (Framer Motion)
- Legal notice and privacy policy pages
- Inactivity detection (auto-logout)

### Planned

- PDF & CSV export (Celery + ReportLab/WeasyPrint)
- CSV import for transactions
- Dark / Light mode
- CI/CD with GitHub Actions
- Deployment
- Error tracking with Sentry

---

## Tech Stack

### Backend

| Technology            | Version |
| --------------------- | ------- |
| Python                | 3.12+   |
| Django                | 6.0.3   |
| Django REST Framework | 3.17.0  |
| SimpleJWT             | 5.5.1   |
| Celery                | 5.6.2   |
| PostgreSQL (psycopg2) | 2.9.11  |
| Redis                 | 7.x     |
| python-dotenv         | 1.2.2   |

### Frontend

| Technology       | Version |
| ---------------- | ------- |
| React            | 19      |
| TypeScript       | 5.9     |
| Vite             | 8       |
| Tailwind CSS     | 4       |
| Framer Motion    | 12      |
| Zustand          | 5       |
| TanStack Query   | 5       |
| Recharts         | 3       |
| React Router DOM | 7       |
| React Hook Form  | 7       |
| Zod              | 4       |
| Axios            | 1       |
| Lucide React     | 1       |

### Infrastructure

- PostgreSQL & Redis via Podman / Docker Compose
- Vite dev proxy for local API forwarding

---

## Project Structure

```
arbor/
├── backend/
│   ├── apps/
│   │   ├── users/          # Custom user model, auth endpoints, email templates
│   │   ├── accounts/       # Account management
│   │   ├── categories/     # Transaction categories
│   │   ├── transactions/   # Income & expense transactions
│   │   ├── budgets/        # Monthly budgets
│   │   └── notifications/  # Budget warnings
│   ├── config/             # Django settings, URLs, WSGI
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API functions
│   │   ├── components/     # Reusable UI components (auth, layout, modals)
│   │   ├── context/        # React context (e.g. page transitions)
│   │   ├── hooks/          # Custom hooks (e.g. inactivity detection)
│   │   ├── pages/          # Page-level components
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml      # PostgreSQL & Redis
```

---

## Local Setup

### Prerequisites

- Python 3.12+
- Node.js 20+
- Podman or Docker with Compose

### 1. Start PostgreSQL & Redis

```bash
podman-compose up -d
# or
docker compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` (see `.env.example`):

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=arbor
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://localhost:6379/0

FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Email — console backend for local dev (prints to terminal)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@arbor.app

# Email — SMTP (uncomment for real email delivery)
# EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your@email.com
# EMAIL_HOST_PASSWORD=your-password
```

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies all `/api` requests to the Django backend at `http://localhost:8000`.

### 4. Celery Worker (optional)

```bash
cd backend
source .venv/bin/activate
celery -A config worker -l info
```

---

## API Overview

| Method         | Endpoint                                    | Description                       |
| -------------- | ------------------------------------------- | --------------------------------- |
| POST           | `/api/auth/register/`                       | Register a new user               |
| POST           | `/api/auth/login/`                          | Login → returns JWT tokens        |
| POST           | `/api/auth/token/refresh/`                  | Refresh access token              |
| POST           | `/api/auth/logout/`                         | Logout (blacklist refresh token)  |
| GET/PATCH      | `/api/auth/me/`                             | Get or update user profile        |
| POST           | `/api/auth/change-password/`                | Change password                   |
| POST           | `/api/auth/password-reset/`                 | Request password reset email      |
| POST           | `/api/auth/password-reset/confirm/`         | Confirm password reset with token |
| GET            | `/api/auth/verify-email/<uidb64>/<token>/`  | Verify email address              |
| GET/POST       | `/api/accounts/`                            | List or create accounts           |
| GET/PUT/DELETE | `/api/accounts/<id>/`                       | Manage a specific account         |
| GET/POST       | `/api/categories/`                          | List or create categories         |
| GET/POST       | `/api/transactions/`                        | List or create transactions       |
| GET/POST       | `/api/budgets/`                             | List or create budgets            |
| GET            | `/api/notifications/`                       | List notifications                |

---

## Status

Last updated: May 2026

---

## License

© 2026 Robby Runge. All rights reserved.

This source code is made publicly available for portfolio and demonstration purposes only.
See [LICENSE](LICENSE) for details.
