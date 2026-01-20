// MedAssist Design System - Colors, Typography, Spacing
// A premium healthcare app theme with dark mode focus

export const Colors = {
  // Primary palette - Medical Blue/Teal
  primary: {
    50: '#E6F7FA',
    100: '#B3E8F2',
    200: '#80D9EA',
    300: '#4DC9E1',
    400: '#26BDD9',
    500: '#00B0D1', // Main primary
    600: '#008FA8',
    700: '#006E80',
    800: '#004D58',
    900: '#002C30',
  },

  // Accent - Healthcare Green
  accent: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Main accent
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Urgency colors
  urgency: {
    low: '#4CAF50',      // Green
    medium: '#FFC107',   // Amber
    high: '#FF5722',     // Deep Orange
    critical: '#F44336', // Red
  },

  // Neutral / Background
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#0A0E1A',
  },

  // Dark mode specific
  dark: {
    background: '#0A0E1A',
    surface: '#111827',
    surfaceElevated: '#1E293B',
    card: '#1A1F2E',
    cardElevated: '#252B3B',
    border: '#2D3748',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },

  // Light mode
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
  },

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};

// Health score colors
export const HealthScoreColors = {
  excellent: { bg: '#22C55E', text: '#FFFFFF', label: 'Excellent' },
  good: { bg: '#4CAF50', text: '#FFFFFF', label: 'Good' },
  moderate: { bg: '#FFC107', text: '#000000', label: 'Moderate' },
  attention: { bg: '#FF9800', text: '#000000', label: 'Needs Attention' },
  critical: { bg: '#F44336', text: '#FFFFFF', label: 'Critical' },
};

export const getHealthScoreColor = (score: number) => {
  if (score >= 90) return HealthScoreColors.excellent;
  if (score >= 75) return HealthScoreColors.good;
  if (score >= 50) return HealthScoreColors.moderate;
  if (score >= 25) return HealthScoreColors.attention;
  return HealthScoreColors.critical;
};
