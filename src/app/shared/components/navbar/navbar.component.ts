import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  computed,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

interface MenuItem {
  label: string;
  path: string;
  icon?: string; // Emoji for now, or svg path later
  exact?: boolean;
  fragment?: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser = signal<User | null>(null);

  // UI States
  menuOpen = signal(false);
  profileMenuOpen = signal(false);
  notificationsOpen = signal(false);
  showLoginModal = false;

  private userSubscription!: Subscription;
  private routerSubscription?: Subscription;
  private readonly defaultReturnUrl = '/reports';
  loginReturnUrl = this.defaultReturnUrl;

  // --- Computed Menus based on Role ---
  readonly menuItems = computed<MenuItem[]>(() => {
    const user = this.currentUser();

    // 1. Guest
    if (!user) {
      return [
        { label: 'Inicio', path: '/', exact: true },
        { label: 'Explorar Mapa', path: '/', fragment: 'mapa' }, // Placeholder
        { label: 'Contacto', path: '/', fragment: 'contacto' },
      ];
    }

    // 2. Admin
    if (user.role === 'ADMIN') {
      return [
        { label: 'Dashboard', path: '/', fragment: 'dashboard', exact: true },
        { label: 'Gestión Reportes', path: '/reports' },
        { label: 'Usuarios', path: '/', fragment: 'usuarios' },
        { label: 'Configuración', path: '/', fragment: 'config' },
      ];
    }

    // 3. Citizen (Default)
    return [
      { label: 'Inicio', path: '/', exact: true },
      { label: 'Mis Reportes', path: '/reports' },
      { label: 'Mapa de Incidentes', path: '/', fragment: 'mapa' },
      { label: 'Ayuda', path: '/', fragment: 'ayuda' },
    ];
  });

  // --- Social Media Links ---
  readonly socialLinks = [
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com' },
    { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com' },
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
    { name: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
  ];

  // --- Mock Notifications ---
  readonly notifications = signal([
    { id: 1, text: 'Su reporte #123 ha sido "En Proceso"', time: 'Hace 2 min', read: false },
    { id: 2, text: 'Bienvenido a la plataforma digital.', time: 'Hace 1 día', read: true },
  ]);

  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  constructor(
    private authService: AuthService,
    private router: Router,
    private hostRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService
      .getCurrentUserObservable()
      .subscribe((user) => this.currentUser.set(user));

    this.syncLoginModalFromQuery(this.router.url);

    this.routerSubscription = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.closeAllMenus();
        this.syncLoginModalFromQuery(evt.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  // --- Actions ---

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    if (this.menuOpen()) {
      this.profileMenuOpen.set(false);
      this.notificationsOpen.set(false);
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen.update((v) => !v);
    if (this.profileMenuOpen()) {
      this.menuOpen.set(false);
      this.notificationsOpen.set(false);
    }
  }

  toggleNotifications(): void {
    this.notificationsOpen.update((v) => !v);
    if (this.notificationsOpen()) {
      this.menuOpen.set(false);
      this.profileMenuOpen.set(false);
    }
  }

  closeAllMenus(): void {
    this.menuOpen.set(false);
    this.profileMenuOpen.set(false);
    this.notificationsOpen.set(false);
  }

  logout(): void {
    this.closeAllMenus();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  handleNewReport(): void {
    if (this.currentUser()) {
      void this.router.navigate(['/reports/new']);
    } else {
      this.openLoginModal('/reports/new');
    }
    this.closeAllMenus();
  }

  // --- Login Modal Logic ---
  openLoginModal(returnUrl?: string): void {
    this.closeAllMenus();
    this.loginReturnUrl = returnUrl?.trim() || this.defaultReturnUrl;
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
    this.loginReturnUrl = this.defaultReturnUrl;
  }

  // --- Helpers ---
  get userInitials(): string {
    const name = this.currentUser()?.name;
    if (!name) return 'U';
    return name
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }

  get userRoleLabel(): string {
    const role = this.currentUser()?.role;
    return role === 'ADMIN' ? 'Administrador' : 'Ciudadano';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.hostRef.nativeElement.contains(event.target)) {
      this.closeAllMenus();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeAllMenus();
  }

  private syncLoginModalFromQuery(url: string): void {
    const tree = this.router.parseUrl(url);
    if (tree.queryParams['auth'] === 'login') {
      const returnUrl = tree.queryParams['returnUrl'];
      this.loginReturnUrl = returnUrl || this.defaultReturnUrl;
      this.showLoginModal = true;

      // Clear params
      this.router.navigate([], {
        queryParams: { auth: null, returnUrl: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }
}
