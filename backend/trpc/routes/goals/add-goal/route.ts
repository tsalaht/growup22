import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const addGoalSchema = z.object({
  type: z.string(),
  name: z.string(),
  totalCost: z.number(),
  targetDate: z.string(),
  currentAmount: z.number(),
  monthlySavingPlan: z.number(),
});

export const addGoalProcedure = protectedProcedure
  .input(addGoalSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/add-goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add goal');
    }
    
    return await response.json();
  });