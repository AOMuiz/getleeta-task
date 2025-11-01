/**
 * TypeScript type definitions for Fake Store API
 * Documentation: https://fakestoreapi.com/docs
 */

/**
 * Product type from Fake Store API
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/**
 * Category type
 */
export interface Category {
  name: string;
}

/**
 * Cart type from Fake Store API
 */
export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: {
    productId: number;
    quantity: number;
  }[];
}

/**
 * User type from Fake Store API
 */
export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

/**
 * Cart Item type for local cart management
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Sort options for products
 */
export type SortOption = 'price-asc' | 'price-desc' | 'name' | 'rating';
