import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon';
import { StoreService } from '../../core/store';
import { TransactionType } from '../../core/types';

const ICON_OPTIONS = [
  'Utensils',
  'Coffee',
  'Bus',
  'ShoppingBag',
  'Home',
  'Film',
  'Pill',
  'Briefcase',
  'Gift',
  'TrendingUp',
  'Wallet',
  'HandCoins',
];

const COLOR_OPTIONS = [
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#10B981',
  '#059669',
  '#14B8A6',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
];

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, FormsModule, CategoryIconComponent],
  templateUrl: './categories.html',
})
export class CategoriesComponent {
  store = inject(StoreService);

  activeTab = signal<TransactionType>('expense');
  isAdding = signal(false);
  newName = signal('');
  newIcon = signal('Utensils');
  newColor = signal('#3182f6');

  iconOptions = ICON_OPTIONS;
  colorOptions = COLOR_OPTIONS;

  filteredCategories = computed(() =>
    this.store.categories().filter((c) => c.type === this.activeTab()),
  );

  openAdd() {
    this.newName.set('');
    this.newIcon.set('Utensils');
    this.newColor.set('#3182f6');
    this.isAdding.set(true);
  }

  add() {
    if (!this.newName().trim()) return;
    this.store.addCategory({
      name: this.newName().trim(),
      iconName: this.newIcon(),
      color: this.newColor(),
      type: this.activeTab(),
    });
    this.isAdding.set(false);
  }

  deleteCategory(id: string, name: string) {
    if (confirm(`'${name}' 카테고리를 삭제하시겠습니까 ?`)) {
      this.store.deleteCategory(id);
    }
  }
}
