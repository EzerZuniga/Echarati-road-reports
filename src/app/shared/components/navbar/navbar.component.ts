import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription!: Subscription;
  private routerSubscription?: Subscription;
  menuOpen = false;
  showLoginModal = false;
  profileMenuOpen = false;
  private readonly defaultReturnUrl = '/reports';
  loginReturnUrl = this.defaultReturnUrl;
  readonly primaryLinks: ReadonlyArray<{
    label: string;
    path: string;
    fragment?: string;
    exact?: boolean;
  }> = [
    { label: 'Inicio', path: '/', exact: true },
    { label: 'Mis reportes', path: '/reports', exact: false },
    { label: 'Contacto', path: '/', fragment: 'contacto' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private hostRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService
      .getCurrentUserObservable()
      .subscribe((user) => (this.currentUser = user));

    // Revisar si la URL pide mostrar el modal al cargar
    this.syncLoginModalFromQuery(this.router.url);

    // Close mobile menu on navigation end and reaccionar a parámetros
    this.routerSubscription = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.menuOpen = false;
        this.closeProfileMenu();
        this.syncLoginModalFromQuery(evt.urlAfterRedirects);
        return;
      }

      if ((evt as { url?: string }).url) {
        this.menuOpen = false;
        this.closeProfileMenu();
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
    this.closeProfileMenu();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.closeProfileMenu();
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.closeProfileMenu();
  }

  openLoginModal(returnUrl?: string): void {
    this.closeProfileMenu();
    this.loginReturnUrl =
      returnUrl && returnUrl.trim().length > 0 ? returnUrl : this.defaultReturnUrl;
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
    this.loginReturnUrl = this.defaultReturnUrl;
  }

  handleNewReport(): void {
    if (this.isLoggedIn()) {
      this.closeMenu();
      void this.router.navigate(['/reports/new']);
      return;
    }

    this.closeMenu();
    this.openLoginModal('/reports/new');
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  get userInitials(): string {
    if (!this.currentUser?.name) {
      return 'U';
    }

    return this.currentUser.name
      .split(' ')
      .map((part) => part.trim().charAt(0))
      .filter((char) => !!char)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  get userLabel(): string {
    const name = this.currentUser?.name?.trim();
    if (!name || /demo/i.test(name)) {
      return 'Sesión operativa';
    }
    return name;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as Node;
    if (!this.hostRef.nativeElement.contains(target)) {
      this.closeMenu();
      this.closeProfileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeMenu();
    this.closeProfileMenu();
  }

  private syncLoginModalFromQuery(url: string): void {
    const tree = this.router.parseUrl(url);
    const requestedAuth = tree.queryParams['auth'];

    if (requestedAuth !== 'login') {
      return;
    }

    const candidateReturnUrl = tree.queryParams['returnUrl'];
    this.loginReturnUrl =
      typeof candidateReturnUrl === 'string' && candidateReturnUrl.trim().length > 0
        ? candidateReturnUrl
        : this.defaultReturnUrl;

    if (!this.showLoginModal) {
      this.showLoginModal = true;
    }

    void this.router.navigate([], {
      queryParams: { auth: null, returnUrl: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
