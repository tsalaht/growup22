import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

const addExpenseSchema = z.object({
  name: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string(),
  note: z.string().optional(),
});

export const addExpenseProcedure = protectedProcedure
  .input(addExpenseSchema)
  .mutation(async ({ input, ctx }) => {
    // Mock data for now - replace with actual API call when backend is ready
    const mockExpense = {
      id: `expense_${Date.now()}`,
      userId: ctx.userId,
      name: input.name,
      amount: input.amount,
      category: input.category,
      date: input.date,
      note: input.note || '',
      createdAt: new Date().toISOString(),
    };
    
    return {
      message: 'تم إضافة المصروف بنجاح',
      expense: mockExpense
    };
  });