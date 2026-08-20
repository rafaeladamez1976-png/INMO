/**
 * Visor de fotografías a pantalla completa.
 *
 * Se apoya en <dialog> nativo, así que el navegador ya pone la capa superior,
 * atrapa el tabulador dentro y cierra con Esc. Aquí solo queda lo propio del
 * visor: pasar fotos, acercarse y arrastrar.
 *
 * Las vecinas se precargan al llegar a una foto: pasar de imagen y ver un
 * hueco blanco es lo que hace que una galería parezca barata.
 */

let limpiar: (() => void) | null = null;

export function activarVisor(): void {
  limpiar?.();
  limpiar = null;

  const dialogo = document.querySelector<HTMLDialogElement>('[data-visor]');
  const galeria = document.querySelector<HTMLElement>('.galeria');
  if (!dialogo || !galeria) return;

  const foto = dialogo.querySelector<HTMLImageElement>('[data-visor-foto]');
  const escena = dialogo.querySelector<HTMLElement>('[data-visor-escena]');
  const cuenta = dialogo.querySelector<HTMLElement>('[data-visor-actual]');
  const tira = dialogo.querySelector<HTMLElement>('[data-visor-tira]');
  const datos = dialogo.querySelector<HTMLElement>('[data-visor-fuentes]');
  if (!foto || !escena || !cuenta || !tira || !datos) return;

  const fuentes: string[] = JSON.parse(datos.textContent ?? '[]');
  if (!fuentes.length) return;

  const minis = [...dialogo.querySelectorAll<HTMLButtonElement>('[data-visor-ir]')];

  let indice = 0;
  let cerca = false;
  let desplazadoX = 0;
  let desplazadoY = 0;

  /** Precarga la anterior y la siguiente, para que el paso sea instantáneo. */
  function precargar(i: number): void {
    for (const j of [i - 1, i + 1]) {
      const k = (j + fuentes.length) % fuentes.length;
      new Image().src = fuentes[k];
    }
  }

  function encuadrar(): void {
    foto!.style.transform = cerca
      ? `scale(2) translate(${desplazadoX}px, ${desplazadoY}px)`
      : 'scale(1)';
    if (cerca) foto!.dataset.cerca = '';
    else delete foto!.dataset.cerca;
  }

  function mostrar(i: number): void {
    indice = (i + fuentes.length) % fuentes.length;
    foto!.src = fuentes[indice];
    cuenta!.textContent = String(indice + 1);

    // Al cambiar de foto se vuelve al encuadre entero: seguir acercado sobre
    // una imagen distinta desorienta.
    cerca = false;
    desplazadoX = 0;
    desplazadoY = 0;
    encuadrar();

    minis.forEach((m, j) => {
      if (j === indice) m.setAttribute('aria-current', 'true');
      else m.removeAttribute('aria-current');
    });

    minis[indice]?.scrollIntoView({ block: 'nearest', inline: 'center' });
    precargar(indice);
  }

  function abrir(i: number): void {
    mostrar(i);
    if (!dialogo!.open) dialogo!.showModal();
  }

  const alTeclado = (e: KeyboardEvent) => {
    if (!dialogo.open) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      mostrar(indice + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      mostrar(indice - 1);
    }
  };

  /** Doble clic o doble toque: acerca sobre el punto señalado. */
  const alDoble = (e: MouseEvent) => {
    const caja = foto.getBoundingClientRect();
    cerca = !cerca;
    if (cerca) {
      // Se centra en lo que se ha señalado, no en el medio de la foto.
      desplazadoX = (caja.left + caja.width / 2 - e.clientX) / 2;
      desplazadoY = (caja.top + caja.height / 2 - e.clientY) / 2;
    } else {
      desplazadoX = 0;
      desplazadoY = 0;
    }
    encuadrar();
  };

  // Arrastre: con la foto acercada mueve el encuadre; de lo contrario pasa
  // de fotografía, que es el gesto que se espera en el móvil.
  let arrastrando = false;
  let inicioX = 0;
  let inicioY = 0;
  let baseX = 0;
  let baseY = 0;

  const alPulsar = (e: PointerEvent) => {
    arrastrando = true;
    inicioX = e.clientX;
    inicioY = e.clientY;
    baseX = desplazadoX;
    baseY = desplazadoY;
    escena.setPointerCapture(e.pointerId);
  };

  const alMover = (e: PointerEvent) => {
    if (!arrastrando || !cerca) return;
    desplazadoX = baseX + (e.clientX - inicioX) / 2;
    desplazadoY = baseY + (e.clientY - inicioY) / 2;
    foto.style.transition = 'none';
    encuadrar();
  };

  const alSoltar = (e: PointerEvent) => {
    if (!arrastrando) return;
    arrastrando = false;
    foto.style.transition = '';
    if (escena.hasPointerCapture(e.pointerId)) escena.releasePointerCapture(e.pointerId);

    if (cerca) return;
    const recorrido = e.clientX - inicioX;
    // 60 px: por debajo suele ser un toque con temblor, no un deslizamiento.
    if (Math.abs(recorrido) > 60) mostrar(indice + (recorrido < 0 ? 1 : -1));
  };

  const alAbrir = (e: Event) => {
    const boton = (e.target as HTMLElement).closest<HTMLElement>('[data-abrir-visor]');
    if (!boton) return;
    e.preventDefault();
    abrir(Number(boton.dataset.abrirVisor ?? 0));
  };

  const alPulsarDialogo = (e: Event) => {
    const destino = e.target as HTMLElement;
    if (destino.closest('[data-visor-cerrar]')) return dialogo.close();
    if (destino.closest('[data-visor-atras]')) return mostrar(indice - 1);
    if (destino.closest('[data-visor-adelante]')) return mostrar(indice + 1);
    const mini = destino.closest<HTMLElement>('[data-visor-ir]');
    if (mini) mostrar(Number(mini.dataset.visorIr ?? 0));
  };

  galeria.addEventListener('click', alAbrir);
  dialogo.addEventListener('click', alPulsarDialogo);
  document.addEventListener('keydown', alTeclado);
  foto.addEventListener('dblclick', alDoble);
  escena.addEventListener('pointerdown', alPulsar);
  escena.addEventListener('pointermove', alMover);
  escena.addEventListener('pointerup', alSoltar);
  escena.addEventListener('pointercancel', alSoltar);

  limpiar = () => {
    galeria.removeEventListener('click', alAbrir);
    dialogo.removeEventListener('click', alPulsarDialogo);
    document.removeEventListener('keydown', alTeclado);
    foto.removeEventListener('dblclick', alDoble);
    escena.removeEventListener('pointerdown', alPulsar);
    escena.removeEventListener('pointermove', alMover);
    escena.removeEventListener('pointerup', alSoltar);
    escena.removeEventListener('pointercancel', alSoltar);
    if (dialogo.open) dialogo.close();
  };
}
