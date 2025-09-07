import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import BannerAdComponent from './BannerAd';
import RewardedVideoAdComponent from './RewardedVideoAd';

interface AdManagerProps {
  showBanner?: boolean;
  showRewardedVideo?: boolean;
  bannerPosition?: 'top' | 'bottom';
  onRewardEarned?: (reward: any) => void;
  children?: React.ReactNode;
}

const AdManager: React.FC<AdManagerProps> = ({
  showBanner = true,
  showRewardedVideo = false,
  bannerPosition = 'bottom',
  onRewardEarned,
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAds();
  }, []);

  const initializeAds = async () => {
    try {
      console.log('🚀 Initializing Google Mobile Ads...');
      
      // Initialize the mobile ads SDK
      await mobileAds().initialize();
      
      // Set content rating for ads
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });
      
      console.log('✅ Google Mobile Ads initialized successfully');
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error initializing Google Mobile Ads:', error);
    }
  };

  const handleRewardEarned = (reward: any) => {
    console.log('🎉 Reward earned:', reward);
    onRewardEarned?.(reward);
  };

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        {children}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showBanner && bannerPosition === 'top' && (
        <View style={styles.bannerTop}>
          <BannerAdComponent />
        </View>
      )}
      
      <View style={styles.content}>
        {children}
      </View>
      
      {showBanner && bannerPosition === 'bottom' && (
        <View style={styles.bannerBottom}>
          <BannerAdComponent />
        </View>
      )}
      
      {showRewardedVideo && (
        <View style={styles.rewardedVideoContainer}>
          <RewardedVideoAdComponent onRewardEarned={handleRewardEarned} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bannerTop: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bannerBottom: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  rewardedVideoContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default AdManager;
