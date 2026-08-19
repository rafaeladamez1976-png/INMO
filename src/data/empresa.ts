/**
 * Datos de la empresa.
 *
 * Marca real del cliente: GESPAIN Actividades Inmobiliarias
 * (grupogespain.com). Las oficinas, teléfonos y zonas son los reales. Los
 * inmuebles siguen siendo ejemplos de demostración y la web lo avisa.
 *
 * Para cambiar el nombre comercial basta con tocar MARCA, aquí debajo.
 */

const MARCA = {
  nombre: 'Gespain',
  descriptor: 'Actividades Inmobiliarias',
} as const;

export interface Oficina {
  id: string;
  nombre: string;
  barrio: string;
  direccion: string;
  cp: string;
  telefonos: string[];
  email: string;
  sede?: boolean;
  /** Posición relativa en la maqueta 3D de la ciudad. */
  mapa: { x: number; z: number };

  /** Barrios que cubre esta oficina. */
  cubre: string[];
  /** En qué es especialmente fuerte. */
  especialidad: string;
  /** Cómo es el equipo, en una frase. */
  equipo: string;
  /** Desde cuándo está abierta. */
  desde: string;
  /** Nombre del archivo de foto en src/assets/inmuebles. */
  foto: string;
  /** Referencia del inmueble destacado de esta oficina. */
  destacado: string;
}

/** Horario común a las cuatro oficinas. */
export const HORARIO = [
  { dias: 'Lunes a viernes', horas: '10:00 – 14:00 y 17:00 – 20:00' },
  { dias: 'Sábados', horas: '10:00 – 14:00' },
  { dias: 'Domingos', horas: 'Cerrado' },
];

export const EMPRESA = {
  nombre: MARCA.nombre,
  descriptor: MARCA.descriptor,
  nombreCompleto: `${MARCA.nombre} ${MARCA.descriptor}`,
  ciudad: 'Madrid',

  telefonoGratuito: '900701034',
  telefonoMovil: '648900215',
  emailGeneral: 'info@grupogespain.com',

  /** WhatsApp de citas: el que atiende la agenda. */
  whatsappCitas: '669152412',

  /** Zonas donde tienen inmuebles publicados. */
  zonas: ['Madrid', 'Toledo', 'Extremadura', 'Castilla-La Mancha'],
} as const;

export const OFICINAS: Oficina[] = [
  {
    id: 'parque-europa',
    cubre: ['Cuatro Vientos', 'Campamento', 'Águilas'],
    especialidad: 'Chalets y vivienda familiar con jardín',
    equipo: 'Cuatro personas, tres de ellas viviendo en el barrio',
    desde: '2009',
    foto: 'oficina-1',
    destacado: 'v-001',
    nombre: 'Parque Europa',
    barrio: 'Cuatro Vientos',
    direccion: 'C/ Fuente de Lima 19, Local B',
    cp: '28024',
    telefonos: ['917060416', '615750579'],
    email: 'info@grupogespain.com',
    sede: true,
    mapa: { x: -3.2, z: -2.4 },
  },
  {
    id: 'aluche',
    cubre: ['Aluche', 'Campamento', 'Lucero'],
    especialidad: 'Pisos de segunda mano y alquiler de larga duración',
    equipo: 'Tres personas y la mayor cartera de alquiler del grupo',
    desde: '2013',
    foto: 'oficina-2',
    destacado: 'v-002',
    nombre: 'Aluche',
    barrio: 'Campamento',
    direccion: 'C/ Tembleque 111',
    cp: '28024',
    telefonos: ['915099717', '660857803'],
    email: 'campamento@grupogespain.com',
    mapa: { x: 2.6, z: -3.1 },
  },
  {
    id: 'las-aguilas',
    cubre: ['Las Águilas', 'Carabanchel Alto', 'Puerta Bonita'],
    especialidad: 'Adosados y unifamiliares dentro de la ciudad',
    equipo: 'Tres personas especializadas en obra y reforma',
    desde: '2016',
    foto: 'oficina-3',
    destacado: 'v-003',
    nombre: 'Las Águilas',
    barrio: 'Carabanchel',
    direccion: 'C/ José de Cadalso 53',
    cp: '28044',
    telefonos: ['911377269', '648714915'],
    email: 'lasaguilas@grupogespain.com',
    mapa: { x: -2.1, z: 3.0 },
  },
  {
    id: 'san-ignacio',
    cubre: ['San Ignacio', 'Latina', 'Lucero'],
    especialidad: 'Primera compra y locales comerciales',
    equipo: 'Dos personas, la oficina más joven del grupo',
    desde: '2021',
    foto: 'oficina-4',
    destacado: 'v-008',
    nombre: 'San Ignacio',
    barrio: 'Latina',
    direccion: 'C/ Oliva de Plasencia 1',
    cp: '28044',
    telefonos: ['910149563', '638499936'],
    email: 'sanignacio@grupogespain.com',
    mapa: { x: 3.4, z: 2.2 },
  },
];

export interface Servicio {
  id: string;
  titulo: string;
  texto: string;
}

/** Servicios que la empresa presta. Textos redactados para esta web. */
export const SERVICIOS: Servicio[] = [
  {
    id: 'venta',
    titulo: 'Compraventa',
    texto:
      'Ponemos tu inmueble en el mercado con precio realista y lo defendemos hasta la firma.',
  },
  {
    id: 'alquiler',
    titulo: 'Alquiler',
    texto:
      'Buscamos inquilino, comprobamos su solvencia y redactamos el contrato. Tú solo firmas.',
  },
  {
    id: 'opcion-compra',
    titulo: 'Alquiler con opción a compra',
    texto:
      'Para quien quiere comprar pero aún no puede. Se alquila hoy y se descuenta de la compra mañana.',
  },
  {
    id: 'temporada',
    titulo: 'Alquiler de temporada',
    texto:
      'Estancias de meses para traslados de trabajo, obras o estudios, con contrato en regla.',
  },
  {
    id: 'traspasos',
    titulo: 'Traspasos',
    texto:
      'Locales en funcionamiento: valoramos el negocio, no solo los metros cuadrados.',
  },
  {
    id: 'valoracion',
    titulo: 'Valoración gratuita',
    texto:
      'Te decimos lo que vale tu casa hoy, con datos de tu calle y sin compromiso.',
  },
];

/** Formatea un teléfono para mostrarlo: 917060416 → 917 06 04 16 */
export function telefonoLegible(numero: string): string {
  return numero.replace(/^(\d{3})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
}

export function enlaceTelefono(numero: string): string {
  return `tel:+34${numero}`;
}

export function enlaceWhatsApp(numero: string, mensaje: string): string {
  return `https://wa.me/34${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Busca una oficina por su identificador. */
export function oficinaPorId(id: string): Oficina | undefined {
  return OFICINAS.find((o) => o.id === id);
}
