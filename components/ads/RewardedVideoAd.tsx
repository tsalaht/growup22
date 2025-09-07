import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { getAdUnitId, getCurrentPlatform, AD_CONFIG } from '../../config/ads';

interface RewardedVideoAdProps {
  onRewardEarned?: (reward: any) => void;
  onAdClosed?: () => void;
  onAdFailedToLoad?: (error: any) => void;
  buttonText?: string;
  buttonStyle?: any;
  textStyle?: any;
  disabled?: boolean;
}

const RewardedVideoAdComponent: React.FC<RewardedVideoAdProps> = ({
  onRewardEarned,
  onAdClosed,
  onAdFailedToLoad,
  buttonText = 'شاهد إعلان واحصل على مكافأة',
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adUnitId, setAdUnitId] = useState<string>('');

  useEffect(() => {
    // Get the appropriate ad unit ID for the current platform
    const platform = getCurrentPlatform();
    const unitId = getAdUnitId('REWARDED', platform);
    setAdUnitId(unitId);
    
    console.log(`📱 Rewarded Video Ad Unit ID for ${platform}: ${unitId}`);
    
    // Create the rewarded ad
    const ad = RewardedAd.createForAdRequest(unitId, AD_CONFIG.REQUEST_CONFIG);
    setRewardedAd(ad);
    
    // Set up event listeners
    const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('✅ Rewarded video ad loaded');
      setIsLoaded(true);
      setIsLoading(false);
    });

    const unsubscribeEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('🎉 User earned reward:', reward);
      onRewardEarned?.(reward);
      
      // Show success message
      Alert.alert(
        'مبروك! 🎉',
        `لقد حصلت على ${reward.amount} ${reward.type}!`,
        [{ text: 'شكراً', style: 'default' }]
      );
    });

    const unsubscribeClosed = ad.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      console.log('📱 Rewarded video ad closed');
      setIsLoaded(false);
      onAdClosed?.();
      
      // Load a new ad for next time
      loadAd();
    });

    const unsubscribeError = ad.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
      console.log('❌ Rewarded video ad error:', error);
      setIsLoaded(false);
      setIsLoading(false);
      onAdFailedToLoad?.(error);
      
      Alert.alert(
        'خطأ في الإعلان',
        'حدث خطأ أثناء تحميل الإعلان. يرجى المحاولة مرة أخرى.',
        [{ text: 'حسناً', style: 'default' }]
      );
    });

    // Load the ad
    loadAd();

    // Cleanup
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const loadAd = () => {
    if (rewardedAd) {
      console.log('🔄 Loading rewarded video ad...');
      setIsLoading(true);
      rewardedAd.load();
    }
  };

  const showAd = () => {
    if (rewardedAd && isLoaded) {
      console.log('📺 Showing rewarded video ad...');
      rewardedAd.show();
    } else {
      Alert.alert(
        'الإعلان غير جاهز',
        'يرجى الانتظار حتى يتم تحميل الإعلان.',
        [{ text: 'حسناً', style: 'default' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonStyle,
          (!isLoaded || isLoading || disabled) && styles.buttonDisabled,
        ]}
        onPress={showAd}
        disabled={!isLoaded || isLoading || disabled}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={[styles.buttonText, textStyle]}>جاري التحميل...</Text>
          </View>
        ) : (
          <Text style={[styles.buttonText, textStyle]}>
            {isLoaded ? buttonText : 'جاري تحميل الإعلان...'}
          </Text>
        )}
      </TouchableOpacity>
      
      {!isLoaded && !isLoading && (
        <Text style={styles.statusText}>
          الإعلان غير متوفر حالياً
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#12A150',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default RewardedVideoAdComponent;
