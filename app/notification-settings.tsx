import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Clock, DollarSign, Target, FileText, CheckSquare, Moon } from 'lucide-react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import { globalStyles } from '@/app/_layout';

export default function NotificationSettingsScreen() {
  const { settings, updateSettings, isInitialized } = useNotifications();

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    await updateSettings({ [key]: value });
  };

  const handleQuietHoursToggle = async (enabled: boolean) => {
    await updateSettings({
      quietHours: {
        ...settings.quietHours,
        enabled
      }
    });
  };

  const handleQuietHoursTime = (type: 'start' | 'end') => {
    Alert.alert(
      'تعديل الساعات الهادئة',
      `يرجى تعديل وقت ${type === 'start' ? 'البداية' : 'النهاية'} للساعات الهادئة`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'موافق' }
      ]
    );
  };

  const settingItems = [
    {
      key: 'enabled' as const,
      title: 'تفعيل الإشعارات',
      description: 'تفعيل أو إلغاء جميع الإشعارات الذكية',
      icon: Bell,
      color: '#4CAF50'
    },
    {
      key: 'dailyMotivation' as const,
      title: 'الإشعارات التحفيزية اليومية',
      description: 'رسائل تحفيزية يومية في الصباح',
      icon: CheckSquare,
      color: '#FF9800'
    },
    {
      key: 'weeklyReview' as const,
      title: 'المراجعة الأسبوعية',
      description: 'تذكير أسبوعي لمراجعة الإنجازات',
      icon: Clock,
      color: '#2196F3'
    },
    {
      key: 'monthlyPlanning' as const,
      title: 'التخطيط الشهري',
      description: 'تذكير شهري للتخطيط والأهداف',
      icon: Target,
      color: '#9C27B0'
    },
    {
      key: 'financeAlerts' as const,
      title: 'تنبيهات المالية',
      description: 'تحذيرات المصاريف والتقارير المالية',
      icon: DollarSign,
      color: '#F44336'
    },
    {
      key: 'goalProgress' as const,
      title: 'تقدم الأهداف',
      description: 'إشعارات عند تحقيق معالم الأهداف',
      icon: Target,
      color: '#4CAF50'
    },
    {
      key: 'taskReminders' as const,
      title: 'تذكيرات المهام',
      description: 'تذكيرات المهام اليومية والأسبوعية والشهرية',
      icon: CheckSquare,
      color: '#FF5722'
    },
    {
      key: 'noteReminders' as const,
      title: 'تذكيرات الملاحظات',
      description: 'تذكيرات الملاحظات المجدولة',
      icon: FileText,
      color: '#607D8B'
    }
  ];

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'إعدادات الإشعارات',
            headerStyle: { backgroundColor: '#FAFBFC' },
            headerTitleStyle: [, { fontSize: 18 }],
            headerTitleAlign: 'center',
          }}
        />
        <View style={styles.loadingContainer}>
          <Text style={[, styles.loadingText]}>
            جاري تحميل إعدادات الإشعارات...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'إعدادات الإشعارات',
          headerStyle: { backgroundColor: '#FAFBFC' },
          headerTitleStyle: [, { fontSize: 18 }],
          headerTitleAlign: 'center',
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Bell size={32} color="#4CAF50" />
          <Text style={[, styles.headerTitle]}>
            نظام الإشعارات الذكي
          </Text>
          <Text style={[, styles.headerDescription]}>
            تحكم في الإشعارات التحفيزية والتذكيرات الذكية
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[, styles.sectionTitle]}>
            الإعدادات العامة
          </Text>
          
          {settingItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <View key={item.key} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <IconComponent size={20} color={item.color} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[Medium, styles.settingTitle]}>
                      {item.title}
                    </Text>
                    <Text style={[, styles.settingDescription]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings[item.key] as boolean}
                  onValueChange={(value) => handleToggle(item.key, value)}
                  trackColor={{ false: '#E5E7EB', true: '#4CAF50' }}
                  thumbColor={settings[item.key] ? '#FFFFFF' : '#9CA3AF'}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={[, styles.sectionTitle]}>
            الساعات الهادئة
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#6366F120' }]}>
                <Moon size={20} color="#6366F1" />
              </View>
              <View style={styles.settingText}>
                <Text style={[Medium, styles.settingTitle]}>
                  تفعيل الساعات الهادئة
                </Text>
                <Text style={[, styles.settingDescription]}>
                  منع الإشعارات خلال ساعات النوم
                </Text>
              </View>
            </View>
            <Switch
              value={settings.quietHours.enabled}
              onValueChange={handleQuietHoursToggle}
              trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
              thumbColor={settings.quietHours.enabled ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>

          {settings.quietHours.enabled && (
            <View style={styles.quietHoursContainer}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleQuietHoursTime('start')}
              >
                <Text style={[, styles.timeLabel]}>
                  وقت البداية
                </Text>
                <Text style={[, styles.timeValue]}>
                  {settings.quietHours.start}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleQuietHoursTime('end')}
              >
                <Text style={[, styles.timeLabel]}>
                  وقت النهاية
                </Text>
                <Text style={[, styles.timeValue]}>
                  {settings.quietHours.end}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={[, styles.infoTitle]}>
            🌟 نظام الإشعارات الذكي
          </Text>
          <Text style={[, styles.infoText]}>
            يتكيف نظام الإشعارات مع نشاطك ويرسل لك تذكيرات مخصصة وتحفيزية في الأوقات المناسبة لمساعدتك على تحقيق أهدافك.
          </Text>
          
          <View style={styles.featuresList}>
            <Text style={[, styles.featureItem]}>
              • إشعارات تحفيزية مخصصة
            </Text>
            <Text style={[, styles.featureItem]}>
              • تذكيرات ذكية حسب نشاطك
            </Text>
            <Text style={[, styles.featureItem]}>
              • تقارير دورية عن التقدم
            </Text>
            <Text style={[, styles.featureItem]}>
              • تحذيرات مالية استباقية
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
    backgroundColor: '#FAFBFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  quietHoursContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  timeButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    color: '#1F2937',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 32,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 18,
  },
});