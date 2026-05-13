import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KrwPipe } from '../../shared/pipes/krw-pipe';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon';
import { StoreService } from '../../core/store';
import { getMonthStartEnd, getNextMonth, getPreviousMonth } from '../../core/utils';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [RouterLink, KrwPipe, CategoryIconComponent],
  templateUrl: './analytics.html',
})
export class AnalyticsComponent {
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

  net = computed(() => this.totalIncome() - this.totalExpense());

  expenseByCategory = computed(() => {
    const totals: Record<string, number> = {};
    this.monthTransactions()
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
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

  trendData = computed(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(this.currentYear(), this.currentMonth() - 1 - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const expense = this.store
        .allTransactions()
        .filter((t) => t.date.startsWith(monthStr) && t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      data.push({ label: `${d.getMonth() + 1}월`, expense, isCurrent: i === 0 });
    }
    return data;
  });

  maxExpense = computed(() => Math.max(...this.trendData().map((d) => d.expense), 1));

  comparisonText = computed(() => {
    const { year, month } = getPreviousMonth(this.currentYear(), this.currentMonth());
    const { start, end } = getMonthStartEnd(year, month);
    const prevExpense = this.store
      .allTransactions()
      .filter((t) => t.date >= start && t.date <= end && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    if (prevExpense === 0) return this.totalExpense() > 0 ? '지난달엔 지출이 없었어요' : '';
    const pct = Math.round(((this.totalExpense() - prevExpense) / prevExpense) * 100);
    if (pct > 0) return `지난달보다 ${pct}% 더 썼어요`;
    if (pct < 0) return `지난달보다 ${Math.abs(pct)}% 덜 썼어요`;
    return '지난달과 똑같이 썼어요';
  });

  comparisonPositive = computed(() => this.comparisonText().includes('덜'));

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
}
