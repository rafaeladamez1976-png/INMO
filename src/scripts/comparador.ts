/**
 * Comparador de inmuebles guardados.
 *
 * Las columnas están todas en el HTML y aquí solo se decide cuáles se enseñan,
 * igual que en favoritos: sin servidor, sin cuenta y sin datos personales.
 *
 * Marcar el mejor dato de cada fila es lo que convierte una tabla en una
 * decisión. Se marca solo cuando hay un ganador único: si dos empatan, señalar
 * a los dos no ayuda a nadie.
 */

const CLAVE = 'raiz:favoritos';

/** Filas donde el mejor valor es el más bajo. El resto, el más alto. */
const MENOR_ES_MEJOR = new Set(['precio', 'metro-util']);

function leer(): string[] {
  try {
    const bruto = localStorage.getItem(CLAVE);
    return bruto ? (JSON.parse(bruto) as string[]) : [];
  } catch {
    return [];
  }
}

export function activarComparador(): void {
  const raiz = document.querySelector<HTMLElement>('[data-comparador]');
  if (!raiz) return;

  const vacio = raiz.querySelector<HTMLElement>('[data-vacio]');
  const uno = raiz.querySelector<HTMLElement>('[data-uno]');
  const tabla = raiz.querySelector<HTMLElement>('[data-tabla]');
  const columnas = [...raiz.querySelectorAll<HTMLElement>('[data-columna]')];
  if (!vacio || !uno || !tabla) return;

  const dice = raiz.dataset.textoMejor ?? '';

  function pintar(): void {
    const guardados = new Set(leer());
    const visibles: HTMLElement[] = [];

    for (const columna of columnas) {
      const dentro = guardados.has(columna.dataset.columna ?? '');
      columna.hidden = !dentro;
      if (dentro) visibles.push(columna);
    }

    vacio!.hidden = visibles.length !== 0;
    uno!.hidden = visibles.length !== 1;
    tabla!.hidden = visibles.length < 2;

    marcarMejores(visibles);
  }

  function marcarMejores(visibles: HTMLElement[]): void {
    // Se limpia siempre: al quitar una columna, la que ganaba puede dejar
    // de ganar y el resalte se quedaría pegado a la anterior.
    for (const columna of columnas) {
      for (const dato of columna.querySelectorAll('.dato--mejor')) {
        dato.classList.remove('dato--mejor');
        dato.removeAttribute('title');
      }
    }

    if (visibles.length < 2) return;

    const campos = ['precio', 'metros', 'metro-util', 'habitaciones', 'banos'];

    for (const campo of campos) {
      const menorMejor = MENOR_ES_MEJOR.has(campo);
      const propiedad = campo.replace(/-(.)/g, (_, c: string) => c.toUpperCase());

      const valores = visibles
        .map((columna) => ({ columna, valor: Number(columna.dataset[propiedad] ?? 0) }))
        // Un cero aquí significa "no consta", no "el más barato".
        .filter((v) => v.valor > 0);

      if (valores.length < 2) continue;

      const mejor = valores.reduce((a, b) =>
        menorMejor ? (b.valor < a.valor ? b : a) : b.valor > a.valor ? b : a,
      );

      // Empate: no se marca nada. Señalar a dos "mejores" no decide nada.
      const empatados = valores.filter((v) => v.valor === mejor.valor);
      if (empatados.length > 1) continue;

      const celda = mejor.columna.querySelector<HTMLElement>(`[data-dato="${campo}"]`);
      if (celda) {
        celda.classList.add('dato--mejor');
        if (dice) celda.title = dice;
      }
    }
  }

  pintar();

  /*
   * Los botones de quitar son los mismos de favoritos, así que al pulsarlos ya
   * se actualiza el almacenamiento. Aquí solo hay que volver a pintar después,
   * y por eso se espera un turno: si no, se leería el valor de antes.
   */
  raiz.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-favorito]')) {
      window.setTimeout(pintar, 0);
    }
  });

  // Si se guarda algo en otra pestaña, esta se entera.
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE) pintar();
  });
}
