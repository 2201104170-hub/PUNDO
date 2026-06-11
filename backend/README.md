# MoneyFlow Backend API

A TypeScript + Express + PostgreSQL backend for the MoneyFlow financial dashboard application.

## 🚀 Features

- **Authentication**: User registration and login with JWT tokens
- **Transaction Management**: Create, read, update, delete financial transactions
- **Debt Tracking**: Manage personal and business debts with interest rates
- **Financial Analytics**: Dashboard statistics and financial metrics
- **User Profiles**: User profile management and settings
- **Date Range Queries**: Filter transactions by date range
- **Type Safety**: Full TypeScript support with strict mode

## 📋 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript 5.3.3
- **Framework**: Express.js 4.18.2
- **Database**: PostgreSQL 8.11.3
- **Authentication**: JWT + bcryptjs
- **Build Tool**: tsx for development
- **Linter**: ESLint with TypeScript support

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Steps

1. **Clone and navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure PostgreSQL in .env**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=moneyflow_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key_change_this_in_production
   CLIENT_URL=http://localhost:3000
   ```

5. **Create PostgreSQL database**
   ```bash
   createdb moneyflow_db
   ```

6. **Run database migrations**
   ```bash
   npm run migrate
   ```

7. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Production Build
```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: { token, user }
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response: { user }
```

#### Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "avatar": "https://..."
}

Response: { message, user }
```

### Transaction Endpoints

#### Create Transaction
```
POST /transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-15T00:00:00Z",
  "description": "Salary",
  "amount": 5000,
  "category": "Income",
  "type": "income",
  "currency": "PHP"
}

Response: { message, transaction }
```

#### Get All Transactions
```
GET /transactions?limit=50&offset=0
Authorization: Bearer <token>

Response: { data: [], total }
```

#### Get Transaction by ID
```
GET /transactions/:id
Authorization: Bearer <token>

Response: { transaction }
```

#### Get Transactions by Date Range
```
GET /transactions/range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>

Response: { data: [], total }
```

#### Update Transaction
```
PUT /transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description",
  "amount": 5500
}

Response: { message, transaction }
```

#### Delete Transaction
```
DELETE /transactions/:id
Authorization: Bearer <token>

Response: { message }
```

### Debt Endpoints

#### Create Debt
```
POST /debts
Authorization: Bearer <token>
Content-Type: application/json

{
  "creditor": "Bank of America",
  "amount": 5000,
  "interestRate": 6.5,
  "dueDate": "2024-02-15T00:00:00Z",
  "type": "i_owe",
  "notes": "Auto loan"
}

Response: { message, debt }
```

#### Get All Debts
```
GET /debts
Authorization: Bearer <token>

Response: { data: [], total }
```

#### Get Active Debts
```
GET /debts/active
Authorization: Bearer <token>

Response: { data: [], total }
```

#### Get Debt by ID
```
GET /debts/:id
Authorization: Bearer <token>

Response: { debt }
```

#### Update Debt
```
PUT /debts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "paid",
  "amount": 4500
}

Response: { message, debt }
```

#### Delete Debt
```
DELETE /debts/:id
Authorization: Bearer <token>

Response: { message }
```

### Dashboard Endpoints

#### Get Dashboard Stats
```
GET /dashboard/stats
Authorization: Bearer <token>

Response: {
  metrics: {
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate,
    netFlow,
    totalDebt
  },
  recentTransactions: [],
  upcomingDebts: []
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── AuthController.ts    # Auth logic
│   │   └── DebtController.ts    # Debt & dashboard logic
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication & error handling
│   ├── models/
│   │   ├── User.ts              # User database operations
│   │   ├── Transaction.ts       # Transaction database operations
│   │   └── Debt.ts              # Debt database operations
│   ├── routes/
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── transactions.ts      # Transaction endpoints
│   │   ├── debts.ts             # Debt endpoints
│   │   └── dashboard.ts         # Dashboard endpoints
│   ├── scripts/
│   │   ├── migrate.ts           # Database migration script
│   │   └── seed.ts              # Sample data seeding
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── index.ts                 # Express app entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── .eslintrc.cjs
├── package.json
├── tsconfig.json
└── README.md
```

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, hashed)
- `name` (VARCHAR)
- `avatar` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Transactions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `date` (TIMESTAMP)
- `description` (VARCHAR)
- `amount` (DECIMAL)
- `category` (VARCHAR)
- `type` (income | expense)
- `status` (completed | pending | cancelled)
- `currency` (PHP | USD | EUR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Debts Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `creditor` (VARCHAR)
- `amount` (DECIMAL)
- `interest_rate` (DECIMAL)
- `due_date` (TIMESTAMP)
- `type` (i_owe | they_owe_me | loan)
- `status` (active | paid | overdue)
- `notes` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless token-based auth
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Request body validation
- **Error Handling**: Centralized error handling middleware
- **SQL Injection Prevention**: Parameterized queries

## 📝 Available Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production build
npm run type-check   # Check TypeScript types without emitting
npm run lint         # Run ESLint
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
```

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Add Transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-01-15T00:00:00Z","description":"Salary","amount":5000,"category":"Income","type":"income"}'
```

### Using Postman

Import the endpoints and test with the Authorization header set to Bearer token from login response.

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run npm run migrate
heroku run npm run seed
```

### Docker
Create a `Dockerfile` and `docker-compose.yml` for containerized deployment.

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify .env database credentials
- Ensure database `moneyflow_db` exists

### JWT Token Invalid
- Verify JWT_SECRET in .env is consistent
- Check token hasn't expired
- Ensure Authorization header format: `Bearer <token>`

### Migration Fails
- Drop existing tables: `DROP TABLE IF EXISTS debts, transactions, users CASCADE;`
- Re-run migration: `npm run migrate`

## 📞 Support

For issues or questions, check the frontend README or create an issue on GitHub.

## 📄 License

MIT
