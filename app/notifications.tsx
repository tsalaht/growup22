import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTasks } from '@/contexts/TaskContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useGoals } from '@/contexts/GoalsContext';
import { useNotes } from '@/contexts/NotesContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { router } from 'expo-router';
import { Bell, CheckCircle, Clock, AlertCircle, Target, DollarSign, FileText, Calendar, ArrowRight } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

interface NotificationItem {
  id: string;
  type: 'task' | 'finance' | 'goal' | 'note' | 'system';
  title: string;
  message: string;
  time: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

export default function NotificationsScreen() {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const { theme } = useTheme();
  const { tasks } = useTasks();
  const { currentMonthOverview } = useFinance();
  const { goals } = useGoals();
  const { notes } = useNotes();
  const { settings, isInitialized } = useNotifications();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Generate notifications based on app data
  const generateNotifications = useCallback(() => {
    const newNotifications: NotificationItem[] = [];

    // Task-based notifications
    const today = new Date();
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate || '');
      return taskDate.toDateString() === today.toDateString();
    });

    const overdueTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate || '');
      return taskDate < today && task.status !== 'completed';
    });

    const completedToday = tasks.filter(task => {
      const taskDate = new Date(task.dueDate || '');
      return taskDate.toDateString() === today.toDateString() && task.status === 'completed';
    });

    // Today's tasks notification
    if (todayTasks.length > 0) {
      newNotifications.push({
        id: 'today_tasks',
        type: 'task',
        title: 'مهام اليوم',
        message: `لديك ${todayTasks.length} مهمة مخططة لهذا اليوم`,
        time: new Date(),
        isRead: false,
        priority: 'medium',
        icon: '📋'
      });
    }

    // Overdue tasks notification
    if (overdueTasks.length > 0) {
      newNotifications.push({
        id: 'overdue_tasks',
        type: 'task',
        title: 'مهام متأخرة',
        message: `لديك ${overdueTasks.length} مهمة متأخرة تحتاج إلى متابعة`,
        time: new Date(),
        isRead: false,
        priority: 'high',
        icon: '⚠️'
      });
    }

    // Completed tasks celebration
    if (completedToday.length > 0) {
      newNotifications.push({
        id: 'completed_tasks',
        type: 'task',
        title: 'إنجاز رائع!',
        message: `أكملت ${completedToday.length} مهمة اليوم، استمر!`,
        time: new Date(),
        isRead: false,
        priority: 'low',
        icon: '🎉'
      });
    }

    // Finance-based notifications
    if (currentMonthOverview) {
      const expenseRatio = currentMonthOverview.income > 0 
        ? (currentMonthOverview.totalExpenses / currentMonthOverview.income) * 100 
        : 0;

      if (expenseRatio > 80) {
        newNotifications.push({
          id: 'high_expenses',
          type: 'finance',
          title: 'تحذير المصاريف',
          message: `مصاريفك هذا الشهر ${expenseRatio.toFixed(0)}% من راتبك`,
          time: new Date(),
          isRead: false,
          priority: 'high',
          icon: '💸'
        });
      } else if (expenseRatio < 30) {
        newNotifications.push({
          id: 'good_saving',
          type: 'finance',
          title: 'ادخار ممتاز!',
          message: `ممتاز! مصاريفك ${expenseRatio.toFixed(0)}% فقط من راتبك`,
          time: new Date(),
          isRead: false,
          priority: 'low',
          icon: '💰'
        });
      }
    }

    // Goals-based notifications
    const activeGoals = goals.filter(goal => goal.currentAmount < goal.totalCost);
    if (activeGoals.length > 0) {
      const progressGoals = activeGoals.filter(goal => {
        const progress = (goal.currentAmount / goal.totalCost) * 100;
        return progress >= 25 && progress < 100;
      });

      if (progressGoals.length > 0) {
        newNotifications.push({
          id: 'goals_progress',
          type: 'goal',
          title: 'تقدم في الأهداف',
          message: `لديك ${progressGoals.length} هدف في طور التقدم`,
          time: new Date(),
          isRead: false,
          priority: 'medium',
          icon: '🎯'
        });
      }
    }

    // Notes-based notifications
    const recentNotes = notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      const hoursDiff = (today.getTime() - noteDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff < 24; // Last 24 hours
    });

    if (recentNotes.length > 0) {
      newNotifications.push({
        id: 'recent_notes',
        type: 'note',
        title: 'ملاحظات جديدة',
        message: `أضفت ${recentNotes.length} ملاحظة في آخر 24 ساعة`,
        time: new Date(),
        isRead: false,
        priority: 'low',
        icon: '📝'
      });
    }

    // System notifications
    if (isInitialized) {
      newNotifications.push({
        id: 'system_ready',
        type: 'system',
        title: 'النظام جاهز',
        message: 'نظام الإشعارات الذكي يعمل بشكل مثالي',
        time: new Date(),
        isRead: false,
        priority: 'low',
        icon: '✅'
      });
    }

    // Daily motivation notification
    const currentHour = new Date().getHours();
    if (currentHour >= 8 && currentHour <= 10) {
      newNotifications.push({
        id: 'daily_motivation',
        type: 'system',
        title: 'صباح الطموح! 🌞',
        message: 'صباح الطموح يا صديق التغيير! خلنا ننجز اليوم مع بعض، وحدة ورا وحدة',
        time: new Date(),
        isRead: false,
        priority: 'medium',
        icon: '🌞'
      });
    }

    // Weekly review notification (Fridays)
    if (new Date().getDay() === 5) { // Friday
      newNotifications.push({
        id: 'weekly_review',
        type: 'system',
        title: 'جمعة مباركة! ✨',
        message: 'شو أنجزت هذا الأسبوع؟ راجع مهامك وسو تقييم سريع… النجاح عادة، وأنت قدّها!',
        time: new Date(),
        isRead: false,
        priority: 'medium',
        icon: '✨'
      });
    }

    // Monthly planning notification (1st of month)
    if (new Date().getDate() === 1) {
      newNotifications.push({
        id: 'monthly_planning',
        type: 'system',
        title: 'شهر جديد، أهداف جديدة! 🔄',
        message: 'نظّم مهامك من الحين، وابدأ بداية قوية مع Growupe 💚',
        time: new Date(),
        isRead: false,
        priority: 'medium',
        icon: '🔄'
      });
    }

    // Sort by priority and time
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.time.getTime() - a.time.getTime();
    });

    setNotifications(newNotifications);
  }, [tasks, currentMonthOverview, goals, notes, isInitialized]);

  // Load notifications on mount and when data changes
  useEffect(() => {
    generateNotifications();
  }, [generateNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    generateNotifications();
    setTimeout(() => setRefreshing(false), 1000);
  }, [generateNotifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return theme.colors.text;
    }
  };

  const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <Calendar size={20} color={theme.colors.primary} />;
      case 'finance': return <DollarSign size={20} color={theme.colors.primary} />;
      case 'goal': return <Target size={20} color={theme.colors.primary} />;
      case 'note': return <FileText size={20} color={theme.colors.primary} />;
      case 'system': return <Bell size={20} color={theme.colors.primary} />;
      default: return <Bell size={20} color={theme.colors.primary} />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: 20,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
      flex: 1,
      textAlign: 'center',
    },
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    markAllButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    markAllText: {
      color: 'white',
      fontFamily: 'Tajawal_500Medium',
      fontSize: 14,
    },
    unreadCount: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    unreadCountText: {
      color: 'white',
      fontFamily: 'Tajawal_500Medium',
      fontSize: 12,
    },
    content: {
      flex: 1,
    },
    notificationItem: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      marginVertical: 4,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    unreadNotification: {
      backgroundColor: theme.colors.primary + '10',
      borderLeftColor: '#EF4444',
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    notificationIcon: {
      marginRight: 12,
    },
    notificationTitle: {
      fontSize: 16,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
      flex: 1,
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      marginLeft: 8,
    },
    priorityText: {
      fontSize: 10,
      fontFamily: 'Tajawal_500Medium',
      color: 'white',
    },
    notificationMessage: {
      fontSize: 14,
      fontFamily: 'Tajawal_400Regular',
      color: theme.colors.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
    },
    notificationTime: {
      fontSize: 12,
      fontFamily: 'Tajawal_400Regular',
      color: theme.colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyMessage: {
      fontSize: 14,
      fontFamily: 'Tajawal_400Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowRight size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>الإشعارات</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Text style={styles.markAllText}>تعيين الكل كمقروء</Text>
          </TouchableOpacity>
          {unreadCount > 0 && (
            <View style={styles.unreadCount}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
            <Text style={styles.emptyMessage}>
              ستظهر الإشعارات هنا عند وجود تحديثات أو تذكيرات مهمة
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadNotification
              ]}
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.7}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationIcon}>
                  {getTypeIcon(notification.type)}
                </View>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(notification.priority) }
                ]}>
                  <Text style={styles.priorityText}>
                    {getPriorityText(notification.priority)}
                  </Text>
                </View>
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>
                {notification.time.toLocaleString('ar', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
