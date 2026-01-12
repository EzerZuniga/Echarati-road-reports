import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, Subscription } from 'rxjs';
import { distinctUntilChanged, mapTo, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkService implements OnDestroy {
  private readonly onlineSubject = new BehaviorSubject<boolean>(this.getNavigatorStatus());
  private readonly subscription: Subscription;

  constructor(private zone: NgZone) {
    if (typeof window === 'undefined') {
      this.subscription = new Subscription();
      return;
    }

    const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));
    const online$ = fromEvent(window, 'online').pipe(mapTo(true));

    this.subscription = merge(online$, offline$)
      .pipe(startWith(this.getNavigatorStatus()), distinctUntilChanged())
      .subscribe((status) => {
        this.zone.run(() => {
          this.onlineSubject.next(status);
        });
      });
  }

  get online$(): Observable<boolean> {
    return this.onlineSubject.asObservable();
  }

  get isOnline(): boolean {
    return this.onlineSubject.value;
  }

  private getNavigatorStatus(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return true;
    }
    return navigator.onLine ?? true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.onlineSubject.complete();
  }
}
