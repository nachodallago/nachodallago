/**
 * Logos públicos de las herramientas y plataformas.
 * - `svg`: ícono de Simple Icons (CC0) en src/assets/logos, se pinta inline con `color`.
 * - `img`: logo oficial descargado del sitio de la marca (se muestra tal cual).
 * - `word`: sin logo público disponible, se muestra como wordmark tipográfico.
 */
export type LogoDef =
  | { name: string; kind: 'svg'; file: string; color: string }
  | { name: string; kind: 'img'; file: string; wide?: boolean }
  | { name: string; kind: 'word'; color: string };

export const logos: Record<string, LogoDef> = {
  // IA
  claude: { name: 'Claude', kind: 'svg', file: 'claude.svg', color: '#D97757' },
  openai: { name: 'ChatGPT', kind: 'svg', file: 'openai.svg', color: '#FFFFFF' },
  gemini: { name: 'Gemini', kind: 'svg', file: 'googlegemini.svg', color: '#8E75B2' },
  elevenlabs: { name: 'ElevenLabs', kind: 'svg', file: 'elevenlabs.svg', color: '#FFFFFF' },
  magnific: { name: 'Magnific', kind: 'img', file: 'magnific.svg' },
  higgsfield: { name: 'Higgsfield', kind: 'img', file: 'higgsfield.png' },
  mcp: { name: 'MCP', kind: 'svg', file: 'modelcontextprotocol.svg', color: '#FFFFFF' },

  // Automatización y datos
  n8n: { name: 'n8n', kind: 'svg', file: 'n8n.svg', color: '#EA4B71' },
  whatsapp: { name: 'WhatsApp', kind: 'svg', file: 'whatsapp.svg', color: '#25D366' },
  sheets: { name: 'Google Sheets', kind: 'svg', file: 'googlesheets.svg', color: '#34A853' },
  analytics: { name: 'Google Analytics', kind: 'svg', file: 'googleanalytics.svg', color: '#E37400' },
  analyticscanvas: { name: 'Analytics Canvas', kind: 'img', file: 'analyticscanvas.png' },
  'github-actions': { name: 'GitHub Actions', kind: 'svg', file: 'githubactions.svg', color: '#2088FF' },

  // ERP, e-commerce y fiscal
  totvs: { name: 'TOTVS', kind: 'svg', file: 'totvs.svg', color: '#FFFFFF' },
  odoo: { name: 'Odoo', kind: 'svg', file: 'odoo.svg', color: '#C59BC0' },
  softcrates: { name: 'Softcrates', kind: 'word', color: '#7DD3FC' },
  ecomexperts: { name: 'Ecomexperts', kind: 'img', file: 'ecomexperts.png', wide: true },
  mercadolibre: { name: 'MercadoLibre', kind: 'img', file: 'mercadolibre.png' },
  mercadopago: { name: 'MercadoPago', kind: 'svg', file: 'mercadopago.svg', color: '#00B1EA' },
  tiendanube: { name: 'TiendaNube', kind: 'img', file: 'tiendanube.png' },
  arca: { name: 'ARCA', kind: 'img', file: 'arca.svg', wide: true },

  // Código e infraestructura
  typescript: { name: 'TypeScript', kind: 'svg', file: 'typescript.svg', color: '#3178C6' },
  node: { name: 'Node.js', kind: 'svg', file: 'nodedotjs.svg', color: '#5FA04E' },
  javascript: { name: 'JavaScript', kind: 'svg', file: 'javascript.svg', color: '#F7DF1E' },
  php: { name: 'PHP', kind: 'svg', file: 'php.svg', color: '#8892BF' },
  react: { name: 'React', kind: 'svg', file: 'react.svg', color: '#61DAFB' },
  angular: { name: 'Angular', kind: 'svg', file: 'angular.svg', color: '#DD0031' },
  postgresql: { name: 'PostgreSQL', kind: 'svg', file: 'postgresql.svg', color: '#6E9CF2' },
  mysql: { name: 'MySQL', kind: 'svg', file: 'mysql.svg', color: '#4FA3D1' },
  docker: { name: 'Docker', kind: 'svg', file: 'docker.svg', color: '#2496ED' },
  cloudflare: { name: 'Cloudflare', kind: 'svg', file: 'cloudflare.svg', color: '#F38020' },
  aws: { name: 'AWS', kind: 'img', file: 'aws.png', wide: true },
  wordpress: { name: 'WordPress', kind: 'svg', file: 'wordpress.svg', color: '#3A9BD8' },
  github: { name: 'GitHub', kind: 'svg', file: 'github.svg', color: '#FFFFFF' },
};

export type LogoId = keyof typeof logos;
