import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useTheme } from '@/contexts/ThemeContext';
import { getBannerAdUnitId, IS_DEVELOPMENT } from '@/config/ads';

interface BannerAdComponentProps {
  size?: BannerAdSize;
  style?: any;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

export default function BannerAdComponent({ 
  size = BannerAdSize.BANNER, 
  style,
  onAdLoaded,
  onAdFailedToLoad 
}: BannerAdComponentProps) {
  const { theme } = useTheme();
  const [adLoaded, setAdLoaded] = useState(false);

  const handleAdLoaded = () => {
    setAdLoaded(true);
    onAdLoaded?.();
    if (IS_DEVELOPMENT) {
      console.log('✅ Banner Ad loaded successfully');
    }
  };

  const handleAdFailedToLoad = (error: any) => {
    setAdLoaded(false);
    onAdFailedToLoad?.(error);
    if (IS_DEVELOPMENT) {
      console.log('❌ Banner Ad failed to load:', error);
    }
    // Don't crash the app, just hide the ad
    console.log('Banner ad disabled due to error');
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      ...style,
    },
    adContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    loadingContainer: {
      height: 50,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    loadingText: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontFamily: 'Tajawal_400Regular',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.adContainer}>
        <BannerAd
          unitId={getBannerAdUnitId()}
          size={size}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
        />
        {!adLoaded && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {IS_DEVELOPMENT ? 'Loading Test Ad...' : 'جاري تحميل الإعلان...'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
