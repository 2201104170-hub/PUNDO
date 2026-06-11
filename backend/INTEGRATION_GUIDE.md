# Backend API Integration Guide

This guide explains how to integrate the React frontend with the Node.js backend API.

## Backend Setup

### 1. Database Setup

**Prerequisites:**
- PostgreSQL installed and running
- Port 5432 available (or configure custom port in .env)

**Steps:**
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed  # Optional - adds test data
npm run dev   # Start server on port 5000
```

**Test user credentials (after seeding):**
- Email: `test@example.com`
- Password: `password123`

## Frontend Integration

### 1. Update API Base URL

Create or update `src/config/api.ts` in the frontend:

```typescript
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

Add to `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 2. Create API Service

Create `src/services/api.ts`:

```typescript
import { API_BASE_URL } from '../config/api';

class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      this.token = data.token;
    }
    return data;
  }

  async getProfile() {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Transaction endpoints
  async createTransaction(transactionData: any) {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(transactionData),
    });
    return response.json();
  }

  async getTransactions(limit = 50, offset = 0) {
    const response = await fetch(
      `${this.baseUrl}/transactions?limit=${limit}&offset=${offset}`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }

  async updateTransaction(id: string, data: any) {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteTransaction(id: string) {
    const response = await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Debt endpoints
  async createDebt(debtData: any) {
    const response = await fetch(`${this.baseUrl}/debts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(debtData),
    });
    return response.json();
  }

  async getDebts() {
    const response = await fetch(`${this.baseUrl}/debts`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateDebt(id: string, data: any) {
    const response = await fetch(`${this.baseUrl}/debts/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteDebt(id: string) {
    const response = await fetch(`${this.baseUrl}/debts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Dashboard endpoints
  async getDashboardStats() {
    const response = await fetch(`${this.baseUrl}/dashboard/stats`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  logout() {
    localStorage.removeItem('token');
    this.token = null;
  }
}

export default new ApiService();
```

### 3. Update Login Component

Update `src/pages/Login.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button, Input } from '../components';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.login(email, password);
      if (result.token) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="text-error mb-4">{error}</div>}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default Login;
```

### 4. Update AddTransactionModal

Update `src/components/AddTransactionModal.tsx` to save to backend:

```typescript
const handleSubmit = async () => {
  if (!formData.description || !formData.amount) {
    alert('Please fill all required fields');
    return;
  }

  try {
    const result = await api.createTransaction({
      ...formData,
      date: new Date(formData.date),
      amount: parseFloat(formData.amount),
    });

    if (result.transaction) {
      alert('Transaction added successfully!');
      setFormData({ ... }); // Reset form
      onClose?.();
      // Refresh dashboard data
    }
  } catch (error) {
    alert('Failed to add transaction');
  }
};
```

### 5. Load Dashboard Data

Update `src/pages/Dashboard.tsx`:

```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      const stats = await api.getDashboardStats();
      setMetrics(stats.metrics);
      setRecentTransactions(stats.recentTransactions);
    } catch (error) {
      console.error('Failed to load dashboard data');
    }
  };
  loadData();
}, []);
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=moneyflow_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRY=7d

CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Running Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
npm run dev
# Client runs on http://localhost:3000
```

## API Response Format

All API endpoints follow this format:

**Success Response:**
```json
{
  "message": "Action completed successfully",
  "data": { ... },
  "token": "jwt_token_if_auth_endpoint"
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

## Authentication Flow

1. User registers/logs in via `POST /auth/register` or `POST /auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. For protected routes, include token in Authorization header: `Bearer <token>`
5. Backend verifies token with auth middleware
6. If token expired or invalid, return 401 Unauthorized

## Common Issues & Solutions

### CORS Error
**Error:** `Access to XMLHttpRequest at 'http://localhost:5000/api/...' has been blocked by CORS policy`

**Solution:**
- Ensure backend .env has `CLIENT_URL=http://localhost:3000`
- Restart backend server
- Clear browser cache

### 401 Unauthorized
**Causes:**
- Token not provided
- Token expired
- Token invalid

**Solution:**
- Check token is stored in localStorage
- Ensure Authorization header is set correctly
- Re-login to get fresh token

### Network Error
**Error:** `Failed to fetch` or `ERR_CONNECTION_REFUSED`

**Solution:**
- Check backend server is running on port 5000
- Verify API_BASE_URL in frontend config
- Check firewall settings

## Testing with Sample Data

After running `npm run seed`, use these credentials:
- **Email:** test@example.com
- **Password:** password123

This creates a user with sample transactions and debts for testing.

## Next Steps

1. Set up state management (Redux/Zustand) for better data flow
2. Add loading states and error handling
3. Implement toast notifications
4. Add form validation
5. Set up TypeScript types for API responses
6. Add request/response interceptors
7. Implement automatic token refresh

