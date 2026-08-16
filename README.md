# Umbral Inmobiliaria — maqueta

Maqueta de demostracion de una web inmobiliaria premium con 3D.

**Es una maqueta.** El nombre comercial es inventado a proposito para que quede
claro que no suplanta la web de nadie. Las oficinas, telefonos y zonas si son
reales, para que el negocio al que se le ensena reconozca su empresa. Los
inmuebles son ejemplos inventados, y la web lo avisa en pantalla.

## Poner en marcha

```bash
npm install
npm run dev
```

Abre http://localhost:4322

| Orden | Que hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera el sitio en `dist/` |
| `npm run preview` | Sirve lo generado |
| `npm test` | Ejecuta los tests |

## Las 13 paginas

| Ruta | Que es |
|---|---|
| `/` | Portada con heroe fotografico, ciudad 3D y testimonios |
| `/venta` | Catalogo en venta con buscador de filtros |
| `/alquiler` | Catalogo en alquiler con buscador de filtros |
| `/valoracion` | Captador de valoraciones en 4 pasos |
| `/calculadora-hipotecaria` | Calculadora interactiva |
| `/cita` | Agenda de visitas con calendario |
| `/oficinas` | Las cuatro oficinas |
| `/alquiler-vitalicio` | Producto de renta vitalicia |
| `/empresa` | Quienes somos |
| `/contacto` | Vias de contacto |
| `/trabaja-con-nosotros` | Empleo |
| `/noticias` | Revista |
| `/privacidad` | Politica de privacidad |

## Como esta construido

- **Astro** genera HTML estatico. Sin React: la portada arranca con muy poco
  JavaScript.
- **Three.js** dibuja la villa y la ciudad, con geometria creada por codigo y
  un mapa de entorno fotografico para los reflejos.
- **Vitest** cubre la matematica de la hipoteca, las reglas de cita y el
  captador de valoraciones.

### Donde estan las decisiones

| Fichero | Que contiene |
|---|---|
| `src/data/empresa.ts` | Oficinas, telefonos, marca. **Cambiar el nombre comercial aqui.** |
| `src/data/inmuebles.ts` | Inmuebles de ejemplo |
| `src/data/navegacion.ts` | Estructura del menu |
| `src/lib/hipoteca.ts` | Matematica de la hipoteca |
| `src/lib/citas.ts` | Horarios y huecos de la agenda |
| `src/styles/tokens.css` | Paleta y tipografia |

### Numeros de telefono

- **900 701 034** — general, en cabecera y pie
- **669 152 412** — WhatsApp de citas, en el boton flotante y la agenda

## Cosas que no son funcionales en la maqueta

- **La politica de privacidad** es un borrador que debe revisar un abogado.
- **Los testimonios y las noticias** son ejemplos.
- **Las fotografias** estan generadas para la maqueta.

## Pendiente

- Alertas de inmuebles por WhatsApp
- Promociones de obra nueva
- Multi-idioma
