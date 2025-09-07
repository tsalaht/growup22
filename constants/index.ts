/**
 * Application constants and configuration
 * Centralized place for colors, dimensions, and other app-wide constants
 */

// Color palette
export const COLORS = {
  // Primary colors
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  
  // Secondary colors
  secondary: '#2196F3',
  secondaryLight: '#64B5F6',
  secondaryDark: '#1976D2',
  
  // Background colors
  background: '#FAFBFC',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#F5F5F5',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // UI colors
  border: '#E5E7EB',
  divider: '#F3F4F6',
  shadow: '#00000020',
  
  // Category colors for tasks and notes
  categories: {
    work: '#3B82F6',
    personal: '#10B981',
    health: '#EF4444',
    education: '#8B5CF6',
    finance: '#F59E0B',
    social: '#EC4899',
    travel: '#06B6D4',
    hobby: '#84CC16',
  },
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'Tajawal-Regular',
    medium: 'Tajawal-Medium',
    bold: 'Tajawal-Bold',
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
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Dimensions
export const DIMENSIONS = {
  headerHeight: 60,
  tabBarHeight: 80,
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 120,
} as const;

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// App configuration
export const APP_CONFIG = {
  name: 'GrowUp',
  version: '1.0.0',
  supportEmail: 'support@growup.app',
  privacyPolicyUrl: 'https://growup.app/privacy',
  termsOfServiceUrl: 'https://growup.app/terms',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  // Auth
  USER: 'user',
  PASSWORD: 'password',
  SAVED_EMAIL: 'savedEmail',
  SAVED_PASSWORD: 'savedPassword',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // App data
  TASKS: 'tasks',
  NOTES: 'notes',
  GOALS: 'goals',
  FINANCE_DATA: 'finance_data',
  
  // Settings
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
} as const;

// Task types and categories
export const TASK_TYPES = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  ONE_TIME: 'ONE_TIME',
} as const;

export const TASK_CATEGORIES = {
  WORK: 'WORK',
  PERSONAL: 'PERSONAL',
  HEALTH: 'HEALTH',
  EDUCATION: 'EDUCATION',
  FINANCE: 'FINANCE',
  SOCIAL: 'SOCIAL',
  TRAVEL: 'TRAVEL',
  HOBBY: 'HOBBY',
} as const;

// Note categories
export const NOTE_CATEGORIES = {
  WORK: 'WORK',
  PERSONAL: 'PERSONAL',
  IDEAS: 'IDEAS',
  REMINDERS: 'REMINDERS',
  FOLLOW_UP: 'FOLLOW_UP',
  MEETING: 'MEETING',
  SHOPPING: 'SHOPPING',
  TRAVEL: 'TRAVEL',
} as const;

// Goal types
export const GOAL_TYPES = {
  FINANCIAL: 'FINANCIAL',
  HEALTH: 'HEALTH',
  CAREER: 'CAREER',
  EDUCATION: 'EDUCATION',
  PERSONAL: 'PERSONAL',
  TRAVEL: 'TRAVEL',
  MARRIAGE: 'MARRIAGE',
  HOUSE: 'HOUSE',
  CAR: 'CAR',
  OTHER: 'OTHER',
} as const;

// Finance categories
export const FINANCE_CATEGORIES = {
  FOOD: 'FOOD',
  TRANSPORT: 'TRANSPORT',
  ENTERTAINMENT: 'ENTERTAINMENT',
  HEALTH: 'HEALTH',
  EDUCATION: 'EDUCATION',
  SHOPPING: 'SHOPPING',
  BILLS: 'BILLS',
  RENT: 'RENT',
  OTHER: 'OTHER',
} as const;