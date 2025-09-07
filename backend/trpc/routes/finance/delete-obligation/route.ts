import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const deleteObligationSchema = z.object({
  id: z.string(),
});

export const deleteObligationProcedure = protectedProcedure
  .input(deleteObligationSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch(`https://api.growupe.com/api/delete-obligations/${input.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete obligation');
    }
    
    return await response.json();
  });