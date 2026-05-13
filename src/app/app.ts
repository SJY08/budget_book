import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './app.html',
})
export class App {
  router = inject(Router);

  isAddPage() {
    return this.router.url === '/add';
  }
}
