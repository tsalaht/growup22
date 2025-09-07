import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { getAdUnitId, getCurrentPlatform, AD_CONFIG } from '../../config/ads';

interface BannerAdComponentProps {
  size?: BannerAdSize;
  style?: any;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  size = BannerAdSize.BANNER,
  style,
  onAdLoaded,
  onAdFailedToLoad,
}) => {
  const [adUnitId, setAdUnitId] = useState<string>('');

  useEffect(() => {
    // Get the appropriate ad unit ID for the current platform
    const platform = getCurrentPlatform();
    const unitId = getAdUnitId('BANNER', platform);
    setAdUnitId(unitId);
    
    console.log(`📱 Banner Ad Unit ID for ${platform}: ${unitId}`);
  }, []);

  const handleAdLoaded = () => {
    console.log('✅ Banner ad loaded successfully');
    onAdLoaded?.();
  };

  const handleAdFailedToLoad = (error: any) => {
    console.log('❌ Banner ad failed to load:', error);
    onAdFailedToLoad?.(error);
  };

  if (!adUnitId) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={AD_CONFIG.REQUEST_CONFIG}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default BannerAdComponent;
