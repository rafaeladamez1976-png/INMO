import { calcular, ingresosRecomendados } from '../lib/hipoteca';

/**
 * Capa fina sobre el DOM de la calculadora.
 *
 * Las matematicas viven en lib/hipoteca.ts, cubiertas por tests contra valores
 * calculados a mano: son numeros con los que alguien decide si puede comprar
 * una casa.
 */
export function iniciarCalculadora(): void {
  const raiz = document.querySelector<HTMLElement>('[data-calc]');
  if (!raiz) return;

  const form = raiz.querySelector<HTMLFormElement>('form')!;
  const aviso = raiz.querySelector<HTMLElement>('[data-aviso]')!;
  const notaEntrada = raiz.querySelector<HTMLElement>('[data-nota-entrada]')!;

  const salida = (nombre: string) =>
    raiz.querySelector<HTMLElement>(`[data-salida="${nombre}"]`);

  /* Textos y formato por atributos: aquí no se ve el diccionario. */
  const d = raiz.dataset;
  const ingles = d.idioma === 'en';
  const dice = {
    anios: d.textoAnios ?? 'años',
    cubre: d.textoCubre ?? 'Cubre el {p} % del precio',
    sinHipoteca: d.textoSinHipoteca ?? 'Con ese ahorro no necesitarías hipoteca.',
    faltaEntrada: d.textoFaltaEntrada ?? '',
    ingresos: d.textoIngresos ?? '',
  };

  const euros = (n: number) =>
    ingles
      ? `€${Math.round(n).toLocaleString('en-GB')}`
      : `${Math.round(n).toLocaleString('es-ES')} €`;

  const eurosExactos = (n: number) =>
    ingles
      ? `€${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `${n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  function actualizar(): void {
    const datos = new FormData(form);
    const precio = Number(datos.get('precio'));
    const entrada = Number(datos.get('entrada'));
    const anios = Number(datos.get('anios'));
    const interes = Number(datos.get('interes'));

    const r = calcular({ precio, entrada, anios, interes });

    salida('precio')!.textContent = euros(precio);
    salida('entrada')!.textContent = euros(entrada);
    salida('anios')!.textContent = `${anios} ${dice.anios}`;
    salida('interes')!.textContent = ingles
      ? `${interes.toFixed(2)}%`
      : `${interes.toFixed(2).replace('.', ',')} %`;

    salida('cuota')!.textContent = eurosExactos(r.cuota);
    salida('capital')!.textContent = euros(r.capital);
    salida('intereses')!.textContent = euros(r.intereses);
    salida('gastos')!.textContent = euros(r.gastos);
    salida('ahorro')!.textContent = euros(r.ahorroNecesario);

    notaEntrada.textContent =
      precio > 0 ? dice.cubre.replace('{p}', String(Math.round(r.porcentajeEntrada))) : '';

    // El aviso mas util es el que dice cuanto hay que ganar para que el banco
    // conceda: es la pregunta real detras de la cuota.
    if (r.capital === 0) {
      aviso.textContent = dice.sinHipoteca;
    } else if (r.porcentajeEntrada < 20) {
      aviso.textContent = dice.faltaEntrada.replace('{c}', euros(precio * 0.2));
    } else {
      aviso.textContent = dice.ingresos.replace('{c}', euros(ingresosRecomendados(r.cuota)));
    }
  }

  form.addEventListener('input', actualizar);
  actualizar();
}
