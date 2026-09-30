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

Probarlo en local:

```bash
docker build -t nachodallago .
docker run --rm -p 8080:80 nachodallago   # http://localhost:8080
```

Las URLs del sitio anterior (`/projects`, `/blog`, `/shop`, `/gaming`, `/contact`, …) redirigen con 301 a la nueva home.
