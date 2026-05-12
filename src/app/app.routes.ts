import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { CalendarComponent } from './pages/calendar/calendar';
import { StatsComponent } from './pages/stats/stats';
import { CategoryDetailComponent } from './pages/category-detail/category-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'category/:id', component: CategoryDetailComponent },
];
