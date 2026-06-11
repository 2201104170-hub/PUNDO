# Backend Quick Start

Get the MoneyFlow backend running in 5 minutes!

## Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm

## Quick Setup

### 1. Install & Configure
```bash
cd backend
npm install
cp .env.example .env
```

### 2. Update .env with your PostgreSQL credentials
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moneyflow_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Create Database
```bash
createdb moneyflow_db
```

### 4. Run Migrations & Seed
```bash
npm run migrate
npm run seed
```

### 5. Start Server
```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

## Test Login
- Email: `test@example.com`
- Password: `password123`

## Quick API Test
```bash
curl http://localhost:5000/health
```

## Important Files
- `src/index.ts` - Main Express app
- `src/routes/` - API endpoints
- `src/controllers/` - Business logic
- `src/models/` - Database queries
- `.env` - Configuration

## Useful Commands
```bash
npm run dev          # Dev server
npm run build        # Build for production
npm run migrate      # Run migrations
npm run seed         # Add sample data
npm run lint         # Check code quality
```

## Next Steps
1. Update frontend .env with `VITE_API_URL=http://localhost:5000/api`
2. Update frontend components to call API endpoints
3. Run both servers: `npm run dev` (separate terminals)
4. Test login flow

## Need Help?
See `README.md` for full documentation
See `INTEGRATION_GUIDE.md` for frontend integration steps
