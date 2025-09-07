import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { FileText } from 'lucide-react-native';

export default function TermsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'الشروط والأحكام',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontFamily: "Tajawal_700Bold",
            fontWeight: '700',
          },
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FileText color="#2D5A3D" size={32} strokeWidth={2} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            الشروط والأحكام
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </Text>
        </View>

        {/* Content */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              1. قبول الشروط
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              باستخدام هذا التطبيق، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام التطبيق.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              2. استخدام التطبيق
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              يُسمح لك باستخدام هذا التطبيق للأغراض الشخصية فقط. يُمنع استخدام التطبيق لأي أغراض تجارية أو غير قانونية.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              3. حساب المستخدم
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. أنت مسؤول عن جميع الأنشطة التي تحدث تحت حسابك.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              4. المحتوى والبيانات
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              أنت تحتفظ بملكية المحتوى الذي تنشئه في التطبيق. نحن نحتفظ بالحق في حذف أي محتوى ينتهك هذه الشروط.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              5. الخصوصية
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              6. إخلاء المسؤولية
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              يتم توفير التطبيق "كما هو" دون أي ضمانات. نحن لا نتحمل المسؤولية عن أي أضرار قد تنتج عن استخدام التطبيق.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              7. التعديلات
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات مهمة.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              8. إنهاء الخدمة
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              يمكننا إنهاء أو تعليق حسابك في أي وقت إذا انتهكت هذه الشروط.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              9. القانون المطبق
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              تخضع هذه الشروط للقوانين المعمول بها في المملكة العربية السعودية.
            </Text>
          </View>

          <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              10. التواصل
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا من خلال صفحة الدعم في التطبيق.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1F4E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#A2E9C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    color: '#2D5A3D',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    color: '#2D5A3D',
    marginBottom: 10,
    textAlign: 'right',
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    lineHeight: 24,
    color: '#666',
    textAlign: 'right',
  },
});