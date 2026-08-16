/**
 * Promociones de obra nueva.
 *
 * INVENTADAS, como el resto del catálogo de la maqueta. Las zonas, los plazos y
 * los rangos de precio sí son realistas para el mercado de la empresa.
 *
 * La obra nueva se vende distinto que la segunda mano: no se enseña un piso,
 * se enseña un plano y una fecha. Por eso aquí manda la tipología (cuántos
 * dormitorios, cuántos quedan y desde cuánto) y no la ficha individual.
 */

export type EstadoObra = 'sobre-plano' | 'en-construccion' | 'llave-en-mano';

export interface Tipologia {
  dormitorios: number;
  banos: number;
  /** Metros construidos. */
  metros: number;
  /** Terraza o jardín, en metros. */
  exterior?: number;
  desde: number;
  /** Cuántas quedan de esta tipología. */
  disponibles: number;
  total: number;
}

export interface Promocion {
  id: string;
  nombre: string;
  zona: string;
  provincia: string;
  /** Oficina que la comercializa. */
  oficina: string;
  estado: EstadoObra;
  /** Cuándo se entrega, en lenguaje de comercial. */
  entrega: string;
  /** Nombre de la promotora. Quien compra sobre plano pregunta esto siempre. */
  promotora: string;
  /** Certificación energética. La obra nueva sale A o B por normativa. */
  energia: 'A' | 'B';
  tipologias: Tipologia[];
  /** Lo que trae la promoción: piscina, zonas comunes, garaje... */
  incluye: string[];
  descripcion: string;
  /**
   * Lo que hay que saber antes de firmar. La obra nueva tiene trampas propias
   * (plazos que se mueven, avales, IVA en vez de ITP) y callarlas es lo que
   * hace que la gente desconfíe del sector.
   */
  aviso: string;
  /** Nombre del archivo en src/assets/inmuebles, sin extensión. */
  imagen: string;
  galeria: string[];
  destacada?: boolean;
}

export const ESTADOS: Record<EstadoObra, { nombre: string; tono: string; explica: string }> = {
  'sobre-plano': {
    nombre: 'Sobre plano',
    tono: 'oliva',
    explica: 'Todavía no ha empezado la obra. Es cuando mejor precio y mejor elección hay.',
  },
  'en-construccion': {
    nombre: 'En construcción',
    tono: 'laton',
    explica: 'La obra está en marcha. Se puede visitar y ya se ve el volumen real.',
  },
  'llave-en-mano': {
    nombre: 'Llave en mano',
    tono: 'grafito',
    explica: 'Terminada y con licencia de primera ocupación. Se entra al firmar.',
  },
};

export const PROMOCIONES: Promocion[] = [
  {
    id: 'p-001',
    nombre: 'Mirador de Aluche',
    zona: 'Aluche',
    provincia: 'Madrid',
    oficina: 'aluche',
    estado: 'en-construccion',
    entrega: 'Primer trimestre de 2028',
    promotora: 'Domus Ibérica Promociones',
    energia: 'A',
    destacada: true,
    imagen: 'promo-mirador',
    galeria: ['promo-mirador', 'salon', 'cocina', 'bano'],
    tipologias: [
      { dormitorios: 1, banos: 1, metros: 58, exterior: 8, desde: 224000, disponibles: 2, total: 8 },
      { dormitorios: 2, banos: 2, metros: 78, exterior: 12, desde: 289000, disponibles: 9, total: 24 },
      { dormitorios: 3, banos: 2, metros: 96, exterior: 16, desde: 348000, disponibles: 5, total: 16 },
    ],
    incluye: [
      'Garaje y trastero incluidos',
      'Piscina y zona infantil',
      'Aerotermia',
      'Portal accesible',
    ],
    descripcion:
      'Cuarenta y ocho viviendas en una parcela que llevaba veinte años vacía, a seis minutos andando del metro de Aluche. La orientación es la que manda aquí: todas las viviendas tienen fachada al sur o al este, que en Madrid se nota en la factura de la luz más que cualquier certificado. La estructura está terminada y ahora mismo se está cerrando fachada, así que ya se puede visitar y ver el tamaño real de las terrazas.',
    aviso:
      'La entrega prevista es del primer trimestre de 2028, pero en obra nueva los plazos se mueven: cuenta con un margen de tres a seis meses y no dejes tu vivienda actual hasta tener la licencia de primera ocupación. Las cantidades que entregues a cuenta tienen que estar avaladas por ley; pídenos el aval por escrito antes de firmar nada.',
  },
  {
    id: 'p-002',
    nombre: 'Altos de Las Águilas',
    zona: 'Las Águilas',
    provincia: 'Madrid',
    oficina: 'las-aguilas',
    estado: 'sobre-plano',
    entrega: 'Segundo semestre de 2029',
    promotora: 'Aravaca Residencial',
    energia: 'A',
    imagen: 'promo-aguilas',
    galeria: ['promo-aguilas', 'casa-venta', 'salon', 'dormitorio'],
    tipologias: [
      { dormitorios: 3, banos: 2, metros: 142, exterior: 45, desde: 398000, disponibles: 11, total: 14 },
      { dormitorios: 4, banos: 3, metros: 168, exterior: 62, desde: 465000, disponibles: 8, total: 10 },
    ],
    incluye: [
      'Adosados con jardín privado',
      'Garaje para dos coches',
      'Zona común con piscina',
      'Preinstalación de cargador eléctrico',
    ],
    descripcion:
      'Veinticuatro adosados en la última parcela residencial que queda libre en la zona alta de Las Águilas. Es una promoción pequeña y eso se nota: no hay dos filas de casas mirándose, todas dan al jardín común por un lado y a la calle por otro. Al comprar sobre plano todavía se puede elegir distribución de la planta baja y acabados sin coste añadido.',
    aviso:
      'Sobre plano significa que hoy no hay nada construido: la obra empieza en primavera de 2027. A cambio del precio y de poder elegir acabados, asumes una espera larga y el riesgo de que los plazos se alarguen. Si necesitas entrar en menos de dos años, esta no es tu promoción y te lo decimos ahora.',
  },
  {
    id: 'p-003',
    nombre: 'Patios de Illescas',
    zona: 'Illescas',
    provincia: 'Toledo',
    oficina: 'parque-europa',
    estado: 'llave-en-mano',
    entrega: 'Disponible ahora',
    promotora: 'Construcciones Sagra',
    energia: 'B',
    imagen: 'promo-patios',
    galeria: ['promo-patios', 'cocina', 'salon', 'bano'],
    tipologias: [
      { dormitorios: 2, banos: 1, metros: 71, exterior: 10, desde: 152000, disponibles: 3, total: 10 },
      { dormitorios: 3, banos: 2, metros: 94, exterior: 14, desde: 189000, disponibles: 4, total: 14 },
    ],
    incluye: ['Terminada y con licencia', 'Garaje incluido', 'Patio comunitario', 'Cocina amueblada'],
    descripcion:
      'Veinticuatro viviendas terminadas el año pasado en el centro de Illescas, a cuatro minutos andando de la plaza y con la estación de Cercanías a diez. Quedan siete. Al estar acabada se puede ver la vivienda exacta que se compra, medirla y comprobar la luz a la hora que interese, que es un lujo que la obra nueva no suele dar.',
    aviso:
      'Al ser obra nueva se paga IVA del 10 % más el impuesto de actos jurídicos documentados, no el ITP del 6 %. En una vivienda de 189.000 € la diferencia ronda los 10.000 € respecto a comprar de segunda mano: tenlo en cuenta al hacer números.',
  },
  {
    id: 'p-004',
    nombre: 'Residencial Guadiana',
    zona: 'Badajoz',
    provincia: 'Badajoz',
    oficina: 'san-ignacio',
    estado: 'en-construccion',
    entrega: 'Finales de 2027',
    promotora: 'Extremeña de Viviendas',
    energia: 'A',
    imagen: 'promo-guadiana',
    galeria: ['promo-guadiana', 'salon', 'dormitorio', 'cocina'],
    tipologias: [
      { dormitorios: 2, banos: 2, metros: 82, exterior: 18, desde: 132000, disponibles: 7, total: 18 },
      { dormitorios: 3, banos: 2, metros: 105, exterior: 24, desde: 165000, disponibles: 12, total: 22 },
      { dormitorios: 4, banos: 2, metros: 128, exterior: 30, desde: 198000, disponibles: 4, total: 8 },
    ],
    incluye: [
      'Piscina y zona ajardinada',
      'Garaje y trastero',
      'Terrazas de más de 18 m²',
      'Toldos incluidos',
    ],
    descripcion:
      'Cuarenta y ocho viviendas junto al parque del Guadiana, en la zona que más ha crecido de Badajoz en los últimos años. Las terrazas son de verdad: dieciocho metros la más pequeña, con espacio para comer fuera, que en Extremadura se usa media docena de meses al año. Vienen con toldo puesto, algo que parece un detalle hasta que llega julio.',
    aviso:
      'Badajoz es el mercado en el que menos operaciones cerramos y por tanto donde nuestra referencia de precios es menos fina. Los datos de esta promoción son de la promotora; contrástalos y visita la obra antes de decidir.',
  },
];

export function promocionPorId(id: string): Promocion | undefined {
  return PROMOCIONES.find((p) => p.id === id);
}

/** Precio más bajo de toda la promoción. */
export function desdePromocion(promocion: Promocion): number {
  return Math.min(...promocion.tipologias.map((t) => t.desde));
}

/** Viviendas que quedan y cuántas había. */
export function disponibilidad(promocion: Promocion): { quedan: number; total: number } {
  return promocion.tipologias.reduce(
    (suma, t) => ({ quedan: suma.quedan + t.disponibles, total: suma.total + t.total }),
    { quedan: 0, total: 0 },
  );
}
