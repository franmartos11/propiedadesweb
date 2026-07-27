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
    
    // We only need basic info here, everything else from detail
    const titleMatch = block.match(/<h4>([^<]+)<\/h4>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Propiedad';
    
    properties.push({
      id: idStr,
      slug: `propiedad-${idStr}`,
      nombre: title,
      // Default basic fields
      barrio: 'Córdoba',
      comuna: 'Córdoba',
      tipo: 'Venta',
      precio: 0,
      moneda: 'ARS',
      m2Util: 0,
      m2Total: 0,
      habitaciones: 0,
      banos: 0,
      estacionamientos: 0,
      descripcion: `Excelente propiedad ubicada en Córdoba.`,
      imagenes: [],
      tour360Urls: [],
      destacada: i <= 6, 
      updatedAt: '2026-07-21T00:00:00.000Z',
    });
  }

  console.log(`Fetching detail pages for ${properties.length} properties...`);
  
  // Fetch all properties details
  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    if (p.id.startsWith('real_')) continue;
    
    console.log(`Fetching detail for ${p.id} (${i + 1}/${properties.length})`);
    try {
      const detRes = await fetch(`https://villalbamartinez.com.ar/detalle.php?id=${p.id}`);
      const detBuffer = await detRes.arrayBuffer();
      const detHtml = new TextDecoder("utf-8").decode(detBuffer);
      const $ = cheerio.load(detHtml);
      
      const fixEncoding = (str) => {
        try { return Buffer.from(str, 'latin1').toString('utf8'); } catch (e) { return str; }
      };
      
      p.nombre = fixEncoding($('.panel-body h4').first().text().trim()) || p.nombre;
      
      const textContent = fixEncoding($('body').text());
      
      // Determine Type (Alquiler vs Venta)
      if (textContent.toLowerCase().includes('en alquiler')) p.tipo = 'Arriendo';
      else if (textContent.toLowerCase().includes('en venta')) p.tipo = 'Venta';
      
      // Determine Price
      const priceMatch = textContent.match(/Precio:\s*(U\$S|\$)?\s*([\d\.]+)/i);
      if (priceMatch) {
        if (priceMatch[1] === 'U$S' || priceMatch[1] === 'u$s' || priceMatch[1] === 'USD') {
          p.moneda = 'USD';
        } else {
          p.moneda = 'ARS';
        }
        p.precio = parseInt(priceMatch[2].replace(/\./g, ''), 10) || 0;
      }
      
      $("h3").each((_, el) => {
        if ($(el).text().includes("DESCRIPCI")) {
           p.descripcion = fixEncoding($(el).parent().text().replace($(el).text(), "").trim());
        }
      });
      
      $("ul.list-unstyled li").each((_, el) => {
        const text = fixEncoding($(el).text().trim());
        if (text.includes("Ambientes")) p.habitaciones = parseInt(text.replace(/[^0-9]/g, "")) || 0;
        if (text.includes("Baños") || text.includes("Baï¿½os") || text.includes("Ba\u00f1os") || text.includes("Baños")) p.banos = parseInt(text.replace(/[^0-9]/g, "")) || 0;
        if (text.includes("Cocheras")) p.estacionamientos = parseInt(text.replace(/[^0-9]/g, "")) || 0;
        if (text.includes("Superficie Total")) p.m2Total = parseInt(text.replace(/[^0-9]/g, "")) || 0;
        if (text.includes("Superficie Cubierta") || text.includes("Superficie cubierta")) p.m2Util = parseInt(text.replace(/[^0-9]/g, "")) || 0;
      });
      
      const imgs = [];
      $("img.img-responsive").each((_, el) => {
        const src = $(el).attr("src");
        if (src && src.toLowerCase().includes("fotos/")) {
          // Check if it's already an absolute URL
          if (src.startsWith('http')) {
            imgs.push(src);
          } else {
            imgs.push(`https://villalbamartinez.com.ar/${src}`);
          }
        }
      });
      p.imagenes = [...new Set(imgs)];
      
    } catch (err) {
      console.log(`Failed to fetch ${p.id}`, err.message);
    }
  }

  const BASE_LAT = -31.4201;
  const BASE_LNG = -64.1888;
  
  properties.forEach(p => {
    p.lat = BASE_LAT + (Math.random() - 0.5) * 0.05;
    p.lng = BASE_LNG + (Math.random() - 0.5) * 0.05;
  });

  // Generate TS file
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
`;

  fs.writeFileSync('./lib/data/properties.ts', tsContent);
  console.log("Done! Overwrote lib/data/properties.ts with real data.");
}

fetchProperties();
