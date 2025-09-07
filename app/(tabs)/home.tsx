import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTasks, Task } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Redirect } from 'expo-router';
import TaskTable from '@/components/TaskTable';
import TaskForm from '@/components/TaskForm';
import AdManager from '@/components/ads/AdManager';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Sun, Moon, Bell } from 'lucide-react-native';
import NotificationService from '@/services/NotificationService';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

export default function DailyTasksScreen() {
  
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { getTasksByCategory, toggleTask, tasks, isLoading: tasksLoading } = useTasks();
  const { isInitialized } = useNotifications();

  // Test notification function
  const testNotification = async () => {
    try {
      console.log('🧪 اختبار نظام الإشعارات...');
      
      // Test smart notification
      const testTime = new Date();
      testTime.setSeconds(testTime.getSeconds() + 5); // 5 seconds from now
      
      await NotificationService.scheduleSmartNotification({
        id: 'test_notification',
        type: 'motivational',
        title: 'اختبار الإشعارات 🧪',
        body: 'نظام الإشعارات يعمل بشكل ممتاز! 🎉 مرحباً بك في Growupe',
        scheduledTime: testTime,
        repeat: 'none'
      });
      
      console.log('✅ تم جدولة إشعار الاختبار بنجاح!');
    } catch (error) {
      console.error('❌ خطأ في اختبار الإشعارات:', error);
    }
  };

  const dailyTasks = getTasksByCategory('daily');
  const weeklyTasks = getTasksByCategory('weekly');
  const monthlyTasks = getTasksByCategory('monthly');

  // Debug: Log tasks when they change
  useEffect(() => {
    console.log('Tasks updated in home.tsx:', {
      activeTab,
      total: tasks.length,
      daily: dailyTasks.length,
      weekly: weeklyTasks.length,
      monthly: monthlyTasks.length,
      tasks: tasks.map(t => ({ id: t.id, title: t.title, category: t.category }))
    });
  }, [tasks, dailyTasks, weeklyTasks, monthlyTasks, activeTab]);

  const getTaskCount = (category: 'daily' | 'weekly' | 'monthly') => {
    const tasks = getTasksByCategory(category);
    const completed = tasks.filter(task => task.status === 'completed').length;
    return { total: tasks.length, completed };
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث حالة المهمة');
    }
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const tabs = [
    {
      key: 'daily' as const,
      title: 'يومية',
      icon: '🗓️',
      count: getTaskCount('daily'),
    },
    {
      key: 'weekly' as const,
      title: 'أسبوعية',
      icon: '📅',
      count: getTaskCount('weekly'),
    },
    {
      key: 'monthly' as const,
      title: 'شهرية',
      icon: '📆',
      count: getTaskCount('monthly'),
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    greeting: {
      alignItems: 'flex-end',
    },
    greetingText: {
      fontSize: 16,
  fontFamily:'Tajawal_700Bold'
  
  
    },
    userName: {
      fontSize: 24,

      color: theme.colors.text,
      marginTop: 4,
      fontFamily: "Tajawal_700Bold"

    },
    headerActions: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
    },
    testButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      opacity: isInitialized ? 1 : 0.5,
    },
    themeButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
    },
     tabsContainer: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
  },
  tab: {
    flex: 1,

    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 72,
  },
  activeTab: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.03 }],
  },
  activeTabGradient: {
    borderWidth: 0,
    margin: 0,
    borderRadius: 16,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4,
    color: '#4B5563',
    fontFamily: 'Tajawal_500Medium',
  },
  activeTabIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  tabTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  activeTabTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Tajawal_700Bold',
  },
  tabCount: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
  },
  activeTabCount: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
  },
    fab: {
      position: 'absolute',
      bottom: 30,
      left: 80,
      right: 60,
      borderRadius: 25,
      paddingVertical: 18,
      paddingHorizontal: 16,
      width:210,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#D1F4E0',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    fabText: {
      fontSize: 18,
   
      color: '#2D5A3D',
      marginLeft: 8,
    fontFamily:'Tajawal_500Medium'
    },
    content: {
      flex: 1,
    },
    adContainer: {
      marginHorizontal: 16,
      marginBottom: 8,
    },
  });
if (!fontsLoaded) {
    return null;
  }
  return (
    <AdManager showBanner={true} bannerPosition="bottom">
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.testButton} 
              onPress={testNotification}
              disabled={!isInitialized}
            >
              <Bell size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
              {theme.isDark ? (
                <Sun size={24} color={theme.colors.text} />
              ) : (
                <Moon size={24} color={theme.colors.text} />
              )}
            </TouchableOpacity>
          </View>
          
          <View  style={styles.greeting} >
            <Text style={styles.greetingText}>مرحباً</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
        </View>

       <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab]}
          onPress={() => setActiveTab(tab.key)}
          activeOpacity={0.7}
        >
          {activeTab === tab.key ? (
            <LinearGradient
              colors={['#FF6B35', '#FF8A50', '#FFB300']}
              style={[styles.tab, styles.activeTabGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.tabContent}>
                <Text style={[styles.tabIcon, styles.activeTabIcon]}>{tab.icon}</Text>
                <Text style={[styles.tabTitle, styles.activeTabTitle]}>
                  {tab.title}
                </Text>
                <Text style={[styles.tabCount, styles.activeTabCount]}>
                  {tab.count.completed}/{tab.count.total}
                </Text>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.tabContent}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={styles.tabTitle}>{tab.title}</Text>
              <Text style={styles.tabCount}>
                {tab.count.completed}/{tab.count.total}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
      </View>

      <View style={styles.content}>
        <TaskTable category={activeTab} onEditTask={handleEditTask} />
      </View>

        {/* إعلان البانر - مؤقتاً معطل */}
        {/* <AdManager
          showBanner={true}
          showRewardedVideo={false}
          bannerPosition="bottom"
          style={styles.adContainer}
        /> */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowTaskForm(true)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Plus size={22} color="#2D5A3D" />
          <Text style={styles.fabText}>إضافة مهمة جديدة</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showTaskForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseForm}
      >
        <TaskForm
          category={activeTab}
          onClose={handleCloseForm}
          editTask={editingTask || undefined}
        />
      </Modal>
      </SafeAreaView>
    </AdManager>
  );
}