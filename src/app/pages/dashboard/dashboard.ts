import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TransactionItemComponent } from '../../shared/transaction-item/transaction-item';
import { KrwPipe } from '../../shared/pipes/krw-pipe';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon';
import { StoreService } from '../../core/store';
import { formatDate, getMonthStartEnd, getNextMonth, getPreviousMonth } from '../../core/utils';
import { Transaction } from '../../core/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, TransactionItemComponent, KrwPipe, CategoryIconComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  store = inject(StoreService);

  today = new Date();
  currentYear = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth() + 1);

  monthLabel = computed(() => `${this.currentYear()}년 ${this.currentMonth()}월`);

  monthTransactions = computed(() => {
    const { start, end } = getMonthStartEnd(this.currentYear(), this.currentMonth());
    return this.store.allTransactions().filter((t) => t.date >= start && t.date <= end);
  });

  totalExpense = computed(() =>
    this.monthTransactions()
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0),
  );

  totalIncome = computed(() =>
    this.monthTransactions()
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0),
  );

  categoryTotals = computed(() => {
    const expenses = this.monthTransactions().filter((t) => t.type === 'expense');
    const totals: Record<string, number> = {};
    expenses.forEach((t) => {
      totals[t.categoryId] = totals[t.categoryId || 0] + t.amount;
    });
    return Object.entries(totals)
      .map(([id, amount]) => ({
        category: this.store.getCategoryById(id),
        amount,
        percentage: this.totalExpense() > 0 ? (amount / this.totalExpense()) * 100 : 0,
      }))
      .filter((item) => item.category)
      .sort((a, b) => b.amount - a.amount);
  });

  topCategory = computed(() => this.categoryTotals()[0]);

  groupedRecent = computed(() => {
    const sorted = [...this.monthTransactions()].slice(0, 6);
    const groups: { date: string; items: Transaction[] }[] = [];
    sorted.forEach((t) => {
      const last = groups[groups.length - 1];
      if (last && last.date === t.date) last.items.push(t);
      else groups.push({ date: t.date, items: [t] });
    });
    return groups;
  });

  prevMonth() {
    const { year, month } = getPreviousMonth(this.currentYear(), this.currentMonth());
    this.currentYear.set(year);
    this.currentMonth.set(month);
  }

  nextMonth() {
    const { year, month } = getNextMonth(this.currentYear(), this.currentMonth());
    this.currentYear.set(year);
    this.currentMonth.set(month);
  }

  formatDate = formatDate;
}
