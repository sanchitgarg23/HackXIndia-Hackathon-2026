// API service - simplified for mock demo
// Backend connections removed to avoid circular dependencies
// All data now comes from mock stores

import axios from 'axios';
import { Platform } from 'react-native';

// API configuration (kept for future use)
const DEV_API_URL = Platform.select({
    android: 'http://10.0.2.2:5001/api',
    ios: 'http://localhost:5001/api',
    default: 'http://localhost:5001/api'
});

const api = axios.create({
    baseURL: DEV_API_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Mock API functions that return immediately with mock data
// These can be swapped with real API calls later

export const authApi = {
    login: async (credentials: { email: string; password: string }) => {
        // Mock response
        return {
            data: {
                user: {
                    _id: '1',
                    name: 'Demo User',
                    email: credentials.email,
                    role: 'PATIENT',
                },
                token: 'mock-jwt-token'
            }
        };
    },
    register: async (data: any) => {
        return {
            data: {
                user: {
                    _id: '1',
                    name: data.name,
                    email: data.email,
                    role: 'PATIENT',
                },
                token: 'mock-jwt-token'
            }
        };
    },
    getMe: async () => {
        return { data: null };
    }
};

export const patientApi = {
    getDashboard: async () => {
        return {
            data: {
                healthScore: 85,
                vitals: [],
                activeConditions: ['Seasonal Allergies'],
                medications: [],
                recentDiagnoses: []
            }
        };
    },
    getRecords: async (category?: string) => {
        return { data: [] };
    },
    uploadDocument: async (data: any) => {
        return { data: { _id: 'mock-doc-id', ...data } };
    }
};

export const caseApi = {
    createCase: async (data: any) => {
        return {
            data: {
                _id: 'mock-case-id',
                symptoms: data.symptoms,
                urgencyScore: 30,
                severity: 'low',
                escalationLevel: 'self_care',
                recommendations: [{ type: 'self_care', title: 'Rest and monitor symptoms' }],
                redFlags: [],
                riskFactors: []
            }
        };
    },
    getHistory: async () => {
        return { data: [] };
    },
    getCase: async (id: string) => {
        return { data: null };
    }
};

export const appointmentApi = {
    getAppointments: async () => {
        return {
            data: [
                {
                    _id: '1',
                    type: 'teleconsult',
                    doctorName: 'Dr. Priya Sharma',
                    specialty: 'General Medicine',
                    date: '2026-01-22',
                    time: '10:00 AM',
                    status: 'confirmed'
                }
            ]
        };
    },
    bookAppointment: async (data: any) => {
        return { data: { _id: 'mock-apt-id', ...data, status: 'confirmed' } };
    }
};

export default api;
