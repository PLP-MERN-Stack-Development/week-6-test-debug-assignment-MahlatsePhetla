

// Base API URL – can be changed via VITE_API_URL in .env
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth routes
export const AUTH_ROUTES = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROTECTED: '/auth/protected',
};

// Post routes
export const POST_ROUTES = {
  ALL: '/posts',
  CREATE: '/posts',
  DETAILS: (id) => `/posts/${id}`,
  UPDATE: (id) => `/posts/${id}`,
  DELETE: (id) => `/posts/${id}`,
};

// Frontend route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  NEW_POST: '/create',
};
