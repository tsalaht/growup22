import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { ANDROID_APP_ID, IOS_APP_ID } from '@/config/ads';

interface AdManagerProps {
  children: React.ReactNode;
}

const AdManager: React.FC<AdManagerProps> = ({ children }) => {
  useEffect(() => {
  const initializeAds = async () => {
    try {
        // Initialize Google Mobile Ads SDK
        await mobileAds().initialize();
        
        console.log('Google Mobile Ads SDK initialized successfully');
        
        // Set content rating for ads
        await mobileAds().setRequestConfiguration({
          maxAdContentRating: MaxAdContentRating.PG,
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
        });

        console.log('Ad request configuration set successfully');
      } catch (error) {
        console.error('Failed to initialize Google Mobile Ads SDK:', error);
      }
    };

    initializeAds();
  }, []);

  return <>{children}</>;
};

export default AdManager;
