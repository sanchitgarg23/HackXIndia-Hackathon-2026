export * from './theme';

// App Configuration
export const APP_CONFIG = {
  name: 'MedAssist',
  tagline: 'Your Health, Intelligently Managed',
  version: '1.0.0',
};

// API Configuration (placeholder for backend integration)
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000,
};

// Feature flags
export const FEATURES = {
  voiceInput: true,
  documentUpload: true,
  offlineMode: false,
  emergencySOS: true,
};
