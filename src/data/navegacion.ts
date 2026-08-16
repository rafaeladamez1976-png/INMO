/**
 * Navegación completa, en los dos idiomas.
 *
 * Reproduce todas las secciones que tiene la web de referencia, agrupadas para
 * que quepan sin convertir la cabecera en un muro de enlaces: las que mueven
 * negocio van visibles y el resto en un desplegable.
 *
 * Las rutas son las mismas en los dos idiomas y solo cambia el prefijo /en.
 * Traducir también las URL (/for-sale en vez de /venta) obligaría a mantener
 * dos mapas de rutas y a romper los enlaces que ya haya por ahí compartidos.
 */

import type { Idioma } from '../i18n';

export interface Enlace {
  href: string;
  texto: Record<Idioma, string>;
  descripcion?: Record<Idioma, string>;
}

/** Lo que ve el cliente sin desplegar nada. */
export const PRINCIPALES: Enlace[] = [
  { href: '/venta', texto: { es: 'Venta', en: 'For sale' } },
  { href: '/alquiler', texto: { es: 'Alquiler', en: 'To rent' } },
  { href: '/valoracion', texto: { es: 'Valoración', en: 'Valuation' } },
  { href: '/calculadora-hipotecaria', texto: { es: 'Calculadora', en: 'Calculator' } },
  { href: '/cita', texto: { es: 'Pedir cita', en: 'Book a visit' } },
  { href: '/oficinas', texto: { es: 'Oficinas', en: 'Offices' } },
];

/** El resto, en el desplegable. */
export const SECUNDARIOS: Enlace[] = [
  {
    href: '/obra-nueva',
    texto: { es: 'Obra nueva', en: 'New build' },
    descripcion: {
      es: 'Promociones a estrenar en Madrid, Toledo y Badajoz',
      en: 'Brand-new developments in Madrid, Toledo and Badajoz',
    },
  },
  {
    href: '/alertas',
    texto: { es: 'Avisos de inmuebles', en: 'Property alerts' },
    descripcion: {
      es: 'Que te escribamos cuando entre lo que buscas',
      en: 'We message you when what you want comes in',
    },
  },
  {
    href: '/alquiler-vitalicio',
    texto: { es: 'Alquiler vitalicio', en: 'Lifetime lease' },
    descripcion: {
      es: 'Cobra por tu vivienda y sigue viviendo en ella',
      en: 'Get paid for your home and carry on living in it',
    },
  },
  {
    href: '/empresa',
    texto: { es: 'Empresa', en: 'About us' },
    descripcion: { es: 'Quiénes somos', en: 'Who we are' },
  },
  {
    href: '/contacto',
    texto: { es: 'Contacto', en: 'Contact' },
    descripcion: { es: 'Escríbenos o llámanos', en: 'Write to us or call' },
  },
  {
    href: '/trabaja-con-nosotros',
    texto: { es: 'Trabaja con nosotros', en: 'Work with us' },
    descripcion: { es: 'Únete al equipo', en: 'Join the team' },
  },
  {
    href: '/noticias',
    texto: { es: 'Noticias', en: 'News' },
    descripcion: { es: 'Novedades de las oficinas', en: 'What our offices are up to' },
  },
  {
    href: '/favoritos',
    texto: { es: 'Tus favoritos', en: 'Your favourites' },
    descripcion: {
      es: 'Los inmuebles que has guardado',
      en: 'The properties you have saved',
    },
  },
];

/** Enlaces legales, solo en el pie y en el menú de móvil. */
export const LEGALES: Enlace[] = [
  { href: '/privacidad', texto: { es: 'Política de privacidad', en: 'Privacy policy' } },
];

export const TODOS: Enlace[] = [...PRINCIPALES, ...SECUNDARIOS, ...LEGALES];
