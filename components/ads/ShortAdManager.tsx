import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import ShortInterstitialAd from './ShortInterstitialAd';
import { AD_CONFIG } from '@/config/ads';
import { Play, Clock, Star } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

interface ShortAdManagerProps {
  onAdCompleted?: () => void;
  triggerText?: string;
  showTrigger?: boolean;
}

export default function ShortAdManager({ 
  onAdCompleted,
  triggerText = "إعلان فيديو - 3 ثواني",
  showTrigger = true
}: ShortAdManagerProps) {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const { theme } = useTheme();
  const [showAd, setShowAd] = useState(false);
  const [totalViews, setTotalViews] = useState(0);

  const handleAdCompleted = () => {
    setTotalViews(prev => prev + 1);
    onAdCompleted?.();
    
    Alert.alert(
      'شكراً لك! 🎉',
      `تم عرض الفيديو بنجاح!\nإجمالي المشاهدات: ${totalViews + 1}`,
      [{ text: 'حسناً', style: 'default' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      marginRight: 8,
    },
    title: {
      fontSize: 16,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
      flex: 1,
    },
    viewCount: {
      fontSize: 14,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    description: {
      fontSize: 14,
      fontFamily: 'Tajawal_400Regular',
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoText: {
      fontSize: 12,
      fontFamily: 'Tajawal_400Regular',
      color: theme.colors.textSecondary,
      marginLeft: 6,
    },
    triggerButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    triggerButtonText: {
      color: 'white',
      fontSize: 14,
      fontFamily: 'Tajawal_700Bold',
      marginLeft: 8,
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Play size={20} color={theme.colors.primary} style={styles.icon} />
        <Text style={styles.title}>{triggerText}</Text>
        {totalViews > 0 && (
          <Text style={styles.viewCount}>{totalViews}</Text>
        )}
      </View>

      <Text style={styles.description}>
        شاهد فيديو قصير لمدة 3 ثواني!
      </Text>

      <View style={styles.infoRow}>
        <Clock size={14} color={theme.colors.textSecondary} />
        <Text style={styles.infoText}>المدة: 3 ثواني فقط</Text>
      </View>

      <View style={styles.infoRow}>
        <Star size={14} color={theme.colors.textSecondary} />
        <Text style={styles.infoText}>
          فيديو قصير وممتع
        </Text>
      </View>

      {showTrigger && (
        <TouchableOpacity
          style={styles.triggerButton}
          onPress={() => setShowAd(true)}
        >
          <Play size={16} color="white" />
          <Text style={styles.triggerButtonText}>شاهد الفيديو</Text>
        </TouchableOpacity>
      )}

      <ShortInterstitialAd
        visible={showAd}
        onClose={() => setShowAd(false)}
        onAdCompleted={handleAdCompleted}
        title={triggerText}
        description="فيديو قصير لمدة 3 ثواني فقط!"
      />
    </View>
  );
}
