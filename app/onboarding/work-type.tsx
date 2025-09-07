import React, { useState } from 'react';
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

interface WorkType {
  id: string;
  title: string;
  icon: string;
  selected: boolean;
}

export default function WorkTypeSelection() {
  // Load fonts and other hooks first
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  const [workTypes, setWorkTypes] = useState<WorkType[]>([
    { id: 'marketing', title: 'التسويق', icon: '📈', selected: false },
    { id: 'business', title: 'إدارة الأعمال', icon: '💼', selected: true },
    { id: 'design', title: 'التصميم', icon: '🎨', selected: false },
    { id: 'videos', title: 'صانع فيديوهات', icon: '🎬', selected: false },
  ]);

  // Check fontsLoaded after all hooks
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل الخطوط...</Text>
      </View>
    );
  }

  const handleWorkTypeSelect = (id: string) => {
    setWorkTypes((prev) =>
      prev.map((type) => ({
        ...type,
        selected: type.id === id,
      }))
    );
  };

  const handleStartJourney = () => {
    router.push('/onboarding/welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={{
              uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0nfe0ncyr2gzju7ucy07c',
            }}
            style={styles.logoImage}
            resizeMode="contain"
         
          />
        </View>

        {/* Main Content */}
        <View style={styles.contentSection}>
          <Text style={styles.mainTitle}>وش طبيعة عملك؟</Text>
          <Text style={styles.subtitle}>اختر مجال عملك الحالي</Text>

          {/* Work Type Options */}
          <View style={styles.optionsContainer}>
            {workTypes.map((workType) => (
              <TouchableOpacity
                key={workType.id}
                style={[styles.optionCard, workType.selected && styles.selectedCard]}
                onPress={() => handleWorkTypeSelect(workType.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionIcon, workType.selected && styles.selectedOptionIcon]}>
                    {workType.icon}
                  </Text>
                  <Text
                    style={[styles.optionTitle, workType.selected && styles.selectedTitle]}
                  >
                    {workType.title}
                  </Text>
                  <View
                    style={[styles.radioButton, workType.selected && styles.selectedRadio]}
                  >
                    {workType.selected && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartJourney}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>ابدأ الرحلة ←</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.activeDot]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Light background for consistency
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.03,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
  },
  selectedCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderColor: '#4CAF50',
    // shadowOpacity: 0.2,
    // shadowRadius: 8,
    // elevation: 5,
    // transform: [{ scale: 1.02 }],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionIcon: {
    fontSize: 22,
    marginRight: 12,
    color: '#4B5563',
  },
  selectedOptionIcon: {
    color: '#4CAF50',
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#1F2937',
    textAlign: 'right',
  },
  selectedTitle: {
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  selectedRadio: {
    backgroundColor: '#4CAF50',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  buttonSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Tajawal_700Bold',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    backgroundColor: '#4CAF50',
    width: 28,
    borderRadius: 14,
  },
});