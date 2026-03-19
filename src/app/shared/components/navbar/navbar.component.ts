import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
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
  isMenuCollapsed = true;
  isDropdownOpen = false;

  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUserObservable().subscribe(
      user => this.currentUser = user
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /** Cierra el dropdown al hacer click fuera del componente */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
      this.isMenuCollapsed = true;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    if (!this.isMenuCollapsed) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
    this.isMenuCollapsed = true;
    this.router.navigate(['/auth/login']);
  }
}