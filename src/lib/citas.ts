/**
 * Reglas de la agenda de visitas.
 *
 * Módulo puro, sin DOM, para poder comprobarlo con tests: una cita mal
 * calculada es un cliente que se planta en una oficina cerrada.
 *
 * Horario de atención: lunes a viernes de 10:00 a 14:00 y de 17:00 a 20:00;
 * sábados solo de mañana. Domingos cerrado.
 */

export const MOTIVOS = [
  'Vender mi vivienda',
  'Alquilar mi vivienda',
  'Ver un inmueble',
  'Valoración gratuita',
  'Hipoteca y financiación',
  'Otra consulta',
] as const;

export type Motivo = (typeof MOTIVOS)[number];

const MANANA = ['10:00', '10:45', '11:30', '12:15', '13:00'];
const TARDE = ['17:00', '17:45', '18:30', '19:15'];

/** Antelación mínima: no se agenda para dentro de diez minutos. */
const ANTELACION_MS = 3 * 60 * 60 * 1000;

/** Franjas que se atienden según el día de la semana. */
export function franjasDe(fecha: Date): string[] {
  const dia = fecha.getDay();
  if (dia === 0) return []; // domingo
  if (dia === 6) return MANANA; // sábado, solo mañanas
  return [...MANANA, ...TARDE];
}

export function aISO(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function esHueco(fechaISO: string, hora: string, ahora: Date): boolean {
  const cita = new Date(`${fechaISO}T${hora}:00`);
  if (Number.isNaN(cita.getTime())) return false;
  if (!franjasDe(cita).includes(hora)) return false;
  return cita.getTime() - ahora.getTime() >= ANTELACION_MS;
}

export function huecosDe(fechaISO: string, ahora: Date): string[] {
  const fecha = new Date(`${fechaISO}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return [];
  return franjasDe(fecha).filter((hora) => esHueco(fechaISO, hora, ahora));
}

/** Días con al menos un hueco libre, a partir de hoy. */
export function diasDisponibles(ahora: Date, dias = 21): string[] {
  const disponibles: string[] = [];
  for (let i = 0; i <= dias; i++) {
    const dia = new Date(ahora);
    dia.setDate(dia.getDate() + i);
    const iso = aISO(dia);
    if (huecosDe(iso, ahora).length > 0) disponibles.push(iso);
  }
  return disponibles;
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function fechaEnPalabras(fechaISO: string): string {
  const fecha = new Date(`${fechaISO}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return fechaISO;
  return `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
}

export function diaCorto(fechaISO: string): { letra: string; numero: number; mes: string } {
  const fecha = new Date(`${fechaISO}T12:00:00`);
  return {
    letra: DIAS_CORTOS[fecha.getDay()],
    numero: fecha.getDate(),
    mes: MESES[fecha.getMonth()].slice(0, 3),
  };
}

export interface Cita {
  motivo: string;
  oficina: string;
  fecha: string;
  hora: string;
  nombre: string;
}

export function citaCompleta(cita: Partial<Cita>): boolean {
  return Boolean(cita.motivo && cita.oficina && cita.fecha && cita.hora && cita.nombre?.trim());
}

export function redactarCita(cita: Cita): string {
  const nombre = cita.nombre.trim();
  return (
    `Hola, quería reservar una cita. ` +
    `Motivo: ${cita.motivo} · Oficina: ${cita.oficina} · ` +
    `${fechaEnPalabras(cita.fecha)} a las ${cita.hora}` +
    (nombre ? `. Soy ${nombre}.` : '.')
  );
}
