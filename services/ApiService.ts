import { PROJECT_CONFIG } from '@/config';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  fcmToken?: string;
  lastLoginAt?: string;
  notificationSettings?: NotificationSetting[];
}

export interface NotificationSetting {
  id: string;
  type: string;
  enabled: boolean;
  userId: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  activationToken?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  fcmToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string;
}

export interface ActivateRequest {
  activationToken: string;
  activationCode: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  resetCode: string;
  newPassword: string;
}

// Finance Module Types
export interface MonthlyIncome {
  id: string;
  userId: string;
  month: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SetIncomeRequest {
  month: string;
  amount: number;
}

export interface GetIncomeRequest {
  month: string;
}

export interface FinanceOverview {
  income: number;
  totalExpenses: number;
  totalObligations: number;
  remaining: number;
}

export interface Expense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  createdAt: string;
}

export interface AddExpenseRequest {
  name: string;
  amount: number;
  category: string;
}

export interface UpdateExpenseRequest {
  name: string;
  amount: number;
  category: string;
}

export interface Obligation {
  id: string;
  userId: string;
  name: 'RENT' | 'CAR_INSTALLMENT' | 'HOUSE_INSTALLMENT' | 'INVITATION' | 'FIXED_MONTHLY' | 'OTHER';
  date: string;
  amount: number;
  note: string;
}

export interface AddObligationRequest {
  name: 'RENT' | 'CAR_INSTALLMENT' | 'HOUSE_INSTALLMENT' | 'INVITATION' | 'FIXED_MONTHLY' | 'OTHER';
  date: string;
  amount: number;
  note: string;
}

export interface UpdateObligationRequest {
  name: 'RENT' | 'CAR_INSTALLMENT' | 'HOUSE_INSTALLMENT' | 'INVITATION' | 'FIXED_MONTHLY' | 'OTHER';
  date: string;
  amount: number;
  note: string;
}

// Tasks Module Types
export interface Task {
  id: string;
  userId: string;
  title: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  time: string;
  periodValue: string;
  isDone: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  time: string;
  periodValue: string;
}

export interface UpdateTaskRequest {
  title: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  time: string;
  periodValue: string;
}

// Goals Module Types
export interface Goal {
  id: string;
  userId: string;
  type: 'MARRIAGE' | 'CAR' | 'HOUSE' | 'BUSINESS' | 'EDUCATION' | 'OTHER';
  name: string;
  totalCost: number;
  targetDate: string;
  currentAmount: number;
  monthlySavingPlan: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddGoalRequest {
  type: 'MARRIAGE' | 'CAR' | 'HOUSE' | 'BUSINESS' | 'EDUCATION' | 'OTHER';
  name: string;
  totalCost: number;
  targetDate: string;
  currentAmount: number;
  monthlySavingPlan: number;
}

export interface AddNewAmountRequest {
  currentAmount: number;
}

export interface UpdateGoalRequest {
  name: string;
  monthlySavingPlan: number;
  targetDate: string;
}

// Smart Notes Module Types
export interface SmartNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  smartReminderEnabled: boolean;
  reminderType: 'AFTER_CERTAIN_TIME' | 'DAY_AND_TIME' | 'EVERY_HOUR';
  specificDate?: string;
  specificTime?: string;
  specificTimeMin?: number;
  everyIntervalMin?: number;
  lastRemindedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  category: string;
  smartReminderEnabled: boolean;
  reminderType?: 'AFTER_CERTAIN_TIME' | 'DAY_AND_TIME' | 'EVERY_HOUR';
  specificDate?: string;
  specificTime?: string;
  everyIntervalMin?: number;
}

export interface UpdateNoteRequest {
  title: string;
  content?: string;
  specificTime?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  sentAt: string;
  category: string;
  item: string;
  data?: any;
}

export interface NotificationSetting {
  id: string;
  category: string;
  item: string;
  enabled: boolean;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;
  private lastRequestTime: number = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

  constructor() {
    this.baseUrl = PROJECT_CONFIG.api.baseUrl;
  }

  // Set JWT token for authenticated requests
  setToken(token: string | null) {
    this.token = token;
  }

  // Get authorization headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log('ApiService: Authorization header set with token length:', this.token.length);
    } else {
      console.log('ApiService: No token available for authorization');
    }

    return headers;
  }

  // Make HTTP request with retry logic
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    // Add delay between requests to avoid rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const delay = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`⏳ Adding ${delay}ms delay to avoid rate limiting`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    this.lastRequestTime = Date.now();
    
    const url = `${this.baseUrl}${endpoint}`;
    
    // Ensure Content-Type is set correctly for POST/PUT requests
    const headers: HeadersInit = {
      ...this.getHeaders(),
      ...options.headers,
    };

    // For requests with body, ensure Content-Type is application/json
    if (options.body && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
      (headers as any)['Content-Type'] = 'application/json';
    }
    
    const config: RequestInit = {
      ...options,
      headers,
    };

    console.log('ApiService: Making request to:', url);
    console.log('ApiService: Base URL:', this.baseUrl);
    console.log('ApiService: Endpoint:', endpoint);
    console.log('ApiService: Request config:', {
      method: config.method,
      headers: config.headers,
      body: config.body
    });
    console.log('ApiService: Token present:', !!this.token);

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      console.log('ApiService: Response content-type:', contentType);
      
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('ApiService: Non-JSON response received:');
        console.log('ApiService: Response status:', response.status);
        console.log('ApiService: Response headers:', Object.fromEntries(response.headers.entries()));
        console.log('ApiService: Response text (first 500 chars):', text.substring(0, 500));
        console.log('ApiService: Full response text:', text);
        throw new Error(`Expected JSON response but got: ${contentType}`);
      }

      console.log('ApiService: Response status:', response.status);
      console.log('ApiService: Response data:', data);

      if (!response.ok) {
        // Handle rate limiting (429) with retry
        if (response.status === 429 && retryCount < 3) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, retryCount) * 1000; // Exponential backoff
          
          console.log(`⏳ Rate limited, retrying after ${delay}ms (attempt ${retryCount + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, retryCount + 1);
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Handle network errors with retry
      if (retryCount < 2 && (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch')))) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`🔄 Network error, retrying after ${delay}ms (attempt ${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, retryCount + 1);
      }
      
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async activate(data: ActivateRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/activate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('ApiService: Login request data:', data);
    console.log('ApiService: Login request body:', JSON.stringify(data));
    
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/logout', {
      method: 'POST',
    });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/get-user', {
      method: 'GET',
    });
  }

  // Notification endpoints
  async markAllNotificationsAsRead(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/mark-all-read', {
      method: 'PATCH',
    });
  }

  // Finance Module endpoints
  async setIncome(data: SetIncomeRequest): Promise<{ message: string; data: MonthlyIncome }> {
    console.log('ApiService: setIncome called with data:', data);
    console.log('ApiService: Data type:', typeof data);
    console.log('ApiService: Data keys:', Object.keys(data));
    
    // Validate data before sending
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data: data must be an object');
    }
    
    if (!data.month || typeof data.month !== 'string') {
      throw new Error('Invalid data: month must be a string');
    }
    
    if (!data.amount || typeof data.amount !== 'number') {
      throw new Error('Invalid data: amount must be a number');
    }
    
    const requestBody = JSON.stringify(data);
    console.log('ApiService: Request body string:', requestBody);
    console.log('ApiService: Request body length:', requestBody.length);
    console.log('ApiService: Request body is valid JSON:', this.isValidJSON(requestBody));
    
    return this.request<{ message: string; data: MonthlyIncome }>('/set-income', {
      method: 'POST',
      body: requestBody,
    });
  }

  // Helper method to validate JSON
  private isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getIncome(data: GetIncomeRequest): Promise<{ data: MonthlyIncome }> {
    return this.request<{ data: MonthlyIncome }>(`/get-income?month=${data.month}`, {
      method: 'GET',
    });
  }

  async getFinanceOverview(data: GetIncomeRequest): Promise<{ data: FinanceOverview }> {
    return this.request<{ data: FinanceOverview }>(`/finance-overview?month=${data.month}`, {
      method: 'GET',
    });
  }

  async getSummarySixMonths(): Promise<{ data: FinanceOverview[] }> {
    return this.request<{ data: FinanceOverview[] }>('/summary-six-months', {
      method: 'GET',
    });
  }

  async addExpense(data: AddExpenseRequest): Promise<{ message: string; expense: Expense }> {
    return this.request<{ message: string; expense: Expense }>('/add-expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllExpenses(): Promise<{ expenses: Expense[] }> {
    return this.request<{ expenses: Expense[] }>('/all-expenses', {
      method: 'GET',
    });
  }

  async getCurrentMonthExpenses(): Promise<{ expenses: Expense[] }> {
    return this.request<{ expenses: Expense[] }>('/expenses/current-month', {
      method: 'GET',
    });
  }

  async updateExpense(id: string, data: UpdateExpenseRequest): Promise<{ message: string; expense: Expense }> {
    return this.request<{ message: string; expense: Expense }>(`/update-expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExpense(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/delete-expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async addObligation(data: AddObligationRequest): Promise<{ message: string; obligation: Obligation }> {
    return this.request<{ message: string; obligation: Obligation }>('/add-obligation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getObligations(): Promise<{ obligations: Obligation[] }> {
    return this.request<{ obligations: Obligation[] }>('/get-obligations', {
      method: 'GET',
    });
  }

  async updateObligation(id: string, data: UpdateObligationRequest): Promise<{ message: string; obligation: Obligation }> {
    return this.request<{ message: string; obligation: Obligation }>(`/update-obligation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteObligation(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/delete-obligations/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks Module endpoints
  async createTask(data: CreateTaskRequest): Promise<{ message: string; task: Task }> {
    return this.request<{ message: string; task: Task }>('/create-task', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTasks(type?: 'DAILY' | 'WEEKLY' | 'MONTHLY'): Promise<{ tasks: Task[] }> {
    const url = type ? `/get-tasks?type=${type}` : '/get-tasks';
    return this.request<{ tasks: Task[] }>(url, {
      method: 'GET',
    });
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<{ message: string; task: Task }> {
    return this.request<{ message: string; task: Task }>(`/update-task/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleTask(id: string): Promise<{ message: string; task: Task }> {
    return this.request<{ message: string; task: Task }>(`/toggle-task/${id}`, {
      method: 'PATCH',
    });
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/delete-task/${id}`, {
      method: 'DELETE',
    });
  }

  // Goals Module endpoints
  async addGoal(data: AddGoalRequest): Promise<{ message: string; goal: Goal }> {
    return this.request<{ message: string; goal: Goal }>('/add-goal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGoals(): Promise<{ goals: Goal[] }> {
    return this.request<{ goals: Goal[] }>('/get-goals', {
      method: 'GET',
    });
  }

  async addNewAmount(id: string, data: AddNewAmountRequest): Promise<{ message: string; goal: Goal }> {
    return this.request<{ message: string; goal: Goal }>(`/add-new-amount/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateGoal(id: string, data: UpdateGoalRequest): Promise<{ message: string; goal: Goal }> {
    return this.request<{ message: string; goal: Goal }>(`/update-goal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/delete-goal/${id}`, {
      method: 'DELETE',
    });
  }

  // Smart Notes Module endpoints
  async createNote(data: CreateNoteRequest): Promise<{ message: string; note: SmartNote }> {
    return this.request<{ message: string; note: SmartNote }>('/create-note', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNote(id: string, data: UpdateNoteRequest): Promise<{ message: string; note: SmartNote }> {
    return this.request<{ message: string; note: SmartNote }>(`/update-note/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAllNotes(): Promise<{ notes: SmartNote[] }> {
    return this.request<{ notes: SmartNote[] }>('/get-all-notes', {
      method: 'GET',
    });
  }

  async getNotesByCategory(category: string): Promise<{ notes: SmartNote[] }> {
    return this.request<{ notes: SmartNote[] }>(`/get-note-by-category?category=${category}`, {
      method: 'GET',
    });
  }

  async deleteNote(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/delete-note/${id}`, {
      method: 'DELETE',
    });
  }

  // Notification Management endpoints
  async getNotifications(): Promise<{ success: boolean; data: Notification[] }> {
    return this.request<{ success: boolean; data: Notification[] }>('/get-noti', {
      method: 'GET',
    });
  }

  async readNotification(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/read-noti/${id}`, {
      method: 'PATCH',
    });
  }

  async deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/delete-noti/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteAllNotifications(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/delete-all-noti', {
      method: 'DELETE',
    });
  }

  async getNotificationSettings(): Promise<NotificationSetting[]> {
    return this.request<NotificationSetting[]>('/noti-settings', {
      method: 'GET',
    });
  }

  async updateNotificationSetting(id: string, enabled: boolean): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/noti-settings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
