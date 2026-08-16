/**
 * Navegación completa.
 *
 * Reproduce todas las secciones que tiene la web de referencia, agrupadas para
 * que quepan sin convertir la cabecera en un muro de enlaces: las cinco que
 * mueven negocio van visibles, el resto en un desplegable.
 */

export interface Enlace {
  href: string;
  texto: string;
  corto?: string;
  descripcion?: string;
}

/** Lo que ve el cliente sin desplegar nada. */
export const PRINCIPALES: Enlace[] = [
  { href: '/venta', texto: 'Venta', corto: 'Venta' },
  { href: '/alquiler', texto: 'Alquiler', corto: 'Alquiler' },
  { href: '/valoracion', texto: 'Valoración', corto: 'Valorar' },
  { href: '/calculadora-hipotecaria', texto: 'Calculadora', corto: 'Hipoteca' },
  { href: '/cita', texto: 'Pedir cita', corto: 'Cita' },
  { href: '/oficinas', texto: 'Oficinas', corto: 'Oficinas' },
];

/** El resto, en el desplegable. */
export const SECUNDARIOS: Enlace[] = [
  {
    href: '/alquiler-vitalicio',
    texto: 'Alquiler vitalicio',
    descripcion: 'Cobra por tu vivienda y sigue viviendo en ella',
  },
  { href: '/empresa', texto: 'Empresa', descripcion: 'Quiénes somos' },
  { href: '/contacto', texto: 'Contacto', descripcion: 'Escríbenos o llámanos' },
  {
    href: '/trabaja-con-nosotros',
    texto: 'Trabaja con nosotros',
    descripcion: 'Únete al equipo',
  },
  { href: '/noticias', texto: 'Noticias', descripcion: 'Novedades de las oficinas' },
  { href: '/favoritos', texto: 'Tus favoritos', descripcion: 'Los inmuebles que has guardado' },
];

/** Enlaces legales, solo en el pie. */
export const LEGALES: Enlace[] = [
  { href: '/privacidad', texto: 'Política de privacidad' },
];

export const TODOS: Enlace[] = [...PRINCIPALES, ...SECUNDARIOS, ...LEGALES];
