/**
 * Revelado al entrar en pantalla y cuentas ascendentes.
 *
 * Se vuelve a armar en cada navegación, porque con transiciones de vista el
 * documento no se recarga. Por eso los observadores anteriores se desmontan
 * antes de crear los nuevos.
 */

let observadores: IntersectionObserver[] = [];
let limpiezas: Array<() => void> = [];

const sinMovimiento = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function desmontar(): void {
  observadores.forEach((o) => o.disconnect());
  observadores = [];
  limpiezas.forEach((limpiar) => limpiar());
  limpiezas = [];
}

function activarRevelado(): void {
  const elementos = document.querySelectorAll<HTMLElement>('[data-revelar]');
  if (!elementos.length) return;

  if (sinMovimiento() || !('IntersectionObserver' in window)) {
    elementos.forEach((e) => e.classList.add('revelado'));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;

        const elemento = entrada.target as HTMLElement;
        const retraso = Number(elemento.dataset.revelarRetraso ?? 0);
        window.setTimeout(() => elemento.classList.add('revelado'), retraso);

        observador.unobserve(elemento);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  elementos.forEach((e) => observador.observe(e));
  observadores.push(observador);
}

function activarCuentas(): void {
  const cifras = document.querySelectorAll<HTMLElement>('[data-cuenta]');
  if (!cifras.length || sinMovimiento() || !('IntersectionObserver' in window)) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;

        const cifra = entrada.target as HTMLElement;
        const destino = Number(cifra.dataset.cuenta ?? 0);
        observador.unobserve(cifra);

        // Ancho fijo mientras cuenta, para que lo de al lado no salte.
        cifra.style.minWidth = `${cifra.offsetWidth}px`;
        cifra.style.display = 'inline-block';

        let inicio = 0;
        const paso = (ahora: number) => {
          if (!inicio) inicio = ahora;
          const t = Math.min((ahora - inicio) / 1100, 1);
          cifra.textContent = String(Math.round(destino * (1 - (1 - t) ** 3)));
          if (t < 1) requestAnimationFrame(paso);
        };

        requestAnimationFrame(paso);
      }
    },
    { threshold: 0.5 },
  );

  cifras.forEach((c) => observador.observe(c));
  observadores.push(observador);
}

/**
 * Entrada escalonada del texto del héroe.
 *
 * Va aparte del revelado por scroll porque no espera a que el elemento entre
 * en pantalla: arranca al cargar, que es cuando se juega la primera impresión.
 */
function activarEntrada(): void {
  const elementos = document.querySelectorAll<HTMLElement>('[data-entrada]');
  if (!elementos.length) return;

  if (sinMovimiento()) {
    elementos.forEach((e) => e.classList.add('entrado'));
    return;
  }

  for (const elemento of elementos) {
    const retraso = Number(elemento.dataset.entradaRetraso ?? 0);
    window.setTimeout(() => elemento.classList.add('entrado'), 120 + retraso);
  }
}

/**
 * Paralaje del héroe: la fotografía se mueve más despacio que la página.
 *
 * Es lo que da sensación de profundidad al hacer scroll. Solo con ratón: en
 * táctil cuesta fluidez y se nota más la pérdida que el efecto.
 */
function activarParalajeHeroe(): void {
  const foto = document.querySelector<HTMLElement>('[data-heroe-foto]');
  if (!foto || sinMovimiento()) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let pendiente = false;

  const colocar = () => {
    pendiente = false;
    const avance = Math.min(window.scrollY / window.innerHeight, 1.2);
    foto.style.transform = `translate3d(0, ${avance * 12}%, 0)`;
  };

  const alHacerScroll = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(colocar);
  };

  window.addEventListener('scroll', alHacerScroll, { passive: true });
  limpiezas.push(() => window.removeEventListener('scroll', alHacerScroll));
  colocar();
}

/** Barra de avance de lectura, arriba del todo. */
function activarAvance(): void {
  const barra = document.querySelector<HTMLElement>('[data-avance]');
  if (!barra || sinMovimiento()) return;

  let pendiente = false;

  const colocar = () => {
    pendiente = false;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.transform = `scaleX(${alto > 0 ? Math.min(window.scrollY / alto, 1) : 0})`;
  };

  const alHacerScroll = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(colocar);
  };

  window.addEventListener('scroll', alHacerScroll, { passive: true });
  limpiezas.push(() => window.removeEventListener('scroll', alHacerScroll));
  colocar();
}

export function activarAnimaciones(): void {
  desmontar();
  void import('../components/favoritos').then((m) => m.iniciarFavoritos());
  activarEntrada();
  activarRevelado();
  activarCuentas();
  activarParalajeHeroe();
  activarAvance();
}
