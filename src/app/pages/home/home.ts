import { Component, inject, signal } from '@angular/core';
import { BudgetFormComponent } from '../../shared/budget-form/budget-form';
import { CategoryManagerComponent } from '../../shared/category-manager/category-manager';
import { RouterLink } from '@angular/router';
import { BudgetService } from '../../core/budget';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BudgetFormComponent, CategoryManagerComponent, RouterLink],
  templateUrl: './home.html',
})
export class HomeComponent {
  budgetService = inject(BudgetService);
  showForm = signal(false);

  thisMonth = new Date().toISOString().slice(0, 7);

  thisMonthTransactions = () =>
    this.budgetService.transactions().filter((t) => t.date.startsWith(this.thisMonth));

  thisMonthIncom = () =>
    this.thisMonthTransactions()
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

  thisMonthExpenese = () =>
    this.thisMonthTransactions()
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

  getCategoryById(id: string) {
    return this.budgetService.categories().find((c) => c.id === id);
  }

  formatAmout(amount: number) {
    return amount.toLocaleString('ko-KR') + '원';
  }
}
