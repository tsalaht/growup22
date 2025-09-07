import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const deleteExpenseSchema = z.object({
  id: z.string(),
});

export const deleteExpenseProcedure = protectedProcedure
  .input(deleteExpenseSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch(`https://api.growupe.com/api/delete-expenses/${input.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete expense');
    }
    
    return await response.json();
  });