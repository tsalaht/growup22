import { protectedProcedure } from '../../../create-context';

export const getCurrentMonthExpensesProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const response = await fetch('https://api.growupe.com/api/expenses-current-month', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get current month expenses');
    }
    
    return await response.json();
  });