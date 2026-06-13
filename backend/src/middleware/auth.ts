import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Allow test_token in development mode
    if (process.env.NODE_ENV === 'development' && token === 'test_token') {
      req.user = { 
        id: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID for test user
        email: 'test@example.com' 
      };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key') as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
