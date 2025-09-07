import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const activateSchema = z.object({
  activationToken: z.string(),
  activationCode: z.string(),
});

export const activateProcedure = publicProcedure
  .input(activateSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Activation failed');
    }
    
    return await response.json();
  });