import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export interface Theme {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    shadow: string;
    gradient: readonly [string, string, ...string[]];
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: '#FAFBFC',
    surface: '#FFFFFF',
    primary: '#56ee98ff',
    secondary: '#10B981',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '#000000',
    gradient: ['#D1F4E0', '#10B981'] as const,
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#70eba5ff',
    secondary: '#34D399',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    shadow: '#000000',
    gradient: ['#D1F4E0', '#34D399'] as const,
  },
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setTheme(darkTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme.isDark ? lightTheme : darkTheme;
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme.isDark ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return {
    theme,
    toggleTheme,
  };
});