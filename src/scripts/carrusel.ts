/**
 * Carrusel de las tarjetas del listado.
 *
 * El deslizamiento lo hace el navegador con anclaje nativo. Aquí solo van las
 * flechas y los puntos, que es lo que el CSS no puede saber.
 *
 * Se escucha el desplazamiento en lugar de llevar la cuenta a mano: así los
 * puntos siguen siendo correctos cuando alguien desliza con el dedo, arrastra
 * la barra o llega con el tabulador.
 */

let observador: IntersectionObserver | null = null;
const limpiadores: Array<() => void> = [];

function desmontar(): void {
  observador?.disconnect();
  observador = null;
  while (limpiadores.length) limpiadores.pop()!();
}

function montarUno(pista: HTMLElement): void {
  const tarjeta = pista.closest('.ficha');
  if (!tarjeta) return;

  const puntos = [...tarjeta.querySelectorAll<HTMLElement>('.ficha__punto')];
  const atras = tarjeta.querySelector<HTMLButtonElement>('[data-carrusel-atras]');
  const adelante = tarjeta.querySelector<HTMLButtonElement>('[data-carrusel-adelante]');
  const total = pista.children.length;
  if (total < 2) return;

  const indice = () => Math.round(pista.scrollLeft / pista.clientWidth);

  function pintar(): void {
    const i = indice();
    puntos.forEach((p, j) => p.classList.toggle('ficha__punto--activo', j === i));
    // Con una sola foto a la vista no hay a dónde ir: se desactiva el botón
    // en lugar de dejarlo pulsable sin efecto.
    if (atras) atras.disabled = i <= 0;
    if (adelante) adelante.disabled = i >= total - 1;
  }

  function ir(paso: number): void {
    pista.scrollBy({ left: paso * pista.clientWidth, behavior: 'smooth' });
  }

  /*
   * Las flechas viven dentro del área que enlaza a la ficha: sin frenar el
   * evento, pasar fotos abriría el inmueble.
   */
  const alPulsar = (e: Event, paso: number) => {
    e.preventDefault();
    e.stopPropagation();
    ir(paso);
  };

  const atrasCb = (e: Event) => alPulsar(e, -1);
  const adelanteCb = (e: Event) => alPulsar(e, 1);

  let esperando = false;
  const alDesplazar = () => {
    if (esperando) return;
    esperando = true;
    requestAnimationFrame(() => {
      esperando = false;
      pintar();
    });
  };

  atras?.addEventListener('click', atrasCb);
  adelante?.addEventListener('click', adelanteCb);
  pista.addEventListener('scroll', alDesplazar, { passive: true });

  limpiadores.push(() => {
    atras?.removeEventListener('click', atrasCb);
    adelante?.removeEventListener('click', adelanteCb);
    pista.removeEventListener('scroll', alDesplazar);
  });

  pintar();
}

export function activarCarruseles(): void {
  desmontar();

  const pistas = document.querySelectorAll<HTMLElement>('[data-carrusel]');
  if (!pistas.length) return;

  /*
   * Se arma solo cuando la tarjeta se acerca a la pantalla. Un listado de doce
   * inmuebles son doce carruseles, y armarlos todos de golpe alarga el arranque
   * sin que nadie los esté mirando.
   */
  observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        observador?.unobserve(entrada.target);
        montarUno(entrada.target as HTMLElement);
      }
    },
    { rootMargin: '300px' },
  );

  for (const pista of pistas) observador.observe(pista);
}
