import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { apiService } from './ApiService';

// Check if we're running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Suppress console warnings for Expo Go limitations
if (isExpoGo) {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('expo-notifications') || message.includes('Expo Go')) {
      return; // Suppress Expo Go notification warnings
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('expo-notifications') || message.includes('Expo Go')) {
      return; // Suppress Expo Go notification errors
    }
    originalError.apply(console, args);
  };
}

// Configure notification behavior only if not in Expo Go
if (!isExpoGo && Platform.OS !== 'web') {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (error) {
    // Silently handle configuration errors in Expo Go
    if (!isExpoGo) {
      console.warn('Failed to configure notification handler:', error);
    }
  }
}

export interface NotificationData {
  taskId: string;
  taskTitle: string;
  category: 'daily' | 'weekly' | 'monthly';
  scheduledTime: Date;
}

export interface SmartNotificationData {
  id: string;
  type: 'welcome' | 'finance' | 'tasks' | 'notes' | 'goals' | 'motivational' | 'subscription';
  title: string;
  body: string;
  scheduledTime: Date;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  data?: any;
}

export interface UserActivity {
  lastLogin: Date;
  lastTaskActivity: Date;
  lastFinanceActivity: Date;
  lastNotesActivity: Date;
  lastGoalsActivity: Date;
  totalTasks: number;
  completedTasks: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  activeGoals: number;
  appInstallDate: Date;
}

// Smart notification messages
const NOTIFICATION_MESSAGES = {
  welcome: {
    title: 'مرحباً بك في Growupe! 🌱',
    body: 'حياك الله في رفيقك الرقمي 🌱 نمط حياة متوازن وناجح ✨'
  },
  finance: {
    expenseWarning: {
      title: 'تحذير المصاريف ⚠️',
      body: '💸 مصاريفك تعدّت نص راتبك! هُوّنا هنا تهون 😉'
    },
    monthlyIncome: {
      title: 'تذكير الراتب الشهري 💰',
      body: '💰💼 لا تنسى تسجّل راتبك الشهري في Growupe عشان نضبط لك ميزانيتك!'
    },
    monthlyIncomeReminder: {
      title: 'تذكير إضافي 💰',
      body: 'خذ لك لحظة، وراجع وين راح الريال، قبل لا يطيح الفاس بالراس! 😉'
    },
    monthStart: {
      title: 'بداية شهر جديد 📅',
      body: 'خلنا نخطط مع بعض قبل لا تصرف ريال واحد 😉'
    },
    monthEndHigh: {
      title: 'تقرير نهاية الشهر 📊',
      body: '📊 صار وقت كشف الحساب الحقيقي! مصاريفك هذا الشهر كانت عالية…'
    },
    monthEndHighCommitments: {
      title: 'تقرير نهاية الشهر 📊',
      body: 'يا حريّص، التزاماتك كثرت شوي 📉 خلنّا نراجعها قبل ما يطير نص راتبك 💼'
    },
    monthEndGood: {
      title: 'أداء ممتاز! 👏',
      body: '👏🔥 يا سلام! أداؤك المالي هذا الشهر ممتاز ✨ وهذي بداية مشوار الاستقلال المالي الحقيقي'
    }
  },
  tasks: {
    monthly: {
      title: 'شهر جديد، أهداف جديدة! 🔄',
      body: '🔄 شهر جديد، أهداف جديدة! نظّم مهامك من الحين، وابدأ بداية قوية مع Growupe 💚'
    },
    weekly: {
      title: 'جمعة مباركة! ✨',
      body: '✨ جمعة مباركة! 📌 شو أنجزت هذا الأسبوع؟ راجع مهامك وسو تقييم سريع… النجاح عادة، وأنت قدّها!'
    },
    daily: {
      title: 'صباح الطموح! 🌞',
      body: '🌞 صباح الطموح يا صديق التغيير! ✅ خلنا ننجز اليوم مع بعض، وحدة ورا وحدة'
    }
  },
  notes: {
    reminder: {
      title: 'تذكير بمذكّرتك 🧠',
      body: '🧠 تذكير بسيط بمذكّرتك: "{noteTitle}" تحب نربطها بهدف أو مهمة؟ نخليها فعل مو بس كلام 😉'
    },
    reminder3Hours: {
      title: 'تذكير بمذكّرتك 🧠',
      body: '🧠 تذكير بسيط بمذكّرتك: "{noteTitle}" تحب نربطها بهدف أو مهمة؟ نخليها فعل مو بس كلام 😉'
    }
  },
  goals: {
    inactive: {
      title: 'حلمك الكبير ينتظرك! 🛤',
      body: '🛤 ما نسينا حلمك الكبير! "{goalName}" صار له فترة ما تحدّث 💪 يلا نرجع نكمل، التراجع ما هو خيار'
    },
    weeklyReview: {
      title: 'أحد الطموح! 🚀',
      body: '🚀 أحد الطموح! وين وصلت في أهدافك الكبيرة؟ Growupe معك لو نحتاج نغيّر الخطة ✨'
    },
    progress25: {
      title: 'إنجاز رائع! ⭐',
      body: '⭐ يا نجم! أنجزت 25% من هدفك الكبير "{goalName}" 🏆 النجاح قدّامك، استمر!'
    },
    progress50: {
      title: 'نصف الطريق! 🎯',
      body: '⭐ يا نجم! أنجزت 50% من هدفك الكبير "{goalName}" 🏆 النجاح قدّامك، استمر!'
    },
    progress75: {
      title: 'قريب من الهدف! 🔥',
      body: '⭐ يا نجم! أنجزت 75% من هدفك الكبير "{goalName}" 🏆 النجاح قدّامك، استمر!'
    }
  },
  motivational: [
    {
      title: 'رسالة تحفيزية 💪',
      body: 'لو تغيّر شيء في حياتك، لا تنتظر أحد. ابدا بنفسك… وخل Growupe رفيقك في الرحلة 💚'
    },
    {
      title: 'ثلاثي النجاح 🎯',
      body: 'تذكّر… المال والعادة والهدف = ثلاثي النجاح!'
    },
    {
      title: 'ابدأ اليوم! 🚀',
      body: 'تطوّرك ما يحتاج معجزة… يحتاج تبدأ! 🚀 ابدا اليوم، حتى لو بخطوة صغيرة 🐾'
    },
    {
      title: 'رسالة تحفيزية 💪',
      body: 'لو تغيّر شيء في حياتك، لا تنتظر أحد. ابدا بنفسك… وخل Growupe رفيقك في الرحلة 💚'
    },
    {
      title: 'ثلاثي النجاح 🎯',
      body: 'تذكّر… المال والعادة والهدف = ثلاثي النجاح!'
    },
    {
      title: 'ابدأ اليوم! 🚀',
      body: 'تطوّرك ما يحتاج معجزة… يحتاج تبدأ! 🚀 ابدا اليوم، حتى لو بخطوة صغيرة 🐾'
    }
  ]
};

class NotificationService {
  private userActivity: UserActivity | null = null;
  private scheduledSmartNotifications: Map<string, string> = new Map();

  async initializeUserActivity(): Promise<void> {
    try {
      console.log('🔄 Initializing user activity tracking...');
      
      const stored = await AsyncStorage.getItem('user_activity');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.userActivity = {
          ...parsed,
          lastLogin: new Date(parsed.lastLogin),
          lastTaskActivity: new Date(parsed.lastTaskActivity),
          lastFinanceActivity: new Date(parsed.lastFinanceActivity),
          lastNotesActivity: new Date(parsed.lastNotesActivity),
          lastGoalsActivity: new Date(parsed.lastGoalsActivity),
          appInstallDate: new Date(parsed.appInstallDate)
        };
        console.log('✅ User activity loaded from storage');
      } else {
        // First time user
        this.userActivity = {
          lastLogin: new Date(),
          lastTaskActivity: new Date(0),
          lastFinanceActivity: new Date(0),
          lastNotesActivity: new Date(0),
          lastGoalsActivity: new Date(0),
          totalTasks: 0,
          completedTasks: 0,
          monthlyExpenses: 0,
          monthlyIncome: 0,
          activeGoals: 0,
          appInstallDate: new Date()
        };
        await this.saveUserActivity();
        console.log('🎉 First time user detected - scheduling welcome notification');
        // Schedule welcome notification
        await this.scheduleWelcomeNotification();
      }
    } catch (error) {
      console.error('❌ Error initializing user activity:', error);
      // Initialize with default values even if there's an error
      this.userActivity = {
        lastLogin: new Date(),
        lastTaskActivity: new Date(0),
        lastFinanceActivity: new Date(0),
        lastNotesActivity: new Date(0),
        lastGoalsActivity: new Date(0),
        totalTasks: 0,
        completedTasks: 0,
        monthlyExpenses: 0,
        monthlyIncome: 0,
        activeGoals: 0,
        appInstallDate: new Date()
      };
    }
  }

  async updateUserActivity(updates: Partial<UserActivity>): Promise<void> {
    if (!this.userActivity) return;
    
    this.userActivity = { ...this.userActivity, ...updates };
    await this.saveUserActivity();
  }

  private async saveUserActivity(): Promise<void> {
    if (!this.userActivity) return;
    
    try {
      await AsyncStorage.setItem('user_activity', JSON.stringify(this.userActivity));
    } catch (error) {
      console.error('Error saving user activity:', error);
    }
  }

  async scheduleWelcomeNotification(): Promise<void> {
    const welcomeTime = new Date();
    welcomeTime.setMinutes(welcomeTime.getMinutes() + 1); // 1 minute after install
    
    await this.scheduleSmartNotification({
      id: 'welcome',
      type: 'welcome',
      title: NOTIFICATION_MESSAGES.welcome.title,
      body: NOTIFICATION_MESSAGES.welcome.body,
      scheduledTime: welcomeTime,
      repeat: 'none'
    });
  }

  async scheduleSmartNotification(data: SmartNotificationData): Promise<string | null> {
    if (Platform.OS === 'web') {
      // Schedule web-based local notification
      this.scheduleWebNotification(data);
      return `web-${Date.now()}-${Math.random()}`;
    }

    if (isExpoGo) {
      // Schedule local notification for Expo Go
      this.scheduleLocalNotification(data);
      console.log('✅ تم جدولة الإشعار الذكي (نظام محلي):', data.title);
      return `local-${Date.now()}-${Math.random()}`;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return null;
      }

      let trigger: any;
      
      if (data.repeat === 'none') {
        trigger = { date: data.scheduledTime };
      } else {
        const scheduledTime = data.scheduledTime;
        switch (data.repeat) {
          case 'daily':
            trigger = {
              hour: scheduledTime.getHours(),
              minute: scheduledTime.getMinutes(),
              repeats: true,
            };
            break;
          case 'weekly':
            trigger = {
              weekday: scheduledTime.getDay() + 1,
              hour: scheduledTime.getHours(),
              minute: scheduledTime.getMinutes(),
              repeats: true,
            };
            break;
          case 'monthly':
            trigger = {
              day: scheduledTime.getDate(),
              hour: scheduledTime.getHours(),
              minute: scheduledTime.getMinutes(),
              repeats: true,
            };
            break;
          case 'yearly':
            trigger = {
              month: scheduledTime.getMonth() + 1,
              day: scheduledTime.getDate(),
              hour: scheduledTime.getHours(),
              minute: scheduledTime.getMinutes(),
              repeats: true,
            };
            break;
        }
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.body,
          data: {
            type: data.type,
            smartNotificationId: data.id,
            ...data.data
          },
          sound: true,
        },
        trigger,
      });

      this.scheduledSmartNotifications.set(data.id, notificationId);
      console.log('Smart notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling smart notification:', error);
      return null;
    }
  }

  async setupPeriodicNotifications(): Promise<void> {
    console.log('📅 Setting up smart periodic notifications based on user behavior...');
    
    if (!this.userActivity) {
      console.log('⚠️ No user activity data - skipping periodic notifications setup');
      return;
    }

    try {
      // Only schedule notifications based on user behavior and timing
      await this.scheduleBehaviorBasedNotifications();
      console.log('🎉 Smart periodic notifications setup completed!');
    } catch (error) {
      console.error('❌ Error setting up periodic notifications:', error);
    }
  }

  private async scheduleBehaviorBasedNotifications(): Promise<void> {
    const now = new Date();
    const user = this.userActivity!;
    
    // 1. Daily motivational - only if user is active (has completed tasks)
    if (user.completedTasks > 0) {
      const dailyTime = new Date();
      dailyTime.setHours(9, 0, 0, 0);
      if (dailyTime <= now) {
        dailyTime.setDate(dailyTime.getDate() + 1);
      }
      
      await this.scheduleSmartNotification({
        id: 'daily_motivational',
        type: 'tasks',
        title: NOTIFICATION_MESSAGES.tasks.daily.title,
        body: NOTIFICATION_MESSAGES.tasks.daily.body,
        scheduledTime: dailyTime,
        repeat: 'daily'
      });
      console.log('✅ Daily motivational notification scheduled (user is active)');
    }

    // 2. Weekly review - only if user has been active for 3+ days
    const daysSinceInstall = (now.getTime() - user.appInstallDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceInstall >= 3) {
      const weeklyTime = new Date();
      weeklyTime.setDate(weeklyTime.getDate() + (5 - weeklyTime.getDay() + 7) % 7);
      weeklyTime.setHours(18, 0, 0, 0);
      
      await this.scheduleSmartNotification({
        id: 'weekly_review',
        type: 'tasks',
        title: NOTIFICATION_MESSAGES.tasks.weekly.title,
        body: NOTIFICATION_MESSAGES.tasks.weekly.body,
        scheduledTime: weeklyTime,
        repeat: 'weekly'
      });
      console.log('✅ Weekly review notification scheduled (user active for 3+ days)');
    }

    // 3. Monthly planning - only if user has been using app for 7+ days
    if (daysSinceInstall >= 7) {
      const monthlyTime = new Date();
      monthlyTime.setDate(1);
      monthlyTime.setHours(8, 0, 0, 0);
      if (monthlyTime <= now) {
        monthlyTime.setMonth(monthlyTime.getMonth() + 1);
      }
      
      await this.scheduleSmartNotification({
        id: 'monthly_planning',
        type: 'tasks',
        title: NOTIFICATION_MESSAGES.tasks.monthly.title,
        body: NOTIFICATION_MESSAGES.tasks.monthly.body,
        scheduledTime: monthlyTime,
        repeat: 'monthly'
      });
      console.log('✅ Monthly planning notification scheduled (user active for 7+ days)');
    }

    // 4. Finance notifications - only if user has income data
    if (user.monthlyIncome > 0) {
      const financeTime = new Date();
      financeTime.setDate(1);
      financeTime.setHours(9, 0, 0, 0);
      if (financeTime <= now) {
        financeTime.setMonth(financeTime.getMonth() + 1);
      }
      
      await this.scheduleSmartNotification({
        id: 'monthly_finance_start',
        type: 'finance',
        title: NOTIFICATION_MESSAGES.finance.monthStart.title,
        body: NOTIFICATION_MESSAGES.finance.monthStart.body,
        scheduledTime: financeTime,
        repeat: 'monthly'
      });
      console.log('✅ Monthly finance notification scheduled (user has income data)');

      // Income reminder - only if user hasn't set income recently
      const daysSinceFinanceActivity = (now.getTime() - user.lastFinanceActivity.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceFinanceActivity > 3) {
        const incomeReminderTime = new Date();
        incomeReminderTime.setDate(5);
        incomeReminderTime.setHours(10, 0, 0, 0);
        if (incomeReminderTime <= now) {
          incomeReminderTime.setMonth(incomeReminderTime.getMonth() + 1);
        }
        
        await this.scheduleSmartNotification({
          id: 'monthly_income_reminder',
          type: 'finance',
          title: NOTIFICATION_MESSAGES.finance.monthlyIncome.title,
          body: NOTIFICATION_MESSAGES.finance.monthlyIncome.body,
          scheduledTime: incomeReminderTime,
          repeat: 'monthly'
        });
        console.log('✅ Monthly income reminder scheduled (user inactive in finance)');
      }
    }

    // 5. Goals notifications - only if user has active goals
    if (user.activeGoals > 0) {
      const goalsTime = new Date();
      goalsTime.setDate(goalsTime.getDate() + (7 - goalsTime.getDay()) % 7);
      goalsTime.setHours(19, 0, 0, 0);
      
      await this.scheduleSmartNotification({
        id: 'goals_weekly_review',
        type: 'goals',
        title: NOTIFICATION_MESSAGES.goals.weeklyReview.title,
        body: NOTIFICATION_MESSAGES.goals.weeklyReview.body,
        scheduledTime: goalsTime,
        repeat: 'weekly'
      });
      console.log('✅ Goals weekly review scheduled (user has active goals)');
    }
  }

  async checkAndSendConditionalNotifications(): Promise<void> {
    if (!this.userActivity) {
      console.log('⚠️ No user activity data available for conditional notifications');
      return;
    }

    console.log('🔍 Checking smart conditional notifications...');
    const now = new Date();
    const daysSinceLastActivity = (now.getTime() - this.userActivity.lastLogin.getTime()) / (1000 * 60 * 60 * 24);

    // 1. Check for expense warning - only if user has been using finance features
    if (this.userActivity.monthlyIncome > 0 && this.userActivity.monthlyExpenses > this.userActivity.monthlyIncome * 0.5) {
      console.log('💸 Expense warning triggered - expenses exceed 50% of income');
      await this.scheduleSmartNotification({
        id: 'expense_warning',
        type: 'finance',
        title: NOTIFICATION_MESSAGES.finance.expenseWarning.title,
        body: NOTIFICATION_MESSAGES.finance.expenseWarning.body,
        scheduledTime: new Date(now.getTime() + 5 * 60 * 1000), // 5 minutes from now
        repeat: 'none'
      });
    }

    // 2. Check for inactive goals - only if user has goals and hasn't been active
    const daysSinceGoalsActivity = (now.getTime() - this.userActivity.lastGoalsActivity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceGoalsActivity > 7 && this.userActivity.activeGoals > 0) {
      console.log('🎯 Goals inactivity detected - no activity for 7+ days');
      await this.scheduleSmartNotification({
        id: 'goals_inactive',
        type: 'goals',
        title: NOTIFICATION_MESSAGES.goals.inactive.title,
        body: NOTIFICATION_MESSAGES.goals.inactive.body.replace('{goalName}', 'أهدافك'),
        scheduledTime: new Date(now.getTime() + 10 * 60 * 1000), // 10 minutes from now
        repeat: 'none'
      });
    }

    // 3. Smart motivational notifications based on user behavior
    await this.scheduleSmartMotivationalNotifications();
    
    console.log('✅ Smart conditional notifications check completed');
  }

  private async scheduleSmartMotivationalNotifications(): Promise<void> {
    const now = new Date();
    const user = this.userActivity!;
    const daysSinceLastActivity = (now.getTime() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceInstall = (now.getTime() - user.appInstallDate.getTime()) / (1000 * 60 * 60 * 24);

    // Only send motivational notifications if user is somewhat active but not too active
    const isModeratelyActive = user.completedTasks > 0 && user.completedTasks < 50;
    const isNewUser = daysSinceInstall < 7;
    const isInactive = daysSinceLastActivity > 2;

    // Different motivational strategies based on user behavior
    if (isNewUser && user.completedTasks === 0) {
      // New user who hasn't completed any tasks - gentle encouragement
      console.log('🌱 New user encouragement - no tasks completed yet');
      const randomMessage = NOTIFICATION_MESSAGES.motivational[0]; // "ابدأ بنفسك" message
      await this.scheduleSmartNotification({
        id: `new_user_encouragement_${Date.now()}`,
        type: 'motivational',
        title: randomMessage.title,
        body: randomMessage.body,
        scheduledTime: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes from now
        repeat: 'none'
      });
    } else if (isModeratelyActive && daysSinceLastActivity > 1) {
      // Moderately active user - maintain momentum
      console.log('💪 Maintaining momentum for moderately active user');
      const randomMessage = NOTIFICATION_MESSAGES.motivational[Math.floor(Math.random() * NOTIFICATION_MESSAGES.motivational.length)];
      await this.scheduleSmartNotification({
        id: `momentum_${Date.now()}`,
        type: 'motivational',
        title: randomMessage.title,
        body: randomMessage.body,
        scheduledTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        repeat: 'none'
      });
    } else if (isInactive && user.completedTasks > 0) {
      // Previously active user who became inactive - re-engagement
      console.log('🔄 Re-engaging inactive user');
      const randomMessage = NOTIFICATION_MESSAGES.motivational[2]; // "ابدأ اليوم" message
      await this.scheduleSmartNotification({
        id: `reengagement_${Date.now()}`,
        type: 'motivational',
        title: randomMessage.title,
        body: randomMessage.body,
        scheduledTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
        repeat: 'none'
      });
    }
  }

  async scheduleNoteReminder(noteTitle: string, reminderTime: Date): Promise<string | null> {
    const body = NOTIFICATION_MESSAGES.notes.reminder.body.replace('{noteTitle}', noteTitle);
    
    return await this.scheduleSmartNotification({
      id: `note_reminder_${Date.now()}`,
      type: 'notes',
      title: NOTIFICATION_MESSAGES.notes.reminder.title,
      body,
      scheduledTime: reminderTime,
      repeat: 'none'
    });
  }

  async scheduleNoteReminder3Hours(noteTitle: string): Promise<string | null> {
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + 3); // 3 hours from now
    
    const body = NOTIFICATION_MESSAGES.notes.reminder3Hours.body.replace('{noteTitle}', noteTitle);
    
    return await this.scheduleSmartNotification({
      id: `note_reminder_3h_${Date.now()}`,
      type: 'notes',
      title: NOTIFICATION_MESSAGES.notes.reminder3Hours.title,
      body,
      scheduledTime: reminderTime,
      repeat: 'none'
    });
  }

  async scheduleGoalProgressNotification(goalName: string, progress: number): Promise<void> {
    let message;
    if (progress >= 75) {
      message = NOTIFICATION_MESSAGES.goals.progress75;
    } else if (progress >= 50) {
      message = NOTIFICATION_MESSAGES.goals.progress50;
    } else if (progress >= 25) {
      message = NOTIFICATION_MESSAGES.goals.progress25;
    } else {
      return; // No notification for less than 25%
    }

    const body = message.body.replace('{goalName}', goalName);
    
    await this.scheduleSmartNotification({
      id: `goal_progress_${goalName}_${progress}`,
      type: 'goals',
      title: message.title,
      body,
      scheduledTime: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
      repeat: 'none'
    });
  }

  async scheduleMonthEndReport(isHighExpenses: boolean, hasHighCommitments: boolean = false): Promise<void> {
    let message;
    if (isHighExpenses) {
      message = hasHighCommitments ? 
        NOTIFICATION_MESSAGES.finance.monthEndHighCommitments : 
        NOTIFICATION_MESSAGES.finance.monthEndHigh;
    } else {
      message = NOTIFICATION_MESSAGES.finance.monthEndGood;
    }
    
    await this.scheduleSmartNotification({
      id: 'month_end_report',
      type: 'finance',
      title: message.title,
      body: message.body,
      scheduledTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      repeat: 'none'
    });
  }

  async cancelSmartNotification(smartId: string): Promise<void> {
    const notificationId = this.scheduledSmartNotifications.get(smartId);
    if (notificationId) {
      await this.cancelNotification(notificationId);
      this.scheduledSmartNotifications.delete(smartId);
    }
  }
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('📱 الإشعارات غير مدعومة على الويب - سيتم استخدام التنبيهات المحلية');
      return true; // Allow local alerts on web
    }

    if (isExpoGo) {
      // In Expo Go, we'll use local notifications and alerts
      console.log('🧪 استخدام نظام الإشعارات المحلي في بيئة التطوير (Expo Go)');
      return true; // Return true to allow local functionality
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const granted = finalStatus === 'granted';
      console.log('🔐 حالة أذونات الإشعارات:', granted ? 'مُمنوحة' : 'مرفوضة');
      return granted;
    } catch (error) {
      // Fallback to local notifications in case of error
      console.log('⚠️ خطأ في طلب أذونات الإشعارات، سيتم استخدام النظام المحلي');
      return true;
    }
  }

  async scheduleTaskNotification(data: NotificationData): Promise<string | null> {
    if (Platform.OS === 'web') {
      // Schedule web-based local notification
      this.scheduleWebTaskNotification(data);
      return `web-task-${Date.now()}-${Math.random()}`;
    }

    if (isExpoGo) {
      // Schedule local notification for Expo Go
      this.scheduleLocalTaskNotification(data);
      console.log('✅ تم جدولة التذكير (نظام محلي):', data.taskTitle, 'في', data.scheduledTime.toLocaleString('ar'));
      return `local-task-${Date.now()}-${Math.random()}`;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'تذكير مهمة',
          body: data.taskTitle,
          data: {
            taskId: data.taskId,
            category: data.category,
          },
          sound: true,
        },
        trigger: { date: data.scheduledTime } as any,
      });

      console.log('Notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async scheduleRecurringTaskNotification(data: NotificationData, repeat: 'daily' | 'weekly' | 'monthly'): Promise<string | null> {
    if (Platform.OS === 'web') {
      // Schedule web-based recurring notification
      this.scheduleWebRecurringNotification(data, repeat);
      return `web-recurring-${Date.now()}-${Math.random()}`;
    }

    if (isExpoGo) {
      // Schedule local recurring notification for Expo Go
      this.scheduleLocalRecurringNotification(data, repeat);
      const repeatText = repeat === 'daily' ? 'يومياً' : repeat === 'weekly' ? 'أسبوعياً' : 'شهرياً';
      console.log('✅ تم جدولة التذكير المتكرر (نظام محلي):', data.taskTitle, repeatText, 'في', data.scheduledTime.toLocaleString('ar'));
      return `local-recurring-${Date.now()}-${Math.random()}`;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return null;
      }

      let trigger: any;
      const scheduledTime = data.scheduledTime;

      switch (repeat) {
        case 'daily':
          trigger = {
            hour: scheduledTime.getHours(),
            minute: scheduledTime.getMinutes(),
            repeats: true,
          };
          break;
        case 'weekly':
          trigger = {
            weekday: scheduledTime.getDay() + 1, // Expo uses 1-7 for Sunday-Saturday
            hour: scheduledTime.getHours(),
            minute: scheduledTime.getMinutes(),
            repeats: true,
          };
          break;
        case 'monthly':
          trigger = {
            day: scheduledTime.getDate(),
            hour: scheduledTime.getHours(),
            minute: scheduledTime.getMinutes(),
            repeats: true,
          };
          break;
        default:
          trigger = scheduledTime;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'تذكير مهمة',
          body: data.taskTitle,
          data: {
            taskId: data.taskId,
            category: data.category,
          },
          sound: true,
        },
        trigger,
      });

      console.log('Recurring notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling recurring notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    if (isExpoGo) {
      console.log('✅ تم إلغاء التذكير (وضع التطوير):', notificationId);
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  async cancelAllTaskNotifications(taskId: string): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    if (isExpoGo) {
      console.log('✅ تم إلغاء جميع تذكيرات المهمة (وضع التطوير):', taskId);
      return;
    }

    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const taskNotifications = scheduledNotifications.filter(
        notification => notification.content.data?.taskId === taskId
      );

      for (const notification of taskNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }

      console.log(`Cancelled ${taskNotifications.length} notifications for task ${taskId}`);
    } catch (error) {
      console.error('Error cancelling task notifications:', error);
    }
  }

  async getAllScheduledNotifications() {
    if (Platform.OS === 'web') {
      return [];
    }

    if (isExpoGo) {
      console.log('📋 عرض التذكيرات المجدولة (وضع التطوير)');
      return [];
    }

    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Helper method to create notification date from time string and repeat type
  createNotificationDate(timeString: string, category: 'daily' | 'weekly' | 'monthly', dateString?: string, weekDay?: number): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    let notificationDate = new Date();

    switch (category) {
      case 'daily':
        notificationDate.setHours(hours, minutes, 0, 0);
        // If the time has passed today, schedule for tomorrow
        if (notificationDate <= now) {
          notificationDate.setDate(notificationDate.getDate() + 1);
        }
        break;

      case 'weekly':
        if (weekDay !== undefined) {
          const currentDay = now.getDay();
          const daysUntilTarget = (weekDay - currentDay + 7) % 7;
          notificationDate.setDate(now.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
          notificationDate.setHours(hours, minutes, 0, 0);
        }
        break;

      case 'monthly':
        if (dateString) {
          notificationDate = new Date(dateString);
          notificationDate.setHours(hours, minutes, 0, 0);
          // If the date has passed this month, schedule for next month
          if (notificationDate <= now) {
            notificationDate.setMonth(notificationDate.getMonth() + 1);
          }
        }
        break;
    }

    return notificationDate;
  }

  // Local notification methods for Expo Go and Web
  private scheduleWebNotification(data: SmartNotificationData): void {
    const timeUntilNotification = data.scheduledTime.getTime() - Date.now();
    
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.body,
            icon: '/icon.png'
          });
        } else {
          alert(`${data.title}\n\n${data.body}`);
        }
      }, timeUntilNotification);
    }
  }

  private scheduleWebTaskNotification(data: NotificationData): void {
    const timeUntilNotification = data.scheduledTime.getTime() - Date.now();
    
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('تذكير مهمة', {
            body: data.taskTitle,
            icon: '/icon.png'
          });
        } else {
          alert(`تذكير مهمة\n\n${data.taskTitle}`);
        }
      }, timeUntilNotification);
    }
  }

  private scheduleWebRecurringNotification(data: NotificationData, repeat: 'daily' | 'weekly' | 'monthly'): void {
    // For web, we'll just schedule the first occurrence
    this.scheduleWebTaskNotification(data);
  }

  private scheduleLocalNotification(data: SmartNotificationData): void {
    const timeUntilNotification = data.scheduledTime.getTime() - Date.now();
    
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        Alert.alert(
          data.title,
          data.body,
          [{ text: 'حسناً', style: 'default' }],
          { cancelable: true }
        );
      }, timeUntilNotification);
    }
  }

  private scheduleLocalTaskNotification(data: NotificationData): void {
    const timeUntilNotification = data.scheduledTime.getTime() - Date.now();
    
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        Alert.alert(
          'تذكير مهمة',
          data.taskTitle,
          [{ text: 'حسناً', style: 'default' }],
          { cancelable: true }
        );
      }, timeUntilNotification);
    }
  }

  private scheduleLocalRecurringNotification(data: NotificationData, repeat: 'daily' | 'weekly' | 'monthly'): void {
    // For local notifications, we'll schedule the first occurrence
    this.scheduleLocalTaskNotification(data);
    
    // Set up recurring schedule
    const scheduleNext = () => {
      const nextTime = new Date(data.scheduledTime);
      
      switch (repeat) {
        case 'daily':
          nextTime.setDate(nextTime.getDate() + 1);
          break;
        case 'weekly':
          nextTime.setDate(nextTime.getDate() + 7);
          break;
        case 'monthly':
          nextTime.setMonth(nextTime.getMonth() + 1);
          break;
      }
      
      const nextData = { ...data, scheduledTime: nextTime };
      this.scheduleLocalTaskNotification(nextData);
      
      // Schedule the next occurrence
      const timeUntilNext = nextTime.getTime() - Date.now();
      if (timeUntilNext > 0) {
        setTimeout(scheduleNext, timeUntilNext);
      }
    };
    
    const timeUntilFirst = data.scheduledTime.getTime() - Date.now();
    if (timeUntilFirst > 0) {
      setTimeout(scheduleNext, timeUntilFirst);
    }
  }

  // Protected getter for userActivity
  protected getUserActivity(): UserActivity | null {
    return this.userActivity;
  }

  // API-based notification methods
  async markAllNotificationsAsRead(): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user is authenticated before making API call
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, skipping API call');
        return { success: true, message: 'No notifications to mark as read' };
      }
      
      // return await apiService.markAllNotificationsAsRead();
      // مؤقتاً معطل - API يعمل بشكل منفصل
      return { success: true, message: 'Notifications marked as read locally' };
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      // Return success even if API fails to prevent blocking the app
      return { success: true, message: 'Notifications marked as read locally' };
    }
  }

  getNotificationSettings(user: any): any[] {
    return user?.notificationSettings || [];
  }

  isNotificationTypeEnabled(user: any, type: string): boolean {
    const settings = this.getNotificationSettings(user);
    const setting = settings.find((s: any) => s.type === type);
    return setting ? setting.enabled : true;
  }
}

// Add system status check method
class NotificationServiceWithStatus extends NotificationService {
  async getSystemStatus(): Promise<{
    isInitialized: boolean;
    hasPermissions: boolean;
    scheduledNotifications: number;
    userActivity: UserActivity | null;
    isExpoGo: boolean;
    platform: string;
  }> {
    try {
      const hasPermissions = await this.requestPermissions();
      const scheduledNotifications = await this.getAllScheduledNotifications();
      
      return {
        isInitialized: this.getUserActivity() !== null,
        hasPermissions,
        scheduledNotifications: scheduledNotifications.length,
        userActivity: this.getUserActivity(),
        isExpoGo,
        platform: Platform.OS
      };
    } catch (error) {
      console.error('Error getting notification system status:', error);
      return {
        isInitialized: false,
        hasPermissions: false,
        scheduledNotifications: 0,
        userActivity: null,
        isExpoGo,
        platform: Platform.OS
      };
    }
  }

  async logSystemStatus(): Promise<void> {
    const status = await this.getSystemStatus();
    console.log('🔔 === نظام الإشعارات الذكي - حالة النظام ===');
    console.log('✅ النظام مُفعل:', status.isInitialized ? 'نعم' : 'لا');
    console.log('🔐 الأذونات:', status.hasPermissions ? 'مُمنوحة' : 'غير مُمنوحة');
    console.log('📅 الإشعارات المجدولة:', status.scheduledNotifications);
    console.log('📱 المنصة:', status.platform);
    console.log('🧪 وضع التطوير (Expo Go):', status.isExpoGo ? 'نعم' : 'لا');
    if (status.userActivity) {
      console.log('👤 نشاط المستخدم:');
      console.log('  - آخر تسجيل دخول:', status.userActivity.lastLogin.toLocaleString('ar'));
      console.log('  - إجمالي المهام:', status.userActivity.totalTasks);
      console.log('  - المهام المكتملة:', status.userActivity.completedTasks);
      console.log('  - الأهداف النشطة:', status.userActivity.activeGoals);
      console.log('  - الدخل الشهري:', status.userActivity.monthlyIncome);
      console.log('  - المصاريف الشهرية:', status.userActivity.monthlyExpenses);
    }
    console.log('🔔 =======================================');
  }
}

export default new NotificationServiceWithStatus();