/**
 * Dos idiomas: español e inglés.
 *
 * El español va sin prefijo (/venta) porque es el idioma de la casa y el de
 * casi todos los clientes. El inglés cuelga de /en (/en/venta).
 *
 * Cada página se escribe una sola vez, dentro de src/pages/[...lang]/, y
 * getStaticPaths la genera en los dos idiomas. Un parámetro rest puede no
 * casar con nada, y ahí está el truco: con lang sin valor sale la ruta
 * española sin prefijo.
 */

import { es } from './es';
import { en } from './en';

export type Idioma = 'es' | 'en';

export const IDIOMAS: { id: Idioma; nombre: string; etiqueta: string; prefijo: string }[] = [
  { id: 'es', nombre: 'Español', etiqueta: 'ES', prefijo: '' },
  { id: 'en', nombre: 'English', etiqueta: 'EN', prefijo: '/en' },
];

export const POR_DEFECTO: Idioma = 'es';

const TEXTOS = { es, en };

/** Diccionario del idioma. Es la única forma de sacar texto a pantalla. */
export function textos(idioma: Idioma) {
  return TEXTOS[idioma];
}

/**
 * De parámetro de ruta a idioma. Astro entrega undefined en la ruta española
 * porque el parámetro rest no ha casado con nada.
 */
export function idiomaDe(lang: string | undefined): Idioma {
  return lang === 'en' ? 'en' : POR_DEFECTO;
}

/**
 * Las dos rutas que genera cada página. Se usa en todos los getStaticPaths,
 * así que si algún día entra un tercer idioma se toca solo aquí.
 */
export function rutasDeIdioma() {
  return [
    { params: { lang: undefined }, props: { idioma: 'es' as Idioma } },
    { params: { lang: 'en' }, props: { idioma: 'en' as Idioma } },
  ];
}

/**
 * Enlaza a una sección en el idioma que toca.
 * ruta('en', '/venta') → '/en/venta'
 * ruta('es', '/venta') → '/venta'
 */
export function ruta(idioma: Idioma, camino: string): string {
  const limpio = camino === '/' ? '' : camino;
  return idioma === 'es' ? limpio || '/' : `/en${limpio}`;
}

/**
 * La misma página en el otro idioma, para el conmutador.
 *
 * Quita el prefijo actual y pone el del destino: quien está leyendo la ficha
 * de un inmueble en español acaba en esa misma ficha en inglés, no en la
 * portada. Es la diferencia entre un conmutador útil y uno que estorba.
 */
export function mismaPaginaEn(idioma: Idioma, rutaActual: string): string {
  const sinPrefijo = rutaActual.replace(/^\/en(?=\/|$)/, '') || '/';
  // Astro sirve con barra final; se normaliza para no generar // al unir.
  const camino = sinPrefijo.endsWith('/') && sinPrefijo !== '/'
    ? sinPrefijo.slice(0, -1)
    : sinPrefijo;
  return ruta(idioma, camino);
}

/** Código para el atributo lang y para hreflang. */
export function codigo(idioma: Idioma): string {
  return idioma === 'en' ? 'en' : 'es-ES';
}

/** Formatea euros en la convención del idioma. */
export function euros(cantidad: number, idioma: Idioma): string {
  const n = Math.round(cantidad);
  return idioma === 'en'
    ? `€${n.toLocaleString('en-GB')}`
    : `${n.toLocaleString('es-ES')} €`;
}
