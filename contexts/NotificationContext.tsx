import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import NotificationService, { UserActivity } from '@/services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  enabled: boolean;
  dailyMotivation: boolean;
  weeklyReview: boolean;
  monthlyPlanning: boolean;
  financeAlerts: boolean;
  goalProgress: boolean;
  taskReminders: boolean;
  noteReminders: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  dailyMotivation: true,
  weeklyReview: true,
  monthlyPlanning: true,
  financeAlerts: true,
  goalProgress: true,
  taskReminders: true,
  noteReminders: true,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  }
};

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastActivityCheck, setLastActivityCheck] = useState<Date>(new Date());

  // Initialize notification system
  const initializeNotifications = useCallback(async () => {
    try {
      console.log('🔔 تهيئة نظام الإشعارات الذكي...');
      
      // Initialize user activity tracking (this doesn't use API)
      await NotificationService.initializeUserActivity();
      
      // Load notification settings
      const savedSettings = await AsyncStorage.getItem('notification_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
        console.log('📋 تم تحميل إعدادات الإشعارات المحفوظة');
      } else {
        // Save default settings
        await AsyncStorage.setItem('notification_settings', JSON.stringify(defaultSettings));
        console.log('⚙️ تم حفظ الإعدادات الافتراضية للإشعارات');
      }
      
      // Request permissions first
      const hasPermissions = await NotificationService.requestPermissions();
      if (hasPermissions) {
        console.log('✅ تم منح أذونات الإشعارات');
        
        // Setup periodic notifications (this doesn't use API)
        await NotificationService.setupPeriodicNotifications();
      } else {
        console.log('⚠️ لم يتم منح أذونات الإشعارات - سيتم استخدام النظام المحلي');
        // Still setup notifications using local system
        await NotificationService.setupPeriodicNotifications();
      }
      
      // Update user activity - app opened (this doesn't use API)
      await NotificationService.updateUserActivity({
        lastLogin: new Date()
      });
      
      setIsInitialized(true);
      console.log('🎉 تم تفعيل نظام الإشعارات الذكي بنجاح!');
      
      // Log system status for debugging
      setTimeout(() => {
        NotificationService.logSystemStatus();
      }, 3000); // Wait 3 seconds for everything to initialize
    } catch (error) {
      console.error('❌ خطأ في تهيئة نظام الإشعارات:', error);
      // Even if there's an error, mark as initialized to prevent blocking the app
      setIsInitialized(true);
    }
  }, []);

  // Update notification settings
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      await AsyncStorage.setItem('notification_settings', JSON.stringify(updatedSettings));
      console.log('✅ Notification settings updated');
    } catch (error) {
      console.error('❌ Error saving notification settings:', error);
    }
  }, [settings]);

  // Track user activity in different sections
  const trackActivity = useCallback(async (section: 'tasks' | 'finance' | 'notes' | 'goals', data?: any) => {
    const now = new Date();
    const updates: Partial<UserActivity> = {};
    
    switch (section) {
      case 'tasks':
        updates.lastTaskActivity = now;
        if (data?.totalTasks !== undefined) updates.totalTasks = data.totalTasks;
        if (data?.completedTasks !== undefined) updates.completedTasks = data.completedTasks;
        break;
      case 'finance':
        updates.lastFinanceActivity = now;
        if (data?.monthlyExpenses !== undefined) updates.monthlyExpenses = data.monthlyExpenses;
        if (data?.monthlyIncome !== undefined) updates.monthlyIncome = data.monthlyIncome;
        break;
      case 'notes':
        updates.lastNotesActivity = now;
        break;
      case 'goals':
        updates.lastGoalsActivity = now;
        if (data?.activeGoals !== undefined) updates.activeGoals = data.activeGoals;
        break;
    }
    
    await NotificationService.updateUserActivity(updates);
    
    // Check for conditional notifications every 30 minutes
    const timeSinceLastCheck = now.getTime() - lastActivityCheck.getTime();
    if (timeSinceLastCheck > 30 * 60 * 1000) { // 30 minutes
      await NotificationService.checkAndSendConditionalNotifications();
      setLastActivityCheck(now);
    }
  }, [lastActivityCheck]);

  // Helper function to check if time is in quiet hours
  const isInQuietHours = useCallback((time: Date): boolean => {
    if (!settings.quietHours.enabled) return false;
    
    const timeStr = time.toTimeString().substring(0, 5); // HH:MM format
    const start = settings.quietHours.start;
    const end = settings.quietHours.end;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (start > end) {
      return timeStr >= start || timeStr <= end;
    } else {
      return timeStr >= start && timeStr <= end;
    }
  }, [settings]);

  // Helper function to adjust time for quiet hours
  const adjustForQuietHours = useCallback((time: Date): Date => {
    if (!settings.quietHours.enabled) return time;
    
    const adjustedTime = new Date(time);
    const [endHour, endMinute] = settings.quietHours.end.split(':').map(Number);
    
    // Schedule for end of quiet hours + 30 minutes
    adjustedTime.setHours(endHour, endMinute + 30, 0, 0);
    
    // If the adjusted time is in the past, schedule for next day
    if (adjustedTime <= new Date()) {
      adjustedTime.setDate(adjustedTime.getDate() + 1);
    }
    
    return adjustedTime;
  }, [settings]);

  // Schedule note reminder
  const scheduleNoteReminder = useCallback(async (noteTitle: string, reminderTime: Date) => {
    if (!settings.noteReminders) {
      console.log('Note reminders are disabled');
      return null;
    }
    
    // Check quiet hours
    if (isInQuietHours(reminderTime)) {
      console.log('Reminder scheduled during quiet hours, adjusting time');
      reminderTime = adjustForQuietHours(reminderTime);
    }
    
    return await NotificationService.scheduleNoteReminder(noteTitle, reminderTime);
  }, [settings, isInQuietHours, adjustForQuietHours]);

  // Schedule note reminder after 3 hours
  const scheduleNoteReminder3Hours = useCallback(async (noteTitle: string) => {
    if (!settings.noteReminders) {
      console.log('Note reminders are disabled');
      return null;
    }
    
    return await NotificationService.scheduleNoteReminder3Hours(noteTitle);
  }, [settings]);

  // Schedule goal progress notification
  const scheduleGoalProgressNotification = useCallback(async (goalName: string, progress: number) => {
    if (!settings.goalProgress) {
      console.log('Goal progress notifications are disabled');
      return;
    }
    
    await NotificationService.scheduleGoalProgressNotification(goalName, progress);
  }, [settings]);

  // Schedule month end report
  const scheduleMonthEndReport = useCallback(async (isHighExpenses: boolean) => {
    if (!settings.financeAlerts) {
      console.log('Finance alerts are disabled');
      return;
    }
    
    await NotificationService.scheduleMonthEndReport(isHighExpenses);
  }, [settings]);



  // Handle app state changes
  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App became active, update last login
      await NotificationService.updateUserActivity({
        lastLogin: new Date()
      });
      
      // Check for conditional notifications
      await NotificationService.checkAndSendConditionalNotifications();
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeNotifications();
    
    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [initializeNotifications, handleAppStateChange]);

  // Request permissions on first load
  useEffect(() => {
    if (isInitialized && Platform.OS !== 'web') {
      NotificationService.requestPermissions().then(granted => {
        if (!granted) {
          console.log('⚠️ Notification permissions not granted');
          updateSettings({ enabled: false });
        }
      });
    }
  }, [isInitialized, updateSettings]);

  return useMemo(() => ({
    settings,
    isInitialized,
    updateSettings,
    trackActivity,
    scheduleNoteReminder,
    scheduleNoteReminder3Hours,
    scheduleGoalProgressNotification,
    scheduleMonthEndReport,
    isInQuietHours,
    adjustForQuietHours
  }), [settings, isInitialized, updateSettings, trackActivity, scheduleNoteReminder, scheduleNoteReminder3Hours, scheduleGoalProgressNotification, scheduleMonthEndReport, isInQuietHours, adjustForQuietHours]);
});

// Hook for easy access to notification tracking
export const useNotificationTracking = () => {
  const { trackActivity } = useNotifications();
  
  return {
    trackTaskActivity: (data?: { totalTasks?: number; completedTasks?: number }) => 
      trackActivity('tasks', data),
    trackFinanceActivity: (data?: { monthlyExpenses?: number; monthlyIncome?: number }) => 
      trackActivity('finance', data),
    trackNotesActivity: () => 
      trackActivity('notes'),
    trackGoalsActivity: (data?: { activeGoals?: number }) => 
      trackActivity('goals', data)
  };
};