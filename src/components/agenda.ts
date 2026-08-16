import { EMPRESA, enlaceWhatsApp } from '../data/empresa';
import {
  diasDisponibles,
  huecosDe,
  diaCorto,
  citaCompleta,
  redactarCita,
  type Cita,
} from '../lib/citas';

/**
 * Capa fina sobre el DOM de la agenda.
 *
 * Las reglas de horario viven en lib/citas.ts, cubiertas por tests. Aquí solo
 * se pinta el calendario, se escuchan los cambios y se arma el enlace.
 */
export function iniciarAgenda(): void {
  const contenedor = document.querySelector<HTMLElement>('[data-agenda]');
  if (!contenedor) return;
  const raiz: HTMLElement = contenedor;

  const form = raiz.querySelector<HTMLFormElement>('[data-form]')!;
  const contenedorDias = raiz.querySelector<HTMLElement>('[data-dias]')!;
  const bloqueHoras = raiz.querySelector<HTMLElement>('[data-bloque-horas]')!;
  const contenedorHoras = raiz.querySelector<HTMLElement>('[data-horas]')!;
  const resumen = raiz.querySelector<HTMLElement>('[data-resumen]')!;
  const enviar = raiz.querySelector<HTMLAnchorElement>('[data-enviar]')!;

  const cita: Partial<Cita> = {};

  /* Los textos llegan por atributos: aquí no se ve el diccionario. */
  const d = raiz.dataset;
  const ingles = d.idioma === 'en';
  const frases = {
    saludo: d.fraseSaludo ?? 'Hola, quería reservar una cita.',
    motivo: d.fraseMotivo ?? 'Motivo',
    oficina: d.fraseOficina ?? 'Oficina',
    alas: d.fraseAlas ?? 'a las',
    soy: d.fraseSoy ?? 'Soy',
    ingles,
  };
  const piezas = {
    motivo: d.piezaMotivo ?? 'el motivo',
    oficina: d.piezaOficina ?? 'la oficina',
    dia: d.piezaDia ?? 'el día',
    hora: d.piezaHora ?? 'la hora',
    nombre: d.piezaNombre ?? 'tu nombre',
  };
  const plantillaFalta = d.textoFalta ?? 'Falta {cosas}.';

  function pintarDias(): void {
    const dias = diasDisponibles(new Date(), 21);
    contenedorDias.innerHTML = '';

    for (const iso of dias) {
      const { letra, numero, mes } = diaCorto(iso, ingles);

      const etiqueta = document.createElement('label');
      etiqueta.className = 'dia';
      etiqueta.innerHTML = `
        <input type="radio" name="fecha" value="${iso}">
        <span class="dia__cuerpo">
          <span class="dia__letra">${letra}</span>
          <span class="dia__numero">${numero}</span>
          <span class="dia__mes">${mes}</span>
        </span>`;
      contenedorDias.append(etiqueta);
    }
  }

  function pintarHoras(fechaISO: string): void {
    const huecos = huecosDe(fechaISO, new Date());
    contenedorHoras.innerHTML = '';
    bloqueHoras.hidden = huecos.length === 0;

    for (const hora of huecos) {
      const etiqueta = document.createElement('label');
      etiqueta.className = 'hora';
      etiqueta.innerHTML = `
        <input type="radio" name="hora" value="${hora}">
        <span>${hora}</span>`;
      contenedorHoras.append(etiqueta);
    }
  }

  function dibujar(): void {
    const listo = citaCompleta(cita);

    if (listo) {
      const mensaje = redactarCita(cita as Cita, frases);
      resumen.textContent = mensaje;
      resumen.dataset.listo = 'sí';
      enviar.href = enlaceWhatsApp(EMPRESA.whatsappCitas, mensaje);
      enviar.setAttribute('aria-disabled', 'false');
    } else {
      const faltan: string[] = [];
      if (!cita.motivo) faltan.push(piezas.motivo);
      if (!cita.oficina) faltan.push(piezas.oficina);
      if (!cita.fecha) faltan.push(piezas.dia);
      if (!cita.hora) faltan.push(piezas.hora);
      if (!cita.nombre?.trim()) faltan.push(piezas.nombre);

      resumen.textContent = plantillaFalta.replace('{cosas}', faltan.join(', '));
      delete resumen.dataset.listo;
      enviar.removeAttribute('href');
      enviar.setAttribute('aria-disabled', 'true');
    }
  }

  form.addEventListener('change', (evento) => {
    const campo = evento.target as HTMLInputElement;

    switch (campo.name) {
      case 'motivo':
        cita.motivo = campo.value;
        break;
      case 'oficina':
        cita.oficina = campo.value;
        break;
      case 'fecha':
        cita.fecha = campo.value;
        // Cambiar de día invalida la hora: las franjas del sábado no son las
        // del martes.
        delete cita.hora;
        pintarHoras(campo.value);
        break;
      case 'hora':
        cita.hora = campo.value;
        break;
    }

    dibujar();
  });

  form.addEventListener('input', (evento) => {
    const campo = evento.target as HTMLInputElement;
    if (campo.name === 'nombre') {
      cita.nombre = campo.value;
      dibujar();
    }
  });

  pintarDias();
  dibujar();
}
