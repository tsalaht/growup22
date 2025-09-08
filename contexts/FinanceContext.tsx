import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useNotifications, useNotificationTracking } from '@/contexts/NotificationContext';
import { trpc } from '@/lib/trpc';
import { apiService, MonthlyIncome, Expense as ApiExpense, Obligation, FinanceOverview } from '@/services/ApiService';

export interface Income {
  id: string;
  amount: number;
  month: number;
  year: number;
  currency: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: 'restaurant' | 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'coffee' | 'tea' | 'morning_coffee' | 'shopping' | 'furniture' | 'electronics' | 'jewelry' | 'beauty' | 'clothes' | 'travel' | 'housing' | 'delivery' | 'gas' | 'car_maintenance' | 'car_loan' | 'communications' | 'subscription' | 'internet' | 'phone_bill' | 'health' | 'pharmacy' | 'salon' | 'spa' | 'optics' | 'home' | 'rent' | 'home_maintenance' | 'gas_home' | 'electricity' | 'water' | 'gifts' | 'other';
  date: Date;
  month: number;
  year: number;
}

export interface Commitment {
  id: string;
  name: string;
  amount: number;
  type: 'monthly' | 'yearly' | 'custom';
  icon: string;
  dueDate?: Date;
  isRecurring: boolean;
  createdAt: Date;
}

export interface MonthlyOverview {
  month: number;
  year: number;
  income: number;
  expenses: number;
  commitments: number;
  remaining: number;
}

const STORAGE_KEYS = {
  INCOMES: 'finance_incomes',
  EXPENSES: 'finance_expenses',
  COMMITMENTS: 'finance_commitments',
};

export const [FinanceProvider, useFinance] = createContextHook(() => {
  const [incomes, setIncomes] = useState<MonthlyIncome[]>([]);
  const [expenses, setExpenses] = useState<ApiExpense[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState('SAR');
  const [currentMonthOverview, setCurrentMonthOverview] = useState<FinanceOverview | null>(null);
  const { scheduleMonthEndReport } = useNotifications();
  const { trackFinanceActivity } = useNotificationTracking();

  const loadFinanceData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, loading from local storage only');
        // Load from local storage only
        try {
          const storedIncomes = await AsyncStorage.getItem(STORAGE_KEYS.INCOMES);
          const storedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
          const storedObligations = await AsyncStorage.getItem(STORAGE_KEYS.COMMITMENTS);
          
          if (storedIncomes) {
            setIncomes(JSON.parse(storedIncomes));
          }
          if (storedExpenses) {
            setExpenses(JSON.parse(storedExpenses));
          }
          if (storedObligations) {
            setObligations(JSON.parse(storedObligations));
          }
        } catch (localError) {
          console.log('Error loading from local storage:', localError);
        }
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      
      const [expensesResponse, obligationsResponse, overviewResponse] = await Promise.all([
        apiService.getCurrentMonthExpenses(),
        apiService.getObligations(),
        apiService.getFinanceOverview({ month: currentMonth }),
      ]);

      setExpenses(expensesResponse.expenses);
      setObligations(obligationsResponse.obligations);
      setCurrentMonthOverview(overviewResponse.data);
      
      // Load income for current month
      try {
        const incomeResponse = await apiService.getIncome({ month: currentMonth });
        setIncomes([incomeResponse.data]);
      } catch (error) {
        // No income set for this month yet
        setIncomes([]);
      }
    } catch (error) {
      // Silently handle API errors and fallback to local storage
      console.log('API unavailable, using local storage');
      try {
        const storedIncomes = await AsyncStorage.getItem(STORAGE_KEYS.INCOMES);
        const storedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
        const storedObligations = await AsyncStorage.getItem(STORAGE_KEYS.COMMITMENTS);
        
        if (storedIncomes) {
          setIncomes(JSON.parse(storedIncomes));
        }
        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        }
        if (storedObligations) {
          setObligations(JSON.parse(storedObligations));
        }
      } catch (localError) {
        console.log('Error loading from local storage fallback:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data from AsyncStorage
  useEffect(() => {
    loadFinanceData();
  }, [loadFinanceData]);

  const saveIncomes = useCallback(async (newIncomes: MonthlyIncome[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(newIncomes));
      setIncomes(newIncomes);
    } catch (error) {
      console.error('Error saving incomes:', error);
    }
  }, []);

  const saveExpenses = useCallback(async (newExpenses: ApiExpense[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }, []);

  const saveCommitments = useCallback(async (newCommitments: Obligation[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMMITMENTS, JSON.stringify(newCommitments));
      setObligations(newCommitments);
    } catch (error) {
      console.error('Error saving commitments:', error);
    }
  }, []);

  const addIncome = useCallback(async (amount: number, month: number, year: number) => {
    try {
      const monthString = `${year}-${month.toString().padStart(2, '0')}`;
      console.log('FinanceContext: Adding income with data:', { month: monthString, amount });
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, saving locally only');
        // Save locally only
        const newIncome: MonthlyIncome = {
          id: `local_${Date.now()}`,
          month: monthString,
          amount,
          userId: 'local',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedIncomes = [...incomes, newIncome];
        setIncomes(updatedIncomes);
        await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(updatedIncomes));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      try {
        const response = await apiService.setIncome({ month: monthString, amount });
        console.log('FinanceContext: API response:', response);
        
        // Update local state
        setIncomes([response.data]);
        
        // Reload overview
        const overviewResponse = await apiService.getFinanceOverview({ month: monthString });
        setCurrentMonthOverview(overviewResponse.data);
        
        // Track activity for smart notifications
        await trackFinanceActivity({ 
          monthlyIncome: amount, 
          monthlyExpenses: overviewResponse.data.totalExpenses 
        });
        
        console.log('FinanceContext: Income added successfully via API');
      } catch (apiError) {
        console.log('FinanceContext: API failed, saving locally:', apiError);
        
        // Fallback to local storage
        const newIncome: MonthlyIncome = {
          id: `local_${Date.now()}`,
          userId: 'local_user',
          month: monthString,
          amount: amount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Update local state
        setIncomes([newIncome]);
        
        // Update local storage
        await saveIncomes([newIncome]);
        
        // Create mock overview
        const mockOverview: FinanceOverview = {
          income: amount,
          totalExpenses: 0,
          totalObligations: 0,
          remaining: amount,
        };
        setCurrentMonthOverview(mockOverview);
        
        console.log('FinanceContext: Income saved locally as fallback');
      }
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  }, [trackFinanceActivity, saveIncomes]);

  const addExpense = useCallback(async (name: string, amount: number, category: string) => {
    try {
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, saving locally only');
        // Save locally only
        const newExpense: ApiExpense = {
          id: `local_${Date.now()}`,
          name,
          amount,
          category: category as any,
          userId: 'local',
          createdAt: new Date().toISOString(),
        };
        const updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses);
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const response = await apiService.addExpense({ name, amount, category });
      
      // Update local state
      setExpenses(prev => [...prev, response.expense]);
      
      // Reload overview - with error handling
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const overviewResponse = await apiService.getFinanceOverview({ month: currentMonth });
        setCurrentMonthOverview(overviewResponse.data);
        
        // Track activity and check for expense warnings
        await trackFinanceActivity({ 
          monthlyExpenses: overviewResponse.data.totalExpenses, 
          monthlyIncome: overviewResponse.data.income 
        });
        
        // Check if expenses are high and schedule month-end report
        if (overviewResponse.data.income > 0 && overviewResponse.data.totalExpenses > overviewResponse.data.income * 0.8) {
          await scheduleMonthEndReport(true); // High expenses
        }
      } catch (error) {
        console.log('Overview reload failed, using mock data:', error);
        // Use mock overview data if API fails
        const mockOverview = {
          income: 5000,
          totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0) + amount,
          totalObligations: obligations.reduce((sum, obl) => sum + obl.amount, 0),
          remaining: 5000 - (expenses.reduce((sum, exp) => sum + exp.amount, 0) + amount) - obligations.reduce((sum, obl) => sum + obl.amount, 0)
        };
        setCurrentMonthOverview(mockOverview);
        
        // Track activity for smart notifications
        await trackFinanceActivity({ monthlyExpenses: mockOverview.totalExpenses });
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }, [trackFinanceActivity, scheduleMonthEndReport]);

  const addObligation = useCallback(async (name: string, amount: number, date: string, note: string) => {
    try {
      // Validate and map the name to a valid ObligationType
      const validObligationTypes = ['RENT', 'CAR_INSTALLMENT', 'HOUSE_INSTALLMENT', 'INVITATION', 'FIXED_MONTHLY', 'OTHER'];
      const mappedName = validObligationTypes.includes(name.toUpperCase()) ? name.toUpperCase() : 'OTHER';
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, saving locally only');
        // Save locally only
        const newObligation: Obligation = {
          id: `local_${Date.now()}`,
          name: mappedName as any,
          amount,
          date,
          note,
          userId: 'local',
        };
        const updatedObligations = [...obligations, newObligation];
        setObligations(updatedObligations);
        await AsyncStorage.setItem(STORAGE_KEYS.COMMITMENTS, JSON.stringify(updatedObligations));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const response = await apiService.addObligation({ 
        name: mappedName as any, // Use mapped name instead of raw input
        amount, 
        date, 
        note 
      });
      
      // Update local state
      setObligations(prev => [...prev, response.obligation]);
      
      // Reload overview - with error handling
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const overviewResponse = await apiService.getFinanceOverview({ month: currentMonth });
        setCurrentMonthOverview(overviewResponse.data);
        
        // Check if obligations are high and schedule month-end report
        if (overviewResponse.data.income > 0 && overviewResponse.data.totalObligations > overviewResponse.data.income * 0.6) {
          await scheduleMonthEndReport(true); // High expenses with high commitments
        }
        
        // Track activity for smart notifications
        await trackFinanceActivity({ monthlyExpenses: overviewResponse.data.totalExpenses });
      } catch (error) {
        console.log('Overview reload failed, using mock data:', error);
        // Use mock overview data if API fails
        const mockOverview = {
          income: 5000,
          totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
          totalObligations: obligations.reduce((sum, obl) => sum + obl.amount, 0) + amount,
          remaining: 5000 - expenses.reduce((sum, exp) => sum + exp.amount, 0) - (obligations.reduce((sum, obl) => sum + obl.amount, 0) + amount)
        };
        setCurrentMonthOverview(mockOverview);
        
        // Track activity for smart notifications
        await trackFinanceActivity({ monthlyExpenses: mockOverview.totalExpenses });
      }
    } catch (error) {
      console.error('Error adding obligation:', error);
      throw error;
    }
  }, [trackFinanceActivity, scheduleMonthEndReport]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, deleting locally only');
        // Delete locally only
        const updatedExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(updatedExpenses);
        await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      await apiService.deleteExpense(id);
      
      // Update local state
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      
      // Reload overview - with error handling
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const overviewResponse = await apiService.getFinanceOverview({ month: currentMonth });
        setCurrentMonthOverview(overviewResponse.data);
        
        // Track activity for smart notifications
        await trackFinanceActivity({ monthlyExpenses: overviewResponse.data.totalExpenses });
      } catch (error) {
        console.log('Overview reload failed, using mock data:', error);
        // Use mock overview data if API fails
        const mockOverview = {
          income: 5000,
          totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
          totalObligations: obligations.reduce((sum, obl) => sum + obl.amount, 0),
          remaining: 5000 - expenses.reduce((sum, exp) => sum + exp.amount, 0) - obligations.reduce((sum, obl) => sum + obl.amount, 0)
        };
        setCurrentMonthOverview(mockOverview);
        
        // Track activity for smart notifications
        await trackFinanceActivity({ monthlyExpenses: mockOverview.totalExpenses });
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }, [trackFinanceActivity]);

  const deleteObligation = useCallback(async (id: string) => {
    try {
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, deleting locally only');
        // Delete locally only
        const updatedObligations = obligations.filter(obligation => obligation.id !== id);
        setObligations(updatedObligations);
        await AsyncStorage.setItem(STORAGE_KEYS.COMMITMENTS, JSON.stringify(updatedObligations));
        return;
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      await apiService.deleteObligation(id);
      
      // Update local state
      setObligations(prev => prev.filter(obligation => obligation.id !== id));
      
      // Reload overview - with error handling
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const overviewResponse = await apiService.getFinanceOverview({ month: currentMonth });
        setCurrentMonthOverview(overviewResponse.data);
        
        // Track activity for smart notifications
        await trackFinanceActivity({ monthlyExpenses: overviewResponse.data.totalExpenses });
      } catch (error) {
        console.log('Overview reload failed, using mock data:', error);
        // Use mock overview data if API fails
        const mockOverview = {
          income: 5000,
          totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
          totalObligations: obligations.reduce((sum, obl) => sum + obl.amount, 0),
          remaining: 5000 - expenses.reduce((sum, exp) => sum + exp.amount, 0) - obligations.reduce((sum, obl) => sum + obl.amount, 0)
        };
        setCurrentMonthOverview(mockOverview);
        
        // Track activity for smart notifications
        await trackFinanceActivity({ monthlyExpenses: mockOverview.totalExpenses });
      }
    } catch (error) {
      console.error('Error deleting obligation:', error);
      throw error;
    }
  }, [trackFinanceActivity]);

  const getMonthlyOverview = useCallback(async (month: number, year: number): Promise<MonthlyOverview> => {
    try {
      const monthString = `${year}-${month.toString().padStart(2, '0')}`;
      
      // Check if user is authenticated before making API calls
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token available, returning empty overview');
        return {
          month,
          year,
          income: 0,
          expenses: 0,
          commitments: 0,
          remaining: 0,
        };
      }
      
      // Set token for API service
      apiService.setToken(token);
      
      const response = await apiService.getFinanceOverview({ month: monthString });
      
      return {
        month,
        year,
        income: response.data.income,
        expenses: response.data.totalExpenses,
        commitments: response.data.totalObligations,
        remaining: response.data.remaining,
      };
    } catch (error) {
      console.error('Error getting monthly overview:', error);
      return {
        month,
        year,
        income: 0,
        expenses: 0,
        commitments: 0,
        remaining: 0,
      };
    }
  }, []);

  const getLast6MonthsOverview = useCallback(async (): Promise<MonthlyOverview[]> => {
    try {
      // Always use local calculation to ensure data shows only for current month
      console.log('Using local calculation for 6 months overview');
      return calculateLast6MonthsFromLocal();
    } catch (error) {
      console.error('Error getting 6 months overview:', error);
      return [];
    }
  }, [expenses, obligations, incomes]);

  // Helper function to calculate last 6 months from local data
  const calculateLast6MonthsFromLocal = useCallback((): MonthlyOverview[] => {
    const currentDate = new Date();
    const months: MonthlyOverview[] = [];
    
    // Calculate data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = monthDate.getMonth() + 1;
      const year = monthDate.getFullYear();
      
      // Check if this is the current month
      const isCurrentMonth = month === currentDate.getMonth() + 1 && year === currentDate.getFullYear();
      console.log(`Month ${month}/${year} - isCurrentMonth: ${isCurrentMonth}`);
      
      // Calculate income for this month (only for current month)
      const monthString = `${year}-${month.toString().padStart(2, '0')}`;
      const monthIncome = isCurrentMonth 
        ? incomes
            .filter(income => income.month === monthString)
            .reduce((sum, income) => sum + income.amount, 0)
        : 0;
      
      // Calculate expenses for this month (only for current month)
      const monthExpenses = isCurrentMonth 
        ? expenses.reduce((sum, expense) => sum + expense.amount, 0)
        : 0;
      
      // Calculate obligations for this month (only for current month)
      const monthObligations = isCurrentMonth 
        ? obligations
            .filter(obligation => {
              const obligationDate = new Date(obligation.date);
              return obligationDate.getMonth() + 1 === month && obligationDate.getFullYear() === year;
            })
            .reduce((sum, obligation) => sum + obligation.amount, 0)
        : 0;
      
      console.log(`Month ${month}/${year} - Income: ${monthIncome}, Expenses: ${monthExpenses}, Obligations: ${monthObligations}`);
      
      const remaining = monthIncome - monthExpenses - monthObligations;
      
      months.push({
        month,
        year,
        income: monthIncome,
        expenses: monthExpenses,
        commitments: monthObligations,
        remaining,
      });
    }
    
    return months;
  }, [expenses, obligations, incomes]);

  const getCurrentMonthIncome = useCallback((): number => {
    return currentMonthOverview?.income || 0;
  }, [currentMonthOverview]);

  return useMemo(() => ({
    incomes,
    expenses,
    obligations,
    isLoading,
    currency,
    setCurrency,
    currentMonthOverview,
    addIncome,
    addExpense,
    addObligation,
    deleteExpense,
    deleteObligation,
    getMonthlyOverview,
    getLast6MonthsOverview,
    getCurrentMonthIncome,
  }), [incomes, expenses, obligations, isLoading, currency, setCurrency, currentMonthOverview, addIncome, addExpense, addObligation, deleteExpense, deleteObligation, getMonthlyOverview, getLast6MonthsOverview, getCurrentMonthIncome]);
});