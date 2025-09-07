import { protectedProcedure } from '../../../create-context';

export const logoutProcedure = protectedProcedure
  .mutation(async ({ ctx }) => {
    const response = await fetch('https://api.growupe.com/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }
    
    return await response.json();
  });