/**
 * Reglas del captador de valoraciones.
 *
 * Módulo puro y sin DOM, para poder probarlo con tests: es la pieza que
 * genera los encargos de venta, y un fallo aquí es dinero perdido.
 */

export const ULTIMO_PASO = 5;

export interface Estado {
  paso: number;
  tipo: string;
  zona: string;
  oficina: string;
  habitaciones: string;
  metros: string;
  plazo: string;
  nombre: string;
}

export function estadoInicial(): Estado {
  return {
    paso: 1,
    tipo: '',
    zona: '',
    oficina: '',
    habitaciones: '',
    metros: '',
    plazo: '',
    nombre: '',
  };
}

/**
 * ¿Puede avanzar desde este paso?
 *
 * Los metros son opcionales: mucha gente no los sabe de memoria, y perder un
 * encargo por exigir un dato que se puede preguntar luego sería absurdo.
 */
export function pasoCompleto(estado: Estado, paso: number): boolean {
  switch (paso) {
    case 1:
      return estado.tipo !== '';
    case 2:
      return estado.zona !== '';
    case 3:
      return estado.habitaciones !== '';
    case 4:
      return estado.plazo !== '' && estado.nombre.trim().length > 0;
    default:
      return true;
  }
}

/** Mensaje que recibirá la oficina. */
export function redactarMensaje(estado: Estado): string {
  const partes: string[] = ['Hola, quería pedir una valoración.'];

  if (estado.tipo) partes.push(estado.tipo);
  if (estado.zona) partes.push(`Zona: ${estado.zona}`);
  if (estado.habitaciones) partes.push(`${estado.habitaciones} habitaciones`);
  if (estado.metros.trim()) partes.push(`${estado.metros.trim()} m² aprox.`);
  if (estado.plazo) partes.push(estado.plazo);

  const cuerpo = partes.join(' · ');
  const nombre = estado.nombre.trim();
  return nombre ? `${cuerpo}. Soy ${nombre}.` : `${cuerpo}.`;
}

/** Progreso de 0 a 1, para la barra. */
export function progreso(paso: number): number {
  return Math.min(paso / ULTIMO_PASO, 1);
}
