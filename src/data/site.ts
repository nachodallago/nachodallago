export const site = {
  name: 'Nacho Dal Lago',
  role: 'Ingeniero de Automatización e IA',
  url: 'https://nachodallago.com',
  title: 'Nacho Dal Lago — Ingeniero de Automatización e IA',
  description:
    'Programador desde 2012, hoy ingeniero de automatización e IA. Conecto IA (Claude, ChatGPT, ElevenLabs), n8n y MCP con los sistemas de la empresa —MercadoLibre, MercadoPago, TiendaNube— para que la operación corra sola, 24/7.',
  location: 'Argentina',
  startedCoding: 2012,
};

export const links = {
  whatsapp: 'https://wa.me/message/OXURXG6SKOEDK1',
  linkedin: 'https://www.linkedin.com/in/nachodallago/',
  instagram: 'https://instagram.com/nachodallago',
};

export const nav = [
  { href: '#historia', label: 'Historia' },
  { href: '#flujo', label: 'En acción' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#arsenal', label: 'Arsenal' },
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
      'Puse la IA en el centro de todo. Hoy conecto agentes con Claude y ChatGPT, workflows en n8n y servidores vía MCP con los sistemas de la empresa: marketplaces y pasarelas de pago.',
      'El resultado: procesos que corren 24/7, entre 4 y 6 entregas por día en paralelo y un porcentaje de error que cayó en picada. El código no desapareció: ahora trabaja para la operación.',
    ],
    stats: [
      { value: '4–6', label: 'entregas por día' },
      { value: '24/7', label: 'workflows activos' },
    ],
    logos: ['claude', 'openai', 'n8n', 'elevenlabs', 'mcp'],
  },
] as const;

/** Workflow de punta a punta que se "enciende" con el scroll */
export const flow = [
  { logos: ['mercadolibre', 'tiendanube'], tag: 'trigger', title: 'Entra una venta', text: 'Webhook de MercadoLibre o TiendaNube.' },
  { logos: ['claude', 'openai'], tag: 'agente IA', title: 'La IA la entiende', text: 'Valida datos, detecta errores y decide.' },
  { logos: ['mercadopago'], tag: 'cobro', title: 'Se concilia el pago', text: 'MercadoPago confirmado y conciliado.' },
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
    text: 'Caja, turnos, pedidos, fiado y proveedores en un solo panel armado según el rubro, desde el celular. Con tienda, carta o agenda online y una asistente de IA que atiende a cada visitante y ayuda a cerrar la venta.',
    tags: ['IA', 'Mercado Pago', 'Mobile first'],
    accent: '#8b5cf6',
  },
  {
    id: 'conecticut',
    name: 'Conecticut',
    url: null,
    domain: null,
    kicker: 'Colaboración · gaming',
    tagline: 'La plataforma competitiva de Counter-Strike 2 en Argentina.',
    text: 'Proyecto de unos amigos en el que colaboré dándoles una mano con el desarrollo. Matchmaking 5v5 por ELO en LA LIGA, veto de mapas en vivo, rankings, temporadas y anticheat propio del lado del servidor. Se entra con Steam, sin instalar nada, y con servidores en Argentina.',
    tags: ['CS2', 'Matchmaking ELO', 'Anticheat', 'Steam'],
    accent: '#ff3d8b',
  },
] as const;

export const privateProjects = [
  {
    id: 'fc26',
    name: 'FC 26 Resultados',
    kicker: 'Proyecto privado',
    text: 'App para registrar los partidos de EA SPORTS FC 26 con amigos: quién jugó, con qué equipo, goles, marcador en vivo y estadísticas. De uso privado, sin acceso público.',
  },
  {
    id: 'mywallet',
    name: 'MyWallet',
    kicker: 'Proyecto privado',
    text: 'Proyecto propio en desarrollo, de uso privado. Por ahora no tiene demo pública: los detalles quedan bajo llave.',
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
  { year: 'Hoy', title: 'Ingeniero de automatización', text: 'IA, n8n y MCP conectados a los sistemas de la empresa.' },
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
    title: 'E-commerce y pagos',
    logos: ['ecomexperts', 'mercadolibre', 'mercadopago', 'tiendanube'],
  },
  {
    title: 'Código e infraestructura',
    logos: ['typescript', 'node', 'javascript', 'php', 'react', 'angular', 'postgresql', 'mysql', 'docker', 'cloudflare', 'aws', 'wordpress', 'github'],
  },
] as const;

