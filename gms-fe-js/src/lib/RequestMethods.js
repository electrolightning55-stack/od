import { store } from "@/redux/store";
import { signOut } from "@/redux/slices/userSlice";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const publicRequest = axios.create({
    baseURL: BASE_URL
})

export const userRequest = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Get token from Redux state
const getTokenFromState = () => {
    const state = store.getState();
    // First try the new token location
    const token = state.user.token;
    if (token) return token;
    
    // Fallback to the old location if needed
    return state.user.currentUser?.data?.token;
};

// Request interceptor - Add token to headers
userRequest.interceptors.request.use(
    (config) => {
        const token = getTokenFromState();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle auth errors
userRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        // Safe error logging without sensitive data
        const safeErrorDetails = {
            status: error.response?.status,
            endpoint: error.config?.url?.split('?')[0], // Remove query params
            errorType: error.response?.data?.error || 'Unknown Error'
        };

        // Handle specific error cases
        switch (error.response?.status) {
            case 401:
                console.error('Authentication failed:', safeErrorDetails);
                store.dispatch(signOut());
                break;
            case 403:
                console.error('Permission denied:', safeErrorDetails);
                break;
            case 500:
                console.error('Server error:', safeErrorDetails);
                break;
            default:
                console.error('Request failed:', safeErrorDetails);
        }

        // Development-only logging (non-sensitive)
        if (process.env.NODE_ENV === 'development') {
            console.debug('Development error context:', {
                endpoint: safeErrorDetails.endpoint,
                status: safeErrorDetails.status,
                message: error.response?.data?.message || 'No error message provided'
            });
        }

        return Promise.reject(error);
    }
);