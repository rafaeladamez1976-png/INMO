import { OFICINAS, EMPRESA, enlaceWhatsApp } from '../data/empresa';
import {
  ULTIMO_PASO,
  estadoInicial,
  pasoCompleto,
  redactarMensaje,
  progreso,
  type Estado,
} from './reglas-valoracion';

/**
 * Capa fina sobre el DOM. Las decisiones viven en reglas-valoracion.ts, que
 * está cubierto por tests; aquí solo se pinta y se escuchan eventos.
 */
export function iniciarValoracion(): void {
  const contenedor = document.querySelector<HTMLElement>('[data-valoracion]');
  if (!contenedor) return;
  const raiz: HTMLElement = contenedor;

  const form = raiz.querySelector<HTMLFormElement>('[data-form]')!;
  const etiquetaPaso = raiz.querySelector<HTMLElement>('[data-etiqueta-paso]')!;
  const barra = raiz.querySelector<HTMLElement>('[data-barra]')!;
  const salida = raiz.querySelector<HTMLElement>('[data-mensaje]')!;
  const botonEnviar = raiz.querySelector<HTMLAnchorElement>('[data-enviar]')!;
  const botonAtras = raiz.querySelector<HTMLButtonElement>('[data-atras]')!;
  const botonSiguiente = raiz.querySelector<HTMLButtonElement>('[data-siguiente]')!;
  const navegacion = raiz.querySelector<HTMLElement>('[data-navegacion]')!;

  /* Los textos llegan por atributos: aquí no se ve el diccionario. */
  const d = raiz.dataset;
  const dice = {
    paso: d.textoPaso ?? 'Paso {n} de {total}',
    yaEsta: d.textoYaEsta ?? 'Ya está',
    siguiente: d.textoSiguiente ?? 'Siguiente',
    verMensaje: d.textoVerMensaje ?? 'Ver el mensaje',
  };
  const frases = {
    saludo: d.fraseSaludo ?? 'Hola, quería pedir una valoración.',
    zona: d.fraseZona ?? 'Zona',
    habitaciones: d.fraseHabitaciones ?? 'habitaciones',
    aprox: d.fraseAprox ?? 'aprox.',
    soy: d.fraseSoy ?? 'Soy',
  };

  let estado: Estado = estadoInicial();

  /** El mensaje va a la oficina del barrio elegido, no a una centralita. */
  function telefonoDestino(): string {
    const oficina = OFICINAS.find((o) => o.id === estado.oficina);
    // El segundo número de cada oficina es el móvil: es el que tiene WhatsApp.
    return oficina?.telefonos[1] ?? EMPRESA.telefonoMovil;
  }

  function dibujar(): void {
    for (let paso = 1; paso <= ULTIMO_PASO; paso++) {
      const panel = raiz.querySelector<HTMLElement>(`[data-panel="${paso}"]`);
      if (panel) panel.hidden = paso !== estado.paso;
    }

    etiquetaPaso.textContent =
      estado.paso === ULTIMO_PASO
        ? dice.yaEsta
        : dice.paso
            .replace('{n}', String(estado.paso))
            .replace('{total}', String(ULTIMO_PASO - 1));

    barra.style.transform = `scaleX(${progreso(estado.paso)})`;

    botonAtras.hidden = estado.paso === 1;
    navegacion.hidden = estado.paso === ULTIMO_PASO;
    botonSiguiente.disabled = !pasoCompleto(estado, estado.paso);
    botonSiguiente.textContent =
      estado.paso === ULTIMO_PASO - 1 ? dice.verMensaje : dice.siguiente;

    if (estado.paso === ULTIMO_PASO) {
      const mensaje = redactarMensaje(estado, frases);
      salida.textContent = mensaje;
      botonEnviar.href = enlaceWhatsApp(telefonoDestino(), mensaje);
    }
  }

  function irA(paso: number): void {
    estado = { ...estado, paso: Math.min(Math.max(paso, 1), ULTIMO_PASO) };
    dibujar();
    raiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('change', (evento) => {
    const campo = evento.target as HTMLInputElement;

    switch (campo.name) {
      case 'tipo':
        estado = { ...estado, tipo: campo.value };
        break;
      case 'zona':
        estado = { ...estado, zona: campo.value, oficina: campo.dataset.oficina ?? '' };
        break;
      case 'habitaciones':
        estado = { ...estado, habitaciones: campo.value };
        break;
      case 'plazo':
        estado = { ...estado, plazo: campo.value };
        break;
    }

    dibujar();
  });

  form.addEventListener('input', (evento) => {
    const campo = evento.target as HTMLInputElement;
    if (campo.name === 'metros') estado = { ...estado, metros: campo.value };
    if (campo.name === 'nombre') estado = { ...estado, nombre: campo.value };
    dibujar();
  });

  botonSiguiente.addEventListener('click', () => {
    if (pasoCompleto(estado, estado.paso)) irA(estado.paso + 1);
  });

  botonAtras.addEventListener('click', () => irA(estado.paso - 1));

  dibujar();
}
