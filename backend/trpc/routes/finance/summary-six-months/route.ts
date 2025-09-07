import { protectedProcedure } from '../../../create-context';

export const summaryProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const response = await fetch('https://api.growupe.com/api/summary-six-months', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get summary');
    }
    
    return await response.json();
  });