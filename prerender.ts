import fs from 'fs';
import path from 'path';
import { translations } from './src/utils/translations';
import { METRICS_META } from './src/utils/fingerprint';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ Error: No index.html found in dist/. Run npm run build first.");
  process.exit(1);
}

let baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
const DOMAIN = "https://auraprivacy.com";

// 0. Corregir las rutas del logo globalmente en el archivo raíz (index.html)
// Esto arregla definitivamente el comportamiento de `npm run preview` y los fallbacks de SPA
baseHtml = baseHtml.replace(/href=["'][^"']*logo\.png["']/g, 'href="/logo.png"');
fs.writeFileSync(indexHtmlPath, baseHtml);

const metrics = Object.keys(METRICS_META);

interface RouteInfo {
  path: string;
  lang: 'en' | 'es';
  view: 'diagnostic' | 'education' | 'simulator' | 'privacy' | 'terms';
  metric: string | null;
}

// Definir todas las URLs posibles
const routes: RouteInfo[] = [
  { path: '/en/diagnostic', lang: 'en', view: 'diagnostic', metric: null },
  { path: '/en/simulator', lang: 'en', view: 'simulator', metric: null },
  { path: '/es/diagnostico', lang: 'es', view: 'diagnostic', metric: null },
  { path: '/es/simulador', lang: 'es', view: 'simulator', metric: null },
  { path: '/en/privacy', lang: 'en', view: 'privacy', metric: null },
  { path: '/es/privacidad', lang: 'es', view: 'privacy', metric: null },
  { path: '/en/terms', lang: 'en', view: 'terms', metric: null },
  { path: '/es/terminos', lang: 'es', view: 'terms', metric: null }
];

metrics.forEach(m => {
  routes.push({ path: `/en/education/${m}`, lang: 'en', view: 'education', metric: m });
  routes.push({ path: `/es/educacion/${m}`, lang: 'es', view: 'education', metric: m });
});

let sitemapUrls = "";

routes.forEach(route => {
  // 1. Agregar al Sitemap
  let priority = route.view === 'diagnostic' ? '1.0' : (route.view === 'simulator' ? '0.9' : '0.7');
  sitemapUrls += `  <url>\n    <loc>${DOMAIN}${route.path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;

  // 2. Crear carpetas físicas para la URL
  const routeDir = path.join(distDir, route.path);
  fs.mkdirSync(routeDir, { recursive: true });

  // 3. Inyectar Metadatos correctos (Title, Lang, OpenGraph)
  const t = translations[route.lang];
  const viewTitles = {
    diagnostic: route.lang === "es" ? "Diagnóstico" : "Diagnostic",
    education: route.lang === "es" ? "Educación" : "Education",
    simulator: route.lang === "es" ? "Simulador" : "Simulator",
    privacy: route.lang === "es" ? "Privacidad" : "Privacy",
    terms: route.lang === "es" ? "Términos" : "Terms",
  };
  const pageTitle = `${t.seoTitle.split(' | ')[0]} | ${viewTitles[route.view]}`;
  
  let html = baseHtml;
  
  // Reemplazar etiquetas
  html = html.replace(/<title>(.*?)<\/title>/, `<title>${pageTitle}</title>`);
  html = html.replace(/name="description" content="(.*?)"/, `name="description" content="${t.seoDescription}"`);
  
  html = html.replace(/property="og:title" content="(.*?)"/, `property="og:title" content="${pageTitle}"`);
  html = html.replace(/name="twitter:title" content="(.*?)"/, `name="twitter:title" content="${pageTitle}"`);
  
  html = html.replace(/property="og:description" content="(.*?)"/, `property="og:description" content="${t.seoDescription}"`);
  html = html.replace(/name="twitter:description" content="(.*?)"/, `name="twitter:description" content="${t.seoDescription}"`);
  
  html = html.replace(/<link rel="canonical" href="(.*?)" \/>/, `<link rel="canonical" href="${DOMAIN}${route.path}" />`);
  html = html.replace(/property="og:url" content="(.*?)"/, `property="og:url" content="${DOMAIN}${route.path}"`);
  
  html = html.replace(/<html lang="en">/, `<html lang="${route.lang}">`);

  // 4. Inyectar JSON-LD dinámico
  let structuredData: object;

  if (route.view === 'education' && route.metric) {
    const meta = METRICS_META[route.metric];
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
        "logo": { "@type": "ImageObject", "url": `${DOMAIN}/logo.png` }
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

  html = html.replace(/<!--prerender-json-ld-->/, JSON.stringify(structuredData, null, 2));

  // 5. Guardar archivo estático
  fs.writeFileSync(path.join(routeDir, 'index.html'), html);
});

// Escribir Sitemap Principal
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${DOMAIN}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n${sitemapUrls}</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

// Escribir archivo Robots
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);

console.log(`✅ SSG Prerender Completo: Generadas ${routes.length} páginas físicas, sitemap.xml y robots.txt`);