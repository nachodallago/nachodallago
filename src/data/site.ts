export const site = {
  name: 'Nacho Dal Lago',
  role: 'Ingeniero en Inteligencia Artificial',
  url: 'https://nachodallago.com',
  title: 'Nacho Dal Lago — Ingeniero en IA · Automatizaciones con n8n y MCP',
  description:
    'Ingeniero en Inteligencia Artificial. Automatizo procesos con IA, workflows en n8n y conecto servidores vía MCP para que tu equipo entregue más rápido y con muchos menos errores.',
  location: 'Argentina',
  startedCoding: 2012,
};

export const links = {
  whatsapp: 'https://wa.me/message/OXURXG6SKOEDK1',
  linkedin: 'https://www.linkedin.com/in/nachodallago/',
  github: 'https://github.com/nachodallago',
  instagram: 'https://instagram.com/nachodallago',
  repo: 'https://github.com/nachodallago/nachodallago',
};

export const nav = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#resultados', label: 'Resultados' },
  { href: '#mcp', label: 'MCP' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#faq', label: 'FAQ' },
];

const years = new Date().getFullYear() - site.startedCoding;

export const metrics = [
  { value: '4–6', label: 'tareas en simultáneo por día, con IA en cada paso' },
  { value: '24/7', label: 'workflows en n8n corriendo sin intervención manual' },
  { value: '1', label: 'centro de control: servidores conectados a la IA vía MCP' },
  { value: `+${years}`, label: `años programando: desde ${site.startedCoding}, sin parar` },
];

export const services = [
  {
    icon: 'spark',
    title: 'Automatizaciones con IA',
    text: 'Agentes que leen, clasifican, responden y deciden. Emails, documentos, tickets y leads: la IA hace el trabajo pesado y tu equipo solo aprueba.',
    tags: ['Agentes', 'LLMs', 'RAG'],
  },
  {
    icon: 'flow',
    title: 'Workflows con n8n',
    text: 'Diseño e implemento flujos en n8n self-hosted que conectan tus apps —CRM, WhatsApp, planillas, ERP, APIs— y corren 24/7 con monitoreo y alertas.',
    tags: ['n8n', 'Webhooks', 'APIs'],
  },
  {
    icon: 'server',
    title: 'Servidores conectados vía MCP',
    text: 'Conecto servidores, bases de datos y herramientas a la IA con Model Context Protocol. Consultás, desplegás y operás todo desde un único lugar.',
    tags: ['MCP', 'Docker', 'Dokploy'],
  },
  {
    icon: 'code',
    title: 'Desarrollo aumentado con IA',
    text: 'Desarrollo full-stack con un flujo AI-first: varias tareas en paralelo, revisión automática y tests. Más entregas, muchísimos menos bugs.',
    tags: ['TypeScript', 'Node.js', 'Full-stack'],
  },
] as const;

export const beforeAfter = {
  before: [
    'Tareas manuales, una por una',
    'Errores humanos en copiar y pegar',
    'Información dispersa en diez herramientas',
    'Entregas que se acumulan cada semana',
  ],
  after: [
    'Entre 4 y 6 tareas entregadas por día, en simultáneo',
    'El porcentaje de error bajó de forma muy significativa',
    'Todo centralizado: la IA ve mis servidores vía MCP',
    'Procesos que corren solos, 24/7, con alertas',
  ],
};

export const mcpServers = [
  { name: 'prod-server', caps: 'ssh · docker · logs' },
  { name: 'postgres', caps: 'query · schema · backups' },
  { name: 'n8n', caps: 'workflows · executions' },
  { name: 'github', caps: 'repos · PRs · actions' },
  { name: 'dokploy', caps: 'deploys · dominios · envs' },
];

export const process = [
  {
    title: 'Diagnóstico',
    text: 'Mapeamos tus procesos y detectamos qué automatizar primero según impacto real en horas y errores.',
  },
  {
    title: 'Diseño',
    text: 'Defino la arquitectura del flujo: disparadores, agentes, validaciones y en qué punto decide una persona.',
  },
  {
    title: 'Construcción',
    text: 'Implemento con n8n, LLMs y MCP sobre tu infraestructura. Todo versionado, documentado y testeado.',
  },
  {
    title: 'Operar y mejorar',
    text: 'Monitoreo, métricas y ajustes continuos. La automatización mejora con cada ejecución.',
  },
];

export const timeline = [
  {
    year: String(site.startedCoding),
    title: 'Primera línea de código',
    text: 'Empiezo a programar de forma autodidacta. Nunca más paré.',
  },
  {
    year: `${site.startedCoding + 2}+`,
    title: 'Full-stack developer',
    text: 'Web, mobile y cloud: PHP, JavaScript, Angular, React Native, MySQL, AWS y Cloudflare. Colaboraciones con Google Local Guides, Wikipedia y Facebook Translate.',
  },
  {
    year: 'Último año',
    title: 'La transformación',
    text: 'Pongo la IA en el centro de todo mi flujo de trabajo. Las entregas se multiplican y los errores caen en picada.',
  },
  {
    year: 'Hoy',
    title: 'Ingeniero en IA',
    text: 'Automatizaciones con IA, workflows en n8n y servidores conectados vía MCP. Programador Gen Z, AI-native.',
  },
];

export const stack = [
  'n8n',
  'Claude',
  'GPT',
  'Gemini',
  'Model Context Protocol',
  'Agentes de IA',
  'RAG',
  'Docker',
  'Dokploy',
  'Node.js',
  'TypeScript',
  'PostgreSQL',
  'MySQL',
  'Webhooks',
  'APIs REST',
  'GitHub Actions',
  'AWS',
  'Cloudflare',
];

export const faqs = [
  {
    q: '¿Qué procesos se pueden automatizar con IA?',
    a: 'Casi cualquier tarea repetitiva que hoy hace una persona con reglas más o menos claras: responder consultas, cargar datos, clasificar emails y documentos, generar reportes, calificar leads, sincronizar sistemas o monitorear servidores. Si se repite todas las semanas, probablemente se puede automatizar.',
  },
  {
    q: '¿Qué es n8n y por qué lo uso?',
    a: 'n8n es una plataforma de automatización de workflows open source. La uso self-hosted porque conecta cientos de apps, permite sumar agentes de IA en cualquier paso y los datos quedan en tu infraestructura, sin pagar por cada ejecución.',
  },
  {
    q: '¿Qué es MCP (Model Context Protocol)?',
    a: 'Es el estándar abierto que permite que una IA se conecte de forma segura a herramientas y datos reales: servidores, bases de datos, repositorios o APIs. Con MCP la IA deja de "adivinar" y trabaja con el contexto real de tu negocio, todo desde un solo lugar.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Priorizo soluciones self-hosted, credenciales con permisos mínimos y validación humana en los pasos críticos. Vos decidís qué ve la IA y qué no.',
  },
  {
    q: '¿Cuánto tarda en estar funcionando una automatización?',
    a: 'Arrancamos por el proceso de mayor impacto para tener un primer flujo en producción rápido y medir resultados reales. Después escalamos al resto de la operación.',
  },
];
