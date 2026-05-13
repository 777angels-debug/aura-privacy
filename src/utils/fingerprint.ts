// Browser Fingerprint & Device Intelligence Diagnostic utilities
// Real-time hardware, software, graphics, audio, and network telemetry.

export interface FingerprintData {
  // Network
  ipAddress: string;
  country: string;
  city: string;
  isp: string;
  vpnProxyDetected: boolean;

  // Software / UA
  userAgent: string;
  browserName: string;
  browserVersion: string;
  operatingSystem: string;
  languages: string[];
  timezone: string;
  timezoneOffset: number;

  // Hardware
  cpuCores: number;
  deviceMemory: number | string; // GB
  screenResolution: string;
  screenAvailable: string;
  colorDepth: number;
  pixelRatio: number;
  touchPoints: number;

  // Graphics
  canvasHash: string;
  canvasTimeMs: number;
  webglVendor: string;
  webglRenderer: string;
  webglVersion: string;
  webglExtensionsCount: number;
  
  // Audio
  webAudioHash: string;

  // Fonts
  installedFonts: string[];
  totalFontsChecked: number;

  // Storage
  localStorageEnabled: boolean;
  sessionStorageEnabled: boolean;
  indexedDbEnabled: boolean;

  // Security Flags
  doNotTrack: boolean | string;
  gpcEnabled: boolean | string;

  // Advanced / Math
  mathPrecisionHash: string;
}

// Simple fast string hashing (Fowler-Noll-Vo or djb2 style)
export function calculateHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash).toString(16).toUpperCase();
}

// 1. Canvas Fingerprinting (Real execution)
function getCanvasFingerprint(): { hash: string; duration: number } {
  const start = performance.now();
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { hash: "UNSUPPORTED", duration: 0 };

    // Background pattern
    ctx.fillStyle = "#f60";
    ctx.fillRect(10, 10, 100, 40);

    // Text with specific fonts, sizes, and colors
    ctx.fillStyle = "#069";
    ctx.font = "11pt no-real-font-123, Arial";
    ctx.textBaseline = "top";
    ctx.fillText("AURA-Fingerprint, 🧬 💻", 12, 12);

    // Additional geometric complexity
    ctx.strokeStyle = "rgba(102, 204, 0, 0.7)";
    ctx.beginPath();
    ctx.arc(140, 30, 20, 0, Math.PI * 2, true);
    ctx.stroke();

    // Adding shadow and rotation to force subpixel render discrepancies
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.fillStyle = "#A30000";
    ctx.fillText("🎨 Canvas 3D", 80, 28);

    const dataUrl = canvas.toDataURL();
    const hash = calculateHash(dataUrl);
    const end = performance.now();
    return { hash, duration: Math.round(end - start) };
  } catch (e) {
    return { hash: "BLOCKED_OR_FAILED", duration: 0 };
  }
}

// 2. WebGL Fingerprinting (Real GPU hardware extraction)
function getWebGLDetails(): {
  vendor: string;
  renderer: string;
  version: string;
  extensionsCount: number;
} {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      return { vendor: "UNSUPPORTED", renderer: "UNSUPPORTED", version: "UNSUPPORTED", extensionsCount: 0 };
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const vendor = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);
    const version = gl.getParameter(gl.VERSION);
    const extensions = gl.getSupportedExtensions() || [];

    return {
      vendor: String(vendor || "UNKNOWN"),
      renderer: String(renderer || "UNKNOWN"),
      version: String(version || "UNKNOWN"),
      extensionsCount: extensions.length,
    };
  } catch (e) {
    return { vendor: "BLOCKED", renderer: "BLOCKED", version: "BLOCKED", extensionsCount: 0 };
  }
}

// 3. WebAudio Fingerprinting
async function getWebAudioFingerprint(): Promise<string> {
  return new Promise((resolve) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        resolve("NOT_SUPPORTED");
        return;
      }

      // We use OfflineAudioContext so we don't play actual audible sounds to the user
      const context = new OfflineAudioContext(1, 44100, 44100);
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = 10000;

      const compressor = context.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-50, 0);
      compressor.knee.setValueAtTime(40, 0);
      compressor.ratio.setValueAtTime(12, 0);
      compressor.attack.setValueAtTime(0, 0);
      compressor.release.setValueAtTime(0.25, 0);

      oscillator.connect(compressor);
      compressor.connect(context.destination);
      oscillator.start(0);

      context.startRendering().then((renderedBuffer) => {
        try {
          const audioData = renderedBuffer.getChannelData(0);
          // Sample a subset of the output array to generate a unique numeric summary
          let sum = 0;
          for (let i = 4000; i < 4500; i++) {
            if (audioData[i] !== undefined) {
              sum += Math.abs(audioData[i]);
            }
          }
          resolve(calculateHash(sum.toString()));
        } catch (e) {
          resolve("RENDER_FAILED");
        }
      }).catch(() => {
        resolve("OFFLINE_CONTEXT_BLOCKED");
      });
    } catch (e) {
      resolve("CONTEXT_FAILED");
    }
  });
}

// 4. System Font Enumeration (Checks for 12 standard + distinct fonts)
function getInstalledFonts(): string[] {
  const fontList = [
    "Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Comic Sans MS", 
    "Trebuchet MS", "Impact", "Consolas", "Calibri", "Segoe UI", "Helvetica", "Roboto", "Palatino"
  ];
  
  const detected: string[] = [];
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return ["Arial"]; // Fallback if no canvas context

    // Baseline size of a fallback font to check against
    ctx.font = "72px monospace";
    const baselineWidth = ctx.measureText("abcdefghijklmnopqrstuvwxyz0123456789").width;

    fontList.forEach((font) => {
      // Draw with requested font falling back to monospace
      ctx.font = `72px "${font}", monospace`;
      const testWidth = ctx.measureText("abcdefghijklmnopqrstuvwxyz0123456789").width;
      
      // If the width differs from monospace fallback, the browser parsed and rendered the custom font!
      if (testWidth !== baselineWidth) {
        detected.push(font);
      }
    });
  } catch (e) {
    // Ignore error
  }
  return detected.length > 0 ? detected : ["Arial", "Courier New"];
}

// 5. JavaScript Math Constants Precision (highly indicative of JS Engine)
function getMathPrecisionHash(): string {
  try {
    const values = [
      Math.sin(1),
      Math.cos(1),
      Math.tan(1),
      Math.asin(1),
      Math.acos(0.5),
      Math.atan(1),
      Math.sinh(1),
      Math.cosh(1),
      Math.tanh(1),
      Math.log(2),
      Math.exp(1)
    ];
    // Create a precise string containing high decimals
    const strVal = values.map(v => v.toPrecision(30)).join(",");
    return calculateHash(strVal);
  } catch (e) {
    return "MATH_ERROR";
  }
}

// Main fingerprint collector
export async function collectFingerprint(): Promise<FingerprintData> {
  // Canvas
  const canvasInfo = getCanvasFingerprint();

  // WebGL
  const webglInfo = getWebGLDetails();

  // WebAudio
  const audioHash = await getWebAudioFingerprint();

  // Fonts
  const fonts = getInstalledFonts();

  // Math Precision
  const mathHash = getMathPrecisionHash();

  // Storage tests
  let localStorageEnabled = false;
  let sessionStorageEnabled = false;
  let indexedDbEnabled = false;
  try {
    localStorageEnabled = !!window.localStorage;
    sessionStorageEnabled = !!window.sessionStorage;
    indexedDbEnabled = !!window.indexedDB;
  } catch (e) {
    // blocked or security restrictions
  }

  // Privacy Signals
  const doNotTrack = navigator.doNotTrack || (window as any).doNotTrack || "unspecified";
  const gpcEnabled = (navigator as any).globalPrivacyControl !== undefined 
    ? String((navigator as any).globalPrivacyControl) 
    : "unspecified";

  // Browser engine & system details extraction
  const ua = navigator.userAgent;
  let browserName = "Unknown";
  let browserVersion = "Unknown";
  let os = "Unknown";

  // Detect Browser
  if (ua.indexOf("Firefox") > -1) {
    browserName = "Firefox";
    const match = ua.match(/Firefox\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("SamsungBrowser") > -1) {
    browserName = "Samsung Browser";
    const match = ua.match(/SamsungBrowser\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    browserName = "Opera";
    const match = ua.match(/(?:Opera|OPR)\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) {
    browserName = "Microsoft Edge";
    const match = ua.match(/(?:Edge|Edg)\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Chrome") > -1) {
    browserName = "Google Chrome";
    const match = ua.match(/Chrome\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.indexOf("Safari") > -1) {
    browserName = "Safari";
    const match = ua.match(/Version\/([0-9.]+)/);
    if (match) browserVersion = match[1];
  }

  // Detect OS
  if (ua.indexOf("Windows") > -1) os = "Windows";
  else if (ua.indexOf("Macintosh") > -1 || ua.indexOf("Mac OS") > -1) os = "macOS";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";

  // Try to fetch real IP & geo location details with a 3.2-second timeout
  let ipDetails = {
    ip: "Blocked by Adblocker / Shield",
    country: "Unknown",
    city: "Unknown",
    isp: "Secure Browser Sandbox/VPN",
    vpnProxy: false
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3200);
    
    // Fetch geo & IP metadata
    const response = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      ipDetails = {
        ip: data.ip || "Unknown IP",
        country: data.country_name || "Unknown Country",
        city: data.city || "Unknown City",
        isp: data.org || "Unknown ISP",
        vpnProxy: data.vpn || data.proxy || false
      };
    }
  } catch (err) {
    // Failed (mostly due to AdBlockers or Offline environment)
    console.log("IP API request aborted or failed. This represents strong client shields.");
  }

  return {
    ipAddress: ipDetails.ip,
    country: ipDetails.country,
    city: ipDetails.city,
    isp: ipDetails.isp,
    vpnProxyDetected: ipDetails.vpnProxy,

    userAgent: ua,
    browserName,
    browserVersion,
    operatingSystem: os,
    languages: [...(navigator.languages || [navigator.language])],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    timezoneOffset: new Date().getTimezoneOffset(),

    cpuCores: navigator.hardwareConcurrency || 4,
    deviceMemory: (navigator as any).deviceMemory || "Not Shared",
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    screenAvailable: `${window.screen.availWidth}x${window.screen.availHeight}`,
    colorDepth: window.screen.colorDepth || 24,
    pixelRatio: window.devicePixelRatio || 1,
    touchPoints: navigator.maxTouchPoints || 0,

    canvasHash: canvasInfo.hash,
    canvasTimeMs: canvasInfo.duration,
    webglVendor: webglInfo.vendor,
    webglRenderer: webglInfo.renderer,
    webglVersion: webglInfo.version,
    webglExtensionsCount: webglInfo.extensionsCount,

    webAudioHash: audioHash,

    installedFonts: fonts,
    totalFontsChecked: fonts.length,

    localStorageEnabled,
    sessionStorageEnabled,
    indexedDbEnabled,

    doNotTrack,
    gpcEnabled,

    mathPrecisionHash: mathHash,
  };
}

// Explanations & Javascript extraction code strings for didactic viewing
export interface MetricMeta {
  titleKey: string;
  descKey: string;
  eduKey: string;
  category: "hardware" | "software" | "network" | "graphics" | "tracking";
  importance: "high" | "medium" | "low";
  codeSnippet: string;
}

export const METRICS_META: Record<string, MetricMeta> = {
  canvas: {
    titleKey: "canvasTitle",
    descKey: "canvasDesc",
    eduKey: "canvasEdu",
    category: "graphics",
    importance: "high",
    codeSnippet: `// 🧬 Canvas Fingerprinting extraction snippet
const canvas = document.createElement("canvas");
canvas.width = 240;
canvas.height = 60;
const ctx = canvas.getContext("2d");

// Geometric patterns & complex overlays
ctx.fillStyle = "#f60";
ctx.fillRect(10, 10, 100, 40);
ctx.fillStyle = "#069";
ctx.font = "11pt Arial";
ctx.fillText("AURA-Fingerprint 🧬", 12, 12);

ctx.strokeStyle = "rgba(102, 204, 0, 0.7)";
ctx.beginPath();
ctx.arc(140, 30, 20, 0, Math.PI * 2);
ctx.stroke();

// Extract base64 image hash
const base64Image = canvas.toDataURL();
console.log("Canvas Hash:", base64Image.substring(0, 40) + "...");`
  },
  webgl: {
    titleKey: "webglTitle",
    descKey: "webglDesc",
    eduKey: "webglEdu",
    category: "graphics",
    importance: "high",
    codeSnippet: `// 🎮 WebGL Graphics Pipeline interrogation
const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl");
if (gl) {
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const unmaskedVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  const unmaskedRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  
  console.log("GPU Vendor:", unmaskedVendor);
  console.log("GPU Renderer:", unmaskedRenderer);
}`
  },
  webAudio: {
    titleKey: "audioTitle",
    descKey: "audioDesc",
    eduKey: "audioEdu",
    category: "graphics", // sound processing has audio math characteristics
    importance: "high",
    codeSnippet: `// 🔊 Offline Audio rendering fingerprint
const ctx = new OfflineAudioContext(1, 44100, 44100);
const osc = ctx.createOscillator();
const comp = ctx.createDynamicsCompressor();

osc.type = "sine";
osc.frequency.value = 10000;
osc.connect(comp);
comp.connect(ctx.destination);
osc.start(0);

ctx.startRendering().then((buffer) => {
  const samples = buffer.getChannelData(0);
  let mathSum = 0;
  for (let i = 4000; i < 4500; i++) {
    mathSum += Math.abs(samples[i]);
  }
  console.log("Audio Signature Sum:", mathSum);
});`
  },
  fonts: {
    titleKey: "fontsTitle",
    descKey: "fontsDesc",
    eduKey: "fontsEdu",
    category: "hardware",
    importance: "high",
    codeSnippet: `// 📁 Probing system fonts through text width metrics comparison
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
ctx.font = "72px monospace";
const baseline = ctx.measureText("abcdefghijklmnopqrstuvwxyz").width;

// Check if Arial is installed
ctx.font = '72px "Arial", monospace';
const testWidth = ctx.measureText("abcdefghijklmnopqrstuvwxyz").width;
const fontInstalled = (testWidth !== baseline);
console.log("Arial Font Installed:", fontInstalled);`
  },
  ip: {
    titleKey: "ipTitle",
    descKey: "ipDesc",
    eduKey: "ipEdu",
    category: "network",
    importance: "high",
    codeSnippet: `// 🌐 IP Location & ASN lookup via external endpoint
fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => {
    console.log("Public IP:", data.ip);
    console.log("ISP Organization:", data.org);
    console.log("Country:", data.country_name);
  });`
  },
  userAgent: {
    titleKey: "userAgentTitle",
    descKey: "userAgentDesc",
    eduKey: "userAgentEdu",
    category: "software",
    importance: "medium",
    codeSnippet: `// 💻 User-Agent Header and Client Hints
console.log("User Agent:", navigator.userAgent);

// Query Client Hints (where supported)
if (navigator.userAgentData) {
  navigator.userAgentData.getHighEntropyValues(["architecture", "model", "platformVersion"])
    .then(hints => console.log("High Entropy Details:", hints));
}`
  },
  screen: {
    titleKey: "screenTitle",
    descKey: "screenDesc",
    eduKey: "screenEdu",
    category: "hardware",
    importance: "medium",
    codeSnippet: `// 🖥️ Physical display and Available UI Workspace
console.log("Screen Dimensions:", window.screen.width, "x", window.screen.height);
console.log("Available Workspace (excl. taskbar):", window.screen.availWidth, "x", window.screen.availHeight);
console.log("Device Pixel Ratio (DPR):", window.devicePixelRatio);
console.log("Color Space Bit Depth:", window.screen.colorDepth);`
  },
  timezone: {
    titleKey: "timezoneTitle",
    descKey: "timezoneDesc",
    eduKey: "timezoneEdu",
    category: "software",
    importance: "medium",
    codeSnippet: `// 🕰️ Regional Locale and timezone offsets
const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
const offsetMinutes = new Date().getTimezoneOffset();

console.log("Intl Timezone:", timezoneName);
console.log("Offset from UTC (minutes):", offsetMinutes);`
  },
  languages: {
    titleKey: "languagesTitle",
    descKey: "languagesDesc",
    eduKey: "languagesEdu",
    category: "software",
    importance: "medium",
    codeSnippet: `// 🗣️ Navigator language settings & order of preference
console.log("Primary Language:", navigator.language);
console.log("Configured Languages Array:", navigator.languages);`
  },
  hardware: {
    titleKey: "hardwareTitle",
    descKey: "hardwareDesc",
    eduKey: "hardwareEdu",
    category: "hardware",
    importance: "medium",
    codeSnippet: `// ⚙️ Core CPU and approximated device memory constraints
console.log("Logical CPU Threads:", navigator.hardwareConcurrency);
console.log("Approximate System RAM (GB):", navigator.deviceMemory);`
  },
  storage: {
    titleKey: "storageTitle",
    descKey: "storageDesc",
    eduKey: "storageEdu",
    category: "tracking",
    importance: "low",
    codeSnippet: `// 💾 Client persistent context check
console.log("LocalStorage Supported:", !!window.localStorage);
console.log("SessionStorage Supported:", !!window.sessionStorage);
console.log("IndexedDB Database Ready:", !!window.indexedDB);`
  },
  privacyHeaders: {
    titleKey: "privacyHeadersTitle",
    descKey: "privacyHeadersDesc",
    eduKey: "privacyHeadersEdu",
    category: "tracking",
    importance: "low",
    codeSnippet: `// 🛡️ Reading user privacy headers inside browser context
console.log("Do-Not-Track Signal (DNT):", navigator.doNotTrack);
console.log("Global Privacy Control (GPC):", navigator.globalPrivacyControl);`
  },
  mathPrecision: {
    titleKey: "mathTitle",
    descKey: "mathDesc",
    eduKey: "mathEdu",
    category: "software",
    importance: "low",
    codeSnippet: `// 🧮 Trigonometric precision checks (identifies JS engine vendor)
const values = [
  Math.sin(1).toPrecision(30),
  Math.cos(1).toPrecision(30),
  Math.tan(1).toPrecision(30)
];
console.log("Highly precise compiler calculations:", values);`
  }
};

// Comparisons between actual fingerprinting libraries and systems
export interface CompanyComparison {
  name: string;
  type: string;
  tactics: string[];
  accuracy: string;
  score: number; // 0 to 100
  descEs: string;
  descEn: string;
}

export const COMPANY_COMPARISONS: CompanyComparison[] = [
  {
    name: "FingerprintJS (v4 Pro)",
    type: "Commercial Device Intelligence",
    tactics: ["Canvas render math", "TLS Fingerprinting", "Fuzzy IP mapping", "Cookie-less storage matching", "WebGL extension check"],
    accuracy: "99.5%",
    score: 99,
    descEn: "Standard for premium web fraud-detection. Integrates client-side signal with server-side machine learning and behavioral history.",
    descEs: "Estándar para la detección de fraude web premium. Integra señales del lado del cliente con aprendizaje automático del lado del servidor."
  },
  {
    name: "CreepJS",
    type: "Open-source Privacy Audit Engine",
    tactics: ["Micro-decimal Math precision", "SVG graphics drawing", "Detailed shadow-root leaks", "Worker scope verification"],
    accuracy: "98%",
    score: 95,
    descEn: "Designed to expose advanced fingerprint spoofing and lying anti-detect browsers by performing deep JS engine math comparisons.",
    descEs: "Diseñado para exponer la suplantación avanzada de huellas y navegadores anti-detección que mienten mediante análisis de precisión matemática de JS."
  },
  {
    name: "IP Quality Score (IPQS)",
    type: "API-driven Device Intel & Proxy Check",
    tactics: ["ISP/ASN reputation", "Reverse DNS mapping", "Local WebRTC leak examination", "Port scanning behavior"],
    accuracy: "94%",
    score: 88,
    descEn: "Heavily optimized for detecting VPNs, anonymous proxies, bots, and simulated operating systems based on threat intelligence lists.",
    descEs: "Optimizado para la detección de VPNs, proxies anónimos, bots y sistemas operativos simulados basados en listas de amenazas de red."
  },
  {
    name: "Pixelscan.net",
    type: "E-commerce Fraud Defense Test",
    tactics: ["Device pixel ratio tests", "Font geometric width sets", "Media capabilities check", "User-Agent Client Hint alignment"],
    accuracy: "92%",
    score: 85,
    descEn: "Used by multi-account managers and drop-shippers to test if their anti-detect profiles are fully unified or reveal visual defects.",
    descEs: "Utilizado por gestores de multicuentas para probar si sus perfiles anti-detección están unificados o revelan fallas visuales de consistencia."
  },
  {
    name: "Cover Your Tracks (EFF)",
    type: "Non-profit Privacy Education Tool",
    tactics: ["Ad blocker existence", "Do Not Track header", "Uniqueness calculation against world population data"],
    accuracy: "85%",
    score: 75,
    descEn: "Created by the Electronic Frontier Foundation to show standard web surfers how unique and traceable they look to general trackers.",
    descEs: "Creado por la Electronic Frontier Foundation para mostrar a los internautas comunes qué tan únicos y rastreables lucen ante rastreadores."
  }
];
