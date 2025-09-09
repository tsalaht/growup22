import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { RewardedAd, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { useTheme } from '@/contexts/ThemeContext';
import { getRewardedAdUnitId, IS_DEVELOPMENT, AD_CONFIG } from '@/config/ads';
import { X, Gift, Clock } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

interface ShortRewardedAdProps {
  visible: boolean;
  onClose: () => void;
  onRewardEarned?: (reward: { type: string; amount: number }) => void;
  title?: string;
  description?: string;
}

export default function ShortRewardedAd({ 
  visible, 
  onClose, 
  onRewardEarned,
  title = "إعلان قصير - 3 ثواني",
  description = "شاهد إعلان قصير واحصل على مكافأة!"
}: ShortRewardedAdProps) {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const { theme } = useTheme();
  const [adLoaded, setAdLoaded] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);

  useEffect(() => {
    if (visible) {
      loadAd();
    }
  }, [visible]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isShowing && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && isShowing) {
      // Ad finished, close modal
      setIsShowing(false);
      onClose();
    }
    return () => clearTimeout(timer);
  }, [countdown, isShowing]);

  const loadAd = async () => {
    try {
      const ad = RewardedAd.createForAdRequest(getRewardedAdUnitId(), {
        requestNonPersonalizedAdsOnly: true,
      });

      ad.addAdEventListener(AdEventType.LOADED, () => {
        setAdLoaded(true);
        if (IS_DEVELOPMENT) {
          console.log('✅ Short Rewarded Ad loaded successfully');
        }
      });

      ad.addAdEventListener(AdEventType.ERROR, (error) => {
        if (IS_DEVELOPMENT) {
          console.log('❌ Short Rewarded Ad error:', error);
        }
        // Don't show error to user, just close the ad
        onClose();
      });

      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        if (IS_DEVELOPMENT) {
          console.log('🎁 Short Rewarded Ad reward earned:', reward);
        }
        onRewardEarned?.(reward);
        Alert.alert('تهانينا!', `لقد حصلت على ${reward.amount} ${reward.type}!`);
      });

      ad.addAdEventListener(AdEventType.OPENED, () => {
        setIsShowing(true);
        setCountdown(AD_CONFIG.REWARDED_AD_DURATION);
        if (IS_DEVELOPMENT) {
          console.log('📱 Short Rewarded Ad opened');
        }
      });

      ad.addAdEventListener(AdEventType.CLOSED, () => {
        setIsShowing(false);
        onClose();
        if (IS_DEVELOPMENT) {
          console.log('❌ Short Rewarded Ad closed');
        }
      });

      setRewardedAd(ad);
      await ad.load();
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.log('❌ Error loading Short Rewarded Ad:', error);
      }
      Alert.alert('عذراً', 'فشل في تحميل الإعلان');
      onClose();
    }
  };

  const showAd = async () => {
    if (rewardedAd && adLoaded) {
      try {
        await rewardedAd.show();
      } catch (error) {
        if (IS_DEVELOPMENT) {
          console.log('❌ Error showing Short Rewarded Ad:', error);
        }
        Alert.alert('عذراً', 'فشل في عرض الإعلان');
        onClose();
      }
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 24,
      margin: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
      maxWidth: 350,
    },
    closeButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      fontFamily: 'Tajawal_400Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    rewardInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary + '10',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 24,
    },
    rewardText: {
      fontSize: 14,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.primary,
      marginLeft: 8,
    },
    showAdButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    showAdButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    showAdButtonText: {
      color: 'white',
      fontSize: 16,
      fontFamily: 'Tajawal_700Bold',
      marginLeft: 8,
    },
    countdownContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    countdownText: {
      fontSize: 16,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.primary,
      marginLeft: 8,
    },
    loadingText: {
      fontSize: 14,
      fontFamily: 'Tajawal_400Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Gift size={40} color={theme.colors.primary} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.rewardInfo}>
            <Gift size={20} color={theme.colors.primary} />
            <Text style={styles.rewardText}>
              مكافأة: {AD_CONFIG.REWARDED_AD_REWARD_AMOUNT} {AD_CONFIG.REWARDED_AD_REWARD_TYPE}
            </Text>
          </View>

          {isShowing ? (
            <View style={styles.countdownContainer}>
              <Clock size={20} color={theme.colors.primary} />
              <Text style={styles.countdownText}>
                {countdown} ثانية
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.showAdButton,
                !adLoaded && styles.showAdButtonDisabled
              ]}
              onPress={showAd}
              disabled={!adLoaded}
            >
              <Gift size={20} color="white" />
              <Text style={styles.showAdButtonText}>
                {adLoaded ? 'شاهد الإعلان' : 'جاري التحميل...'}
              </Text>
            </TouchableOpacity>
          )}

          {!adLoaded && (
            <Text style={styles.loadingText}>
              جاري تحميل الإعلان...
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
