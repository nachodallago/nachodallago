# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .
RUN npm run build \
 # Pre-comprime los assets para que nginx los sirva sin gastar CPU
 && find dist -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.svg' -o -name '*.xml' -o -name '*.txt' -o -name '*.webmanifest' -o -name '*.json' \) \
    -exec gzip -9 -k {} \;

# ---------- runtime ----------
FROM nginx:1.29-alpine AS runtime
# Node solo para la API de FC 26 (SQLite nativo de Node, sin dependencias)
RUN apk add --no-cache libstdc++
COPY --from=node:22-alpine /usr/local/bin/node /usr/local/bin/node

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY server/fc26-api.mjs /app/fc26-api.mjs
COPY docker-entrypoint-fc26.sh /usr/local/bin/docker-entrypoint-fc26.sh

# La base SQLite vive en un volumen: montarlo en Dokploy para que sobreviva a los deploys
ENV FC26_DB=/app/data/fc26.sqlite
VOLUME /app/data

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz && wget -qO- http://127.0.0.1/api/fc26/health || exit 1
CMD ["docker-entrypoint-fc26.sh"]
