/**
 * Fake Store API Service using Axios
 * Documentation: https://fakestoreapi.com/docs
 */

import { Endpoints } from '@/config/endpoints';
import type { Cart, Product } from '@/types/api';
import axios from 'axios';
import { apiClient } from './api-client';

// Product API Calls
/**
 * Fetch all products
 * @param limit - Optional limit for pagination
 */
export const fetchProducts = async (limit?: number): Promise<Product[]> => {
  try {
    const url = limit
      ? Endpoints.products.withLimit(limit)
      : Endpoints.products.all;
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
 * Fetch products page for infinite scroll
 * @param pageParam - Page offset
 * @param limit - Items per page
 * @param category - Optional category filter
 */
export const fetchProductsPage = async ({
  pageParam = 0,
  limit = 10,
  category,
}: {
  pageParam?: number;
  limit?: number;
  category?: string;
}): Promise<Product[]> => {
  try {
    let url = category
      ? Endpoints.products.byCategory(category)
      : Endpoints.products.all;

    const { data } = await apiClient.get<Product[]>(url);

    // Simulate pagination since the API doesn't support offset
    const start = pageParam * limit;
    const end = start + limit;
    return data.slice(start, end);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch products page'
      );
    }
    throw new Error('Failed to fetch products page');
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const { data } = await apiClient.get<Product>(Endpoints.products.byId(id));
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
    const { data } = await apiClient.get<string[]>(
      Endpoints.products.categories
    );
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
      Endpoints.products.byCategory(category)
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
    const { data } = await apiClient.get<Cart[]>(Endpoints.carts.all);
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
    const { data } = await apiClient.get<Cart[]>(
      Endpoints.carts.byUser(userId)
    );
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
