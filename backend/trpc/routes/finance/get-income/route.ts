import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const getIncomeSchema = z.object({
  month: z.string().optional(),
});

export const getIncomeProcedure = protectedProcedure
  .input(getIncomeSchema)
  .query(async ({ input, ctx }) => {
    const month = input.month || new Date().toISOString().slice(0, 7);
    const response = await fetch('https://api.growupe.com/api/get-income', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ month }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get income');
    }
    
    return await response.json();
  });