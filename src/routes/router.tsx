import { createBrowserRouter } from 'react-router-dom';
import {
  Landing,
  Login,
  Dashboard,
  Transactions,
  DebtTracker,
  Reports,
  Analytics,
  Settings,
} from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/transactions',
    element: <Transactions />,
  },
  {
    path: '/debt-tracker',
    element: <DebtTracker />,
  },
  {
    path: '/reports',
    element: <Reports />,
  },
  {
    path: '/analytics',
    element: <Analytics />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '*',
    element: <Landing />, // 404 fallback to landing page
  },
]);
