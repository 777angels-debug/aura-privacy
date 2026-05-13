export interface LanguagePack {
  // Navigation & General
  title: string;
  subtitle: string;
  tagline: string;
  langSwitch: string;
  mainTab: string;
  eduTab: string;
  simTab: string;
  backToMain: string;
  learnMoreBtn: string;
  loadingText: string;
  reAnalyze: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;

  // New surprising keys
  localTimeLabel: string;
  architectureLabel: string;
  touchSupportLabel: string;
  touchYes: string;
  touchNo: string;
  connectionType: string;
  engineDetected: string;

  // Overview / Diagnostics
  anonymityLevel: string;
  anonymityDesc: string;
  trackabilityLevel: string;
  trackabilityDesc: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  statusSafe: string;
  statusWarning: string;
  statusDanger: string;

  // Heatmap Section
  heatmapTitle: string;
  heatmapSubtitle: string;
  heatmapHelp: string;

  // Share Feature
  shareResultBtn: string;
  shareTextTemplate: string;

  // Score Levels
  scoreGood: string;
  scoreWarning: string;
  scoreDanger: string;
  scoreGoodDesc: string;
  scoreWarningDesc: string;
  scoreDangerDesc: string;

  // Categories of Fingerprinting
  catHardware: string;
  catSoftware: string;
  catNetwork: string;
  catGraphics: string;
  catTracking: string;

  // Metrics details & explanations
  canvasTitle: string;
  canvasDesc: string;
  canvasEdu: string;
  
  webglTitle: string;
  webglDesc: string;
  webglEdu: string;

  audioTitle: string;
  audioDesc: string;
  audioEdu: string;

  fontsTitle: string;
  fontsDesc: string;
  fontsEdu: string;

  ipTitle: string;
  ipDesc: string;
  ipEdu: string;

  userAgentTitle: string;
  userAgentDesc: string;
  userAgentEdu: string;

  gpuTitle: string;
  gpuDesc: string;
  gpuEdu: string;

  screenTitle: string;
  screenDesc: string;
  screenEdu: string;

  timezoneTitle: string;
  timezoneDesc: string;
  timezoneEdu: string;

  languagesTitle: string;
  languagesDesc: string;
  languagesEdu: string;

  hardwareTitle: string;
  hardwareDesc: string;
  hardwareEdu: string;

  storageTitle: string;
  storageDesc: string;
  storageEdu: string;

  privacyHeadersTitle: string;
  privacyHeadersDesc: string;
  privacyHeadersEdu: string;

  mathTitle: string;
  mathDesc: string;
  mathEdu: string;

  // Educational content
  howCompaniesUseTitle: string;
  howCompaniesUseSub: string;
  useCaseAd: string;
  useCaseAdDesc: string;
  useCaseFraud: string;
  useCaseFraudDesc: string;
  useCaseBot: string;
  useCaseBotDesc: string;
  useCaseSecurity: string;
  useCaseSecurityDesc: string;

  // Product comparisons
  comparisonTitle: string;
  comparisonSub: string;
  toolName: string;
  toolType: string;
  toolStrengths: string;
  toolAccuracy: string;

  // Code Viewer Labels
  viewCode: string;
  hideCode: string;
  codeExplanation: string;

  // --- SIMULATOR TRANSLATIONS ---
  simTitle: string;
  simSub: string;
  simIntro: string;
  activeShields: string;
  noShieldsActive: string;
  simulatedScore: string;
  simulatedHeatmap: string;
  simUniquenessAlert: string;
  originalLabel: string;
  simulatedLabel: string;
  
  // Simulated Tools
  toolVpnTitle: string;
  toolVpnDesc: string;
  toolVpnImpact: string;
  
  toolTorTitle: string;
  toolTorDesc: string;
  toolTorImpact: string;

  toolBraveTitle: string;
  toolBraveDesc: string;
  toolBraveImpact: string;

  toolAntiDetectTitle: string;
  toolAntiDetectDesc: string;
  toolAntiDetectImpact: string;

  toolFirefoxRfpTitle: string;
  toolFirefoxRfpDesc: string;
  toolFirefoxRfpImpact: string;

  restoreSim: string;
  applyShield: string;
  shieldApplied: string;

  // Footer Disclaimer
  footerDisclaimer: string;

  // Legal Pages
  navPrivacy: string;
  navTerms: string;
  privacyTitle: string;
  privacyContent: string;
  termsTitle: string;
  termsContent: string;
}

export const translations: Record<'en' | 'es', LanguagePack> = {
  en: {
    title: "AURA Privacy",
    subtitle: "Browser Fingerprint",
    tagline: "We instantly decode your silent hardware and network telemetry.",
    langSwitch: "Español",
    mainTab: "Privacy Check",
    eduTab: "Didactic Sandbox & Code",
    simTab: "Anonymity Simulator",
    backToMain: "← Back to Diagnostic",
    learnMoreBtn: "Explore Interactive Sandbox & Explanations",
    loadingText: "Intercepting device metrics & rendering canvas signatures...",
    reAnalyze: "Run Diagnosis Again",

    // SEO
    seoTitle: "AURA Privacy | Browser Fingerprint & Device Intelligence Scanner",
    seoDescription: "Instantly decode your silent hardware and network telemetry. Run a free browser fingerprint test to see your anonymity score, trackability risk, and learn how to defend yourself.",
    seoKeywords: "browser fingerprinting, privacy scanner, canvas fingerprint, webgl unmasked renderer, online tracking test, anti-detect browser simulator, am i trackable",

    // Surprise factors
    localTimeLabel: "Estimated Local Time",
    architectureLabel: "Platform Architecture",
    touchSupportLabel: "Touch Screen Capability",
    touchYes: "Supported (Mobile / Touch Desktop)",
    touchNo: "No Touchscreen Detected",
    connectionType: "Network Profile",
    engineDetected: "Subpixel Engine Signature",

    anonymityLevel: "Anonymity Index",
    anonymityDesc: "How well you blend into the global user crowd. Higher means your configuration is more common and harder to isolate.",
    trackabilityLevel: "Traceability & Device Insights",
    trackabilityDesc: "Your risk of being tracked across sessions without cookies or local storage, using state-of-the-art device profiling.",
    riskLow: "Low Tracking Risk (Common Fingerprint)",
    riskMedium: "Moderate Risk (Semi-Unique Fingerprint)",
    riskHigh: "Severe Risk (Highly Unique / Traceable)",
    statusSafe: "Common / Stealth",
    statusWarning: "Informative / Semi-Unique",
    statusDanger: "Unique / Trackable",

    heatmapTitle: "Fingerprint Heatmap Matrix",
    heatmapSubtitle: "Click on any grid cell to zoom into its detailed analysis, technical description, corporate usage, and core detection code.",
    heatmapHelp: "Orange/Red indicators represent parameters that make your device highly unique. Green indicators represent standard parameters shared with the general public.",

    // Share Feature
    shareResultBtn: "Share Score on X",
    shareTextTemplate: "My browser anonymity score is {score}% on AURA Privacy. Are you trackable? Test your digital footprint here:",

    scoreGood: "Optimal Blend-in",
    scoreWarning: "Partially Trackable",
    scoreDanger: "Instantly Traceable",
    scoreGoodDesc: "Your browser's fingerprint aligns perfectly with massive automated templates (e.g., standard Chrome/Safari profiles). Advertisers and anti-fraud systems cannot easily isolate your session.",
    scoreWarningDesc: "Some elements of your environment (custom font stacks, extensions, or precise WebGL parameters) diverge from standard user bases. Traceability is moderately easy over short spans.",
    scoreDangerDesc: "Your hardware-software combination is extremely distinct (1 in a million). Canvas textures, WebGL pipelines, and sound-wave rendering form a permanent digital serial number.",

    catHardware: "Hardware Profile",
    catSoftware: "Software Context",
    catNetwork: "Network & Origin",
    catGraphics: "Graphics Pipeline",
    catTracking: "Tracking Flags",

    canvasTitle: "Canvas Fingerprinting",
    canvasDesc: "Drawing invisible geometric shapes, text fonts, and color gradients on an offscreen HTML5 canvas to capture pixel-level rendering discrepancies caused by GPU micro-architectures.",
    canvasEdu: "When browser engines draw elements on a canvas, the result is slightly altered by your graphics card drivers, operating system subpixel rendering, and OS-specific anti-aliasing. A hash of this canvas is virtually identical every time you visit, serving as an invisible tracking tag.",

    webglTitle: "WebGL Pipeline & Extensions",
    webglDesc: "Deep hardware probing via the 3D graphics API. Exposes the unmasked GPU vendor, renderer model, specific shader capabilities, and WebGL extensions.",
    webglEdu: "WebGL lets scripts extract your raw graphics card chip name (e.g., Apple M3, Nvidia RTX 4070) and precise floating-point rendering precision characteristics. Because standard virtual machines and anti-detect browsers struggle to spoof this flawlessly without breaking performance, it is highly valued by anti-bot algorithms.",

    audioTitle: "WebAudio Frequency Profile",
    audioDesc: "Synthesizing an acoustic wave behind the scenes, processing it with compressor nodes, and calculating the exact frequency response signature.",
    audioEdu: "WebAudio fingerprinters create an audio oscillator, apply a dynamics compressor, and inspect the resulting buffer. Since sound rendering depends heavily on CPU math precision and specific OS audio drivers, the resulting mathematical hash acts as a unique audio-card fingerprint.",

    fontsTitle: "System Font Enumeration",
    fontsDesc: "Measuring the exact width and height of custom text blocks with fallback fonts to detect which desktop/system fonts are installed on your system.",
    fontsEdu: "Websites can load a hidden container and check the geometry of words styled in 100+ standard and rare fonts. A unique suite of installed office fonts (e.g., Microsoft Office, Adobe Creative Suite, or custom local languages) isolates a user from millions of others instantly.",

    ipTitle: "IP Address & ISP Location",
    ipDesc: "Your public network identity, Autonomous System Number (ASN), ISP, and geographical origin.",
    ipEdu: "Every server you connect to knows your IP. Specialized fraud tools use IP reputation databases to check if your IP belongs to a residential pool, a data center (VPN/Proxy), or a Tor exit node. A mismatch between your browser's local timezone and your IP timezone instantly triggers fraud scores.",

    userAgentTitle: "User-Agent & Client Hints",
    userAgentDesc: "The browser identification header containing browser engine, operating system version, and client details.",
    userAgentEdu: "Historically, the User-Agent was the easiest tracker. Modern browsers are phasing it out in favor of User-Agent Client Hints, which request high-entropy properties like architecture and model, but trackers still reconstruct detailed structures.",

    gpuTitle: "GPU Graphics Card Model",
    gpuDesc: "The unmasked WebGL renderer string indicating the exact model of your computer's graphics hardware.",
    gpuEdu: "Knowing whether you use an integrated Intel UHD chip or a dedicated workstation GPU helps tracking platforms build device profiles and segregate gamers/creators from bot networks running on cheap cloud servers.",

    screenTitle: "Screen Geometry & Multi-Monitor",
    screenDesc: "Total width, height, available workspace (excluding taskbars), device pixel ratio, and color depth.",
    screenEdu: "Your monitor configuration is hard to spoof. Having a non-standard browser window size, dual monitors, or a high-DPI display creates a highly descriptive subset of metrics used to cross-reference your session across websites.",

    timezoneTitle: "Timezone & Locales",
    timezoneDesc: "System timezone, local time offset, and calendar formats configured on your system.",
    timezoneEdu: "Timezones (like Europe/Paris) and system time offsets can be fetched via JavaScript. If a user modifies their browser header to match US English but their system timezone is GMT+1, trackers instantly recognize the spoofing attempt.",

    languagesTitle: "Preferred Languages",
    languagesDesc: "Language priorities set in your browser preferences (`navigator.languages`), defining your primary reading environments.",
    languagesEdu: "The order of preferred languages (e.g., `es-ES,es;q=0.9,en;q=0.8`) is surprisingly unique because it reflects personal origin and custom configurations. This is heavily used to detect fake profiles.",

    hardwareTitle: "CPU Cores & Device Memory",
    hardwareDesc: "Physical/logical processor threads and approximate RAM capacity reported by the browser.",
    hardwareEdu: "Browsers restrict this value to prevent extreme tracking (e.g. reporting standard sizes like 2GB, 4GB, 8GB and core counts like 4, 8, 12). Still, combining these values with graphic benchmarks filters out low-end devices from high-end devices.",

    storageTitle: "Client Storage Capabilites",
    storageDesc: "Checking permission, status, and size limitations for LocalStorage, SessionStorage, IndexedDB, and Service Workers.",
    storageEdu: "While cookies can be cleared easily, stateful trackers store matching tracking IDs inside obscure databases like IndexedDB or cache storage. If they notice the cookie was deleted but the storage contains the ID, they recreate the cookie (respawning/evercookie).",

    privacyHeadersTitle: "Privacy Signals (DNT & GPC)",
    privacyHeadersDesc: "Presence of Do-Not-Track and Global Privacy Control headers signals configured by the user.",
    privacyHeadersEdu: "These flags signal your preference to opt-out of cross-site tracking. While they are useful policy-wise, very few commercial trackers actually respect them, and ironic as it is, having them turned ON acts as another unique bit of information for your fingerprint.",

    mathTitle: "JS Math Constants Precision",
    mathDesc: "Precision margins and trigonometric calculation variations across JavaScript engine interpreters (V8 vs. JavaScriptCore vs. SpiderMonkey).",
    mathEdu: "Computers approximate floating-point operations. Minor compiler design differences between Chrome (V8), Firefox (SpiderMonkey), and Safari (JavaScriptCore) mean that complex mathematical operations like `Math.sin()` or `Math.tan()` yield different micro-decimal residues. This exposes your true browser engine regardless of User-Agent spoofing.",

    // Educational content
    howCompaniesUseTitle: "How Do Corporations & Trackers Use This Information?",
    howCompaniesUseSub: "Browser profiling is a double-edged sword. It is used to protect infrastructure, but also to violate privacy without consent.",
    useCaseAd: "Targeted Advertising & Profiling",
    useCaseAdDesc: "Commercial advertisers build silent, cookie-less profiles. By linking your browser fingerprint with your search and purchase habits across partner networks, they can show targeted ads even if you browse in Incognito mode and clear your cookies daily.",
    useCaseFraud: "Anti-Fraud & Risk Scoring",
    useCaseFraudDesc: "Banks, e-commerce giants, and payment processors (Stripe, PayPal) inspect your hardware consistency. If you log into your bank account with a browser fingerprint that has changed drastically overnight, or from an IP linked to a proxy while your timezone is mismatched, you will face multi-factor authentication or an outright block.",
    useCaseBot: "Anti-Bot & Scraping Mitigation",
    useCaseBotDesc: "Platforms like Cloudflare, Akamai, and Datadome analyze your WebGL, canvas, and system fonts. Scraping bots running on Puppeteer, Playwright, or Selenium have distinct browser fingerprints (missing WebAudio features, generic virtual GPUs, or specific math precision). When these are detected, users are hit with interactive CAPTCHAs.",
    useCaseSecurity: "Account Takeover Prevention",
    useCaseSecurityDesc: "Major platforms like Google and Meta use fingerprinting to verify session authenticity. If a malicious actor steals your cookies via malware, their hardware profile will not match yours, prompting the system to invalidate the stolen session.",

    comparisonTitle: "The Anatomy of Fingerprinting Tools",
    comparisonSub: "How industry-standard device intelligence libraries and anti-detect browsers handle your device fingerprint.",
    toolName: "Platform",
    toolType: "Type",
    toolStrengths: "Detection Depth & Core Tactics",
    toolAccuracy: "Identification Accuracy",

    viewCode: "View Detection Code (JS)",
    hideCode: "Hide Code",
    codeExplanation: "This JavaScript code runs directly inside your browser to extract this parameter. No cookies, databases, or tracking scripts are required to access this hardware context.",

    // --- SIMULATOR TRANSLATIONS ---
    simTitle: "Anonymity & Spoofing Simulator",
    simSub: "Activate advanced browser shields to see how modern device intelligence systems react in real time.",
    simIntro: "Select one or more professional privacy configurations below. See how your Anonymity Score increases, how trackers get confused, and how your Heatmap cells heal into uniform green blocks.",
    activeShields: "Active Privacy Toggles",
    noShieldsActive: "No Active Shields. Your browser footprint is raw, unique, and fully traceable.",
    simulatedScore: "Simulated Anonymity Index",
    simulatedHeatmap: "Simulated Fingerprint Heatmap",
    simUniquenessAlert: "Note: Some privacy shields (like Canvas Spoofers) intentionally inject random noise. This makes your fingerprint unique on every refresh, confusing cross-site trackers!",
    originalLabel: "Original Real Signature",
    simulatedLabel: "Simulated Shielded Signature",

    toolVpnTitle: "VPN & Residential Proxy",
    toolVpnDesc: "Masks your raw public IP address with a residential node and synchronizes your timezone context.",
    toolVpnImpact: "Heals: IP address, ISP, timezone mismatches.",

    toolTorTitle: "Tor Browser Strict Mode",
    toolTorDesc: "Forces standard Canvas dimensions, disables raw WebGL GPU extensions, masks all custom system fonts, and locks the timezone to UTC.",
    toolTorImpact: "Heals: Canvas, WebGL model, Fonts, WebAudio, Screen size, Timezone.",

    toolBraveTitle: "Brave Browser Shields ON",
    toolBraveDesc: "Applies session-based FARBLING (random noise injection) to Canvas drawings and WebAudio math loops to confuse persistent tracking hashes.",
    toolBraveImpact: "Heals: Canvas, WebAudio, Client Hints.",

    toolAntiDetectTitle: "Professional Anti-Detect Browser",
    toolAntiDetectDesc: "Spoofs complete hardware profiles. Adjusts reported CPU cores, RAM limits, screen geometries, and unmasks generic enterprise GPUs (e.g. NVIDIA Quadro).",
    toolAntiDetectImpact: "Heals: GPU Model, CPU Cores, RAM, Screen geometry.",

    toolFirefoxRfpTitle: "Firefox Resist Fingerprinting (RFP)",
    toolFirefoxRfpDesc: "Locks inner window resolution to rounded multiples (e.g., 1000x1000), resets language to US English, and hides advanced hardware flags.",
    toolFirefoxRfpImpact: "Heals: Screen resolution, Preferred languages, Hardware details.",

    restoreSim: "Reset Simulation",
    applyShield: "Toggle Shield",
    shieldApplied: "Shield Active",

    footerDisclaimer: "Privacy Notice: All diagnostic probes run locally inside your browser memory. No telemetry, IP addresses, or hardware signatures are transmitted, stored, or processed on any remote server.",

    // Legal Pages
    navPrivacy: "Privacy Policy",
    navTerms: "Terms of Service",
    privacyTitle: "Privacy Policy",
    privacyContent: "AURA Privacy ('we', 'our', or 'us') respects your privacy. This tool acts as an educational scanner. \n\n1. Data Collection: We do NOT collect, store, or transmit your IP address, browser fingerprint, or any personal data to our servers. All diagnostics are processed locally in your browser.\n\n2. Cookies & Local Storage: We currently do not use persistent cookies for tracking. \n\n3. Third-party APIs: We use public APIs (like ipapi.co) solely to demonstrate to you what your network leaks. We do not store this response.\n\n4. Updates: We may update this policy occasionally to comply with legal requirements.",
    termsTitle: "Terms of Service",
    termsContent: "By using AURA Privacy, you agree to these terms.\n\n1. Educational Purpose: This tool is provided 'as is' for educational and diagnostic purposes only. It is designed to demonstrate browser tracking techniques.\n\n2. No Guarantee: While we strive for accuracy, the 'Anonymity Score' is an estimation based on known tracking vectors. A high score does not guarantee absolute immunity from advanced corporate tracking or law enforcement.\n\n3. Lawful Use: You agree not to use insights gained from this tool to bypass security systems, commit fraud, or engage in malicious activities.\n\n4. Affiliate Links: Some external links in our simulator or educational sections may be affiliate links. We may earn a commission if you purchase products through these links, at no extra cost to you."
  },
  es: {
    title: "AURA Privacy",
    subtitle: "Huella de Navegador",
    tagline: "Decodificamos instantáneamente la telemetría silenciosa de tu hardware y de tu red.",
    langSwitch: "English",
    mainTab: "Prueba de Privacidad",
    eduTab: "Sandbox Didáctico y Código",
    simTab: "Simulador de Anonimato",
    backToMain: "← Volver al Diagnóstico",
    learnMoreBtn: "Explorar Sandbox Interactivo y Explicaciones",
    loadingText: "Interceptando métricas del dispositivo y generando firmas de lienzo...",
    reAnalyze: "Volver a Analizar",

    // SEO
    seoTitle: "AURA Privacy | Escáner de Huella Digital de Navegador y Privacidad",
    seoDescription: "Decodifica instantáneamente la telemetría silenciosa de tu hardware y red. Realiza una prueba de huella digital para descubrir tu nivel de anonimato y riesgo de rastreo web.",
    seoKeywords: "huella digital navegador, browser fingerprinting español, prueba de privacidad, canvas fingerprint, rastreo web, simulador de anonimato, detectar vpn proxy",

    // Surprise factors
    localTimeLabel: "Hora Local Estimada",
    architectureLabel: "Arquitectura de Plataforma",
    touchSupportLabel: "Pantalla Táctil Detectada",
    touchYes: "Compatible (Dispositivo Móvil / Laptop Táctil)",
    touchNo: "No se detecta soporte táctil",
    connectionType: "Perfil de Conexión de Red",
    engineDetected: "Firma de Subpíxeles del Motor",

    anonymityLevel: "Índice de Anonimato",
    anonymityDesc: "Qué tan bien te mezclas con la multitud global de usuarios. Un valor más alto significa que tu configuración es más común y difícil de aislar.",
    trackabilityLevel: "Rastreabilidad y Revelaciones Clave",
    trackabilityDesc: "Tu riesgo de ser rastreado entre sesiones sin cookies ni almacenamiento local, utilizando perfiles de dispositivo de última generación.",
    riskLow: "Riesgo de Rastreo Bajo (Huella Común)",
    riskMedium: "Riesgo Moderado (Huella Semi-Única)",
    riskHigh: "Riesgo Crítico (Huella Altamente Única / Identificable)",
    statusSafe: "Común / Oculto",
    statusWarning: "Informativo / Semi-Único",
    statusDanger: "Único / Rastreable",

    heatmapTitle: "Matriz de Calor de la Huella Digital",
    heatmapSubtitle: "Haz clic en cualquier celda de la cuadrícula para hacer zoom en su análisis detallado, descripción técnica, uso corporativo y código de detección.",
    heatmapHelp: "Los indicadores naranja/rojo representan parámetros que hacen que tu dispositivo sea muy único. Los indicadores verdes representan parámetros estándar compartidos por el público general.",

    // Share Feature
    shareResultBtn: "Compartir en X",
    shareTextTemplate: "Mi nivel de anonimato es del {score}% en AURA Privacy. ¿Eres rastreable por las empresas? Haz la prueba de huella digital aquí:",

    scoreGood: "Mezcla Óptima",
    scoreWarning: "Parcialmente Rastreable",
    scoreDanger: "Rastreable Instantáneamente",
    scoreGoodDesc: "La huella digital de tu navegador se alinea perfectamente con plantillas automatizadas masivas (por ejemplo, perfiles estándar de Chrome/Safari). Los anunciantes y sistemas anti-fraude no pueden aislar fácilmente tu sesión.",
    scoreWarningDesc: "Algunos elementos de tu entorno (fuentes personalizadas, extensiones o parámetros precisos de WebGL) difieren de las bases de usuarios estándar. La rastreabilidad es moderadamente fácil en lapsos cortos.",
    scoreDangerDesc: "Tu combinación de hardware y software es extremadamente distinta (1 en un millón). Las texturas de Canvas, los pipelines de WebGL y el renderizado de ondas de sonido forman un número de serie digital permanente.",

    catHardware: "Perfil de Hardware",
    catSoftware: "Contexto de Software",
    catNetwork: "Red y Origen",
    catGraphics: "Pipeline Gráfico",
    catTracking: "Flags de Rastreo",

    canvasTitle: "Canvas Fingerprinting (Lienzo)",
    canvasDesc: "Dibujo invisible de formas geométricas, fuentes de texto y gradientes de color en un lienzo HTML5 oculto para capturar discrepancias de renderizado a nivel de píxel causadas por microarquitecturas de GPU.",
    canvasEdu: "Cuando los motores de los navegadores dibujan elementos en un lienzo, el resultado se altera ligeramente por los controladores de la tarjeta gráfica, el renderizado de subpíxeles del sistema operativo y el suavizado de fuentes. Un hash de este lienzo es prácticamente idéntico cada vez que visitas una web, sirviendo como etiqueta de rastreo invisible.",

    webglTitle: "Pipeline de WebGL y Extensiones",
    webglDesc: "Sondeo profundo de hardware a través de la API de gráficos 3D. Expone el fabricante de GPU no enmascarado, modelo de renderizador, capacidades específicas de sombreadores y extensiones WebGL.",
    webglEdu: "WebGL permite a los scripts extraer el nombre real del chip de tu tarjeta gráfica (por ejemplo, Apple M3, Nvidia RTX 4070) y características precisas de precisión de renderizado de coma flotante. Dado que las máquinas virtuales estándar y los navegadores anti-detección luchan por suplantar esto perfectamente sin perder rendimiento, es sumamente valorado por los algoritmos anti-bot.",

    audioTitle: "Perfil de Frecuencia WebAudio",
    audioDesc: "Sintetizar una onda acústica en segundo plano, procesarla con nodos de compresión y calcular la firma exacta de respuesta de frecuencia.",
    audioEdu: "Los rastreadores de WebAudio crean un oscilador de audio, aplican un compresor de dinámica e inspeccionan el búfer resultante. Como el renderizado de sonido depende en gran medida de la precisión matemática de la CPU y controladores de audio del SO, el hash matemático resultante actúa como una huella digital única de la tarjeta de sonido.",

    fontsTitle: "Enumeración de Fuentes de Sistema",
    fontsDesc: "Medición del ancho y alto exactos de bloques de texto con fuentes de respaldo para detectar qué fuentes de escritorio/sistema están instaladas en tu sistema.",
    fontsEdu: "Los sitios web pueden cargar un contenedor oculto y comprobar la geometría de las palabras usando más de 100 fuentes comunes y raras. Un conjunto único de fuentes de oficina instaladas (como Microsoft Office, Adobe Creative Suite o idiomas locales personalizados) aísla a un usuario de millones de otros al instante.",

    ipTitle: "Dirección IP y Ubicación ISP",
    ipDesc: "Tu identidad de red pública, Número de Sistema Autónomo (ASN), proveedor de servicios de Internet (ISP) y origen geográfico.",
    ipEdu: "Cada servidor al que te conectas conoce tu IP. Las herramientas de fraude especializadas utilizan bases de datos de reputación de IP para verificar si pertenece a un pool residencial, un centro de datos (VPN/Proxy) o un nodo de salida de Tor. Un desfase entre la zona horaria del navegador y la de la IP dispara las alertas de fraude.",

    userAgentTitle: "User-Agent y Client Hints",
    userAgentDesc: "La cabecera de identificación del navegador que contiene el motor, versión del sistema operativo y detalles del cliente.",
    userAgentEdu: "Históricamente, el User-Agent era el rastreador más fácil. Los navegadores modernos lo están eliminando en favor de las 'Client Hints' de User-Agent, que solicitan propiedades de alta entropía como arquitectura y modelo, pero los rastreadores aún reconstruyen estructuras detalladas.",

    gpuTitle: "Modelo de Tarjeta Gráfica GPU",
    gpuDesc: "La cadena de renderizador WebGL no enmascarada que indica el modelo exacto de hardware gráfico de tu ordenador.",
    gpuEdu: "Saber si usas un chip Intel UHD integrado o una GPU dedicada de estación de trabajo ayuda a las plataformas de rastreo a construir perfiles de dispositivo y segregar a jugadores/creadores de redes de bots que se ejecutan en servidores en la nube baratos.",

    screenTitle: "Geometría de Pantalla y Monitores",
    screenDesc: "Ancho total, alto, espacio de trabajo disponible (excluyendo barras de tareas), relación de píxeles del dispositivo y profundidad de color.",
    screenEdu: "La configuración de tu monitor es difícil de falsificar. Tener una ventana de navegador no estándar, monitores duales o una pantalla de alta densidad de píxeles crea un subconjunto altamente descriptivo de métricas utilizadas para cruzar referencias de tu sesión en múltiples webs.",

    timezoneTitle: "Zona Horaria y Regiones",
    timezoneDesc: "Zona horaria del sistema, desfase de hora local y formatos de calendario configurados en tu sistema.",
    timezoneEdu: "Las zonas horarias (como Europe/Paris) y los desvíos de hora del sistema se pueden obtener mediante JavaScript. Si un usuario modifica su cabecera para simular inglés de EE.UU. pero su zona horaria del sistema es GMT+1, los rastreadores reconocen instantáneamente el intento de engaño.",

    languagesTitle: "Idiomas Preferidos",
    languagesDesc: "Prioridades de idioma establecidas en las preferencias de tu navegador (`navigator.languages`), que definen tus entornos de lectura principales.",
    languagesEdu: "El orden de idiomas preferidos (por ejemplo, `es-ES,es;q=0.9,en;q=0.8`) es sorprendentemente único porque refleja el origen personal y las configuraciones del usuario. Se utiliza mucho para detectar perfiles falsos.",

    hardwareTitle: "Núcleos de CPU y Memoria",
    hardwareDesc: "Hilos de procesamiento físico/lógico y capacidad de RAM aproximada reportada por el navegador.",
    hardwareEdu: "Los navegadores restringen este valor para evitar un rastreo extremo (por ejemplo, reportando tamaños estándar como 2GB, 4GB, 8GB y recuentos de núcleos como 4, 8, 12). Aún así, combinar estos valores con pruebas de rendimiento gráfico ayuda a filtrar dispositivos de gama baja frente a los de gama alta.",

    storageTitle: "Capacidades de Almacenamiento",
    storageDesc: "Comprobación del estado, permisos y límites de tamaño de LocalStorage, SessionStorage, IndexedDB y Service Workers.",
    storageEdu: "Aunque las cookies se pueden borrar fácilmente, los rastreadores con estado almacenan IDs de seguimiento coincidentes dentro de bases de datos oscuras como IndexedDB o el almacenamiento de caché. Si notan que la cookie se borró pero el almacenamiento contiene la ID, vuelven a crear la cookie (respawning/evercookie).",

    privacyHeadersTitle: "Señales de Privacidad (DNT y GPC)",
    privacyHeadersDesc: "Presencia de señales de cabecera Do-Not-Track y Global Privacy Control configuradas por el usuario.",
    privacyHeadersEdu: "Estos flags señalan tu preferencia de autoexclusión del rastreo entre sitios. Aunque son útiles a nivel de políticas, muy pocos rastreadores comerciales las respetan realmente, e irónicamente, tenerlas activadas actúa como otra pista única para tu huella digital.",

    mathTitle: "Precisión de Constantes Matemáticas JS",
    mathDesc: "Márgenes de precisión y variaciones de cálculo trigonométrico entre intérpretes de motores JavaScript (V8 vs. JavaScriptCore vs. SpiderMonkey).",
    mathEdu: "Los ordenadores aproximan las operaciones de coma flotante. Pequeñas diferencias de diseño de compiladores entre Chrome (V8), Firefox (SpiderMonkey) y Safari (JavaScriptCore) significan que operaciones matemáticas complejas como `Math.sin()` o `Math.tan()` rinden residuos microdecimales distintos. Esto expone tu verdadero motor de navegador sin importar la simulación del User-Agent.",

    // Educational content
    howCompaniesUseTitle: "¿Cómo usan las Corporaciones y Rastreadores esta Información?",
    howCompaniesUseSub: "El perfilado de navegadores es un arma de doble filo. Se utiliza para proteger infraestructuras, pero también para violar la privacidad sin consentimiento.",
    useCaseAd: "Publicidad Dirigida y Perfiles de Consumo",
    useCaseAdDesc: "Los anunciantes comerciales construyen perfiles silenciosos y sin cookies. Al vincular tu huella digital con tus hábitos de búsqueda y compra a través de redes asociadas, pueden mostrarte anuncios dirigidos incluso si navegas en modo Incógnito y borras tus cookies a diario.",
    useCaseFraud: "Anti-Fraude y Puntuación de Riesgo",
    useCaseFraudDesc: "Bancos, gigantes del comercio electrónico y procesadores de pagos (Stripe, PayPal) inspeccionan la consistencia del hardware. Si inicia sesión en tu banco con una huella que cambió drásticamente de la noche a la mañana, o desde una IP de proxy con desfase de zona horaria, se disparará una verificación multifactor o un bloqueo preventivo.",
    useCaseBot: "Anti-Bot y Mitigación de Scraping",
    useCaseBotDesc: "Plataformas como Cloudflare, Akamai y Datadome analizan tu WebGL, canvas y fuentes del sistema. Los bots de raspado que corren sobre Puppeteer, Playwright o Selenium tienen huellas de navegador muy características (ausencia de funciones de audio, GPU virtuales genéricas, o diferencias en precisión matemática). Al detectarlas, se les exige resolver CAPTCHAs.",
    useCaseSecurity: "Prevención de Robo de Cuentas",
    useCaseSecurityDesc: "Las principales plataformas como Google y Meta utilizan huellas digitales para verificar la autenticidad de las sesiones. Si un atacante roba tus cookies mediante malware, su perfil de hardware no coincidirá con el tuyo, lo que obligará al sistema a invalidar la sesión robada.",

    comparisonTitle: "Anatomía de las Herramientas de Huella Digital",
    comparisonSub: "Cómo gestionan la huella digital de tu dispositivo las librerías de inteligencia de dispositivos y navegadores anti-detect estándar de la industria.",
    toolName: "Plataforma",
    toolType: "Tipo",
    toolStrengths: "Profundidad de Detección y Tácticas Clave",
    toolAccuracy: "Precisión de Identificación",

    viewCode: "Ver Código de Detección (JS)",
    hideCode: "Ocultar Código",
    codeExplanation: "Este código de JavaScript se ejecuta directamente en tu navegador para extraer este parámetro. No requiere cookies, bases de datos ni scripts de rastreo para acceder a este contexto de hardware.",

    // --- SIMULATOR TRANSLATIONS ---
    simTitle: "Simulador de Anonimato y Spoofing",
    simSub: "Activa escudos avanzados de privacidad para comprobar en tiempo real cómo reaccionan las herramientas de rastreo.",
    simIntro: "Selecciona una o más configuraciones de privacidad profesional a continuación. Observa cómo aumenta tu índice de anonimato, cómo se confunden los rastreadores y cómo las celdas de tu mapa de calor se curan en bloques verdes estándar.",
    activeShields: "Escudos de Privacidad Activos",
    noShieldsActive: "Ningún escudo activo. Tu huella digital de navegador está expuesta, única y es completamente rastreable.",
    simulatedScore: "Índice de Anonimato Simulado",
    simulatedHeatmap: "Matriz de Calor Simulada",
    simUniquenessAlert: "Nota: Algunos escudos profesionales (como los Canvas Spoofers) inyectan ruido aleatorio de forma deliberada. Esto hace que tu huella sea diferente en cada recarga, ¡lo que inutiliza el rastreo permanente entre sitios web!",
    originalLabel: "Firma Real Original",
    simulatedLabel: "Firma Simulada con Escudo",

    toolVpnTitle: "VPN y Proxy Residencial",
    toolVpnDesc: "Oculta tu dirección IP pública real mediante un nodo residencial y sincroniza el contexto de tu zona horaria para evitar discrepancias.",
    toolVpnImpact: "Cura: Dirección IP, proveedor ISP y desfase de zona horaria.",

    toolTorTitle: "Modo Estricto de Tor Browser",
    toolTorDesc: "Fuerza dimensiones de Canvas estándar unificadas, deshabilita extensiones avanzadas de WebGL, enmascara fuentes y bloquea la hora del sistema a UTC.",
    toolTorImpact: "Cura: Canvas, Modelo WebGL, Fuentes, WebAudio, Resolución, Zona horaria.",

    toolBraveTitle: "Escudos de Brave Browser ACTIVOS",
    toolBraveDesc: "Aplica FARBLING (inyección de ruido aleatorio en cada sesión) a los dibujos de Canvas y loops matemáticos de WebAudio para romper los hashes de rastreo.",
    toolBraveImpact: "Cura: Canvas, WebAudio, Client Hints del navegador.",

    toolAntiDetectTitle: "Navegador Anti-Detect Profesional",
    toolAntiDetectDesc: "Suplanta perfiles completos de hardware. Ajusta núcleos de CPU reportados, límites de RAM, geometrías de pantalla y unifica GPU corporativas genéricas.",
    toolAntiDetectImpact: "Cura: Modelo de GPU, núcleos CPU, RAM simulada y resolución de pantalla.",

    toolFirefoxRfpTitle: "Resist Fingerprinting de Firefox (RFP)",
    toolFirefoxRfpDesc: "Bloquea la resolución interna a múltiplos redondeados (ej. 1000x1000), resetea idiomas preferidos a Inglés de EE.UU. y oculta banderas avanzadas.",
    toolFirefoxRfpImpact: "Cura: Resolución de pantalla, idiomas preferidos y telemetría de hardware.",

    restoreSim: "Restablecer Simulación",
    applyShield: "Alternar Escudo",
    shieldApplied: "Escudo Activo",

    footerDisclaimer: "Aviso de Privacidad: Todos los diagnósticos se ejecutan localmente en la memoria de tu navegador. Ningún dato, dirección IP ni firma de hardware se guarda, transmite o procesa en ningún servidor externo.",

    // Legal Pages
    navPrivacy: "Política de Privacidad",
    navTerms: "Términos de Servicio",
    privacyTitle: "Política de Privacidad",
    privacyContent: "AURA Privacy ('nosotros', 'nuestro') respeta su privacidad. Esta herramienta actúa como un escáner educativo.\n\n1. Recopilación de Datos: NO recopilamos, almacenamos ni transmitimos su dirección IP, huella digital ni datos personales a nuestros servidores. Todos los diagnósticos se procesan localmente.\n\n2. Cookies: Actualmente no utilizamos cookies persistentes para seguimiento.\n\n3. APIs de Terceros: Utilizamos APIs públicas (como ipapi.co) únicamente para demostrarle lo que filtra su red. No guardamos esta respuesta.\n\n4. Actualizaciones: Podemos actualizar esta política ocasionalmente para cumplir con las normativas legales.",
    termsTitle: "Términos de Servicio",
    termsContent: "Al utilizar AURA Privacy, aceptas estos términos.\n\n1. Propósito Educativo: Esta herramienta se proporciona 'tal cual' solo con fines educativos y de diagnóstico.\n\n2. Sin Garantías: Aunque nos esforzamos por la precisión, el 'Índice de Anonimato' es una estimación. Un puntaje alto no garantiza inmunidad absoluta contra el rastreo corporativo avanzado.\n\n3. Uso Lícito: Aceptas no utilizar los conocimientos obtenidos de esta herramienta para eludir sistemas de seguridad, cometer fraudes o participar en actividades maliciosas.\n\n4. Enlaces de Afiliados: Algunos enlaces externos pueden ser enlaces de afiliados. Podríamos ganar una comisión si compras productos a través de ellos, sin costo adicional para ti."
  }
};
