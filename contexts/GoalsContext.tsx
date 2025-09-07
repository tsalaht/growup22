import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNotifications, useNotificationTracking } from '@/contexts/NotificationContext';
import { apiService, Goal as ApiGoal } from '@/services/ApiService';

export interface Goal {
  id: string;
  type: string;
  name: string;
  totalCost: number;
  currentAmount: number;
  monthlyAmount: number;
  targetDate: {
    day: number;
    month: number;
    year: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Convert API goal to local goal format
const convertApiGoalToLocal = (apiGoal: ApiGoal): Goal => ({
  id: apiGoal.id,
  type: apiGoal.type.toLowerCase(),
  name: apiGoal.name,
  totalCost: apiGoal.totalCost,
  currentAmount: apiGoal.currentAmount,
  monthlyAmount: apiGoal.monthlySavingPlan,
  targetDate: {
    day: new Date(apiGoal.targetDate).getDate(),
    month: new Date(apiGoal.targetDate).getMonth() + 1,
    year: new Date(apiGoal.targetDate).getFullYear(),
  },
  createdAt: new Date(apiGoal.createdAt),
  updatedAt: new Date(apiGoal.updatedAt),
});

// Convert local goal to API format
const convertLocalGoalToApi = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => ({
  type: goal.type.toUpperCase() as 'MARRIAGE' | 'CAR' | 'HOUSE' | 'BUSINESS' | 'EDUCATION' | 'OTHER',
  name: goal.name,
  totalCost: goal.totalCost,
  targetDate: new Date(goal.targetDate.year, goal.targetDate.month - 1, goal.targetDate.day).toISOString(),
  currentAmount: goal.currentAmount,
  monthlySavingPlan: goal.monthlyAmount,
});

export interface GoalType {
  id: string;
  name: string;
  emoji: string;
}

export const goalTypes: GoalType[] = [
  { id: 'marriage', name: 'الزواج', emoji: '💍' },
  { id: 'car', name: 'شراء سيارة', emoji: '🚗' },
  { id: 'house', name: 'شراء منزل', emoji: '🏠' },
  { id: 'business', name: 'بدء مشروع', emoji: '💼' },
  { id: 'education', name: 'التعليم', emoji: '🎓' },
  { id: 'other', name: 'أخرى', emoji: '🎯' },
];

export const [GoalsProvider, useGoals] = createContextHook(() => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { scheduleGoalProgressNotification } = useNotifications();
  const { trackGoalsActivity } = useNotificationTracking();

  const loadGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, loading from local storage only');
        // Load from local storage only
        try {
          const stored = await AsyncStorage.getItem('goals');
          if (stored) {
            const parsedGoals = JSON.parse(stored).map((goal: any) => ({
              ...goal,
              createdAt: new Date(goal.createdAt),
              updatedAt: new Date(goal.updatedAt),
            }));
            setGoals(parsedGoals);
            console.log('Loaded goals from local storage:', parsedGoals.length);
          } else {
            console.log('No local goals found');
            setGoals([]);
          }
        } catch (localError) {
          console.log('Error loading local goals:', localError);
          setGoals([]);
        }
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const response = await apiService.getGoals();
      const localGoals = response.goals.map(convertApiGoalToLocal);
      setGoals(localGoals);
    } catch (error) {
      console.log('Error loading goals:', error);
      // Fallback to local storage if API fails
      try {
        const stored = await AsyncStorage.getItem('goals');
        if (stored) {
          const parsedGoals = JSON.parse(stored).map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt),
            updatedAt: new Date(goal.updatedAt),
          }));
          setGoals(parsedGoals);
        }
      } catch (localError) {
        console.log('Error loading local goals:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const saveGoals = useCallback(async (updatedGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.log('Error saving goals:', error);
    }
  }, []);

  const getGoalProgress = useCallback((goal: Goal) => {
    return Math.min((goal.currentAmount / goal.totalCost) * 100, 100);
  }, []);

  const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, saving locally only');
        // Save locally only
        const newGoal: Goal = {
          ...goalData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const apiGoalData = convertLocalGoalToApi(goalData);
      const response = await apiService.addGoal(apiGoalData);
      const newGoal = convertApiGoalToLocal(response.goal);
      
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      
      // Track activity for smart notifications
      await trackGoalsActivity({ activeGoals: updatedGoals.length });
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  }, [goals, trackGoalsActivity]);

  const updateGoal = useCallback(async (goalId: string, updates: Partial<Goal>) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;
      
      const updatedGoal = { ...goal, ...updates, updatedAt: new Date() };
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, updating locally only');
        // Update locally only
        const updatedGoals = goals.map(g => g.id === goalId ? updatedGoal : g);
        setGoals(updatedGoals);
        await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const apiGoalData = convertLocalGoalToApi(updatedGoal);
      
      const response = await apiService.updateGoal(goalId, {
        name: apiGoalData.name,
        monthlySavingPlan: apiGoalData.monthlySavingPlan,
        targetDate: apiGoalData.targetDate,
      });
      
      const apiUpdatedGoal = convertApiGoalToLocal(response.goal);
      const updatedGoals = goals.map(g => g.id === goalId ? apiUpdatedGoal : g);
      setGoals(updatedGoals);
      
      // Check for progress milestones and send notifications
      if (updates.currentAmount !== undefined) {
        const progress = getGoalProgress(apiUpdatedGoal);
        const previousProgress = getGoalProgress(goal);
        
        // Check if we crossed a milestone (25%, 50%, 75%)
        const milestones = [25, 50, 75];
        for (const milestone of milestones) {
          if (progress >= milestone && previousProgress < milestone) {
            const goalType = goalTypes.find(t => t.id === apiUpdatedGoal.type);
            const goalName = `${goalType?.emoji || '🎯'} ${goalType?.name || apiUpdatedGoal.name}`;
            await scheduleGoalProgressNotification(goalName, milestone);
            break;
          }
        }
      }
      
      // Track activity for smart notifications
      await trackGoalsActivity({ activeGoals: updatedGoals.length });
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }, [goals, getGoalProgress, scheduleGoalProgressNotification, trackGoalsActivity]);

  const deleteGoal = useCallback(async (goalId: string) => {
    try {
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, deleting locally only');
        // Delete locally only
        const updatedGoals = goals.filter(goal => goal.id !== goalId);
        setGoals(updatedGoals);
        await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      await apiService.deleteGoal(goalId);
      
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      
      // Track activity for smart notifications
      await trackGoalsActivity({ activeGoals: updatedGoals.length });
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }, [goals, trackGoalsActivity]);

  const addToGoalSavings = useCallback(async (goalId: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, updating locally only');
        // Update locally only
        const updatedGoal = { ...goal, currentAmount: amount, updatedAt: new Date() };
        const updatedGoals = goals.map(g => g.id === goalId ? updatedGoal : g);
        setGoals(updatedGoals);
        await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const response = await apiService.addNewAmount(goalId, { currentAmount: amount });
      const updatedGoal = convertApiGoalToLocal(response.goal);
      
      const updatedGoals = goals.map(g => g.id === goalId ? updatedGoal : g);
      setGoals(updatedGoals);
      
      // Check for progress milestones and send notifications
      const progress = getGoalProgress(updatedGoal);
      const previousProgress = getGoalProgress(goal);
      
      // Check if we crossed a milestone (25%, 50%, 75%)
      const milestones = [25, 50, 75];
      for (const milestone of milestones) {
        if (progress >= milestone && previousProgress < milestone) {
          const goalType = goalTypes.find(t => t.id === updatedGoal.type);
          const goalName = `${goalType?.emoji || '🎯'} ${goalType?.name || updatedGoal.name}`;
          await scheduleGoalProgressNotification(goalName, milestone);
          break;
        }
      }
      
      // Track activity for smart notifications
      await trackGoalsActivity({ activeGoals: goals.length });
    } catch (error) {
      console.error('Error adding to goal savings:', error);
      throw error;
    }
  }, [goals, getGoalProgress, scheduleGoalProgressNotification, trackGoalsActivity]);

  const withdrawFromGoalSavings = useCallback(async (goalId: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal || goal.currentAmount < amount) return;
      
      const newAmount = goal.currentAmount - amount;
      await updateGoal(goalId, {
        currentAmount: newAmount
      });
    } catch (error) {
      console.error('Error withdrawing from goal savings:', error);
      throw error;
    }
  }, [goals, updateGoal]);

  const calculateTimeToGoal = useCallback((goal: Goal) => {
    const remaining = goal.totalCost - goal.currentAmount;
    if (remaining <= 0) return { months: 0, years: 0 };
    if (goal.monthlyAmount <= 0) return { months: Infinity, years: Infinity };
    
    const monthsNeeded = Math.ceil(remaining / goal.monthlyAmount);
    const years = Math.floor(monthsNeeded / 12);
    const months = monthsNeeded % 12;
    
    return { months, years };
  }, []);



  return useMemo(() => ({
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoalSavings,
    withdrawFromGoalSavings,
    calculateTimeToGoal,
    getGoalProgress,
  }), [goals, isLoading, addGoal, updateGoal, deleteGoal, addToGoalSavings, withdrawFromGoalSavings, calculateTimeToGoal, getGoalProgress]);
});