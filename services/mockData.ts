import { Transaction, TransactionType, Category, Student } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-01', description: 'Term 1 Fees - Grade 10', amount: 50000, type: TransactionType.INCOME, category: Category.TUITION },
  { id: '2', date: '2023-10-02', description: 'October Staff Salaries', amount: 35000, type: TransactionType.EXPENSE, category: Category.SALARY },
  { id: '3', date: '2023-10-05', description: 'Electricity Bill Sept', amount: 1200, type: TransactionType.EXPENSE, category: Category.UTILITIES },
  { id: '4', date: '2023-10-10', description: 'Annual Science Fair Grant', amount: 15000, type: TransactionType.INCOME, category: Category.GOVT_GRANT },
  { id: '5', date: '2023-10-12', description: 'Lab Equipment Upgrade', amount: 8000, type: TransactionType.EXPENSE, category: Category.EQUIPMENT },
  { id: '6', date: '2023-10-15', description: 'Roof Repair Block A', amount: 4500, type: TransactionType.EXPENSE, category: Category.MAINTENANCE },
  { id: '7', date: '2023-10-20', description: 'Alumni Donation', amount: 2000, type: TransactionType.INCOME, category: Category.DONATION },
  { id: '8', date: '2023-10-25', description: 'Internet Service', amount: 300, type: TransactionType.EXPENSE, category: Category.UTILITIES },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 'S001', name: 'Alice Johnson', grade: '10A', totalFees: 5000, paidFees: 5000, status: 'PAID' },
  { id: 'S002', name: 'Bob Smith', grade: '10A', totalFees: 5000, paidFees: 2500, status: 'PARTIAL' },
  { id: 'S003', name: 'Charlie Brown', grade: '10B', totalFees: 5000, paidFees: 0, status: 'PENDING' },
  { id: 'S004', name: 'Diana Prince', grade: '11A', totalFees: 5500, paidFees: 5500, status: 'PAID' },
  { id: 'S005', name: 'Evan Wright', grade: '11A', totalFees: 5500, paidFees: 1000, status: 'PARTIAL' },
  { id: 'S006', name: 'Fiona Green', grade: '9B', totalFees: 4500, paidFees: 4500, status: 'PAID' },
];