// AdMob Configuration
export const AD_CONFIG = {
  // App IDs
  ANDROID_APP_ID: 'ca-app-pub-1029952950379935~5001861185',
  IOS_APP_ID: 'ca-app-pub-1029952950379935~7295538955',
  
  // Ad Unit IDs - Production
  BANNER_AD_UNIT_ID_ANDROID: 'ca-app-pub-1029952950379935/4771062361', // Android Banner
  BANNER_AD_UNIT_ID_IOS: 'ca-app-pub-1029952950379935/2103207438', // iOS Banner
  INTERSTITIAL_AD_UNIT_ID_ANDROID: 'ca-app-pub-1029952950379935/3838675529', // Android Interstitial
  INTERSTITIAL_AD_UNIT_ID_IOS: 'ca-app-pub-1029952950379935/9650239552', // iOS Interstitial
  
  // Test Ad Unit IDs (for development)
  TEST_BANNER_AD_UNIT_ID: 'ca-app-pub-3940256099942544/6300978111',
  TEST_INTERSTITIAL_AD_UNIT_ID: 'ca-app-pub-3940256099942544/1033173712',
  
  // Ad Settings
  REQUEST_NON_PERSONALIZED_ADS_ONLY: true,
  
  // Ad Frequency (in seconds)
  INTERSTITIAL_AD_FREQUENCY: 30, // Show interstitial ad every 30 seconds
  REWARDED_AD_FREQUENCY: 60, // Show rewarded ad every 60 seconds
  
  // Rewarded Ad Settings
  REWARDED_AD_DURATION: 3, // 3 seconds duration
  REWARDED_AD_REWARD_AMOUNT: 1, // Reward amount
  REWARDED_AD_REWARD_TYPE: 'نقطة', // Reward type
};

// Check if we're in development mode
export const IS_DEVELOPMENT = __DEV__;

// Get the appropriate ad unit ID based on environment and platform
export const getBannerAdUnitId = () => {
  if (IS_DEVELOPMENT) {
    return AD_CONFIG.TEST_BANNER_AD_UNIT_ID;
  }
  
  // Use platform-specific ad unit IDs for production
  const Platform = require('react-native').Platform;
  return Platform.OS === 'ios' 
    ? AD_CONFIG.BANNER_AD_UNIT_ID_IOS 
    : AD_CONFIG.BANNER_AD_UNIT_ID_ANDROID;
};

export const getInterstitialAdUnitId = () => {
  if (IS_DEVELOPMENT) {
    return AD_CONFIG.TEST_INTERSTITIAL_AD_UNIT_ID;
  }
  
  // Use platform-specific ad unit IDs for production
  const Platform = require('react-native').Platform;
  return Platform.OS === 'ios' 
    ? AD_CONFIG.INTERSTITIAL_AD_UNIT_ID_IOS 
    : AD_CONFIG.INTERSTITIAL_AD_UNIT_ID_ANDROID;
};

export const getRewardedAdUnitId = () => {
  if (IS_DEVELOPMENT) {
    return AD_CONFIG.TEST_INTERSTITIAL_AD_UNIT_ID;
  }
  
  // Use platform-specific ad unit IDs for production
  const Platform = require('react-native').Platform;
  return Platform.OS === 'ios' 
    ? AD_CONFIG.INTERSTITIAL_AD_UNIT_ID_IOS 
    : AD_CONFIG.INTERSTITIAL_AD_UNIT_ID_ANDROID;
};