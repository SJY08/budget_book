import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction';
import { TransactionsComponent } from './pages/transactions/transactions';
import { AnalyticsComponent } from './pages/analytics/analytics';
import { CategoriesComponent } from './pages/categories/categories';
import { CategoryDetailComponent } from './pages/category-detail/category-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'add', component: AddTransactionComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'category/:id', component: CategoryDetailComponent },
  { path: '**', redirectTo: 'home' },
];
