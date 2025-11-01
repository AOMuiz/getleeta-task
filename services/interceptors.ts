import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Request interceptor for API calls
 * Add authorization headers, check connectivity, etc.
 */
export const requestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  try {
    // Add any custom headers here
    config.headers['Content-Type'] = 'application/json';

    // TODO: Add authentication token if needed
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  } catch (error) {
    console.error('Request interceptor error:', error);
    return config;
  }
};

/**
 * Response success interceptor
 */
export const responseSuccessInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  return response;
};

/**
 * Response error interceptor
 * Handle common error scenarios
 */
export const responseErrorInterceptor = async (
  error: AxiosError
): Promise<never> => {
  console.log('API Error:', error);

  // Handle common error status codes
  if (error.response?.status === 401) {
    // Handle unauthorized access
    console.log('Unauthorized - redirect to login');
    // TODO: Implement logout or redirect logic
  }

  if (error.response?.status === 404) {
    console.log('Resource not found');
  }

  if (error.response?.status === 500) {
    console.log('Server error');
  }

  return Promise.reject(error);
};
