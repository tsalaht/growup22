import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const updateObligationSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  date: z.string(),
  note: z.string().optional(),
});

export const updateObligationProcedure = protectedProcedure
  .input(updateObligationSchema)
  .mutation(async ({ input, ctx }) => {
    const { id, ...data } = input;
    const response = await fetch(`https://api.growupe.com/api/update-obligation/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update obligation');
    }
    
    return await response.json();
  });