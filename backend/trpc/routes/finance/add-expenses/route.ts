import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const addExpenseSchema = z.object({
  name: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string(),
  note: z.string().optional(),
});

export const addExpenseProcedure = protectedProcedure
  .input(addExpenseSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/add-expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add expense');
    }
    
    return await response.json();
  });