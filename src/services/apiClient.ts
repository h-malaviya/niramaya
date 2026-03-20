import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { API } from '../constants/api-routes';
import { APP_ROUTES } from '../constants/app-routes';

const BACKEND_BASE_URL = import.meta.env.PROD ? '/api' : import.meta.env.VITE_BACKEND_URL;

export const apiClient = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    paramsSerializer: {
        indexes: null, // results in 'specialties=a&specialties=b'
    },
});

// Request interceptor for token injection
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Variables to handle concurrent refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        const isAuthEndpoint =
            originalRequest.url?.includes(API.AUTH.REFRESH) ||
            originalRequest.url?.includes(API.AUTH.LOGIN) ||
            originalRequest.url?.includes(API.AUTH.PATIENT_SIGNUP) ||
            originalRequest.url?.includes(API.AUTH.DOCTOR_SIGNUP) ||
            originalRequest.url?.includes(API.AUTH.SEND_OTP) ||
            originalRequest.url?.includes(API.AUTH.VERIFY_OTP);

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {

            if (isRefreshing) {
                // Return a promise that waits for the token refresh and then retries the request
                try {
                    const token = await new Promise<string>((resolve) => {
                        subscribeTokenRefresh((newToken: string) => {
                            resolve(newToken);
                        });
                    });
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                } catch (e) {
                    return Promise.reject(e);
                }
            }

            originalRequest._retry = true;
            isRefreshing = true;
            console.warn('Access token expired. Attempting refresh...');

            try {
                // Note: Refresh token is handled by the browser via HTTP-only cookies

                // Attempt to refresh token using a fresh axios call (to avoid interceptors)
                const response = await axios.post(`${BACKEND_BASE_URL}${API.AUTH.REFRESH}`, {}, {
                    withCredentials: true
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                console.log('Token refresh successful.');

                // Store new tokens
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                if (newRefreshToken) {
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
                }

                isRefreshing = false;
                onTokenRefreshed(accessToken);

                // Update header and retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                console.error('Token refresh failed:', refreshError);
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

                if (typeof window !== 'undefined') {
                    window.location.href = APP_ROUTES.AUTH.LOGIN;
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
