import { Platform } from 'react-native';

// App IDs - Using test IDs temporarily to fix crash
export const ANDROID_APP_ID = 'ca-app-pub-1029952950379935~5001861185';
export const IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

// Ad Unit IDs - Using test IDs temporarily to fix crash
export const BANNER_AD_UNIT_ID_ANDROID = 'ca-app-pub-1029952950379935/4771062361'; // Android Banner Test
export const BANNER_AD_UNIT_ID_IOS = 'ca-app-pub-3940256099942544/2934735716'; // iOS Banner Test
export const INTERSTITIAL_AD_UNIT_ID_ANDROID = 'ca-app-pub-1029952950379935/3838675529'; // Android Interstitial Test
export const INTERSTITIAL_AD_UNIT_ID_IOS = 'ca-app-pub-3940256099942544/4411468910'; // iOS Interstitial Test

// Test Ad Unit IDs (for development)
export const TEST_BANNER_AD_UNIT_ID_ANDROID = 'ca-app-pub-1029952950379935/4771062361';
export const TEST_BANNER_AD_UNIT_ID_IOS = 'ca-app-pub-3940256099942544/2934735716';
export const TEST_INTERSTITIAL_AD_UNIT_ID_ANDROID = 'ca-app-pub-1029952950379935/3838675529';
export const TEST_INTERSTITIAL_AD_UNIT_ID_IOS = 'ca-app-pub-3940256099942544/4411468910';

// Development flag - temporarily set to true to use test ads and fix crash
export const IS_DEVELOPMENT = true; // __DEV__;

// Get appropriate ad unit IDs based on platform and environment
export const getBannerAdUnitId = (): string => {
  if (IS_DEVELOPMENT) {
    return Platform.OS === 'android' ? TEST_BANNER_AD_UNIT_ID_ANDROID : TEST_BANNER_AD_UNIT_ID_IOS;
  }
  return Platform.OS === 'android' ? BANNER_AD_UNIT_ID_ANDROID : BANNER_AD_UNIT_ID_IOS;
};

export const getInterstitialAdUnitId = (): string => {
  if (IS_DEVELOPMENT) {
    return Platform.OS === 'android' ? TEST_INTERSTITIAL_AD_UNIT_ID_ANDROID : TEST_INTERSTITIAL_AD_UNIT_ID_IOS;
  }
  return Platform.OS === 'android' ? INTERSTITIAL_AD_UNIT_ID_ANDROID : INTERSTITIAL_AD_UNIT_ID_IOS;
};

// Ad configuration
export const AD_CONFIG = {
  // Banner ad configuration
  banner: {
    size: 'BANNER' as const,
    position: 'bottom' as const,
  },
  
  // Interstitial ad configuration
  interstitial: {
    showAfterSeconds: 3, // Show after 3 seconds as requested
    frequency: 3, // Show every 3rd action
  },
  
  // General ad settings
  testDeviceIds: [
    'EMULATOR', // Android emulator
    'SIMULATOR', // iOS simulator
  ],
};
