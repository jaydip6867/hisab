# Expense & Income Tracker API

A Node.js + Express + MongoDB API to track expenses and incomes, with categories, CRUD endpoints, validation, and summary stats.

## Features

- Create, read, update, delete Transactions (income/expense)
- Create, read, update, delete Categories
- Request validation using Joi
- Centralized error handling
- MongoDB connection via Mongoose
- Stats: totals, balance, per-category sums, monthly trends

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- Joi for validation
- Morgan for HTTP logging
- CORS enabled

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment

- Copy `.env.example` to `.env` and set values.

```bash
cp .env.example .env
```

3. Run the server (dev)

```bash
npm run dev
```

4. Production

```bash
npm start
```

## Environment Variables

- `PORT`: HTTP port (default 4000)
- `MONGODB_URI`: MongoDB connection string

## API Overview

Base URL: `http://localhost:4000/api`

- `GET /health` — service status

### Categories
- `GET /categories` — list
- `POST /categories` — create
- `GET /categories/:id` — get
- `PUT /categories/:id` — update
- `DELETE /categories/:id` — delete

### Transactions
- `GET /transactions` — list with pagination and filters
  - Query: `page`, `limit`, `type` (income|expense), `categoryId`, `from`, `to`
- `POST /transactions` — create
- `GET /transactions/:id` — get
- `PUT /transactions/:id` — update
- `DELETE /transactions/:id` — delete

### Stats
- `GET /stats/summary` — totals, balance, per-category totals, monthly trend
  - Query: optional `from`, `to` date filters

## Folder Structure

```
src
├─ server.js          # bootstrap
├─ app.js             # express app
├─ config/db.js       # mongoose connect
├─ middlewares/
│  ├─ errorHandler.js
│  └─ validate.js
├─ models/
│  └─ Transaction.js
├─ controllers/
│  └─ transaction.controller.js
├─ routes/
│  ├─ index.js
│  └─ transaction.routes.js
└─ validators/
   └─ transaction.schema.js
```

## Notes

- No authentication included. Add auth (JWT) later if needed.
- Ensure MongoDB is running and accessible via `MONGODB_URI`.
