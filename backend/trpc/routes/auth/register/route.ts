import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerProcedure = publicProcedure
  .input(registerSchema)
  .mutation(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return await response.json();
  });