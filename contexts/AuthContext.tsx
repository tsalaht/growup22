import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { apiService, User as ApiUser } from '@/services/ApiService';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  fcmToken?: string;
  lastLoginAt?: string;
  notificationSettings?: any[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

interface SavedCredentials {
  email: string;
  password: string;
}

// Storage keys
const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  SAVED_EMAIL: 'savedEmail',
  SAVED_PASSWORD: 'savedPassword',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

/**
 * Authentication context that manages user authentication state
 * Handles sign up, sign in, sign out, and persistent authentication
 */
export const [AuthProvider, useAuth] = createContextHook(() => {
  // State management
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasCompletedOnboarding: false,
  });
  const [savedCredentials, setSavedCredentials] = useState<SavedCredentials | null>(null);

  // Initialize authentication state on app start
  useEffect(() => {
    console.log('AuthContext: Initializing authentication state...');
    checkAuthState();
  }, []);

  /**
   * Check authentication state from AsyncStorage and API
   * Loads user data, saved credentials, and onboarding status
   */
  const checkAuthState = async () => {
    try {
      console.log('Checking authentication state...');
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Load data from AsyncStorage
      const [userData, token, savedEmail, savedPassword, onboardingCompleted] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_EMAIL),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_PASSWORD),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
      ]);
      
      console.log('Storage check:', {
        hasUserData: !!userData,
        hasToken: !!token,
        onboardingCompleted: onboardingCompleted === 'true',
        hasSavedCredentials: !!(savedEmail && savedPassword),
      });
      
      // Load saved credentials if available
      if (savedEmail && savedPassword) {
        setSavedCredentials({ email: savedEmail, password: savedPassword });
      }
      
      // If we have a token, verify it with the API
      if (token && userData) {
        try {
          apiService.setToken(token);
          const response = await apiService.getCurrentUser();
          const user = response.user;
          
          console.log('User authenticated via API:', user.email);
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            hasCompletedOnboarding: onboardingCompleted === 'true',
          });
          return;
        } catch (error) {
          console.log('Token invalid, clearing auth data');
          // Token is invalid, clear stored data
          await Promise.all([
            AsyncStorage.removeItem(STORAGE_KEYS.USER),
            AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
          ]);
        }
      }
      
      // No valid authentication found
      console.log('No valid authentication found');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        hasCompletedOnboarding: onboardingCompleted === 'true',
      });
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
      });
    }
  };

  /**
   * Sign up a new user
   * Creates user account via API and stores credentials locally
   */
  const signUp = async (name: string, email: string, password: string, fcmToken?: string) => {
    try {
      const response = await apiService.register({
        name,
        email,
        password,
        fcmToken,
      });
      
      if (response.success && response.activationToken) {
        console.log('User registered successfully, activation required:', email);
        return { 
          success: true, 
          message: response.message,
          activationToken: response.activationToken 
        };
      }
      
      return { success: false, error: response.message || 'حدث خطأ أثناء إنشاء الحساب' };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء إنشاء الحساب' };
    }
  };

  /**
   * Sign in existing user
   * Validates credentials via API and optionally saves them for future use
   */
  const signIn = async (email: string, password: string, rememberMe: boolean = false, fcmToken?: string) => {
    try {
      const response = await apiService.login({
        email,
        password,
        fcmToken,
      });
      
      console.log('API Response:', response);
      
      // Check if login was successful (API might return success: false even on success)
      const isSuccess = response.success || 
                       response.message?.includes('نجاح') || 
                       response.message?.includes('تم تسجيل الدخول') ||
                       (response.token && response.user);
      
      console.log('Login success check:', {
        responseSuccess: response.success,
        message: response.message,
        hasToken: !!response.token,
        hasUser: !!response.user,
        isSuccess
      });
      
      if (isSuccess && response.token) {
        // Create user object if not provided by API
        const userData = response.user || {
          id: 'temp_id',
          name: email.split('@')[0],
          email: email,
          emailVerified: true
        };
        
        // Store user data and token
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token),
        ]);
        
        // Set token for API service
        apiService.setToken(response.token);
        
        // Handle remember me functionality
        if (rememberMe) {
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, email),
            AsyncStorage.setItem(STORAGE_KEYS.SAVED_PASSWORD, password),
          ]);
          setSavedCredentials({ email, password });
        } else {
          // Clear saved credentials if remember me is not checked
          await Promise.all([
            AsyncStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL),
            AsyncStorage.removeItem(STORAGE_KEYS.SAVED_PASSWORD),
          ]);
          setSavedCredentials(null);
        }
        
        // Update authentication state
        setAuthState(prev => ({
          ...prev,
          user: userData,
          isLoading: false,
          isAuthenticated: true,
        }));
        
        console.log('User signed in successfully:', email);
        console.log('Auth state updated:', {
          isAuthenticated: true,
          user: userData,
          isLoading: false
        });
        
        return { success: true };
      }
      
      return { success: false, error: response.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  /**
   * Sign out current user
   * Clears user data via API and locally but keeps saved credentials if they exist
   */
  const signOut = async () => {
    try {
      // Call API logout if we have a token
      if (apiService) {
        try {
          await apiService.logout();
        } catch (error) {
          console.log('API logout failed, continuing with local logout');
        }
      }
      
      // Clear local storage
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      ]);
      
      // Clear API token
      apiService.setToken(null);
      
      // Update state (keep saved credentials for next login)
      setAuthState(prev => ({
        ...prev,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }));
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  /**
   * Update user profile information
   * Updates both local state and AsyncStorage
   */
  const updateUser = async (name: string, email: string) => {
    try {
      if (!authState.user) {
        return { success: false, error: 'لا يوجد مستخدم مسجل دخول' };
      }
      
      const updatedUser: User = {
        ...authState.user,
        name,
        email,
      };
      
      // Update storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      // Update state
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      console.log('User profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'حدث خطأ أثناء تحديث البيانات' };
    }
  };

  /**
   * Activate user account with activation code
   */
  const activateAccount = async (activationToken: string, activationCode: string) => {
    try {
      const response = await apiService.activate({
        activationToken,
        activationCode,
      });
      
      if (response.success && response.token && response.user) {
        // Store user data and token
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user)),
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token),
        ]);
        
        // Set token for API service
        apiService.setToken(response.token);
        
        // Update authentication state
        setAuthState(prev => ({
          ...prev,
          user: response.user!,
          isLoading: false,
          isAuthenticated: true,
        }));
        
        console.log('Account activated successfully');
        return { success: true, message: response.message };
      }
      
      return { success: false, error: response.message || 'فشل في تفعيل الحساب' };
    } catch (error: any) {
      console.error('Error activating account:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء تفعيل الحساب' };
    }
  };

  /**
   * Send forgot password request
   */
  const forgotPassword = async (email: string) => {
    try {
      const response = await apiService.forgotPassword({ email });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      console.error('Error sending forgot password:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور' };
    }
  };

  /**
   * Reset password with token and code
   */
  const resetPassword = async (token: string, resetCode: string, newPassword: string) => {
    try {
      const response = await apiService.resetPassword({
        token,
        resetCode,
        newPassword,
      });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور' };
    }
  };

  /**
   * Clear saved login credentials
   * Removes saved email and password from storage
   */
  const clearSavedCredentials = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL),
        AsyncStorage.removeItem(STORAGE_KEYS.SAVED_PASSWORD),
      ]);
      setSavedCredentials(null);
      console.log('Saved credentials cleared');
    } catch (error) {
      console.error('Error clearing saved credentials:', error);
    }
  };

  /**
   * Mark onboarding as completed
   * Sets flag in AsyncStorage to skip onboarding on next app launch
   */
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      setAuthState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
      }));
      console.log('Onboarding completed');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Return context value
  return {
    // State
    ...authState,
    savedCredentials,
    
    // Actions
    signUp,
    signIn,
    signOut,
    updateUser,
    clearSavedCredentials,
    completeOnboarding,
    activateAccount,
    forgotPassword,
    resetPassword,
  };
});