import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Index page that handles initial routing based on authentication state
 * Routes users to onboarding, auth, or main app based on their status
 */
export default function IndexPage() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  console.log('IndexPage - Routing Decision:', {
    isAuthenticated,
    hasCompletedOnboarding,
    isLoading
  });

  // Show loading indicator while determining authentication state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Routing logic based on user state
  if (!hasCompletedOnboarding) {
    // First-time user - redirect to onboarding flow
    console.log('Redirecting to onboarding...');
    return <Redirect href="/onboarding" />;
  }
  
  if (!isAuthenticated) {
    // User completed onboarding but not authenticated - redirect to auth
    console.log('Redirecting to auth...');
    return <Redirect href="/auth" />;
  }
  
  // Authenticated user - redirect to main app
  console.log('Redirecting to main app...');
  return <Redirect href="/(tabs)/home" />;
}

// Component styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
  },
});