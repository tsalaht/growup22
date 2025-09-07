import { protectedProcedure } from '../../../create-context';

export const getIncomeProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const response = await fetch('https://api.growupe.com/api/get-income', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ctx.token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get income');
    }
    
    return await response.json();
  });