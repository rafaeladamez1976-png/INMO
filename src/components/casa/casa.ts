import * as THREE from 'three';

/**
 * La villa.
 *
 * Arquitectura contemporánea de hora azul: cubierta plana con losa volada,
 * planta alta en voladizo sobre la baja, muros de cristal de suelo a techo con
 * carpintería negra fina, testero de piedra natural, techo de madera bajo el
 * voladizo y piscina desbordante que refleja la casa.
 *
 * Se gira con el dedo. Todo procedural: ni un modelo descargado.
 */

export type Nivel = 'alta' | 'media' | 'baja';

const DETALLE = {
  alta: { arboles: 8, plantas: 12, luces: 14, sombras: true, pixeles: 2, aguaSegmentos: 40, reflejo: true },
  media: { arboles: 6, plantas: 8, luces: 9, sombras: true, pixeles: 1.75, aguaSegmentos: 26, reflejo: true },
  baja: { arboles: 3, plantas: 4, luces: 5, sombras: false, pixeles: 1.5, aguaSegmentos: 14, reflejo: false },
} as const;

const COLOR = {
  losa: 0xe8e6e1,
  losaCanto: 0xd6d3cc,
  muro: 0xf1efe9,
  piedra: 0x8d8378,
  piedraJunta: 0x736a60,
  maderaTecho: 0xb98a52,
  maderaTarima: 0x9c7245,
  carpinteria: 0x1c1e22,
  interior: 0xffc98a,
  cristal: 0x2a3a46,
  agua: 0x1d6f8f,
  aguaClara: 0x35a3c4,
  cesped: 0x3f5c34,
  seto: 0x35502c,
  tronco: 0x4a3a2c,
  copa: 0x3d5a30,
  cielo: 0x1a2436,
};

export interface Villa {
  destruir(): void;
}
/** Se mantiene el nombre antiguo para no romper quien lo importe. */
export type Casa = Villa;

function azar(semilla: number): number {
  const x = Math.sin(semilla * 91.7 + 41.3) * 27183.845;
  return x - Math.floor(x);
}

function mate(color: number, rugosidad = 0.85, metal = 0): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: rugosidad, metalness: metal });
}

/**
 * Muro de cristal: carpintería negra fina y vidrio con el interior encendido.
 *
 * Es lo que define esta arquitectura. El vidrio va emisivo hacia dentro para
 * que la casa se lea iluminada desde el interior, como en las fotos de hora
 * azul.
 */
function crearMuroCristal(ancho: number, alto: number, divisiones: number): THREE.Group {
  const muro = new THREE.Group();

  const materialVidrio = new THREE.MeshPhysicalMaterial({
    color: COLOR.cristal,
    emissive: COLOR.interior,
    emissiveIntensity: 0.55,
    roughness: 0.02,
    metalness: 0,
    // Reflejo especular fuerte y rasante: es como se comporta el vidrio real.
    reflectivity: 0.9,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    ior: 1.52,
    transparent: true,
    opacity: 0.72,
  });
  materialVidrio.name = 'vidrio';

  const vidrio = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), materialVidrio);
  vidrio.name = 'vidrio';
  muro.add(vidrio);

  const materialPerfil = mate(COLOR.carpinteria, 0.35, 0.45);
  const perfil = 0.035;

  // Marco.
  for (const [w, h, x, y] of [
    [ancho, perfil, 0, alto / 2],
    [ancho, perfil, 0, -alto / 2],
    [perfil, alto, -ancho / 2, 0],
    [perfil, alto, ancho / 2, 0],
  ] as const) {
    const liston = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), materialPerfil);
    liston.position.set(x, y, 0.015);
    muro.add(liston);
  }

  // Montantes verticales.
  for (let i = 1; i < divisiones; i++) {
    const montante = new THREE.Mesh(new THREE.BoxGeometry(perfil, alto, 0.045), materialPerfil);
    montante.position.set(-ancho / 2 + (i * ancho) / divisiones, 0, 0.015);
    muro.add(montante);
  }

  return muro;
}

/** Testero de piedra natural: hiladas irregulares. */
function crearPiedra(ancho: number, alto: number, fondo: number): THREE.Group {
  const testero = new THREE.Group();

  const base = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), mate(COLOR.piedraJunta, 0.95));
  testero.add(base);

  const materialPiedra = mate(COLOR.piedra, 0.92);
  const hiladas = Math.max(6, Math.round(alto / 0.22));

  for (let f = 0; f < hiladas; f++) {
    const y = -alto / 2 + (f + 0.5) * (alto / hiladas);
    let x = -ancho / 2;
    let i = 0;

    while (x < ancho / 2 - 0.02) {
      const largo = Math.min(0.18 + azar(f * 31 + i * 7) * 0.34, ancho / 2 - x);
      const sillar = new THREE.Mesh(
        new THREE.BoxGeometry(largo * 0.94, (alto / hiladas) * 0.88, 0.045),
        materialPiedra,
      );
      sillar.position.set(x + largo / 2, y, fondo / 2 + 0.02);
      testero.add(sillar);
      x += largo;
      i++;
    }
  }

  return testero;
}

export function crearCasa(lienzo: HTMLCanvasElement, nivel: Nivel = 'alta'): Villa {
  const d = DETALLE[nivel];

  const escena = new THREE.Scene();
  escena.fog = new THREE.Fog(COLOR.cielo, 18, 40);

  const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 70);

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
  render.toneMappingExposure = 1.05;

  // ---- Luz de hora azul ----
  // Cielo frío arriba, rebote cálido abajo: es lo que da el contraste de las
  // fotos de anochecer.
  escena.add(new THREE.HemisphereLight(0x4a6a9c, 0x2a2620, 0.9));

  const cielo = new THREE.DirectionalLight(0x6f8fc4, 1.5);
  cielo.position.set(-6, 9, -5);
  escena.add(cielo);

  const clave = new THREE.DirectionalLight(0xffd2a0, 1.1);
  clave.position.set(6, 7, 6);
  clave.castShadow = d.sombras;
  if (d.sombras) {
    clave.shadow.mapSize.set(nivel === 'alta' ? 1024 : 512, nivel === 'alta' ? 1024 : 512);
    clave.shadow.camera.near = 1;
    clave.shadow.camera.far = 28;
    const lado = 8;
    clave.shadow.camera.left = -lado;
    clave.shadow.camera.right = lado;
    clave.shadow.camera.top = lado;
    clave.shadow.camera.bottom = -lado;
    clave.shadow.bias = -0.0018;
  }
  escena.add(clave);

  /*
    Mapa de entorno tomado de una fotografía panorámica de cielo al anochecer.
    Es el cambio que más acerca la escena al fotorrealismo: sin él, el vidrio y
    el agua reflejan un color plano y todo se ve de plástico.
  */
  const pmrem = new THREE.PMREMGenerator(render);
  pmrem.compileEquirectangularShader();

  new THREE.TextureLoader().load('/entorno.jpg', (textura) => {
    textura.mapping = THREE.EquirectangularReflectionMapping;
    textura.colorSpace = THREE.SRGBColorSpace;
    const objetivo = pmrem.fromEquirectangular(textura);
    escena.environment = objetivo.texture;
    escena.environmentIntensity = 1.15;
    textura.dispose();
    pmrem.dispose();
  });

  const mundo = new THREE.Group();
  escena.add(mundo);

  // ---- Parcela ----
  const parcela = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.4, 0.3, 56), mate(COLOR.cesped, 1));
  parcela.position.y = -0.15;
  parcela.receiveShadow = d.sombras;
  mundo.add(parcela);

  const tarima = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.12, 3.2), mate(COLOR.maderaTarima, 0.85));
  tarima.position.set(0, 0.02, 2.6);
  tarima.receiveShadow = d.sombras;
  mundo.add(tarima);

  // Juntas de la tarima.
  for (let i = 0; i < 16; i++) {
    const junta = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.005, 0.02), mate(0x7a5734, 0.9));
    junta.position.set(0, 0.085, 1.05 + i * 0.2);
    mundo.add(junta);
  }

  // ---- La villa ----
  const casa = new THREE.Group();
  mundo.add(casa);

  const ANCHO_BAJA = 6.4;
  const FONDO_BAJA = 3.6;
  const ALTO_PLANTA = 2.35;

  // Planta baja: casi toda cristal.
  const forjadoBaja = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_BAJA, 0.16, FONDO_BAJA),
    mate(COLOR.losa, 0.8),
  );
  forjadoBaja.position.y = 0.08;
  forjadoBaja.receiveShadow = d.sombras;
  casa.add(forjadoBaja);

  // Interior insinuado: una caja cálida detrás del cristal.
  const interior = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_BAJA - 0.3, ALTO_PLANTA - 0.2, FONDO_BAJA - 0.3),
    new THREE.MeshStandardMaterial({
      color: 0x6a4d33,
      emissive: COLOR.interior,
      emissiveIntensity: 0.42,
      roughness: 0.9,
    }),
  );
  interior.name = 'interior-baja';
  interior.position.y = ALTO_PLANTA / 2 + 0.1;
  casa.add(interior);

  // Testero de piedra que ancla la composición.
  const piedra = crearPiedra(1.5, ALTO_PLANTA + 0.3, 0.5);
  piedra.position.set(-1.1, (ALTO_PLANTA + 0.3) / 2, FONDO_BAJA / 2 - 0.25);
  casa.add(piedra);

  // Muros de cristal de la planta baja.
  const muroIzq = crearMuroCristal(2.0, ALTO_PLANTA, 3);
  muroIzq.position.set(-2.7, ALTO_PLANTA / 2 + 0.16, FONDO_BAJA / 2 + 0.01);
  casa.add(muroIzq);

  const muroDer = crearMuroCristal(3.4, ALTO_PLANTA, 5);
  muroDer.position.set(1.05, ALTO_PLANTA / 2 + 0.16, FONDO_BAJA / 2 + 0.01);
  casa.add(muroDer);

  const muroLateral = crearMuroCristal(FONDO_BAJA - 0.4, ALTO_PLANTA, 3);
  muroLateral.rotation.y = Math.PI / 2;
  muroLateral.position.set(ANCHO_BAJA / 2 + 0.01, ALTO_PLANTA / 2 + 0.16, 0);
  casa.add(muroLateral);

  // Cerramientos ciegos del fondo.
  const fondo = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_BAJA, ALTO_PLANTA, 0.14),
    mate(COLOR.muro, 0.9),
  );
  fondo.position.set(0, ALTO_PLANTA / 2 + 0.16, -FONDO_BAJA / 2);
  fondo.castShadow = d.sombras;
  casa.add(fondo);

  // ---- Losa entre plantas, volada ----
  const VUELO = 1.15;
  const losaMedia = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_BAJA + 0.5, 0.26, FONDO_BAJA + VUELO),
    mate(COLOR.losa, 0.75),
  );
  losaMedia.position.set(0, ALTO_PLANTA + 0.29, VUELO / 2 - 0.1);
  losaMedia.castShadow = d.sombras;
  casa.add(losaMedia);

  // Techo de madera bajo el voladizo: el detalle cálido de la referencia.
  const techoMadera = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_BAJA + 0.44, 0.03, VUELO + 0.9),
    mate(COLOR.maderaTecho, 0.7),
  );
  techoMadera.position.set(0, ALTO_PLANTA + 0.155, FONDO_BAJA / 2 + VUELO / 2 - 0.35);
  casa.add(techoMadera);

  // Focos empotrados en el techo de madera.
  const materialFoco = new THREE.MeshBasicMaterial({ color: 0xffd9a0 });
  const focos: THREE.Mesh[] = [];
  for (let i = 0; i < d.luces; i++) {
    const foco = new THREE.Mesh(new THREE.CircleGeometry(0.045, 10), materialFoco);
    foco.rotation.x = Math.PI / 2;
    foco.position.set(-2.8 + (i * 5.6) / (d.luces - 1), ALTO_PLANTA + 0.135, FONDO_BAJA / 2 + 0.35);
    casa.add(foco);
    focos.push(foco);
  }

  const luzPorche = new THREE.PointLight(0xffb877, 2.2, 9);
  luzPorche.position.set(0, ALTO_PLANTA, FONDO_BAJA / 2 + 0.5);
  luzPorche.name = 'luz-porche';
  casa.add(luzPorche);

  // ---- Planta alta ----
  const yAlta = ALTO_PLANTA + 0.42;
  const ANCHO_ALTA = ANCHO_BAJA - 0.6;
  const FONDO_ALTA = FONDO_BAJA + 0.3;

  const interiorAlta = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_ALTA - 0.3, ALTO_PLANTA - 0.25, FONDO_ALTA - 0.4),
    new THREE.MeshStandardMaterial({
      color: 0x6a4d33,
      emissive: COLOR.interior,
      emissiveIntensity: 0.38,
      roughness: 0.9,
    }),
  );
  interiorAlta.name = 'interior-alta';
  interiorAlta.position.set(0, yAlta + ALTO_PLANTA / 2, 0.1);
  casa.add(interiorAlta);

  const fondoAlta = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_ALTA, ALTO_PLANTA, 0.14),
    mate(COLOR.muro, 0.9),
  );
  fondoAlta.position.set(0, yAlta + ALTO_PLANTA / 2, -FONDO_ALTA / 2 + 0.2);
  fondoAlta.castShadow = d.sombras;
  casa.add(fondoAlta);

  const muroAlta = crearMuroCristal(ANCHO_ALTA - 0.2, ALTO_PLANTA - 0.2, 6);
  muroAlta.position.set(0, yAlta + ALTO_PLANTA / 2, FONDO_ALTA / 2 - 0.1);
  casa.add(muroAlta);

  const muroAltaLat = crearMuroCristal(FONDO_ALTA - 0.6, ALTO_PLANTA - 0.2, 3);
  muroAltaLat.rotation.y = Math.PI / 2;
  muroAltaLat.position.set(ANCHO_ALTA / 2 + 0.01, yAlta + ALTO_PLANTA / 2, 0);
  casa.add(muroAltaLat);

  // Barandilla de vidrio de la terraza.
  const barandilla = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_ALTA + 0.4, 0.95, 0.03),
    new THREE.MeshStandardMaterial({
      color: 0x9fc4d6,
      roughness: 0.05,
      metalness: 0.4,
      transparent: true,
      opacity: 0.28,
    }),
  );
  barandilla.position.set(0, yAlta - 0.05, FONDO_ALTA / 2 + 0.35);
  casa.add(barandilla);

  const pasamanos = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_ALTA + 0.44, 0.05, 0.07),
    mate(COLOR.carpinteria, 0.4, 0.5),
  );
  pasamanos.position.set(0, yAlta + 0.44, FONDO_ALTA / 2 + 0.35);
  casa.add(pasamanos);

  // ---- Cubierta plana volada ----
  const cubierta = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_BAJA + 0.9, 0.24, FONDO_ALTA + 1.5),
    mate(COLOR.losa, 0.75),
  );
  cubierta.position.set(0, yAlta + ALTO_PLANTA + 0.12, 0.35);
  cubierta.castShadow = d.sombras;
  casa.add(cubierta);

  const techoAlto = new THREE.Mesh(
    new THREE.BoxGeometry(ANCHO_BAJA + 0.84, 0.03, FONDO_ALTA + 1.44),
    mate(COLOR.maderaTecho, 0.72),
  );
  techoAlto.position.set(0, yAlta + ALTO_PLANTA - 0.01, 0.35);
  casa.add(techoAlto);

  // ---- Piscina desbordante ----
  const piscina = new THREE.Group();
  piscina.position.set(0, 0, 5.3);
  mundo.add(piscina);

  const bordePiscina = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.2, 3.4), mate(COLOR.losaCanto, 0.9));
  bordePiscina.position.y = -0.02;
  bordePiscina.receiveShadow = d.sombras;
  piscina.add(bordePiscina);

  const vaso = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.5, 2.7), mate(0x14495c, 0.5));
  vaso.position.y = -0.2;
  piscina.add(vaso);

  const geometriaAgua = new THREE.PlaneGeometry(
    7.55,
    2.65,
    d.aguaSegmentos,
    Math.round(d.aguaSegmentos * 0.4),
  );
  const materialAgua = new THREE.MeshPhysicalMaterial({
    color: COLOR.agua,
    emissive: COLOR.aguaClara,
    emissiveIntensity: 0.18,
    roughness: 0.015,
    metalness: 0.1,
    reflectivity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.01,
    ior: 1.33,
    transparent: true,
    opacity: 0.9,
  });
  const agua = new THREE.Mesh(geometriaAgua, materialAgua);
  agua.rotation.x = -Math.PI / 2;
  agua.position.y = 0.07;
  piscina.add(agua);

  const alturasAgua = (geometriaAgua.attributes.position as THREE.BufferAttribute).array as Float32Array;
  const alturasBase = Float32Array.from(alturasAgua);

  // Reflejo de la casa: una copia invertida, tenue, bajo el agua.
  if (d.reflejo) {
    const reflejo = casa.clone();
    reflejo.scale.y = -1;
    reflejo.position.y = 0.1;
    reflejo.position.z = 5.3 * 2 - 0;
    reflejo.traverse((nodo) => {
      if (nodo instanceof THREE.Mesh) {
        const material = (nodo.material as THREE.Material).clone();
        material.transparent = true;
        material.opacity = 0.16;
        (material as THREE.MeshStandardMaterial).depthWrite = false;
        nodo.material = material;
        nodo.castShadow = false;
        nodo.receiveShadow = false;
      }
    });
    piscina.add(reflejo);
  }

  // Focos sumergidos.
  for (const x of [-2.4, 0, 2.4]) {
    const foco = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 12),
      new THREE.MeshBasicMaterial({ color: 0x7fd6f0, transparent: true, opacity: 0.55 }),
    );
    foco.rotation.x = -Math.PI / 2;
    foco.position.set(x, 0.075, 0);
    piscina.add(foco);
  }

  // ---- Vegetación y maceteros ----
  const materialCopa = mate(COLOR.copa, 1);
  const materialTronco = mate(COLOR.tronco, 1);

  const arboles: THREE.Group[] = [];
  for (let i = 0; i < d.arboles; i++) {
    const arbol = new THREE.Group();

    const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 1.5, 6), materialTronco);
    tronco.position.y = 0.75;
    arbol.add(tronco);

    for (let b = 0; b < 3; b++) {
      const copa = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42 - b * 0.08, 1), materialCopa);
      copa.position.set(
        (azar(i * 10 + b) - 0.5) * 0.4,
        1.6 + b * 0.3,
        (azar(i * 20 + b) - 0.5) * 0.4,
      );
      copa.castShadow = d.sombras;
      arbol.add(copa);
    }

    const angulo = Math.PI * (0.15 + (i / d.arboles) * 0.7) + Math.PI * 0.55;
    const radio = 5.1 + azar(i * 3.3) * 0.8;
    arbol.position.set(Math.cos(angulo) * radio, 0, Math.sin(angulo) * radio);
    arbol.scale.setScalar(0.85 + azar(i * 7.7) * 0.5);
    arbol.userData.fase = azar(i * 13.1) * Math.PI * 2;
    mundo.add(arbol);
    arboles.push(arbol);
  }

  // Maceteros con olivo junto a la tarima.
  for (let i = 0; i < d.plantas; i++) {
    const lado = i % 2 === 0 ? -1 : 1;
    const macetero = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.44, 0.42),
      mate(0xd9d5cd, 0.9),
    );
    const x = lado * (2.4 + Math.floor(i / 2) * 0.9);
    macetero.position.set(x, 0.3, 3.3);
    macetero.castShadow = d.sombras;
    mundo.add(macetero);

    const mata = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 1), mate(COLOR.seto, 1));
    mata.position.set(x, 0.68, 3.3);
    mundo.add(mata);
  }

  // ---- Interacción ----
  let giro = -0.32;
  let giroObjetivo = -0.32;
  let inclinacion = 0.14;
  let arrastrando = false;
  let ultimoX = 0;
  let ultimoY = 0;
  let interactuado = false;

  function alPulsar(e: PointerEvent): void {
    arrastrando = true;
    interactuado = true;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    lienzo.setPointerCapture(e.pointerId);
  }

  function alMover(e: PointerEvent): void {
    if (!arrastrando) return;
    giroObjetivo += (e.clientX - ultimoX) * 0.008;
    inclinacion = Math.min(Math.max(inclinacion - (e.clientY - ultimoY) * 0.004, 0.02), 0.62);
    ultimoX = e.clientX;
    ultimoY = e.clientY;
  }

  function alSoltar(e: PointerEvent): void {
    arrastrando = false;
    if (lienzo.hasPointerCapture(e.pointerId)) lienzo.releasePointerCapture(e.pointerId);
  }

  lienzo.addEventListener('pointerdown', alPulsar);
  lienzo.addEventListener('pointermove', alMover);
  lienzo.addEventListener('pointerup', alSoltar);
  lienzo.addEventListener('pointercancel', alSoltar);

  // ---- Bucle ----
  let visible = true;
  let animacion = 0;
  let arranque = 0;

  const vidrios: THREE.MeshStandardMaterial[] = [];
  casa.traverse((nodo) => {
    if (nodo instanceof THREE.Mesh && nodo.name === 'vidrio') {
      vidrios.push(nodo.material as THREE.MeshStandardMaterial);
    }
  });

  const interiores = [interior, interiorAlta].map(
    (m) => m.material as THREE.MeshStandardMaterial,
  );

  function dibujar(tiempo: number): void {
    animacion = requestAnimationFrame(dibujar);
    if (!visible) return;

    if (!arranque) arranque = tiempo;
    const desdeInicio = (tiempo - arranque) * 0.001;
    const s = tiempo * 0.001;

    if (!arrastrando && !interactuado) giroObjetivo += 0.0018;
    giro += (giroObjetivo - giro) * 0.075;

    // Distancia calculada para que la parcela quepa entera sea cual sea la
    // forma de la pantalla.
    const mitadHorizontal = Math.atan(
      Math.tan((camara.fov * Math.PI) / 360) * camara.aspect,
    );
    const distancia = 11.2 / 2 / Math.tan(mitadHorizontal);

    camara.position.set(
      Math.sin(giro) * distancia * Math.cos(inclinacion),
      Math.sin(inclinacion) * distancia + 2.6,
      Math.cos(giro) * distancia * Math.cos(inclinacion) + 2.4,
    );
    camara.lookAt(0, 2.1, 1.2);

    // Entrada.
    const entrada = Math.min(desdeInicio / 1.2, 1);
    const suave = 1 - (1 - entrada) ** 3;
    mundo.scale.setScalar(0.9 + suave * 0.1);
    mundo.position.y = (1 - suave) * 1.6;

    // Agua: ondas largas y suaves, de piscina en calma.
    for (let i = 0; i < alturasBase.length; i += 3) {
      const x = alturasBase[i];
      const y = alturasBase[i + 1];
      alturasAgua[i + 2] =
        Math.sin(x * 2.2 + s * 0.9) * 0.02 + Math.cos(y * 3.4 + s * 0.65) * 0.014;
    }
    (geometriaAgua.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    geometriaAgua.computeVertexNormals();

    for (const arbol of arboles) {
      arbol.rotation.z = Math.sin(s * 0.7 + (arbol.userData.fase as number)) * 0.03;
    }

    // Latido muy leve de la luz interior: una casa habitada no es un fluorescente.
    const latido = 1 + Math.sin(s * 0.55) * 0.09 + Math.sin(s * 1.7) * 0.03;
    for (const vidrio of vidrios) vidrio.emissiveIntensity = 0.5 * latido;
    for (const dentro of interiores) dentro.emissiveIntensity = 0.4 * latido;

    const luz = casa.getObjectByName('luz-porche') as THREE.PointLight | undefined;
    if (luz) luz.intensity = 2.1 * latido;

    materialAgua.emissiveIntensity = 0.2 + Math.sin(s * 0.8) * 0.06;

    render.render(escena, camara);
  }

  function ajustar(): void {
    const ancho = lienzo.clientWidth;
    const alto = lienzo.clientHeight;
    if (!ancho || !alto) return;

    camara.aspect = ancho / alto;
    camara.fov = camara.aspect < 0.95 ? 44 : camara.aspect < 1.4 ? 37 : 32;
    camara.updateProjectionMatrix();
    render.setSize(ancho, alto, false);
  }

  const observador = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
    threshold: 0,
  });
  observador.observe(lienzo);

  window.addEventListener('resize', ajustar);

  ajustar();
  animacion = requestAnimationFrame(dibujar);

  return {
    destruir() {
      cancelAnimationFrame(animacion);
      observador.disconnect();
      window.removeEventListener('resize', ajustar);
      lienzo.removeEventListener('pointerdown', alPulsar);
      lienzo.removeEventListener('pointermove', alMover);
      lienzo.removeEventListener('pointerup', alSoltar);
      lienzo.removeEventListener('pointercancel', alSoltar);

      escena.traverse((nodo) => {
        if (nodo instanceof THREE.Mesh) {
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
