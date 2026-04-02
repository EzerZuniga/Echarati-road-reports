export type LegalPageType = 'privacy' | 'terms';

interface LegalSection {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}

export interface LegalPageContent {
  readonly pageType: LegalPageType;
  readonly title: string;
  readonly subtitle: string;
  readonly lastUpdated: string;
  readonly sections: readonly LegalSection[];
}

export const LEGAL_PAGES_CONTENT: Record<LegalPageType, LegalPageContent> = {
  privacy: {
    pageType: 'privacy',
    title: 'Política de Privacidad',
    subtitle:
      'La Municipalidad Distrital de Echarati protege tus datos personales y los utiliza únicamente para la gestión del servicio de reportes ciudadanos.',
    lastUpdated: '30 de marzo de 2026',
    sections: [
      {
        title: '1. Responsable del tratamiento de datos',
        paragraphs: [
          'La Municipalidad Distrital de Echarati es responsable del tratamiento de los datos personales registrados en esta plataforma.',
          'Para consultas sobre privacidad y protección de datos, puedes escribir a contacto@mde-echarati.gob.pe.',
        ],
      },
      {
        title: '2. Datos que recopilamos',
        paragraphs: ['Recopilamos únicamente la información necesaria para brindar el servicio.'],
        bullets: [
          'Datos de identificación: nombres, DNI y correo electrónico.',
          'Datos del reporte: descripción, categoría, ubicación y evidencia fotográfica.',
          'Datos técnicos básicos: fecha, hora y registro de actividad del sistema.',
        ],
      },
      {
        title: '3. Finalidad del uso de datos',
        paragraphs: ['La información se usa para cumplir funciones de atención ciudadana y mejora del servicio.'],
        bullets: [
          'Registrar y gestionar reportes de incidencias.',
          'Brindar seguimiento y notificaciones sobre el estado del reporte.',
          'Generar estadísticas internas para fortalecer la gestión municipal.',
        ],
      },
      {
        title: '4. Seguridad y conservación',
        paragraphs: [
          'Aplicamos medidas técnicas y organizativas para evitar accesos no autorizados, pérdida o alteración de información.',
          'Los datos se conservan durante el tiempo necesario para cumplir la finalidad del servicio y las obligaciones legales aplicables.',
        ],
      },
      {
        title: '5. Derechos del ciudadano',
        paragraphs: ['Puedes solicitar el ejercicio de tus derechos conforme a la normativa vigente.'],
        bullets: [
          'Acceder a tus datos personales.',
          'Solicitar rectificación o actualización de información inexacta.',
          'Solicitar cancelación cuando corresponda legalmente.',
        ],
      },
    ],
  },
  terms: {
    pageType: 'terms',
    title: 'Términos de Uso',
    subtitle:
      'El uso de esta plataforma implica la aceptación de condiciones orientadas a un servicio público digital seguro, transparente y útil para la ciudadanía.',
    lastUpdated: '30 de marzo de 2026',
    sections: [
      {
        title: '1. Objeto del servicio',
        paragraphs: [
          'La plataforma permite a la ciudadanía del distrito de Echarati registrar reportes sobre incidencias urbanas para su atención por las áreas municipales competentes.',
        ],
      },
      {
        title: '2. Condiciones de registro y uso',
        paragraphs: ['El usuario se compromete a usar el sistema con responsabilidad y buena fe.'],
        bullets: [
          'Proporcionar información real y verificable al crear su cuenta.',
          'Registrar reportes relacionados con hechos ocurridos en el ámbito distrital.',
          'Evitar contenido ofensivo, discriminatorio o ajeno al interés público.',
        ],
      },
      {
        title: '3. Conductas no permitidas',
        paragraphs: [
          'No está permitido usar la plataforma para fines distintos a la participación ciudadana y gestión de incidencias.',
        ],
        bullets: [
          'Suplantar identidad o usar datos de terceros sin autorización.',
          'Publicar información falsa o maliciosa.',
          'Intentar vulnerar la seguridad o disponibilidad del sistema.',
        ],
      },
      {
        title: '4. Tratamiento de reportes',
        paragraphs: [
          'Los reportes recibidos son evaluados y derivados según su tipo, prioridad y competencia institucional.',
          'El registro de un reporte no sustituye los canales de emergencia inmediata ni constituye una obligación de resultado en un plazo fijo.',
        ],
      },
      {
        title: '5. Modificaciones y vigencia',
        paragraphs: [
          'La Municipalidad puede actualizar estos términos para mejorar la prestación del servicio y adecuarse a cambios normativos.',
          'La versión publicada en esta página es la que se considera vigente.',
        ],
      },
    ],
  },
};
