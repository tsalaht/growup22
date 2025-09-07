import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const deleteTaskSchema = z.object({
  id: z.string(),
});

export const deleteTaskProcedure = protectedProcedure
  .input(deleteTaskSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch(`https://api.growupe.com/api/delete-task/${input.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete task');
    }
    
    return await response.json();
  });