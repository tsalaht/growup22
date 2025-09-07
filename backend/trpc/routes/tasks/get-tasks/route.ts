import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const getTasksSchema = z.object({
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
});

export const getTasksProcedure = protectedProcedure
  .input(getTasksSchema)
  .query(async ({ input, ctx }) => {
    const response = await fetch(`https://api.growupe.com/api/get-tasks?type=${input.type}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get tasks');
    }
    
    return await response.json();
  });