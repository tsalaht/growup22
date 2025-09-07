import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  periodValue: z.string().optional(),
  time: z.string(),
});

export const updateTaskProcedure = protectedProcedure
  .input(updateTaskSchema)
  .mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input;
    const response = await fetch(`https://api.growupe.com/api/update-task/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update task');
    }
    
    return await response.json();
  });