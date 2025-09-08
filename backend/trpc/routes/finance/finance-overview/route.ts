import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const financeOverviewSchema = z.object({
  month: z.string().optional(),
});

export const financeOverviewProcedure = protectedProcedure
  .input(financeOverviewSchema)
  .query(async ({ input, ctx }) => {
    const month = input.month || new Date().toISOString().slice(0, 7);
    
    // Mock data for now - replace with actual API call when backend is ready
    const mockData = {
      data: {
        income: 5000,
        totalExpenses: 2500,
        totalObligations: 1000,
        remaining: 1500
      }
    };
    
    return mockData;
  });