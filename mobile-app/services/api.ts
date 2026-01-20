import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../stores';

// Android Emulator uses 10.0.2.2 for localhost
// iOS Simulator uses localhost
// Physical device needs your machine's LAN IP (e.g., 192.168.x.x)
const DEV_API_URL = Platform.select({
    android: 'http://10.0.2.2:5000/api',
    ios: 'http://localhost:5000/api',
    default: 'http://localhost:5000/api'
});

const api = axios.create({
    baseURL: DEV_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Token
api.interceptors.request.use(
    async (config) => {
        const token = useUserStore.getState().token; // Get from Zustand store
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Auth Error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            useUserStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (data: any) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
};

export const patientApi = {
    getDashboard: () => api.get('/patients/dashboard'),
    getRecords: (category?: string) => api.get('/patients/records', { params: { category } }),
    uploadDocument: (data: any) => api.post('/patients/documents', data),
};

export const caseApi = {
    createCase: (data: any) => api.post('/cases', data),
    getHistory: () => api.get('/cases/history'),
    getCase: (id: string) => api.get(`/cases/${id}`),
};

export const appointmentApi = {
    getAppointments: () => api.get('/appointments'),
    bookAppointment: (data: any) => api.post('/appointments', data),
};

export default api;
