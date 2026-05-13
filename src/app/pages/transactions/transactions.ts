import { Component, computed, inject } from '@angular/core';
import { TransactionItemComponent } from '../../shared/transaction-item/transaction-item';
import { KrwPipe } from '../../shared/pipes/krw-pipe';
import { StoreService } from '../../core/store';
import { Transaction } from '../../core/types';
import { formatDate } from '../../core/utils';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TransactionItemComponent, KrwPipe],
  templateUrl: './transactions.html',
})
export class TransactionsComponent {
  store = inject(StoreService);

  groupedTransactions = computed(() => {
    const groups: { date: string; items: Transaction[]; dayTotal: number }[] = [];
    this.store.allTransactions().forEach((t) => {
      const last = groups[groups.length - 1];
      if (last && last.date === t.date) {
        last.items.push(t);
        last.dayTotal += t.type === 'expense' ? -t.amount : t.amount;
      } else {
        groups.push({
          date: t.date,
          items: [t],
          dayTotal: t.type === 'expense' ? -t.amount : t.amount,
        });
      }
    });
    return groups;
  });

  deleteTransaction(id: string) {
    if (confirm('이 내역을 삭제하시겠습니까?')) {
      this.store.deleteTransaction(id);
    }
  }

  formatDate = formatDate;
}
