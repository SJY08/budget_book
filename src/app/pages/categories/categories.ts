import {
  Component,
  inject,
  signal,
  computed,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../core/store';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon';
import { TransactionType } from '../../core/types';
import { MotionService } from '../../core/motion.service';
import { SwipeDirective } from '../../core/swipe.directive';

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
  imports: [RouterLink, FormsModule, CategoryIconComponent, SwipeDirective],
  templateUrl: './categories.html',
})
export class CategoriesComponent implements AfterViewInit {
  store = inject(StoreService);
  motion = inject(MotionService);

  @ViewChild('modal') modalEl!: ElementRef;
  @ViewChild('header') headerEl!: ElementRef;
  @ViewChild('addBtn') addBtnEl!: ElementRef;
  @ViewChild('tabContent') tabContentEl!: ElementRef;
  @ViewChildren('catCard') catCards!: QueryList<ElementRef>;

  activeTab = signal<TransactionType>('expense');
  swipeDir = signal<'left' | 'right' | null>(null);
  isAdding = signal(false);
  newName = signal('');
  newIcon = signal('Utensils');
  newColor = signal('#3182f6');

  iconOptions = ICON_OPTIONS;
  colorOptions = COLOR_OPTIONS;

  filteredCategories = computed(() =>
    this.store.categories().filter((c) => c.type === this.activeTab()),
  );

  ngAfterViewInit() {
    this.motion.fadeUp(this.headerEl.nativeElement, 0);
    this.motion.fadeUp(this.addBtnEl.nativeElement, 0.08);
    this.catCards.forEach((card, i) => {
      this.motion.fadeUp(card.nativeElement, 0.12 + i * 0.06);
    });
  }

  switchTab(tab: TransactionType, dir: 'left' | 'right') {
    if (this.activeTab() === tab) return;
    this.swipeDir.set(dir);
    this.activeTab.set(tab);
    setTimeout(() => this.swipeDir.set(null), 300);
  }

  onSwipeLeft() {
    if (this.activeTab() === 'expense') this.switchTab('income', 'left');
  }

  onSwipeRight() {
    if (this.activeTab() === 'income') this.switchTab('expense', 'right');
  }

  openAdd() {
    this.newName.set('');
    this.newIcon.set('Utensils');
    this.newColor.set('#3182f6');
    this.isAdding.set(true);
    setTimeout(() => {
      if (this.modalEl) this.motion.modalIn(this.modalEl.nativeElement);
    }, 0);
  }

  async closeAdd() {
    if (this.modalEl) await this.motion.modalOut(this.modalEl.nativeElement);
    this.isAdding.set(false);
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
    if (confirm(`'${name}' 카테고리를 삭제하시겠습니까?`)) {
      this.store.deleteCategory(id);
    }
  }
}
