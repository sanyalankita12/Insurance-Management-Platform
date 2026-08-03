# Insurance Management Platform

A full-stack web application for managing insurance operations — customers, policies, premiums, claims, documents, and business reports — built with role-based access for Administrators, Insurance Agents, and Customers.

## Tech Stack

**Frontend:** 
- React.js (Vite),
- Tailwind CSS, 
- React Router,
- Chart.js,
- Axios

**Backend:**
- Node.js,
- Express.js

**Database:**
- PostgreSQL with Prisma ORM

**Authentication:**
- JWT + bcrypt

**File Uploads:** 

- Multer

## Features

- **Authentication & Role-Based Access** — Register/Login with JWT; separate experiences for Admin, Agent, and Customer roles
- **Customer Management** — Register, view, search, and manage customer records
- **Policy Management** — Create, view, renew (edit), and cancel insurance policies, linked to customers
- **Premium Tracking** — Record and track premium payments, with overdue payment highlighting
- **Claim Management** — Submit claims, verify, approve/reject, and track claim history
- **Document Management** — Upload, view, and download customer documents
- **Reports Dashboard** — Visual summary of active/expired policies, claim statistics, and premium collection (Admin only)
- **Search, Filters & Pagination** — Across Customer, Policy, and Claim listings
- **Validation & Error Handling** — Required-field checks, format validation, and clear error messages throughout

## User Roles

| Role | Access |
|---|---|
| **Administrator** | Full access to all modules, including Reports Dashboard |
| **Insurance Agent** | Customer, Policy, Premium, Claim, and Document modules |
| **Customer** | Personal dashboard showing their own policies and claims |

## Project Structure

```
Insurance Management Platform/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── pages/        # Login, Register, Dashboard, Customers, Policies, etc.
│   │   ├── components/   # Shared components (Navbar)
│   │   └── api.js        # Axios instance with JWT auto-attach
│   └── ...
├── server/               # Express backend
│   ├── routes/           # authRoutes, customerRoutes, policyRoutes, etc.
│   ├── middleware/        # authMiddleware (JWT verification, role authorization)
│   ├── prisma/           # schema.prisma, migrations
│   ├── uploads/          # Uploaded documents (gitignored)
│   └── server.js
└── README.md
```

## Database Schema (Prisma models)

- **User** — id, name, email, password (hashed), role
- **Customer** — id, name, dob, phone, address, email
- **Policy** — id, customerId, policyType, policyNumber, premiumAmount, startDate, endDate, status
- **Premium** — id, policyId, paymentDate, amount, paymentStatus
- **Claim** — id, policyId, claimAmount, reason, status, submissionDate
- **Document** — id, customerId, fileName, filePath, uploadedAt

## Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with:
```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/insurance_platform"
JWT_SECRET=your_secret_key_here
PORT=5000
```

Run migrations and start the server:
```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get current logged-in user's profile |
| GET/POST/PUT/DELETE | `/api/customers` | Customer CRUD |
| GET/POST/PUT/DELETE | `/api/policies` | Policy CRUD |
| GET/POST/PUT/DELETE | `/api/premiums` | Premium CRUD |
| GET/POST/PUT/DELETE | `/api/claims` | Claim CRUD |
| GET/POST/DELETE | `/api/documents` | Document upload/list/delete |
| GET | `/api/reports/summary` | Aggregated business reports (Admin only) |

All routes (except register/login) require a `Bearer <token>` in the Authorization header.

## Author

Ankita Sanyal 