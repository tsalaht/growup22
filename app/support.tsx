import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Send, Mail, Phone, MessageSquare, Clock } from 'lucide-react-native';

export default function SupportScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'تم الإرسال بنجاح',
        'تم إرسال رسالتك بنجاح. سنتواصل معك خلال 24 ساعة.',
        [
          {
            text: 'موافق',
            onPress: () => {
              setSubject('');
              setMessage('');
            }
          }
        ]
      );
    }, 2000);
  };

  const handleEmailSupport = () => {
    const emailUrl = `mailto:support@example.com?subject=طلب دعم من ${user?.name}&body=مرحباً،%0A%0A`;
    Linking.openURL(emailUrl).catch(() => {
      Alert.alert('خطأ', 'لا يمكن فتح تطبيق البريد الإلكتروني');
    });
  };

  const handlePhoneSupport = () => {
    const phoneUrl = 'tel:+966123456789';
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('خطأ', 'لا يمكن إجراء المكالمة');
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'التواصل مع الدعم',
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
            <MessageCircle color="#2D5A3D" size={32} strokeWidth={2} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            كيف يمكننا مساعدتك؟
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            نحن هنا لمساعدتك في أي وقت
          </Text>
        </View>

        {/* Quick Contact Options */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            طرق التواصل السريع
          </Text>
          
          <TouchableOpacity
            style={styles.contactOption}
            onPress={handleEmailSupport}
          >
            <View style={styles.contactOptionLeft}>
              <View style={styles.contactIcon}>
                <Mail color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <View>
                <Text style={[styles.contactOptionTitle, { color: theme.colors.text }]}>
                  البريد الإلكتروني
                </Text>
                <Text style={[styles.contactOptionSubtitle, { color: theme.colors.textSecondary }]}>
                  support@example.com
                </Text>
              </View>
            </View>
            <View style={styles.responseTime}>
              <Clock color={theme.colors.textSecondary} size={16} strokeWidth={2} />
              <Text style={[styles.responseTimeText, { color: theme.colors.textSecondary }]}>
                24 ساعة
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactOption}
            onPress={handlePhoneSupport}
          >
            <View style={styles.contactOptionLeft}>
              <View style={styles.contactIcon}>
                <Phone color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <View>
                <Text style={[styles.contactOptionTitle, { color: theme.colors.text }]}>
                  الهاتف
                </Text>
                <Text style={[styles.contactOptionSubtitle, { color: theme.colors.textSecondary }]}>
                  +966 12 345 6789
                </Text>
              </View>
            </View>
            <View style={styles.responseTime}>
              <Clock color={theme.colors.textSecondary} size={16} strokeWidth={2} />
              <Text style={[styles.responseTimeText, { color: theme.colors.textSecondary }]}>
                فوري
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Ticket Form */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.formHeader}>
            <MessageSquare color="#2D5A3D" size={24} strokeWidth={2} />
            <Text style={[styles.cardTitle, { color: theme.colors.text, marginLeft: 10 }]}>
              إرسال تذكرة دعم
            </Text>
          </View>

          <View style={styles.formField}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              الموضوع *
            </Text>
            <TextInput
              style={[styles.input, { 
                color: theme.colors.text, 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background 
              }]}
              value={subject}
              onChangeText={setSubject}
              placeholder="اختر موضوع رسالتك"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formField}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              الرسالة *
            </Text>
            <TextInput
              style={[styles.textArea, { 
                color: theme.colors.text, 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background 
              }]}
              value={message}
              onChangeText={setMessage}
              placeholder="اكتب رسالتك هنا..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { opacity: isSubmitting ? 0.7 : 1 }]}
            onPress={handleSubmitTicket}
            disabled={isSubmitting}
          >
            <Send color="#FFFFFF" size={20} strokeWidth={2} />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال التذكرة'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            الأسئلة الشائعة
          </Text>
          
          <View style={styles.faqItem}>
            <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
              كيف يمكنني إعادة تعيين كلمة المرور؟
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
              يمكنك إعادة تعيين كلمة المرور من صفحة تسجيل الدخول بالضغط على "نسيت كلمة المرور".
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
              كيف يمكنني حذف حسابي؟
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
              يمكنك طلب حذف حسابك عبر التواصل مع فريق الدعم، وسيتم حذف جميع بياناتك خلال 30 يوماً.
            </Text>
          </View>

          <View style={[styles.faqItem, { borderBottomWidth: 0 }]}>
            <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
              هل بياناتي آمنة؟
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
              نعم، نحن نستخدم أحدث تقنيات التشفير لحماية بياناتك ونلتزم بأعلى معايير الأمان.
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
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    color: '#2D5A3D',
    marginBottom: 20,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1F4E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '600',
    marginBottom: 2,
  },
  contactOptionSubtitle: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    color: '#666',
  },
  responseTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseTimeText: {
    fontSize: 12,
    fontFamily: "Tajawal_400Regular",
    marginLeft: 5,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    textAlign: 'right',
  },
  textArea: {
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 120,
    textAlign: 'right',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A2E9C1',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#A2E9C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    marginLeft: 8,
  },
  faqItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    lineHeight: 20,
    textAlign: 'right',
  },
});