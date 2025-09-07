import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

const { height } = Dimensions.get('window');

export default function WelcomeComplete() {
    const [fontsLoaded] = useFonts({
      Tajawal_400Regular,
      Tajawal_700Bold,
      Tajawal_500Medium,
    });

  useEffect(() => {
    // Mark onboarding as completed
    const markOnboardingComplete = async () => {
      try {
        await AsyncStorage.setItem('onboarding_completed', 'true');
      } catch (error) {
        console.log('Error saving onboarding status:', error);
      }
    };
    markOnboardingComplete();
  }, []);

  const handleStartApp = () => {
    router.replace('/auth' as any);
  };
    if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0nfe0ncyr2gzju7ucy07c' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Main Content */}
        <View style={styles.contentSection}>
          {/* <View style={styles.welcomeIconContainer}>
            <Text style={styles.welcomeIcon}>🎯</Text>
          </View> */}

          <Text style={[, styles.mainTitle]}>
            حياك الله في رفيقك الرقمي 🌱
          </Text>
          <Text style={[, styles.subTitle]}>
            نمط حياة متوازن وناجح ✨
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💰</Text>
              <Text style={[, styles.featureText]}>
                تخطيط مالي ذكي
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={[, styles.featureText]}>
                إدارة المهام بكفاءة
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={[, styles.featureText]}>
                تحقيق الأهداف الكبيرة
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={[, styles.featureText]}>
                تنظيم الملاحظات والأفكار
              </Text>
            </View>
          </View>

          <View style={styles.motivationContainer}>
            <Text style={[, styles.motivationText]}>
              استعد لرحلة التطوير والنجاح
            </Text>
            <Text style={[, styles.motivationSubText]}>
              كل خطوة تقربك من أهدافك
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartApp}
            activeOpacity={0.8}
          >
            <Text style={[, styles.buttonText]}>
              لنبدأ الرحلة 🚀
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator - Complete */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.completeDot]} />
          <View style={[styles.progressDot, styles.completeDot]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.06,
    marginBottom: height * 0.03,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeIconContainer: {
    marginBottom: 20,
  },
  welcomeIcon: {
    fontSize: 48,
  },
  mainTitle: {
    fontSize: 24,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 36,
    fontFamily: 'Tajawal_700Bold',
  },
  subTitle: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 30,
    fontFamily: 'Tajawal_400Regular',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderRightWidth: 4,
    borderRightColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent:"space-between"
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    // flex: 1,
    fontSize: 16,
    color: '#000000',
    textAlign: 'right',
    fontFamily: 'Tajawal_500Medium',
  },
  motivationContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  motivationText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Tajawal_500Medium',
  },
  motivationSubText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.8,
    fontFamily: 'Tajawal_400Regular',
  },
  buttonSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Tajawal_700Bold',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  completeDot: {
    backgroundColor: '#4CAF50',
    width: 24,
    borderRadius: 12,
  },
});