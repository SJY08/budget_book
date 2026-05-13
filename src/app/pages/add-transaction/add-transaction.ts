import { Component, computed, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon';
import { KrwPipe } from '../../shared/pipes/krw-pipe';
import { Router } from '@angular/router';
import { StoreService } from '../../core/store';
import { TransactionType } from '../../core/types';
import { getToday } from '../../core/utils';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [FormsModule, CategoryIconComponent],
  templateUrl: './add-transaction.html',
})
export class AddTransactionComponent {
  router = inject(Router);
  store = inject(StoreService);

  type = model<TransactionType>('expense');
  amountStr = model('');
  categoryId = model('');
  date = model(getToday());
  memo = model('');

  amount = computed(() => parseInt(this.amountStr().replace(/[^0-9]/g, ''), 10) || 0);

  filteredCategories = computed(() =>
    this.store.categories().filter((c) => c.type === this.type()),
  );

  handleTypeChange(newType: TransactionType) {
    this.type.set(newType);
    const stillValid = this.store
      .categories()
      .find((c) => c.id === this.categoryId() && c.type === newType);
    if (!stillValid) this.categoryId.set('');
  }

  handleAmountChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/[^0-9]/g, '').slice(0, 12);
    this.amountStr.set(digits);
    input.value = digits ? Number(digits).toLocaleString('ko-KR') : '';
  }

  canSave = computed(() => this.amount() > 0 && this.categoryId() !== '');

  save() {
    if (!this.canSave()) return;
    this.store.addTransaction({
      type: this.type(),
      amount: this.amount(),
      categoryId: this.categoryId(),
      date: this.date(),
      memo: this.memo(),
    });
    this.router.navigate(['/home']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
