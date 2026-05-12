import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.html',
})
export class NavComponent {
  router = inject(Router);

  isActive(path: string) {
    return this.router.url.includes(path);
  }

  navItems = [
    { path: '/home', icon: '🏠', label: '홈' },
    { path: '/calendar', icon: '📆', label: '캘린더' },
    { path: '/stats', icon: '📊', label: '통계' },
  ];
}
