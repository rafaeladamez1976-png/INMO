import { describe, it, expect } from 'vitest';
import {
  estadoInicial,
  pasoCompleto,
  redactarMensaje,
  progreso,
  ULTIMO_PASO,
} from '../src/components/reglas-valoracion';
import { OFICINAS, EMPRESA, enlaceWhatsApp, telefonoLegible } from '../src/data/empresa';

describe('avance del captador', () => {
  it('no deja pasar sin elegir tipo de inmueble', () => {
    expect(pasoCompleto(estadoInicial(), 1)).toBe(false);
  });

  it('deja pasar en cuanto hay tipo', () => {
    expect(pasoCompleto({ ...estadoInicial(), tipo: 'Piso' }, 1)).toBe(true);
  });

  it('exige zona en el paso 2', () => {
    expect(pasoCompleto(estadoInicial(), 2)).toBe(false);
    expect(pasoCompleto({ ...estadoInicial(), zona: 'Aluche' }, 2)).toBe(true);
  });

  it('los metros son opcionales: no se pierde un encargo por un dato que se puede preguntar', () => {
    const estado = { ...estadoInicial(), habitaciones: '3', metros: '' };
    expect(pasoCompleto(estado, 3)).toBe(true);
  });

  it('exige plazo y nombre en el último paso', () => {
    let estado = { ...estadoInicial(), plazo: 'Cuanto antes' };
    expect(pasoCompleto(estado, 4)).toBe(false);

    estado = { ...estado, nombre: '   ' };
    expect(pasoCompleto(estado, 4)).toBe(false);

    estado = { ...estado, nombre: 'María' };
    expect(pasoCompleto(estado, 4)).toBe(true);
  });
});

describe('mensaje que recibe la oficina', () => {
  const completo = {
    ...estadoInicial(),
    tipo: 'Piso',
    zona: 'Aluche (Campamento)',
    oficina: 'aluche',
    habitaciones: '3',
    metros: '90',
    plazo: 'Cuanto antes',
    nombre: 'María',
  };

  it('incluye todo lo que necesita el comercial', () => {
    const mensaje = redactarMensaje(completo);
    expect(mensaje).toContain('Piso');
    expect(mensaje).toContain('Aluche');
    expect(mensaje).toContain('3 habitaciones');
    expect(mensaje).toContain('90 m²');
    expect(mensaje).toContain('Cuanto antes');
    expect(mensaje).toContain('María');
  });

  it('omite los metros si no se han dado', () => {
    expect(redactarMensaje({ ...completo, metros: '' })).not.toContain('m²');
  });

  it('funciona sin nombre', () => {
    const mensaje = redactarMensaje({ ...completo, nombre: '' });
    expect(mensaje).not.toContain('Soy');
    expect(mensaje.endsWith('.')).toBe(true);
  });
});

describe('reparto a la oficina del barrio', () => {
  it('todas las oficinas tienen dos teléfonos', () => {
    for (const oficina of OFICINAS) {
      expect(oficina.telefonos.length, oficina.nombre).toBe(2);
    }
  });

  it('el segundo teléfono de cada oficina es un móvil', () => {
    // Los móviles españoles empiezan por 6 o 7: son los que llevan WhatsApp.
    for (const oficina of OFICINAS) {
      expect(oficina.telefonos[1][0], oficina.nombre).toMatch(/[67]/);
    }
  });

  it('el enlace de WhatsApp lleva prefijo de España y el mensaje codificado', () => {
    const enlace = enlaceWhatsApp('660857803', 'Hola qué tal');
    expect(enlace).toContain('https://wa.me/34660857803');
    expect(enlace).not.toContain(' ');
  });

  it('ninguna oficina repite identificador', () => {
    const ids = OFICINAS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('presentación', () => {
  it('los teléfonos se muestran agrupados', () => {
    expect(telefonoLegible('917060416')).toBe('917 06 04 16');
    expect(telefonoLegible(EMPRESA.telefonoGratuito)).toBe('900 70 10 34');
  });

  it('la barra de progreso avanza y no se pasa de 1', () => {
    expect(progreso(1)).toBeLessThan(progreso(3));
    expect(progreso(ULTIMO_PASO)).toBe(1);
    expect(progreso(99)).toBe(1);
  });
});
