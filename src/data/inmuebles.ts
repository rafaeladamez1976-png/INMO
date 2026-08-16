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
  /** Galería de la ficha de detalle. La primera es la principal. */
  galeria: string[];
  /** Identificador de la oficina que lo lleva. */
  oficina: string;
  /** Texto de la ficha. Escrito como lo escribiría un comercial. */
  descripcion: string;
  /** Lo que conviene saber antes de ir a verlo. Sin adornos. */
  aviso?: string;
  /**
   * Certificado energético. Obligatorio en todo anuncio inmobiliario en España
   * desde el RD 390/2021: sin él, el anuncio es sancionable.
   */
  energia: {
    letra: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
    /** Consumo en kWh/m² al año. */
    consumo: number;
    /** Emisiones en kg CO₂/m² al año. */
    emisiones: number;
  };
  destacado?: boolean;
}

export const INMUEBLES: Inmueble[] = [
  {
    id: 'v-001',
    energia: { letra: 'D', consumo: 118, emisiones: 26 },
    galeria: ['salon', 'cocina', 'dormitorio', 'bano'],
    oficina: 'parque-europa',
    descripcion:
      'Piso reformado hace dos años en una de las calles más tranquilas de Cuatro Vientos. Da a un patio interior amplio, así que no se oye el tráfico, y el salón recibe sol de tarde. La cocina y los dos baños son nuevos; el suelo, de roble. Comunidad con ascensor y calefacción central incluida en los gastos.',
    aviso:
      'La plaza de garaje no está incluida, pero hay disponibles en el mismo edificio por unos 90 € al mes.',
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
    energia: { letra: 'E', consumo: 164, emisiones: 38 },
    galeria: ['atico', 'salon', 'cocina', 'bano'],
    oficina: 'aluche',
    descripcion:
      'Ático con terraza de 20 m² orientada al oeste, con sitio de sobra para comer fuera en verano. La vivienda está en buen estado y no necesita obra, aunque la cocina es de los años noventa. Edificio con ascensor y portal reformado. A siete minutos andando del metro.',
    aviso:
      'El edificio tiene prevista una derrama para la fachada. Está aprobada y la cuantía la tenemos por escrito: pregúntanos antes de hacer números.',
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
    energia: { letra: 'D', consumo: 131, emisiones: 29 },
    galeria: ['villa', 'salon', 'cocina', 'dormitorio'],
    oficina: 'las-aguilas',
    descripcion:
      'Adosado de cuatro dormitorios en urbanización con piscina comunitaria. Tiene jardín propio de unos 60 m², garaje para dos coches y trastero. La planta baja es diáfana entre salón y cocina, que es justo lo que busca la mayoría de las familias y muy poca vivienda de esta zona ofrece.',
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
    energia: { letra: 'D', consumo: 125, emisiones: 27 },
    galeria: ['dormitorio', 'salon', 'cocina'],
    oficina: 'las-aguilas',
    descripcion:
      'Piso de dos dormitorios listo para entrar a vivir, con los muebles incluidos si te interesan. Cocina cambiada el año pasado. Primera planta sin ascensor, lo que se nota en el precio: por metros y estado, es de lo más ajustado que tenemos en Carabanchel.',
    aviso:
      'Primera planta sin ascensor. Son veintidós escalones y conviene subirlos antes de decidir.',
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
    energia: { letra: 'G', consumo: 271, emisiones: 62 },
    galeria: ['edificio', 'salon', 'cocina'],
    oficina: 'parque-europa',
    descripcion:
      'Casa de pueblo en el centro de Illescas, con patio trasero y mucho espacio. Necesita reforma completa: instalaciones, baño y cubierta. La estructura está bien y el precio está pensado para que la obra salga a cuenta. Sin gastos de comunidad.',
    aviso:
      'Necesita reforma integral. Antes de firmar recomendamos visitarla con un aparejador; te podemos acompañar.',
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
    energia: { letra: 'E', consumo: 158, emisiones: 36 },
    galeria: ['local', 'portal'],
    oficina: 'aluche',
    descripcion:
      'Local a pie de calle en esquina, con doble escaparate y mucho paso de peatones. Tiene licencia de actividad en vigor y aseo adaptado. Diáfano, así que admite casi cualquier distribución.',
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
    energia: { letra: 'C', consumo: 84, emisiones: 18 },
    galeria: ['villa', 'salon', 'dormitorio', 'cocina'],
    oficina: 'parque-europa',
    descripcion:
      'Unifamiliar en parcela de 600 m² con piscina y garaje, a las afueras de Navalmoral. Cuatro dormitorios, dos baños y porche cubierto. Muy buena opción como segunda residencia o para teletrabajar con espacio de verdad.',
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
    energia: { letra: 'E', consumo: 171, emisiones: 39 },
    galeria: ['cocina', 'salon', 'dormitorio', 'bano'],
    oficina: 'san-ignacio',
    descripcion:
      'Piso exterior en quinta planta con ascensor, muy luminoso todo el día. Tres dormitorios, dos baños completos y trastero en el mismo edificio. El metro está a doscientos metros, lo que en esta zona marca bastante la diferencia de precio.',
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
    energia: { letra: 'E', consumo: 155, emisiones: 35 },
    galeria: ['salon', 'cocina', 'dormitorio'],
    oficina: 'aluche',
    descripcion:
      'Piso amueblado listo para entrar, con los gastos de comunidad incluidos en la renta. Dos dormitorios, uno de ellos con armario empotrado. Segunda planta con ascensor. Se alquila con contrato de larga duración.',
    aviso:
      'Se pide nómina o justificante de ingresos y un mes de fianza, según marca la ley. Sin avales de más.',
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
    energia: { letra: 'D', consumo: 128, emisiones: 28 },
    galeria: ['villa', 'salon', 'cocina', 'dormitorio'],
    oficina: 'parque-europa',
    descripcion:
      'Adosado de cuatro dormitorios con jardín y garaje, sin amueblar. Pensado para familia: colegios cerca y calle sin tráfico de paso. Disponible desde el mes que viene.',
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
    energia: { letra: 'C', consumo: 92, emisiones: 20 },
    galeria: ['bano', 'salon'],
    oficina: 'las-aguilas',
    descripcion:
      'Estudio reformado en bajo exterior, con patio de luces amplio que le da claridad. Amueblado y con electrodomésticos nuevos. Zona tranquila y bien comunicada.',
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
    energia: { letra: 'F', consumo: 214, emisiones: 49 },
    galeria: ['local', 'portal'],
    oficina: 'san-ignacio',
    descripcion:
      'Local diáfano de 120 m² en avenida principal, con doble escaparate y aire acondicionado instalado. Dos aseos. Ideal para clínica, academia o tienda con necesidad de escaparate.',
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

/** Busca un inmueble por su identificador. */
export function porId(id: string): Inmueble | undefined {
  return INMUEBLES.find((i) => i.id === id);
}

/**
 * Inmuebles parecidos: misma operacion, y se prefieren los de la misma zona.
 *
 * Es la seccion que mas visitas encadena en una web inmobiliaria: quien mira
 * un piso y no le encaja, casi siempre mira otro.
 */
export function parecidos(inmueble: Inmueble, cuantos = 3): Inmueble[] {
  const resto = INMUEBLES.filter(
    (i) => i.id !== inmueble.id && i.operacion === inmueble.operacion,
  );

  const puntuar = (otro: Inmueble): number => {
    let puntos = 0;
    if (otro.zona === inmueble.zona) puntos += 3;
    if (otro.provincia === inmueble.provincia) puntos += 1;
    if (otro.tipo === inmueble.tipo) puntos += 2;
    // Cuanto mas cerca de precio, mas parecido.
    const diferencia = Math.abs(otro.precio - inmueble.precio) / inmueble.precio;
    if (diferencia < 0.2) puntos += 2;
    else if (diferencia < 0.4) puntos += 1;
    return puntos;
  };

  return [...resto].sort((a, b) => puntuar(b) - puntuar(a)).slice(0, cuantos);
}
