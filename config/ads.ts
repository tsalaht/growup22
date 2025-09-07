// Google AdMob Test Ad Unit IDs
// These are Google's official test ad unit IDs for development and testing

export const AD_UNIT_IDS = {
  // Banner Ad Unit IDs (Test)
  BANNER: {
    ANDROID: 'ca-app-pub-3940256099942544/6300978111',
    IOS: 'ca-app-pub-3940256099942544/2934735716',
  },
  
  // Rewarded Video Ad Unit IDs (Test)
  REWARDED: {
    ANDROID: 'ca-app-pub-3940256099942544/5224354917',
    IOS: 'ca-app-pub-3940256099942544/1712485313',
  },
  
  // Interstitial Ad Unit IDs (Test) - for future use
  INTERSTITIAL: {
    ANDROID: 'ca-app-pub-3940256099942544/1033173712',
    IOS: 'ca-app-pub-3940256099942544/4411468910',
  },
  
  // App Open Ad Unit IDs (Test) - for future use
  APP_OPEN: {
    ANDROID: 'ca-app-pub-3940256099942544/3419835294',
    IOS: 'ca-app-pub-3940256099942544/5575463023',
  },
};

// Ad Configuration
export const AD_CONFIG = {
  // Test device IDs (optional - for testing specific devices)
  TEST_DEVICE_IDS: [
    'EMULATOR', // Android emulator
    'SIMULATOR', // iOS simulator
  ],
  
  // Ad request configuration
  REQUEST_CONFIG: {
    requestNonPersonalizedAdsOnly: false, // Set to true for GDPR compliance if needed
    keywords: ['productivity', 'finance', 'tasks', 'goals'], // Relevant keywords
  },
  
  // Banner ad configuration
  BANNER_CONFIG: {
    size: 'BANNER', // Standard banner size
    position: 'bottom', // Position on screen
  },
  
  // Rewarded video configuration
  REWARDED_CONFIG: {
    // Reward amount (you can customize this)
    rewardAmount: 1,
    rewardType: 'coins', // or whatever reward type you want
  },
};

// Helper function to get ad unit ID based on platform
export const getAdUnitId = (adType: 'BANNER' | 'REWARDED' | 'INTERSTITIAL' | 'APP_OPEN', platform: 'android' | 'ios'): string => {
  const platformKey = platform.toUpperCase() as 'ANDROID' | 'IOS';
  return AD_UNIT_IDS[adType][platformKey];
};

// Helper function to get current platform
export const getCurrentPlatform = (): 'android' | 'ios' => {
  return Platform.OS as 'android' | 'ios';
};

import { Platform } from 'react-native';
