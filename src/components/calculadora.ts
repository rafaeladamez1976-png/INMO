import { calcular, ingresosRecomendados, euros, eurosExactos } from '../lib/hipoteca';

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

  function actualizar(): void {
    const datos = new FormData(form);
    const precio = Number(datos.get('precio'));
    const entrada = Number(datos.get('entrada'));
    const anios = Number(datos.get('anios'));
    const interes = Number(datos.get('interes'));

    const r = calcular({ precio, entrada, anios, interes });

    salida('precio')!.textContent = euros(precio);
    salida('entrada')!.textContent = euros(entrada);
    salida('anios')!.textContent = `${anios} anos`.replace('anos', 'años');
    salida('interes')!.textContent = `${interes.toFixed(2).replace('.', ',')} %`;

    salida('cuota')!.textContent = eurosExactos(r.cuota);
    salida('capital')!.textContent = euros(r.capital);
    salida('intereses')!.textContent = euros(r.intereses);
    salida('gastos')!.textContent = euros(r.gastos);
    salida('ahorro')!.textContent = euros(r.ahorroNecesario);

    notaEntrada.textContent =
      precio > 0 ? `Cubre el ${Math.round(r.porcentajeEntrada)} % del precio` : '';

    // El aviso mas util es el que dice cuanto hay que ganar para que el banco
    // conceda: es la pregunta real detras de la cuota.
    if (r.capital === 0) {
      aviso.textContent = 'Con ese ahorro no necesitarias hipoteca.';
    } else if (r.porcentajeEntrada < 20) {
      aviso.textContent =
        `La mayoria de bancos financia hasta el 80 %. Con este ahorro te faltaria ` +
        `entrada: harian falta unos ${euros(precio * 0.2)}.`;
    } else {
      aviso.textContent =
        `Para que el banco lo apruebe conviene ingresar en casa unos ` +
        `${euros(ingresosRecomendados(r.cuota))} netos al mes.`;
    }
  }

  form.addEventListener('input', actualizar);
  actualizar();
}
