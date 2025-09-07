import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordProcedure = publicProcedure
  .input(forgotPasswordSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset email');
    }
    
    return await response.json();
  });