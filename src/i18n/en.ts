import type { Textos } from './es';

/**
 * English copy.
 *
 * Typed as `Textos`, so leaving anything out is a compile error rather than a
 * Spanish sentence sitting in the middle of an English page.
 *
 * Written, not machine-translated: the Spanish is deliberately plain-spoken and
 * a literal translation would read like a brochure. Prices stay in euros and
 * legal terms keep their Spanish name with a short gloss — an English-speaking
 * buyer will hear "ITP" and "nota simple" at the notary, not their translation.
 */
export const en: Textos = {
  comun: {
    verTodos: 'See all',
    verMas: 'See more',
    pedirCita: 'Book a visit',
    pedirVisita: 'Arrange a viewing',
    llamarA: 'Call',
    llamarAl: 'Call',
    escribirWhatsApp: 'Message us on WhatsApp',
    volverInicio: 'Back to home',
    dondeEstas: 'You are here',
    inicio: 'Home',
    cargando: 'Loading…',
    desde: 'From',
    hasta: 'Up to',
    mes: 'per month',
    metros: 'm²',
    dormitorios: 'Bedrooms',
    banos: 'Bathrooms',
    planta: 'Floor',
    referencia: 'Reference',
    guardar: 'Save to favourites',
    quitar: 'Remove from favourites',
    sinCoste: 'Free, with no obligation',
  },

  aviso: {
    fuerte: 'Demonstration site.',
    resto: 'Every property shown is a made-up example.',
  },

  nav: {
    principal: 'Main navigation',
    todas: 'All sections',
    menu: 'Menu',
    cerrar: 'Close menu',
    mas: 'More',
    buscar: 'Search',
    empresa: 'The agency',
    favoritos: 'See your favourites',
    idioma: 'Language',
    cambiarIdioma: 'Ver esta página en español',
  },

  pie: {
    oficinas: 'Offices',
    servicios: 'Services',
    legal: 'Legal',
    firma: 'Demonstration site · Web design and development',
    horario: 'Opening hours',
  },

  heroe: {
    palabras: ['Find', 'the', 'place'],
    acento: 'that fits',
    oficinas: 'offices',
    entrada:
      'We sell and let in Cuatro Vientos, Aluche, Las Águilas and Latina. We are not looking for a flat in Madrid: we are looking for yours, on your street.',
    ver: 'See properties',
    vender: 'Sell my home',
    fotoAlt: 'Modern villa lit at dusk with an infinity pool',
    cifras: {
      inmuebles: 'Properties',
      oficinas: 'Offices',
      provincias: 'Provinces',
    },
    sellos: [
      'Four neighbourhood offices',
      'Properties we have seen',
      'A person, not a call centre',
      'A sale that holds up',
    ],
  },

  portada: {
    titulo: 'Buying, selling and renting in Madrid',
    descripcion:
      'Estate agency with four offices in Cuatro Vientos, Aluche, Las Águilas and Latina. Buying, selling, renting and free valuations.',
    servicios: {
      antetitulo: 'What we do',
      titulo: 'Everything that can happen to a home',
      entrada:
        'Buying, selling, renting or transferring a lease. Whatever your situation, one of our offices is less than ten minutes away.',
    },
    captacion: {
      antetitulo: 'Sell with us',
      titulo: 'Do you know what your home is worth today?',
      texto:
        'Prices on your street have moved over the past year. We will tell you what yours is worth using real figures from sales closed in your area, free of charge and with nothing to sign.',
      boton: 'Request a free valuation',
      casaAlt: 'Modern villa with a pool, rotatable in 3D',
      pasos: [
        { fuerte: 'You call us', resto: 'or fill in the form' },
        { fuerte: 'We visit', resto: 'the property, with no obligation' },
        { fuerte: 'We give you a price', resto: 'we can justify, not an inflated one' },
        { fuerte: 'You decide', resto: 'with no strings attached' },
      ],
    },
    territorio: {
      antetitulo: 'Our patch',
      titulo: 'We work where you live',
      entrada:
        'Fly over our four neighbourhoods. Each brass spire is an office with its door open.',
      pista: 'Scroll to fly over',
    },
    destacados: {
      antetitulo: 'Selection',
      titulo: 'The latest to come in',
    },
    tablon: 'Latest from our offices',
    oficinas: {
      antetitulo: 'Where we are',
      titulo: 'Four offices, four neighbourhoods',
      entrada:
        'We do not work out of an office in the city centre. We are on the street where your home is.',
      sede: 'Head office',
    },
  },

  buscador: {
    tipo: 'Type',
    todos: 'All',
    zona: 'Area',
    todas: 'All',
    habitaciones: 'Bedrooms',
    cualquiera: 'Any',
    oMas: 'or more',
    precioMaximo: 'Maximum price',
    limpiar: 'Clear filters',
    uno: '1 property',
    varios: 'properties',
    vacioAntes: 'Nothing matches those filters. Try widening the price or the area, or',
    vacioEnlace: 'tell us what you are looking for',
    vacioDespues: 'and we will let you know when it comes in.',
  },

  venta: {
    tituloPagina: 'Homes for sale in Madrid',
    antetitulo: 'Buying',
    titulo: 'Homes',
    acento: 'for sale',
    entrada:
      'Flats, houses and commercial units for sale in Madrid, Toledo and Extremadura.',
  },

  alquiler: {
    tituloPagina: 'Homes to rent in Madrid',
    antetitulo: 'Renting',
    titulo: 'Homes',
    acento: 'to rent',
    entrada:
      'Flats, houses and commercial units to rent in Madrid, on proper contracts and with tenants we have checked.',
  },

  ficha: {
    comoEs: 'What it is like',
    caracteristicas: 'Features',
    conviene: 'Worth knowing:',
    metroUtil: 'per usable m²',
    hipotecaAntes: 'From',
    hipotecaDespues: 'with a 20% deposit over 25 years.',
    hipotecaEnlace: 'Work out yours',
    loLleva: 'Handled by',
    oficinaDe: 'Our office in',
    parecidos: 'If this one is not it, look at these',
    gastos: {
      titulo: 'What buying it actually costs',
      entrada:
        'On top of the price come taxes and paperwork. Here is the breakdown for a resale home in the Madrid region, so nobody gets a surprise at the notary.',
      precio: 'Price of the property',
      gastos: 'Costs and taxes',
      total: 'Total outlay',
      pie: 'Indicative figures as of August 2026. New builds are taxed differently: 10% VAT instead of transfer tax.',
    },
  },

  energia: {
    titulo: 'Energy performance certificate',
    nota: 'Required by law on every listing',
    sello: 'Energy',
    esteInmueble: 'This property',
    consumo: 'Consumption',
    emisiones: 'Emissions',
    consumoUnidad: 'kWh/m² per year',
    emisionesUnidad: 'kg CO₂/m² per year',
    escala: (letra: string) => `Energy rating ${letra} on a scale from A to G`,
  },

  tour: {
    antetitulo: 'Virtual tour',
    titulo: 'Step inside without leaving home',
    arrastra: 'Drag to look around',
    empezar: 'Start the tour',
    pie: 'Sample panoramas. In a real home these are shot with a 360 camera in a single half-hour visit.',
  },

  fotos: 'Photographs of the property',

  obraNueva: {
    antetitulo: 'New build',
    titulo: 'Brand new,',
    acento: 'no surprises',
    descripcion:
      'New-build developments in Madrid, Toledo and Badajoz, with completion dates, developer and available homes in plain sight.',
    entrada: (promos: number, quedan: number, total: number) =>
      `${promos} developments on the market and ${quedan} homes still available out of ${total}. With the developer, the real timescale and what you should know before signing, which is exactly what nobody tells you.`,
    entrega: 'Completion',
    quedan: 'Left',
    de: 'of',
    vendidas: (vendidas: number, total: number) => `${vendidas} sold of ${total}`,
    verPromocion: 'See the development',
    claves: {
      titulo: 'Buying new build is not the same as buying a resale flat',
      lista: [
        {
          titulo: 'You pay VAT, not transfer tax',
          texto:
            'New builds are taxed at 10% VAT plus stamp duty, instead of the 6% transfer tax (ITP) on resale homes in Madrid. On €200,000 that is roughly €10,000 more.',
        },
        {
          titulo: 'Stage payments must be guaranteed',
          texto:
            'By law, everything you pay before completion has to be covered by a bank guarantee or insurance policy. Ask for the document and keep it: that is what gets your money back if the developer fails.',
        },
        {
          titulo: 'Deadlines move',
          texto:
            'An expected completion date is not a fixed one. Allow three to six months of slack, and do not give up your current home until the occupancy licence has been issued.',
        },
        {
          titulo: 'The specification is what counts',
          texto:
            'What gets delivered is what the written specification says, not what you see in the show home. Read it end to end and ask about anything missing.',
        },
      ],
    },
    ayuda: {
      titulo: 'Thinking of buying off-plan?',
      texto:
        'We come with you to the site, go through the specification and the bank guarantee with you, and tell you whether the price stacks up. At no cost to you.',
    },
  },

  promocion: {
    obraNuevaEn: 'New build',
    laPromocion: 'The development',
    queQueda: 'What is left',
    queIncluye: 'What is included',
    tipologiasEntrada:
      'Prices from, without parking or storage unless listed under what is included. Floor areas are built areas.',
    vivienda: 'Home',
    superficie: 'Floor area',
    ultimas: 'last ones',
    terrazaDe: 'terrace of',
    numeros: 'The figures on the cheapest one',
    numerosEntrada: (precio: string) => `Based on ${precio}, the cheapest home still available.`,
    precio: 'Price',
    impuestos: 'VAT (10%) and stamp duty',
    total: 'Total outlay',
    cuotaAntes: 'With a 20% deposit over 25 years at 3.2%, the monthly payment would be around',
    cuotaDespues: 'a month',
    cuotaEnlace: 'Work it out with your own figures',
    promotora: 'Developer',
    energia: 'Energy',
    certificacion: 'Rating',
    disponibles: 'Available',
    pedirInfo: 'Request information',
    laComercializa: 'Handled by',
    otras: 'Other developments',
    imagenes: 'Images of the development',
    informacion: 'Information',
  },

  valoracion: {
    titulo: 'Free valuation',
  },

  calculadora: {
    antetitulo: 'Calculator',
    titulo: 'What would you pay',
    acento: 'each month',
    entrada:
      'Move the sliders and the monthly payment updates as you go. We do not even ask for your email: this is for you to run your own numbers, not for us to capture you as a lead.',
    descripcion:
      'Work out your mortgage payment using the French amortisation system. No sign-up, no personal details.',
    cuotaMensual: 'Monthly payment',
    pidesBanco: 'Borrowed from the bank',
    intereses: 'Total interest',
    gastos: 'Purchase costs',
    ahorro: 'Savings needed',
    asesor: 'Talk to an adviser',
    noIncluye: 'What this calculation leaves out',
  },

  cita: {
    antetitulo: 'Diary',
    titulo: 'Book your appointment',
    acento: 'in a minute',
    entrada:
      'No phone calls, no waiting and no more personal details than necessary. You pick the day and time, and we confirm on WhatsApp.',
    descripcion:
      'Book an appointment at any of our four offices in Madrid. Choose a day and time and we confirm on WhatsApp.',
    sinCita: 'You can also just walk in',
    sinCitaTexto: (oficinas: number) =>
      `Our ${oficinas} offices are open Monday to Friday. If the door is open, we will see you.`,
    verOficinas: 'See the offices',
  },

  alertas: {
    antetitulo: 'Alerts',
    titulo: 'Let us tell you',
    acento: 'when it comes in',
    entrada:
      'The good ones go in days. Tell us what you are after and we will message you as soon as something fits, before it is advertised.',
    descripcion:
      'Tell us what you are looking for and we will message you on WhatsApp as soon as something fits. No sign-up, no email address.',
    queBuscas: 'What you are after',
    operacion: 'Looking to',
    comprar: 'Buy',
    alquilar: 'Rent',
    tipo: 'Type',
    cualquiera: 'Any',
    dormitoriosMin: 'Minimum bedrooms',
    losQueSean: 'However many',
    oMas: 'or more',
    donde: 'Where',
    dondePista: 'Tick the ones that work for you. Tick none and we will tell you about all of them.',
    hastaCuanto: 'Up to how much',
    precioMaximo: 'Maximum price',
    ahoraTenemos: 'Right now we have',
    encajaUno: 'that fits what you are asking for',
    encajanVarios: 'that fit what you are asking for',
    avisadme: 'Let me know on WhatsApp',
    verLosQueHay: 'See the ones we have now',
    letraPequena:
      'The message reaches the office and we add you to the list by hand. This is not an automated system: a person writes to you, and you can ask to be taken off whenever you like. We do not store your number anywhere else.',
    comoFunciona: 'How it works',
    pasos: [
      {
        titulo: 'You tell us what you want',
        texto: 'No sign-up, no email address and no passwords to remember.',
      },
      {
        titulo: 'We note it down at the office',
        texto:
          'Your request goes onto the list at the office that covers that area, which is the first to hear about what is coming up.',
      },
      {
        titulo: 'We write to you before it is advertised',
        texto:
          'A few days pass between an owner instructing us and the listing going live. That gap is where you win.',
      },
    ],
    hablando: 'Would you rather talk it through?',
    hablandoTexto:
      'Sometimes what you are after does not fit in a form. Call us and we will note it down as we talk.',
    mensaje: {
      saludo: 'Hello, I would like you to let me know when something comes in. I am looking to',
      comprar: 'buy',
      alquilar: 'rent',
      loQueSea: 'anything',
      dormitorios: (n: number) => `with ${n} bedrooms or more`,
      hasta: (precio: string) => `up to ${precio}`,
      en: (zonas: string) => `in ${zonas}`,
      cualquierZona: 'in any of your areas',
      gracias: 'Thank you.',
    },
  },

  favoritos: {
    antetitulo: 'Your shortlist',
    titulo: 'The ones',
    acento: 'you liked',
    entrada:
      'These are kept in this browser, with no sign-up and without giving us your details. Change device or clear your history and they are gone.',
    descripcion: 'The properties you have saved. They stay in your browser, with no sign-up.',
    vacioTitulo: 'You have not saved anything yet',
    vacioTexto:
      'Tap the heart on any property and it will appear here. Handy for comparing at your own pace and for showing whoever decides with you.',
    verVenta: 'See what is for sale',
    verAlquiler: 'See what is to rent',
    unoGuardado: '1 property saved',
    variosGuardados: (n: number) => `${n} properties saved`,
    consultar: 'Ask about these on WhatsApp',
    vaciar: 'Clear',
    confirmarVaciar: 'Remove everything you have saved?',
    ayudaTitulo: 'Want to see them?',
    ayudaTexto:
      'Send us your list and we will arrange the viewings in a single afternoon, starting with the one you like most.',
    mensaje: (lista: string) =>
      `Hello, I am interested in these properties: ${lista}. I would like to arrange viewings.`,
  },

  testimonios: {
    antetitulo: 'What people say',
    titulo: 'Trust is not advertised,',
    titulo2: 'it is earned',
    nota: 'Examples of how real client reviews would be shown.',
    lista: [
      {
        texto:
          'They gave us a lower price than two other agencies and explained why. It sold in five weeks at the price they had said.',
        nombre: 'Carmen R.',
        detalle: 'Sold her flat in Aluche',
      },
      {
        texto:
          'We had been looking on our own for eight months. They showed us four flats and the third one was ours. They knew exactly what we wanted.',
        nombre: 'Javier and Nuria',
        detalle: 'Bought in Las Águilas',
      },
      {
        texto:
          'What I value most is that they answered the phone. That sounds like nothing until you have dealt with someone who does not.',
        nombre: 'Antonio M.',
        detalle: 'Let his commercial unit in Latina',
      },
    ],
  },

  barrios: {
    antetitulo: 'Comparison',
    titulo: 'Before you choose a flat,',
    titulo2: 'choose a neighbourhood',
    entrada:
      'The four neighbourhoods we work in, properly compared. With the good and with what we do not like about each one.',
    distrito: 'District',
    compra: 'To buy',
    alquilerTipo: 'Rent, 2 bed',
    hastaSol: 'To Sol',
    min: 'min',
    encajaSi: 'Right if',
    loMejor: 'Best thing',
    laPega: 'The catch',
    sobre5: (v: number) => `${v} out of 5`,
    fuente:
      'Indicative prices from our own records. Updated each quarter with sales closed through our offices.',
  },

  tablon: {
    antetitulo: 'Noticeboard',
    titulo: 'Latest news',
    actualizado: (fecha: string) => `Updated ${fecha}`,
    lasCuatro: 'All four offices',
    verInmueble: 'See the property',
    etiquetas: {
      cartera: 'New instruction',
      precio: 'Price drop',
      aviso: 'Notice',
      consejo: 'Advice',
      zona: 'The area',
    },
  },
};
