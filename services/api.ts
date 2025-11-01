/**
 * Fake Store API Service using Axios
 * Documentation: https://fakestoreapi.com/docs
 */

import type { Cart, Product } from '@/types/api';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log errors for debugging
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Product API Calls
/**
 * Fetch all products
 * @param limit - Optional limit for pagination
 */
export const fetchProducts = async (limit?: number): Promise<Product[]> => {
  try {
    const url = limit ? `/products?limit=${limit}` : '/products';
    const { data } = await apiClient.get<Product[]>(url);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
    throw new Error('Failed to fetch products');
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || `Failed to fetch product ${id}`
      );
    }
    throw new Error(`Failed to fetch product ${id}`);
  }
};

/**
 * Fetch all product categories
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const { data } = await apiClient.get<string[]>('/products/categories');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
    throw new Error('Failed to fetch categories');
  }
};

/**
 * Fetch products by category
 */
export const fetchProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    const { data } = await apiClient.get<Product[]>(
      `/products/category/${category}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch products in category: ${category}`
      );
    }
    throw new Error(`Failed to fetch products in category: ${category}`);
  }
};

// Cart API Calls
/**
 * Fetch all carts
 */
export const fetchCarts = async (): Promise<Cart[]> => {
  try {
    const { data } = await apiClient.get<Cart[]>('/carts');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch carts');
    }
    throw new Error('Failed to fetch carts');
  }
};

/**
 * Fetch user's cart
 */
export const fetchUserCart = async (userId: number): Promise<Cart[]> => {
  try {
    const { data } = await apiClient.get<Cart[]>(`/carts/user/${userId}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user cart'
      );
    }
    throw new Error('Failed to fetch user cart');
  }
};
