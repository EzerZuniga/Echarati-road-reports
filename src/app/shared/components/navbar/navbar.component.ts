import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription!: Subscription;
  private routerSubscription?: Subscription;
  menuOpen = false;
  showLoginModal = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private hostRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUserObservable().subscribe(
      user => this.currentUser = user
    );

    // Close mobile menu on navigation end
    this.routerSubscription = this.router.events.subscribe(evt => {
      // close on any navigation event that ends or errors
      // we don't import exact event classes here to keep bundle small
      if ((evt as any).url) {
        this.menuOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as Node;
    if (!this.hostRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeMenu();
  }
}