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
    return this.router.url.includes(path);
  }
}
