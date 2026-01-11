import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Highlight {
  icon: string;
  title: string;
  description: string;
}

interface Step {
  title: string;
  detail: string;
}

interface Metric {
  value: string;
  label: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  readonly highlights: ReadonlyArray<Highlight> = [
    {
      icon: 'heroShieldCheckSolid',
      title: 'Respuesta confiable',
      description: 'Protocolos claros y trazables para garantizar soluciones verificadas.',
    },
    {
      icon: 'heroMegaphoneSolid',
      title: 'Comunicación directa',
      description: 'Los vecinos reciben actualizaciones puntuales de cada incidencia registrada.',
    },
    {
      icon: 'heroBoltSolid',
      title: 'Prioridad inteligente',
      description: 'Algoritmos sencillos que ordenan los reportes según criticidad y sector.',
    },
  ];

  readonly steps: ReadonlyArray<Step> = [
    {
      title: '1. Reporta',
      detail:
        'La ciudadanía describe la incidencia y adjunta evidencia desde cualquier dispositivo.',
    },
    {
      title: '2. Coordina',
      detail:
        'El equipo municipal asigna responsables, tiempos de respuesta y recursos necesarios.',
    },
    {
      title: '3. Resuelve',
      detail:
        'Se ejecutan las acciones y se informa el cierre con transparencia y respaldo documental.',
    },
  ];

  readonly metrics: ReadonlyArray<Metric> = [
    { value: '92 %', label: 'de reportes con seguimiento activo' },
    { value: '48 h', label: 'tiempo promedio de respuesta' },
    { value: '35 zonas', label: 'del distrito cubiertas' },
  ];
}
