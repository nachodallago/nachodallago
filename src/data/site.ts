export const site = {
  name: 'Nacho Dal Lago',
  role: 'Ingeniero de Automatización e IA',
  url: 'https://nachodallago.com',
  title: 'Nacho Dal Lago — Ingeniero de Automatización e IA para empresas',
  description:
    'De programador que picaba código a ingeniero de automatización. Conecto IA (Claude, ChatGPT, ElevenLabs), n8n y tus sistemas —Odoo, TOTVS, MercadoLibre, MercadoPago, TiendaNube, ARCA— para que tu empresa opere sola, 24/7.',
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
  { href: '#historia', label: 'Historia' },
  { href: '#flujo', label: 'En acción' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#arsenal', label: 'Arsenal' },
  { href: '#faq', label: 'FAQ' },
];

export const years = new Date().getFullYear() - site.startedCoding;

/** Los dos "personajes" de la historia: el antes y el ahora */
export const chapters = [
  {
    id: 'programador',
    number: 'I',
    kicker: `Nacho · ${site.startedCoding} — 2023`,
    name: ['El que', 'picaba código'],
    quote: 'Cada línea la escribía a mano. Cada bug lo cazaba a mano. Cada cliente esperaba.',
    body: [
      `Empecé a programar en ${site.startedCoding}, de forma autodidacta, y nunca más paré. Fui full-stack: PHP, JavaScript, Angular, React Native, MySQL, AWS y Cloudflare. Webs, apps, tiendas online e integraciones con MercadoLibre.`,
      'Colaboré con Google Local Guides, Wikipedia y Facebook Translate. Aprendí a entregar, pero el techo era claro: una tarea a la vez, y el error humano siempre al acecho.',
    ],
    stats: [
      { value: `+${years}`, label: 'años de código' },
      { value: '1', label: 'tarea a la vez' },
    ],
    logos: ['php', 'javascript', 'angular', 'react', 'mysql', 'wordpress', 'aws', 'cloudflare'],
  },
  {
    id: 'ingeniero',
    number: 'II',
    kicker: 'Nacho · hoy',
    name: ['El ingeniero', 'de automatización'],
    quote: 'Ya no escribo código para una tarea. Diseño sistemas que hacen el trabajo solos.',
    body: [
      'Puse la IA en el centro de todo. Hoy conecto agentes con Claude y ChatGPT, workflows en n8n y servidores vía MCP con los sistemas reales de las empresas: ERPs como Odoo y TOTVS, marketplaces, pasarelas de pago y ARCA.',
      'El resultado: procesos que corren 24/7, entre 4 y 6 entregas por día en paralelo y un porcentaje de error que cayó en picada. El código no desapareció: ahora trabaja para la operación.',
    ],
    stats: [
      { value: '4–6', label: 'entregas por día' },
      { value: '24/7', label: 'workflows activos' },
    ],
    logos: ['claude', 'openai', 'n8n', 'elevenlabs', 'mcp', 'odoo', 'totvs', 'arca'],
  },
] as const;

/** Workflow de punta a punta que se "enciende" con el scroll */
export const flow = [
  { logos: ['mercadolibre', 'tiendanube'], tag: 'trigger', title: 'Entra una venta', text: 'Webhook de MercadoLibre o TiendaNube.' },
  { logos: ['claude', 'openai'], tag: 'agente IA', title: 'La IA la entiende', text: 'Valida datos, detecta errores y decide.' },
  { logos: ['odoo', 'totvs'], tag: 'erp', title: 'Se carga en el ERP', text: 'Pedido, stock y cliente en Odoo o TOTVS.' },
  { logos: ['mercadopago'], tag: 'cobro', title: 'Se concilia el pago', text: 'MercadoPago confirmado y conciliado.' },
  { logos: ['arca'], tag: 'fiscal', title: 'Se factura en ARCA', text: 'Factura electrónica emitida y enviada.' },
  { logos: ['whatsapp', 'elevenlabs'], tag: 'aviso', title: 'El cliente se entera', text: 'WhatsApp con voz natural de ElevenLabs.' },
] as const;

/** Proyectos propios. Las descripciones salen de cada sitio. */
export const projects = [
  {
    id: 'potencialo',
    name: 'Potencialo',
    url: 'https://potencialo.com',
    domain: 'potencialo.com',
    kicker: 'SaaS · negocios locales',
    tagline: 'La solución definitiva para emprendimientos y negocios locales.',
    text: 'Caja, factura electrónica, turnos, pedidos, fiado y proveedores en un solo panel armado según el rubro, desde el celular. Con tienda, carta o agenda online y una asistente de IA que atiende a cada visitante y ayuda a cerrar la venta.',
    tags: ['IA', 'Facturación ARCA', 'Mercado Pago', 'Mobile first'],
    accent: '#8b5cf6',
  },
  {
    id: 'conecticut',
    name: 'Conecticut',
    url: 'https://conecticut.io',
    domain: 'conecticut.io',
    kicker: 'Gaming · comunidad',
    tagline: 'La plataforma competitiva de Counter-Strike 2 en Argentina.',
    text: 'Matchmaking 5v5 por ELO en LA LIGA, veto de mapas en vivo, rankings, temporadas y anticheat propio del lado del servidor. Se entra con Steam, sin instalar nada, y con servidores en Argentina.',
    tags: ['CS2', 'Matchmaking ELO', 'Anticheat', 'Steam'],
    accent: '#ff3d8b',
  },
] as const;

export const privateProject = {
  name: 'MyWallet',
  kicker: 'Proyecto privado',
  text: 'Proyecto propio en desarrollo, de uso privado. Por ahora no tiene demo pública: los detalles quedan bajo llave.',
};

export const services = [
  {
    title: 'Agentes de IA',
    text: 'Agentes con Claude y ChatGPT que leen, clasifican, responden y deciden sobre emails, documentos, tickets y leads. Tu equipo solo aprueba.',
    tags: ['Claude', 'ChatGPT', 'RAG'],
  },
  {
    title: 'Workflows con n8n',
    text: 'Flujos self-hosted que conectan CRM, WhatsApp, planillas, ERP y APIs. Corren 24/7, con monitoreo, reintentos y alertas.',
    tags: ['n8n', 'Webhooks', 'APIs'],
  },
  {
    title: 'Integración de sistemas',
    text: 'Odoo, TOTVS, MercadoLibre, MercadoPago, TiendaNube y ARCA hablando entre sí. Chau carga manual y doble tipeo.',
    tags: ['ERP', 'E-commerce', 'Facturación'],
  },
  {
    title: 'Servidores vía MCP',
    text: 'Servidores, bases de datos y herramientas conectados a la IA con Model Context Protocol. Todo se opera desde un solo lugar.',
    tags: ['MCP', 'Docker', 'Dokploy'],
  },
  {
    title: 'Contenido con IA',
    text: 'Voces con ElevenLabs, imágenes con Magnific y video con Higgsfield, integrados a tus procesos de marketing y atención.',
    tags: ['ElevenLabs', 'Magnific', 'Higgsfield'],
  },
  {
    title: 'Datos y reportes',
    text: 'Reportes que se arman solos con Google Analytics, Analytics Canvas y planillas. Los números llegan, no hay que ir a buscarlos.',
    tags: ['Analytics', 'Dashboards', 'Sheets'],
  },
];

export const metrics = [
  { value: '4–6', label: 'tareas entregadas por día, en paralelo' },
  { value: '24/7', label: 'workflows corriendo sin intervención' },
  { value: '0', label: 'pasos manuales en los flujos críticos' },
  { value: `+${years}`, label: `años programando, desde ${site.startedCoding}` },
];

export const beforeAfter = {
  before: [
    'Tareas manuales, una por una',
    'Errores humanos al copiar y pegar',
    'Información dispersa en diez sistemas',
    'Entregas que se acumulan cada semana',
  ],
  after: [
    'Entre 4 y 6 tareas por día, en simultáneo',
    'El porcentaje de error bajó muy fuerte',
    'Todo centralizado: la IA ve los sistemas vía MCP',
    'Procesos que corren solos, 24/7, con alertas',
  ],
};

export const timeline = [
  { year: String(site.startedCoding), title: 'Primera línea de código', text: 'Autodidacta. Nunca más paré.' },
  { year: `${site.startedCoding + 2}+`, title: 'Full-stack developer', text: 'Web, mobile y cloud. Integraciones con MercadoLibre y e-commerce.' },
  { year: 'El quiebre', title: 'La IA al centro', text: 'Las entregas se multiplican y los errores caen en picada.' },
  { year: 'Hoy', title: 'Ingeniero de automatización', text: 'IA, n8n y MCP conectados a los sistemas de las empresas.' },
];

export const processSteps = [
  { title: 'Diagnóstico', text: 'Mapeamos tus procesos y elegimos qué automatizar primero según horas y errores ahorrados.' },
  { title: 'Diseño', text: 'Disparadores, agentes, validaciones y en qué punto decide una persona.' },
  { title: 'Construcción', text: 'n8n, LLMs y MCP sobre tu infraestructura. Versionado, documentado y testeado.' },
  { title: 'Operar y mejorar', text: 'Monitoreo, métricas y ajustes. La automatización mejora con cada ejecución.' },
];

/** Logos agrupados para la sección "Arsenal" */
export const arsenal = [
  {
    title: 'Inteligencia artificial',
    logos: ['claude', 'openai', 'gemini', 'elevenlabs', 'magnific', 'higgsfield', 'mcp'],
  },
  {
    title: 'Automatización y datos',
    logos: ['n8n', 'whatsapp', 'sheets', 'analytics', 'analyticscanvas', 'github-actions'],
  },
  {
    title: 'ERP, e-commerce y fiscal',
    logos: ['totvs', 'odoo', 'softcrates', 'ecomexperts', 'mercadolibre', 'mercadopago', 'tiendanube', 'arca'],
  },
  {
    title: 'Código e infraestructura',
    logos: ['typescript', 'node', 'javascript', 'php', 'react', 'angular', 'postgresql', 'mysql', 'docker', 'cloudflare', 'aws', 'wordpress', 'github'],
  },
] as const;

export const faqs = [
  {
    q: '¿Qué procesos de mi empresa se pueden automatizar?',
    a: 'Casi cualquier tarea repetitiva con reglas más o menos claras: cargar pedidos en el ERP, facturar en ARCA, conciliar cobros de MercadoPago, responder consultas, clasificar emails y documentos, generar reportes o sincronizar stock entre MercadoLibre, TiendaNube y tu sistema. Si se repite todas las semanas, probablemente se puede automatizar.',
  },
  {
    q: '¿Con qué sistemas trabajás?',
    a: 'Trabajé con ERPs como TOTVS, Odoo y Softcrates, con Ecomexperts, MercadoLibre, MercadoPago, TiendaNube y ARCA, y con herramientas de IA como Claude, ChatGPT, ElevenLabs, Magnific y Higgsfield. Si tu sistema tiene API, webhook o base de datos, se puede integrar.',
  },
  {
    q: '¿Qué es n8n y por qué lo uso?',
    a: 'n8n es una plataforma de automatización de workflows open source. La uso self-hosted porque conecta cientos de apps, permite sumar agentes de IA en cualquier paso y los datos quedan en tu infraestructura, sin pagar por cada ejecución.',
  },
  {
    q: '¿Qué es MCP (Model Context Protocol)?',
    a: 'Es el estándar abierto que permite que una IA se conecte de forma segura a herramientas y datos reales: servidores, bases de datos, repositorios o APIs. Con MCP la IA deja de adivinar y trabaja con el contexto real de tu negocio.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Priorizo soluciones self-hosted, credenciales con permisos mínimos y validación humana en los pasos críticos. Vos decidís qué ve la IA y qué no.',
  },
  {
    q: '¿Cuánto tarda una automatización en estar funcionando?',
    a: 'Arrancamos por el proceso de mayor impacto para tener un primer flujo en producción rápido y medir resultados reales. Después escalamos al resto de la operación.',
  },
];
