import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private revealObserver?: IntersectionObserver;

  public menuOpen = false;
  public openFaqIndex: number | null = null;
  public activeSection = 'como-funciona';
  public isScrolled = false;
  public readonly currentYear = new Date().getFullYear();
  public readonly navItems = [
    { id: 'como-funciona', label: 'Cómo funciona', icon: 'info' },
    { id: 'tipos-reporte', label: 'Tipos de reporte', icon: 'report_problem' },
    { id: 'preguntas', label: 'Preguntas frecuentes', icon: 'help' },
  ];
  public readonly socialItems = [
    {
      label: 'Facebook',
      ariaLabel: 'Facebook de la Municipalidad Distrital de Echarati',
      icon: 'bi bi-facebook',
    },
    {
      label: 'Instagram',
      ariaLabel: 'Instagram de la Municipalidad Distrital de Echarati',
      icon: 'bi bi-instagram',
    },
    {
      label: 'YouTube',
      ariaLabel: 'YouTube de la Municipalidad Distrital de Echarati',
      icon: 'bi bi-youtube',
    },
    {
      label: 'Twitter',
      ariaLabel: 'Twitter de la Municipalidad Distrital de Echarati',
      icon: 'bi bi-twitter-x',
    },
  ];

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  public closeMenu(): void {
    this.menuOpen = false;
  }

  public scrollTo(sectionId: string): void {
    this.menuOpen = false;
    this.activeSection = sectionId;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const navbarHeight = this.getNavbarOffset();
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;
      window.scrollTo({ top });
    }, 50);
  }

  public toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  public trackByNavItemId(_: number, item: { id: string }): string {
    return item.id;
  }

  public trackBySocialLabel(_: number, item: { label: string }): string {
    return item.label;
  }

  public trackByLabel(_: number, item: { label: string }): string {
    return item.label;
  }

  public trackByStepNumber(_: number, item: { number: string }): string {
    return item.number;
  }

  public trackByTitle(_: number, item: { title: string }): string {
    return item.title;
  }

  public trackByQuestion(_: number, item: { question: string }): string {
    return item.question;
  }

  public ngAfterViewInit(): void {
    this.setupRevealAnimations();
  }

  public ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  @HostListener('window:resize')
  public onResize(): void {
    if (window.innerWidth > 960 && this.menuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:scroll')
  public onScroll(): void {
    this.isScrolled = window.scrollY > 8;
    const offset = this.getNavbarOffset() + 48;

    for (const item of this.navItems) {
      const section = document.getElementById(item.id);
      if (!section) continue;

      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < bottom) {
        this.activeSection = item.id;
        return;
      }
    }
  }

  private getNavbarOffset(): number {
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    return navbar?.offsetHeight ?? (window.innerWidth <= 640 ? 72 : 76);
  }

  private setupRevealAnimations(): void {
    const host = this.hostElement.nativeElement as HTMLElement;
    const revealElements = Array.from(host.querySelectorAll('.reveal-on-scroll')) as HTMLElement[];

    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((el: HTMLElement) => el.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    revealElements.forEach((el: HTMLElement) => this.revealObserver?.observe(el));
  }

  public readonly stats = [
    {
      icon: 'task_alt',
      value: '92%',
      label: 'Reportes con seguimiento',
    },
    {
      icon: 'schedule',
      value: '48h',
      label: 'Tiempo promedio de respuesta',
    },
    {
      icon: 'map',
      value: '35',
      label: 'Zonas del distrito cubiertas',
    },
    {
      icon: 'people',
      value: '+1,200',
      label: 'Ciudadanos registrados',
    },
  ];

  public readonly steps = [
    {
      number: '01',
      icon: 'app_registration',
      title: 'Crea tu cuenta',
      desc: 'Regístrate con tu DNI en menos de 2 minutos. El proceso es gratuito y seguro.',
    },
    {
      number: '02',
      icon: 'add_photo_alternate',
      title: 'Registra el incidente',
      desc: 'Describe el problema, adjunta evidencias y marca la ubicación exacta en el mapa.',
    },
    {
      number: '03',
      icon: 'notifications_active',
      title: 'Haz seguimiento',
      desc: 'Recibe actualizaciones del estado de tu reporte hasta su atención final.',
    },
  ];

  public readonly reportTypes = [
    {
      icon: 'construction',
      label: 'Baches y Vías',
      desc: 'Daños en calles, jirones y carreteras del distrito.',
    },
    {
      icon: 'wb_incandescent',
      label: 'Alumbrado Público',
      desc: 'Postes apagados, cables expuestos y zonas sin iluminación.',
    },
    {
      icon: 'delete',
      label: 'Limpieza Pública',
      desc: 'Basura acumulada, desmonte y puntos críticos de contaminación.',
    },
    {
      icon: 'water_drop',
      label: 'Agua y Desagüe',
      desc: 'Fugas, inundaciones y problemas del sistema de saneamiento.',
    },
    {
      icon: 'park',
      label: 'Áreas Verdes',
      desc: 'Parques descuidados, árboles caídos y deterioro del espacio urbano.',
    },
    {
      icon: 'security',
      label: 'Seguridad Ciudadana',
      desc: 'Zonas inseguras, vandalismo y daños a la propiedad pública.',
    },
  ];

  public readonly features = [
    {
      icon: 'shield',
      title: 'Seguro y Verificado',
      desc: 'Registro con DNI y validación de identidad ciudadana para garantizar la veracidad de los reportes.',
    },
    {
      icon: 'notifications',
      title: 'Notificaciones en Tiempo Real',
      desc: 'Recibe actualizaciones automáticas del estado de tus reportes directamente en tu dispositivo.',
    },
    {
      icon: 'bolt',
      title: 'Respuesta Rápida',
      desc: 'Sistema de priorización inteligente para que los problemas más críticos sean atendidos primero.',
    },
    {
      icon: 'groups',
      title: 'Comunidad Activa',
      desc: 'Ciudadanos y municipalidad trabajando juntos para construir un distrito mejor.',
    },
    {
      icon: 'insights',
      title: 'Transparencia Total',
      desc: 'Accede a estadísticas públicas sobre los reportes y el nivel de atención municipal.',
    },
    {
      icon: 'devices',
      title: 'Desde Cualquier Dispositivo',
      desc: 'Disponible desde tu celular, tablet o computadora. Sin necesidad de instalar nada.',
    },
  ];

  public readonly faqs = [
    {
      question: '¿Es gratuito registrarse?',
      answer:
        'Sí, el registro y el uso del sistema son completamente gratuitos para todos los ciudadanos del distrito de Echarati.',
    },
    {
      question: '¿Cuánto tiempo tarda en atenderse un reporte?',
      answer:
        'El tiempo promedio de respuesta es de 48 horas. Los reportes de emergencia son priorizados y atendidos en el menor tiempo posible.',
    },
    {
      question: '¿Necesito instalar alguna aplicación?',
      answer:
        'No. El sistema funciona directamente desde el navegador de tu celular o computadora. No requiere ninguna instalación.',
    },
    {
      question: '¿Puedo reportar de forma anónima?',
      answer:
        'Para garantizar la veracidad y el seguimiento adecuado, es necesario crear una cuenta con tu DNI. Tu información personal es estrictamente confidencial.',
    },
    {
      question: '¿Puedo ver el estado de mis reportes anteriores?',
      answer:
        'Sí. Desde tu panel ciudadano puedes ver el historial completo de tus reportes, el estado actual de cada uno y los comentarios de la municipalidad.',
    },
  ];
}
