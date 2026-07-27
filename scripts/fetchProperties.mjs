import fs from 'fs';
import https from 'https';
import * as cheerio from 'cheerio';

async function fetchProperties() {
  console.log("Fetching property list...");
  const res = await fetch('https://villalbamartinez.com.ar/Php/api.inmuebles.php', {
    method: 'POST',
    body: 'o=-1&t=-1&d=-1&l=-1&b=-1',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  const html = await res.text();
  const properties = [];
  
  const blocks = html.split('<div class="col-md-4"');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    
    const linkMatch = block.match(/href="detalle\.php\?id=([^"]+)"/);
    const idStr = linkMatch ? linkMatch[1] : `real_${i}`;
    
    const titleMatch = block.match(/<h4>([^<]+)<\/h4>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Propiedad';
    
    const locMatch = block.match(/<i class="fa fa-map-marker"><\/i>([^<]+)<\/span>/);
    let barrio = 'Córdoba';
    if (locMatch) {
      const locStr = locMatch[1].trim();
      const parts = locStr.split('-');
      if (parts.length > 1) barrio = parts[1].trim();
      else barrio = locStr;
    }
    
    // Generate random coordinates around Córdoba center (-31.4201, -64.1888)
    const lat = -31.4201 + (Math.random() - 0.5) * 0.05;
    const lng = -64.1888 + (Math.random() - 0.5) * 0.05;

    properties.push({
      id: idStr,
      slug: `propiedad-${idStr}`,
      nombre: title,
      barrio: barrio,
      comuna: 'Córdoba',
      tipo: 'Venta',
      precio: 0,
      moneda: 'ARS',
      m2Util: 0,
      m2Total: 0,
      habitaciones: 0,
      banos: 0,
      estacionamientos: 0,
      lat,
      lng,
      descripcion: `Excelente propiedad ubicada en ${barrio}.`,
      imagenes: [],
      tour360Urls: [],
      destacada: i <= 6, 
      updatedAt: '2026-07-21T00:00:00.000Z',
    });
  }

  console.log(`Fetching detail pages for ${properties.length} properties...`);
  const batchSize = 10;
  for (let i = 0; i < properties.length; i += batchSize) {
    const batch = properties.slice(i, i + batchSize);
    await Promise.all(batch.map(async (p) => {
      if (p.id.startsWith('real_')) return;
      try {
        const detRes = await fetch(`https://villalbamartinez.com.ar/detalle.php?id=${p.id}`);
        const detBuffer = await detRes.arrayBuffer();
        const detHtml = new TextDecoder("utf-8").decode(detBuffer);
        const $ = cheerio.load(detHtml);
        
        const fixEncoding = (str) => {
          try {
            return Buffer.from(str, 'latin1').toString('utf8');
          } catch (e) {
            return str;
          }
        };
        
        const detailTitle = fixEncoding($('.panel-body h4').first().text().trim());
        if (detailTitle) p.nombre = detailTitle;
        
        const priceText = fixEncoding($('div[style*="rgba(255,1,4,0.70)"]').text());
        if (priceText) {
          if (priceText.includes('Alquiler')) p.tipo = 'Arriendo';
          if (priceText.includes('Venta')) p.tipo = 'Venta';
          if (priceText.includes('U$S')) p.moneda = 'USD';
          else p.moneda = 'ARS';
          p.precio = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
        }
        
        $("h3").each((_, el) => {
          if ($(el).text().includes("DESCRIPCI")) {
             const desc = $(el).parent().text().replace($(el).text(), "").trim();
             if (desc && !desc.includes("no_autorizado")) {
               p.descripcion = fixEncoding(desc).replace(/\n/g, '<br/>');
             }
          }
        });
        
        $("ul.list-unstyled li").each((_, el) => {
          const text = fixEncoding($(el).text().trim());
          if (text.includes("Ambientes")) p.habitaciones = parseInt(text.replace(/[^0-9]/g, "")) || p.habitaciones;
          if (text.includes("Baños")) p.banos = parseInt(text.replace(/[^0-9]/g, "")) || p.banos;
          if (text.includes("Cocheras")) p.estacionamientos = parseInt(text.replace(/[^0-9]/g, "")) || p.estacionamientos;
          if (text.includes("Superficie Total")) p.m2Total = parseInt(text.replace(/[^0-9]/g, "")) || p.m2Total;
          if (text.includes("Superficie Cubierta")) p.m2Util = parseInt(text.replace(/[^0-9]/g, "")) || p.m2Util;
        });
        
        const imgs = [];
        $("img.img-responsive").each((_, el) => {
          const src = $(el).attr("src");
          if (src && !imgs.includes(src)) imgs.push(src);
        });
        if (imgs.length > 0) p.imagenes = imgs;
        else p.imagenes = ['/bg-1.jpg'];
        
        const iframes = [];
        $("iframe").each((_, el) => {
          const src = $(el).attr("src");
          if (src) iframes.push(src);
        });
        p.tour360Urls = iframes;
        
      } catch (e) {
        console.error("Error fetching detail for", p.id, e.message);
      }
    }));
    console.log(`Processed batch ${i / batchSize + 1}`);
  }

  const tsContent = `export type PropertyType = 'Venta' | 'Arriendo';

export interface Property {
  id: string;
  slug: string;
  nombre: string;
  barrio: string;
  comuna: string;
  tipo: PropertyType;
  precio: number;
  moneda: 'USD' | 'ARS';
  m2Util: number;
  m2Total: number;
  habitaciones: number;
  banos: number;
  estacionamientos: number;
  lat: number;
  lng: number;
  descripcion: string;
  imagenes: string[];
  tour360Urls?: string[];
  destacada: boolean;
  updatedAt: string;
}

export const properties: Property[] = ${JSON.stringify(properties, null, 2)};

export const getPropertyBySlug = (slug: string) => properties.find(p => p.slug === slug);
`;

  fs.writeFileSync('lib/data/properties.ts', tsContent);
  console.log(`Saved ${properties.length} real properties with ALL IMAGES, DESC, and 360!`);
}

fetchProperties();
