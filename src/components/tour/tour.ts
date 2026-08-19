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
  // Sin tone mapping: las fotografías ya vienen reveladas de la cámara, y
  // pasarlas por ACES las lavaba y les restaba nitidez aparente.
  render.toneMapping = THREE.NoToneMapping;

  /*
   * Casquete esférico, no esfera entera.
   *
   * Las fotografías son tomas de gran angular, no equirectangulares de 360:
   * los bordes izquierdo y derecho no casan, y el suelo no se comprime hacia
   * el polo como haría una panorámica de verdad.
   *
   * Estirarlas sobre los 360 grados completos las ampliaba trece veces (con
   * 72 de campo visual solo se veía una quinta parte del ancho), y de ahí
   * venía el emborronado. Proyectadas sobre el arco que realmente abarcan,
   * cada píxel de la foto cae casi sobre un píxel de pantalla.
   */
  /** Arco horizontal que abarca la toma. */
  const ARCO_GRADOS = 124;
  /*
   * El alto sale de la proporción de la fotografía (2:1), no de un número
   * elegido a ojo: si no coincide, la habitación sale estirada o achatada.
   */
  const ALTO_GRADOS = ARCO_GRADOS / 2;

  const ARCO = THREE.MathUtils.degToRad(ARCO_GRADOS);
  const ALTO_ARCO = THREE.MathUtils.degToRad(ALTO_GRADOS);

  /*
   * phiStart = -ARCO/2 deja el casquete centrado justo donde mira la cámara
   * en reposo. Con la inversión de X de la línea siguiente, el centro del
   * arco cae sobre el eje +X, que es hacia donde apunta la cámara con
   * longitud 0. Con cualquier otro valor el arco queda a un lado y se ve el
   * vacío del fondo.
   */
  const geometria = new THREE.SphereGeometry(
    50,
    120,
    80,
    -ARCO / 2,
    ARCO,
    Math.PI / 2 - ALTO_ARCO / 2,
    ALTO_ARCO,
  );
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

  /*
   * Zoom. El tope es 1.7 y no más: acercarse recorta la parte de fotografía
   * que se reparte por la pantalla, y pasado ese punto vuelve a verse blanda.
   * Vale más un tour nítido que uno que permite acercarse a un borrón.
   */
  const ZOOM_MAX = 1.7;
  let fovBase = 54;
  let zoom = 1;
  /** Punteros activos, para distinguir arrastre (uno) de pellizco (dos). */
  const punteros = new Map<number, { x: number; y: number }>();
  let distanciaPellizco = 0;

  // Orientación de la cámara en coordenadas esféricas.
  let lon = 0;
  let lat = 0;
  let lonObjetivo = 0;
  let latObjetivo = 0;
  let automatico = true;
  /** Sentido del vaivén de bienvenida. */
  let sentido = 1;

  /**
   * En Three.js `fov` es el ángulo VERTICAL. El horizontal depende además de
   * la forma del lienzo, y es el que manda para saber cuánto se puede girar.
   */
  function fovHorizontal(): number {
    const mitad = THREE.MathUtils.degToRad(camara.fov) / 2;
    return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(mitad) * camara.aspect));
  }

  /**
   * Cuánto se puede girar sin que asome el borde de la fotografía: el arco
   * que ocupa, menos lo que ya abarca el propio campo visual.
   */
  function topeGiro(): number {
    return Math.max(0, ARCO_GRADOS / 2 - fovHorizontal() / 2);
  }

  function topeAlto(): number {
    return Math.max(0, ALTO_GRADOS / 2 - camara.fov / 2);
  }

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
          color: 0x8fa0e0,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        }),
      );
      grupo.add(disco);

      const aro = new THREE.Mesh(
        new THREE.RingGeometry(1.8, 2.2, 28),
        new THREE.MeshBasicMaterial({
          color: 0x8fa0e0,
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
      // Filtrado anisótropo al máximo: es lo que mantiene nítidos el suelo y
      // las paredes que se ven en escorzo, donde el filtrado normal emborrona.
      textura.anisotropy = render.capabilities.getMaxAnisotropy();
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

  function aplicarZoom(): void {
    // Nunca más ancho que el alto del arco: si no, se ve el borde de la foto.
    camara.fov = THREE.MathUtils.clamp(fovBase / zoom, 24, ALTO_GRADOS);
    camara.updateProjectionMatrix();
    // Al cambiar el encuadre cambia el margen de giro: hay que reencajarlo.
    const tope = topeGiro();
    lonObjetivo = THREE.MathUtils.clamp(lonObjetivo, -tope, tope);
    const topeY = topeAlto();
    latObjetivo = THREE.MathUtils.clamp(latObjetivo, -topeY, topeY);
  }

  function alPulsar(evento: PointerEvent): void {
    automatico = false;
    punteros.set(evento.pointerId, { x: evento.clientX, y: evento.clientY });
    lienzo.setPointerCapture(evento.pointerId);

    if (punteros.size === 2) {
      // Empieza un pellizco: el arrastre se pausa.
      girando = false;
      const [a, b] = [...punteros.values()];
      distanciaPellizco = Math.hypot(a.x - b.x, a.y - b.y);
      return;
    }

    girando = true;
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
  }

  function alMover(evento: PointerEvent): void {
    const punto = punteros.get(evento.pointerId);
    if (punto) {
      punto.x = evento.clientX;
      punto.y = evento.clientY;
    }

    // Pellizco: la separación entre dedos manda sobre el zoom.
    if (punteros.size === 2) {
      const [a, b] = [...punteros.values()];
      const distancia = Math.hypot(a.x - b.x, a.y - b.y);
      if (distanciaPellizco > 0) {
        zoom = THREE.MathUtils.clamp(zoom * (distancia / distanciaPellizco), 1, ZOOM_MAX);
        aplicarZoom();
      }
      distanciaPellizco = distancia;
      return;
    }

    if (!girando) return;
    // Con zoom, el giro se frena en proporción: si no, se va de las manos.
    const paso = 0.16 * (camara.fov / 72);
    const tope = topeGiro();
    lonObjetivo = THREE.MathUtils.clamp(
      lonObjetivo - (evento.clientX - ultimoX) * paso,
      -tope,
      tope,
    );
    const topeY = topeAlto();
    latObjetivo = THREE.MathUtils.clamp(
      latObjetivo + (evento.clientY - ultimoY) * paso,
      -topeY,
      topeY,
    );
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
  }

  function alSoltar(evento: PointerEvent): void {
    punteros.delete(evento.pointerId);
    if (punteros.size < 2) distanciaPellizco = 0;
    if (punteros.size === 0) girando = false;
    if (lienzo.hasPointerCapture(evento.pointerId)) {
      lienzo.releasePointerCapture(evento.pointerId);
    }
  }

  /** Rueda del ratón: acercarse a un detalle sin tocar nada más. */
  function alRodar(evento: WheelEvent): void {
    evento.preventDefault();
    automatico = false;
    zoom = THREE.MathUtils.clamp(zoom * (1 - evento.deltaY * 0.0012), 1, ZOOM_MAX);
    aplicarZoom();
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
  lienzo.addEventListener('wheel', alRodar, { passive: false });

  // ---- Bucle ----
  let visible = true;
  let animacion = 0;

  function dibujar(tiempo: number): void {
    animacion = requestAnimationFrame(dibujar);
    if (!visible) return;

    // Vaivén suave de bienvenida hasta que alguien toca: enseña que se puede
    // mirar alrededor sin necesidad de explicarlo. Al llegar al borde de la
    // fotografía se da la vuelta en lugar de seguir y descubrirlo.
    if (automatico) {
      const tope = topeGiro();
      lonObjetivo += 0.038 * sentido;
      if (lonObjetivo >= tope) {
        lonObjetivo = tope;
        sentido = -1;
      } else if (lonObjetivo <= -tope) {
        lonObjetivo = -tope;
        sentido = 1;
      }
    }

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
    /*
     * El encuadre no puede pasarse del alto del arco o asomaría el borde de
     * la fotografía. Se deja un margen para poder mirar algo arriba y abajo.
     */
    fovBase = Math.min(54, ALTO_GRADOS - 6);
    aplicarZoom();
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
      lienzo.removeEventListener('wheel', alRodar);

      cache.forEach((textura) => textura.dispose());
      cache.clear();
      geometria.dispose();
      material.dispose();
      render.dispose();
    },
  };
}
