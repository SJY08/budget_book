import { Component, computed, inject } from '@angular/core';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon';
import { KrwPipe } from '../../shared/pipes/krw-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../core/store';
import { formatDate } from '../../core/utils';
import { Transaction } from '../../core/types';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CategoryIconComponent, KrwPipe],
  templateUrl: './category-detail.html',
})
export class CategoryDetailComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(StoreService);

  categoryId = this.route.snapshot.paramMap.get('id') ?? '';

  category = computed(() => this.store.getCategoryById(this.categoryId));

  categoryTransactions = computed(() =>
    this.store.allTransactions().filter((t) => t.categoryId === this.categoryId),
  );

  totalAmount = computed(() => this.categoryTransactions().reduce((s, t) => s + t.amount, 0));

  chartData = computed(() => {
    const today = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const amount = this.categoryTransactions()
        .filter((t) => t.date.startsWith(monthStr))
        .reduce((s, t) => s + t.amount, 0);
      return { label: `${d.getMonth() + 1}월`, amount, isCurrent: i === 5 };
    });
  });

  maxAmount = computed(() => Math.max(...this.chartData().map((d) => d.amount), 1));

  comparisonText = computed(() => {
    const data = this.chartData();
    const curr = data[5].amount;
    const prev = data[4].amount;
    const isIncome = this.category()?.type === 'income';

    if (prev === 0 && curr > 0)
      return isIncome ? '자난달엔 수입이 없었어요' : '지난달엔 지출이 없었어요';
    if (prev === 0) return '';
    const pct = Math.round((Math.abs(curr - prev) / prev) * 100);
    if (curr > prev)
      return isIncome ? `지난달보다 ${pct}% 더 벌었어요` : `지난달보다 ${pct}% 더 썼어요`;
    if (curr < prev)
      return isIncome ? `지난달보다 ${pct}% 덜 벌었어요` : `지난달보다 ${pct}% 덜 썼어요`;
    return '지난달과 똑같아요';
  });

  comparisonColor = computed(() => {
    const text = this.comparisonText();
    const isIncome = this.category()?.type === 'income';
    if (text.includes('더')) return isIncome ? 'text-success' : 'text-danger';
    if (text.includes('덜')) return isIncome ? 'text-danger' : 'text-success';
    return 'text-text-secondary';
  });

  groupedTransactions = computed(() => {
    const groups: { date: string; items: Transaction[] }[] = [];
    this.categoryTransactions().forEach((t) => {
      const last = groups[groups.length - 1];
      if (last && last.date === t.date) last.items.push(t);
      else groups.push({ date: t.date, items: [t] });
    });
    return groups;
  });

  goBack() {
    this.router.navigate(['/categories']);
  }

  formatDate = formatDate;
}
