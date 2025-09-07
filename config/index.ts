/**
 * Project configuration file
 * Contains app-wide configuration settings
 */

export const PROJECT_CONFIG = {
  // App information
  app: {
    name: 'GrowUp',
    version: '1.0.0',
    description: 'تطبيق إدارة مهام ذكي باللغة العربية',
    author: 'GrowUp Team',
  },

  // API configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.growupe.com/api',
    timeout: 10000,
    retryAttempts: 3,
  },

  // Storage configuration
  storage: {
    prefix: 'growup_',
    encryptionKey: process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'default_key',
  },

  // Notification configuration
  notifications: {
    defaultChannelId: 'growup_default',
    defaultChannelName: 'GrowUp Notifications',
    defaultChannelDescription: 'إشعارات تطبيق GrowUp',
    soundEnabled: true,
    vibrationEnabled: true,
  },

  // Feature flags
  features: {
    enableAnalytics: false,
    enableCrashReporting: false,
    enablePushNotifications: true,
    enableBiometricAuth: false,
    enableCloudSync: false,
    enableOfflineMode: true,
  },

  // UI configuration
  ui: {
    defaultLanguage: 'ar',
    defaultTheme: 'light',
    animationDuration: 300,
    debounceDelay: 500,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxAttachmentSize: 10 * 1024 * 1024, // 10MB
  },

  // Validation rules
  validation: {
    password: {
      minLength: 6,
      maxLength: 50,
      requireSpecialChar: false,
      requireNumber: false,
      requireUppercase: false,
    },
    email: {
      maxLength: 254,
    },
    task: {
      titleMaxLength: 100,
      descriptionMaxLength: 500,
    },
    note: {
      titleMaxLength: 100,
      contentMaxLength: 5000,
    },
    goal: {
      nameMaxLength: 100,
      descriptionMaxLength: 500,
      maxAmount: 1000000000, // 1 billion
    },
  },

  // Date and time configuration
  dateTime: {
    locale: 'ar-SA',
    timezone: 'Asia/Riyadh',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'YYYY-MM-DD HH:mm',
  },

  // Currency configuration
  currency: {
    default: 'SAR',
    supported: ['SAR', 'USD', 'EUR', 'AED'],
    locale: 'ar-SA',
  },

  // Performance configuration
  performance: {
    enableLazyLoading: true,
    enableImageCaching: true,
    maxCacheSize: 100 * 1024 * 1024, // 100MB
    cacheExpiration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Development configuration
  development: {
    enableDebugLogs: __DEV__,
    enableReduxDevTools: __DEV__,
    enableFlipperIntegration: __DEV__,
    mockApiCalls: false,
  },

  // Security configuration
  security: {
    enableEncryption: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // Backup configuration
  backup: {
    autoBackupEnabled: true,
    backupInterval: 24 * 60 * 60 * 1000, // 24 hours
    maxBackupFiles: 5,
    includeAttachments: false,
  },

  // Analytics configuration
  analytics: {
    trackScreenViews: true,
    trackUserActions: true,
    trackErrors: true,
    anonymizeData: true,
  },

  // Social sharing configuration
  sharing: {
    enableTaskSharing: true,
    enableNoteSharing: true,
    enableGoalSharing: true,
    defaultShareText: 'تحقق من تقدمي في تطبيق GrowUp!',
  },

  // Export/Import configuration
  exportImport: {
    supportedFormats: ['JSON', 'CSV'],
    maxExportSize: 50 * 1024 * 1024, // 50MB
    includeMetadata: true,
  },

  // Contact and support
  support: {
    email: 'support@growup.app',
    website: 'https://growup.app',
    privacyPolicyUrl: 'https://growup.app/privacy',
    termsOfServiceUrl: 'https://growup.app/terms',
    helpCenterUrl: 'https://help.growup.app',
  },
} as const;

// Type for the configuration
export type ProjectConfig = typeof PROJECT_CONFIG;

// Helper function to get configuration value
export const getConfig = <T extends keyof ProjectConfig>(
  section: T
): ProjectConfig[T] => {
  return PROJECT_CONFIG[section];
};

// Helper function to get nested configuration value
export const getNestedConfig = <
  T extends keyof ProjectConfig,
  K extends keyof ProjectConfig[T]
>(
  section: T,
  key: K
): ProjectConfig[T][K] => {
  return PROJECT_CONFIG[section][key];
};

// Environment-specific overrides
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const overrides = {
    development: {
      api: {
        baseUrl: 'https://api.growupe.com/api',
      },
      features: {
        enableAnalytics: false,
        enableCrashReporting: false,
      },
    },
    production: {
      api: {
        baseUrl: 'https://api.growupe.com/api',
      },
      features: {
        enableAnalytics: true,
        enableCrashReporting: true,
      },
      development: {
        enableDebugLogs: false,
        enableReduxDevTools: false,
        enableFlipperIntegration: false,
      },
    },
  };

  return overrides[env as keyof typeof overrides] || {};
};