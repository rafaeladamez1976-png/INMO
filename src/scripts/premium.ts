/**
 * Micro-interacciones de acabado.
 *
 * Son los detalles que separan una web correcta de una que se recuerda. Todas
 * son de coste bajo, se desactivan con "reducir movimiento" y solo se activan
 * con ratón cuando seguir un puntero es lo que les da sentido.
 */

const quieto = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const conRaton = (): boolean => window.matchMedia('(pointer: fine)').matches;

const limpiezas: Array<() => void> = [];

function desmontar(): void {
  while (limpiezas.length) limpiezas.pop()!();
}

/**
 * Botones magnéticos: el botón se inclina levemente hacia el cursor cuando
 * este se acerca. Da la sensación de que responde antes de pulsarlo.
 */
function activarMagneticos(): void {
  if (quieto() || !conRaton()) return;

  const botones = document.querySelectorAll<HTMLElement>('.boton--laton');
  if (!botones.length) return;

  for (const boton of botones) {
    const mover = (evento: PointerEvent) => {
      const caja = boton.getBoundingClientRect();
      const x = evento.clientX - caja.left - caja.width / 2;
      const y = evento.clientY - caja.top - caja.height / 2;
      // Muy poco recorrido: si se mueve mucho, cuesta acertar a pulsarlo.
      boton.style.transform = `translate(${x * 0.14}px, ${y * 0.2}px)`;
    };

    const soltar = () => {
      boton.style.transform = '';
    };

    boton.addEventListener('pointermove', mover);
    boton.addEventListener('pointerleave', soltar);

    limpiezas.push(() => {
      boton.removeEventListener('pointermove', mover);
      boton.removeEventListener('pointerleave', soltar);
      soltar();
    });
  }
}

/**
 * La cabecera se compacta al bajar.
 *
 * Devuelve altura de pantalla en cuanto el visitante empieza a leer, que es
 * cuando el menú ya ha cumplido su función de orientar.
 */
function activarCabeceraCompacta(): void {
  const cabecera = document.querySelector<HTMLElement>('.cabecera');
  if (!cabecera) return;

  let pendiente = false;

  const mirar = () => {
    pendiente = false;
    cabecera.classList.toggle('cabecera--compacta', window.scrollY > 140);
  };

  const alHacerScroll = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(mirar);
  };

  window.addEventListener('scroll', alHacerScroll, { passive: true });
  limpiezas.push(() => window.removeEventListener('scroll', alHacerScroll));
  mirar();
}

/**
 * Las fotografías se descubren con una cortina en vez de aparecer de golpe.
 *
 * Es el gesto que más "producción" aporta por menos código: la imagen se
 * revela de abajo arriba mientras se acerca ligeramente.
 */
function activarCortinas(): void {
  const fotos = document.querySelectorAll<HTMLElement>('.ficha__foto, .oficina__foto');
  if (!fotos.length) return;

  if (quieto() || !('IntersectionObserver' in window)) {
    fotos.forEach((f) => f.classList.add('descubierta'));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add('descubierta');
        observador.unobserve(entrada.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  fotos.forEach((f) => observador.observe(f));
  limpiezas.push(() => observador.disconnect());
}

/**
 * Los titulares grandes entran línea a línea al llegar a ellos.
 */
function activarTitulares(): void {
  const titulares = document.querySelectorAll<HTMLElement>('[data-titular]');
  if (!titulares.length) return;

  if (quieto() || !('IntersectionObserver' in window)) {
    titulares.forEach((t) => t.classList.add('entrado'));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add('entrado');
        observador.unobserve(entrada.target);
      }
    },
    { threshold: 0.3 },
  );

  titulares.forEach((t) => observador.observe(t));
  limpiezas.push(() => observador.disconnect());
}

export function activarPremium(): void {
  desmontar();
  activarMagneticos();
  activarCabeceraCompacta();
  activarCortinas();
  activarTitulares();
}
