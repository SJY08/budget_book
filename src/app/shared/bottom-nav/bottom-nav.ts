import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bottom-nav.html',
})
export class BottomNavComponent {
  router = inject(Router);

  isActive(path: string) {
    if (path === '/home') return this.router.url === '/home';
    return this.router.url.startsWith(path);
  }
}
