
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nManager, View, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { StyledText } from '@/components/StyledText';
import {
  useFonts,
  Tajawal_200ExtraLight,
  Tajawal_300Light,
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
  Tajawal_900Black,
} from '@expo-google-fonts/tajawal';

// Context Providers
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { GoalsProvider } from "@/contexts/GoalsContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import * as Updates from 'expo-updates';

// Services
import NotificationService from "@/services/NotificationService";

// Configure RTL support for Arabic


// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

  if (I18nManager.isRTL) {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    // Reload so changes apply immediately on first run
    if (Updates?.reloadAsync) {
      Updates.reloadAsync();
    }
  }
/**
 * Main navigation component that handles routing based on authentication state
 */
function RootLayoutNav() {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();

  console.log('RootLayoutNav - Auth State:', {
    isLoading,
    isAuthenticated,
    hasCompletedOnboarding
  });

  // Show loading screen while determining authentication state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <StyledText style={[, styles.loadingText]}>
          تطبيق إدارة مهام ذكي باللغة العربية
        </StyledText>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="signout" options={{ headerShown: false }} />
      <Stack.Screen name="terms" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
      <Stack.Screen name="support" options={{ headerShown: false }} />
      <Stack.Screen name="help" options={{ headerShown: false }} />
      <Stack.Screen name="notification-settings" options={{ headerShown: false }} />
    </Stack>
  );
}

/**
 * Root layout component that provides all context providers and handles app initialization
 */
export default function RootLayout() {
  // Initialize app services and web-specific configurations
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Initialize notifications with error handling
    try {
      await NotificationService.requestPermissions();
    } catch (error) {
      console.warn('Failed to initialize notifications:', error);
    }
    
    // Configure web-specific RTL and Arabic font support
    if (Platform.OS === 'web') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.body.style.fontFamily = 'Tajawal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    }
  };
  // Load Arabic fonts with fallback to system fonts
  const [fontsLoaded] = useFonts({
    Tajawal_200ExtraLight,
    Tajawal_300Light,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_800ExtraBold,
    Tajawal_900Black,
  });

  // Handle splash screen hiding with timeout fallback
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.log('Error hiding splash screen:', error);
      }
    };
    
    // Hide splash screen after timeout or when fonts are loaded
    const timer = setTimeout(hideSplash, 1000);
    
    if (fontsLoaded) {
      clearTimeout(timer);
      hideSplash();
    }
    
    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  // Log font loading status
  useEffect(() => {
    if (fontsLoaded) {
      console.log('Arabic fonts loaded successfully');
    }
  }, [fontsLoaded]);

  return (
        <GestureHandlerRootView style={[{ flex: 1 }]}>
          <ThemeProvider>
            <NotificationProvider>
              <AuthProvider>
                <TaskProvider>
                  <FinanceProvider>
                    <GoalsProvider>
                      <NotesProvider>
                        <RootLayoutNav />
                      </NotesProvider>
                    </GoalsProvider>
                  </FinanceProvider>
                </TaskProvider>
              </AuthProvider>
            </NotificationProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
  );
}

// Component-specific styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
  },
  loadingText: {
    marginTop: 20,
    color: '#1F2937',
    fontSize: 16,
    textAlign: 'center',
  },
});

// Global styles for RTL and Arabic font support
const globalStyles = StyleSheet.create({
  rtlContainer: {
    writingDirection: 'rtl',
  },
  arabicText: {
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  arabicTextBold: {
    fontFamily: 'Tajawal_700Bold',
    fontWeight: '700' as const,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  arabicTextMedium: {
    fontFamily: 'Tajawal_500Medium',
    fontWeight: '500' as const,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

