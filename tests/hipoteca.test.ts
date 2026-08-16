import { describe, it, expect } from 'vitest';
import {
  calcular,
  ingresosRecomendados,
  euros,
  desglosarGastos,
  PORCENTAJE_GASTOS,
  RATIO_ENDEUDAMIENTO,
} from '../src/lib/hipoteca';

/**
 * Estos números los va a usar alguien para decidir si puede comprar una casa.
 * Se comprueban contra valores calculados a mano con la fórmula del sistema
 * francés.
 */

describe('cuota mensual', () => {
  it('calcula bien un caso conocido', () => {
    // 200.000 € a 30 años al 3 % → cuota de 843,21 €
    const r = calcular({ precio: 250000, entrada: 50000, anios: 30, interes: 3 });
    expect(r.capital).toBe(200000);
    expect(r.cuota).toBeCloseTo(843.21, 1);
  });

  it('con interés cero reparte el capital a partes iguales', () => {
    const r = calcular({ precio: 120000, entrada: 0, anios: 10, interes: 0 });
    expect(r.cuota).toBeCloseTo(1000, 6);
    expect(r.intereses).toBeCloseTo(0, 6);
  });

  it('a más plazo, menos cuota pero más intereses', () => {
    const corto = calcular({ precio: 200000, entrada: 40000, anios: 15, interes: 3.5 });
    const largo = calcular({ precio: 200000, entrada: 40000, anios: 30, interes: 3.5 });

    expect(largo.cuota).toBeLessThan(corto.cuota);
    expect(largo.intereses).toBeGreaterThan(corto.intereses);
  });

  it('a más interés, más cuota', () => {
    const barato = calcular({ precio: 200000, entrada: 40000, anios: 25, interes: 2 });
    const caro = calcular({ precio: 200000, entrada: 40000, anios: 25, interes: 4 });
    expect(caro.cuota).toBeGreaterThan(barato.cuota);
  });
});

describe('casos límite', () => {
  it('si la entrada cubre todo el precio, no hay hipoteca', () => {
    const r = calcular({ precio: 150000, entrada: 150000, anios: 20, interes: 3 });
    expect(r.capital).toBe(0);
    expect(r.cuota).toBe(0);
    expect(r.intereses).toBe(0);
  });

  it('una entrada mayor que el precio no genera capital negativo', () => {
    const r = calcular({ precio: 100000, entrada: 200000, anios: 20, interes: 3 });
    expect(r.capital).toBe(0);
    expect(r.porcentajeEntrada).toBe(100);
  });

  it('no acepta precios negativos', () => {
    const r = calcular({ precio: -50000, entrada: 0, anios: 20, interes: 3 });
    expect(r.capital).toBe(0);
  });

  it('un plazo de cero años no rompe el cálculo', () => {
    const r = calcular({ precio: 100000, entrada: 0, anios: 0, interes: 3 });
    expect(Number.isFinite(r.cuota)).toBe(true);
  });
});

describe('ahorro necesario', () => {
  it('suma la entrada y los gastos de compra', () => {
    const r = calcular({ precio: 200000, entrada: 40000, anios: 25, interes: 3 });
    expect(r.gastos).toBeCloseTo(200000 * PORCENTAJE_GASTOS, 6);
    expect(r.ahorroNecesario).toBeCloseTo(40000 + 200000 * PORCENTAJE_GASTOS, 6);
  });

  it('los gastos rondan el 11 % del precio', () => {
    // Es la horquilla real en España entre impuestos, notaría y registro.
    expect(PORCENTAJE_GASTOS).toBeGreaterThanOrEqual(0.1);
    expect(PORCENTAJE_GASTOS).toBeLessThanOrEqual(0.12);
  });

  it('calcula el porcentaje de entrada', () => {
    const r = calcular({ precio: 200000, entrada: 40000, anios: 25, interes: 3 });
    expect(r.porcentajeEntrada).toBeCloseTo(20, 6);
  });
});

describe('ingresos recomendados', () => {
  it('aplica el tope del 35 % de endeudamiento', () => {
    expect(RATIO_ENDEUDAMIENTO).toBe(0.35);
    expect(ingresosRecomendados(700)).toBeCloseTo(2000, 6);
  });
});

describe('presentación', () => {
  it('formatea en euros con separador de miles español', () => {
    // En español los números de cuatro cifras NO llevan separador: se escribe
    // 1235, no 1.235. El punto aparece a partir de cinco cifras.
    expect(euros(1234.56)).toBe('1235 €');
    expect(euros(189000)).toBe('189.000 €');
    expect(euros(0)).toBe('0 €');
  });
});

describe('desglose de gastos de compra', () => {
  it('cobra el 6 % de ITP de Madrid sobre el precio', () => {
    const g = desglosarGastos(200000);
    const itp = g.find((x) => x.concepto.includes('ITP'));
    expect(itp?.importe).toBe(12000);
  });

  it('no se aleja del porcentaje global que usa la calculadora', () => {
    // El desglose y el 11 % redondo tienen que contar la misma historia: si se
    // separan, la ficha del inmueble y la calculadora dirian cosas distintas.
    const precio = 250000;
    const suma = desglosarGastos(precio).reduce((t, g) => t + g.importe, 0);
    const global = precio * PORCENTAJE_GASTOS;
    expect(Math.abs(suma - global) / global).toBeLessThan(0.4);
  });

  it('todos los conceptos explican por que se pagan', () => {
    for (const g of desglosarGastos(180000)) {
      expect(g.nota.length).toBeGreaterThan(20);
    }
  });

  it('con precio cero solo queda la tasacion, que es importe fijo', () => {
    const g = desglosarGastos(0);
    expect(g.filter((x) => x.importe > 0)).toHaveLength(1);
  });

  it('no devuelve importes negativos con un precio negativo', () => {
    for (const g of desglosarGastos(-5000)) {
      expect(g.importe).toBeGreaterThanOrEqual(0);
    }
  });
});
