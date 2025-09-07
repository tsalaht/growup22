import { protectedProcedure } from '../../../create-context';

export const getObligationsProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const response = await fetch('https://api.growupe.com/api/get-obligations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get obligations');
    }
    
    return await response.json();
  });