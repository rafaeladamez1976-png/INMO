/**
 * Tablón de novedades por oficina.
 *
 * Contenido público que cada oficina publica para sus clientes: entradas de
 * cartera, bajadas de precio, avisos de horario y consejos de zona.
 *
 * Es un tablón, no un chat: se publica desde el repositorio y se ve en la web.
 * Para hablar entre oficinas está Google Chat, que la empresa ya tiene, y para
 * hablar con clientes está WhatsApp, que es donde ellos escriben.
 *
 * Para publicar una novedad basta con añadir una entrada aquí arriba del todo.
 * No hay panel que mantener ni base de datos que pagar.
 */

export type TipoNovedad = 'cartera' | 'precio' | 'aviso' | 'consejo' | 'zona';

export interface Novedad {
  id: string;
  /** Identificador de la oficina, o 'todas' si es de la empresa entera. */
  oficina: string;
  tipo: TipoNovedad;
  titulo: string;
  texto: string;
  /** ISO corto. */
  fecha: string;
  /** Referencia de inmueble, si la novedad va de uno concreto. */
  inmueble?: string;
}

export const ETIQUETAS: Record<TipoNovedad, { nombre: string; tono: string }> = {
  cartera: { nombre: 'Nueva cartera', tono: 'laton' },
  precio: { nombre: 'Bajada de precio', tono: 'rojo' },
  aviso: { nombre: 'Aviso', tono: 'grafito' },
  consejo: { nombre: 'Consejo', tono: 'oliva' },
  zona: { nombre: 'La zona', tono: 'oliva' },
};

/** De más reciente a más antigua. */
export const NOVEDADES: Novedad[] = [
  {
    id: 'n-012',
    oficina: 'aluche',
    tipo: 'precio',
    titulo: 'Bajada en el ático de la calle Tembleque',
    texto:
      'El propietario ha ajustado el precio 15.000 €. Sigue siendo el único ático con terraza de más de 20 m² que tenemos en la zona.',
    fecha: '2026-08-14',
    inmueble: 'v-002',
  },
  {
    id: 'n-011',
    oficina: 'todas',
    tipo: 'aviso',
    titulo: 'Horario de agosto',
    texto:
      'Durante agosto las cuatro oficinas cierran por la tarde. Mañanas de 10:00 a 14:00, de lunes a viernes. Por WhatsApp seguimos contestando igual.',
    fecha: '2026-08-12',
  },
  {
    id: 'n-010',
    oficina: 'las-aguilas',
    tipo: 'cartera',
    titulo: 'Entra un adosado con jardín en Las Águilas',
    texto:
      'Cuatro dormitorios, garaje para dos coches y jardín de 60 m². En esta zona sale algo así dos o tres veces al año.',
    fecha: '2026-08-11',
    inmueble: 'v-003',
  },
  {
    id: 'n-009',
    oficina: 'parque-europa',
    tipo: 'consejo',
    titulo: 'Si vas a vender en septiembre, empieza ahora',
    texto:
      'Preparar bien una vivienda lleva unas tres semanas entre fotos, documentación y nota simple. Quien empieza en agosto llega a septiembre con el anuncio publicado y se lleva las primeras visitas del curso.',
    fecha: '2026-08-08',
  },
  {
    id: 'n-008',
    oficina: 'san-ignacio',
    tipo: 'zona',
    titulo: 'Obras en la calle Oliva de Plasencia',
    texto:
      'El Ayuntamiento renueva el acerado hasta octubre. Se puede aparcar sin problema en las calles paralelas y la oficina está abierta con normalidad.',
    fecha: '2026-08-06',
  },
  {
    id: 'n-007',
    oficina: 'aluche',
    tipo: 'cartera',
    titulo: 'Dos pisos nuevos en alquiler',
    texto:
      'Uno amueblado de dos dormitorios y un estudio reformado. Los dos con contrato de larga duración y sin aval bancario.',
    fecha: '2026-08-04',
    inmueble: 'a-001',
  },
  {
    id: 'n-006',
    oficina: 'parque-europa',
    tipo: 'consejo',
    titulo: 'La nota simple, antes de firmar nada',
    texto:
      'Cuesta unos nueve euros y dice quién es el dueño de verdad y si hay cargas. Nosotros la pedimos siempre antes de publicar un inmueble; si compras por tu cuenta, pídela tú.',
    fecha: '2026-07-30',
  },
  {
    id: 'n-005',
    oficina: 'las-aguilas',
    tipo: 'zona',
    titulo: 'Nuevo carril bici hasta Carabanchel Alto',
    texto:
      'Ya está terminado el tramo que conecta con el parque. Buena noticia para quien se mueve en bici y un punto más para la zona.',
    fecha: '2026-07-24',
  },
];

/** Novedades de una oficina, incluidas las de la empresa entera. */
export function novedadesDe(oficina: string, cuantas?: number): Novedad[] {
  const suyas = NOVEDADES.filter((n) => n.oficina === oficina || n.oficina === 'todas');
  return cuantas ? suyas.slice(0, cuantas) : suyas;
}

/** 2026-08-14 → "14 de agosto" */
export function fechaCorta(iso: string): string {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  const fecha = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return iso;
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
}
