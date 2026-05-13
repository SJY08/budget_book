import { Component, input, output } from '@angular/core';
import { CategoryIconComponent } from '../category-icon/category-icon';
import { KrwPipe } from '../pipes/krw-pipe';
import { Category, Transaction } from '../../core/types';

@Component({
  selector: 'app-transaction-item',
  standalone: true,
  imports: [CategoryIconComponent, KrwPipe],
  templateUrl: './transaction-item.html',
})
export class TransactionItemComponent {
  transaction = input.required<Transaction>();
  category = input.required<Category>();
  showDelete = input<boolean>(false);
  deleted = output<string>();
}
