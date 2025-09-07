import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Video, MessageCircle } from 'lucide-react-native';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'كيف أبدأ في استخدام التطبيق؟',
    answer: 'بعد تسجيل الدخول، يمكنك البدء بإنشاء مهامك الأولى من قسم المهام، أو إضافة ملاحظاتك من قسم الملاحظات، أو تحديد أهدافك من قسم الأهداف.',
    category: 'البداية'
  },
  {
    id: '2',
    question: 'كيف يمكنني إضافة مهمة جديدة؟',
    answer: 'اذهب إلى قسم المهام واضغط على زر "إضافة مهمة جديدة". املأ التفاصيل المطلوبة مثل العنوان والوصف والأولوية والموعد النهائي.',
    category: 'المهام'
  },
  {
    id: '3',
    question: 'كيف يمكنني تعيين تذكير للملاحظات؟',
    answer: 'في قسم الملاحظات، اضغط على أيقونة التذكير بجانب الملاحظة. يمكنك اختيار الوقت من الساعة الدائرية أو استخدام الخيارات السريعة مثل "بعد ساعة".',
    category: 'الملاحظات'
  },
  {
    id: '4',
    question: 'كيف أتتبع تقدمي في الأهداف؟',
    answer: 'في قسم الأهداف، يمكنك رؤية شريط التقدم لكل هدف. اضغط على الهدف لتحديث التقدم أو إضافة ملاحظات حول إنجازاتك.',
    category: 'الأهداف'
  },
  {
    id: '5',
    question: 'كيف يمكنني إدارة أموالي في التطبيق؟',
    answer: 'قسم المالية يتيح لك تتبع الدخل والمصروفات، إدارة الالتزامات المالية، ومراقبة الأقساط. يمكنك أيضاً عرض التقارير المالية.',
    category: 'المالية'
  },
  {
    id: '6',
    question: 'هل يمكنني تخصيص إعدادات التطبيق؟',
    answer: 'نعم، يمكنك تغيير المظهر (فاتح/داكن) وإعدادات الإشعارات من قسم الملف الشخصي.',
    category: 'الإعدادات'
  },
  {
    id: '7',
    question: 'كيف يمكنني نسخ بياناتي احتياطياً؟',
    answer: 'بياناتك محفوظة تلقائياً في السحابة. يمكنك أيضاً تصدير بياناتك من إعدادات الحساب.',
    category: 'النسخ الاحتياطي'
  },
  {
    id: '8',
    question: 'ماذا أفعل إذا نسيت كلمة المرور؟',
    answer: 'في صفحة تسجيل الدخول، اضغط على "نسيت كلمة المرور" وأدخل بريدك الإلكتروني. ستصلك رسالة لإعادة تعيين كلمة المرور.',
    category: 'الحساب'
  }
];

const categories = ['الكل', 'البداية', 'المهام', 'الملاحظات', 'الأهداف', 'المالية', 'الإعدادات', 'النسخ الاحتياطي', 'الحساب'];

export default function HelpScreen() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQ = selectedCategory === 'الكل' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'المساعدة',
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
            <HelpCircle color="#2D5A3D" size={32} strokeWidth={2} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            مركز المساعدة
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            ابحث عن إجابات لأسئلتك الشائعة
          </Text>
        </View>

        {/* Quick Help Options */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            مساعدة سريعة
          </Text>
          
          <TouchableOpacity style={styles.helpOption}>
            <View style={styles.helpOptionLeft}>
              <View style={styles.helpIcon}>
                <BookOpen color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <View>
                <Text style={[styles.helpOptionTitle, { color: theme.colors.text }]}>
                  دليل المستخدم
                </Text>
                <Text style={[styles.helpOptionSubtitle, { color: theme.colors.textSecondary }]}>
                  تعلم كيفية استخدام جميع ميزات التطبيق
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpOption}>
            <View style={styles.helpOptionLeft}>
              <View style={styles.helpIcon}>
                <Video color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <View>
                <Text style={[styles.helpOptionTitle, { color: theme.colors.text }]}>
                  فيديوهات تعليمية
                </Text>
                <Text style={[styles.helpOptionSubtitle, { color: theme.colors.textSecondary }]}>
                  شاهد فيديوهات توضيحية قصيرة
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.helpOption, { borderBottomWidth: 0 }]}>
            <View style={styles.helpOptionLeft}>
              <View style={styles.helpIcon}>
                <MessageCircle color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <View>
                <Text style={[styles.helpOptionTitle, { color: theme.colors.text }]}>
                  تواصل مع الدعم
                </Text>
                <Text style={[styles.helpOptionSubtitle, { color: theme.colors.textSecondary }]}>
                  احصل على مساعدة شخصية من فريقنا
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            الأسئلة الشائعة
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    { color: selectedCategory === category ? '#FFFFFF' : theme.colors.text }
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ Items */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          {filteredFAQ.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.faqItem,
                index === filteredFAQ.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={() => toggleExpanded(item.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
                  {item.question}
                </Text>
                {expandedItems.includes(item.id) ? (
                  <ChevronUp color={theme.colors.textSecondary} size={20} strokeWidth={2} />
                ) : (
                  <ChevronDown color={theme.colors.textSecondary} size={20} strokeWidth={2} />
                )}
              </View>
              
              {expandedItems.includes(item.id) && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
                    {item.answer}
                  </Text>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>
                      {item.category}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Still Need Help */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            لا تزال تحتاج مساعدة؟
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            إذا لم تجد إجابة لسؤالك، لا تتردد في التواصل مع فريق الدعم. نحن هنا لمساعدتك!
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <MessageCircle color="#FFFFFF" size={20} strokeWidth={2} />
            <Text style={styles.contactButtonText}>
              تواصل مع الدعم
            </Text>
          </TouchableOpacity>
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
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  helpOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1F4E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  helpOptionTitle: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '600',
    marginBottom: 2,
  },
  helpOptionSubtitle: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    color: '#666',
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#A2E9C1',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    fontWeight: '600',
  },
  faqItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
    textAlign: 'right',
  },
  faqAnswerContainer: {
    marginTop: 15,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    lineHeight: 20,
    textAlign: 'right',
    marginBottom: 10,
  },
  categoryTag: {
    alignSelf: 'flex-end',
    backgroundColor: '#D1F4E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 12,
    fontFamily: "Tajawal_400Regular",
    color: '#2D5A3D',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
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
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    marginLeft: 8,
  },
});