import type { Nivel } from './ciudad';

/**
 * Nivel de detalle de la ciudad 3D.
 *
 * Sin importar Three.js, para poder decidir antes de descargarlo.
 * La escena se ve en móvil, tablet y escritorio: lo que cambia es cuánto
 * dibuja, no si dibuja.
 */
export function nivelCiudad(): Nivel | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const red = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (red?.saveData) return null;
  if (red?.effectiveType && ['slow-2g', '2g'].includes(red.effectiveType)) return null;

  try {
    const prueba = document.createElement('canvas');
    if (!(prueba.getContext('webgl2') || prueba.getContext('webgl'))) return null;
  } catch {
    return null;
  }

  const nucleos = navigator.hardwareConcurrency ?? 4;
  const memoria = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const ancho = window.innerWidth;

  if (ancho < 600 || nucleos <= 4 || memoria <= 2) return 'baja';
  if (ancho < 1100 || nucleos <= 8) return 'media';
  return 'alta';
}
