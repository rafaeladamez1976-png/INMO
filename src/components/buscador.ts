/**
 * Filtrado en el navegador.
 *
 * Todos los inmuebles ya están en el HTML: se ocultan los que no encajan. Con
 * un catálogo de este tamaño es lo correcto — respuesta instantánea, sin
 * servidor, y el contenido sigue siendo visible para los buscadores.
 *
 * Los textos llegan por atributos desde la plantilla: este fichero corre en el
 * navegador y no ve el diccionario del servidor.
 */
export function iniciarBuscador(): void {
  const raiz = document.querySelector<HTMLElement>('[data-buscador]');
  if (!raiz) return;

  const ingles = raiz.dataset.idioma === 'en';
  const dice = {
    sinLimite: raiz.dataset.sinLimite ?? 'Sin límite',
    hasta: raiz.dataset.hasta ?? 'Hasta',
    ninguno: raiz.dataset.ninguno ?? 'Ningún inmueble',
    uno: raiz.dataset.uno ?? '1 inmueble',
    varios: raiz.dataset.varios ?? 'inmuebles',
  };

  const euros = (n: number) =>
    ingles
      ? `€${Math.round(n).toLocaleString('en-GB')}`
      : `${Math.round(n).toLocaleString('es-ES')} €`;

  const form = raiz.querySelector<HTMLFormElement>('[data-filtros]')!;
  const salidaPrecio = raiz.querySelector<HTMLElement>('[data-salida-precio]')!;
  const cuenta = raiz.querySelector<HTMLElement>('[data-cuenta]')!;
  const vacio = raiz.querySelector<HTMLElement>('[data-vacio]')!;
  const limpiar = raiz.querySelector<HTMLButtonElement>('[data-limpiar]')!;
  const huecos = [...raiz.querySelectorAll<HTMLElement>('[data-inmueble]')];

  const maximo = Number(raiz.dataset.maximo ?? 0);

  function filtrar(): void {
    const datos = new FormData(form);
    const tipo = String(datos.get('tipo') ?? '');
    const zona = String(datos.get('zona') ?? '');
    const habitaciones = Number(datos.get('habitaciones') ?? 0);
    const precio = Number(datos.get('precio') ?? maximo);

    salidaPrecio.textContent =
      precio >= maximo ? dice.sinLimite : `${dice.hasta} ${euros(precio)}`;

    let visibles = 0;

    for (const hueco of huecos) {
      const encaja =
        (!tipo || hueco.dataset.tipo === tipo) &&
        (!zona || hueco.dataset.zona === zona) &&
        (!habitaciones || Number(hueco.dataset.habitaciones) >= habitaciones) &&
        Number(hueco.dataset.precio) <= precio;

      hueco.hidden = !encaja;
      if (encaja) visibles++;
    }

    cuenta.textContent =
      visibles === 0 ? dice.ninguno : visibles === 1 ? dice.uno : `${visibles} ${dice.varios}`;

    vacio.hidden = visibles > 0;
  }

  form.addEventListener('input', filtrar);
  form.addEventListener('change', filtrar);

  limpiar.addEventListener('click', () => {
    form.reset();
    filtrar();
  });

  filtrar();
}
