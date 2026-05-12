import { computed, effect, Injectable, signal } from '@angular/core';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  categoryId: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private defaultCategories: Category[] = [
    { id: 'food', name: '식비', icon: '🍽️', color: '#f97316' },
    { id: 'transport', name: '교통', icon: '🚌', color: '#3b82f6' },
    { id: 'shopping', name: '쇼핑', icon: '🛍️', color: '#ec4899' },
    { id: 'salary', name: '급여', icon: '💰', color: '#22c55e' },
    { id: 'health', name: '의료', icon: '🏥', color: '#ef4444' },
    { id: 'hobby', name: '취미', icon: '🎮', color: '#8b5cf6' },
  ];

  transactions = signal<Transaction[]>(this.load('transactions', []));
  categories = signal<Category[]>(this.load('categories', this.defaultCategories));

  totalIncome = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0),
  );

  totalExpense = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0),
  );

  balance = computed(() => this.totalIncome() - this.totalExpense());

  transactionByMonth = computed(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of this.transactions()) {
      const key = t.date.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return map;
  });

  dailySummary = computed(() => {
    const map = new Map<string, number>();
    for (const t of this.transactions()) {
      const prev = map.get(t.date) ?? 0;
      map.set(t.date, prev + (t.type === 'income' ? t.amount : -t.amount));
    }
    return map;
  });

  constructor() {
    effect(() => this.save('transactions', this.transactions()));
    effect(() => this.save('categories', this.transactions()));
  }

  addTransaction(t: Omit<Transaction, 'id'>) {
    this.transactions.update((list) => [{ ...t, id: crypto.randomUUID() }, ...list]);
  }

  deleteTransaction(id: string) {
    this.transactions.update((list) => list.filter((t) => t.id !== id));
  }

  addCategory(name: string, icon: string, color: string) {
    this.categories.update((list) => [...list, { id: crypto.randomUUID(), name, icon, color }]);
  }

  deleteCategory(id: string) {
    this.categories.update((list) => list.filter((c) => c.id !== id));
  }

  expenseByCategory(yearMonth: string) {
    return computed(() => {
      const txs = this.transactions().filter(
        (t) => t.type === 'expense' && t.date.startsWith(yearMonth),
      );
      const map = new Map<string, number>();
      for (const t of txs) {
        map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
      }
      return map;
    });
  }

  monthlyTrendByCategory(categoryId: string) {
    return computed(() => {
      const months = [...new Set(this.transactions().map((t) => t.date.slice(0, 7)))].sort();

      return months.map((month) => ({
        month,
        amount: this.transactions()
          .filter((t) => t.categoryId === categoryId && t.date.startsWith(month))
          .reduce((s, t) => s + t.amount, 0),
      }));
    });
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
