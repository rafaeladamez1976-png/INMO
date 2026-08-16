/**
 * Inmuebles de la maqueta.
 *
 * INVENTADOS. Ni uno solo procede de la web de nadie: son ejemplos escritos
 * para que la maqueta se vea llena y se entienda cómo funcionaría el catálogo.
 *
 * Las zonas y los rangos de precio sí son realistas para el mercado de la
 * empresa (sur y oeste de Madrid, más Toledo y Extremadura), de modo que el
 * conjunto resulta creíble sin copiar ninguna ficha real.
 *
 * La web avisa en pantalla de que son ejemplos: nadie debe llamar por un piso
 * que no existe.
 */

export type Operacion = 'venta' | 'alquiler';
export type TipoInmueble = 'piso' | 'chalet' | 'casa' | 'local' | 'atico';

export interface Inmueble {
  id: string;
  titulo: string;
  operacion: Operacion;
  tipo: TipoInmueble;
  zona: string;
  provincia: string;
  /** Euros. En alquiler, al mes. */
  precio: number;
  habitaciones: number;
  banos: number;
  metros: number;
  planta?: string;
  /** Rasgos destacables. Se muestran como etiquetas. */
  extras: string[];
  /** Tono del bloque en la ficha, para variar el catálogo. */
  tono: 'grafito' | 'arena' | 'oliva' | 'terracota';
  /** Nombre del archivo en src/assets/inmuebles, sin extensión. */
  imagen: string;
  destacado?: boolean;
}

export const INMUEBLES: Inmueble[] = [
  {
    id: 'v-001',
    imagen: 'salon',
    titulo: 'Piso reformado junto al parque',
    operacion: 'venta',
    tipo: 'piso',
    zona: 'Cuatro Vientos',
    provincia: 'Madrid',
    precio: 189000,
    habitaciones: 3,
    banos: 2,
    metros: 92,
    planta: '3ª con ascensor',
    extras: ['Reformado', 'Exterior', 'Calefacción central'],
    tono: 'grafito',
    destacado: true,
  },
  {
    id: 'v-002',
    imagen: 'atico',
    titulo: 'Ático con terraza de 20 m²',
    operacion: 'venta',
    tipo: 'atico',
    zona: 'Aluche',
    provincia: 'Madrid',
    precio: 245000,
    habitaciones: 2,
    banos: 1,
    metros: 78,
    planta: 'Ático',
    extras: ['Terraza', 'Aire acondicionado', 'Ascensor'],
    tono: 'terracota',
    destacado: true,
  },
  {
    id: 'v-003',
    imagen: 'villa',
    titulo: 'Chalet adosado con jardín',
    operacion: 'venta',
    tipo: 'chalet',
    zona: 'Las Águilas',
    provincia: 'Madrid',
    precio: 398000,
    habitaciones: 4,
    banos: 3,
    metros: 210,
    extras: ['Jardín', 'Garaje 2 plazas', 'Trastero'],
    tono: 'oliva',
    destacado: true,
  },
  {
    id: 'v-004',
    imagen: 'dormitorio',
    titulo: 'Piso para entrar a vivir',
    operacion: 'venta',
    tipo: 'piso',
    zona: 'Carabanchel',
    provincia: 'Madrid',
    precio: 156000,
    habitaciones: 2,
    banos: 1,
    metros: 68,
    planta: '1ª sin ascensor',
    extras: ['Amueblado', 'Cocina nueva'],
    tono: 'arena',
  },
  {
    id: 'v-005',
    imagen: 'edificio',
    titulo: 'Casa de pueblo con patio',
    operacion: 'venta',
    tipo: 'casa',
    zona: 'Illescas',
    provincia: 'Toledo',
    precio: 89000,
    habitaciones: 3,
    banos: 1,
    metros: 140,
    extras: ['Patio', 'Para reformar', 'Sin comunidad'],
    tono: 'arena',
  },
  {
    id: 'v-006',
    imagen: 'local',
    titulo: 'Local comercial a pie de calle',
    operacion: 'venta',
    tipo: 'local',
    zona: 'Campamento',
    provincia: 'Madrid',
    precio: 124000,
    habitaciones: 0,
    banos: 1,
    metros: 85,
    extras: ['Escaparate', 'Esquina', 'Licencia'],
    tono: 'grafito',
  },
  {
    id: 'v-007',
    imagen: 'villa',
    titulo: 'Vivienda unifamiliar con parcela',
    operacion: 'venta',
    tipo: 'chalet',
    zona: 'Navalmoral de la Mata',
    provincia: 'Cáceres',
    precio: 172000,
    habitaciones: 4,
    banos: 2,
    metros: 185,
    extras: ['Parcela 600 m²', 'Piscina', 'Garaje'],
    tono: 'oliva',
  },
  {
    id: 'v-008',
    imagen: 'cocina',
    titulo: 'Piso luminoso junto al metro',
    operacion: 'venta',
    tipo: 'piso',
    zona: 'Latina',
    provincia: 'Madrid',
    precio: 213000,
    habitaciones: 3,
    banos: 2,
    metros: 88,
    planta: '5ª con ascensor',
    extras: ['Exterior', 'Metro a 200 m', 'Trastero'],
    tono: 'terracota',
  },

  {
    id: 'a-001',
    imagen: 'salon',
    titulo: 'Piso amueblado listo para entrar',
    operacion: 'alquiler',
    tipo: 'piso',
    zona: 'Aluche',
    provincia: 'Madrid',
    precio: 1150,
    habitaciones: 2,
    banos: 1,
    metros: 70,
    planta: '2ª con ascensor',
    extras: ['Amueblado', 'Gastos incluidos'],
    tono: 'arena',
    destacado: true,
  },
  {
    id: 'a-002',
    imagen: 'villa',
    titulo: 'Adosado con jardín para familia',
    operacion: 'alquiler',
    tipo: 'chalet',
    zona: 'Cuatro Vientos',
    provincia: 'Madrid',
    precio: 1600,
    habitaciones: 4,
    banos: 3,
    metros: 190,
    extras: ['Jardín', 'Garaje', 'Sin muebles'],
    tono: 'oliva',
  },
  {
    id: 'a-003',
    imagen: 'bano',
    titulo: 'Estudio reformado en zona tranquila',
    operacion: 'alquiler',
    tipo: 'piso',
    zona: 'Carabanchel',
    provincia: 'Madrid',
    precio: 780,
    habitaciones: 1,
    banos: 1,
    metros: 42,
    planta: 'Bajo exterior',
    extras: ['Reformado', 'Amueblado'],
    tono: 'grafito',
  },
  {
    id: 'a-004',
    imagen: 'local',
    titulo: 'Local diáfano en avenida',
    operacion: 'alquiler',
    tipo: 'local',
    zona: 'Latina',
    provincia: 'Madrid',
    precio: 1300,
    habitaciones: 0,
    banos: 2,
    metros: 120,
    extras: ['Diáfano', 'Doble escaparate', 'Aire acondicionado'],
    tono: 'terracota',
  },
];

export const OPERACIONES: Record<Operacion, { titulo: string; sufijo: string }> = {
  venta: { titulo: 'En venta', sufijo: '' },
  alquiler: { titulo: 'En alquiler', sufijo: '/mes' },
};

export const TIPOS: Record<TipoInmueble, string> = {
  piso: 'Piso',
  atico: 'Ático',
  chalet: 'Chalet',
  casa: 'Casa',
  local: 'Local',
};

/** 189000 → "189.000 €" */
export function precioLegible(euros: number): string {
  return `${euros.toLocaleString('es-ES')} €`;
}

export function porOperacion(operacion: Operacion): Inmueble[] {
  return INMUEBLES.filter((i) => i.operacion === operacion);
}

export function destacados(): Inmueble[] {
  return INMUEBLES.filter((i) => i.destacado);
}
