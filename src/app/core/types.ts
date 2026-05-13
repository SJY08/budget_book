export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  memo: string;
  createdAt: string;
}
