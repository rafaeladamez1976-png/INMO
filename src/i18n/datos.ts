/**
 * Traducción de la prosa de los datos.
 *
 * Los ficheros de src/data se quedan en español y aquí vive el inglés, en
 * lugar de convertir cada campo en un objeto de dos idiomas. Así quien mantiene
 * el catálogo sigue tocando un fichero normal, y la web en inglés se resuelve
 * con una búsqueda por identificador.
 *
 * `enIdioma()` cae al español si falta una traducción. No debería faltar
 * ninguna: los Record están tipados contra los identificadores reales y añadir
 * un inmueble sin su texto en inglés es un error de compilación.
 */

import type { Idioma } from './index';

type Traduccion = Record<string, string>;

/** Descripciones y avisos de los inmuebles. */
export const INMUEBLES_EN: Record<string, { descripcion: string; aviso?: string; titulo: string }> =
  {
    'v-001': {
      titulo: 'Refurbished flat beside the park',
      descripcion:
        'Refurbished two years ago on one of the quietest streets in Cuatro Vientos. It faces a large interior courtyard, so you do not hear the traffic, and the living room gets afternoon sun. The kitchen and both bathrooms are new; the floors are oak. The building has a lift and central heating included in the service charge.',
      aviso:
        'The parking space is not included, but there are spaces available in the same building for around €90 a month.',
    },
    'v-002': {
      titulo: 'Top-floor flat with a 20 m² terrace',
      descripcion:
        'Top-floor flat with a west-facing terrace of 20 m², with plenty of room to eat outside in summer. The property is in good condition and needs no work, although the kitchen dates from the nineties. The building has a lift and a refurbished entrance hall. Seven minutes on foot from the metro.',
      aviso:
        'The building has a facade levy coming. It has been approved and we have the amount in writing: ask us before you run your numbers.',
    },
    'v-003': {
      titulo: 'Terraced house with a garden',
      descripcion:
        'A four-bedroom terraced house on a development with a communal pool. It has its own garden of about 60 m², a garage for two cars and a storage room. The ground floor is open plan between living room and kitchen, which is exactly what most families are after and what very little of the housing in this area offers.',
    },
    'v-004': {
      titulo: 'Flat ready to move into',
      descripcion:
        'A two-bedroom flat ready to move into, with the furniture included if you want it. The kitchen was replaced last year. First floor with no lift, which shows in the price: for size and condition it is the keenest thing we have in Carabanchel.',
      aviso:
        'First floor with no lift. That is twenty-two steps, and it is worth walking up them before you decide.',
    },
    'v-005': {
      titulo: 'Village house with a courtyard',
      descripcion:
        'A village house in the centre of Illescas, with a rear courtyard and plenty of space. It needs a full refurbishment: services, bathroom and roof. The structure is sound and the price is set so that the work pays for itself. No service charge.',
      aviso:
        'It needs a full refurbishment. Before signing we recommend visiting with a surveyor; we can come with you.',
    },
    'v-006': {
      titulo: 'Commercial unit at street level',
      descripcion:
        'A corner unit at street level with two shop windows and heavy foot traffic. It has a current trading licence and an accessible toilet. Open plan, so it takes almost any layout.',
    },
    'v-007': {
      titulo: 'Detached house with land',
      descripcion:
        'A detached house on a 600 m² plot with a pool and a garage, on the edge of Navalmoral. Four bedrooms, two bathrooms and a covered porch. A very good option as a second home or for working remotely with real space around you.',
    },
    'v-008': {
      titulo: 'Bright flat next to the metro',
      descripcion:
        'An exterior flat on the fifth floor with a lift, very bright all day. Three bedrooms, two full bathrooms and a storage room in the same building. The metro is two hundred metres away, which in this area makes a real difference to the price.',
    },
    'a-001': {
      titulo: 'Furnished flat, ready to move into',
      descripcion:
        'A furnished flat ready to move into, with the service charge included in the rent. Two bedrooms, one with a fitted wardrobe. Second floor with a lift. Let on a long-term contract.',
      aviso:
        'We ask for a payslip or proof of income and one month’s deposit, as the law requires. No extra guarantors.',
    },
    'a-002': {
      titulo: 'Terraced house with a garden, for a family',
      descripcion:
        'A four-bedroom terraced house with a garden and a garage, unfurnished. Set up for a family: schools nearby and a street with no through traffic. Available from next month.',
    },
    'a-003': {
      titulo: 'Refurbished studio in a quiet area',
      descripcion:
        'A refurbished studio on the ground floor facing outwards, with a generous light well that brightens it. Furnished and with new appliances. A quiet area and well connected.',
    },
    'a-004': {
      titulo: 'Open-plan unit on a main avenue',
      descripcion:
        'An open-plan 120 m² unit on a main avenue, with two shop windows and air conditioning fitted. Two toilets. Ideal for a clinic, a training centre or a shop that needs window space.',
    },
  };

/** Especialidad de cada oficina. */
export const OFICINAS_EN: Record<string, { especialidad: string }> = {
  'parque-europa': { especialidad: 'Houses and family homes with gardens' },
  aluche: { especialidad: 'Resale flats and long-term lettings' },
  'las-aguilas': { especialidad: 'Terraced and detached houses within the city' },
  'san-ignacio': { especialidad: 'First-time buyers and commercial units' },
};

/** Servicios de la portada. */
export const SERVICIOS_EN: Record<string, { titulo: string; texto: string }> = {
  venta: {
    titulo: 'Buying and selling',
    texto:
      'We put your property on the market at a realistic price and defend that price through to completion.',
  },
  alquiler: {
    titulo: 'Letting',
    texto:
      'We find the tenant, check they can afford it and draw up the contract. All you do is sign.',
  },
  'opcion-compra': {
    titulo: 'Rent with an option to buy',
    texto:
      'For people who want to buy but cannot yet. Rent today and it comes off the purchase price tomorrow.',
  },
  temporada: {
    titulo: 'Seasonal lets',
    texto:
      'Stays of a few months for work relocations, building works or studies, on a proper contract.',
  },
  traspasos: {
    titulo: 'Business transfers',
    texto: 'Trading premises: we value the business, not just the square metres.',
  },
  valoracion: {
    titulo: 'Free valuation',
    texto:
      'We tell you what your home is worth today, using figures from your own street and with no obligation.',
  },
};

/** Barrios del comparador. */
export const BARRIOS_EN: Record<
  string,
  { paraQuien: string; aFavor: string; contra: string }
> = {
  'cuatro-vientos': {
    paraQuien: 'Families who put space and greenery ahead of being close to the centre.',
    aFavor:
      'One of the quietest, greenest parts of Madrid proper, with a large park and roomier homes for the same money.',
    contra:
      'It is a long way from the centre and the metro does not reach everywhere: without a car you notice, especially at night.',
  },
  aluche: {
    paraQuien: 'People who want to be well connected without paying city-centre prices.',
    aFavor:
      'Excellent transport: metro, Cercanías rail and buses. Everything at street level and plenty of commercial life.',
    contra:
      'Buildings from the sixties and seventies: many without a lift and with services that need updating. Look carefully.',
  },
  'las-aguilas': {
    paraQuien: 'Families after a house with a garden without leaving Madrid proper.',
    aFavor:
      'An area of houses and terraces that is unusual within the city, with schools nearby and streets free of through traffic.',
    contra:
      'The most expensive of the four and with the least on the market: when something good comes up, it goes in weeks.',
  },
  'san-ignacio': {
    paraQuien: 'A first purchase: this is where the budget stretches furthest.',
    aFavor:
      'Contained prices with the metro close by. A good way onto the ladder without leaving Madrid.',
    contra:
      'Fewer green spaces than its neighbours and some streets where parking is difficult.',
  },
};

/** Novedades del tablón. */
export const NOVEDADES_EN: Record<string, { titulo: string; texto: string }> = {
  'n-012': {
    titulo: 'Price cut on the top-floor flat on Calle Tembleque',
    texto:
      'The owner has adjusted the price by €15,000. It remains the only top-floor flat with a terrace of more than 20 m² that we have in the area.',
  },
  'n-011': {
    titulo: 'August opening hours',
    texto:
      'Through August all four offices are closed in the afternoons. Mornings from 10:00 to 14:00, Monday to Friday. We answer WhatsApp as usual.',
  },
  'n-010': {
    titulo: 'A terraced house with a garden comes in at Las Águilas',
    texto:
      'Four bedrooms, a garage for two cars and a 60 m² garden. In this area something like this comes up two or three times a year.',
  },
  'n-009': {
    titulo: 'If you are selling in September, start now',
    texto:
      'Getting a property ready properly takes about three weeks between photographs, paperwork and the land registry extract. Start in August and you reach September with the listing live and the first viewings of the season.',
  },
  'n-008': {
    titulo: 'Works on Calle Oliva de Plasencia',
    texto:
      'The council is resurfacing the pavement until October. You can park without trouble on the parallel streets and the office is open as normal.',
  },
  'n-007': {
    titulo: 'Two new flats to rent',
    texto:
      'One furnished two-bedroom and a refurbished studio. Both on long-term contracts and with no bank guarantee required.',
  },
  'n-006': {
    titulo: 'The land registry extract, before you sign anything',
    texto:
      'It costs about nine euros and tells you who actually owns the property and whether there are any charges on it. We always request one before listing a property; if you are buying on your own, request it yourself.',
  },
  'n-005': {
    titulo: 'New cycle lane through to Carabanchel Alto',
    texto:
      'The stretch connecting to the park is finished. Good news for anyone who cycles and another point in the area’s favour.',
  },
};

/** Promociones de obra nueva. */
export const PROMOCIONES_EN: Record<
  string,
  { descripcion: string; aviso: string; incluye: string[] }
> = {
  'p-001': {
    descripcion:
      'Forty-eight homes on a plot that had stood empty for twenty years, six minutes on foot from Aluche metro. Orientation is what matters here: every home faces south or east, which in Madrid shows up on the electricity bill more than any certificate does. The structure is finished and the facade is going up now, so you can visit and see the real size of the terraces.',
    aviso:
      'Completion is expected in the first quarter of 2028, but new-build deadlines move: allow three to six months of slack and do not give up your current home until the occupancy licence has been issued. Stage payments must be covered by a bank guarantee under Spanish law; ask us for the guarantee in writing before signing anything.',
    incluye: [
      'Parking and storage included',
      'Pool and children’s play area',
      'Air-source heat pump',
      'Step-free entrance',
    ],
  },
  'p-002': {
    descripcion:
      'Twenty-four terraced houses on the last residential plot left in upper Las Águilas. It is a small development and it shows: there are no two rows of houses staring at each other, every home faces the shared garden on one side and the street on the other. Buying off-plan, you can still choose the ground-floor layout and the finishes at no extra cost.',
    aviso:
      'Off-plan means nothing is built today: work starts in spring 2027. In exchange for the price and the choice of finishes, you take on a long wait and the risk that the timescale stretches. If you need to move in less than two years, this is not your development and we would rather tell you now.',
    incluye: [
      'Terraced houses with private gardens',
      'Garage for two cars',
      'Shared grounds with a pool',
      'Wiring in place for an EV charger',
    ],
  },
  'p-003': {
    descripcion:
      'Twenty-four homes completed last year in the centre of Illescas, four minutes on foot from the main square and ten from the Cercanías station. Seven are left. Because it is finished you can see the exact home you are buying, measure it and check the light at whatever hour matters to you, which is a luxury new build rarely offers.',
    aviso:
      'As a new build it is taxed at 10% VAT plus stamp duty, not the 6% transfer tax. On a €189,000 home that is around €10,000 more than buying a resale property: factor it in.',
    incluye: [
      'Finished and licensed',
      'Parking included',
      'Shared courtyard',
      'Fitted kitchen',
    ],
  },
  'p-004': {
    descripcion:
      'Forty-eight homes beside the Guadiana park, in the fastest-growing part of Badajoz over recent years. The terraces are real ones: eighteen square metres at the smallest, with room to eat outside, which in Extremadura you do for half the year. They come with awnings fitted, which sounds like a detail until July arrives.',
    aviso:
      'Badajoz is the market where we close the fewest transactions and therefore where our price reference is least sharp. The figures for this development come from the developer; check them and visit the site before deciding.',
    incluye: [
      'Pool and landscaped grounds',
      'Parking and storage',
      'Terraces over 18 m²',
      'Awnings included',
    ],
  },
};

/** Estado de las promociones. */
export const ESTADOS_EN: Record<string, { nombre: string; explica: string }> = {
  'sobre-plano': {
    nombre: 'Off-plan',
    explica: 'Work has not started yet. This is when the price and the choice are best.',
  },
  'en-construccion': {
    nombre: 'Under construction',
    explica: 'Work is under way. You can visit and see the real volume of the building.',
  },
  'llave-en-mano': {
    nombre: 'Ready now',
    explica: 'Finished and with its occupancy licence. You move in when you sign.',
  },
};

/**
 * Etiquetas de características.
 *
 * Van por texto y no por identificador porque en los datos son texto suelto.
 * Si aparece una que no está aquí, se muestra en español: mejor eso que
 * esconder una característica del inmueble.
 */
export const EXTRAS_EN: Record<string, string> = {
  'Aire acondicionado': 'Air conditioning',
  Amueblado: 'Furnished',
  Ascensor: 'Lift',
  'Calefacción central': 'Central heating',
  'Cocina nueva': 'New kitchen',
  Diáfano: 'Open plan',
  'Doble escaparate': 'Two shop windows',
  Escaparate: 'Shop window',
  Esquina: 'Corner unit',
  Exterior: 'Faces outwards',
  'Garaje 2 plazas': 'Garage for two cars',
  Garaje: 'Garage',
  'Gastos incluidos': 'Service charge included',
  Jardín: 'Garden',
  Licencia: 'Trading licence',
  'Metro a 200 m': 'Metro 200 m away',
  'Para reformar': 'Needs refurbishment',
  'Parcela 600 m²': '600 m² plot',
  Patio: 'Courtyard',
  Piscina: 'Pool',
  Reformado: 'Refurbished',
  'Sin comunidad': 'No service charge',
  'Sin muebles': 'Unfurnished',
  Terraza: 'Terrace',
  Trastero: 'Storage room',
};

export function extraDe(extra: string, idioma: Idioma): string {
  return idioma === 'en' ? (EXTRAS_EN[extra] ?? extra) : extra;
}

/** Plantas. En inglés la planta baja es "ground floor", no "floor 0". */
export const PLANTAS_EN: Record<string, string> = {
  '1ª sin ascensor': '1st floor, no lift',
  '2ª con ascensor': '2nd floor with lift',
  '3ª con ascensor': '3rd floor with lift',
  '5ª con ascensor': '5th floor with lift',
  'Bajo exterior': 'Ground floor, facing outwards',
  Ático: 'Top floor',
};

export function plantaDe(planta: string, idioma: Idioma): string {
  return idioma === 'en' ? (PLANTAS_EN[planta] ?? planta) : planta;
}

/**
 * Gastos de compra, en inglés.
 *
 * Los nombres de los impuestos españoles se dejan con su sigla y una glosa:
 * quien compra aquí va a oír "ITP" en la notaría, no "transfer tax".
 */
export const GASTOS_EN: Record<string, { concepto: string; nota: string }> = {
  'Impuesto de transmisiones (ITP)': {
    concepto: 'Transfer tax (ITP)',
    nota: '6% in the Madrid region for a resale home. Payable within 30 working days of signing.',
  },
  Notaría: {
    concepto: 'Notary',
    nota: 'The public deed. The fee is set by law and barely varies between notaries.',
  },
  'Registro de la propiedad': {
    concepto: 'Land registry',
    nota: 'Registering that the home is yours. Without this, as far as the registry is concerned it is still the seller’s.',
  },
  Gestoría: {
    concepto: 'Administrative agent (gestoría)',
    nota: 'Handles the taxes and paperwork. Optional if you buy without a mortgage; with one, the bank requires it.',
  },
  Tasación: {
    concepto: 'Valuation survey',
    nota: 'Only if you take a mortgage. Since 2019 the bank pays it in many cases: ask before you advance the money.',
  },
};

export function gastoDe(
  gasto: { concepto: string; nota: string },
  idioma: Idioma,
): { concepto: string; nota: string } {
  return idioma === 'en' ? (GASTOS_EN[gasto.concepto] ?? gasto) : gasto;
}

/** Tipos de inmueble. */
export const TIPOS_EN: Record<string, string> = {
  piso: 'Flat',
  atico: 'Top-floor flat',
  chalet: 'House',
  casa: 'House',
  local: 'Commercial unit',
};

/** Operaciones. */
export const OPERACIONES_EN: Record<string, { titulo: string; sufijo: string }> = {
  venta: { titulo: 'For sale', sufijo: '' },
  alquiler: { titulo: 'To rent', sufijo: '/month' },
};

/**
 * Devuelve el texto en el idioma pedido, con el español de reserva.
 *
 * La reserva no es pereza: si algún día entra un inmueble nuevo y se publica
 * antes de traducirlo, es mejor que salga su descripción en español a que
 * salga un hueco en blanco donde debería estar la descripción.
 */
export function enIdioma<T extends Traduccion>(
  idioma: Idioma,
  español: string,
  traducciones: Record<string, T> | undefined,
  id: string,
  campo: keyof T,
): string {
  if (idioma === 'es') return español;
  const valor = traducciones?.[id]?.[campo];
  return typeof valor === 'string' ? valor : español;
}

/* ---- Atajos para lo que se usa en cada plantilla ---- */

interface ConTextos {
  id: string;
  titulo: string;
  descripcion: string;
  aviso?: string;
}

export function tituloDe(inmueble: ConTextos, idioma: Idioma): string {
  return enIdioma(idioma, inmueble.titulo, INMUEBLES_EN, inmueble.id, 'titulo');
}

export function descripcionDe(inmueble: ConTextos, idioma: Idioma): string {
  return enIdioma(idioma, inmueble.descripcion, INMUEBLES_EN, inmueble.id, 'descripcion');
}

export function avisoDe(inmueble: ConTextos, idioma: Idioma): string | undefined {
  if (!inmueble.aviso) return undefined;
  return enIdioma(idioma, inmueble.aviso, INMUEBLES_EN, inmueble.id, 'aviso');
}

export function tipoDe(tipo: string, español: string, idioma: Idioma): string {
  return idioma === 'en' ? (TIPOS_EN[tipo] ?? español) : español;
}

export function operacionDe(
  operacion: string,
  español: { titulo: string; sufijo: string },
  idioma: Idioma,
): { titulo: string; sufijo: string } {
  return idioma === 'en' ? (OPERACIONES_EN[operacion] ?? español) : español;
}

/**
 * Precio en la convención del idioma: en español el símbolo va detrás y el
 * separador de miles es el punto; en inglés, al revés.
 */
export function precioDe(precio: number, idioma: Idioma): string {
  return idioma === 'en'
    ? `€${precio.toLocaleString('en-GB')}`
    : `${precio.toLocaleString('es-ES')} €`;
}
