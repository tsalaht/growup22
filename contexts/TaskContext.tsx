import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import NotificationService from '@/services/NotificationService';
import { useNotificationTracking } from '@/contexts/NotificationContext';
import { apiService, Task as ApiTask } from '@/services/ApiService';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'daily' | 'weekly' | 'monthly';
  dueDate?: string;
  dueTime?: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  tags: string[];
  icon?: string;
  notificationId?: string;
  createdAt: string;
  updatedAt: string;
}

// Convert API task to local task format
const convertApiTaskToLocal = (apiTask: ApiTask): Task => ({
  id: apiTask.id,
  title: apiTask.title,
  status: apiTask.isDone ? 'completed' : 'pending',
  priority: 'medium', // Default priority
  category: apiTask.type.toLowerCase() as 'daily' | 'weekly' | 'monthly',
  dueDate: apiTask.periodValue,
  dueTime: new Date(apiTask.time).toTimeString().slice(0, 5),
  repeat: apiTask.type.toLowerCase() as 'daily' | 'weekly' | 'monthly',
  tags: [],
  createdAt: apiTask.createdAt,
  updatedAt: apiTask.updatedAt,
});

// Convert local task to API format
const convertLocalTaskToApi = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  // Create a proper time string for the API (ISO 8601 UTC format)
  let timeString: string;
  if (task.dueTime) {
    // If dueTime is provided, create a proper ISO 8601 string
    if (task.category === 'daily') {
      // For daily tasks, use today's date with the specified time
      const today = new Date();
      const [hours, minutes] = task.dueTime.split(':');
      const timeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
                               parseInt(hours), parseInt(minutes), 0);
      timeString = timeDate.toISOString();
    } else if (task.category === 'weekly' && task.dueDate) {
      // For weekly tasks, use the specified day of the week
      const today = new Date();
      const dayOfWeek = parseInt(task.dueDate);
      const daysUntilTarget = (dayOfWeek - today.getDay() + 7) % 7;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysUntilTarget);
      
      const [hours, minutes] = task.dueTime.split(':');
      const timeDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 
                               parseInt(hours), parseInt(minutes), 0);
      timeString = timeDate.toISOString();
    } else if (task.category === 'monthly' && task.dueDate) {
      // For monthly tasks, use the specified date
      const [hours, minutes] = task.dueTime.split(':');
      const timeDate = new Date(task.dueDate);
      timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      timeString = timeDate.toISOString();
    } else {
      // Fallback to current time
      timeString = new Date().toISOString();
    }
  } else {
    // If no dueTime, use current time
    timeString = new Date().toISOString();
  }

  // Create proper periodValue based on category and dueDate
  let periodValue: string;
  
  if (task.category === 'daily') {
    // For daily tasks, use MORNING or EVENING based on time
    if (task.dueTime) {
      const [hours] = task.dueTime.split(':');
      const hour = parseInt(hours);
      periodValue = hour < 12 ? 'MORNING' : 'EVENING';
    } else {
      periodValue = 'MORNING';
    }
  } else if (task.category === 'weekly') {
    // For weekly tasks, use day of week
    if (task.dueDate) {
      const dayNumber = parseInt(task.dueDate);
      const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      periodValue = dayNames[dayNumber] || 'SUNDAY';
    } else {
      periodValue = 'SUNDAY';
    }
  } else if (task.category === 'monthly') {
    // For monthly tasks, use month name
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                         'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      periodValue = monthNames[date.getMonth()] || 'JANUARY';
    } else {
      periodValue = 'JANUARY';
    }
  } else {
    // Default fallback
    periodValue = 'MORNING';
  }

  // Map category to proper type
  let taskType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  switch (task.category) {
    case 'daily':
      taskType = 'DAILY';
      break;
    case 'weekly':
      taskType = 'WEEKLY';
      break;
    case 'monthly':
      taskType = 'MONTHLY';
      break;
    default:
      taskType = 'DAILY'; // Default fallback
  }

  const apiTaskData: any = {
    title: task.title,
    type: taskType,
    time: timeString,
  };
  
  // Add periodValue only if it's not empty
  if (periodValue && periodValue.trim() !== '') {
    apiTaskData.periodValue = periodValue;
  }

  console.log('convertLocalTaskToApi: Input task:', task);
  console.log('convertLocalTaskToApi: Output API data:', apiTaskData);
  console.log('convertLocalTaskToApi: Task type:', taskType);
  console.log('convertLocalTaskToApi: Period value:', periodValue);
  console.log('convertLocalTaskToApi: Time string:', timeString);

  return apiTaskData;
};

export const [TaskProvider, useTasks] = createContextHook(() => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackTaskActivity } = useNotificationTracking();

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, loading from local storage only');
        // Load from local storage only
        try {
          const savedTasks = await AsyncStorage.getItem('tasks');
          if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            setTasks(parsedTasks);
            console.log('Loaded tasks from local storage:', parsedTasks.length);
          } else {
            console.log('No local tasks found');
            setTasks([]);
          }
        } catch (localError) {
          console.log('Error loading local tasks:', localError);
          setTasks([]);
        }
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      // Try API first
      try {
        const response = await apiService.getTasks();
        const localTasks = response.tasks.map(convertApiTaskToLocal);
        setTasks(localTasks);
        // Save to local storage as backup
        await AsyncStorage.setItem('tasks', JSON.stringify(localTasks));
        return;
      } catch (apiError) {
        console.log('API failed, loading from local storage:', apiError);
      }
      
      // Fallback to local storage if API fails
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          setTasks(parsedTasks);
          console.log('Loaded tasks from local storage:', parsedTasks.length);
        } else {
          console.log('No local tasks found');
          setTasks([]);
        }
      } catch (localError) {
        console.log('Error loading local tasks:', localError);
        setTasks([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTasks = useCallback(async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.log('Error saving tasks:', error);
    }
  }, []);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding task with data:', taskData);
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, saving locally only');
        // Save locally only
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return newTask;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      // Try API first
      try {
        const apiTaskData = convertLocalTaskToApi(taskData);
        console.log('API task data:', apiTaskData);
        const response = await apiService.createTask(apiTaskData);
        console.log('API response:', response);
        const newTask = convertApiTaskToLocal(response.task);
        console.log('Converted task:', newTask);
        
        // Schedule notification if time is provided
        if (taskData.dueTime && taskData.repeat && taskData.repeat !== 'none') {
          try {
            let notificationDate: Date;
            let weekDay: number | undefined;
            
            if (taskData.category === 'daily') {
              notificationDate = NotificationService.createNotificationDate(taskData.dueTime, 'daily');
            } else if (taskData.category === 'weekly' && taskData.dueDate) {
              weekDay = parseInt(taskData.dueDate);
              notificationDate = NotificationService.createNotificationDate(taskData.dueTime, 'weekly', undefined, weekDay);
            } else if (taskData.category === 'monthly' && taskData.dueDate) {
              notificationDate = NotificationService.createNotificationDate(taskData.dueTime, 'monthly', taskData.dueDate);
            } else {
              notificationDate = NotificationService.createNotificationDate(taskData.dueTime, taskData.category);
            }
            
            const notificationId = await NotificationService.scheduleRecurringTaskNotification({
              taskId: newTask.id,
              taskTitle: newTask.title,
              category: newTask.category,
              scheduledTime: notificationDate,
            }, taskData.repeat);
            
            if (notificationId) {
              newTask.notificationId = notificationId;
            }
          } catch (error) {
            console.error('Error scheduling notification:', error);
          }
        }
        
        const updatedTasks = [...tasks, newTask];
        console.log('Updated tasks array:', updatedTasks.length);
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
        console.log('Task added successfully via API');
        
        // Don't reload tasks here as it will overwrite the local changes
        // The task is already added to the state
        
        // Track activity for smart notifications
        const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
        await trackTaskActivity({ 
          totalTasks: updatedTasks.length, 
          completedTasks 
        });
        
        return;
      } catch (apiError) {
        console.log('API failed, falling back to local storage:', apiError);
      }
      
      // Fallback to local storage
      console.log('API failed, using local storage fallback');
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('Created local task:', newTask);
      
      // Schedule notification if time is provided
      if (taskData.dueTime && taskData.repeat && taskData.repeat !== 'none') {
        try {
          let notificationDate: Date;
          let weekDay: number | undefined;
          
          if (taskData.category === 'daily') {
            notificationDate = NotificationService.createNotificationDate(taskData.dueTime, 'daily');
          } else if (taskData.category === 'weekly' && taskData.dueDate) {
            weekDay = parseInt(taskData.dueDate);
            notificationDate = NotificationService.createNotificationDate(taskData.dueTime, 'weekly', undefined, weekDay);
          } else if (taskData.category === 'monthly' && taskData.dueDate) {
            notificationDate = NotificationService.createNotificationDate(taskData.dueTime, 'monthly', taskData.dueDate);
          } else {
            notificationDate = NotificationService.createNotificationDate(taskData.dueTime, taskData.category);
          }
          
          const notificationId = await NotificationService.scheduleRecurringTaskNotification({
            taskId: newTask.id,
            taskTitle: newTask.title,
            category: newTask.category,
            scheduledTime: notificationDate,
          }, taskData.repeat);
          
          if (notificationId) {
            newTask.notificationId = notificationId;
          }
        } catch (error) {
          console.error('Error scheduling notification:', error);
        }
      }
      
      const updatedTasks = [...tasks, newTask];
      console.log('Updated tasks array (local):', updatedTasks.length);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      console.log('Task added successfully via local storage');
      
      // Don't reload tasks here as it will overwrite the local changes
      // The task is already added to the state
      
      // Track activity for smart notifications
      const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
      await trackTaskActivity({ 
        totalTasks: updatedTasks.length, 
        completedTasks 
      });
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }, [tasks, trackTaskActivity, saveTasks]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Cancel existing notification if it exists
      if (task.notificationId) {
        await NotificationService.cancelNotification(task.notificationId);
      }
      
      const updatedTask = { ...task, ...updates, updatedAt: new Date().toISOString() };
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, updating locally only');
        // Update locally only
        const updatedTasks = tasks.map(t => 
          t.id === taskId ? updatedTask : t
        );
        setTasks(updatedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      // Try API first
      try {
        const apiTaskData = convertLocalTaskToApi(updatedTask);
        const response = await apiService.updateTask(taskId, apiTaskData);
        const apiUpdatedTask = convertApiTaskToLocal(response.task);
        
        // Schedule new notification if time is provided
        if (updates.dueTime && updates.repeat && updates.repeat !== 'none') {
          try {
            let notificationDate: Date;
            let weekDay: number | undefined;
            
            if (updatedTask.category === 'daily') {
              notificationDate = NotificationService.createNotificationDate(updates.dueTime, 'daily');
            } else if (updatedTask.category === 'weekly' && updates.dueDate) {
              weekDay = parseInt(updates.dueDate);
              notificationDate = NotificationService.createNotificationDate(updates.dueTime, 'weekly', undefined, weekDay);
            } else if (updatedTask.category === 'monthly' && updates.dueDate) {
              notificationDate = NotificationService.createNotificationDate(updates.dueTime, 'monthly', updates.dueDate);
            } else {
              notificationDate = NotificationService.createNotificationDate(updates.dueTime, updatedTask.category);
            }
            
            const notificationId = await NotificationService.scheduleRecurringTaskNotification({
              taskId: updatedTask.id,
              taskTitle: updatedTask.title,
              category: updatedTask.category,
              scheduledTime: notificationDate,
            }, updates.repeat);
            
            if (notificationId) {
              apiUpdatedTask.notificationId = notificationId;
            }
          } catch (error) {
            console.error('Error scheduling notification:', error);
          }
        }
        
        const updatedTasks = tasks.map(t =>
          t.id === taskId ? apiUpdatedTask : t
        );
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
        
        // Track activity for smart notifications
        const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
        await trackTaskActivity({ 
          totalTasks: updatedTasks.length, 
          completedTasks 
        });
        
        return;
      } catch (apiError) {
        console.log('API failed, falling back to local storage:', apiError);
      }
      
      // Fallback to local storage
      // Schedule new notification if time is provided
      if (updates.dueTime && updates.repeat && updates.repeat !== 'none') {
        try {
          let notificationDate: Date;
          let weekDay: number | undefined;
          
          if (updatedTask.category === 'daily') {
            notificationDate = NotificationService.createNotificationDate(updates.dueTime, 'daily');
          } else if (updatedTask.category === 'weekly' && updates.dueDate) {
            weekDay = parseInt(updates.dueDate);
            notificationDate = NotificationService.createNotificationDate(updates.dueTime, 'weekly', undefined, weekDay);
          } else if (updatedTask.category === 'monthly' && updates.dueDate) {
            notificationDate = NotificationService.createNotificationDate(updates.dueTime, 'monthly', updates.dueDate);
          } else {
            notificationDate = NotificationService.createNotificationDate(updates.dueTime, updatedTask.category);
          }
          
          const notificationId = await NotificationService.scheduleRecurringTaskNotification({
            taskId: updatedTask.id,
            taskTitle: updatedTask.title,
            category: updatedTask.category,
            scheduledTime: notificationDate,
          }, updates.repeat);
          
          if (notificationId) {
            updatedTask.notificationId = notificationId;
          }
        } catch (error) {
          console.error('Error scheduling notification:', error);
        }
      }
      
      const updatedTasks = tasks.map(t =>
        t.id === taskId ? updatedTask : t
      );
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      
      // Track activity for smart notifications
      const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
      await trackTaskActivity({ 
        totalTasks: updatedTasks.length, 
        completedTasks 
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }, [tasks, trackTaskActivity, saveTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task?.notificationId) {
        await NotificationService.cancelNotification(task.notificationId);
      }
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, deleting locally only');
        // Delete locally only
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        setTasks(updatedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      // Try API first
      try {
        await apiService.deleteTask(taskId);
      } catch (apiError) {
        console.log('API failed, continuing with local deletion:', apiError);
      }
      
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      
      // Track activity for smart notifications
      const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
      await trackTaskActivity({ 
        totalTasks: updatedTasks.length, 
        completedTasks 
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }, [tasks, trackTaskActivity, saveTasks]);

  const toggleTask = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, toggling locally only');
        // Toggle locally only
        const updatedTasks = tasks.map(t =>
          t.id === taskId 
            ? { ...t, status: (t.status === 'completed' ? 'pending' : 'completed') as 'pending' | 'completed', updatedAt: new Date().toISOString() }
            : t
        );
        setTasks(updatedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      // Try API first
      try {
        const response = await apiService.toggleTask(taskId);
        const updatedTask = convertApiTaskToLocal(response.task);
        
        const updatedTasks = tasks.map(t =>
          t.id === taskId ? updatedTask : t
        );
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
        
        // Track activity for smart notifications
        const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
        await trackTaskActivity({ 
          totalTasks: updatedTasks.length, 
          completedTasks 
        });
        
        return;
      } catch (apiError) {
        console.log('API failed, falling back to local toggle:', apiError);
      }
      
      // Fallback to local storage
      const updatedTask: Task = {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed',
        updatedAt: new Date().toISOString(),
      };
      
      const updatedTasks = tasks.map(t =>
        t.id === taskId ? updatedTask : t
      );
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      
      // Track activity for smart notifications
      const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
      await trackTaskActivity({ 
        totalTasks: updatedTasks.length, 
        completedTasks 
      });
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  }, [tasks, trackTaskActivity, saveTasks]);

  const getTasksByCategory = useCallback((category: 'daily' | 'weekly' | 'monthly') => {
    const filteredTasks = tasks.filter(task => task.category === category);
    console.log(`getTasksByCategory(${category}):`, {
      totalTasks: tasks.length,
      filteredTasks: filteredTasks.length,
      tasks: filteredTasks.map(t => ({ id: t.id, title: t.title, category: t.category }))
    });
    return filteredTasks;
  }, [tasks]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return useMemo(() => ({
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTasksByCategory,
  }), [tasks, isLoading, addTask, updateTask, deleteTask, toggleTask, getTasksByCategory]);
});