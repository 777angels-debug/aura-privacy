import { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  Fingerprint,
  Activity,
  Globe,
  Cpu,
  Tv,
  Database,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Workflow,
  Building2,
  ChevronRight,
  Layers,
  MousePointerClick,
  Clock,
  Smartphone,
  HelpCircle,
  Sliders
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, LanguagePack } from "./utils/translations";
import { collectFingerprint, FingerprintData, METRICS_META, COMPANY_COMPARISONS } from "./utils/fingerprint";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- ROUTING ENGINE ---
  // Derive state entirely from the URL instead of React state
  const getRouteState = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    const urlLang: "en" | "es" = (parts[0] === 'es') ? 'es' : 'en';
    const pathView = parts[1] || '';
    const urlMetric = parts[2] || 'canvas';

    let view: "diagnostic" | "education" | "simulator" | "privacy" | "terms" = "diagnostic";
    if (urlLang === 'es') {
      if (pathView === 'educacion') view = 'education';
      if (pathView === 'simulador') view = 'simulator';
      if (pathView === 'privacidad') view = 'privacy';
      if (pathView === 'terminos') view = 'terms';
    } else {
      if (pathView === 'education') view = 'education';
      if (pathView === 'simulator') view = 'simulator';
      if (pathView === 'privacy') view = 'privacy';
      if (pathView === 'terms') view = 'terms';
    }
    return { lang: urlLang, view, metric: urlMetric };
  };

  const { lang, view: currentView, metric: selectedMetric } = getRouteState();
  const t: LanguagePack = translations[lang];

  const getViewUrl = (targetView: string, targetLang: string, targetMetric: string) => {
    if (targetLang === 'es') {
      if (targetView === 'education') return `/es/educacion/${targetMetric}`;
      if (targetView === 'simulator') return `/es/simulador`;
      if (targetView === 'privacy') return `/es/privacidad`;
      if (targetView === 'terms') return `/es/terminos`;
      return `/es/diagnostico`;
    } else {
      if (targetView === 'education') return `/en/education/${targetMetric}`;
      if (targetView === 'simulator') return `/en/simulator`;
      if (targetView === 'privacy') return `/en/privacy`;
      if (targetView === 'terms') return `/en/terms`;
      return `/en/diagnostic`;
    }
  };

  // Fingerprint data states
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [data, setData] = useState<FingerprintData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Anonymity score states
  const [anonymityScore, setAnonymityScore] = useState<number>(100);

  // --- SIMULATOR STATE ---
  const [shieldVpn, setShieldVpn] = useState<boolean>(false);
  const [shieldTor, setShieldTor] = useState<boolean>(false);
  const [shieldBrave, setShieldBrave] = useState<boolean>(false);
  const [shieldAntiDetect, setShieldAntiDetect] = useState<boolean>(false);
  const [shieldFirefoxRfp, setShieldFirefoxRfp] = useState<boolean>(false);

  useEffect(() => {
    // Initial redirect if at root '/'
    if (location.pathname === '/') {
      const userLang = navigator.language || (navigator as any).userLanguage || "en";
      const targetLang = userLang.toLowerCase().startsWith("es") ? "es" : "en";
      navigate(getViewUrl('diagnostic', targetLang, 'canvas'), { replace: true });
    }
  }, [location.pathname, navigate]);

  // --- SEO & DOCUMENT HEAD MANAGEMENT ---
  useEffect(() => {
    // 1. Update HTML lang attribute for screen readers and SEO
    document.documentElement.lang = lang;
    
    // 2. Dynamic Title based on view and language
    const viewTitles = {
      diagnostic: lang === "es" ? "Diagnóstico" : "Diagnostic",
      education: lang === "es" ? "Educación" : "Education",
      simulator: lang === "es" ? "Simulador" : "Simulator",
      privacy: lang === "es" ? "Privacidad" : "Privacy",
      terms: lang === "es" ? "Términos" : "Terms",
    };
    document.title = `${t.seoTitle.split(' | ')[0]} | ${viewTitles[currentView]}`;

    // 3. Dynamic Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t.seoDescription);

    // 4. Structured Data (JSON-LD) to help Google understand the tool
    let scriptJsonLd = document.querySelector('#seo-structured-data');
    if (!scriptJsonLd) {
      scriptJsonLd = document.createElement('script');
      scriptJsonLd.setAttribute('id', 'seo-structured-data');
      scriptJsonLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptJsonLd);
    }

    let structuredData: object;
    if (currentView === 'education') {
      const meta = METRICS_META[selectedMetric];
      structuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": `${(t as any)[meta.titleKey]} - AURA Privacy`,
        "description": (t as any)[meta.descKey],
        "articleBody": (t as any)[meta.eduKey],
        "author": { "@type": "Organization", "name": "AURA Privacy" },
        "publisher": {
          "@type": "Organization",
          "name": "AURA Privacy",
          "logo": { "@type": "ImageObject", "url": `${window.location.origin}/logo.png` }
        }
      };
    } else {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AURA Privacy",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "WebBrowser",
        "description": t.seoDescription,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      };
    }

    scriptJsonLd.textContent = JSON.stringify(structuredData, null, 2);

    // 5. Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + location.pathname);

    // 6. Hreflang Tags for International SEO
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    const addHrefLang = (l: string, url: string) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', l);
      link.setAttribute('href', window.location.origin + url);
      document.head.appendChild(link);
    };
    addHrefLang('en', getViewUrl(currentView, 'en', selectedMetric));
    addHrefLang('es', getViewUrl(currentView, 'es', selectedMetric));
    addHrefLang('x-default', getViewUrl(currentView, 'en', selectedMetric));

  }, [lang, currentView, selectedMetric, t, location.pathname]);

  // Run the browser scan simulation
  const runScan = async () => {
    setLoading(true);
    const stages = [
      lang === "es" ? "Iniciando análisis inmediato..." : "Initiating instant diagnostic...",
      lang === "es" ? "Calculando hash de Canvas..." : "Calculating Canvas hash...",
      lang === "es" ? "Analizando WebGL GPU..." : "Probing WebGL GPU...",
      lang === "es" ? "Midiendo respuesta WebAudio..." : "Evaluating WebAudio response...",
      lang === "es" ? "Rastreando fuentes locales..." : "Scanning system font families family...",
      lang === "es" ? "Obteniendo IP y geolocalización..." : "Fetching IP geolocation...",
      lang === "es" ? "Midiendo precisión trigonométrica..." : "Testing float-point precision..."
    ];

    // Simulating scanning logs sequentially
    for (let i = 0; i < stages.length; i++) {
      setLoadingStage(stages[i]);
      await new Promise((res) => setTimeout(res, 180));
    }

    try {
      const fingerprint = await collectFingerprint();
      setData(fingerprint);
      
      // Calculate real anonymity score
      let score = 100;
      if (fingerprint.canvasHash !== "BLOCKED_OR_FAILED" && fingerprint.canvasHash !== "UNSUPPORTED") score -= 15;
      if (fingerprint.webAudioHash !== "NOT_SUPPORTED" && fingerprint.webAudioHash !== "OFFLINE_CONTEXT_BLOCKED") score -= 12;
      if (fingerprint.installedFonts.length > 3) score -= 15;
      if (fingerprint.webglRenderer !== "UNSUPPORTED" && fingerprint.webglRenderer !== "BLOCKED") score -= 15;
      if (fingerprint.cpuCores >= 4) score -= 10;
      if (fingerprint.languages.length > 1) score -= 8;
      if (fingerprint.timezoneOffset !== 0) score -= 5;
      if (fingerprint.ipAddress !== "Blocked by Adblocker / Shield") score -= 15;
      if (fingerprint.doNotTrack === "unspecified") score -= 5;

      // Bound score between 18% and 95%
      const finalScore = Math.max(18, Math.min(95, score));
      setAnonymityScore(finalScore);

    } catch (err) {
      console.error("Fingerprinting failed: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runScan();
  }, [lang]);

  // Copy code snippet helper
  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // URL-driven navigation handlers
  const handleSelectMetric = (key: string) => {
    navigate(getViewUrl("education", lang, key));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewChange = (view: "diagnostic" | "education" | "simulator" | "privacy" | "terms") => {
    navigate(getViewUrl(view, lang, selectedMetric));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLangSwitch = () => {
    const newLang = lang === "en" ? "es" : "en";
    navigate(getViewUrl(currentView, newLang, selectedMetric));
  };

  // Get color for different metrics based on uniqueness risk
  const getMetricSeverity = (key: string): "safe" | "warning" | "danger" => {
    if (!data) return "safe";
    
    switch (key) {
      case "canvas":
        return data.canvasHash === "BLOCKED_OR_FAILED" ? "safe" : "danger";
      case "webgl":
        return data.webglRenderer.includes("Intel") || data.webglRenderer.includes("Apple") ? "warning" : "danger";
      case "webAudio":
        return data.webAudioHash === "NOT_SUPPORTED" ? "safe" : "danger";
      case "fonts":
        return data.installedFonts.length > 8 ? "danger" : data.installedFonts.length > 4 ? "warning" : "safe";
      case "ip":
        return data.ipAddress === "Blocked by Adblocker / Shield" ? "safe" : "danger";
      case "userAgent":
        return "warning";
      case "screen":
        return "warning";
      case "timezone":
        return "safe";
      case "languages":
        return data.languages.length > 1 ? "warning" : "safe";
      case "hardware":
        return "safe";
      case "storage":
        return "safe";
      case "privacyHeaders":
        return data.doNotTrack === "1" || data.gpcEnabled === "true" ? "warning" : "safe";
      case "mathPrecision":
        return "safe";
      default:
        return "safe";
    }
  };

  // --- GET SIMULATED SEVERITY (for Simulator) ---
  const getSimulatedMetricSeverity = (key: string): "safe" | "warning" | "danger" => {
    // If Tor is active, it heals almost everything
    if (shieldTor) {
      if (key === "canvas" || key === "webgl" || key === "fonts" || key === "webAudio" || key === "screen" || key === "timezone" || key === "ip") {
        return "safe";
      }
    }
    // VPN heals Network metrics
    if (shieldVpn) {
      if (key === "ip" || key === "timezone") return "safe";
    }
    // Brave Shields Farbling heals canvas & WebAudio
    if (shieldBrave) {
      if (key === "canvas" || key === "webAudio") return "safe";
    }
    // Anti-detect browser heals hardware, WebGL models, screen dimensions, and CPU core disclosures
    if (shieldAntiDetect) {
      if (key === "webgl" || key === "hardware" || key === "screen") return "safe";
    }
    // Firefox Resist Fingerprinting locks down screen resolutions, system fonts, and languages
    if (shieldFirefoxRfp) {
      if (key === "screen" || key === "fonts" || key === "languages") return "safe";
    }

    return getMetricSeverity(key);
  };

  // --- GET SIMULATED VALUE (for Simulator) ---
  const getSimulatedValue = (key: string): string => {
    if (!data) return "";
    
    if (shieldTor) {
      if (key === "canvas") return "SIMULATED_TOR_FARBLING_SAFE";
      if (key === "webgl") return "Generic Standard WebGL (Intel HD)";
      if (key === "fonts") return lang === "es" ? "Sólo Fuentes Estándar (3)" : "Only Standard Fonts (3)";
      if (key === "webAudio") return "Resisted WebAudio Oscillator";
      if (key === "screen") return "1000x1000 (Tor Standard Window)";
      if (key === "timezone") return "UTC (GMT+0)";
      if (key === "ip") return "185.220.101.4 (Tor Exit Node)";
    }

    if (shieldVpn) {
      if (key === "ip") return "192.165.42.1 (NordVPN Residential)";
      if (key === "timezone") return "Europe/Berlin (GMT+1)";
    }

    if (shieldBrave) {
      if (key === "canvas") return "FARBLING_RANDOM_SESSION_HASH";
      if (key === "webAudio") return "Farbled Audio Dynamic Wave";
    }

    if (shieldAntiDetect) {
      if (key === "webgl") return "NVIDIA Quadro T2000 Enterprise GPU";
      if (key === "hardware") return "8 Cores / 16GB RAM Spoofed";
      if (key === "screen") return "1920x1080 (Simulated Standard 1080p)";
    }

    if (shieldFirefoxRfp) {
      if (key === "screen") return "1000x800 (Firefox Rounded viewport)";
      if (key === "languages") return "en-US";
      if (key === "fonts") return "Generic System Font-Stack (Firefox)";
    }

    // Default real values
    if (key === "canvas") return data.canvasHash.substring(0, 10) + "...";
    if (key === "webgl") return data.webglRenderer.substring(0, 18) + "...";
    if (key === "webAudio") return data.webAudioHash.substring(0, 10) + "...";
    if (key === "fonts") return `${data.installedFonts.length} ${lang === "es" ? "detectadas" : "detected"}`;
    if (key === "ip") return data.ipAddress;
    if (key === "userAgent") return `${data.browserName} / ${data.operatingSystem}`;
    if (key === "screen") return data.screenResolution;
    if (key === "timezone") return data.timezone;
    if (key === "languages") return data.languages.join(", ");
    if (key === "hardware") return `${data.cpuCores} Cores / ${data.deviceMemory} RAM`;
    if (key === "storage") return data.indexedDbEnabled ? "IDB Active" : "No IDB";
    if (key === "privacyHeaders") return `DNT: ${data.doNotTrack}`;
    if (key === "mathPrecision") return data.mathPrecisionHash.substring(0, 10) + "...";

    return "";
  };

  // --- CALCULATE SIMULATED ANONYMITY SCORE ---
  const getSimulatedAnonymityScore = (): number => {
    let score = anonymityScore;
    if (shieldTor) score += 40;
    if (shieldVpn) score += 15;
    if (shieldBrave) score += 15;
    if (shieldAntiDetect) score += 20;
    if (shieldFirefoxRfp) score += 15;

    return Math.max(18, Math.min(99, score));
  };

  // Get localized category name
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "hardware": return t.catHardware;
      case "software": return t.catSoftware;
      case "network": return t.catNetwork;
      case "graphics": return t.catGraphics;
      case "tracking": return t.catTracking;
      default: return category;
    }
  };

  // Score evaluation strings
  const getScoreStatus = () => {
    if (anonymityScore >= 75) return { text: t.scoreGood, desc: t.scoreGoodDesc, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10", glow: "shadow-emerald-500/10" };
    if (anonymityScore >= 45) return { text: t.scoreWarning, desc: t.scoreWarningDesc, color: "text-amber-400 border-amber-500/20 bg-amber-500/10", glow: "shadow-amber-500/10" };
    return { text: t.scoreDanger, desc: t.scoreDangerDesc, color: "text-rose-400 border-rose-500/20 bg-rose-500/10", glow: "shadow-rose-500/10" };
  };

  // Score evaluation strings for simulation score
  const getSimulatedScoreStatus = () => {
    const simScore = getSimulatedAnonymityScore();
    if (simScore >= 80) return { text: t.scoreGood, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10", glow: "shadow-emerald-500/10" };
    if (simScore >= 50) return { text: t.scoreWarning, color: "text-amber-400 border-amber-500/20 bg-amber-500/10", glow: "shadow-amber-500/10" };
    return { text: t.scoreDanger, color: "text-rose-400 border-rose-500/20 bg-rose-500/10", glow: "shadow-rose-500/10" };
  };

  // Render current date/time on timezone offset
  const getSimulatedLocalTime = () => {
    try {
      const now = new Date();
      return now.toLocaleTimeString(lang === "es" ? "es-ES" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
      });
    } catch(e) {
      return "00:00:00 (GMT)";
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#1A1F2B] text-slate-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Sleek top navigation header */}
      <header className="border-b border-slate-800/80 bg-[#1E2332]/95 backdrop-blur-md sticky top-0 z-50 transition-all" role="banner">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/10">
              <div className="h-full w-full rounded-[10px] bg-[#1A1F2B] flex items-center justify-center">
                <Fingerprint className="h-5 w-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-semibold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300">
                {t.title}
              </span>
              <span className="block text-[8px] sm:text-[10px] text-indigo-400/80 tracking-widest font-mono uppercase">
                INTELLIGENCE HUB
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800/80" aria-label="Main navigation">
            <button
              onClick={() => handleViewChange("diagnostic")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                currentView === "diagnostic"
                  ? "bg-slate-800 text-white shadow-md border-b border-slate-700/50"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-current={currentView === "diagnostic" ? "page" : undefined}
              aria-label={t.mainTab}
            >
              {t.mainTab}
            </button>
            <button
              onClick={() => handleViewChange("education")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                currentView === "education"
                  ? "bg-slate-800 text-white shadow-md border-b border-slate-700/50"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-current={currentView === "education" ? "page" : undefined}
              aria-label={t.eduTab}
            >
              {t.eduTab}
            </button>
            <button
              onClick={() => handleViewChange("simulator")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === "simulator"
                  ? "bg-indigo-600 text-white shadow-md border-b border-indigo-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-current={currentView === "simulator" ? "page" : undefined}
              aria-label={t.simTab}
            >
              <Sliders className="h-3.5 w-3.5" aria-hidden="true" />
              {t.simTab}
            </button>
          </nav>

          {/* Quick buttons */}
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            {/* Language Switch */}
            <button
              onClick={handleLangSwitch}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-slate-700 text-xs font-mono text-indigo-300 hover:text-indigo-200 transition-all cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.langSwitch}</span>
            </button>

            {/* Refresh Scan */}
            <button
              onClick={runScan}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-400 transition-all disabled:opacity-50 cursor-pointer"
              title={t.reAnalyze}
            >
              <RotateCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Compact mobile navigation. Tailwind defaults: sm 640px, md 768px, lg 1024px. */}
        <nav className="md:hidden border-t border-slate-800/80 px-3 pb-3 pt-2">
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-1">
            <button
              onClick={() => handleViewChange("diagnostic")}
              className={`min-w-0 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                currentView === "diagnostic"
                  ? "bg-slate-800 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.mainTab}
            </button>
            <button
              onClick={() => handleViewChange("education")}
              className={`min-w-0 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                currentView === "education"
                  ? "bg-slate-800 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {lang === "es" ? "Aprender" : "Learn"}
            </button>
            <button
              onClick={() => handleViewChange("simulator")}
              className={`min-w-0 rounded-xl px-2 py-2 text-[11px] font-semibold transition-all ${
                currentView === "simulator"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {lang === "es" ? "Simular" : "Simulate"}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8" aria-label="Main content" id="main-content">

        {/* Loading overlay / spinner */}
        {loading && (
          <div className="min-h-[65vh] flex flex-col items-center justify-center text-center p-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
              <Fingerprint className="h-8 w-8 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h3 className="text-base font-medium text-slate-300 font-mono tracking-tight">
              {t.loadingText}
            </h3>
            <p className="text-xs text-indigo-300/80 font-mono mt-4 bg-slate-900/40 border border-slate-800 px-4 py-2 rounded-lg max-w-lg overflow-hidden text-ellipsis whitespace-nowrap">
              {loadingStage}
            </p>
          </div>
        )}

        {/* Loaded View */}
        {!loading && data && (
          <>
            {/* View 1: Diagnostic & Dashboard */}
            {currentView === "diagnostic" && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                
                {/* Hero section: Shortened & High impact */}
                <div className="text-center max-w-4xl mx-auto space-y-2 px-1" aria-labelledby="hero-title">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium font-mono tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" role="status" aria-live="polite">
                    <Sparkles className="h-3 w-3" aria-hidden="true" /> SECURITY DIAGNOSIS ACTIVE
                  </span>
                  <h1 id="hero-title" className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {t.title}: {lang === "es" ? "Análisis de Huella Digital" : "Browser Fingerprint Analysis"}
                  </h1>
                  <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
                    {t.tagline}
                  </p>
                </div>

                {/* Score panel & Diagnostic overview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
                  
                  {/* Gauge card */}
                  <div className="lg:col-span-4 bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700/60 transition-all shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">{t.anonymityLevel}</span>
                        <Activity className="h-4 w-4 text-indigo-400" />
                      </div>

                      {/* Radial design with canvas or plain elements */}
                      <div className="flex flex-col items-center py-4">
                        <div className="relative flex items-center justify-center">
                          {/* Circle backgrounds */}
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              className="stroke-slate-800"
                              strokeWidth="8"
                              fill="transparent"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              strokeDasharray="351"
                              strokeDashoffset={351 - (351 * anonymityScore) / 100}
                              className={`transition-all duration-1000 ${
                                anonymityScore >= 75
                                  ? "stroke-emerald-400"
                                  : anonymityScore >= 45
                                  ? "stroke-amber-400"
                                  : "stroke-rose-400"
                              }`}
                              strokeWidth="8"
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-3xl font-extrabold text-white tracking-tight">{anonymityScore}%</span>
                            <span className="block text-[9px] text-slate-400 font-mono">PROTECTED</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className={`border p-3 rounded-xl text-xs font-medium space-y-1 ${getScoreStatus().color} shadow-lg`}>
                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                          <Shield className="h-3.5 w-3.5" />
                          {getScoreStatus().text}
                        </div>
                        <p className="text-slate-300 font-normal leading-relaxed text-[11px]">
                          {getScoreStatus().desc}
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-normal text-center italic">
                        {t.anonymityDesc}
                      </p>

                      {/* Share Button for Natural SEO Linkbuilding */}
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <button
                          onClick={() => {
                            const shareText = t.shareTextTemplate.replace("{score}", anonymityScore.toString());
                            const url = window.location.origin + (lang === 'es' ? '/es/diagnostico' : '/en/diagnostic');
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1da1f2]/10 hover:bg-[#1da1f2]/20 text-[#1da1f2] border border-[#1da1f2]/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.004H5.078z"/></svg>
                          {t.shareResultBtn}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary / Traceability & Device Insights */}
                  <div className="lg:col-span-8 bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden hover:border-slate-700/60 transition-all shadow-xl">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">{t.trackabilityLevel}</span>
                        <ShieldAlert className="h-4 w-4 text-emerald-400" />
                      </div>

                      {/* Main informative grids of precise information that surprises the user */}
                      <div className="space-y-4">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                          
                          {/* Public IP */}
                          <div className="bg-[#1C202C] p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                              <Globe className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Public IP & ISP</span>
                              <span className="block text-xs font-bold text-slate-200 mt-0.5 truncate" title={data.ipAddress}>
                                {data.ipAddress}
                              </span>
                              <span className="block text-[10px] text-emerald-400 font-semibold truncate mt-0.5">
                                {data.city}, {data.country}
                              </span>
                            </div>
                          </div>

                          {/* IP Timezone & Exact Hour (Surprise factor) */}
                          <div className="bg-[#1C202C] p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
                              <Clock className="h-4 w-4 animate-spin-slow" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">{t.localTimeLabel}</span>
                              <span className="block text-xs font-bold text-white mt-0.5">
                                {getSimulatedLocalTime()}
                              </span>
                              <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                                {data.timezone} (UTC {data.timezoneOffset > 0 ? `-${data.timezoneOffset/60}` : `+${Math.abs(data.timezoneOffset/60)}`})
                              </span>
                            </div>
                          </div>

                          {/* Client Platform unmasked (Surprise factor) */}
                          <div className="bg-[#1C202C] p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                              <Cpu className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">{t.architectureLabel}</span>
                              <span className="block text-xs font-bold text-slate-200 mt-0.5 truncate">
                                {navigator.platform || "x86_64 / ARM"}
                              </span>
                              <span className="block text-[10px] text-amber-400 font-mono mt-0.5">
                                {data.cpuCores} CPU Cores / DPR: {data.pixelRatio}x
                              </span>
                            </div>
                          </div>

                          {/* Canvas Signature with pixel variance warning */}
                          <div className="bg-[#1C202C] p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 flex-shrink-0">
                              <Fingerprint className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Canvas Signature</span>
                              <span className="block text-xs font-mono font-bold text-slate-200 mt-0.5 truncate" title={data.canvasHash}>
                                {data.canvasHash}
                              </span>
                              <span className="block text-[10px] text-purple-400 mt-0.5">
                                Render GPU subpixels
                              </span>
                            </div>
                          </div>

                          {/* Graphics unmasked renderer */}
                          <div className="bg-[#1C202C] p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 flex-shrink-0">
                              <Tv className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">WebGL Unmasked GPU</span>
                              <span className="block text-xs font-bold text-slate-200 mt-0.5 truncate" title={data.webglRenderer}>
                                {data.webglRenderer}
                              </span>
                              <span className="block text-[10px] text-slate-400 mt-0.5 truncate">
                                {data.webglVendor}
                              </span>
                            </div>
                          </div>

                          {/* Touch support */}
                          <div className="bg-[#1C202C] p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 flex-shrink-0">
                              <Smartphone className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">{t.touchSupportLabel}</span>
                              <span className="block text-xs font-bold text-slate-200 mt-0.5">
                                {data.touchPoints > 0 ? t.touchYes : t.touchNo}
                              </span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">
                                Max Points: {data.touchPoints}
                              </span>
                            </div>
                          </div>

                        </div>

                        {/* Extra surprising notification banner */}
                        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono">
                          <span className="text-slate-400">
                            {lang === "es" ? "🔍 Subpíxeles detectados por hardware:" : "🔍 Subpixels detected via hardware:"}{" "}
                            <strong className="text-indigo-400">{data.canvasHash.substring(0, 8)}</strong>
                          </span>
                          <span className="text-slate-400">
                            {lang === "es" ? "Idioma prioritario:" : "Primary language:"}{" "}
                            <strong className="text-white">{data.languages[0]}</strong>
                          </span>
                        </div>

                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <ShieldAlert className="h-4 w-4 text-rose-400" />
                        <span>{t.trackabilityDesc}</span>
                      </div>
                      <div className="text-xs font-mono px-3 py-1 bg-[#1C202C] border border-slate-800 rounded-xl text-slate-300">
                        {anonymityScore < 45 ? t.riskHigh : anonymityScore < 75 ? t.riskMedium : t.riskLow}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Heatmap Section */}
                <div className="bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-xl space-y-4">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-400" />
                        {t.heatmapTitle}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {t.heatmapSubtitle}
                      </p>
                    </div>
                    <div className="text-xs text-slate-400 max-w-sm font-mono leading-normal bg-[#1C202C] p-3 rounded-xl border border-slate-800">
                      {t.heatmapHelp}
                    </div>
                  </div>

                  {/* Grid of the 13 metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {Object.entries(METRICS_META).map(([key, meta]) => {
                      const severity = getMetricSeverity(key);
                      
                      // Values mapping for heatmap display
                      let displayValue = "";
                      if (key === "canvas") displayValue = data.canvasHash.substring(0, 10) + "...";
                      else if (key === "webgl") displayValue = data.webglRenderer.substring(0, 18) + "...";
                      else if (key === "webAudio") displayValue = data.webAudioHash.substring(0, 10) + "...";
                      else if (key === "fonts") displayValue = `${data.installedFonts.length} ${lang === "es" ? "detectadas" : "detected"}`;
                      else if (key === "ip") displayValue = data.ipAddress;
                      else if (key === "userAgent") displayValue = `${data.browserName} / ${data.operatingSystem}`;
                      else if (key === "screen") displayValue = data.screenResolution;
                      else if (key === "timezone") displayValue = data.timezone;
                      else if (key === "languages") displayValue = data.languages.join(", ");
                      else if (key === "hardware") displayValue = `${data.cpuCores} Cores / ${data.deviceMemory} RAM`;
                      else if (key === "storage") displayValue = data.indexedDbEnabled ? "IDB Active" : "No IDB";
                      else if (key === "privacyHeaders") displayValue = `DNT: ${data.doNotTrack}`;
                      else if (key === "mathPrecision") displayValue = data.mathPrecisionHash.substring(0, 10) + "...";

                      return (
                        <button
                          key={key}
                          onClick={() => handleSelectMetric(key)}
                          className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden group cursor-pointer ${
                            severity === "danger"
                              ? "bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 hover:border-rose-400"
                              : severity === "warning"
                              ? "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-400"
                              : "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-400"
                          } hover:shadow-lg`}
                        >
                          {/* Interactive click indicator on hover */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MousePointerClick className="h-3.5 w-3.5 text-slate-400" />
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            {/* Dot indicator */}
                            <span className={`h-2.5 w-2.5 rounded-full ${
                              severity === "danger" ? "bg-rose-400 shadow-md shadow-rose-400/40" :
                              severity === "warning" ? "bg-amber-400 shadow-md shadow-amber-400/40" :
                              "bg-emerald-400 shadow-md shadow-emerald-400/40"
                            }`} />
                            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                              {getCategoryLabel(meta.category)}
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold text-white tracking-tight leading-snug group-hover:text-indigo-300 transition-colors">
                            {(t as any)[meta.titleKey]}
                          </h3>

                          <p className="text-[11px] font-mono font-semibold text-slate-300 mt-2 truncate bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                            {displayValue}
                          </p>

                          <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                            <span>
                              {lang === "es" ? "Importancia: " : "Importance: "}
                              <strong className={`uppercase ${
                                meta.importance === "high" ? "text-rose-400" :
                                meta.importance === "medium" ? "text-amber-400" : "text-emerald-400"
                              }`}>
                                {meta.importance}
                              </strong>
                            </span>
                            <span className="font-mono text-[9px] opacity-60">
                              {severity === "danger" ? t.statusDanger : severity === "warning" ? t.statusWarning : t.statusSafe}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                </div>

            {/* Corporate Profile Matrix Comparison Section */}
            <div className="bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl space-y-6">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Workflow className="h-5 w-5" />
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {t.comparisonTitle}
                  </h2>
                </div>
                <p className="text-sm text-slate-400">
                  {t.comparisonSub}
                </p>
              </div>

              {/* Desktop Responsive Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full min-w-[760px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1C202C] text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800">
                      <th className="px-6 py-4">{t.toolName}</th>
                      <th className="px-6 py-4">{t.toolType}</th>
                      <th className="px-6 py-4">{t.toolStrengths}</th>
                      <th className="px-6 py-4">{t.toolAccuracy}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {COMPANY_COMPARISONS.map((comp) => (
                      <tr key={comp.name} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">
                          {comp.name}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-indigo-300">
                          {comp.type}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300 space-y-1.5">
                          <p className="font-normal text-slate-300">
                            {lang === "es" ? comp.descEs : comp.descEn}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {comp.tactics.map((tactic) => (
                              <span key={tactic} className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700/40">
                                {tactic}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${comp.score}%` }}
                                className="bg-indigo-500 h-full rounded-full"
                              />
                            </div>
                            <span className="text-xs font-mono font-bold text-white">
                              {comp.accuracy}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>


                {/* Section Connector CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
                  <button
                    onClick={() => handleViewChange("simulator")}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                      <Sliders className="h-5 w-5" />
                      {t.simTitle}
                      <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  <button
                    onClick={() => handleViewChange("education")}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-sm transition-all border border-slate-700/60 cursor-pointer"
                  >
                    {t.learnMoreBtn}
                  </button>
                </div>

              </div>
            )}

            {/* View 2: Didactic Sandbox & Explanation Hub */}
            {currentView === "education" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start animate-fade-in">
                
                {/* Left Side: Category Navigator & Metric List */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:sticky lg:top-24">
                  
                  {/* Back to main */}
                  <button
                    onClick={() => handleViewChange("diagnostic")}
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {t.backToMain}
                  </button>

                  {/* Sidebar list card */}
                  <div className="bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
                    <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-widest">
                      {lang === "es" ? "Métricas Analizadas" : "Analyzed Metrics"}
                    </h3>

                    {/* Quick navigation grouped by category or simple flat sorted lists */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[55vh] overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0">
                      {Object.entries(METRICS_META)
                        .sort((a, b) => {
                          // Sort by importance high -> medium -> low
                          const map = { high: 3, medium: 2, low: 1 };
                          return map[b[1].importance] - map[a[1].importance];
                        })
                        .map(([key, meta]) => {
                          const isSelected = selectedMetric === key;
                          const severity = getMetricSeverity(key);
                          
                          return (
                            <button
                              key={key}
                              onClick={() => handleSelectMetric(key)}
                              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-slate-800 border-indigo-500 text-white shadow-md shadow-indigo-500/5"
                                  : "bg-[#1C202C]/60 hover:bg-slate-800/40 border-slate-800/80 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                  severity === "danger" ? "bg-rose-400" :
                                  severity === "warning" ? "bg-amber-400" :
                                  "bg-emerald-400"
                                }`} />
                                <span className="text-[11px] sm:text-xs font-semibold truncate leading-tight">
                                  {(t as any)[meta.titleKey]}
                                </span>
                              </div>
                              
                              <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                                meta.importance === "high" ? "bg-rose-500/10 text-rose-400" :
                                meta.importance === "medium" ? "bg-amber-500/10 text-amber-400" :
                                "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {meta.importance}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                </div>

                {/* Right Side: Detailed interactive content & demos */}
                <div className="lg:col-span-8 space-y-5 sm:space-y-8 min-w-0">
                  
                  {/* Detailed Metric Showcase Card */}
                  {(() => {
                    const meta = METRICS_META[selectedMetric];
                    const severity = getMetricSeverity(selectedMetric);
                    
                    // Specific live sandbox rendering for the metric
                    let sandboxContent = null;
                    if (selectedMetric === "canvas") {
                      sandboxContent = (
                        <div className="space-y-4">
                          <p className="text-xs text-slate-400 font-mono">
                            [LIVE RENDERING DEMONSTRATION]
                          </p>
                          <div className="flex flex-col items-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                            {/* Canvas visual */}
                            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm max-w-full overflow-auto">
                              <canvas
                                id="demo-canvas-viewport"
                                width="240"
                                height="60"
                                className="bg-transparent"
                                ref={(el) => {
                                  if (!el) return;
                                  const ctx = el.getContext("2d");
                                  if (!ctx) return;
                                  ctx.clearRect(0, 0, 240, 60);
                                  ctx.fillStyle = "#f60";
                                  ctx.fillRect(10, 10, 100, 40);
                                  ctx.fillStyle = "#069";
                                  ctx.font = "11pt no-real-font-123, Arial";
                                  ctx.textBaseline = "top";
                                  ctx.fillText("AURA-Fingerprint, 🧬 💻", 12, 12);
                                  ctx.strokeStyle = "rgba(102, 204, 0, 0.7)";
                                  ctx.beginPath();
                                  ctx.arc(140, 30, 20, 0, Math.PI * 2, true);
                                  ctx.stroke();
                                  ctx.shadowOffsetX = 2;
                                  ctx.shadowOffsetY = 2;
                                  ctx.shadowBlur = 3;
                                  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                                  ctx.fillStyle = "#A30000";
                                  ctx.fillText("🎨 Canvas 3D", 80, 28);
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-2 font-mono">
                              The hidden Canvas element generated by the background analyzer. Note the exact anti-aliased font rendering.
                            </span>
                          </div>
                        </div>
                      );
                    } else if (selectedMetric === "webAudio") {
                      sandboxContent = (
                        <div className="space-y-4">
                          <p className="text-xs text-slate-400 font-mono">
                            [AUDIO MATHEMATICS WAVE VISUALIZATION]
                          </p>
                          <div className="bg-[#1C202C] p-6 rounded-2xl border border-slate-800/80 flex flex-col items-center">
                            <div className="flex items-center gap-1.5 h-12 w-full max-w-xs justify-center">
                              {[35, 12, 45, 18, 55, 30, 22, 48, 62, 38, 14, 28, 42, 50, 15, 35, 20].map((h, i) => (
                                <div
                                  key={i}
                                  style={{
                                    height: `${h}%`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "1.2s"
                                  }}
                                  className="w-1.5 bg-indigo-500 rounded-full animate-bounce"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 mt-4 text-center">
                              Synthesizing audio waves over high and low-pass dynamics filters to capture subtle CPU math precision variations.
                            </span>
                          </div>
                        </div>
                      );
                    } else if (selectedMetric === "fonts") {
                      sandboxContent = (
                        <div className="space-y-4">
                          <p className="text-xs text-slate-400 font-mono">
                            [SYSTEM FONTS CHECKER SANDBOX]
                          </p>
                          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                            <p className="text-xs text-slate-400">
                              Below is the list of common desktop and corporate fonts evaluated. If the browser measures a different width than standard monospace, it is detected as installed:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Comic Sans MS", "Trebuchet MS", "Impact", "Consolas", "Calibri", "Segoe UI", "Helvetica", "Roboto", "Palatino"].map((font) => {
                                const isInstalled = data.installedFonts.includes(font);
                                return (
                                  <span
                                    key={font}
                                    style={{ fontFamily: isInstalled ? font : "inherit" }}
                                    className={`px-3 py-1 text-xs rounded-lg font-medium border flex items-center gap-1.5 ${
                                      isInstalled
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                                        : "bg-slate-800/40 border-slate-800 text-slate-500 line-through"
                                    }`}
                                  >
                                    <Check className={`h-3 w-3 ${isInstalled ? "text-emerald-400" : "text-slate-500"}`} />
                                    {font}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    } else if (selectedMetric === "ip") {
                      sandboxContent = (
                        <div className="space-y-4">
                          <p className="text-xs text-slate-400 font-mono">
                            [NETWORK METADATA SANDBOX]
                          </p>
                          <div className="bg-[#1C202C] p-4 rounded-2xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                            <div>
                              <span className="text-slate-400 block">IP:</span>
                              <span className="text-white font-bold">{data.ipAddress}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Country:</span>
                              <span className="text-white font-bold">{data.country}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">City:</span>
                              <span className="text-white font-bold">{data.city}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">ISP:</span>
                              <span className="text-white font-bold">{data.isp}</span>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (selectedMetric === "mathPrecision") {
                      sandboxContent = (
                        <div className="space-y-4">
                          <p className="text-xs text-slate-400 font-mono">
                            [JS COMPILER MATH RESIDUES]
                          </p>
                          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs font-mono">
                            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                              <span className="text-slate-400">Math.sin(1)</span>
                              <span className="text-indigo-300 font-bold">{Math.sin(1).toPrecision(21)}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                              <span className="text-slate-400">Math.tan(1)</span>
                              <span className="text-indigo-300 font-bold">{Math.tan(1).toPrecision(21)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Math.cos(1)</span>
                              <span className="text-indigo-300 font-bold">{Math.cos(1).toPrecision(21)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl space-y-5 sm:space-y-6 relative overflow-hidden min-w-0">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 sm:pb-6">
                          <div className="space-y-1">
                            <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 uppercase">
                              {getCategoryLabel(meta.category)}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-tight">
                              {(t as any)[meta.titleKey]}
                            </h2>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <div className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${
                              severity === "danger" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                              severity === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                              "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            }`}>
                              {severity === "danger" ? t.statusDanger : severity === "warning" ? t.statusWarning : t.statusSafe}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              Importance: <strong className="text-slate-200 uppercase">{meta.importance}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Description & Technical Breakdown */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white tracking-tight">
                            {lang === "es" ? "¿Qué mide este parámetro?" : "What does this parameter measure?"}
                          </h3>
                          <p className="text-sm text-slate-300 leading-relaxed bg-[#1C202C]/60 p-4 rounded-2xl border border-slate-800/80">
                            {(t as any)[meta.descKey]}
                          </p>
                        </div>

                        {/* Interactive Sandbox display if any */}
                        {sandboxContent}

                        {/* How Corporate systems leverage it */}
                        <div className="space-y-4 pt-4 border-t border-slate-800/80">
                          <div className="flex items-center gap-2 text-indigo-400">
                            <Building2 className="h-5 w-5" />
                            <h3 className="text-sm font-semibold text-white tracking-tight">
                              {lang === "es" ? "Uso Corporativo y Rastreo" : "Corporate Usage & Tracking Mechanics"}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {(t as any)[meta.eduKey]}
                          </p>
                        </div>

                        {/* Vanilla JavaScript detection code extraction view */}
                        <div className="space-y-4 pt-6 border-t border-slate-800/80">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-mono text-slate-400">
                              {t.codeExplanation}
                            </span>
                            <button
                              onClick={() => handleCopyCode(selectedMetric, meta.codeSnippet)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C202C] hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              {copiedKey === selectedMetric ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400 animate-scale-up" />
                                  <span className="text-emerald-400">{lang === "es" ? "Copiado!" : "Copied!"}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>{lang === "es" ? "Copiar Código" : "Copy Code"}</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="relative rounded-2xl overflow-hidden border border-slate-800">
                            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-indigo-400 font-semibold tracking-wider">JAVASCRIPT PROBE ENGINE</span>
                              <span className="text-[10px] font-mono text-slate-500">VANILLA CODE</span>
                            </div>
                            <pre className="p-3 sm:p-4 bg-[#1C202C] overflow-x-auto text-[11px] sm:text-xs font-mono text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                              <code>{meta.codeSnippet}</code>
                            </pre>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>

              </div>
            )}

            {/* View 3: Anonymity & Spoofing Simulator */}
            {currentView === "simulator" && (
              <div className="space-y-5 sm:space-y-8 animate-fade-in">
                
                {/* Intro & Title */}
                <div className="bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        <Sliders className="h-3 w-3 animate-pulse" /> HARDENING SIMULATOR ACTIVE
                      </span>
                      <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                        {t.simTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                        {t.simIntro}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShieldVpn(false);
                        setShieldTor(false);
                        setShieldBrave(false);
                        setShieldAntiDetect(false);
                        setShieldFirefoxRfp(false);
                      }}
                      className="px-4 py-2 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-slate-300 cursor-pointer"
                    >
                      {t.restoreSim}
                    </button>
                  </div>
                </div>

                {/* Main Simulator Split Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
                  
                  {/* Left Column: Toggles of the professional configurations */}
                  <div className="lg:col-span-5 bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-xl space-y-5 sm:space-y-6">
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                        {t.activeShields}
                      </h3>

                      {/* Tool 1: VPN & Proxy */}
                      <button
                        onClick={() => setShieldVpn(!shieldVpn)}
                        className={`w-full text-left p-3 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          shieldVpn
                            ? "bg-indigo-500/10 border-indigo-500/80 text-white"
                            : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-400"
                        }`}
                      >
                        <div className={`p-2 rounded-xl flex-shrink-0 ${shieldVpn ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-500"}`}>
                          <Globe className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-xs text-white uppercase tracking-tight">{t.toolVpnTitle}</span>
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${shieldVpn ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                              {shieldVpn ? t.shieldApplied : "OFF"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                            {t.toolVpnDesc}
                          </p>
                          <p className="text-[9px] text-emerald-400/90 font-mono italic">
                            {t.toolVpnImpact}
                          </p>
                        </div>
                      </button>

                      {/* Tool 2: Tor Strict */}
                      <button
                        onClick={() => setShieldTor(!shieldTor)}
                        className={`w-full text-left p-3 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          shieldTor
                            ? "bg-purple-500/10 border-purple-500/80 text-white"
                            : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-400"
                        }`}
                      >
                        <div className={`p-2 rounded-xl flex-shrink-0 ${shieldTor ? "bg-purple-500/20 text-purple-300" : "bg-slate-800 text-slate-500"}`}>
                          <Fingerprint className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-xs text-white uppercase tracking-tight">{t.toolTorTitle}</span>
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${shieldTor ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                              {shieldTor ? t.shieldApplied : "OFF"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                            {t.toolTorDesc}
                          </p>
                          <p className="text-[9px] text-emerald-400/90 font-mono italic">
                            {t.toolTorImpact}
                          </p>
                        </div>
                      </button>

                      {/* Tool 3: Brave Shields Farbling */}
                      <button
                        onClick={() => setShieldBrave(!shieldBrave)}
                        className={`w-full text-left p-3 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          shieldBrave
                            ? "bg-amber-500/10 border-amber-500/80 text-white"
                            : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-400"
                        }`}
                      >
                        <div className={`p-2 rounded-xl flex-shrink-0 ${shieldBrave ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-500"}`}>
                          <Tv className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-xs text-white uppercase tracking-tight">{t.toolBraveTitle}</span>
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${shieldBrave ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                              {shieldBrave ? t.shieldApplied : "OFF"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                            {t.toolBraveDesc}
                          </p>
                          <p className="text-[9px] text-emerald-400/90 font-mono italic">
                            {t.toolBraveImpact}
                          </p>
                        </div>
                      </button>

                      {/* Tool 4: Anti-Detect browser */}
                      <button
                        onClick={() => setShieldAntiDetect(!shieldAntiDetect)}
                        className={`w-full text-left p-3 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          shieldAntiDetect
                            ? "bg-emerald-500/10 border-emerald-500/80 text-white"
                            : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-400"
                        }`}
                      >
                        <div className={`p-2 rounded-xl flex-shrink-0 ${shieldAntiDetect ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                          <Cpu className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-xs text-white uppercase tracking-tight">{t.toolAntiDetectTitle}</span>
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${shieldAntiDetect ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                              {shieldAntiDetect ? t.shieldApplied : "OFF"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                            {t.toolAntiDetectDesc}
                          </p>
                          <p className="text-[9px] text-emerald-400/90 font-mono italic">
                            {t.toolAntiDetectImpact}
                          </p>
                        </div>
                      </button>

                      {/* Tool 5: Firefox RFP */}
                      <button
                        onClick={() => setShieldFirefoxRfp(!shieldFirefoxRfp)}
                        className={`w-full text-left p-3 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          shieldFirefoxRfp
                            ? "bg-rose-500/10 border-rose-500/80 text-white"
                            : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-400"
                        }`}
                      >
                        <div className={`p-2 rounded-xl flex-shrink-0 ${shieldFirefoxRfp ? "bg-rose-500/20 text-rose-300" : "bg-slate-800 text-slate-500"}`}>
                          <Database className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white uppercase tracking-tight">{t.toolFirefoxRfpTitle}</span>
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${shieldFirefoxRfp ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                              {shieldFirefoxRfp ? t.shieldApplied : "OFF"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                            {t.toolFirefoxRfpDesc}
                          </p>
                          <p className="text-[9px] text-emerald-400/90 font-mono italic">
                            {t.toolFirefoxRfpImpact}
                          </p>
                        </div>
                      </button>

                    </div>

                    {/* Disclaimer about noise injection */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 flex items-start gap-2.5">
                      <HelpCircle className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {t.simUniquenessAlert}
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Real-time simulation dashboard (Gauge & Heatmap) */}
                  <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                    
                    {/* Simulated Gauge score */}
                    <div className="bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                        <div className="space-y-1.5 text-center sm:text-left">
                          <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                            {t.simulatedScore}
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            {getSimulatedAnonymityScore()}% {lang === "es" ? "Protección" : "Protection"}
                          </h3>
                          <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${getSimulatedScoreStatus().color}`}>
                            {getSimulatedScoreStatus().text}
                          </div>
                        </div>

                        {/* Large Horizontal Gauge scale bar */}
                        <div className="w-full sm:w-2/3 space-y-2">
                          <div className="flex justify-between text-[11px] font-mono text-slate-400">
                            <span>Real: <strong className="text-indigo-400">{anonymityScore}%</strong></span>
                            <span>Simulated Target: <strong className="text-emerald-400">{getSimulatedAnonymityScore()}%</strong></span>
                          </div>
                          <div className="h-4 w-full bg-slate-900/80 rounded-full border border-slate-800 overflow-hidden relative p-[2px]">
                            {/* Real score line indicator */}
                            <div
                              style={{ width: `${anonymityScore}%` }}
                              className="bg-indigo-500/30 h-full rounded-full transition-all duration-500 absolute top-0.5 left-0.5"
                            />
                            {/* Simulated score line */}
                            <div
                              style={{ width: `${getSimulatedAnonymityScore()}%` }}
                              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700 absolute top-0.5 left-0.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Matrix Heatmap view */}
                    <div className="bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
                      
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-indigo-400" />
                          {t.simulatedHeatmap}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {lang === "es" ? "Observa cómo se alteran las firmas e ID de hardware según tus escudos seleccionados:" : "Observe how signatures and hardware IDs adjust based on selected shields:"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(METRICS_META).map(([key, meta]) => {
                          const originalSeverity = getMetricSeverity(key);
                          const simSeverity = getSimulatedMetricSeverity(key);
                          const isSimHealed = originalSeverity !== "safe" && simSeverity === "safe";

                          return (
                            <div
                              key={key}
                              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                                simSeverity === "danger"
                                  ? "bg-rose-500/5 border-rose-500/20"
                                  : simSeverity === "warning"
                                  ? "bg-amber-500/5 border-amber-500/20"
                                  : "bg-emerald-500/5 border-emerald-500/20"
                              } ${isSimHealed ? "ring-1 ring-emerald-500/30 shadow-md shadow-emerald-500/5" : ""}`}
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                    simSeverity === "danger" ? "bg-rose-400" :
                                    simSeverity === "warning" ? "bg-amber-400" :
                                    "bg-emerald-400"
                                  }`} />
                                  <span className="text-[11px] font-bold text-white truncate">
                                    {(t as any)[meta.titleKey]}
                                  </span>
                                </div>

                                {isSimHealed && (
                                  <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded uppercase">
                                    HEALED
                                  </span>
                                )}
                              </div>

                              {/* Comparison of value strings */}
                              <div className="mt-2 space-y-1">
                                <p className="text-[10px] font-mono text-slate-400 truncate flex items-center justify-between">
                                  <span className="opacity-80">{t.originalLabel}:</span>
                                  <span className="text-slate-300 font-semibold">{displayRealHash(key)}</span>
                                </p>
                                
                                {getSimulatedValue(key) !== displayRealHash(key) && (
                                  <p className="text-[10px] font-mono text-emerald-300 truncate flex items-center justify-between bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">
                                    <span className="opacity-80 font-bold">{t.simulatedLabel}:</span>
                                    <span className="font-bold">{getSimulatedValue(key)}</span>
                                  </p>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* View 4 & 5: Legal Pages (Privacy & Terms) */}
            {(currentView === "privacy" || currentView === "terms") && (
              <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
                <button
                  onClick={() => handleViewChange("diagnostic")}
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {t.backToMain}
                </button>
                
                <div className="bg-[#212736] border border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {currentView === "privacy" ? t.privacyTitle : t.termsTitle}
                  </h1>
                  <div className="prose prose-invert prose-slate prose-sm sm:prose-base max-w-none">
                    <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                      {currentView === "privacy" ? t.privacyContent : t.termsContent}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#1E2332]/50 py-6 sm:py-8" role="contentinfo">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <Fingerprint className="h-5 w-5 text-indigo-400 flex-shrink-0" />
            <span className="font-semibold text-slate-300 text-sm">
              {t.title} &copy; 2026. All rights reserved.
            </span>
          </div>
          
          <div className="flex-1 max-w-2xl mx-auto text-center lg:text-right">
            <p className="text-[10px] text-slate-500/80 font-mono leading-relaxed">
              {t.footerDisclaimer}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-400 font-mono flex-shrink-0">
            <button onClick={() => handleViewChange("privacy")} className="hover:text-indigo-300 transition-colors cursor-pointer">
              {t.navPrivacy}
            </button>
            <span className="hidden sm:inline opacity-30">|</span>
            <button onClick={() => handleViewChange("terms")} className="hover:text-indigo-300 transition-colors cursor-pointer">
              {t.navTerms}
            </button>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="opacity-60">v4.1.2 Probes</span>
          </div>
        </div>
      </footer>

    </div>
  );

  // Quick helper to fetch and parse base real metrics for comparison view
  function displayRealHash(key: string): string {
    if (!data) return "";
    if (key === "canvas") return data.canvasHash.substring(0, 8) + "...";
    if (key === "webgl") return data.webglRenderer.substring(0, 12) + "...";
    if (key === "webAudio") return data.webAudioHash.substring(0, 8) + "...";
    if (key === "fonts") return `${data.installedFonts.length} fonts`;
    if (key === "ip") return data.ipAddress.substring(0, 12) + "...";
    if (key === "userAgent") return `${data.browserName}`;
    if (key === "screen") return data.screenResolution;
    if (key === "timezone") return data.timezone;
    if (key === "languages") return data.languages[0];
    if (key === "hardware") return `${data.cpuCores} Cores`;
    if (key === "storage") return data.indexedDbEnabled ? "IDB" : "No IDB";
    if (key === "privacyHeaders") return `DNT: ${data.doNotTrack}`;
    if (key === "mathPrecision") return data.mathPrecisionHash.substring(0, 8) + "...";
    return "";
  }
}
