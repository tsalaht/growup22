import React from 'react';
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
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

const { height } = Dimensions.get('window');

export default function OnboardingWelcome() {
      const [fontsLoaded] = useFonts({
        Tajawal_400Regular,
        Tajawal_700Bold,
        Tajawal_500Medium,
      });

  const handleGetStarted = () => {
    router.push('/onboarding/work-type' as any);
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
          <Text style={[, styles.mainTitle]}>
            مرحباً بك في نسخة جديدة
          </Text>
          <Text style={[, styles.subTitle]}>
            نسخة أفضل من نفسك
          </Text>

          <View style={styles.descriptionContainer}>
            <Text style={[, styles.description]}>
              جاهز تبني عادات أقوى وتحقق أهدافك؟
            </Text>
            <Text style={[, styles.description]}>
              الطموح ما له حدود، والنجاح يبدأ من هنا
            </Text>
            <Text style={[, styles.description]}>
              خلنا نبدأ رحلة التغيير سوا
            </Text>
          </View>

          <View style={styles.quoteContainer}>
            <Text style={[, styles.quote]}>
              &ldquo;اللي ما يطور نفسه، الزمن بيتجاوزه&rdquo;
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={[, styles.buttonText]}>
              ابدأ ←
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
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
    marginTop: height * 0.08,
    marginBottom: height * 0.05,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 40,
    fontFamily: 'Tajawal_700Bold',
  },
  subTitle: {
    fontSize: 24,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
    fontFamily: 'Tajawal_400Regular',
  },
  descriptionContainer: {
    marginBottom: 40,
    alignItems: 'center',

  },
  description: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
    fontFamily: 'Tajawal_500Medium',
  },
  quoteContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    borderRightWidth: 4,
    borderRightColor: '#4CAF50',
  },
  quote: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    // fontStyle: 'italic',
    fontFamily: 'Tajawal_500Medium',
  },
  buttonSection: {
    paddingHorizontal: 30,
    marginBottom: 40,
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
  activeDot: {
    backgroundColor: '#4CAF50',
    width: 24,
    borderRadius: 12,
  },
});