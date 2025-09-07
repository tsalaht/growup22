import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const addObligationSchema = z.object({
  name: z.string(),
  amount: z.number(),
  date: z.string(),
  note: z.string().optional(),
});

export const addObligationProcedure = protectedProcedure
  .input(addObligationSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/add-obligation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add obligation');
    }
    
    return await response.json();
  });