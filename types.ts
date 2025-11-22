export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum Category {
  TUITION = 'Tuition Fees',
  GOVT_GRANT = 'Government Grant',
  DONATION = 'Donation',
  SALARY = 'Staff Salary',
  MAINTENANCE = 'Maintenance',
  UTILITIES = 'Utilities',
  EQUIPMENT = 'Equipment',
  EVENT = 'Events',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  date: string; // ISO Date string
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  totalFees: number;
  paidFees: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
}

export interface FinancialReport {
  healthScore: number;
  summary: string;
  keyInsights: string[];
  recommendation: string;
}

export type ViewState = 'dashboard' | 'income' | 'expenses' | 'students' | 'ai-report';