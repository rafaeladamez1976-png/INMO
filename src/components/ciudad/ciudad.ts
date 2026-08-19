import * as THREE from 'three';
import { OFICINAS } from '../../data/empresa';

/**
 * La ciudad en 3D.
 *
 * Una inmobiliaria no vende metros cuadrados, vende barrios. Por eso la
 * portada es una manzana de Madrid que se levanta sola y sobre la que están
 * marcadas las cuatro oficinas: el negocio, dibujado.
 *
 * Todo procedural: cajas, ventanas emisivas y un plano. Cero modelos externos.
 */

export type Nivel = 'alta' | 'media' | 'baja';

const DETALLE = {
  alta: { edificios: 74, ventanas: true, sombras: true, pixeles: 2, arboles: 26 },
  media: { edificios: 52, ventanas: true, sombras: true, pixeles: 1.75, arboles: 16 },
  baja: { edificios: 30, ventanas: false, sombras: false, pixeles: 1.5, arboles: 8 },
} as const;

export interface Ciudad {
  destruir(): void;
}

/** Ruido determinista: la misma ciudad en cada carga. */
function azar(semilla: number): number {
  const x = Math.sin(semilla * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function crearCiudad(lienzo: HTMLCanvasElement, nivel: Nivel = 'alta'): Ciudad {
  const d = DETALLE[nivel];

  const escena = new THREE.Scene();
  escena.fog = new THREE.Fog(0x101830, 16, 42);

  const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 90);

  const render = new THREE.WebGLRenderer({
    canvas: lienzo,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  render.setPixelRatio(Math.min(window.devicePixelRatio, d.pixeles));
  render.shadowMap.enabled = d.sombras;
  render.shadowMap.type = THREE.PCFSoftShadowMap;
  render.toneMapping = THREE.ACESFilmicToneMapping;
  render.toneMappingExposure = 1.15;

  // ---- Luz de atardecer: es la hora a la que se enseñan los pisos ----
  escena.add(new THREE.HemisphereLight(0xf0d8b0, 0x2a2f38, 1.1));

  const sol = new THREE.DirectionalLight(0xffd9a0, 2.4);
  sol.position.set(8, 12, 6);
  sol.castShadow = d.sombras;
  if (d.sombras) {
    sol.shadow.mapSize.set(nivel === 'alta' ? 1024 : 512, nivel === 'alta' ? 1024 : 512);
    sol.shadow.camera.near = 1;
    sol.shadow.camera.far = 45;
    const lado = 14;
    sol.shadow.camera.left = -lado;
    sol.shadow.camera.right = lado;
    sol.shadow.camera.top = lado;
    sol.shadow.camera.bottom = -lado;
    sol.shadow.bias = -0.0015;
  }
  escena.add(sol);

  const contra = new THREE.DirectionalLight(0x8fa8d8, 0.9);
  contra.position.set(-7, 4, -8);
  escena.add(contra);

  // ---- La manzana ----
  const ciudad = new THREE.Group();
  escena.add(ciudad);

  const suelo = new THREE.Mesh(
    new THREE.BoxGeometry(22, 0.6, 22),
    new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.95 }),
  );
  suelo.position.y = -0.3;
  suelo.receiveShadow = d.sombras;
  ciudad.add(suelo);

  // Calles: dos avenidas cruzando la manzana.
  const asfalto = new THREE.MeshStandardMaterial({ color: 0x1b1f26, roughness: 1 });
  for (const giro of [0, Math.PI / 2]) {
    const calle = new THREE.Mesh(new THREE.BoxGeometry(22, 0.05, 2.6), asfalto);
    calle.position.y = 0.02;
    calle.rotation.y = giro;
    ciudad.add(calle);
  }

  const materialesEdificio = [
    new THREE.MeshStandardMaterial({ color: 0xd8cfc0, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xc0b4a2, roughness: 0.88 }),
    new THREE.MeshStandardMaterial({ color: 0xa8998a, roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: 0x8f8577, roughness: 0.9 }),
  ];

  const materialVentana = new THREE.MeshStandardMaterial({
    color: 0xffd9a0,
    emissive: 0xffb347,
    emissiveIntensity: 1.4,
    roughness: 0.4,
  });

  const edificios: THREE.Mesh[] = [];
  const ventanas: THREE.InstancedMesh[] = [];

  const cajaEdificio = new THREE.BoxGeometry(1, 1, 1);
  const cajaVentana = new THREE.BoxGeometry(0.11, 0.16, 0.03);

  let colocados = 0;
  for (let i = 0; colocados < d.edificios && i < 400; i++) {
    const x = (azar(i * 3.1) - 0.5) * 19;
    const z = (azar(i * 7.7) - 0.5) * 19;

    // Las calles quedan libres.
    if (Math.abs(x) < 1.9 || Math.abs(z) < 1.9) continue;

    const ancho = 0.9 + azar(i * 11.3) * 1.1;
    const fondo = 0.9 + azar(i * 13.9) * 1.1;
    // Más altos hacia el centro: da silueta de ciudad.
    const cerca = 1 - Math.min(Math.hypot(x, z) / 12, 1);
    const alto = 0.9 + azar(i * 17.1) * 3.2 + cerca * 2.6;

    const edificio = new THREE.Mesh(
      cajaEdificio,
      materialesEdificio[Math.floor(azar(i * 19.3) * materialesEdificio.length)],
    );
    edificio.scale.set(ancho, alto, fondo);
    edificio.position.set(x, alto / 2, z);
    edificio.castShadow = d.sombras;
    edificio.receiveShadow = d.sombras;
    edificio.userData.alto = alto;
    edificio.userData.orden = colocados;
    ciudad.add(edificio);
    edificios.push(edificio);

    // Ventanas encendidas en las dos caras que dan a la cámara.
    if (d.ventanas) {
      const filas = Math.max(1, Math.floor(alto / 0.55));
      const columnas = Math.max(1, Math.floor(ancho / 0.35));
      const total = filas * columnas;

      const conjunto = new THREE.InstancedMesh(cajaVentana, materialVentana, total);
      const matriz = new THREE.Matrix4();
      let puestas = 0;

      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
          // Solo se enciende parte: un edificio con todas las luces es un decorado.
          if (azar(i * 100 + f * 10 + c) > 0.55) continue;

          matriz.makeTranslation(
            x - ancho / 2 + 0.2 + c * 0.35,
            0.4 + f * 0.55,
            z + fondo / 2 + 0.02,
          );
          conjunto.setMatrixAt(puestas++, matriz);
        }
      }

      conjunto.count = puestas;
      conjunto.instanceMatrix.needsUpdate = true;
      conjunto.userData.orden = colocados;
      ciudad.add(conjunto);
      ventanas.push(conjunto);
    }

    colocados++;
  }

  // ---- Arbolado ----
  const materialCopa = new THREE.MeshStandardMaterial({ color: 0x4a5c3a, roughness: 1 });
  const materialTronco = new THREE.MeshStandardMaterial({ color: 0x4a3c2c, roughness: 1 });

  for (let i = 0; i < d.arboles; i++) {
    const lado = i % 2 === 0 ? 1 : -1;
    const largo = (azar(i * 23.7) - 0.5) * 18;
    const enCalleX = i % 4 < 2;

    const arbol = new THREE.Group();
    const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.4, 5), materialTronco);
    tronco.position.y = 0.2;
    arbol.add(tronco);

    const copa = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 0), materialCopa);
    copa.position.y = 0.52;
    copa.castShadow = d.sombras;
    arbol.add(copa);

    arbol.position.set(enCalleX ? largo : lado * 1.6, 0, enCalleX ? lado * 1.6 : largo);
    ciudad.add(arbol);
  }

  // ---- Marcadores de las cuatro oficinas ----
  const marcadores: THREE.Group[] = [];
  const materialMarcador = new THREE.MeshBasicMaterial({ color: 0x5a6fc8 });
  const materialHalo = new THREE.MeshBasicMaterial({
    color: 0x8fa0e0,
    transparent: true,
    opacity: 0.28,
  });

  for (const [i, oficina] of OFICINAS.entries()) {
    const marcador = new THREE.Group();

    const aguja = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 2.6, 6),
      materialMarcador,
    );
    aguja.position.y = 1.3;
    marcador.add(aguja);

    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 12), materialMarcador);
    bola.position.y = 2.7;
    marcador.add(bola);

    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 10), materialHalo);
    halo.position.y = 2.7;
    halo.name = 'halo';
    marcador.add(halo);

    const anillo = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.52, 28),
      new THREE.MeshBasicMaterial({
        color: 0x5a6fc8,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      }),
    );
    anillo.rotation.x = -Math.PI / 2;
    anillo.position.y = 0.08;
    anillo.name = 'anillo';
    marcador.add(anillo);

    marcador.position.set(oficina.mapa.x * 1.7, 0, oficina.mapa.z * 1.7);
    marcador.userData.fase = i * 1.4;
    ciudad.add(marcador);
    marcadores.push(marcador);
  }

  // ---- Recorrido de cámara ----
  interface Parada {
    mira: THREE.Vector3;
    direccion: THREE.Vector3;
    ancho: number;
  }

  const PARADAS: Parada[] = [
    { mira: new THREE.Vector3(0, 1.4, 0), direccion: new THREE.Vector3(0.5, 0.55, 1), ancho: 26 },
    { mira: new THREE.Vector3(-1.5, 1.2, 0), direccion: new THREE.Vector3(-0.6, 0.4, 1), ancho: 19 },
    { mira: new THREE.Vector3(1.2, 1.8, 0.5), direccion: new THREE.Vector3(0.7, 0.3, 0.9), ancho: 14 },
    { mira: new THREE.Vector3(0, 2.2, 0), direccion: new THREE.Vector3(0, 0.85, 1), ancho: 24 },
  ];

  function encuadre(aspecto: number) {
    if (aspecto < 0.95) return { fov: 52, ancho: 0.78 };
    if (aspecto < 1.45) return { fov: 45, ancho: 0.92 };
    return { fov: 38, ancho: 1 };
  }

  let ajuste = encuadre(16 / 9);

  function distanciaPara(ancho: number): number {
    const mitadVertical = (camara.fov * Math.PI) / 360;
    const mitadHorizontal = Math.atan(Math.tan(mitadVertical) * camara.aspect);
    return ancho / 2 / Math.tan(mitadHorizontal);
  }

  let progreso = 0;
  let progresoSuave = 0;
  let visible = true;
  let animacion = 0;
  let arranque = 0;

  const raton = new THREE.Vector2();
  const ratonSuave = new THREE.Vector2();
  const mira = new THREE.Vector3();
  const desde = new THREE.Vector3();
  const hasta = new THREE.Vector3();

  function calcularProgreso(): void {
    const caja = lienzo.getBoundingClientRect();
    const recorrido = caja.height + window.innerHeight;
    progreso = Math.min(Math.max((window.innerHeight - caja.top) / recorrido, 0), 1);
  }

  function moverRaton(e: PointerEvent): void {
    raton.x = (e.clientX / window.innerWidth) * 2 - 1;
    raton.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function situarCamara(t: number): void {
    const tramo = t * (PARADAS.length - 1);
    const indice = Math.min(Math.floor(tramo), PARADAS.length - 2);
    const local = tramo - indice;
    const suave = local * local * (3 - 2 * local);

    const a = PARADAS[indice];
    const b = PARADAS[indice + 1];

    desde.copy(a.direccion).normalize().multiplyScalar(distanciaPara(a.ancho * ajuste.ancho)).add(a.mira);
    hasta.copy(b.direccion).normalize().multiplyScalar(distanciaPara(b.ancho * ajuste.ancho)).add(b.mira);

    camara.position.lerpVectors(desde, hasta, suave);
    mira.lerpVectors(a.mira, b.mira, suave);

    camara.position.x += ratonSuave.x * 1.1;
    camara.position.y -= ratonSuave.y * 0.6;

    camara.lookAt(mira);
  }

  /** La ciudad se levanta sola, edificio a edificio. */
  function subida(desdeInicio: number, orden: number): number {
    const retraso = orden * 0.022;
    const local = Math.min(Math.max((desdeInicio - retraso) / 0.9, 0), 1);
    return 1 - (1 - local) ** 3;
  }

  function dibujar(tiempo: number): void {
    animacion = requestAnimationFrame(dibujar);
    if (!visible) return;

    if (!arranque) arranque = tiempo;
    const desdeInicio = (tiempo - arranque) * 0.001;
    const s = tiempo * 0.001;

    progresoSuave += (progreso - progresoSuave) * 0.07;
    ratonSuave.lerp(raton, 0.045);
    situarCamara(progresoSuave);

    for (const edificio of edificios) {
      const alto = edificio.userData.alto as number;
      const t = subida(desdeInicio, edificio.userData.orden as number);
      edificio.scale.y = alto * Math.max(t, 0.001);
      edificio.position.y = (alto * t) / 2;
    }

    for (const conjunto of ventanas) {
      const t = subida(desdeInicio, conjunto.userData.orden as number);
      conjunto.visible = t > 0.96;
    }

    // Las luces de las ventanas van subiendo al caer la tarde.
    materialVentana.emissiveIntensity = 1.1 + Math.sin(s * 0.35) * 0.35 + progresoSuave * 0.6;

    for (const marcador of marcadores) {
      const fase = marcador.userData.fase as number;
      const pulso = (Math.sin(s * 1.5 + fase) + 1) * 0.5;

      const halo = marcador.getObjectByName('halo');
      if (halo) halo.scale.setScalar(0.85 + pulso * 0.5);

      const anillo = marcador.getObjectByName('anillo') as THREE.Mesh | undefined;
      if (anillo) {
        anillo.scale.setScalar(1 + pulso * 0.7);
        (anillo.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - pulso);
      }

      marcador.position.y = Math.sin(s * 0.8 + fase) * 0.06;
    }

    ciudad.rotation.y = Math.sin(s * 0.06) * 0.05;

    render.render(escena, camara);
  }

  function ajustar(): void {
    const ancho = lienzo.clientWidth;
    const alto = lienzo.clientHeight;
    if (!ancho || !alto) return;

    camara.aspect = ancho / alto;
    ajuste = encuadre(camara.aspect);
    camara.fov = ajuste.fov;
    camara.updateProjectionMatrix();

    render.setSize(ancho, alto, false);
    situarCamara(progresoSuave);
  }

  const observador = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
    threshold: 0,
  });
  observador.observe(lienzo);

  const conRaton = window.matchMedia('(pointer: fine)').matches;
  window.addEventListener('scroll', calcularProgreso, { passive: true });
  window.addEventListener('resize', ajustar);
  if (conRaton) window.addEventListener('pointermove', moverRaton, { passive: true });

  calcularProgreso();
  progresoSuave = progreso;
  ajustar();
  animacion = requestAnimationFrame(dibujar);

  return {
    destruir() {
      cancelAnimationFrame(animacion);
      observador.disconnect();
      window.removeEventListener('scroll', calcularProgreso);
      window.removeEventListener('resize', ajustar);
      if (conRaton) window.removeEventListener('pointermove', moverRaton);

      escena.traverse((nodo) => {
        if (nodo instanceof THREE.Mesh || nodo instanceof THREE.InstancedMesh) {
          nodo.geometry.dispose();
          const m = nodo.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
      render.dispose();
    },
  };
}
