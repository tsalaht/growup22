import React from 'react';
import { View, StyleSheet } from 'react-native';
import BannerAdComponent from './BannerAd';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabBannerAdProps {
  style?: any;
  tabBarHeight?: number; 
}

const TabBannerAd: React.FC<TabBannerAdProps> = ({ 
  style, 
  tabBarHeight = 60 
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { 
        bottom: tabBarHeight + insets.bottom,
        height: 50,
      },
      style
    ]}>
      <BannerAdComponent 
        style={styles.banner}
        onAdLoaded={() => {
          console.log('Tab banner ad loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          console.log('Tab banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1000,
    elevation: 1000,
    maxHeight: 50,
    overflow: 'hidden',
  },
  banner: {
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    height: 50,
    flex: 1, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default TabBannerAd;