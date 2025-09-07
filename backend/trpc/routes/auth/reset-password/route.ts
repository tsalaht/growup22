import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const resetPasswordSchema = z.object({
  token: z.string(),
  resetCode: z.string(),
  newPassword: z.string().min(6),
});

export const resetPasswordProcedure = publicProcedure
  .input(resetPasswordSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }
    
    return await response.json();
  });