import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { useTheme } from '@/contexts/ThemeContext';
import BannerAdComponent from './BannerAd';
import InterstitialAdManager from './InterstitialAd';
import RewardedAdManager from './RewardedAd';
import { IS_DEVELOPMENT } from '@/config/ads';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

interface AdManagerProps {
  children: React.ReactNode;
}

export default function AdManager({ children }: AdManagerProps) {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const { theme } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTestControls, setShowTestControls] = useState(IS_DEVELOPMENT);

  useEffect(() => {
    initializeAds();
  }, []);

  const initializeAds = async () => {
    try {
      // Set test device IDs for development
      if (IS_DEVELOPMENT) {
        await mobileAds().setRequestConfiguration({
          testDeviceIdentifiers: ['EMULATOR'],
          maxAdContentRating: mobileAds.MaxAdContentRating.G,
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
        });
      }
      
      // Initialize with proper error handling
      const adapterStatuses = await mobileAds().initialize();
      setIsInitialized(true);
      
      if (IS_DEVELOPMENT) {
        console.log('✅ Google Mobile Ads initialized:', adapterStatuses);
      }

      // Load ads after initialization with delay
      setTimeout(() => {
        try {
          InterstitialAdManager.getInstance().loadAd();
          RewardedAdManager.getInstance().loadAd();
        } catch (loadError) {
          console.error('Error loading ads:', loadError);
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error initializing Google Mobile Ads:', error);
      // Don't crash the app, just disable ads
      setIsInitialized(false);
      if (IS_DEVELOPMENT) {
        console.log('Ads disabled due to initialization error');
      }
    }
  };

  const showInterstitialAd = async () => {
    try {
      const success = await InterstitialAdManager.getInstance().showAd();
      if (!success) {
        Alert.alert('عذراً', 'الإعلان غير متاح حالياً، حاول مرة أخرى لاحقاً');
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  };

  const showRewardedAd = async () => {
    try {
      RewardedAdManager.getInstance().setCallbacks({
        onRewardEarned: (reward) => {
          Alert.alert('تهانينا!', `لقد حصلت على ${reward.amount} ${reward.type}`);
        },
        onAdClosed: () => {
          console.log('Rewarded ad closed');
        },
        onAdFailedToLoad: (error) => {
          Alert.alert('عذراً', 'فشل في تحميل الإعلان');
        },
      });

      const success = await RewardedAdManager.getInstance().showAd();
      if (!success) {
        Alert.alert('عذراً', 'الإعلان غير متاح حالياً، حاول مرة أخرى لاحقاً');
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    testControls: {
      position: 'absolute',
      top: 50,
      right: 10,
      backgroundColor: theme.colors.surface,
      padding: 10,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 1000,
    },
    testButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginVertical: 2,
    },
    testButtonText: {
      color: 'white',
      fontSize: 12,
      fontFamily: 'Tajawal_500Medium',
      textAlign: 'center',
    },
    toggleButton: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginBottom: 8,
    },
    toggleButtonText: {
      color: theme.colors.text,
      fontSize: 10,
      fontFamily: 'Tajawal_400Regular',
      textAlign: 'center',
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {children}
      
      {isInitialized && (
        <BannerAdComponent 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          }} 
        />
      )}

      {showTestControls && IS_DEVELOPMENT && (
        <View style={styles.testControls}>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setShowTestControls(false)}
          >
            <Text style={styles.toggleButtonText}>إخفاء</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={showInterstitialAd}
          >
            <Text style={styles.testButtonText}>إعلان بيني</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={showRewardedAd}
          >
            <Text style={styles.testButtonText}>إعلان مكافأة</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Export managers for use in other components
export { InterstitialAdManager, RewardedAdManager };
