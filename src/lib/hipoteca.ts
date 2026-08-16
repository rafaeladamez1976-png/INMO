/**
 * Cálculo de hipoteca.
 *
 * Módulo puro y probado. Los números que salen de aquí los va a usar alguien
 * para decidir si puede comprar una casa: no pueden estar mal.
 *
 * Se usa el sistema francés, que es el de prácticamente todas las hipotecas
 * en España: cuota constante, con más intereses al principio y más capital al
 * final.
 */

export interface Datos {
  /** Precio de la vivienda, en euros. */
  precio: number;
  /** Ahorro aportado, en euros. */
  entrada: number;
  /** Años de plazo. */
  anios: number;
  /** Interés nominal anual, en porcentaje. Ej.: 3.2 */
  interes: number;
}

export interface Resultado {
  /** Capital que se pide al banco. */
  capital: number;
  /** Cuota mensual. */
  cuota: number;
  /** Suma de todas las cuotas. */
  totalPagado: number;
  /** Intereses totales. */
  intereses: number;
  /** Porcentaje del precio que cubre la entrada. */
  porcentajeEntrada: number;
  /** Gastos aproximados de compra (impuestos, notaría, registro, gestoría). */
  gastos: number;
  /** Ahorro total necesario: entrada más gastos. */
  ahorroNecesario: number;
}

/**
 * Gastos de compraventa.
 *
 * Aproximación prudente del 11 % sobre el precio: en España suele moverse
 * entre el 10 % y el 12 % según comunidad y si la vivienda es nueva o usada.
 * Es una estimación, y la web lo dice.
 */
export const PORCENTAJE_GASTOS = 0.11;

export function calcular(datos: Datos): Resultado {
  const precio = Math.max(datos.precio, 0);
  const entrada = Math.min(Math.max(datos.entrada, 0), precio);
  const capital = precio - entrada;
  const meses = Math.max(Math.round(datos.anios * 12), 1);

  // Interés mensual a partir del nominal anual.
  const i = datos.interes / 100 / 12;

  // Con interés cero la cuota es el reparto simple; la fórmula general
  // dividiría entre cero.
  const cuota =
    i === 0 ? capital / meses : (capital * i) / (1 - Math.pow(1 + i, -meses));

  const totalPagado = cuota * meses;
  const gastos = precio * PORCENTAJE_GASTOS;

  return {
    capital,
    cuota,
    totalPagado,
    intereses: totalPagado - capital,
    porcentajeEntrada: precio > 0 ? (entrada / precio) * 100 : 0,
    gastos,
    ahorroNecesario: entrada + gastos,
  };
}

export interface Gasto {
  concepto: string;
  importe: number;
  /** Por qué se paga. Nadie sabe qué es una gestoría hasta que se lo explican. */
  nota: string;
}

/**
 * Desglose de los gastos de compra de vivienda usada en Madrid.
 *
 * El 11 % de PORCENTAJE_GASTOS es una cifra redonda que no dice nada. Quien va
 * a comprar necesita saber en qué se le va ese dinero, y ninguna inmobiliaria
 * pequeña se lo cuenta.
 *
 * Cifras para segunda mano en la Comunidad de Madrid. La obra nueva paga IVA
 * del 10 % más AJD en lugar de ITP, así que sale distinto.
 */
export const ITP_MADRID = 0.06;

export function desglosarGastos(precio: number): Gasto[] {
  const base = Math.max(precio, 0);

  return [
    {
      concepto: 'Impuesto de transmisiones (ITP)',
      importe: base * ITP_MADRID,
      nota: 'El 6 % en la Comunidad de Madrid para vivienda usada. Se paga en los 30 días hábiles siguientes a la firma.',
    },
    {
      concepto: 'Notaría',
      importe: base * 0.005,
      nota: 'La escritura pública. El arancel está fijado por ley y apenas varía entre notarios.',
    },
    {
      concepto: 'Registro de la propiedad',
      importe: base * 0.003,
      nota: 'Inscribir que la casa es tuya. Sin esto, para el Registro sigue siendo del vendedor.',
    },
    {
      concepto: 'Gestoría',
      importe: base * 0.0025,
      nota: 'Tramita impuestos y papeles. Es opcional si compras sin hipoteca; con hipoteca la impone el banco.',
    },
    {
      concepto: 'Tasación',
      importe: 350,
      nota: 'Solo si pides hipoteca. Desde 2019 la paga el banco en muchos casos: pregúntalo antes de adelantarla.',
    },
  ];
}

/**
 * Ingresos mensuales recomendados.
 *
 * Regla habitual de la banca: la cuota no debería pasar del 35 % de los
 * ingresos netos del hogar.
 */
export const RATIO_ENDEUDAMIENTO = 0.35;

export function ingresosRecomendados(cuota: number): number {
  return cuota / RATIO_ENDEUDAMIENTO;
}

/** 1234.56 → "1.235 €" */
export function euros(cantidad: number): string {
  return `${Math.round(cantidad).toLocaleString('es-ES')} €`;
}

/** 1234.56 → "1.234,56 €" */
export function eurosExactos(cantidad: number): string {
  return `${cantidad.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}
