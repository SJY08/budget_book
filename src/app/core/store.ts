import { computed, effect, Injectable, signal } from '@angular/core';
import { Category, Transaction } from './types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1', name: '식비', iconName: 'Utensils', color: '#EF4444', type: 'expense' },
  { id: 'c2', name: '카페', iconName: 'Coffee', color: '#F59E0B', type: 'expense' },
  { id: 'c3', name: '교통', iconName: 'Bus', color: '#3B82F6', type: 'expense' },
  { id: 'c4', name: '쇼핑', iconName: 'ShoppingBag', color: '#EC4899', type: 'expense' },
  { id: 'c5', name: '주거', iconName: 'Home', color: '#10B981', type: 'expense' },
  { id: 'c6', name: '문화', iconName: 'Film', color: '#8B5CF6', type: 'expense' },
  { id: 'c7', name: '의료', iconName: 'Pill', color: '#14B8A6', type: 'expense' },
  { id: 'c8', name: '기타', iconName: 'Package', color: '#6B7280', type: 'expense' },
  { id: 'i1', name: '월급', iconName: 'Briefcase', color: '#059669', type: 'income' },
  { id: 'i2', name: '보너스', iconName: 'Gift', color: '#F59E0B', type: 'income' },
  { id: 'i3', name: '용돈', iconName: 'HandCoins', color: '#3B82F6', type: 'income' },
  { id: 'i4', name: '투자수익', iconName: 'TrendingUp', color: '#8B5CF6', type: 'income' },
  { id: 'i5', name: '기타수입', iconName: 'Wallet', color: '#6B7280', type: 'income' },
];

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  categories = signal<Category[]>(this.load('budget_categories', DEFAULT_CATEGORIES));
  transactions = signal<Transaction[]>(this.load('budget_transactions', []));

  allTransactions = computed(() =>
    [...this.transactions()].sort((a, b) => {
      if (a.date !== b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }),
  );

  constructor() {
    effect(() => this.save('budget_cateogories', this.categories()));
    effect(() => this.save('budget_transactions', this.transactions()));
  }

  getMonthTransactions(year: number, month: number) {
    return computed(() => {
      const start = `${year} - ${String(month).padStart(2, '0')}-01`;
      const end = new Date(year, month, 0);
      const endStr = `${year}-${String(month).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
      return this.transactions().filter((t) => t.date >= start && t.date <= endStr);
    });
  }

  addTransaction(t: Omit<Transaction, 'id' | 'createdAt'>) {
    const newT: Transaction = {
      ...t,
      id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    this.transactions.update((list) => [newT, ...list]);
  }

  deleteTransaction(id: string) {
    this.transactions.update((list) => list.filter((t) => t.id !== id));
  }

  addCategory(cat: Omit<Category, 'id'>) {
    const newCat: Category = { ...cat, id: `c_${Date.now()}` };
    this.categories.update((list) => [...list, newCat]);
  }

  deleteCategory(id: string) {
    this.categories.update((list) => list.filter((c) => c.id !== id));
  }

  getCategoryById(id: string) {
    return this.categories().find((c) => c.id !== id);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
