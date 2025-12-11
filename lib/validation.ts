import { z } from 'zod';

export const LoanApplicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email().optional().or(z.literal('')).or(z.undefined()),
  phone: z.string().optional().or(z.literal('')).or(z.undefined()),
  age: z.number().int().min(21, 'Minimum age is 21').max(60, 'Maximum age is 60'),
  employment_type: z.enum(['salaried', 'self_employed'], {
    errorMap: () => ({ message: 'Invalid employment type' }),
  }),
  monthly_income: z.number().min(20000, 'Minimum monthly income is ₹20,000'),
  existing_emi: z.number().min(0, 'EMI cannot be negative').default(0),
  loan_type: z.string().min(2, 'Please specify loan type'),
  loan_amount: z.number().min(1000, 'Minimum loan amount is ₹1,000').max(100000000, 'Loan amount too high'),
  tenure_months: z.number().int().min(6, 'Minimum tenure is 6 months').max(360, 'Maximum tenure is 360 months'),
});

export type LoanApplicationInput = z.infer<typeof LoanApplicationSchema>;
