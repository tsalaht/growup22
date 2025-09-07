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
import { Shield } from 'lucide-react-native';

export default function PrivacyScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'سياسة الخصوصية',
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
            <Shield color="#2D5A3D" size={32} strokeWidth={2} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            سياسة الخصوصية
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </Text>
        </View>

        {/* Content */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              1. المقدمة
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نحن نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية بياناتك عند استخدام تطبيقنا.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              2. المعلومات التي نجمعها
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نجمع المعلومات التالية:{'\n'}
              • معلومات الحساب (الاسم، البريد الإلكتروني){'\n'}
              • بيانات الاستخدام (المهام، الملاحظات، الأهداف){'\n'}
              • معلومات الجهاز (نوع الجهاز، نظام التشغيل){'\n'}
              • بيانات التحليلات لتحسين الخدمة
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              3. كيفية استخدام المعلومات
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نستخدم معلوماتك لـ:{'\n'}
              • توفير وتحسين خدماتنا{'\n'}
              • إنشاء وإدارة حسابك{'\n'}
              • إرسال التحديثات والإشعارات{'\n'}
              • تحليل استخدام التطبيق لتحسين الأداء{'\n'}
              • الامتثال للمتطلبات القانونية
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              4. مشاركة المعلومات
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:{'\n'}
              • بموافقتك الصريحة{'\n'}
              • للامتثال للقوانين واللوائح{'\n'}
              • لحماية حقوقنا وسلامة المستخدمين{'\n'}
              • مع مقدمي الخدمات الموثوقين
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              5. أمان البيانات
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نتخذ تدابير أمنية قوية لحماية بياناتك:{'\n'}
              • تشفير البيانات أثناء النقل والتخزين{'\n'}
              • مراقبة الأمان المستمرة{'\n'}
              • الوصول المحدود للموظفين المخولين{'\n'}
              • النسخ الاحتياطية المنتظمة والآمنة
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              6. حقوقك
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              لديك الحق في:{'\n'}
              • الوصول إلى بياناتك الشخصية{'\n'}
              • تصحيح المعلومات غير الصحيحة{'\n'}
              • حذف حسابك وبياناتك{'\n'}
              • تقييد معالجة بياناتك{'\n'}
              • نقل بياناتك إلى خدمة أخرى{'\n'}
              • الاعتراض على معالجة بياناتك
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              7. ملفات تعريف الارتباط
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لـ:{'\n'}
              • تحسين تجربة المستخدم{'\n'}
              • تذكر تفضيلاتك{'\n'}
              • تحليل استخدام التطبيق{'\n'}
              يمكنك إدارة إعدادات ملفات تعريف الارتباط في متصفحك.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              8. الاحتفاظ بالبيانات
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              نحتفظ ببياناتك طالما كان حسابك نشطاً أو حسب الحاجة لتوفير الخدمات. عند حذف حسابك، سيتم حذف بياناتك الشخصية خلال 30 يوماً، باستثناء البيانات المطلوبة قانونياً.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              9. خصوصية الأطفال
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              تطبيقنا غير مخصص للأطفال دون سن 13 عاماً. نحن لا نجمع عمداً معلومات شخصية من الأطفال دون هذا السن.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              10. التغييرات على السياسة
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              قد نحدث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات مهمة عبر التطبيق أو البريد الإلكتروني.
            </Text>
          </View>

          <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              11. التواصل معنا
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              إذا كان لديك أي أسئلة حول سياسة الخصوصية أو ترغب في ممارسة حقوقك، يرجى التواصل معنا من خلال صفحة الدعم في التطبيق.
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