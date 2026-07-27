import * as cheerio from 'cheerio';

async function fetchProperties() {
  console.log("Fetching property list...");
  const res = await fetch('https://villalbamartinez.com.ar/Php/api.inmuebles.php', {
    method: 'POST',
    body: 'o=-1&t=-1&d=-1&l=-1&b=-1',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  const html = await res.text();
  const blocks = html.split('<div class="col-md-4"');
  
  for (let i = 1; i <= 3; i++) {
    const block = blocks[i];
    const linkMatch = block.match(/href="detalle\.php\?id=([^"]+)"/);
    const idStr = linkMatch ? linkMatch[1] : null;
    if (!idStr) continue;
    
    console.log(`\n--- Fetching detail for ${idStr} ---`);
    const detRes = await fetch(`https://villalbamartinez.com.ar/detalle.php?id=${idStr}`);
    const detBuffer = await detRes.arrayBuffer();
    const detHtml = new TextDecoder("utf-8").decode(detBuffer);
    const $ = cheerio.load(detHtml);
    
    const fixEncoding = (str) => {
      try { return Buffer.from(str, 'latin1').toString('utf8'); } catch (e) { return str; }
    };
    
    const title = fixEncoding($('.panel-body h4').first().text().trim());
    const priceDivs = [];
    $('div').each((_, el) => {
      const text = $(el).text();
      if (text.includes('Alquiler') || text.includes('Venta')) {
        priceDivs.push(fixEncoding(text.trim()));
      }
    });
    
    console.log("Title:", title);
    console.log("Price candidates:", priceDivs.slice(0, 3));
    
    // specifically look at the red ribbon or price tag
    const priceText = fixEncoding($('div[style*="rgba(255,1,4,0.70)"]').text());
    console.log("Extracted Price Text:", priceText);
    
    // Also look for other h4 or specific styling
    const h4s = [];
    $('h4').each((_, el) => h4s.push(fixEncoding($(el).text().trim())));
    console.log("All h4s:", h4s);
  }
}

fetchProperties();
