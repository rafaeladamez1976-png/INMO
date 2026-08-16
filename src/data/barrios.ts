/**
 * Los cuatro barrios, comparados con honestidad.
 *
 * Esta es la pieza que ninguna inmobiliaria española tiene, y es justo lo que
 * busca todo el que se plantea comprar: no "qué piso me llevo", sino "en qué
 * barrio quiero vivir".
 *
 * La clave está en el campo `contra`: decir en voz alta lo peor de cada zona.
 * Una comparativa donde los cuatro barrios salen estupendos no la cree nadie y
 * no sirve para decidir. Decir la pega es lo que hace creíble la virtud.
 *
 * DATOS ORIENTATIVOS de la maqueta. Antes de publicar hay que sustituirlos por
 * cifras reales del portal estadístico del Ayuntamiento y del Colegio de
 * Registradores, y fecharlos.
 */

export interface Barrio {
  id: string;
  nombre: string;
  distrito: string;
  /** Oficina que lo cubre. */
  oficina: string;

  /** Euros por metro cuadrado en venta. */
  precioVenta: number;
  /** Euros al mes de un piso de dos dormitorios. */
  alquilerTipo: number;
  /** Minutos en transporte público hasta Sol. */
  minutosCentro: number;

  /** De 1 a 5. */
  transporte: number;
  zonasVerdes: number;
  comercio: number;
  tranquilidad: number;

  /** Para quién encaja. */
  paraQuien: string;
  /** Lo mejor. */
  aFavor: string;
  /** Lo peor, dicho sin rodeos. */
  contra: string;
}

export const BARRIOS: Barrio[] = [
  {
    id: 'cuatro-vientos',
    nombre: 'Cuatro Vientos',
    distrito: 'Latina',
    oficina: 'parque-europa',
    precioVenta: 2450,
    alquilerTipo: 1050,
    minutosCentro: 28,
    transporte: 3,
    zonasVerdes: 5,
    comercio: 3,
    tranquilidad: 5,
    paraQuien: 'Familias que priorizan espacio y verde sobre cercanía al centro.',
    aFavor:
      'Es de lo más tranquilo y verde de Madrid capital, con parque grande y viviendas más amplias por el mismo dinero.',
    contra:
      'Está lejos del centro y el metro no llega a todas partes: sin coche se nota, sobre todo de noche.',
  },
  {
    id: 'aluche',
    nombre: 'Aluche',
    distrito: 'Latina',
    oficina: 'aluche',
    precioVenta: 2780,
    alquilerTipo: 1150,
    minutosCentro: 18,
    transporte: 5,
    zonasVerdes: 3,
    comercio: 5,
    tranquilidad: 3,
    paraQuien: 'Quien quiere estar bien comunicado sin pagar precios de centro.',
    aFavor:
      'Comunicación excelente: metro, cercanías y autobuses. Tiene de todo a pie de calle y mucha vida comercial.',
    contra:
      'Edificios de los sesenta y setenta: muchos sin ascensor y con instalaciones que piden reforma. Hay que mirar bien.',
  },
  {
    id: 'las-aguilas',
    nombre: 'Las Águilas',
    distrito: 'Latina',
    oficina: 'las-aguilas',
    precioVenta: 2920,
    alquilerTipo: 1200,
    minutosCentro: 25,
    transporte: 3,
    zonasVerdes: 4,
    comercio: 3,
    tranquilidad: 4,
    paraQuien: 'Familias que buscan casa con jardín sin salir de Madrid capital.',
    aFavor:
      'Zona de chalets y adosados poco habitual dentro de la ciudad, con colegios cerca y calles sin tráfico de paso.',
    contra:
      'Lo más caro de los cuatro y con menos oferta: cuando sale algo bueno, vuela en semanas.',
  },
  {
    id: 'san-ignacio',
    nombre: 'San Ignacio',
    distrito: 'Latina',
    oficina: 'san-ignacio',
    precioVenta: 2610,
    alquilerTipo: 1080,
    minutosCentro: 22,
    transporte: 4,
    zonasVerdes: 3,
    comercio: 4,
    tranquilidad: 4,
    paraQuien: 'Primera compra: es donde más se estira el presupuesto.',
    aFavor:
      'Precio contenido con metro cerca. Buena opción para entrar en propiedad sin irse fuera de Madrid.',
    contra:
      'Menos zonas verdes que sus vecinos y algunas calles con aparcamiento difícil.',
  },
];

export const ASPECTOS = [
  { id: 'transporte', nombre: 'Transporte' },
  { id: 'zonasVerdes', nombre: 'Zonas verdes' },
  { id: 'comercio', nombre: 'Comercio' },
  { id: 'tranquilidad', nombre: 'Tranquilidad' },
] as const;

/** 2450 → "2.450 €/m²" */
export function precioMetro(euros: number): string {
  return `${euros.toLocaleString('es-ES')} €/m²`;
}
