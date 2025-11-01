# API Layer Guide

## Overview

Our API architecture follows a **three-tier pattern**:

```text
Configuration → HTTP Client → Business Logic
(endpoints.ts) → (api-client.ts) → (api.ts)
```

This separation provides:

- **Maintainability** - Easy to update URLs and add endpoints
- **Reusability** - HTTP client used across all API calls
- **Testability** - Each layer can be mocked independently
- **Type Safety** - TypeScript throughout

## Layer 1: Configuration (endpoints.ts)

### Purpose

Single source of truth for all API URLs.

### Implementation

```typescript
// config/endpoints.ts
const API_BASE_URL = 'https://fakestoreapi.com';

export const Endpoints = {
  products: {
    all: (limit?: number) => `/products${limit ? `?limit=${limit}` : ''}`,

    byId: (id: number) => `/products/${id}`,

    byCategory: (category: string) => `/products/category/${category}`,

    categories: () => '/products/categories',
  },

  carts: {
    all: () => '/carts',
    byId: (id: number) => `/carts/${id}`,
    byUser: (userId: number) => `/carts/user/${userId}`,
  },

  users: {
    all: () => '/users',
    byId: (id: number) => `/users/${id}`,
  },
};

export { API_BASE_URL };
```

### Benefits

**1. Type Safety:**

```typescript
// ✅ Type-safe
Endpoints.products.byId(5); // "/products/5"

// ❌ TypeScript error
Endpoints.products.byId('invalid');
```

**2. Easy Updates:**

```typescript
// Change API version in one place
const API_BASE_URL = 'https://api.v2.example.com';

// Or add query params globally
all: (limit?: number, sort?: string) => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (sort) params.append('sort', sort);
  return `/products?${params}`;
};
```

**3. Testability:**

```typescript
// Easy to mock
jest.mock('@/config/endpoints', () => ({
  Endpoints: {
    products: {
      all: () => '/mock/products',
    },
  },
}));
```

## Layer 2: HTTP Client (api-client.ts)

### Purpose

Configured Axios instance with interceptors.

### Implementation

```typescript
// services/api-client.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config/endpoints';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (__DEV__) {
      console.log('→', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('←', response.status, response.config.url);
    }

    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      console.error('API Error:', {
        status,
        message: data.message || 'Unknown error',
        endpoint: error.config.url,
      });

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - logout user
          // handleLogout();
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);
```

### Interceptor Use Cases

**Request Interceptors:**

- Add authentication tokens
- Add custom headers
- Transform request data
- Log requests (dev only)
- Implement retry logic

**Response Interceptors:**

- Transform response data
- Handle errors globally
- Log responses (dev only)
- Refresh auth tokens
- Cache responses

### Advanced: Retry Logic

```typescript
// services/interceptors.ts
import axiosRetry from 'axios-retry';

axiosRetry(apiClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // 1s, 2s, 3s
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx
    return (
      axiosRetry.isNetworkError(error) || (error.response?.status ?? 0) >= 500
    );
  },
});
```

## Layer 3: Business Logic (api.ts)

### Purpose

Typed API functions that use the HTTP client.

### Implementation

```typescript
// services/api.ts
import { apiClient } from './api-client';
import { Endpoints } from '@/config/endpoints';
import type { Product, Category } from '@/types/api';

/**
 * Fetch all products
 * @param limit - Optional limit for number of products
 */
export const fetchProducts = async (limit?: number): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>(
    Endpoints.products.all(limit)
  );
  return data;
};

/**
 * Fetch single product by ID
 * @param id - Product ID
 */
export const fetchProduct = async (id: number): Promise<Product> => {
  const { data } = await apiClient.get<Product>(Endpoints.products.byId(id));
  return data;
};

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>(
    Endpoints.products.categories()
  );
  return data;
};

/**
 * Fetch products by category
 * @param category - Category name
 */
export const fetchProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>(
    Endpoints.products.byCategory(category)
  );
  return data;
};

/**
 * Fetch paginated products
 * Used for infinite scroll
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
  // Calculate offset
  const offset = pageParam * limit;

  // Fetch all products (API doesn't support offset)
  const allProducts = category
    ? await fetchProductsByCategory(category)
    : await fetchProducts();

  // Manual pagination
  return allProducts.slice(offset, offset + limit);
};
```

### Error Handling

```typescript
export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const { data } = await apiClient.get<Product>(Endpoints.products.byId(id));

    // Validate response
    if (!data || !data.id) {
      throw new Error('Invalid product data');
    }

    return data;
  } catch (error) {
    // Transform error
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch product'
      );
    }
    throw error;
  }
};
```

### Data Transformation

```typescript
export const fetchProducts = async (limit?: number): Promise<Product[]> => {
  const { data } = await apiClient.get<RawProduct[]>(
    Endpoints.products.all(limit)
  );

  // Transform raw API data to app format
  return data.map((rawProduct) => ({
    id: rawProduct.id,
    title: rawProduct.title,
    price: Number(rawProduct.price.toFixed(2)),
    description: rawProduct.description.trim(),
    category: rawProduct.category.toLowerCase(),
    image: rawProduct.image,
    rating: {
      rate: rawProduct.rating.rate,
      count: rawProduct.rating.count,
    },
  }));
};
```

## Integration with TanStack Query

### Custom Hooks Layer

```typescript
// hooks/useAPI.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import * as api from '@/services/api';

/**
 * Fetch all products
 */
export const useProducts = (limit?: number) => {
  return useQuery({
    queryKey: ['products', limit],
    queryFn: () => api.fetchProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch single product
 */
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.fetchProduct(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Infinite scroll products
 */
export const useInfiniteProducts = (category: string | null, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['products-infinite', category],
    queryFn: ({ pageParam = 0 }) =>
      api.fetchProductsPage({
        pageParam,
        limit,
        category: category || undefined,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < limit ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
};
```

## Adding New Endpoints

### Step-by-Step

**1. Add to endpoints.ts:**

```typescript
export const Endpoints = {
  // ... existing endpoints

  reviews: {
    all: () => '/reviews',
    byProduct: (productId: number) => `/reviews/product/${productId}`,
    byUser: (userId: number) => `/reviews/user/${userId}`,
  },
};
```

**2. Add types:**

```typescript
// types/api.ts
export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}
```

**3. Add API function:**

```typescript
// services/api.ts
export const fetchProductReviews = async (
  productId: number
): Promise<Review[]> => {
  const { data } = await apiClient.get<Review[]>(
    Endpoints.reviews.byProduct(productId)
  );
  return data;
};
```

**4. Add hook:**

```typescript
// hooks/useAPI.ts
export const useProductReviews = (productId: number) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: () => api.fetchProductReviews(productId),
    enabled: productId > 0,
    staleTime: 5 * 60 * 1000,
  });
};
```

**5. Use in component:**

```typescript
// components/ProductReviews.tsx
const { data: reviews, isLoading } = useProductReviews(productId);
```

## Testing

### Mocking Axios

```typescript
// __tests__/api.test.ts
import axios from 'axios';
import { fetchProducts } from '@/services/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API', () => {
  it('fetches products', async () => {
    const mockProducts = [{ id: 1, title: 'Product 1' }];

    mockedAxios.get.mockResolvedValue({ data: mockProducts });

    const products = await fetchProducts();

    expect(products).toEqual(mockProducts);
    expect(mockedAxios.get).toHaveBeenCalledWith('/products');
  });
});
```

### Mocking in Components

```typescript
// __tests__/ProductList.test.tsx
import { useProducts } from '@/hooks/useAPI';

jest.mock('@/hooks/useAPI');
const mockedUseProducts = useProducts as jest.MockedFunction<
  typeof useProducts
>;

test('renders products', () => {
  mockedUseProducts.mockReturnValue({
    data: mockProducts,
    isLoading: false,
    isError: false,
  } as any);

  const { getByText } = render(<ProductList />);
  expect(getByText('Product 1')).toBeTruthy();
});
```

## Best Practices

### 1. Consistent Error Handling

```typescript
// Create custom error class
export class APIError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = 'APIError';
  }
}

// Use in API functions
export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const { data } = await apiClient.get<Product>(Endpoints.products.byId(id));
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new APIError(
        error.response?.data?.message || 'Failed to fetch product',
        error.response?.status,
        error.response?.data
      );
    }
    throw error;
  }
};
```

### 2. Request Cancellation

```typescript
// TanStack Query handles this automatically
const { data } = useProducts();

// If component unmounts or query key changes,
// request is automatically cancelled
```

### 3. Optimize Request Size

```typescript
// Only fetch needed fields
export const fetchProductPreview = async (
  id: number
): Promise<ProductPreview> => {
  const { data } = await apiClient.get<ProductPreview>(
    `${Endpoints.products.byId(id)}?fields=id,title,price,image`
  );
  return data;
};
```

### 4. Batch Requests

```typescript
// Fetch multiple products at once
export const fetchProductsBatch = async (ids: number[]): Promise<Product[]> => {
  const requests = ids.map((id) =>
    apiClient.get<Product>(Endpoints.products.byId(id))
  );

  const responses = await Promise.all(requests);
  return responses.map((r) => r.data);
};
```

## Performance Considerations

### 1. Request Deduplication

TanStack Query automatically deduplicates requests with same query key:

```typescript
// Both components use same query key
// Only one request is made
const ComponentA = () => {
  const { data } = useProducts();
  // ...
};

const ComponentB = () => {
  const { data } = useProducts();
  // ...
};
```

### 2. Prefetching

```typescript
// Prefetch data before navigation
const prefetchProduct = (id: number) => {
  queryClient.prefetchQuery({
    queryKey: ['product', id],
    queryFn: () => api.fetchProduct(id),
  });
};

// Use on hover or focus
<ProductCard
  onMouseEnter={() => prefetchProduct(product.id)}
  onFocus={() => prefetchProduct(product.id)}
/>;
```

### 3. Parallel Requests

```typescript
// Fetch related data in parallel
const useProductWithReviews = (id: number) => {
  const product = useProduct(id);
  const reviews = useProductReviews(id);

  return {
    product: product.data,
    reviews: reviews.data,
    isLoading: product.isLoading || reviews.isLoading,
  };
};
```

## Security

### 1. HTTPS Only

```typescript
const API_BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';

// Validate HTTPS in dev
if (__DEV__ && !API_BASE_URL.startsWith('https://')) {
  console.warn('API should use HTTPS');
}
```

### 2. Sanitize Inputs

```typescript
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Sanitize query
  const sanitized = query.trim().replace(/[^\w\s]/gi, '');

  const { data } = await apiClient.get(
    `/products/search?q=${encodeURIComponent(sanitized)}`
  );
  return data;
};
```

### 3. Rate Limiting (Client-Side)

```typescript
import debounce from 'lodash/debounce';

const debouncedSearch = debounce(async (query: string) => {
  return await api.searchProducts(query);
}, 300);

// Only sends request 300ms after user stops typing
```

## Debugging

### Network Tab

```typescript
// Enable in development
if (__DEV__) {
  apiClient.interceptors.request.use((config) => {
    console.log('🚀 Request:', config.method, config.url, config.data);
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => {
      console.log('✅ Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.log('❌ Error:', error.message);
      return Promise.reject(error);
    }
  );
}
```

### React Query DevTools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to app
{
  __DEV__ && <ReactQueryDevtools />;
}
```

## Resources

- [Axios Documentation](https://axios-http.com/docs/intro)
- [TanStack Query](https://tanstack.com/query/latest)
- [REST API Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

## Conclusion

Our three-tier API architecture provides:

- ✅ **Separation of concerns** - Each layer has single responsibility
- ✅ **Type safety** - TypeScript throughout
- ✅ **Testability** - Easy to mock each layer
- ✅ **Maintainability** - Changes localized to specific layers
- ✅ **Scalability** - Easy to add new endpoints and features

This pattern scales from small projects to large enterprise applications.
