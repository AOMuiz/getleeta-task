import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { requestInterceptor, responseErrorInterceptor } from './interceptors';

const API_BASE_URL = 'https://fakestoreapi.com';

// Add request logging
const logAxiosRequest = (config: AxiosRequestConfig) => {
  console.log('🚀 Request:', {
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase(),
    headers: config.headers,
    data: config.data,
  });
};

// Add response logging
const logAxiosResponse = (error: AxiosError) => {
  console.log('❌ Response Error:', {
    url: `${error.config?.baseURL}${error.config?.url}`,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: JSON.stringify(error.response?.data, null, 2),
    message: error.message,
  });
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    logAxiosRequest(config);
    return requestInterceptor(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ statuscode: number }>) => {
    // logAxiosResponse(error);

    return responseErrorInterceptor(error);
  }
);
