/**
 * API Endpoints Configuration
 * Centralized endpoint management for Fake Store API
 * Documentation: https://fakestoreapi.com/docs
 */

/**
 * Product Endpoints
 */
export const ProductEndpoints = {
  // Get all products
  all: '/products',

  // Get all products with limit
  withLimit: (limit: number) => `/products?limit=${limit}`,

  // Get single product by ID
  byId: (id: number) => `/products/${id}`,

  // Get all categories
  categories: '/products/categories',

  // Get products in a specific category
  byCategory: (category: string) => `/products/category/${category}`,

  // Sort products
  sort: (sort: 'asc' | 'desc') => `/products?sort=${sort}`,
} as const;

/**
 * Cart Endpoints
 */
export const CartEndpoints = {
  // Get all carts
  all: '/carts',

  // Get single cart by ID
  byId: (id: number) => `/carts/${id}`,

  // Get user's carts
  byUser: (userId: number) => `/carts/user/${userId}`,

  // Get carts in date range
  inDateRange: (startDate: string, endDate: string) =>
    `/carts?startdate=${startDate}&enddate=${endDate}`,

  // Limit and sort
  withLimit: (limit: number) => `/carts?limit=${limit}`,
  sort: (sort: 'asc' | 'desc') => `/carts?sort=${sort}`,
} as const;

/**
 * User Endpoints
 */
export const UserEndpoints = {
  // Get all users
  all: '/users',

  // Get single user by ID
  byId: (id: number) => `/users/${id}`,

  // Limit users
  withLimit: (limit: number) => `/users?limit=${limit}`,

  // Sort users
  sort: (sort: 'asc' | 'desc') => `/users?sort=${sort}`,
} as const;

/**
 * Auth Endpoints (for future use)
 */
export const AuthEndpoints = {
  // Login
  login: '/auth/login',
} as const;

/**
 * All Endpoints - Combined export
 */
export const Endpoints = {
  products: ProductEndpoints,
  carts: CartEndpoints,
  users: UserEndpoints,
  auth: AuthEndpoints,
} as const;

/**
 * Example Usage:
 *
 * import { Endpoints } from '@/config/endpoints';
 *
 * // Get all products
 * apiClient.get(Endpoints.products.all);
 *
 * // Get product by ID
 * apiClient.get(Endpoints.products.byId(5));
 *
 * // Get products with limit
 * apiClient.get(Endpoints.products.withLimit(10));
 *
 * // Get products by category
 * apiClient.get(Endpoints.products.byCategory('electronics'));
 *
 * // Get user's cart
 * apiClient.get(Endpoints.carts.byUser(1));
 */
