import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Router,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
} from '@angular/router';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Reportes Ciudadanos';
  loading = false;
  private routerSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Detect navigation events to show a top progress indicator
    this.routerSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.setLoading(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Slight delay to avoid flicker on fast navigations
        timer(120).subscribe(() => this.setLoading(false));
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  setLoading(value: boolean) {
    this.loading = value;
  }
}
