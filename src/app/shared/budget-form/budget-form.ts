import { Component, inject, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../core/budget';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './budget-form.html',
})
export class BudgetFormComponent {
  budgetService = inject(BudgetService);

  type = model<'income' | 'expense'>('expense');
  amount = model(0);
  description = model('');
  categoryId = model('');
  date = model(new Date().toISOString().slice(0, 10));

  submitted = output<void>();

  submit() {
    if (!this.amount() || !this.description() || !this.categoryId()) return;

    this.budgetService.addTransaction({
      type: this.type(),
      amount: this.amount(),
      description: this.description(),
      categoryId: this.categoryId(),
      date: this.date(),
    });

    this.amount.set(0);
    this.description.set('');
    this.categoryId.set('');
    this.submitted.emit();
  }
}
