/**
 * Favoritos.
 *
 * Quien busca casa compara diez y vuelve a tres. Sin favoritos tiene que
 * apuntarlos en el móvil o dejar diez pestañas abiertas; con favoritos vuelve
 * a la web, que es justo lo que interesa a la agencia.
 *
 * Se guardan en el navegador: no hay registro ni cuenta, y por tanto tampoco
 * hay datos personales que custodiar.
 */

const CLAVE = 'raiz:favoritos';

function leer(): Set<string> {
  try {
    const bruto = localStorage.getItem(CLAVE);
    return new Set(bruto ? (JSON.parse(bruto) as string[]) : []);
  } catch {
    // Navegación privada o almacenamiento bloqueado: se sigue sin guardar.
    return new Set();
  }
}

function guardar(favoritos: Set<string>): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify([...favoritos]));
  } catch {
    /* Sin almacenamiento, los favoritos duran lo que la pestaña. */
  }
}

export function iniciarFavoritos(): void {
  const botones = document.querySelectorAll<HTMLButtonElement>('[data-favorito]');
  const contadores = document.querySelectorAll<HTMLElement>('[data-favoritos-cuenta]');
  if (!botones.length && !contadores.length) return;

  let favoritos = leer();

  const pintarContador = () => {
    for (const contador of contadores) {
      contador.textContent = String(favoritos.size);
      contador.hidden = favoritos.size === 0;
    }
  };

  const pintarBoton = (boton: HTMLButtonElement) => {
    const id = boton.dataset.favorito!;
    const marcado = favoritos.has(id);
    boton.setAttribute('aria-pressed', String(marcado));
    boton.setAttribute(
      'aria-label',
      marcado ? 'Quitar de favoritos' : 'Guardar en favoritos',
    );
  };

  for (const boton of botones) {
    pintarBoton(boton);

    boton.addEventListener('click', (evento) => {
      // La ficha entera puede ser un enlace: no queremos navegar al marcar.
      evento.preventDefault();
      evento.stopPropagation();

      const id = boton.dataset.favorito!;
      if (favoritos.has(id)) favoritos.delete(id);
      else {
        favoritos.add(id);
        boton.classList.remove('favorito--late');
        // Reinicia la animación aunque se pulse dos veces seguidas.
        void boton.offsetWidth;
        boton.classList.add('favorito--late');
      }

      guardar(favoritos);
      pintarBoton(boton);
      pintarContador();
    });
  }

  // Otra pestaña abierta debe reflejar el mismo estado.
  window.addEventListener('storage', (evento) => {
    if (evento.key !== CLAVE) return;
    favoritos = leer();
    botones.forEach(pintarBoton);
    pintarContador();
  });

  pintarContador();
}
