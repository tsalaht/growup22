import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { getBannerAdUnitId } from '@/config/ads';

interface BannerAdComponentProps {
  style?: any;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  style,
  onAdLoaded,
  onAdFailedToLoad,
}) => {
  const [adUnitId, setAdUnitId] = useState<string>('');

  useEffect(() => {
    const unitId = getBannerAdUnitId();
    setAdUnitId(unitId);
  }, []);

  if (!adUnitId) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER} 
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded successfully');
          onAdLoaded?.();
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
          onAdFailedToLoad?.(error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 50,
    maxHeight: 50, 
    overflow: 'hidden',
    flex: 0, 
    flexShrink: 0,
  },
});

export default BannerAdComponent;