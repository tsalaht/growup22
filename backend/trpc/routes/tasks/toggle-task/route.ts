import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const toggleTaskSchema = z.object({
  id: z.string(),
});

export const toggleTaskProcedure = protectedProcedure
  .input(toggleTaskSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch(`https://api.growupe.com/api/toggle-task/${input.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle task');
    }
    
    return await response.json();
  });