import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  router = inject(Router);
  swUpdate = inject(SwUpdate, { optional: true });

  isAddPage() {
    return this.router.url === '/add';
  }

  ngOnInit() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (!this.swUpdate?.isEnabled) return;

    this.swUpdate.versionUpdates
      .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
      .subscribe(() => {
        this.swUpdate?.activateUpdate().then(() => {
          document.location.reload();
        });
      });

    setInterval(
      () => {
        this.swUpdate?.checkForUpdate();
      },
      30 * 60 * 1000,
    );
  }
}
