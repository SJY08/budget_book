import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BudgetService } from '../../core/budget';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './category-manager.html',
})
export class CategoryManagerComponent {
  budgetService = inject(BudgetService);

  isAdding = signal(false);
  newName = signal('');
  newIcon = signal('💠');
  newColor = signal('#6366f1');

  iconOptions = [
    '🍽️',
    '🚌',
    '🛍️',
    '💰',
    '🏥',
    '🎮',
    '☕',
    '✈️',
    '🏠',
    '📚',
    '💄',
    '🎵',
    '⚽',
    '🐶',
    '💡',
  ];

  add() {
    if (!this.newName().trim()) return;
    this.budgetService.addCategory(this.newName().trim(), this.newIcon(), this.newColor());

    this.newName.set('');
    this.newIcon.set('💠');
    this.newColor.set('#6366f1');
    this.isAdding.set(false);
  }
}
