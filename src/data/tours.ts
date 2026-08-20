import type { TipoInmueble } from './inmuebles';

/**
 * Recorridos 360 según el tipo de inmueble.
 *
 * Un local no enseña dormitorio y un chalet sí enseña jardín: repetir el mismo
 * recorrido en todas las fichas delataría al instante que es un montaje.
 *
 * Cada estancia declara sus saltos por ángulo, de modo que los puntos dorados
 * caen sobre puertas o pasillos y no en mitad de una pared.
 */

export interface Salto {
  a: string;
  etiqueta: string;
  /** Grados sobre el horizonte de la panorámica. */
  angulo: number;
  altura: number;
}

export interface Estancia {
  id: string;
  nombre: string;
  imagen: string;
  saltos: Salto[];
}

/** Construye un recorrido circular entre las estancias que se le pasen. */
function recorrido(estancias: Array<{ id: string; nombre: string }>): Estancia[] {
  return estancias.map((estancia, i) => {
    const saltos: Salto[] = [];

    const siguiente = estancias[(i + 1) % estancias.length];
    const anterior = estancias[(i - 1 + estancias.length) % estancias.length];

    /*
     * Los ángulos caen dentro de la media vuelta que abarca la fotografía.
     * Antes uno de ellos iba a -125, o sea justo a la espalda: con el visor
     * de 360 quedaba detrás y no se encontraba nunca.
     */
    if (siguiente.id !== estancia.id) {
      saltos.push({ a: siguiente.id, etiqueta: siguiente.nombre, angulo: 46, altura: -7 });
    }
    if (anterior.id !== estancia.id && anterior.id !== siguiente.id) {
      saltos.push({ a: anterior.id, etiqueta: anterior.nombre, angulo: -46, altura: -7 });
    }

    return {
      id: estancia.id,
      nombre: estancia.nombre,
      imagen: `/tour/${estancia.id}.jpg`,
      saltos,
    };
  });
}

const VIVIENDA = [
  { id: 'salon', nombre: 'Salón' },
  { id: 'cocina', nombre: 'Cocina' },
  { id: 'dormitorio', nombre: 'Dormitorio' },
  { id: 'bano', nombre: 'Baño' },
];

const CON_JARDIN = [
  { id: 'salon', nombre: 'Salón' },
  { id: 'cocina', nombre: 'Cocina' },
  { id: 'dormitorio', nombre: 'Dormitorio' },
  { id: 'jardin', nombre: 'Jardín' },
];

const CON_TERRAZA = [
  { id: 'salon', nombre: 'Salón' },
  { id: 'cocina', nombre: 'Cocina' },
  { id: 'terraza', nombre: 'Terraza' },
];

const COMERCIAL = [{ id: 'local', nombre: 'Local' }];

/** Qué recorrido corresponde a cada tipo de inmueble. */
export function tourDe(tipo: TipoInmueble): Estancia[] {
  switch (tipo) {
    case 'chalet':
    case 'casa':
      return recorrido(CON_JARDIN);
    case 'atico':
      return recorrido(CON_TERRAZA);
    case 'local':
      return recorrido(COMERCIAL);
    default:
      return recorrido(VIVIENDA);
  }
}

/** Un local con una sola estancia no necesita puntos de salto. */
export function tieneRecorrido(tipo: TipoInmueble): boolean {
  return tourDe(tipo).length > 1;
}
