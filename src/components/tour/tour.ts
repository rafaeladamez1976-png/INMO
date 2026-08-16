import * as THREE from 'three';

/**
 * Tour virtual 360.
 *
 * Una esfera con la panorámica pegada por dentro y la cámara en el centro:
 * arrastras y miras alrededor, como si estuvieras de pie en la habitación.
 * Los puntos dorados llevan de una estancia a otra.
 *
 * Es lo que más convierte en una web inmobiliaria: quien recorre una casa
 * entera desde el sofá llega a la visita con la decisión medio tomada.
 */

export interface Estancia {
  id: string;
  nombre: string;
  imagen: string;
  /** Puntos que llevan a otras estancias, colocados por ángulo. */
  saltos: Array<{ a: string; etiqueta: string; angulo: number; altura: number }>;
}

export interface Tour {
  irA(id: string): void;
  destruir(): void;
}

export function crearTour(
  lienzo: HTMLCanvasElement,
  estancias: Estancia[],
  alCambiar?: (id: string) => void,
): Tour {
  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(72, 1, 0.1, 1000);
  // La cámara va en el centro exacto de la esfera.
  camara.position.set(0, 0, 0.01);

  const render = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true });
  render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  render.toneMapping = THREE.ACESFilmicToneMapping;
  render.toneMappingExposure = 1.05;

  // Esfera del revés: la textura se ve desde dentro.
  const geometria = new THREE.SphereGeometry(50, 60, 40);
  geometria.scale(-1, 1, 1);

  const material = new THREE.MeshBasicMaterial();
  const esfera = new THREE.Mesh(geometria, material);
  escena.add(esfera);

  const cargador = new THREE.TextureLoader();
  const cache = new Map<string, THREE.Texture>();

  const marcadores = new THREE.Group();
  escena.add(marcadores);

  let actual = estancias[0];
  let girando = false;
  let ultimoX = 0;
  let ultimoY = 0;

  // Orientación de la cámara en coordenadas esféricas.
  let lon = 0;
  let lat = 0;
  let lonObjetivo = 0;
  let latObjetivo = 0;
  let automatico = true;

  const objetivo = new THREE.Vector3();
  const puntero = new THREE.Vector2();
  const rayo = new THREE.Raycaster();

  function pintarMarcadores(estancia: Estancia): void {
    marcadores.clear();

    for (const salto of estancia.saltos) {
      const grupo = new THREE.Group();

      const disco = new THREE.Mesh(
        new THREE.CircleGeometry(1.5, 28),
        new THREE.MeshBasicMaterial({
          color: 0xd8b984,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        }),
      );
      grupo.add(disco);

      const aro = new THREE.Mesh(
        new THREE.RingGeometry(1.8, 2.2, 28),
        new THREE.MeshBasicMaterial({
          color: 0xd8b984,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        }),
      );
      aro.name = 'aro';
      grupo.add(aro);

      // Se coloca sobre la esfera, mirando al centro.
      const radianes = (salto.angulo * Math.PI) / 180;
      const distancia = 22;
      grupo.position.set(
        Math.sin(radianes) * distancia,
        salto.altura,
        Math.cos(radianes) * distancia,
      );
      grupo.lookAt(0, 0, 0);

      grupo.userData.destino = salto.a;
      grupo.userData.etiqueta = salto.etiqueta;
      marcadores.add(grupo);
    }
  }

  function cargar(estancia: Estancia, alTerminar?: () => void): void {
    const puesta = cache.get(estancia.imagen);

    if (puesta) {
      material.map = puesta;
      material.needsUpdate = true;
      alTerminar?.();
      return;
    }

    cargador.load(estancia.imagen, (textura) => {
      textura.colorSpace = THREE.SRGBColorSpace;
      cache.set(estancia.imagen, textura);
      material.map = textura;
      material.needsUpdate = true;
      alTerminar?.();
    });
  }

  function irA(id: string): void {
    const destino = estancias.find((e) => e.id === id);
    if (!destino || destino.id === actual.id) return;

    lienzo.classList.add('tour--cambiando');

    cargar(destino, () => {
      actual = destino;
      pintarMarcadores(destino);
      lienzo.classList.remove('tour--cambiando');
      alCambiar?.(destino.id);
    });
  }

  // ---- Interacción ----

  function alPulsar(evento: PointerEvent): void {
    girando = true;
    automatico = false;
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
    lienzo.setPointerCapture(evento.pointerId);
  }

  function alMover(evento: PointerEvent): void {
    if (!girando) return;
    lonObjetivo -= (evento.clientX - ultimoX) * 0.16;
    latObjetivo = Math.max(-80, Math.min(80, latObjetivo + (evento.clientY - ultimoY) * 0.16));
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
  }

  function alSoltar(evento: PointerEvent): void {
    girando = false;
    if (lienzo.hasPointerCapture(evento.pointerId)) {
      lienzo.releasePointerCapture(evento.pointerId);
    }
  }

  /** Un clic corto sobre un punto dorado salta de estancia. */
  function alHacerClic(evento: PointerEvent): void {
    const caja = lienzo.getBoundingClientRect();
    puntero.x = ((evento.clientX - caja.left) / caja.width) * 2 - 1;
    puntero.y = -((evento.clientY - caja.top) / caja.height) * 2 + 1;

    rayo.setFromCamera(puntero, camara);
    const tocados = rayo.intersectObjects(marcadores.children, true);
    if (!tocados.length) return;

    let nodo: THREE.Object3D | null = tocados[0].object;
    while (nodo && !nodo.userData.destino) nodo = nodo.parent;
    if (nodo?.userData.destino) irA(nodo.userData.destino as string);
  }

  lienzo.addEventListener('pointerdown', alPulsar);
  lienzo.addEventListener('pointermove', alMover);
  lienzo.addEventListener('pointerup', alSoltar);
  lienzo.addEventListener('pointercancel', alSoltar);
  lienzo.addEventListener('click', alHacerClic);

  // ---- Bucle ----
  let visible = true;
  let animacion = 0;

  function dibujar(tiempo: number): void {
    animacion = requestAnimationFrame(dibujar);
    if (!visible) return;

    // Giro suave de bienvenida hasta que alguien toca: enseña que se puede
    // mirar alrededor sin necesidad de explicarlo.
    if (automatico) lonObjetivo += 0.045;

    lon += (lonObjetivo - lon) * 0.09;
    lat += (latObjetivo - lat) * 0.09;

    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    objetivo.set(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta),
    );
    camara.lookAt(objetivo);

    // Los puntos laten para que se vean sin buscarlos.
    const pulso = (Math.sin(tiempo * 0.0024) + 1) * 0.5;
    for (const marcador of marcadores.children) {
      const aro = marcador.getObjectByName('aro') as THREE.Mesh | undefined;
      if (aro) {
        aro.scale.setScalar(1 + pulso * 0.35);
        (aro.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - pulso);
      }
    }

    render.render(escena, camara);
  }

  function ajustar(): void {
    const ancho = lienzo.clientWidth;
    const alto = lienzo.clientHeight;
    if (!ancho || !alto) return;
    camara.aspect = ancho / alto;
    // En vertical se abre el angulo: si no, se ve un tunel.
    camara.fov = camara.aspect < 1 ? 88 : 72;
    camara.updateProjectionMatrix();
    render.setSize(ancho, alto, false);
  }

  const observador = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
    threshold: 0,
  });
  observador.observe(lienzo);

  window.addEventListener('resize', ajustar);

  cargar(actual, () => pintarMarcadores(actual));
  ajustar();
  animacion = requestAnimationFrame(dibujar);

  return {
    irA,
    destruir() {
      cancelAnimationFrame(animacion);
      observador.disconnect();
      window.removeEventListener('resize', ajustar);
      lienzo.removeEventListener('pointerdown', alPulsar);
      lienzo.removeEventListener('pointermove', alMover);
      lienzo.removeEventListener('pointerup', alSoltar);
      lienzo.removeEventListener('pointercancel', alSoltar);
      lienzo.removeEventListener('click', alHacerClic);

      cache.forEach((textura) => textura.dispose());
      cache.clear();
      geometria.dispose();
      material.dispose();
      render.dispose();
    },
  };
}
