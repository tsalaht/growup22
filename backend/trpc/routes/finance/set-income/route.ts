import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const setIncomeSchema = z.object({
  amount: z.number(),
  month: z.string(),
});

export const setIncomeProcedure = protectedProcedure
  .input(setIncomeSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/set-income', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set income');
    }
    
    return await response.json();
  });