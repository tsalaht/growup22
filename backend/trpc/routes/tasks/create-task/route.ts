import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const createTaskSchema = z.object({
  title: z.string(),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  periodValue: z.string().optional(),
  time: z.string(),
});

export const createTaskProcedure = protectedProcedure
  .input(createTaskSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/create-task', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }
    
    return await response.json();
  });