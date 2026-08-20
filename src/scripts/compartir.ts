/**
 * Compartir un inmueble.
 *
 * En el móvil abre la hoja del sistema, que es de donde sale WhatsApp con los
 * contactos del visitante ya cargados. En escritorio casi ningún navegador la
 * tiene, así que se copia el enlace al portapapeles y se avisa.
 *
 * Quien enseña un piso a su pareja lo manda por WhatsApp, no copia la barra de
 * direcciones. Cada envío es una visita que la agencia no ha pagado.
 */

let quitar: (() => void) | null = null;

export function activarCompartir(): void {
  quitar?.();
  quitar = null;

  const boton = document.querySelector<HTMLButtonElement>('[data-compartir]');
  if (!boton) return;

  const titulo = boton.dataset.titulo ?? document.title;
  const texto = boton.dataset.texto ?? '';
  const dice = boton.dataset.copiado ?? 'Enlace copiado';

  async function avisar(): Promise<void> {
    const antes = boton!.getAttribute('aria-label');
    boton!.classList.add('acciones--hecho');
    boton!.setAttribute('aria-label', dice);
    // El aviso se anuncia solo una vez y se retira: dejarlo fijo haría que
    // el lector de pantalla lo repitiese en cada recorrido.
    window.setTimeout(() => {
      boton!.classList.remove('acciones--hecho');
      if (antes) boton!.setAttribute('aria-label', antes);
    }, 2200);
  }

  const alPulsar = async () => {
    const url = location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      } catch (error) {
        // Cancelar la hoja de compartir lanza AbortError: no es un fallo y no
        // debe acabar copiando el enlace sin que nadie lo haya pedido.
        if ((error as Error)?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${texto} ${url}`);
      await avisar();
    } catch {
      // Sin permiso de portapapeles (o sin HTTPS) queda el método de siempre.
      const campo = document.createElement('textarea');
      campo.value = `${texto} ${url}`;
      campo.setAttribute('readonly', '');
      campo.style.position = 'fixed';
      campo.style.opacity = '0';
      document.body.append(campo);
      campo.select();
      try {
        document.execCommand('copy');
        await avisar();
      } finally {
        campo.remove();
      }
    }
  };

  boton.addEventListener('click', alPulsar);
  quitar = () => boton.removeEventListener('click', alPulsar);
}
