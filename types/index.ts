/**
 * TypeScript type definitions for the application
 * Centralized type definitions for better type safety and maintainability
 */

import React from "react";

// Base types
export type ID = string;
export type Timestamp = string; // ISO date string

// User types
export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

export interface SavedCredentials {
  email: string;
  password: string;
}

// Task types
export type TaskType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
export type TaskCategory = 'WORK' | 'PERSONAL' | 'HEALTH' | 'EDUCATION' | 'FINANCE' | 'SOCIAL' | 'TRAVEL' | 'HOBBY';
export type TaskStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: ID;
  title: string;
  description?: string;
  type: TaskType;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  reminderTime?: Timestamp;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  tags: string[];
  userId: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RecurringPattern {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number; // Every X days/weeks/months/years
  daysOfWeek?: number[]; // For weekly tasks (0 = Sunday, 6 = Saturday)
  dayOfMonth?: number; // For monthly tasks
  endDate?: Timestamp;
}

// Note types
export type NoteCategory = 'WORK' | 'PERSONAL' | 'IDEAS' | 'REMINDERS' | 'FOLLOW_UP' | 'MEETING' | 'SHOPPING' | 'TRAVEL';
export type ReminderType = 'NONE' | 'TIME_ONLY' | 'DAY_AND_TIME' | 'LOCATION';
export type RepeatFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface Note {
  id: ID;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  hasReminder: boolean;
  reminderType?: ReminderType;
  reminderDate?: Timestamp;
  reminderTime?: Timestamp;
  repeatFrequency?: RepeatFrequency;
  location?: Location;
  attachments: Attachment[];
  userId: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Attachment {
  id: ID;
  type: 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'VIDEO';
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  radius?: number; // in meters
}

// Goal types
export type GoalType = 'FINANCIAL' | 'HEALTH' | 'CAREER' | 'EDUCATION' | 'PERSONAL' | 'TRAVEL' | 'MARRIAGE' | 'HOUSE' | 'CAR' | 'OTHER';
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';

export interface Goal {
  id: ID;
  name: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  targetAmount: number;
  currentAmount: number;
  targetDate: Timestamp;
  monthlySavingPlan: number;
  currency: string;
  milestones: Milestone[];
  userId: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Milestone {
  id: ID;
  title: string;
  targetAmount: number;
  targetDate: Timestamp;
  isCompleted: boolean;
  completedAt?: Timestamp;
}

// Finance types
export type ExpenseCategory = 'FOOD' | 'TRANSPORT' | 'ENTERTAINMENT' | 'HEALTH' | 'EDUCATION' | 'SHOPPING' | 'BILLS' | 'RENT' | 'OTHER';
export type IncomeSource = 'SALARY' | 'FREELANCE' | 'BUSINESS' | 'INVESTMENT' | 'OTHER';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: ID;
  type: TransactionType;
  amount: number;
  currency: string;
  category: ExpenseCategory | IncomeSource;
  description: string;
  date: Timestamp;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  tags: string[];
  userId: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Budget {
  id: ID;
  category: ExpenseCategory;
  monthlyLimit: number;
  currentSpent: number;
  currency: string;
  month: string; // YYYY-MM format
  userId: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  topExpenseCategories: CategorySummary[];
  monthlyTrend: MonthlyTrend[];
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

// Notification types
export type NotificationType = 'TASK_REMINDER' | 'NOTE_REMINDER' | 'GOAL_MILESTONE' | 'BUDGET_ALERT' | 'SYSTEM';
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH';

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
  userId: ID;
  scheduledFor?: Timestamp;
  sentAt?: Timestamp;
  createdAt: Timestamp;
}

export interface NotificationSettings {
  id: ID;
  userId: ID;
  taskReminders: boolean;
  noteReminders: boolean;
  goalMilestones: boolean;
  budgetAlerts: boolean;
  systemNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string; // HH:mm format
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'orange';

export interface ThemeSettings {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  fontSize: 'small' | 'medium' | 'large';
  useSystemFont: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[]; // For select fields
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

// Navigation types
export interface NavigationRoute {
  name: string;
  path: string;
  component: React.ComponentType;
  options?: {
    title?: string;
    headerShown?: boolean;
    tabBarIcon?: React.ComponentType<any>;
  };
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Timestamp;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Timestamp;
}

// Search types
export interface SearchFilters {
  query?: string;
  category?: string;
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
  tags?: string[];
  status?: string;
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  facets?: SearchFacet[];
}

export interface SearchFacet {
  name: string;
  values: {
    value: string;
    count: number;
  }[];
}

// Export/Import types
export interface ExportOptions {
  format: 'JSON' | 'CSV' | 'PDF';
  dateRange?: {
    from: Timestamp;
    to: Timestamp;
  };
  includeAttachments?: boolean;
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};