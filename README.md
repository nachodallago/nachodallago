# nachodallago.com

Web personal de **Nacho Dal Lago — Ingeniero en Inteligencia Artificial**.
Automatizaciones con IA · workflows con n8n · servidores conectados vía MCP.

## Stack

- **[Astro 7](https://astro.build)**: sitio 100% estático, HTML pre-renderizado y casi cero JavaScript.
- **[Tailwind CSS 4](https://tailwindcss.com)** vía `@tailwindcss/vite`, con el CSS crítico inline.
- **Geist Variable** self-hosted (sin requests a Google Fonts).
- Plataforma web moderna en lugar de librerías: Popover API (menú mobile), `<details name>` (FAQ),
  Scroll-Driven Animations (revelado al scrollear) y `@starting-style`, todo sin JS.
- SEO: JSON-LD (`Person`, `ProfessionalService`, `FAQPage`), Open Graph, sitemap, `robots.txt` y `llms.txt`.
- Build en ~1-2 s. Imagen Docker final: nginx alpine con assets pre-comprimidos con gzip.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera ./dist
npm run preview
npm run check    # type-check
```

Requiere Node `>=22.12`.

El contenido (servicios, métricas, FAQ, timeline, links) vive en `src/data/site.ts`.

## Deploy en Dokploy

1. **Create Application** → conectar este repositorio (branch `main`).
2. **Build Type**: `Dockerfile` (path `./Dockerfile`, context `.`).
3. **Domains**: agregar `nachodallago.com` (y `www.nachodallago.com`, que redirige 301 al apex), **container port `80`**, HTTPS con Let's Encrypt.
4. **Deploy**. Opcional: activar *Auto Deploy* para desplegar en cada push.

El contenedor expone `/healthz` para el healthcheck.

### Resultados de FC 26 (`/fc26`)

La página `/fc26` guarda los partidos en **SQLite** a través de una API chica en Node
(`server/fc26-api.mjs`, sin dependencias: usa `node:sqlite`). En el contenedor corren nginx
(sitio estático + proxy de `/api/fc26/`) y la API en `127.0.0.1:8787`.

En Dokploy:

- **Environment**: `FC26_PIN=<pin>`. Ver es libre; cargar o borrar pide ese PIN. Sin PIN, la API queda en solo lectura.
- **Advanced → Volumes**: montar un volumen en `/app/data` (ahí vive `fc26.sqlite`). Sin volumen, la base se pierde en cada deploy.

En local: `npm run api` (con `FC26_PIN=1234` para poder escribir) y `npm run dev` en otra terminal.

Probarlo en local:

```bash
docker build -t nachodallago .
docker run --rm -p 8080:80 -e FC26_PIN=1234 -v fc26-data:/app/data nachodallago   # http://localhost:8080
```

Las URLs del sitio anterior (`/projects`, `/blog`, `/shop`, `/gaming`, `/contact`, …) redirigen con 301 a la nueva home.

## Legacy

El sitio anterior (PHP + jQuery + Bootstrap) está archivado en [`Legacy/`](./Legacy). No se incluye en el build ni en la imagen Docker.
