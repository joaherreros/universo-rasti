# Universo Rasti — Prototipo Web Interactivo

Prototipo visual e interactivo oficial de **Universo Rasti** ("Construí. Explorá. Creá."), una experiencia híbrida físico-digital destinada a niños de entre 4 y 10 años que combina un kit físico de 400 bloques Rasti con una aplicación digital.

## Estructura del Proyecto

- `index.html`: Aplicación principal SPA con las 4 secciones permanentes (**Inicio**, **Personalización**, **Modos**, **Logros**) y formato priorizado para Tablet Horizontal (responsive a Desktop y Móvil).
- `css/styles.css`: Sistema de diseño fiel al Manual de Identidad Visual de Universo Rasti (paleta cromática oficial, tipografías `FatFrank/Lilita One`, `Fredoka` y `Poppins`, sistema de botones 3D glossy y tarjetas).
- `js/data.js`: Catálogo de los 4 mundos de Modo Aventura (*Estación Espacial*, *Isla Misteriosa*, *Reino Perdido*, *Expedición Submarina*), 10 perfiles de niños/as, opciones de personalización, galería segura *Familia Rasti* y sistema de logros/medallas.
- `js/app.js`: Lógica interactiva de navegación, personalización en vivo del avatar, narración por voz (4-6 años), simulador de escáner visual OpenCV y flujo de moderación de Familia Rasti.
- `assets/`: Recursos gráficos originales extraídos en alta resolución del documento de Identidad Visual de Universo Rasti.

## Cómo publicar gratis en Cloudflare Pages

### Opción 1: Subida directa (Drag & Drop — Recomendado para Demo Rápida)
1. Ingresá a [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → pestaña **Pages** → **Upload assets**.
2. Asignale un nombre al proyecto (por ejemplo, `universo-rasti`).
3. Arrastrá y soltá la carpeta `universo-rasti` y presioná **Deploy site**.
4. ¡Listo! En segundos tendrás tu URL `https://universo-rasti.pages.dev`.

### Opción 2: Conectado a GitHub / GitLab
- **Framework preset**: `None` (Sitio estático puro, sin comando de build necesario).
- **Build command**: *(dejar vacío)*
- **Build output directory**: `universo-rasti` (o `/` si subís únicamente el contenido de esta carpeta a la raíz de un repositorio nuevo).
