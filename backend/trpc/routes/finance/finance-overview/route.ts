import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const financeOverviewSchema = z.object({
  month: z.string().optional(),
});

export const financeOverviewProcedure = protectedProcedure
  .input(financeOverviewSchema)
  .query(async ({ input, ctx }) => {
    const response = await fetch('https://api.growupe.com/api/finance-overview', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get finance overview');
    }
    
    return await response.json();
  });